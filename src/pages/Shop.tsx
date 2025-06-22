import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Filter, 
  Search, 
  Star, 
  Heart, 
  Grid3X3, 
  List,
  Plus,
  Minus,
  MapPin,
  Verified,
  Eye,
  Share2,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';

const Shop = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [savedProducts, setSavedProducts] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Prosthodontics',
    'Oral and Maxillofacial Surgery',
    'Implant Dentistry',
    'Crown & Bridge',
    'Operative Dentistry'
  ];

  const companies = [
    {
      id: 'dentsply',
      name: 'Dentsply Sirona',
      logo: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true,
      followers: '125K',
      description: 'Leading prosthodontic solutions',
      featured: true,
      specialties: ['Prosthodontics', 'Crown & Bridge', 'Operative Dentistry']
    },
    {
      id: 'straumann',
      name: 'Straumann Group',
      logo: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true,
      followers: '156K',
      description: 'Implant solutions leader',
      featured: true,
      specialties: ['Implant Dentistry', 'Prosthodontics', 'Oral and Maxillofacial Surgery']
    },
    {
      id: 'nobel',
      name: 'Nobel Biocare',
      logo: 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true,
      followers: '134K',
      description: 'Premium implant systems',
      featured: true,
      specialties: ['Implant Dentistry', 'Prosthodontics']
    },
    {
      id: 'zimmer',
      name: 'Zimmer Biomet',
      logo: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true,
      followers: '98K',
      description: 'Surgical excellence',
      featured: true,
      specialties: ['Oral and Maxillofacial Surgery', 'Implant Dentistry']
    },
    {
      id: 'ivoclar',
      name: 'Ivoclar Vivadent',
      logo: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true,
      followers: '112K',
      description: 'Aesthetic dental materials',
      featured: false,
      specialties: ['Prosthodontics', 'Crown & Bridge', 'Operative Dentistry']
    },
    {
      id: 'kavo',
      name: 'KaVo Kerr',
      logo: 'https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true,
      followers: '89K',
      description: 'Surgical instruments',
      featured: false,
      specialties: ['Oral and Maxillofacial Surgery', 'Operative Dentistry']
    }
  ];

  const products = [
    // Prosthodontics Products
    {
      id: '1',
      name: 'IPS e.max CAD Blocks',
      company: 'Ivoclar Vivadent',
      companyId: 'ivoclar',
      price: 289,
      originalPrice: 320,
      rating: 4.9,
      reviews: 234,
      image: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Prosthodontics',
      inStock: true,
      badge: 'Premium',
      views: '3.2K',
      description: 'High-strength lithium disilicate ceramic blocks for crowns and veneers',
      specifications: ['Superior aesthetics', 'High translucency', 'Excellent strength', 'CAD/CAM compatible'],
      discount: 10
    },
    {
      id: '2',
      name: 'CEREC Primescan',
      company: 'Dentsply Sirona',
      companyId: 'dentsply',
      price: 28999,
      rating: 4.8,
      reviews: 127,
      image: 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Prosthodontics',
      inStock: true,
      badge: 'Best Seller',
      views: '4.1K',
      description: 'Revolutionary intraoral scanner for digital impressions',
      specifications: ['Wireless design', 'HD color imaging', 'Real-time processing', 'AI-powered precision']
    },
    {
      id: '3',
      name: 'IPS Empress Direct Veneering',
      company: 'Ivoclar Vivadent',
      companyId: 'ivoclar',
      price: 345,
      rating: 4.7,
      reviews: 189,
      image: 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Prosthodontics',
      inStock: true,
      badge: 'Professional Choice',
      views: '2.8K',
      description: 'Premium veneering material for crowns and bridges',
      specifications: ['Excellent aesthetics', 'Easy application', 'Long-lasting results', 'Natural fluorescence']
    },
    {
      id: '4',
      name: 'Temp-Bond Clear Cement',
      company: 'KaVo Kerr',
      companyId: 'kavo',
      price: 89,
      rating: 4.6,
      reviews: 312,
      image: 'https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Prosthodontics',
      inStock: true,
      views: '1.9K',
      description: 'Temporary cement for provisional restorations',
      specifications: ['Easy removal', 'Excellent retention', 'Biocompatible', 'Radiopaque']
    },

    // Oral and Maxillofacial Surgery Products
    {
      id: '5',
      name: 'Surgical Forceps Pro Set',
      company: 'KaVo Kerr',
      companyId: 'kavo',
      price: 899,
      rating: 4.8,
      reviews: 156,
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Oral and Maxillofacial Surgery',
      inStock: true,
      badge: 'Surgical Grade',
      views: '2.1K',
      description: 'Professional surgical forceps collection for extractions',
      specifications: ['Stainless steel', 'Autoclavable', 'Ergonomic grip', 'German engineering']
    },
    {
      id: '6',
      name: 'Piezo Surgery Unit',
      company: 'Zimmer Biomet',
      companyId: 'zimmer',
      price: 15999,
      rating: 4.9,
      reviews: 89,
      image: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Oral and Maxillofacial Surgery',
      inStock: true,
      badge: 'Innovation',
      views: '3.5K',
      description: 'Ultrasonic bone surgery system for precise osteotomy',
      specifications: ['Selective cutting', 'Minimal trauma', 'Enhanced healing', 'Multiple tips included']
    },
    {
      id: '7',
      name: 'Luxation Elevator Set',
      company: 'KaVo Kerr',
      companyId: 'kavo',
      price: 456,
      rating: 4.7,
      reviews: 203,
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Oral and Maxillofacial Surgery',
      inStock: true,
      views: '1.7K',
      description: 'Precision elevators for atraumatic tooth extraction',
      specifications: ['Sharp cutting edges', 'Comfortable handles', 'Various sizes', 'Sterilizable']
    },
    {
      id: '8',
      name: 'Bone Grafting Material',
      company: 'Zimmer Biomet',
      companyId: 'zimmer',
      price: 234,
      rating: 4.8,
      reviews: 167,
      image: 'https://images.pexels.com/photos/263391/pexels-photo-263391.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Oral and Maxillofacial Surgery',
      inStock: true,
      badge: 'Biocompatible',
      views: '2.3K',
      description: 'Synthetic bone graft for ridge augmentation',
      specifications: ['Osteoconductive', 'Resorbable', 'Easy handling', 'Proven results']
    },

    // Implant Dentistry Products
    {
      id: '9',
      name: 'Straumann BLX Implant System',
      company: 'Straumann Group',
      companyId: 'straumann',
      price: 450,
      rating: 4.9,
      reviews: 298,
      image: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Implant Dentistry',
      inStock: true,
      badge: 'Gold Standard',
      views: '4.8K',
      description: 'Premium dental implant with superior osseointegration',
      specifications: ['SLActive surface', 'Immediate loading', 'High success rate', 'Proven longevity']
    },
    {
      id: '10',
      name: 'NobelActive Implants',
      company: 'Nobel Biocare',
      companyId: 'nobel',
      price: 425,
      rating: 4.8,
      reviews: 245,
      image: 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Implant Dentistry',
      inStock: true,
      badge: 'Immediate Loading',
      views: '3.9K',
      description: 'Self-drilling implant for immediate placement',
      specifications: ['Dual-function design', 'Enhanced stability', 'Condensing properties', 'TiUnite surface']
    },
    {
      id: '11',
      name: 'Straumann CARES Abutments',
      company: 'Straumann Group',
      companyId: 'straumann',
      price: 280,
      rating: 4.7,
      reviews: 189,
      image: 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Implant Dentistry',
      inStock: true,
      badge: 'Custom Made',
      views: '2.6K',
      description: 'Custom abutments for optimal prosthetic solutions',
      specifications: ['CAD/CAM manufactured', 'Perfect fit', 'Biocompatible materials', 'Aesthetic emergence']
    },
    {
      id: '12',
      name: 'Implant Drill Kit',
      company: 'Nobel Biocare',
      companyId: 'nobel',
      price: 1299,
      rating: 4.8,
      reviews: 134,
      image: 'https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Implant Dentistry',
      inStock: true,
      views: '2.1K',
      description: 'Complete surgical drill kit for implant placement',
      specifications: ['Precision drilling', 'Multiple sizes', 'Irrigation system', 'Depth control']
    },

    // Crown & Bridge Products
    {
      id: '13',
      name: 'Zirconia Crown Blanks',
      company: 'Ivoclar Vivadent',
      companyId: 'ivoclar',
      price: 156,
      rating: 4.6,
      reviews: 278,
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Crown & Bridge',
      inStock: true,
      badge: 'High Strength',
      views: '2.4K',
      description: 'High-strength zirconia blanks for crown fabrication',
      specifications: ['Superior strength', 'Natural translucency', 'Easy milling', 'Stain resistant']
    },
    {
      id: '14',
      name: 'RelyX Ultimate Cement',
      company: 'Dentsply Sirona',
      companyId: 'dentsply',
      price: 89,
      rating: 4.7,
      reviews: 345,
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Crown & Bridge',
      inStock: true,
      views: '1.8K',
      description: 'Adhesive resin cement for indirect restorations',
      specifications: ['Dual-cure formula', 'High bond strength', 'Easy cleanup', 'Fluoride release']
    },
    {
      id: '15',
      name: 'Impression Material Kit',
      company: 'Dentsply Sirona',
      companyId: 'dentsply',
      price: 234,
      rating: 4.5,
      reviews: 198,
      image: 'https://images.pexels.com/photos/263391/pexels-photo-263391.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Crown & Bridge',
      inStock: true,
      views: '1.5K',
      description: 'Precision impression material for crown and bridge work',
      specifications: ['High accuracy', 'Dimensional stability', 'Easy mixing', 'Pleasant taste']
    },

    // Operative Dentistry Products
    {
      id: '16',
      name: 'Tetric EvoCeram Composite',
      company: 'Ivoclar Vivadent',
      companyId: 'ivoclar',
      price: 189,
      rating: 4.6,
      reviews: 412,
      image: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Operative Dentistry',
      inStock: true,
      badge: 'Universal',
      views: '3.1K',
      description: 'Universal composite for all cavity classes',
      specifications: ['Natural fluorescence', 'Easy handling', 'Excellent polishability', 'Low shrinkage']
    },
    {
      id: '17',
      name: 'Optibond FL Adhesive',
      company: 'KaVo Kerr',
      companyId: 'kavo',
      price: 145,
      rating: 4.8,
      reviews: 289,
      image: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Operative Dentistry',
      inStock: true,
      badge: 'Gold Standard',
      views: '2.7K',
      description: 'Total-etch adhesive system for direct restorations',
      specifications: ['High bond strength', 'Low technique sensitivity', 'Proven longevity', 'Fluoride release']
    },
    {
      id: '18',
      name: 'Carbide Bur Set',
      company: 'Dentsply Sirona',
      companyId: 'dentsply',
      price: 78,
      rating: 4.5,
      reviews: 356,
      image: 'https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Operative Dentistry',
      inStock: true,
      views: '1.9K',
      description: 'Professional carbide burs for cavity preparation',
      specifications: ['Sharp cutting', 'Smooth operation', 'Various shapes', 'Long-lasting']
    }
  ];

  const stories = [
    { company: 'Straumann', image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100', active: true },
    { company: 'Nobel Biocare', image: 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=100', active: false },
    { company: 'Dentsply Sirona', image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=100', active: true },
    { company: 'Ivoclar Vivadent', image: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=100', active: false },
  ];

  const addToCart = (productId: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1)
    }));
  };

  const toggleLike = (productId: string) => {
    setLikedProducts(prev =>
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSave = (productId: string) => {
    setSavedProducts(prev =>
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const totalCartItems = Object.values(cartItems).reduce((sum, count) => sum + count, 0);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const featuredCompanies = companies.filter(c => c.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Professional Dental Marketplace</h1>
          <p className="text-gray-600">Specialized products for prosthodontics, surgery, and implant dentistry</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart ({totalCartItems})
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="mb-8">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {stories.map((story, index) => (
            <div key={index} className="flex-shrink-0 text-center">
              <div className={`w-16 h-16 rounded-full p-0.5 ${story.active ? 'bg-gradient-to-tr from-blue-400 to-purple-600' : 'bg-gray-300'}`}>
                <img
                  src={story.image}
                  alt={story.company}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate w-16">{story.company}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Companies */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Leading Dental Companies</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCompanies.map((company) => (
            <div key={company.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{company.name}</h3>
                    {company.verified && (
                      <Verified className="h-4 w-4 text-blue-500 ml-1 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{company.followers} followers</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">{company.description}</p>
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {company.specialties.slice(0, 2).map((specialty, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {specialty}
                    </span>
                  ))}
                  {company.specialties.length > 2 && (
                    <span className="text-xs text-gray-500">+{company.specialties.length - 2}</span>
                  )}
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search prosthodontic, surgical, and implant products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>Sort by: Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
              <option>Newest</option>
            </select>
            <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm">
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
            {viewMode === 'grid' ? (
              <>
                {/* Product Image */}
                <div className="relative group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    {product.badge && (
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        product.badge === 'Best Seller' ? 'bg-orange-100 text-orange-800' :
                        product.badge === 'Premium' ? 'bg-purple-100 text-purple-800' :
                        product.badge === 'Professional Choice' ? 'bg-blue-100 text-blue-800' :
                        product.badge === 'Surgical Grade' ? 'bg-red-100 text-red-800' :
                        product.badge === 'Innovation' ? 'bg-pink-100 text-pink-800' :
                        product.badge === 'Gold Standard' ? 'bg-yellow-100 text-yellow-800' :
                        product.badge === 'Immediate Loading' ? 'bg-green-100 text-green-800' :
                        product.badge === 'Custom Made' ? 'bg-indigo-100 text-indigo-800' :
                        product.badge === 'High Strength' ? 'bg-gray-100 text-gray-800' :
                        product.badge === 'Biocompatible' ? 'bg-teal-100 text-teal-800' :
                        product.badge === 'Universal' ? 'bg-cyan-100 text-cyan-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                    {product.discount && (
                      <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                        -{product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleLike(product.id)}
                      className={`p-2 rounded-full shadow-sm transition-colors ${
                        likedProducts.includes(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${likedProducts.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => toggleSave(product.id)}
                      className={`p-2 rounded-full shadow-sm transition-colors ${
                        savedProducts.includes(product.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${savedProducts.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 bg-white text-gray-600 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* View Count */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {product.views}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Company Info */}
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={companies.find(c => c.id === product.companyId)?.logo}
                      alt={product.company}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">{product.company}</span>
                    {companies.find(c => c.id === product.companyId)?.verified && (
                      <Verified className="h-3 w-3 text-blue-500" />
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">${product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Add to Cart */}
                  {cartItems[product.id] > 0 ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-semibold">{cartItems[product.id]}</span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-sm text-green-600 font-medium">In Cart</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={!product.inStock}
                      className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-colors font-medium ${
                        product.inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* List View */
              <div className="flex">
                <div className="relative w-48 h-32 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <span className={`absolute top-1 left-1 px-2 py-1 text-xs font-semibold rounded ${
                      product.badge === 'Best Seller' ? 'bg-orange-100 text-orange-800' :
                      product.badge === 'Premium' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <img
                          src={companies.find(c => c.id === product.companyId)?.logo}
                          alt={product.company}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-600">{product.company}</span>
                        {companies.find(c => c.id === product.companyId)?.verified && (
                          <Verified className="h-3 w-3 text-blue-500" />
                        )}
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">${product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleLike(product.id)}
                          className={`p-2 rounded-full transition-colors ${
                            likedProducts.includes(product.id)
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${likedProducts.includes(product.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => toggleSave(product.id)}
                          className={`p-2 rounded-full transition-colors ${
                            savedProducts.includes(product.id)
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Bookmark className={`h-4 w-4 ${savedProducts.includes(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {cartItems[product.id] > 0 ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-lg font-semibold">{cartItems[product.id]}</span>
                          <button
                            onClick={() => addToCart(product.id)}
                            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product.id)}
                          disabled={!product.inStock}
                          className={`py-2 px-4 rounded-lg flex items-center transition-colors ${
                            product.inStock
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
          Load More Products
        </button>
      </div>
    </div>
  );
};

export default Shop;