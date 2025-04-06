import React, { useState } from 'react';
import { Star, StarHalf, Search, Filter, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  image: string;
  releaseYear: number;
  rating: number;
  price: number;
  aliExpressUrl: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'CT Toys Hellverine',
    image: 'https://imgs.search.brave.com/8iu8dZDjx31LqcSpny0pZ4H6S9tVgjYLtTBvET0UXX0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/Y3QtdG95cy1oZWxs/dmVyaW5lLXYwLWtm/a3dieDJ3YzFuZTEu/anBnP3dpZHRoPTY0/MCZjcm9wPXNtYXJ0/JmF1dG89d2VicCZz/PTY5ZDM1NmRmMTI3/M2ZmMWRhOGMxMTI5/ZWUxN2Y4MzBjMzlj/OTRjZTQ',
    releaseYear: 2025,
    rating: 4.9,
    price: 17.89,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808439774048.html?gps-id=pcStoreNewArrivals&scm=1007.23409.271287.0&scm_id=1007.23409.271287.0&scm-url=1007.23409.271287.0&pvid=55dee444-819a-45d3-890e-f7c00b858b28&_t=gps-id%3ApcStoreNewArrivals%2Cscm-url%3A1007.23409.271287.0%2Cpvid%3A55dee444-819a-45d3-890e-f7c00b858b28%2Ctpp_buckets%3A668%232846%238115%232000&pdp_ext_f=%7B%22order%22%3A%22332%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%2213409%22%7D&pdp_npi=4%40dis%21USD%2124.39%2117.89%21%21%21176.13%21129.20%21%402101e9ec17439780721035470efb97%2112000046007112552%21rec%21US%21%21ABXZ&spm=a2g0o.store_pc_home.smartNewArrivals_2005299976220.1005008626088800&gatewayAdapt=glo2usa'
  },
  {
    id: '2',
    name: 'CT Toys The Amazing Spider-Man',
    image: 'https://imgs.search.brave.com/9mSYW0JF0hBcqEG-l_6NP6OzStIC_-dLmRl8yBPjZsc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5hYm94c3RvcmUu/Y29tL2Nkbi9zaG9w/L2ZpbGVzL2N0LXRv/eXMtdGhlLWFtYXpp/bmctc3BpZGVyLW1h/bi1hY3Rpb24tZmln/dXJlLW1hZmV4LTAw/MS1hbmRyZXctZ2Fy/ZmllbGQtdmVyc2lv/bi0zODkzMDIuanBn/P3Y9MTc0MzQxNTQz/NyZ3aWR0aD0xNDQ1',
    releaseYear: 2025,
    rating: 4.6,
    price: 16.06,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808021472813.html?pdp_npi=4%40dis%21USD%21US%20%2450.13%21US%20%2416.06%21%21%21361.93%21115.94%21%402101c71a17439783646912876ecfa7%2112000046609828247%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008207787565&gatewayAdapt=glo2usa'
  },
  // Add more mock products as needed
  {
    id: '3',
    name: 'CT Toys Spiderman (Ben Reilly)',
    image: 'https://imgs.search.brave.com/mPHTj-_MP9a0w4ReC38eUxdfjpAp91FIooTP92Kpy24/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnJl/ZGQuaXQvcTI2Y2xt/cHJpOTVlMS5qcGVn',
    releaseYear: 2025,
    rating: 4.7,
    price: 16.06,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808014773986.html?pdp_npi=4%40dis%21USD%21US%20%2451.60%21US%20%2416.72%21%21%21372.59%21120.74%21%402101c71a17439783646912876ecfa7%2112000046412799421%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008201088738&gatewayAdapt=glo2usa'
  },
];

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating})</span>
    </div>
  );
};

const Catalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'price'>('newest');

  const filteredProducts = mockProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.releaseYear - a.releaseYear;
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-black shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-white">CTVerse</a>
          </div>
        </div>
      </nav>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold text-gray-800">CT Toys Catalog</h1>
          <div className="flex space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search figures..."
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
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'rating' | 'price')}
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Lowest Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative pb-[100%]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Released: {product.releaseYear}</span>
                  <span className="text-lg font-bold text-red-600">${product.price}</span>
                </div>
                <RatingStars rating={product.rating} />
                <a
                  href={product.aliExpressUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors duration-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Buy Now</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;