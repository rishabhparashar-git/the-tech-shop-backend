const express = require("express");
const router = express.Router();
const Product = require('../models/product')
const {getProduct, getAllProducts, updateProduct, deleteProduct, addProduct} = require("../services/product")
// Getting all
router.get('/',getAllProducts)

// Getting one
router.get('/:id',getProduct)

// Creating one
router.post('/',addProduct)

// Updating one
router.patch('/:id', updateProduct)

// Deleting one
router.delete('/:id',deleteProduct)

module.exports = router;
