const Cart = require("../models/cart.model");
const productModel = require("../models/product.model");




const getCart = async (req, res) => {
  try {

    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId")
    if (!cart) {
      return res.json({
        success: true,
        cart: []
      })
    }
    res.status(200).json({
      success: true,
      cart
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })

  }
}

const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    // 1️⃣ Find product correctly
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2️⃣ Find or create cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalPrice: 0,
      });
    }

    // 3️⃣ Check if product already exists
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        productId,
        quantity: 1,
        price: product.productPrice,
      });
    }

    // 4️⃣ Recalculate total price safely
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    // 5️⃣ Populate product details
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "productName productImg productPrice",
    });

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find((item) => {
      const currentItemId = item.productId?._id ? item.productId._id.toString() : item.productId?.toString();
      return currentItemId === productId.toString();
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (type === "increase") {
      item.quantity += 1;
    }

    if (type === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate("items.productId");

    return res.status(200).json({
      success: true,
      cart: populatedCart,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const removQuantity = async (req, res) => {
  try {
    const userId = req.id;
    // Safely get product ID from params instead of body
    const idToRemove = req.params.productId;
    const idType = req.query.idType === "cartItemId" ? "cartItemId" : "productId";

    if (!idToRemove) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => {
      if (idType === "cartItemId") {
        return item._id.toString() !== idToRemove.toString();
      } else {
        // Safely extract the ID whether it's an ObjectId or a populated object
        const currentItemId = item.productId?._id ? item.productId._id.toString() : item.productId?.toString();
        // If currentItemId is literally undefined/null because the DB product was deleted, 
        // string comparison will fail, so we ensure it's comparable or skip it.
        if (!currentItemId) return true; // Keep the item in the array if we can't extract a product ID (they will have to delete using cartItemId)
        return currentItemId !== idToRemove.toString();
      }
    });

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    console.log(`Removed item (${idType}): ${idToRemove}. new items length: ${cart.items.length}`);

    // ✅ populate before sending
    const populatedCart = await Cart.findById(cart._id)
      .populate("items.productId");

    res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    console.log("Error in removQuantity:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removQuantity
}