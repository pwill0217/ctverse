import React, { useState } from 'react';
import { Trophy, Search, Filter, Plus, Trash2, Edit, Star } from 'lucide-react';

interface CollectionItem {
  id: string;
  name: string;
  image: string;
  purchaseDate: string;
  purchasePrice: number;
  condition: 'new' | 'used' | 'damaged';
  notes: string;
  favorite: boolean;
}

const mockCollection: CollectionItem[] = [
  {
    id: '1',
    name: 'CT Toys Hellverine',
    image: 'https://i.ebayimg.com/images/g/7GgAAOSwhY1n5p3i/s-l225.jpg',
    purchaseDate: '2024-01-15',
    purchasePrice: 17.89,
    condition: 'new',
    notes: 'First CT Toys purchase',
    favorite: true,
  },
  // Add more mock items as needed
];

const Collection: React.FC = () => {
  const [collection, setCollection] = useState<CollectionItem[]>(mockCollection);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCollection = collection
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.purchasePrice - a.purchasePrice;
        default:
          return 0;
      }
    });

  const handleDelete = (id: string) => {
    setCollection(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setCollection(prev =>
      prev.map(item =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

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
              {collection.length} items · Total Value: ${collection.reduce((sum, item) => sum + item.purchasePrice, 0).toFixed(2)}
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
                  <span className="text-sm text-gray-600">Added: {new Date(item.purchaseDate).toLocaleDateString()}</span>
                  <span className="text-lg font-bold text-red-600">${item.purchasePrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm px-2 py-1 rounded ${
                    item.condition === 'new' ? 'bg-green-100 text-green-800' :
                    item.condition === 'used' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {/* Handle edit */}}
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
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-gray-400" />
            </div>
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
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            {/* Add form fields for adding a new item */}
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              {/* Add more fields as needed */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;