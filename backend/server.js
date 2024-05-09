const exp = require("express");

const app = exp();

app.use(exp.json());

require("dotenv").config();
//assign port numnrt
const port = process.env.PORT || 1729;
app.listen(port, () => console.log("server listening on port 1729..."));
const path = require("path");

//connect react build
app.use(exp.static(path.join(__dirname, "../frontend/build")));

//for validating CORS policy
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//connect to mongoclient
const mclient = require("mongodb").MongoClient;

mclient
  .connect(
    "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1"
  )
  .then((dbRef) => {
    let dbObj = dbRef.db("EmployeeManagement");
    let userCollectionObj = dbObj.collection("userCollection");
    let employeeCollectionObj = dbObj.collection("employeeCollection");
    let deletedEmployeeCollectionObj = dbObj.collection(
      "deletedEmployeeCollection"
    );

    app.set("userCollectionObj", userCollectionObj);
    app.set("employeeCollectionObj", employeeCollectionObj);
    app.set("deletedEmployeeCollectionObj", deletedEmployeeCollectionObj);
    console.log("Connection to EmployeeManagement-Portal DB - Success");
  })
  .catch((err) =>
    console.log("Connection to EmployeeManagement-Portal DB - Failed")
  );

//connect user api
const userApp = require("./APIS/userAPI");
const employeeApp = require("./APIS/employeeAPI");
//forward request to userApi when url path starts with /user-api
app.use("/user-api", userApp);
//forward request to userApi when url path starts with /employee-api
app.use("/employee-api", employeeApp);

//middleware to deal with page refresh
const pageRefresh = (request, response, next) => {
  response.sendFile(path.join(__dirname, "../frontend/build/index.html"));
};
app.use("*", pageRefresh);

//create a middleware to handle invalid path
const invalidPathHandlingMiddleware = (request, response, next) => {
  response.send({ message: "Invalid path" });
};

app.use(invalidPathHandlingMiddleware);

//create err handling middleware
const errHandler = (error, request, response, next) => {
  response.send({ "error-message": error.message });
};
app.use(errHandler);
