import { Card } from "@/components/ui/card";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {  updateCartQuantity } from "@/redux/productSlice";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  const dispatch = useDispatch();

  const handleDecrease = (item) => {
    if (item.quantity >1) {
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
    <div className=" pt-50 min-h-screen bg-gray-50 pt-16 px-4 sm:px-10">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            Shopping Cart
          </h1>

          <div className="flex flex-col gap-4">
            {cart.items.map((item) => (
              <Card key={item._id} className="p-4 sm:p-5">
                <div className="flex gap-4 sm:gap-6 items-center">

                  {/* Product Image */}
                  <img
                    src={item.productId?.productImg?.[0]?.url || "/placeholder.png"}
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

                  {/* Quantity + Subtotal */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button className="bg-blue-600 text-white w-10"
                        variant="outline"
                        size="sm"
                        disabled={item.quantity === 1}
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </Button>

                      <span className="px-2 font-semibold">
                        {item.quantity}
                      </span>

                      <Button
                      className="bg-blue-600 text-white w-10"
                        variant="outline"
                        size="sm"
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </Button>
                    </div>

                    <p className="font-light text-sm sm:text-lg mt-2 mr-4">
                    ₹ {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh] text-gray-500">
          Your cart is empty
        </div>
      )}
    </div>
  );
};

export default Cart;
