const Order = require("../models/order");
const Product = require("../models/product");
const OrderedProduct = require("../models/orderedProduct");

async function getOrder(req, res, next) {
  let order;
  try {
    order = await Order.findById(req.params.id);
    if (order == null) {
      res.status(404).json({ message: "Order Not Found" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Server encountered an Error",
      "error-details": err.message,
    });
  }
  res.status(200).json(order);
}

async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch {
    res.status(500).json({ message: "DataBase Error" });
  }
  console.log("*********ALL ORDERS SENT*********");
}

async function addOrder(req, res, next) {
  try {
    const { products, ...newOrderData } = req.body;
    const newOrder = new Order(newOrderData);

    for (let product of products) {
      try {
        const { productId } = product;
        const { price } = await Product.findById(productId).catch((err) =>
          console.log(
            "-----------------Product with id ProductId Not Found-----------------"
          )
        );
        if (!price) return;
        const orderProduct = await OrderedProduct.create({
          productId,
          quantity: product.quantity || 1,
          discountPercent: product.discountPercent || 0,
          price,
        })
          .then((resp) => {
            console.log(resp, "Ordered Product Added");
            return resp;
          })
          .catch((err) => {
            res.status(500).json({
              message: "Error in AddingProduct to ordered Products",
              errMsg: err.message,
            });
          });
        newOrder.orderedProducts.push(orderProduct._id);
      } catch (err) {
        res
          .status(500)
          .json({ message: "Error in fetching Product", detailedError: err });
      }
    }
    const addedOrder = await newOrder.save().then((resp) => {
      console.log("OrderPlaced");
      return resp;
    });
    res.status(200).json({
      message: "Ordered Successfully",
      createdUserID: addedOrder._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateOrder(req, res, next) {
  const prodId = req.params.id;
  let order;
  try {
    order = await Order.findById(prodId);
    if (order == null) {
      res.status(404).json({ message: "Order Not Found" });
    } else {
      const updatedInfo = req.body;
      console.log(updatedInfo);
      await order.updateOne(updatedInfo);
      res
        .status(200)
        .json({ message: "Order Updated Successfully", data: updatedInfo });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server encountered an error", details: err.message });
  }
}

async function deleteOrder(req, res, next) {
  console.log("delete req for " + req.params.id + " received successfully");
  const prodId = req.params.id;
  let order;
  try {
    order = await Order.findById(prodId);
    if (order == null) {
      res.status(404).json({ message: "Order Not Found" });
    } else {
      const deletionResponse = await order.remove();
      res.status(200).json({
        message: "Order Removed Successfully",
        data: deletionResponse,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server encountered an error" });
  }
}

module.exports = {
  getOrder,
  getAllOrders,
  addOrder,
  updateOrder,
  deleteOrder,
};
