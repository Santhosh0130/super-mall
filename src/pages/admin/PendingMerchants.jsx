import { collection, deleteDoc, getDocs, query, updateDoc, where, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Button } from '../../components/UI';

const PendingMerchants = () => {
    const [pendingMerchants, setPendingMerchants] = useState([]);

    useEffect(() => {
        const fetchPending = async () => {
            const q = query(collection(db, "users"), where("isActive", "==", false));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPendingMerchants(data);
        };
        fetchPending();
    }, []);

    const acceptMerchant = async (id) => {
        await updateDoc(doc(db, "users", id), { isActive: true });
        setPendingMerchants(prev => prev.filter(m => m.id !== id));
    };

    const denyMerchant = async (id) => {
        await deleteDoc(doc(db, "users", id));
        setPendingMerchants(prev => prev.filter(m => m.id !== id));
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Merchant Verification</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingMerchants.map((merchant) => (
                    <Card key={merchant.id}>
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold mb-1">{merchant.name}</h3>
                            <p className="text-sm text-gray-500 mb-3 break-words">{merchant.email}</p>
                            <div className="flex gap-2">
                                <Button className="bg-green-500 text-white" onClick={() => acceptMerchant(merchant.id)}>
                                    Accept
                                </Button>
                                <Button className="bg-red-500 text-white" onClick={() => denyMerchant(merchant.id)}>
                                    Deny
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PendingMerchants;
