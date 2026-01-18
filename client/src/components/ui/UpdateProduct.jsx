import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BASE_URL;
const accessToken = localStorage.getItem("accessToken");

const UpdateProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [keepImages, setKeepImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    axios.get(`${baseUrl}/products/all-products`).then((res) => {
      const p = res.data.products.find(p => p._id === productId);
      setProduct(p);
      setKeepImages(p.productImg.map(img => img.public_id));
    });
  }, []);

  const updateProduct = async () => {
    const formData = new FormData();

    formData.append("existingImages", JSON.stringify(keepImages));
    newImages.forEach(img => formData.append("files", img));

    try {
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

      if (res.data.success) toast.success("Updated");
    } catch {
      toast.error("Update failed");
    }
  };

  if (!product) return null;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Update Product</h1>

      {product.productImg.map(img => (
        <div key={img.public_id}>
          <img src={img.url} className="h-24" />
          <input
            type="checkbox"
            checked={keepImages.includes(img.public_id)}
            onChange={() =>
              setKeepImages(prev =>
                prev.includes(img.public_id)
                  ? prev.filter(id => id !== img.public_id)
                  : [...prev, img.public_id]
              )
            }
          /> Keep
        </div>
      ))}

      <input type="file" multiple onChange={(e) => setNewImages([...e.target.files])} />

      <Button onClick={updateProduct}>Update</Button>
    </div>
  );
};

export default UpdateProduct;
