import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BASE_URL;
const accessToken = localStorage.getItem("accessToken");

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${baseUrl}/order/getorder`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setOrders(res.data.order);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
   
  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.put(
        `${baseUrl}/order/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchOrders(); // refresh orders
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <h2 className="text-2xl font-semibold">No Orders Found</h2>
        <p className="mt-2">You haven’t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-20 px-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4">My Orders</h1>

      {orders.map((order) => (
        <Card key={order._id}>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg">
              Order #{order._id.slice(-6)}
            </CardTitle>

            <Badge
              variant={
                order.orderStatus === "delivered"
                  ? "success"
                  : order.orderStatus === "cancelled"
                  ? "destructive"
                  : "outline"
              }
            >
              {order.orderStatus.toUpperCase()}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Items */}
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 border-b pb-3"
              >
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>

                <p className="font-semibold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}

            {/* Summary */}
            <div className="flex justify-between font-semibold pt-2">
              <span>Total</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>

            {/* Actions */}
            {order.orderStatus === "placed" && (
              <Button
                variant="destructive"
                onClick={() => cancelOrder(order._id)}
              >
                Cancel Order
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyOrders;
