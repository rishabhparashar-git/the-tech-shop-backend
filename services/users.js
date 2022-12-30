const User = require("../models/user");
const {
  userRegistrationValidator,
  userLoginValidator,
} = require("../validators/users");

exports.register = async (req, res) => {
  console.log("Registering right now");
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
    if (foundUser.password === credentials.password) {
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
