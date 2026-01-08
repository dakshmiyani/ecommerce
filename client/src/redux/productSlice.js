import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: {
      items: [],
      totalPrice: 0,
    },
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    setCart: (state, action) => {
      state.cart = action.payload;
    },

    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      const item = state.cart.items.find(
        (i) => i.productId._id === productId
      );

      if (item) {
        item.quantity = quantity;
      }

      state.cart.totalPrice = state.cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    // ✅ REMOVE ITEM
    removeCartItem: (state, action) => {
      const productId = action.payload;

      state.cart.items = state.cart.items.filter(
        (item) => item.productId._id !== productId
      );

      state.cart.totalPrice = state.cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },
});

export const {
  setProducts,
  setCart,
  updateCartQuantity,
  removeCartItem,
} = productSlice.actions;

export default productSlice.reducer;
