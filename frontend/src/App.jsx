import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import ProductDetails from './pages/ProductDetails';
import Admin from './pages/Admin';
import { WOOD_TYPES, SIZES, TEMPLE_STYLES } from './constants/productOptions';

// Set dynamic base URL for production APIs (Vercel) vs local dev
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedWoodTypes, setSelectedWoodTypes] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminTable, setShowAdminTable] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    setIsAdmin(!!sessionStorage.getItem('adminToken'));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedWoodTypes.length > 0) params.append('woodType', selectedWoodTypes.join(','));
        if (selectedStyle) params.append('style', selectedStyle);
        if (selectedSize) params.append('size', selectedSize);

        const { data } = await axios.get(`/api/products?${params.toString()}`);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedWoodTypes, selectedStyle, selectedSize]);

  const handleWoodTypeChange = (wood) => {
    setSelectedWoodTypes(prev => 
      prev.includes(wood) ? prev.filter(w => w !== wood) : [...prev, wood]
    );
  };

  const clearFilters = () => {
    setSelectedWoodTypes([]);
    setSelectedStyle('');
    setSelectedSize('');
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting product');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen flex flex-col bg-stone-50 relative">
            
            {/* Admin Bar */}
            {isAdmin && (
              <div className="bg-wood-dark text-white px-6 py-2 flex justify-between items-center z-[100] relative text-sm shadow-md">
                <div className="font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Admin Mode Active
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowAdminTable(true)} 
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1 rounded transition-colors"
                  >
                    Manage Products
                  </button>
                  <Link to="/admin" className="bg-white text-wood-dark px-3 py-1 rounded font-semibold hover:bg-gray-100 transition-colors">
                    + Add New Product
                  </Link>
                </div>
              </div>
            )}

            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm transition-all">
              <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center relative">
                <h1 className="text-xl md:text-2xl font-heading font-extrabold text-wood-dark tracking-tight">
                  Wooden Temples & Art
                </h1>
                
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    Premium Luxury
                  </p>
                  <Link to="/admin" className="text-sm font-medium text-wood hover:text-wood-dark transition-colors">
                    {isAdmin ? 'Manage Shop' : 'Admin Portal'}
                  </Link>
                </div>

                {/* Mobile Hamburger Button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 -mr-2 text-gray-600 hover:text-wood-dark"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    )}
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Dropdown */}
              {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white absolute w-full top-full left-0 py-4 px-6 shadow-lg z-[60]">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                    Premium Luxury
                  </p>
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-base font-medium text-wood hover:text-wood-dark py-2"
                  >
                    {isAdmin ? 'Manage Shop' : 'Admin Portal Login'}
                  </Link>
                </div>
              )}
            </header>

            <main className="w-full max-w-[1400px] mx-auto py-4 md:py-8 px-4 flex-grow flex flex-col md:flex-row gap-8">
              
              {/* Desktop Filter Sidebar */}
              <aside className="hidden md:block w-64 flex-shrink-0 bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                  {(selectedWoodTypes.length > 0 || selectedStyle || selectedSize) && (
                    <button onClick={clearFilters} className="text-xs text-wood font-medium hover:underline">
                      Clear All
                    </button>
                  )}
                </div>

                {/* Wood Type */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Wood Type</h4>
                  <div className="space-y-2">
                    {WOOD_TYPES.map(wood => (
                      <label key={wood} className="flex items-center space-x-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedWoodTypes.includes(wood)}
                          onChange={() => handleWoodTypeChange(wood)}
                          className="w-4 h-4 text-wood focus:ring-wood border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{wood}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Temple Style */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Temple Style</h4>
                  <div className="space-y-2">
                    {TEMPLE_STYLES.map(style => (
                      <label key={style} className="flex items-center space-x-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="templeStyle"
                          checked={selectedStyle === style}
                          onChange={() => setSelectedStyle(style)}
                          className="w-4 h-4 text-wood focus:ring-wood border-gray-300"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Size</h4>
                  <select 
                    value={selectedSize} 
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-wood focus:ring-wood p-2 border"
                  >
                    <option value="">Any Size</option>
                    {SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </aside>

              {/* Product Grid Area */}
              <div className="flex-grow">
                <div className="mb-4 md:mb-6 flex justify-between items-end">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    Results <span className="text-gray-500 font-normal text-base md:text-lg">({products.length})</span>
                  </h2>
                  <button 
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="md:hidden flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white active:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                    </svg>
                    Filters
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="text-xl text-wood font-bold animate-pulse">Loading craftsmanship...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
                    {products.map((product) => (
                      <ProductCard 
                        key={product._id} 
                        product={product} 
                        isAdmin={isAdmin}
                        onDelete={() => handleDeleteProduct(product._id)}
                      />
                    ))}
                    {products.length === 0 && (
                      <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="text-gray-400 mb-2">
                          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                        <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                        <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-wood text-white text-sm rounded-lg hover:bg-wood-dark transition-colors">
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </main>
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className="fixed bottom-6 right-6 w-14 h-14 bg-wood hover:bg-wood-dark text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 z-50"
                title="Add Product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            )}

            <footer className="w-full border-t border-gray-200 bg-white py-6 mt-auto">
              <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Wooden Temples & Art. All rights reserved.</p>
                <Link to="/admin" className="hover:text-wood-dark font-medium transition-colors">
                  {isAdmin ? 'Manage Shop' : 'Admin Portal'}
                </Link>
              </div>
            </footer>
            
            {/* Manage Products Modal */}
            {isAdmin && showAdminTable && (
              <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-800 font-heading">Inventory Management</h2>
                    <button onClick={() => setShowAdminTable(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="overflow-auto p-0 flex-grow">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead className="sticky top-0 bg-white shadow-sm z-10">
                        <tr className="bg-stone-100 text-gray-600 uppercase tracking-wider">
                          <th className="p-4 font-semibold border-b">Image</th>
                          <th className="p-4 font-semibold border-b">Product Name</th>
                          <th className="p-4 font-semibold border-b">Price</th>
                          <th className="p-4 font-semibold border-b">Wood Type</th>
                          <th className="p-4 font-semibold border-b text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p._id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                            <td className="p-3">
                               <img src={(p.images && p.images.length > 0) ? p.images[0] : p.imageUrl} alt={p.name} className="w-12 h-12 rounded object-cover border" />
                            </td>
                            <td className="p-4 font-medium text-gray-800">{p.name}</td>
                            <td className="p-4 font-bold text-gray-900">₹{p.price.toLocaleString('en-IN')}</td>
                            <td className="p-4 text-gray-600">
                               <span className="px-2 py-1 bg-stone-200 text-stone-700 rounded-md text-xs">{p.woodType}</span>
                            </td>
                            <td className="p-4 text-right">
                              <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:text-red-700 hover:underline font-medium px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors">
                                Delete Item
                              </button>
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr><td colSpan="5" className="p-8 text-center text-gray-500">Inventory is empty.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Filter Drawer */}
            <div className={`md:hidden fixed inset-0 z-[150] transition-opacity duration-300 ${isFilterDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterDrawerOpen(false)}></div>
              
              <div className={`absolute bottom-0 w-full bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 transform ${isFilterDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="p-6 overflow-auto max-h-[85vh] pb-8">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                    <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 active:bg-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Wood Type */}
                  <div className="mb-6">
                    <h4 className="text-base font-semibold text-gray-700 mb-3">Wood Type</h4>
                    <div className="space-y-4">
                      {WOOD_TYPES.map(wood => (
                        <label key={wood} className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={selectedWoodTypes.includes(wood)}
                            onChange={() => handleWoodTypeChange(wood)}
                            className="w-5 h-5 text-wood focus:ring-wood border-gray-300 rounded"
                          />
                          <span className="text-base text-gray-700">{wood}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Temple Style */}
                  <div className="mb-6">
                    <h4 className="text-base font-semibold text-gray-700 mb-3">Temple Style</h4>
                    <div className="space-y-4">
                      {TEMPLE_STYLES.map(style => (
                        <label key={style} className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name="mobileTempleStyle"
                            checked={selectedStyle === style}
                            onChange={() => setSelectedStyle(style)}
                            className="w-5 h-5 text-wood focus:ring-wood border-gray-300"
                          />
                          <span className="text-base text-gray-700">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="mb-6">
                    <h4 className="text-base font-semibold text-gray-700 mb-3">Size</h4>
                    <select 
                      value={selectedSize} 
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full text-base border-gray-300 rounded-lg shadow-sm focus:border-wood focus:ring-wood p-3 border bg-white"
                    >
                      <option value="">Any Size</option>
                      {SIZES.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mt-8 flex gap-4">
                    <button onClick={clearFilters} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium active:bg-gray-50">Clear</button>
                    <button onClick={() => setIsFilterDrawerOpen(false)} className="flex-1 py-3 bg-wood text-white rounded-xl font-medium active:bg-wood-dark shadow-md">Apply Filters</button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        } />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
