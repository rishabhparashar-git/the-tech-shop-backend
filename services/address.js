const Address = require("../models/address");

async function getAddress(req, res, next) {
  let address;
  try {
    address = await Address.findById(req.params.id);
    if (address == null) {
      res.status(404).json({ message: "Address Not Found" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Server encountered an Error",
      "error-details": err.message,
    });
  }
  res.status(200).json(address);
}

async function getAllAddresses(req, res, next) {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch {
    res.status(500).json({ message: "DataBase Error" });
  }
}

async function addAddress(req, res, next) {
  try {
    const newAddress = new Address(req.body);
    const addedAddress = await newAddress.save();
    res.status(200).json({
      message: "Address Added Successfully",
      createdUserID: addedAddress._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateAddress(req, res, next) {
  const prodId = req.params.id;
  let address;
  try {
    address = await Address.findById(prodId);
    if (address == null) {
      res.status(404).json({ message: "Address Not Found" });
    } else {
      const updatedInfo = req.body;
      for (let key in updatedInfo) {
        address[key] = updatedInfo[key];
      }
      const updatedUser = await address.save();
      res
        .status(200)
        .json({ message: "Address Updated Successfully", data: updatedUser });
    }
  } catch (err) {
    res.status(500).json({ message: "Server encountered an error" });
  }
}

async function deleteAddress(req, res, next) {
  const prodId = req.params.id;
  let address;
  try {
    address = await Address.findById(prodId);
    if (address == null) {
      res.status(404).json({ message: "Address Not Found" });
    } else {
      const deletionResponse = await address.remove();
      res.status(200).json({
        message: "Address Removed Successfully",
        data: deletionResponse,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server encountered an error" });
  }
}

module.exports = {
  getAddress,
  getAllAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
