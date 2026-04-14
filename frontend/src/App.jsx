import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import ProductDetails from './pages/ProductDetails';
import Admin from './pages/Admin';
import HeroLanding from './components/HeroLanding';
import ProductCatalog from './components/ProductCatalog';

// Set dynamic base URL for production APIs (Vercel) vs local dev
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

function App() {
  const [products, setProducts] = useState([]);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminTable, setShowAdminTable] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAdmin(!!sessionStorage.getItem('adminToken'));
  }, []);

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

            <HeroLanding />
            
            <ProductCatalog 
              isAdmin={isAdmin}
              products={products}
              setProducts={setProducts}
              handleDeleteProductOutside={handleDeleteProduct}
            />
            
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
            
          </div>
        } />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
