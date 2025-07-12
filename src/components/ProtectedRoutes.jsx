// components/ProtectedRoutes.js
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("No user, not authorized");
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (allowedRoles.includes(role)) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [allowedRoles]);


  if (loading) return <div className="flex items-center justify-center h-screen text-lg font-semibold">Loading...</div>;

  if (!authorized) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoutes;
