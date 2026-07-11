import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import ProductDetails from './pages/ProductDetails';
import Admin from './pages/Admin';
import HeroLanding from './components/HeroLanding';
import ProductCatalog from './components/ProductCatalog';
import ShortlistDrawer from './components/ShortlistDrawer';

// Set dynamic base URL for production APIs (Vercel) vs local dev
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

// Reusable storefront layout component
const StorefrontLayout = ({
  children,
  shortlist,
  setIsShortlistOpen,
  isAdmin,
  showAdminTable,
  setShowAdminTable,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  products,
  handleDeleteProduct
}) => {
  return (
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
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1 rounded transition-colors cursor-pointer"
            >
              Manage Products
            </button>
            <Link to="/admin" className="bg-white text-wood-dark px-3 py-1 rounded font-semibold hover:bg-gray-100 transition-colors">
              + Add New Product
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center relative">
          <Link to="/" className="text-xl md:text-2xl font-heading font-extrabold text-wood-dark tracking-tight hover:text-wood transition-colors">
            Vishwakarma Wood Art
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Premium Luxury
            </p>
            
            {/* Shortlist Header Button (Desktop) */}
            <button
              onClick={() => setIsShortlistOpen(true)}
              className="relative p-2 text-stone-600 hover:text-rose-500 transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer"
              title="View Shortlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              <span className="text-sm font-semibold">Shortlist</span>
              {shortlist.length > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {shortlist.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Shortlist Header Button (Mobile) */}
            <button
              onClick={() => setIsShortlistOpen(true)}
              className="relative p-2 text-stone-600 hover:text-rose-500 transition-colors flex items-center focus:outline-none cursor-pointer"
              title="View Shortlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {shortlist.length > 0 && (
                <span className="absolute -top-0.5 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {shortlist.length}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-wood-dark cursor-pointer"
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
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white absolute w-full top-full left-0 py-4 px-6 shadow-lg z-[60]">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Premium Luxury
            </p>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-grow">
        {children}
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Vishwakarma Wood Art. All rights reserved.</p>
        </div>
      </footer>

      {/* Manage Products Modal */}
      {isAdmin && showAdminTable && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 font-heading">Inventory Management</h2>
              <button onClick={() => setShowAdminTable(false)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
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
                        <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:text-red-700 hover:underline font-medium px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors cursor-pointer">
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
  );
};

function App() {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminTable, setShowAdminTable] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Shortlist state management
  const [shortlist, setShortlist] = useState([]);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);

  useEffect(() => {
    setIsAdmin(!!sessionStorage.getItem('adminToken'));
    
    // Load shortlist from localStorage
    const saved = localStorage.getItem('wood_art_shortlist');
    if (saved) {
      try {
        setShortlist(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse shortlist from localStorage:', err);
      }
    }
  }, []);

  const handleToggleShortlist = (product) => {
    setShortlist(prev => {
      const exists = prev.some(item => item._id === product._id);
      let updated;
      if (exists) {
        updated = prev.filter(item => item._id !== product._id);
      } else {
        updated = [...prev, product];
      }
      localStorage.setItem('wood_art_shortlist', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFromShortlist = (product) => {
    setShortlist(prev => {
      const updated = prev.filter(item => item._id !== product._id);
      localStorage.setItem('wood_art_shortlist', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p._id !== id));
      // Remove from shortlist if deleted
      setShortlist(prev => {
        const updated = prev.filter(item => item._id !== id);
        localStorage.setItem('wood_art_shortlist', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert('Error deleting product');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <StorefrontLayout
            shortlist={shortlist}
            setIsShortlistOpen={setIsShortlistOpen}
            isAdmin={isAdmin}
            showAdminTable={showAdminTable}
            setShowAdminTable={setShowAdminTable}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            products={products}
            handleDeleteProduct={handleDeleteProduct}
          >
            <HeroLanding />
            <ProductCatalog 
              isAdmin={isAdmin}
              products={products}
              setProducts={setProducts}
              handleDeleteProductOutside={handleDeleteProduct}
              shortlist={shortlist}
              onToggleShortlist={handleToggleShortlist}
            />
          </StorefrontLayout>
        } />
        
        <Route path="/product/:id" element={
          <StorefrontLayout
            shortlist={shortlist}
            setIsShortlistOpen={setIsShortlistOpen}
            isAdmin={isAdmin}
            showAdminTable={showAdminTable}
            setShowAdminTable={setShowAdminTable}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            products={products}
            handleDeleteProduct={handleDeleteProduct}
          >
            <ProductDetails 
              shortlist={shortlist}
              onToggleShortlist={handleToggleShortlist}
            />
          </StorefrontLayout>
        } />
        
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* Global Shortlist Drawer Panel */}
      <ShortlistDrawer
        isOpen={isShortlistOpen}
        onClose={() => setIsShortlistOpen(false)}
        shortlist={shortlist}
        onRemove={handleRemoveFromShortlist}
      />
    </Router>
  );
}

export default App;
