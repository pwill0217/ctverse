import React, { useEffect, useState } from 'react';
import { BookMarked, GiftIcon, ShoppingCart, Trophy, ListPlus, Sparkles, LogOut, LogIn } from 'lucide-react';
import Catalog from './pages/Catalog';
import Collection from './pages/Collection';
import AboutPage from './components/AboutPage'; // Import the AboutPage component
import AuthModal from './components/AuthModal';
import { useAuth } from './hooks/useAuth';
import { auth } from './firebase';
import Koficomponent from './components/Koficomponent';

function App() {
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'collection' | 'about'>('home'); // Add 'about' to the page options
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

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

  if (currentPage === 'collection') {
    return <Collection />;
  }

  if (currentPage === 'about') {
    return <AboutPage />; // Render the AboutPage when the currentPage is 'about'
  }
  
  return (
    
  <div className="min-h-screen relative bg-black">
    {/* Alert Banner */}
    <div className="bg-yellow-500 text-black text-center py-2 px-4 font-semibold">
      Prices may vary due to ongoing tariffs.
    </div>

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
      <Koficomponent />
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
            <button 
              onClick={() => setCurrentPage('about')} 
              className="text-white hover:text-red-600 transition"
            >
              About
            </button>
            
            {user ? (
              <button 
                onClick={() => setCurrentPage('collection')} 
                className="text-white hover:text-red-600 transition"
              >
                My Collection
              </button>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)} 
                className="text-white hover:text-red-600 transition flex items-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition flex items-center space-x-2">
              <a
                href="https://www.aliexpress.com/store/1102778419"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Shop at the Official CT Toys store</span>
              </a>
            </button>
            {user && (
              <button
                onClick={() => auth.signOut()}
                className="text-white hover:text-red-600 transition flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
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
            <button 
              onClick={() => user ? setCurrentPage('collection') : setShowAuthModal(true)}
              className="bg-white/10 text-white px-8 py-4 rounded font-semibold hover:bg-white/20 transition backdrop-blur-sm flex items-center justify-center space-x-2"
            >
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
          <button 
            onClick={() => user ? setCurrentPage('collection') : setShowAuthModal(true)}
            className="bg-red-600 text-white px-8 py-4 rounded font-semibold hover:bg-red-700 transition inline-flex items-center space-x-2"
          >
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

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        catalog={[]} 
        onAdd={(item) => console.log('Item added:', item)} 
      />
    </div>
  );
}

export default App;