import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BASE_URL;
const accessToken = localStorage.getItem("accessToken");

const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [keepImages, setKeepImages] = useState([]);

  const [data, setData] = useState({
    productName: "",
    description: "",
    productPrice: "",
    category: "",
    brand: "",
  });

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${baseUrl}/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.data.success) {
          const p = res.data.product;
          setProduct(p);
          console.log(p);
          setData({
            productName: p.productName,
            description: p.description,
            productPrice: p.productPrice,
            category: p.category,
            brand: p.brand,
          });

          setKeepImages(p.productImg.map((img) => img.public_id));
        }
      } catch (error) {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [productId]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const toggleKeepImage = (publicId) => {
    setKeepImages((prev) =>
      prev.includes(publicId)
        ? prev.filter((id) => id !== publicId)
        : [...prev, publicId]
    );
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );

      formData.append("existingImages", JSON.stringify(keepImages));
      images.forEach((img) => formData.append("files", img));

      const res = await axios.put(
        `${baseUrl}/products/update/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        navigate("/admin/products");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold mb-6">Update Product</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ---------------- LEFT : FORM ---------------- */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border">
          <Input name="productName" value={data.productName} onChange={handleChange} placeholder="Product Name" />
          <Input name="description" value={data.description} onChange={handleChange} placeholder="Description" />
          <Input name="productPrice" type="number" value={data.productPrice} onChange={handleChange} placeholder="Price" />
          <Input name="category" value={data.category} onChange={handleChange} placeholder="Category" />
          <Input name="brand" value={data.brand} onChange={handleChange} placeholder="Brand" />

          <Button disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </form>

        {/* ---------------- RIGHT : IMAGES ---------------- */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="font-semibold mb-3">Existing Images</h2>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {product.productImg.map((img) => (
              <div key={img.public_id} className="relative">
                <img src={img.url} className="h-24 w-full object-cover rounded" />
                <label className="flex items-center gap-1 mt-1 text-xs">
                  <input
                    type="checkbox"
                    checked={keepImages.includes(img.public_id)}
                    onChange={() => toggleKeepImage(img.public_id)}
                  />
                  Keep
                </label>
              </div>
            ))}
          </div>

          <h2 className="font-semibold mb-2">Upload New Images (max 5)</h2>
          <Input type="file" multiple accept="image/*" onChange={handleImageChange} />

          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {previewImages.map((src, i) => (
                <img key={i} src={src} className="h-24 w-full object-cover rounded" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
