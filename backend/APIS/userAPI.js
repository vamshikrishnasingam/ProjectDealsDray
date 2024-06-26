const exp = require("express");
const userApp = exp.Router();

require("dotenv").config();

const expressAsyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");
let bcryptjs = require("bcryptjs");

//body parser
userApp.use(exp.json());

const verifyToken = require("./middlewares/verifyToken");

//create user
userApp.post(
  "/user-signup",
  expressAsyncHandler(async (req, res) => {
    //get user collection object
    const userCollectionObj = req.app.get("userCollectionObj");
    //get new user from request
    const newUser = req.body;
    // convert username to lowercase
    newUser.username = newUser.username.toLowerCase();
    //check for duplicate user by username
    let userOfDB = await userCollectionObj.findOne({
      username: newUser.username,
    });
    //if user already exist, send response to client "User already existed"
    if (userOfDB != null) {
      res.status(200).send({ message: "User Already Existed" });
    }
    //if user not existed
    else {
      //hash the password
      let hashedPassword = await bcryptjs.hash(newUser.password, 5);
      //replace plain password
      newUser.password = hashedPassword;
      // Convert email to lowercase before inserting the user
      newUser.email = newUser.email.toLowerCase();
      //insert user
      await userCollectionObj.insertOne(newUser);
      //send res
      res.status(201).send({ message: "User Created" });
    }
  })
);

//User Login
userApp.post(
  "/user-login",
  expressAsyncHandler(async (req, res) => {
    //get user collection object
    const userCollectionObj = req.app.get("userCollectionObj");
    //get user credentials
    const userCredObj = req.body;
    // convert username to lowercase
    userCredObj.username = userCredObj.username.toLowerCase();
    //verify username
    let userOfDB = await userCollectionObj.findOne({
      username: userCredObj.username,
    });
    //if username is invalid
    if (userOfDB === null) {
      res.status(200).send({ message: "Invalid Username" });
    }
    //if username is valid
    else {
      //hash password and compare with password in DB to verify password
      let isEqual = await bcryptjs.compare(
        userCredObj.password,
        userOfDB.password
      );
      //if passwords are not matched
      if (isEqual === false) {
        res.status(200).send({ message: "Invalid Password" });
      }
      //if password matched
      else {
        let jwtToken = jwt.sign({ username: userOfDB.username }, "abcdef", {
          expiresIn: "30m",
        });
        //delete password from user of db
        delete userOfDB.password;
        //send token in response
        res
          .status(200)
          .send({ message: "success", token: jwtToken, user: userOfDB });
      }
    }
  })
);

//get userslist
userApp.get(
  "/get-users",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    //get user collection object
    const userCollectionObj = req.app.get("userCollectionObj");
    //get users from db

    await userCollectionObj
      .find({}, { projection: { password: 0 } })
      .toArray()
      .then((userList) => {
        res.status(200).send({ message: "UserList", payload: userList });
      })
      .catch((err) => {
        console.log("Error in Retriving UserList", err);
        res.send({ message: "Error", errMessage: err.message });
      });
  })
);

// receive verify token request directly andd check
userApp.post("/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

//get userinfo for page refresh
userApp.get(
  "/get-user-info",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    // You can access the user information from the request object (req.user)
    //   const user = req.user;

    //get user collection
    const userCollectionObj = req.app.get("userCollectionObj");
    //fetch user
    const user = await userCollectionObj.findOne({
      username: req.user.username,
    });
    //remove hash key
    delete user.password;
    delete user._id;
    res.status(200).json({ payload: user });
  })
);

//export express app
module.exports = userApp;
