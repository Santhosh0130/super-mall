import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Input, Button } from "../../components/UI";

const AddOfferFlow = ({ type, onSuccess }) => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);

  // Load merchant shops
  useEffect(() => {
    const loadShops = async () => {
      const q = query(
        collection(db, "merchant-shops"),
        where("merchantId", "==", user?.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setShops(data);
    };
    if (user?.uid) loadShops();
  }, [user?.uid]);

  // Load products of selected shop
  useEffect(() => {
    const loadProducts = async () => {
      if (!selectedShop) return;
      const q = query(
        collection(db, "products"),
        where("shopId", "==", selectedShop)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    };
    loadProducts();
  }, [selectedShop]);

  const handleOfferSubmit = async () => {
    setLoading(true);

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const offerPrice = product.price - (product.price * discount) / 100;
    const productRef = doc(db, "products", selectedProduct);

    try {
      await updateDoc(productRef, {
        discount: parseInt(discount),
        offerPrice: parseFloat(offerPrice.toFixed(2)),
      });

      if (onSuccess) onSuccess();
      alert("Offer updated successfully!");
      setSelectedShop("");
      setSelectedProduct("");
      setDiscount("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = Number(e.target.value);
    if (value <= 100) {
      if (value === 0) {
        setDiscount();
      } else {
        setDiscount(value);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Add Offer to Product</h2>

      <div>
        <label>Choose a Shop</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
        >
          <option value="">-- Select Shop --</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      {selectedShop && (
        <div>
          <label>Choose a Product</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">-- Select Product --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (₹{product.price})
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedProduct && (
        <div className="my-5 flex flex-col justify-between gap-5">
          <Input
            label="Discount (%)"
            type="number"
            value={discount}
            onChange={handleChange}
          />
          <Button onClick={handleOfferSubmit}>{loading ? "Adding..." : "Add Offer"}</Button>
        </div>
      )}
    </div>
  );
};

export default AddOfferFlow;
