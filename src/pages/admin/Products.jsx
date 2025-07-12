import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Card, CardContent, Input, Button } from "../../components/UI";

const Products = () => {
  const [productsByShop, setProductsByShop] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const productSnap = await getDocs(collection(db, "products"));
      const grouped = {};

      for (const productDoc of productSnap.docs) {
        const product = productDoc.data();
        product.id = productDoc.id;

        let merchantName = "Unknown Shop";
        if (product.shopId) {
          const shopDoc = await getDoc(doc(db, "merchant-shops", product.shopId));
          if (shopDoc.exists()) {
            merchantName = shopDoc.data().name;
          }
        }

        if (!grouped[merchantName]) grouped[merchantName] = [];
        grouped[merchantName].push(product);
      }

      setProductsByShop(grouped);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId, shopName) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await deleteDoc(doc(db, "products", productId));
    setProductsByShop((prev) => {
      const updated = { ...prev };
      updated[shopName] = updated[shopName].filter((p) => p.id !== productId);
      return updated;
    });
  };

  const handleBlock = async (id, currentState, shopName) => {
    await updateDoc(doc(db, "products", id), { isActive: !currentState });
    setProductsByShop((prev) => {
      const updated = { ...prev };
      updated[shopName] = updated[shopName].map((p) =>
        p.id === id ? { ...p, isActive: !currentState } : p
      );
      return updated;
    });
  };

  const filteredProductsByShop = Object.entries(productsByShop).reduce((acc, [shopName, products]) => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shopName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) acc[shopName] = filtered;
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products by Shops</h1>

      <Input
        placeholder="Search by product or shop name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      {Object.entries(filteredProductsByShop).map(([shopName, products]) => (
        <div key={shopName} className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600">{shopName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">Price: ₹{product.price}</p>
                  <p className="text-sm text-gray-500">Offer: ₹{product.offerPrice || "None"}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock || "N/A"}</p>
                  <p className="text-sm text-gray-500">Status: <span className={product.isActive ? "text-green-600" : "text-red-600"}>{product.isActive ? "Active" : "Blocked"}</span></p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      className="bg-yellow-500 text-white"
                      onClick={() => handleBlock(product.id, product.isActive, shopName)}
                    >
                      {product.isActive ? "Block" : "Unblock"}
                    </Button>
                    <Button
                      className="bg-red-500 text-white"
                      onClick={() => handleDelete(product.id, shopName)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
