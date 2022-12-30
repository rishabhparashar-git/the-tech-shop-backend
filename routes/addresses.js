const express = require("express");
const router = express.Router();
const {
  getAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress,
  addAddress,
} = require("../services/address");
// Getting all
router.get("/", getAllAddresses);

// Getting one
router.get("/:id", getAddress);

// Creating one
router.post("/", addAddress);

// Updating one
router.patch("/:id", updateAddress);

// Deleting one
router.delete("/:id", deleteAddress);

module.exports = router;
