// src/pages/admin/Dashboard.js
import { collection, getCountFromServer, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [counts, setCounts] = useState({
    merchants: 0,
    pendingMerchants: 0,
    shops: 0,
    products: 0,
    offers: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const [merchantSnap, pendingSnap, shopSnap, productSnap, offerSnap] = await Promise.all([
        getCountFromServer(query(collection(db, "users"), where("role", "==", "merchant"))),
        getCountFromServer(query(collection(db, "users"), where("isActive", "==", false))),
        getCountFromServer(collection(db, "merchant-shops")),
        getCountFromServer(collection(db, "products")),
        getCountFromServer(query(collection(db, "products"), where("offerPrice", ">", 0))),
      ]);
      setCounts({
        merchants: merchantSnap.data().count,
        pendingMerchants: pendingSnap.data().count,
        shops: shopSnap.data().count,
        products: productSnap.data().count,
        offers: offerSnap.data().count,
      });
    };

    fetchCounts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Merchants" value={counts.merchants} />
        <StatCard title="Pending Merchants" value={counts.pendingMerchants} />
        <StatCard title="Total Shops" value={counts.shops} />
        <StatCard title="Total Products" value={counts.products} />
        <StatCard title="Total Offers" value={counts.offers} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <h3 className="text-md text-gray-500">{title}</h3>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </div>
);

export default Dashboard;
