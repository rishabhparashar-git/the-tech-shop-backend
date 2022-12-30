const express = require("express");
const router = express.Router();
const {
  getOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  addOrder,
} = require("../services/order");

// Getting all
router.get(
  "/",
  (req, res, next) => {
    console.log("********Fetch All order Route********");
    next();
  },
  getAllOrders
);

// Getting one
router.get("/:id", getOrder);

// Creating one
router.post(
  "/",
  (req, res, next) => {
    console.log("********Add order Route********");
    next();
  },
  addOrder
);

// Updating one
router.patch(
  "/:id",
  (req, res, next) => {
    console.log("********Update order Route********");
    next();
  },
  updateOrder
);

// Deleting one
router.delete("/:id", deleteOrder);

module.exports = router;
