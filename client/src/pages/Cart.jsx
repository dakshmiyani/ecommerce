import { Card } from "@/components/ui/card";
import React from "react";
import { useSelector } from "react-redux";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);

  return (
    <div className="pt-50 min-h-screen bg-gray-50 pt-16 px-4 sm:px-10">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            Shopping Cart
          </h1>

          <div className="flex flex-col gap-4">
            {cart.items.map((item) => (
              <Card key={item._id} className="p-4 sm:p-5">
  <div className="flex flex-row sm:flex-row gap-4 sm:gap-6 items-center">

    {/* Product Image (small on mobile) */}
    <img
      src={item.productId?.productImg?.[0]?.url || "/placeholder.png"}
      alt={item.productId?.productName || "Product"}
      className="
        w-20 h-20 
        sm:w-24 sm:h-24 
        object-cover rounded
      "
    />

    {/* Product Details */}
    <div className="flex-1">
      <h3 className="font-semibold text-sm sm:text-lg leading-snug">
        {item.productId?.productName}
      </h3>

      <p className="text-xs sm:text-sm text-gray-600 mt-1">
        Price: ₹ {item.price}
      </p>

      <p className="text-xs sm:text-sm text-gray-600">
        Qty: {item.quantity}
      </p>
    </div>

    {/* Subtotal */}
    <div className="text-right">
      <p className="text-xs sm:hidden text-gray-500">Subtotal</p>
      <p className="font-bold text-sm sm:text-lg">
        ₹ {item.price * item.quantity}
      </p>
    </div>
  </div>
</Card>

            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh] text-gray-500 text-sm sm:text-base">
          Your cart is empty
        </div>
      )}
    </div>
  );
};

export default Cart;
