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
    const products = await Product.find().populate("userId", "name email");

    if (!products) {
      return res.status(404).json({
        success: false,
        message: "No products found",
        products: [],
      });
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id:productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // delete images from cloudinary
    for (let img of product.productImg) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {id: productId } = req.params;
    const {
      productName,
      description,
      productPrice,
      category,
      brand,
      existingImages, // ✅ FIX 1
    } = req.body;

    const product = await Product.findById(productId);



    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let updatedImages = [];

    // ✅ Handle existing images safely
    if (existingImages) {
      let keepIds = [];

      try {
        keepIds = JSON.parse(existingImages);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid existingImages format",
        });
      }

      // keep selected images
      updatedImages = product.productImg.filter(img =>
        keepIds.includes(img.public_id)
      );

      // removed images
      const removedImages = product.productImg.filter(
        img => !keepIds.includes(img.public_id)
      );

      // delete removed images from cloudinary
      for (const img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updatedImages = product.productImg;
    }

    // ✅ Upload new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "products",
        });

        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // ✅ Update fields (fallback to old values)
    product.productName = productName ?? product.productName;
    product.description = description ?? product.description;
    product.productImg = updatedImages;
    product.productPrice = productPrice ?? product.productPrice;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  addProduct,
  getAllProducts,
  deleteProduct,
    updateProduct
};
