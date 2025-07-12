import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebase'

export const registerUser = async (data, role) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);

    await updateProfile(user, {
      displayName: data.name,
    });

    const userData = {
      uid: user.uid,
      name: data.name,
      email: data.email,
      role: role,
      isActive: false,
      createdAt: serverTimestamp(),
    };

    if (role === "merchant") {
      userData.shopName = data.shopName;
      userData.shopAddress = data.shopAddress;
      userData.contactNumber = data.contactNumber;
    }

    await setDoc(doc(db, "users", user.uid), userData);

    return true;
  } catch (err) {
    console.log("Registration error:", err);
    return false;
  }
};


export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, "users", userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);

    console.log(userDoc.data())
    if (userDoc.exists()) {
      const isActive = userDoc.data().isActive;
      const role = userDoc.data().role;
      return { uid: userCredential.user.uid, isActive, role };
    } else {
      throw new Error("User document not found in Firestore.");
    }


    // Call this function once to add data
    addDummyProducts();
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

const dummyProducts = [
  {
    name: "Wireless Earbuds",
    price: 1499,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Smart Watch",
    price: 3499,
    imageUrl:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bluetooth Speaker",
    price: 1999,
    imageUrl:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Gaming Mouse",
    price: 1299,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "4K Monitor",
    price: 13499,
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Mechanical Keyboard",
    price: 2999,
    imageUrl:
      "https://images.unsplash.com/photo-1527434004554-5b0ac4f15352?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "USB-C Hub",
    price: 799,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Portable SSD",
    price: 6499,
    imageUrl:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=400&q=80",
  },
];

async function addDummyProducts() {
  try {
    for (const product of dummyProducts) {
      await addDoc(collection(db, "products"), product);
    }
    console.log("Dummy products added successfully!");
  } catch (error) {
    console.error("Error adding dummy products: ", error);
  }
}


