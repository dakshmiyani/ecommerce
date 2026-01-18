import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { X } from "lucide-react";

const baseUrl = import.meta.env.VITE_BASE_URL;
const accessToken = localStorage.getItem("accessToken");

/* ---------------- STATUS COLOR HELPER ---------------- */
const getStatusBadgeClass = (status) => {
  switch (status) {
    case "placed":
      return "bg-yellow-100 text-yellow-700";
    case "shipped":
      return "bg-blue-100 text-blue-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* ---------------- FETCH ORDERS ---------------- */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/order/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------- UPDATE ORDER STATUS ---------------- */
  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.put(
        `${baseUrl}/order/delivery-status/${orderId}`,
        { orderStatus: status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Order status updated");
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Admin Orders</h1>

      {/* ---------------- ORDERS TABLE ---------------- */}
      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">User</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Items</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="p-3 border text-sm">
                    #{order._id.slice(-6)}
                  </td>

                  <td className="p-3 border text-sm">
                    {order.userId}
                  </td>

                  <td className="p-3 border text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 border text-sm">
                    {order.items.length}
                  </td>

                  <td className="p-3 border text-sm font-semibold">
                    ₹{order.totalAmount}
                  </td>

                  <td className="p-3 border text-sm">
                    <span className="px-2 py-1 rounded bg-gray-200">
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="p-3 border text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td
                    className="p-3 border"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                    >
                      <option value="placed">Placed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- ORDER DETAILS MODAL ---------------- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg p-6 relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setSelectedOrder(null)}
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Order #{selectedOrder._id}
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <b>Status:</b>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeClass(
                    selectedOrder.orderStatus
                  )}`}
                >
                  {selectedOrder.orderStatus}
                </span>
              </p>

              <p><b>Payment:</b> {selectedOrder.paymentStatus}</p>
              <p><b>Total:</b> ₹{selectedOrder.totalAmount}</p>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p>
                  {selectedOrder.shippingAddress.firstName}{" "}
                  {selectedOrder.shippingAddress.lastName}
                </p>
                <p>{selectedOrder.shippingAddress.addressLine}</p>
                <p>
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state} -{" "}
                  {selectedOrder.shippingAddress.zipcode}
                </p>
                <p>Phone: {selectedOrder.shippingAddress.phone}</p>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Items</h3>
                <ul className="list-disc ml-5">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity} — ₹{item.price}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
