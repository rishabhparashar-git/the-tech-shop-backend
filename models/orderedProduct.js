const Product = require("./product");
const mongoose = require("mongoose");

const orderedProductSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Placed", "Accepted", "Preparing", "Dispatched", "Delivered"],
    default: "Placed",
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercent: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("OrderedProduct", orderedProductSchema);
