import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export const useCollection = () => {
  const { user } = useAuth();
  const [userCollection, setUserCollection] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!user) {
        setUserCollection([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'collections'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => doc.data().productId);
        setUserCollection(items);
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [user]);

  const addToCollection = async (productId: string) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      await addDoc(collection(db, 'collections'), {
        userId: user.uid,
        productId,
        addedAt: new Date()
      });
      setUserCollection(prev => [...prev, productId]);
    } catch (error) {
      console.error('Error adding to collection:', error);
      throw error;
    }
  };

  const removeFromCollection = async (productId: string) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      const q = query(
        collection(db, 'collections'),
        where('userId', '==', user.uid),
        where('productId', '==', productId)
      );
      const querySnapshot = await getDocs(q);
      const docRef = doc(db, 'collections', querySnapshot.docs[0].id);
      await deleteDoc(docRef);
      setUserCollection(prev => prev.filter(id => id !== productId));
    } catch (error) {
      console.error('Error removing from collection:', error);
      throw error;
    }
  };

  return {
    userCollection,
    loading,
    addToCollection,
    removeFromCollection,
    isInCollection: (productId: string) => userCollection.includes(productId)
  };
};