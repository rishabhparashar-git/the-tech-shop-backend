const express = require("express");
const { register, login, jwtValidate, jwtAuth } = require("../services/users");
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/jwtAuth", jwtAuth);
router.get("/jwtValidate/:token", jwtValidate);

module.exports = router;
