import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Card, CardContent, Button } from "../../components/UI";

const Merchants = () => {
  const [merchants, setMerchants] = useState([]);

  useEffect(() => {
    const fetchMerchants = async () => {
      const q = query(collection(db, "users"), where("isActive", "==", true));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMerchants(data);
    };
    fetchMerchants();
  }, []);

  const handleBlock = async (id, currentState) => {
    await updateDoc(doc(db, "users", id), { isActive: !currentState });
    setMerchants(prev => prev.map(m => m.id === id ? { ...m, isActive: !currentState } : m));
  };

  const deleteMerchant = async (id) => {
    await deleteDoc(doc(db, "users", id));
    setMerchants(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {merchants.map(merchant => (
        <Card key={merchant.id}>
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-1">{merchant.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{merchant.email}</p>
            <p className="text-sm mb-2">
              Status: <span className={merchant.isActive ? "text-green-600" : "text-red-600"}>{merchant.isActive ? "Active" : "Blocked"}</span>
            </p>
            <div className="flex gap-2">
              <Button
                className="bg-yellow-500 text-white"
                onClick={() => handleBlock(merchant.id, merchant.isActive)}
              >
                {merchant.isActive ? "Block" : "Unblock"}
              </Button>
              <Button
                className="bg-red-500 text-white"
                onClick={() => deleteMerchant(merchant.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Merchants;
