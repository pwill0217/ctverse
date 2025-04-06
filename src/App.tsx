import React, { useEffect, useState } from 'react';
import { BookMarked, GiftIcon, ShoppingCart, Trophy, ListPlus, Sparkles } from 'lucide-react';
import Catalog from './pages/Catalog';

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog'>('home');
  
  const backgroundImages = [
    "https://i.ebayimg.com/images/g/7GgAAOSwhY1n5p3i/s-l225.jpg",
    "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQS8MlW3fWetJLtg_6Nn1ZDl31hX0hEJzs6MMI2LtII0D5831hWkw9Edmnvb2d1HPwRCW-IQoALDPiBDDfpDtAv0y2aDPrkYyaJ6HxB_h6sQRo3adoWs3hYqb3U&usqp=CAc",
    "data:image/jpeg;base64,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",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (currentPage === 'catalog') {
    return <Catalog />;
  }

  return (
    <div className="min-h-screen relative bg-black">
      {/* Background Image Slider */}
      <div className="fixed inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-40' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-white">CTVerse</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => setCurrentPage('home')} 
                className="text-white hover:text-red-600 transition"
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('catalog')} 
                className="text-white hover:text-red-600 transition"
              >
                Catalog
              </button>
              <a href="#" className="text-white hover:text-red-600 transition">My Collection</a>
            </div>
            <button className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition flex items-center space-x-2">
              <a
                href="https://www.aliexpress.com/store/1102778419?spm=a2g0o.productlist.main.16.5c71393dlufFQf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Shop at the Official CT Toys store</span>
              </a>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Your Ultimate <span className="text-red-600">CT Toys</span> Companion
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Track, collect, and discover import figures action figures at a cheaper price. Never miss a release and showcase your collection to the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setCurrentPage('catalog')}
                className="bg-red-600 text-white px-8 py-4 rounded font-semibold hover:bg-red-700 transition flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Explore New Releases</span>
              </button>
              <button className="bg-white/10 text-white px-8 py-4 rounded font-semibold hover:bg-white/20 transition backdrop-blur-sm flex items-center justify-center space-x-2">
                <ListPlus className="w-5 h-5" />
                <span>Start Your Collection</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/50 p-8 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Track New Releases</h3>
              <p className="text-gray-300">Get notified about upcoming releases and never miss out on must-have collectibles.</p>
            </div>
            <div className="bg-black/50 p-8 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookMarked className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Browse Catalog</h3>
              <p className="text-gray-300">Explore our extensive catalog of current releases with detailed information and pricing.</p>
            </div>
            <div className="bg-black/50 p-8 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <ListPlus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Manage Collection</h3>
              <p className="text-gray-300">Create and manage your personal collection, track values, and connect with other collectors.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative z-10 py-16 bg-gradient-to-t from-black via-black/50 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Collection?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of collectors who trust CTVerse to track and manage their collections.
          </p>
          <button className="bg-red-600 text-white px-8 py-4 rounded font-semibold hover:bg-red-700 transition inline-flex items-center space-x-2">
            <GiftIcon className="w-5 h-5" />
            <span>Get Started Now</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Trophy className="w-6 h-6 text-red-600" />
              <span className="text-xl font-bold text-white">CTVerse</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 CTVerse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App