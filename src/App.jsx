import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import Navbar from "./components/Navbar";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Shops from "./pages/admin/Shops";
import Merchants from "./pages/admin/Merchants";
import Offers from "./pages/admin/Offers";
import Products from "./pages/admin/Products";
import PendingMerchants from "./pages/admin/PendingMerchants";
import MerchantLayout from "./pages/merchant/MerchantLayout";
import MerchantDashboard from "./pages/merchant/Dashboard ";
import MerchantOffers from "./pages/merchant/Offers";
import MerchantShop from "./pages/merchant/Shop";
import MerchantProducts from "./pages/merchant/Products";

function App() {
  return (
    <Router>
      <AppWarpper />
    </Router>
  );
}

function AppWarpper() {
  const location = useLocation();
  const [username, setUsername] = useState('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUsername(user.displayName || "Guest")
        // console.log("inside if ", user)
      } else {
        setUsername('')
      }
    })

    return () => unsubscribe()
  }, [])

  const hideNavebarOnPaths = ["/login", "/register"]
  const shouldShowNavbar = !hideNavebarOnPaths.includes(location.pathname)

  return (
    <>
      {shouldShowNavbar && <Navbar userName={username} />}
      <Routes>
        {/* ✅ Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={
          <ProtectedRoutes allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoutes>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="merchants" element={<Merchants />} />
          <Route path="shops" element={<Shops />} />
          <Route path="products" element={<Products />} />
          {/* <Route path="offers" element={<Offers />} /> */}
          <Route path="pending-merchants" element={<PendingMerchants />} />
        </Route>

        <Route path="/merchant" element={
          <ProtectedRoutes allowedRoles={["merchant"]}>
            <MerchantLayout />
          </ProtectedRoutes>
        }>
          <Route path="dashboard" element={<MerchantDashboard />} />
          <Route path="shop" element={<MerchantShop />} />
          <Route path="offers" element={<MerchantOffers />} />
          <Route path="products" element={<MerchantProducts />} />
        </Route>

        <Route path="/customer/dashboard" element={
          <ProtectedRoutes allowedRoles={["customer"]}>
            <CustomerDashboard />
          </ProtectedRoutes>
        } />

        {/* Add more routes here if needed */}
      </Routes>
    </>
  )
}

export default App;
