const Joi = require("joi");

const userRegistrationValidator = Joi.object({
  name: Joi.string().min(2),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).max(20),
  repeatPassword: Joi.ref("password"),
});

const userLoginValidator = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).max(20),
});

module.exports = { userRegistrationValidator, userLoginValidator };
