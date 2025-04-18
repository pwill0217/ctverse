import React, { useState } from 'react';
import { Trophy, Search, Filter, Plus, Trash2, Edit, Star } from 'lucide-react';
import { useCollection } from '../hooks/useCollection';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';  // Ensure correct import for Firestore
import { getAuth } from 'firebase/auth';

interface CollectionItem {
  id: string;
  name: string;
  purchaseDate?: string;
  purchasePrice?: number; // Allow decimals
  favorite?: boolean;
  image: string;
  condition: string;
  notes?: string;
}

const Collection: React.FC = () => {
  const {
    userCollection,
    loading,
    handleDelete,
    handleToggleFavorite,
  } = useCollection<CollectionItem>();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date');
  const [showAddModal, setShowAddModal] = useState(false); // For add modal
  const [newPrice, setNewPrice] = useState<number | string>('');  // New price state
  const [purchaseDate, setPurchaseDate] = useState<string>('');  // New purchase date state
  const [addingItemId, setAddingItemId] = useState<string | null>(null); // ID of the item being added

  // Handle adding item to the collection
  const handleAddItem = async (itemId: string) => {
    const price = parseFloat(newPrice.toString());
    if (isNaN(price) || !purchaseDate) {
      alert('Please enter a valid price and purchase date');
      return;
    }

    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid; // Get authenticated user's UID
      if (!userId) {
        alert('User is not authenticated');
        return;
      }

      // Find the product details based on itemId
      const item = userCollection.find((item) => item.id === itemId);
      if (!item) {
        alert('Item not found!');
        return;
      }

      // Firestore path: /users/{userId}/collection/{docId}
      const itemRef = doc(db, 'users', userId, 'collection', itemId); // Path matches Firestore rules
      await setDoc(itemRef, {
        ...item,
        purchasePrice: price,
        purchaseDate,
      });

      alert(`Added ${item.name} to your collection!`);
      setShowAddModal(false); // Close the modal after adding
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add the item. Please try again.');
    }
  };

  const filteredCollection = userCollection
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.purchaseDate || 0).getTime() - new Date(a.purchaseDate || 0).getTime();
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'price':
          return (b.purchasePrice || 0) - (a.purchasePrice || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return <div className="text-center text-gray-500">Loading your collection...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-black shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-white">CTVerse</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Collection</h1>
            <p className="text-gray-600">
              {userCollection.length} items · Total Value: $
              {userCollection.reduce((sum, item) => sum + (item.purchasePrice || 0), 0).toFixed(2)}
            </p>
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search collection..."
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'price')}
              >
                <option value="date">Recent First</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCollection.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative pb-[100%]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button
                  onClick={() => handleToggleFavorite(item.id)}
                  className={`absolute top-2 right-2 p-2 rounded-full ${
                    item.favorite ? 'bg-red-600 text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  <Star className="w-5 h-5" fill={item.favorite ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  {/* Conditionally Display Purchase Date and Price */}
                  {item.purchaseDate ? (
                    <span className="text-sm text-gray-600">Purchased on: {new Date(item.purchaseDate).toLocaleDateString()}</span>
                  ) : (
                    <span className="text-sm text-gray-600">Purchase date: Not set</span>
                  )}
                  {item.purchasePrice !== undefined ? (
                    <span className="text-lg font-bold text-red-600">${item.purchasePrice.toFixed(2)}</span>
                  ) : (
                    <span className="text-lg font-bold text-red-600">Price: Not set</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm px-2 py-1 rounded ${
                    item.condition === 'new' ? 'bg-green-100 text-green-800' :
                    item.condition === 'used' ? 'bg-yellow-100 text-yellow-800' :
                    item.condition === 'damaged' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {item.condition ? item.condition.charAt(0).toUpperCase() + item.condition.slice(1) : 'in hand'}
                  </span>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => { 
                        setAddingItemId(item.id); 
                        setShowAddModal(true); 
                      }}
                      className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {item.notes && (
                  <p className="mt-2 text-sm text-gray-600">{item.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCollection.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No items in your collection</h3>
            <p className="text-gray-600 mb-4">Start adding items to your collection to track them here.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg inline-flex items-center space-x-2 hover:bg-red-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Item</span>
            </button>
          </div>
        )}

        {/* Modal for Add Item */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add New Item</h2>
              <div className="mb-4">
                <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">Enter Purchase Price</label>
                <input
                  type="number"
                  id="purchasePrice"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                  step="0.01"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">Enter Purchase Date</label>
                <input
                  type="date"
                  id="purchaseDate"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleAddItem(addingItemId!)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
