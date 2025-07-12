import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { fetchShopDet } from "./fetchShopDetails";
import { Button, Modal } from "../../components/UI";
import OfferFom from "./OfferFom";
import FloatingActionButton from "../../components/FloatingactionButton";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        if (!user?.uid) return;
        const data = await fetchShopDet(user?.uid, true);
        setOffers(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [isModalOpen]);

  const handleRemoveOffer = async (product) => {
    setLoading(true);
    try {
      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, {
        discount: 0,
        offerPrice: 0.0,
      });
      alert("Offer Removed.");
      setOffers(await fetchShopDet(user?.uid, true));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold">Products with Offers</h2>
      </div>

      {offers.map(({ shop, products }) => (
        <div key={shop.id} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{shop.name}</h3>
          {products.length === 0 ? (
            <p className="text-gray-500">No products added yet.</p>
          ) : (
            <ul className="flex flex-col gap-6">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="p-4 rounded-lg shadow-md bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={product.imageUrl}
                      alt="Product"
                      className="w-24 h-24 object-cover rounded shadow"
                    />
                    <div className="flex flex-col text-sm sm:text-base">
                      <p className="font-semibold">{product.name}</p>
                      {product.offerPrice !== 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="line-through text-gray-500">${product.price}</span>
                          <span className="text-green-600 font-semibold">${product.offerPrice}</span>
                        </div>
                      ) : (
                        <p>Price: ${product.price}</p>
                      )}
                      <p>Discount: {product.discount}%</p>
                    </div>
                  </div>
                  <div className="self-end sm:self-center">
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1"
                      onClick={() => handleRemoveOffer(product)}
                    >
                      {loading ? "..." : "Remove"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <OfferFom type="add" onSuccess={() => setIsModalOpen(false)} />
      </Modal>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} isVisible={!isModalOpen} />
    </div>
  );
};

export default Offers;
