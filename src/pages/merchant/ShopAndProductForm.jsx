import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Button, Input } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import ImageUploader from "../../services/ImageUploader";

const MerchantForm = ({ type, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageMessage, setImageMessage] = useState("");

  const { user } = useAuth();
  const merchantId = user?.uid;
  const isShop = type === "shop";

  useEffect(() => {
    if (!isShop && merchantId) {
      const fetchShops = async () => {
        const q = query(
          collection(db, "merchant-shops"),
          where("merchantId", "==", merchantId)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShops(data);
      };
      fetchShops();
    }
  }, [merchantId, isShop]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const capitalizeWords = (str) =>
      str.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

    const capitalizedFields = ["name", "category", "address"];

    setFormData((prev) => ({
      ...prev,
      [name]: capitalizedFields.includes(name)
        ? capitalizeWords(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.imageUrl && !isShop) {
      setImageMessage("Please add an image.");
      setLoading(false);
      return;
    }

    setImageMessage("");

    const offerPrice =
      formData.discount == null
        ? 0
        : formData.price - (formData.price * parseInt(formData.discount)) / 100;

    const targetCollection = isShop ? "merchant-shops" : "products";
    const dataToSubmit = {
      ...formData,
      merchantId,
      isActive: true,
      createdAt: new Date(),
    };

    if (!isShop) {
      dataToSubmit.price = parseFloat(formData.price);
      dataToSubmit.stock = parseInt(formData.stock);
      dataToSubmit.offerPrice = parseFloat(offerPrice);
    }

    try {
      await addDoc(collection(db, targetCollection), dataToSubmit);
      alert(`${isShop ? "Shop" : "Product"} added successfully.`);
      if (onSuccess) onSuccess();
      setFormData({});
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
    }));
    setImageMessage("");
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Add New {isShop ? "Shop" : "Product"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {isShop ? (
          <>
            <Input
              label="Shop Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
            <Input
              label="Address"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              required
            />
            <Input
              label="Contact"
              name="contact"
              value={formData.contact || ""}
              onChange={handleChange}
              required
              type="tel"
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Category</option>
                <option value="Groceries">Groceries</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Home Essentials">Home Essentials</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Kitchenware">Kitchenware</option>
                <option value="Baby & Kids">Baby & Kids</option>
                <option value="Tools & Hardware">Tools & Hardware</option>
                <option value="Festival">Festival</option>
                <option value="Books & Stationery">Books & Stationery</option>
              </select>
            </div>
            <Input
              label="Opening Hours"
              name="openingHours"
              value={formData.openingHours || ""}
              onChange={handleChange}
              required
              className="md:col-span-2"
            />
          </>
        ) : (
          <>
            <Input
              label="Product Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
            <Input
              label="Price"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              required
              type="number"
            />
            <Input
              label="Stock"
              name="stock"
              value={formData.stock || ""}
              onChange={handleChange}
              required
              type="number"
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Category</option>
                <option value="Groceries">Groceries</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Home Essentials">Home Essentials</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Kitchenware">Kitchenware</option>
                <option value="Baby & Kids">Baby & Kids</option>
                <option value="Tools & Hardware">Tools & Hardware</option>
                <option value="Festival">Festival</option>
                <option value="Books & Stationery">Books & Stationery</option>
              </select>
            </div>
            <Input
              label="Discount"
              placeholder="In percentage (%)"
              name="discount"
              value={formData.discount || ""}
              onChange={handleChange}
              className="md:col-span-2"
            />
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Product Description"
              className="w-full min-h-[80px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Select Shop
              </label>
              <select
                name="shopId"
                value={formData.shopId || ""}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a Shop</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Upload Image
              </label>
              <ImageUploader onUpload={handleImageUpload} />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Product"
                  className="h-28 mt-2 rounded"
                />
              )}
              <span className="text-red-500 text-sm">{imageMessage}</span>
            </div>
          </>
        )}

        <div className="md:col-span-2 flex justify-end mt-4">
          <Button type="submit" disabled={loading}>
            {loading
              ? "Submitting..."
              : `Add ${isShop ? "Shop" : "Product"}`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MerchantForm;
