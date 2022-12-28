const Product = require('../models/product')

async function  getProduct (req,res,next){
    let product
    try{
        product = await Product.findById(req.params.id)
        if (product==null){
            res.status(404).json({message:"Product Not Found"})
        }
    }catch(err){
        res.status(500).json({message:"Server encountered an Error", "error-details":err.message})
    }
    res.status(200).json(product)
}

async function getAllProducts(req,res,next){
    try{
        const products = await Product.find()
        res.status(200).json(products)
    }catch{
        res.status(500).json({message:"DataBase Error"})
    }
}

async function addProduct(req,res,next){
    try{
        const newProduct  = new Product(req.body)
        const addedProduct = await newProduct.save()
        res.status(200).json({message:"Product Added Successfully",createdUserID: addedProduct._id})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

async function updateProduct(req,res,next){
    const prodId = req.params.id
    let product
    try{
        product = await Product.findById(prodId)
        if(product==null){
            res.status(404).json({message:"Product Not Found"})
        }else{
            const updatedInfo = req.body 
            for(let key in updatedInfo){
                product[key]=updatedInfo[key]
            }
            const updatedUser = await product.save();
            res.status(200).json({message:"Product Updated Successfully",data:updatedUser})
        } 
    }catch(err){
        res.status(500).json({message:"Server encountered an error"})
    }
}

async function deleteProduct(req,res,next){
    const prodId = req.params.id
    let product
    try{
        product = await Product.findById(prodId)
        if(product==null){
            res.status(404).json({message:"Product Not Found"})
        }else{
            const deletionResponse = await product.remove()
            res.status(200).json({message:"Product Removed Successfully",data:deletionResponse})
        }
    }catch(err){
        res.status(500).json({message:"Server encountered an error"})
    }
}

module.exports = {
    getProduct,
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct
}