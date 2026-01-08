import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

import { Link } from "react-router-dom";
import { updateCartQuantity, removeCartItem } from "@/redux/productSlice";


const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  const dispatch = useDispatch();

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : subtotal * 0.1;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
const handleRemove = (item) => {
  dispatch(removeCartItem(item.productId._id));
};


  
  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateCartQuantity({
          productId: item.productId._id,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  const handleIncrease = (item) => {
    dispatch(
      updateCartQuantity({
        productId: item.productId._id,
        quantity: item.quantity + 1,
      })
    );
  };

  return (
    <div className="pt-50 min-h-screen bg-gray-50 pt-16 px-4 sm:px-10">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            Shopping Cart
          </h1>

          {/* MAIN LAYOUT */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* LEFT — CART ITEMS */}
            <div className="flex flex-col gap-4 w-full lg:w-2/3">
              {cart.items.map((item) => (
                <Card key={item._id} className="p-4 sm:p-5">
                  <div className="flex gap-4 sm:gap-6 items-center">

                    {/* Product Image */}
                    <img
                      src={
                        item.productId?.productImg?.[0]?.url ||
                        "/placeholder.png"
                      }
                      alt={item.productId?.productName || "Product"}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm sm:text-lg">
                        {item.productId?.productName}
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-2">
                        {item.productId?.description}
                      </p>

                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Price: ₹ {item.price}
                      </p>
                    </div>

                    {/* Quantity + Price */}
                    <div className="flex gap-6 text-right items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 text-white w-8 h-8"
                          disabled={item.quantity === 1}
                          onClick={() => handleDecrease(item)}
                        >
                          -
                        </Button>

                        <span className="px-2 font-semibold">
                          {item.quantity}
                        </span>

                        <Button
                          size="sm"
                          className="bg-blue-600 text-white w-8 h-8"
                          onClick={() => handleIncrease(item)}
                        >
                          +
                        </Button>
                      </div>

                      <div className="flex flex-col items-center">
                        <p className="font-light text-sm sm:text-lg">
                          ₹ {item.price * item.quantity}
                        </p>

                        
                      </div>
                      <p   onClick={() => handleRemove(item)} className="flex items-center gap-1 text-red-400 text-sm hover:text-red-600">
                          <Trash2 size={16} />
                          Remove
                        </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* RIGHT — ORDER SUMMARY */}
            <div className="w-full lg:w-1/3">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping Cost</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className=" space-y-3 pt-4">
                    <div className="flex space-x-2">
                    <Input className="flex justify-start mr-4 w-full" placeholder="Enter a Promo code"></Input>
                    <Button className="flex justify-end bg-blue-600 text-white" variant="outline" >Apply</Button>
                  </div>
                  <Button className="w-full bg-blue-600 text-white cursor-pointer" variant="outline">Place Order</Button>
                    <Link to="/products"> <Button variant="outline" className="w-full bg-transparent">
                 Continue Shopping</Button></Link>
                  </div>
                  <div className="text-sm text-muted-foreground pt-4">
                    <p>* Free shipping on orders over ₹299</p>
                    <p>* 7 days return policy</p>
                    <p>* Secure checkout with SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
            ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500 px-4">
          {/* Cart Icon */}
          <div className="flex items-center justify-center bg-gray-100 rounded-full w-24 h-24 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-9v9"
              />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
            Your Cart is Empty
          </h2>

          <p className="mt-2 text-sm text-gray-500 max-w-xs">
            Looks like you haven’t added any products yet.
            Start browsing and add items to your cart!
          </p>

          <button
            onClick={() => window.location.assign("/products")}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Browse Products
          </button>
        </div>
      )}
    </div>   
  );
}



export default Cart;
