import React, { useRef, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BASE_URL;
const accessToken = localStorage.getItem("accessToken");
const MAX_IMAGES = 5;

const AddProduct = () => {
  const fileInputRef = useRef(null);

  const [data, setData] = useState({
    productName: "",
    description: "",
    productPrice: "",
    category: "",
    brand: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImages((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...previews]);

    fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append("files", img));

      const res = await axios.post(
        `${baseUrl}/products/add-product`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        setData({
          productName: "",
          description: "",
          productPrice: "",
          category: "",
          brand: "",
        });
        setImages([]);
        setPreviewImages([]);
        fileInputRef.current.value = "";
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border h-[calc(100vh-4rem)]">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-12 h-full"
        >
          {/* LEFT — DETAILS */}
          <div className="col-span-7 p-8 border-r overflow-y-auto">
            <h2 className="text-3xl font-semibold mb-6">
              Add Product
            </h2>

            <div className="space-y-5">
              <Input
                name="productName"
                placeholder="Product Name"
                value={data.productName}
                onChange={handleChange}
              />

              <Input
                name="description"
                placeholder="Description"
                value={data.description}
                onChange={handleChange}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="productPrice"
                  type="number"
                  placeholder="Price"
                  value={data.productPrice}
                  onChange={handleChange}
                />

                <Input
                  name="category"
                  placeholder="Category"
                  value={data.category}
                  onChange={handleChange}
                />
              </div>

              <Input
                name="brand"
                placeholder="Brand"
                value={data.brand}
                onChange={handleChange}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white hover:bg-gray-900"
              >
                {loading ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </div>

          {/* RIGHT — IMAGE PREVIEW */}
          <div className="col-span-5 p-8 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Product Images</h3>
              <span className="text-sm text-gray-500">
                {images.length}/{MAX_IMAGES}
              </span>
            </div>

            <Input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={images.length >= MAX_IMAGES}
            />

            {previewImages.length === 0 && (
              <p className="text-sm text-gray-500 mt-6">
                Upload up to 5 images. Preview will appear here.
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">
              {previewImages.map((img, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg overflow-hidden bg-white"
                >
                  <img
                    src={img}
                    alt="preview"
                    className="w-full h-full "
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
