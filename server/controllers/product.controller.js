const Product = require("../models/product.model");
const { cloudinary } = require("../utils/cloudinary");
const getDataUri = require("../utils/dataUri");

const addProduct = async (req, res) => {
  try {
  
    const { productName, description, productPrice, category, brand } =
      req.body;
    const userId = req.user._id;

    if (!productName || !description || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // handdle multiple images upload
    let productImages = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "products",
        });
        productImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    const newProduct = new Product({
      userId,
      productName,
      description,
      productImg: productImages,
      productPrice,
      category,
      brand,
    });
    
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
    try {

        
        const products = await Product.find().populate('userId', 'name email');
          


        if (!products) {
            return res.status(404).json({
                success: false,
                message: "No products found",
                products: []

            });
        }

            
        res.status(200).json({
            success: true,
            products
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
             error: error.message});
    }
}



module.exports = {
  addProduct,
  getAllProducts
};