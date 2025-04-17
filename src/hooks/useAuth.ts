// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Controls overall loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);

        try {
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "Anonymous",
              photoURL: firebaseUser.photoURL || null,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error("Error checking or creating user document:", error);
        }
      }

      // ✅ Move this to the bottom, after all checks
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
