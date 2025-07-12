import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Button, Modal } from "../../components/UI";
import MerchantForm from "./ShopAndProductForm";
import FloatingActionButton from "../../components/FloatingactionButton";

const Shop = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const merchantId = user?.uid;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [isModalOpen]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">{user?.displayName}'s Shops</h2>
      </div>

      {loading ? (
        <div className="w-full text-center text-lg font-semibold py-12">Loading...</div>
      ) : shops.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No shops added yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Category:</span> {shop.type}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Address:</span> {shop.address}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <MerchantForm type="shop" onSuccess={() => setIsModalOpen(false)} />
        </div>
      </Modal>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} isVisible={!isModalOpen} />
    </div>
  );
};

export default Shop;
