import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, Modal } from "../../components/UI";
import MerchantForm from "./ShopAndProductForm";
import { fetchShopDet } from "./fetchShopDetails";
import FloatingActionButton from "../../components/FloatingactionButton";

const Products = () => {
  const { user } = useAuth();
  const [shopProducts, setShopProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!user?.uid) return;

        const data = await fetchShopDet(user?.uid, false);
        setShopProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isModalOpen]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Products by Shop</h2>
      </div>

      {loading ? (
        <div className="text-center text-xl font-semibold py-10">Loading...</div>
      ) : shopProducts.length === 0 ? (
        <p className="text-center text-gray-500">No shops or products found.</p>
      ) : (
        shopProducts.map(({ shop, products }) => (
          <div key={shop.id} className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Shop( {shop.name} )</h3>
            {products.length === 0 ? (
              <p className="text-gray-500">No products added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg border border-gray-200"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded mb-4"
                    />
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{product.name}</h4>
                      {product.offerPrice !== 0 ? (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="line-through text-gray-500">${product.price}</span>
                          <span className="text-green-600 font-bold">${product.offerPrice}</span>
                        </div>
                      ) : (
                        <p className="mb-1">Price: ${product.price}</p>
                      )}
                      <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <MerchantForm type="products" onSuccess={() => setIsModalOpen(false)} />
        </div>
      </Modal>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} isVisible={!isModalOpen} />
    </div>
  );
};

export default Products;
