import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Navigation Bar */}
      <nav className="bg-black shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">CTVerse</span>
            </a>
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <a href="/" className="text-white hover:text-red-600 transition">Home</a>
              <a href="/catalog" className="text-white hover:text-red-600 transition">Catalog</a>
              <a href="/collection" className="text-white hover:text-red-600 transition">My Collection</a>
              <a href="/about" className="text-white hover:text-red-600 transition">About</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to CTVerse</h1>
          <p className="text-lg font-medium">
            Your ultimate platform for managing and showcasing your action figure collection.
          </p>
        </div>
      </header>

      {/* About Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg">
              At CTVerse, we aim to empower collectors by providing a seamless platform to organize, track, and share their action figure collections. Whether you're a seasoned collector or just starting out, CTVerse is here to help you every step of the way.
            </p>
          </div>

          {/* Features Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Features</h2>
            <ul className="list-disc pl-6 text-gray-700 text-lg">
              <li>Track and manage your collection with ease</li>
              <li>Add custom details like purchase price and condition</li>
              <li>Organize figures by categories such as release year</li>
              <li>Connect with fellow collectors and share your passion</li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-700 text-lg">
            Have questions or feedback? We'd love to hear from you! Reach out to us at 
            <a href="mailto:help.ctverse@gmail.com" className="text-red-600 hover:underline"> help.ctverse@gmail.com</a>.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} CTVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;