import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { setProducts } from "@/redux/productSlice";
import { Button } from "@/components/ui/button";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products } = useSelector((store) => store.product);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const accessToken = localStorage.getItem("accessToken");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/products/all-products`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${baseUrl}/products/delete-product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product deleted");
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <Button
          onClick={() => navigate("/admin/add-product")}
          className="bg-black text-white hover:bg-gray-900"
        >
          + Add Product
        </Button>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <div className="text-gray-500 text-center mt-20">
          No products found
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-lg">
          <table className="w-full border-collapse">
            {/* TABLE HEADER */}
            <thead className="bg-gray-100 text-left">
              <tr className="text-sm text-gray-600">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* PRODUCT */}
                  <td className="p-4 flex items-center gap-4">
                    <img
                      src={product.productImg?.[0]?.url || "/placeholder.png"}
                      alt={product.productName}
                      className="w-12 h-12 rounded object-cover border"
                    />
                    <span className="font-medium">
                      {product.productName}
                    </span>
                  </td>

                  {/* CATEGORY */}
                  <td className="p-4 capitalize text-gray-700">
                    {product.category}
                  </td>

                  {/* BRAND */}
                  <td className="p-4 capitalize text-gray-700">
                    {product.brand}
                  </td>

                  {/* PRICE */}
                  <td className="p-4 font-semibold">
                    ₹{product.productPrice}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(`/admin/update-product/${product._id}`)
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
