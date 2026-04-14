import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { WOOD_TYPES, SIZES, TEMPLE_STYLES } from '../constants/productOptions';

const ProductCatalog = ({ isAdmin, products, setProducts, handleDeleteProductOutside }) => {
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedWoodTypes, setSelectedWoodTypes] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

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
  }, [selectedWoodTypes, selectedStyle, selectedSize, setProducts]);

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
      if (handleDeleteProductOutside) {
        handleDeleteProductOutside(id);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting product');
    }
  };

  return (
    <main id="product-catalog" className="w-full max-w-[1400px] mx-auto py-12 md:py-16 px-4 flex-grow flex flex-col md:flex-row gap-8 scroll-mt-20">
      
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
      
    </main>
  );
};

export default ProductCatalog;
