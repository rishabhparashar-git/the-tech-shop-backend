const Product = require("./product");
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    orderedBy: {
      type: String,
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    paymentDetails: {
      paymentMethod: {
        type: String,
        enum: ["Debit Card", "Credit Card", "Cash On Delivery"],
        default: "Debit Card",
        required: true,
      },
      paymentTotal: {
        type: Number,
        required: true,
      },
    },
    orderedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: Product }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
