import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export const useCollection = <T extends { id: string }>() => {
  const { user, loading: authLoading } = useAuth(); // 🧠 include loading from useAuth
  const [userCollection, setUserCollection] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // 🧠 Wait for Firebase to finish loading
    if (!user) {
      setUserCollection([]);
      setLoading(false);
      return;
    }

    const fetchCollection = async () => {
      try {
        const q = collection(db, 'users', user.uid, 'collection');
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setUserCollection(items);
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [user, authLoading]);

  const addToCollection = async (itemData: Omit<T, 'id'>) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'collection'), itemData);
      setUserCollection(prev => [...prev, { id: docRef.id, ...itemData } as T]);
    } catch (error) {
      console.error('Error adding to collection:', error);
      throw error;
    }
  };

  const removeFromCollection = async (itemId: string) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const docRef = doc(db, 'users', user.uid, 'collection', itemId);
      await deleteDoc(docRef);
      setUserCollection(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from collection:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'collection', id));
      setUserCollection(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const itemRef = doc(db, 'users', user.uid, 'collection', id);
      const itemSnap = await getDoc(itemRef);

      if (itemSnap.exists()) {
        const currentFavorite = itemSnap.data().favorite;
        await updateDoc(itemRef, { favorite: !currentFavorite });

        setUserCollection(prev =>
          prev.map(item =>
            item.id === id ? { ...item, favorite: !currentFavorite } : item
          )
        );

        console.log(`Toggled favorite for item with id: ${id}`);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return {
    userCollection,
    loading,
    addToCollection,
    removeFromCollection,
    isInCollection: (id: string) => userCollection.some(item => item.id === id),
    handleDelete,
    handleToggleFavorite
  };
};
