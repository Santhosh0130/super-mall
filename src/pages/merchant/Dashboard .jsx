import React, { useEffect, useState } from "react";
import { Card, CardContent, Button } from "../../components/UI";
import { Line } from "react-chartjs-2";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

const Dashboard = () => {
  const { user } = useAuth();
  const [shopCount, setShopCount] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [monthlyProductData, setMonthlyProductData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.uid) return;

      // Queries
      const shopQuery = query(
        collection(db, "merchant-shops"),
        where("merchantId", "==", user.uid)
      );
      const productQuery = query(
        collection(db, "products"),
        where("merchantId", "==", user.uid)
      );
      const offerQuery = query(
        collection(db, "products"),
        where("merchantId", "==", user.uid),
        where("offerPrice", ">", 0)
      );

      // Counts
      const shopSnap = await getCountFromServer(shopQuery);
      const productSnap = await getCountFromServer(productQuery);
      const offerSnap = await getCountFromServer(offerQuery);

      setShopCount(shopSnap.data().count);
      setProductCount(productSnap.data().count);
      setOfferCount(offerSnap.data().count);
    };

    fetchDashboardData();
  }, [user?.uid]);

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-2xl font-bold">
        Welcome back, {user?.displayName || "Merchant"}!
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Shops" value={shopCount} />
        <StatCard title="Products" value={productCount} />
        <StatCard title="Active Offers" value={offerCount} />
        <StatCard title="Low Stock" value="Soon" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 shadow rounded text-center">
    <h3 className="text-md text-gray-500">{title}</h3>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </div>
)

export default Dashboard;
