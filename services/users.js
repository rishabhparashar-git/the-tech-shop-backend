const jwt = require("jsonwebtoken");
let TOKEN_HEADER_KEY = process.env.TOKEN_HEADER_KEY;
let JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
let JWT_EXPIRY = process.env.JWT_EXPIRY;
const { passwordEncryptor, passwordValidator } = require("../helpers/users");
const User = require("../models/user");
const {
  userRegistrationValidator,
  userLoginValidator,
} = require("../validators/users");

exports.register = async (req, res) => {
  console.log("Registering right now");
  console.log(res.password);
  const { role, repeatPassword, ...userInfo } = req.body;
  try {
    const { error } = userRegistrationValidator.validate({
      ...userInfo,
      repeatPassword,
    });
    if (error) {
      res
        .status(400)
        .json({ message: "User data validation failed", error: error.message });
    }
  } catch (err) {
    res.status(400).json({
      message: "error in validating the user inputs",
      detail: err.message,
    });
  }
  console.log(role, repeatPassword, userInfo);
  try {
    userInfo.password = await passwordEncryptor(userInfo.password);
    const user = new User({ ...userInfo, role: role || "User" });
    console.log(user);
    const newUser = await user.save();
    res.status(200).json({ message: "User Successfully added", newUser });
  } catch (err) {
    res.status(500).json({ message: "New User cannot be created", err });
  }
};

exports.login = async (req, res) => {
  const credentials = req.body;
  try {
    const { error } = userLoginValidator.validate(credentials);
    if (error) {
      res
        .status(400)
        .json({ message: "User data validation failed", error: error.message });
    }
  } catch (err) {
    res.status(400).json({
      message: "error in validating the user inputs",
      detail: err.message,
    });
  }
  const foundUser = await User.findOne({
    username: credentials.username,
  }).catch((err) => {
    res.status(404).json({ message: "User Info Not Found", details: err });
  });
  if (foundUser) {
    const userValidated = await passwordValidator(
      credentials.password,
      foundUser.password
    );
    if (userValidated) {
      res.status(200).json({
        message: "User Found Successfully",
        userData: { name: foundUser.name, role: foundUser.userName },
        dataSent: credentials,
      });
    } else {
      res.status(403).json({
        message: "Incorrect Password",
        dataSent: credentials,
      });
    }
  } else {
    res.status(404).json({ message: "user not found" });
  }
};

exports.jwtAuth = async (req, res) => {
  // Validate User Here
  // Then generate JWT Token

  const credentials = req.body;
  try {
    const { error } = userLoginValidator.validate(credentials);
    if (error) {
      res
        .status(400)
        .json({ message: "User data validation failed", error: error.message });
    }
  } catch (err) {
    res.status(400).json({
      message: "error in validating the user inputs",
      detail: err.message,
    });
  }
  const foundUser = await User.findOne({
    username: credentials.username,
  }).catch((err) => {
    res.status(404).json({ message: "User Info Not Found", details: err });
  });
  if (foundUser) {
    const userValidated = await passwordValidator(
      credentials.password,
      foundUser.password
    );
    if (userValidated) {
      let data = {
        username: foundUser.username,
      };
      console.log(JWT_EXPIRY);
      const token = jwt.sign(data, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRY });

      res.status(200).json({
        message: "User Found Successfully",
        token,
      });
    } else {
      res.status(403).json({
        message: "Incorrect Password",
        dataSent: credentials,
      });
    }
  } else {
    res.status(404).json({ message: "user not found" });
  }
};

exports.jwtValidate = (req, res) => {
  // Tokens are generally passed in the header of the request
  // Due to security reasons.

  const token = req.headers.authorization;

  try {
    const verified = jwt.verify(token, JWT_SECRET_KEY); // returns iat(issued at) and exp(expiry) in sec to get date obj convert into ms
    // .catch((err) => {
    //   console.log("=================inside error block=====================");
    //   return res
    //     .status(403)
    //     .json({ message: "User not Validated", error: err });
    // });
    if (verified) {
      return res.json({
        message: "Successfully Verified",
        dataReturned: verified,
      });
    } else {
      // Access Denied
      return res.status(401).send(error);
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
};
