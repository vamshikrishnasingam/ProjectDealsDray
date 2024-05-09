const exp = require("express");
const employeeApp = exp.Router();
require("dotenv").config();

const expressAsyncHandler = require("express-async-handler");

//import multerObj
const multerObj = require("./middlewares/cloudinaryConfig");
//body parser
employeeApp.use(exp.json());

//add employee
employeeApp.post(
  "/add-employee",
  multerObj.single("image"),
  expressAsyncHandler(async (req, res) => {
    //get employeecollection collection
    const employeeCollectionObj = req.app.get("employeeCollectionObj");
    //get user from client
    const newEmployee = JSON.parse(req.body.user);

    newEmployee.email = newEmployee.email.toLowerCase();
    let employeeOfDB = await employeeCollectionObj.findOne({
      email: newEmployee.email,
    });
    //if user already existed
    if (employeeOfDB !== null) {
      res
        .status(200)
        .send({ message: "Employee already existed with emailId" });
    }
    //if user not existed
    else {
      //add CDN link of cloudinary image to user obj
      newEmployee.image = req.file.path;
      const min = 100000;
      const max = 999999;
      newEmployee.ID = Math.floor(Math.random() * (max - min + 1)) + min;
      newEmployee.ID = newEmployee.ID.toString();
      // Convert email to lowercase before inserting the user
      newEmployee.email = newEmployee.email.toLowerCase();
      //insert user
      await employeeCollectionObj.insertOne(newEmployee);
      //send response
      res.status(201).send({ message: "Employee created" });
      console.log("employee created");
    }
  })
);

// Update employee details
employeeApp.put(
  "/update-employee/:email",
  multerObj.single("image"),
  expressAsyncHandler(async (req, res) => {
    // Get employee collection object
    const employeeCollectionObj = req.app.get("employeeCollectionObj");

    const updatedEmployee = JSON.parse(req.body.user);
    //add CDN link of cloudinary image to user obj
    updatedEmployee.image = req.file.path;

    try {
      // Convert email to lowercase
      const email = req.params.email.toLowerCase();

      // Update the employee details in the database
      const result = await employeeCollectionObj.updateOne(
        { email: email },
        { $set: updatedEmployee }
      );

      // Check if any document got updated
      if (result.modifiedCount === 1) {
        // Send success response if update successful
        res
          .status(200)
          .send({ message: "Employee details updated successfully" });
        console.log("Employee details updated successfully");
      } else {
        // Send error response if employee not found
        res.status(404).send({ message: "Employee not found" });
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      // Send error response if any error occurs during update
      res.status(500).send({ message: "Error updating employee details" });
    }
  })
);

//get employee details
employeeApp.get(
  "/get-all-employees",
  expressAsyncHandler(async (req, res) => {
    //get employeecollection collection
    const employeeCollectionObj = req.app.get("employeeCollectionObj");
    const doc = await employeeCollectionObj
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
      });
    res.json(doc);
  })
);

//delete employees
employeeApp.delete(
  "/delete-employee/:emailId",
  expressAsyncHandler(async (req, res) => {
    try {
      // Get employeecollection collection
      const employeeCollectionObj = req.app.get("employeeCollectionObj");
      const deletedEmployeeCollectionObj = req.app.get(
        "deletedEmployeeCollectionObj"
      );

      // Extract emailId from request parameters
      const emailId = req.params.emailId;

      // Find and capture the employee data before deletion
      let employee = await employeeCollectionObj.findOne({ email: emailId });

      // If employee exists, proceed with deletion
      if (employee) {
        // Delete the employee document by emailId
        const result = await employeeCollectionObj.deleteOne({
          email: emailId,
        });

        if (result.deletedCount === 1) {
          // Check if the employee exists in the deletedEmployeeCollection
          let employeeOfDB = await deletedEmployeeCollectionObj.findOne({
            email: emailId,
          });

          // If employee already exists in deletedEmployeeCollection
          if (employeeOfDB) {
            res
              .status(200)
              .send({ message: "Employee already existed with emailId" });
          } else {
            // Insert the employee data into the deletedEmployeeCollection
            await deletedEmployeeCollectionObj.insertOne(employee);
            res.status(201).send({ message: "Employee Inserted" });
            console.log(
              "Employee inserted successfully into deletedEmployeeCollection"
            );
          }
        } else {
          res.status(404).send("Employee not found"); // If employee with given ID not found
        }
      } else {
        res.status(404).send("Employee not found");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).send("Internal Server Error");
    }
  })
);

//get deleted employees
employeeApp.get(
  "/get-deleted-employees",
  expressAsyncHandler(async (req, res) => {
    //get employeecollection collection
    const deletedEmployeeCollectionObj = req.app.get(
      "deletedEmployeeCollectionObj"
    );
    const doc = await deletedEmployeeCollectionObj
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
      });
    res.json(doc);
  })
);

//restore employee
employeeApp.post(
  "/restore-employee/:emailId",
  expressAsyncHandler(async (req, res) => {
    try {
      // Get employeecollection collection
      const employeeCollectionObj = req.app.get("employeeCollectionObj");
      const deletedEmployeeCollectionObj = req.app.get(
        "deletedEmployeeCollectionObj"
      );
      // Extract emailId from request parameters

      const emailId = req.params.emailId;
      // Find and capture the employee data before deletion
      let employeeOfDB = await deletedEmployeeCollectionObj.findOne({
        email: emailId,
      });
      // Find and capture the employee data before deletion
      let employee = await employeeCollectionObj.findOne({
        email: employeeOfDB.email,
      });
      //if user already existed
      if (employee !== null) {
        res
          .status(200)
          .send({ message: "Employee already existed with emailId" });
      }
      //if user not existed
      else {
        // Convert email to lowercase before inserting the user
        employeeOfDB.email = employeeOfDB.email.toLowerCase();
        //insert user
        await employeeCollectionObj.insertOne(employeeOfDB);
        //delete employeeOfDB
        const result = await deletedEmployeeCollectionObj.deleteOne({
          email: emailId,
        });
        //send response
        res.status(201).send({ message: "Employee Restored" });
        console.log("employee created");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).send("Internal Server Error");
    }
  })
);
//export express app
module.exports = employeeApp;
