import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Card, CardContent, Input, Button } from "../../components/UI";
import { isArray } from "chart.js/helpers";

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchShops = async () => {
      const shopSnap = await getDocs(collection(db, "merchant-shops"));
      const shopData = [];

      for (const shopDoc of shopSnap.docs) {
        const shop = shopDoc.data();
        shop.id = shopDoc.id;

        // Fetch merchant info (optional)
        if (shop.merchantId) {
          const merchantDoc = await getDoc(doc(db, "users", shop.merchantId));
          shop.merchantName = merchantDoc.exists() ? merchantDoc.data().name : "Unknown";
        } else {
          shop.merchantName = "Unknown";
        }

        shopData.push(shop);
      }

      setShops(shopData);
      setFilteredShops(shopData);
    };

    fetchShops();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredShops(
      shops.filter(
        (shop) =>
          shop.name.toLowerCase().includes(value) ||
          shop.merchantName.toLowerCase().includes(value)
      )
    );
  };

  const handleDelete = async (shopId) => {
    if (!window.confirm("Are you sure you want to delete this shop?")) return;
    await deleteDoc(doc(db, "merchant-shops", shopId));
    setShops((prev) => prev.filter((s) => s.id !== shopId));
    setFilteredShops((prev) => prev.filter((s) => s.id !== shopId));
  };

  const handleBlock = async (id, currentState) => {
    // console.log(shops, id, currentState, shop)
    await updateDoc(doc(db, "merchant-shops", id), { isActive: !currentState });
    setShops(prev => prev.map(m => m.id === id ? { ...m, isActive: !currentState } : m));
    setFilteredShops(prev => prev.map(m => m.id === id ? { ...m, isActive: !currentState } : m));
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Shops</h1>
      <Input
        placeholder="Search by shop or merchant name"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredShops.map((shop) => (
          <Card key={shop.id}>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">{shop.name}</h2>
              <p className="text-sm text-gray-500">Merchant: {shop.merchantName}</p>
              <p className="text-sm text-gray-500">Approved: <span className={shop.isActive ? "text-green-600" : "text-red-600"}>{shop.isActive ? "Yes" : "No"}</span></p>
              <div className="flex gap-2 mt-3">
                <Button
                  className="bg-yellow-500 text-white"
                  onClick={() => handleBlock(shop.id, shop.isActive, shop)}
                >
                  {shop.isActive ? "Block" : "Unblock"}
                </Button>
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => handleDelete(shop.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Shops;
