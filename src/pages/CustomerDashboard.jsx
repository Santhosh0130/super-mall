import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

const CustomerDashboard = () => {
  const [userName, setUserName] = useState("");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserName(userDoc.data().name || "Customer");
      }

      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>

      <div className="pt-5 px-4 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Welcome, {userName} 👋
        </h1>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for products..."
          className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <h2 className="text-xl font-semibold mb-3 text-gray-700">Products</h2>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-transform duration-200 transform hover:scale-105 p-4"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 md:h-48 object-cover rounded mb-3"
                />
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 font-medium">₹ {product.price}</p>
                  <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerDashboard;
