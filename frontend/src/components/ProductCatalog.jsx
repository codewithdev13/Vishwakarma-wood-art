import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { WOOD_TYPES, SIZES, TEMPLE_STYLES } from '../constants/productOptions';

const ProductCatalog = ({ isAdmin, products, setProducts, handleDeleteProductOutside, shortlist, onToggleShortlist }) => {
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedWoodTypes, setSelectedWoodTypes] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    document.title = "Collection | Vishwakarma Wood Art";
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
    <main id="product-catalog" className="w-full max-w-[1400px] mx-auto py-12 md:py-16 px-6 flex-grow flex flex-col md:flex-row gap-10 scroll-mt-20">
      
      {/* Desktop Filter Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 bg-background-alt p-6 rounded-2xl shadow-sm border border-primary/10 h-fit sticky top-28">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-heading font-extrabold text-primary">Filters</h3>
          {(selectedWoodTypes.length > 0 || selectedStyle || selectedSize) && (
            <button onClick={clearFilters} className="text-xs text-accent font-semibold hover:text-primary transition-colors cursor-pointer">
              Clear All
            </button>
          )}
        </div>

        {/* Wood Type */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Wood Type</h4>
          <div className="flex flex-wrap gap-2">
            {WOOD_TYPES.map(wood => {
              const active = selectedWoodTypes.includes(wood);
              return (
                <button 
                  key={wood} 
                  onClick={() => handleWoodTypeChange(wood)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                    active 
                      ? 'bg-accent text-primary border-accent shadow-sm' 
                      : 'bg-background text-primary border-primary/20 hover:border-primary/50 hover:bg-background-alt'
                  }`}
                >
                  {wood}
                </button>
              );
            })}
          </div>
        </div>

        {/* Temple Style */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Temple Style</h4>
          <div className="flex flex-wrap gap-2">
            {TEMPLE_STYLES.map(style => {
              const active = selectedStyle === style;
              return (
                <button 
                  key={style} 
                  onClick={() => setSelectedStyle(active ? '' : style)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                    active 
                      ? 'bg-accent text-primary border-accent shadow-sm' 
                      : 'bg-background text-primary border-primary/20 hover:border-primary/50 hover:bg-background-alt'
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Size */}
        <div>
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Size</h4>
          <select 
            value={selectedSize} 
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full text-xs border-primary/20 bg-background text-primary rounded-xl shadow-sm focus:border-accent focus:ring-accent p-2.5 border outline-none transition-all duration-300 cursor-pointer"
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
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-2xl font-heading font-extrabold text-primary">
            Collection <span className="text-text-muted font-sans font-normal text-base">({products.length} designs)</span>
          </h2>
          <button 
            onClick={() => setIsFilterDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-primary/20 rounded-xl text-xs font-bold text-primary bg-background active:bg-primary/5 cursor-pointer shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
            </svg>
            Filters
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-primary font-heading font-semibold animate-pulse tracking-widest uppercase">Loading Craftsmanship...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                isAdmin={isAdmin}
                onDelete={() => handleDeleteProduct(product._id)}
                isShortlisted={shortlist ? shortlist.some(item => item._id === product._id) : false}
                onToggleShortlist={onToggleShortlist}
              />
            ))}
            {products.length === 0 && (
              <div className="col-span-full bg-background-alt rounded-2xl border border-primary/10 p-16 text-center">
                <div className="text-primary/45 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-2">No Products Found</h3>
                <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">No temples match the active filters. Adjust your filters or browse the full collection.</p>
                <button onClick={clearFilters} className="mt-6 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition-all shadow-md cursor-pointer">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      <div className={`md:hidden fixed inset-0 z-[150] transition-opacity duration-300 ${isFilterDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterDrawerOpen(false)}></div>
        
        <div className={`absolute bottom-0 w-full bg-background rounded-t-[2.5rem] shadow-2xl transition-transform duration-300 transform border-t border-primary/10 ${isFilterDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="p-6 overflow-auto max-h-[85vh] pb-8">
            <div className="flex justify-between items-center mb-6 border-b border-primary/10 pb-4">
              <h3 className="text-xl font-heading font-extrabold text-primary">Filters</h3>
              <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 bg-primary/5 rounded-full text-text-muted hover:text-primary transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Wood Type */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Wood Type</h4>
              <div className="flex flex-wrap gap-2">
                {WOOD_TYPES.map(wood => {
                  const active = selectedWoodTypes.includes(wood);
                  return (
                    <button 
                      key={wood} 
                      onClick={() => handleWoodTypeChange(wood)}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                        active 
                          ? 'bg-accent text-primary border-accent shadow-sm' 
                          : 'bg-background text-primary border-primary/20 active:bg-primary/5'
                      }`}
                    >
                      {wood}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Temple Style */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Temple Style</h4>
              <div className="flex flex-wrap gap-2">
                {TEMPLE_STYLES.map(style => {
                  const active = selectedStyle === style;
                  return (
                    <button 
                      key={style} 
                      onClick={() => setSelectedStyle(active ? '' : style)}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                        active 
                          ? 'bg-accent text-primary border-accent shadow-sm' 
                          : 'bg-background text-primary border-primary/20 active:bg-primary/5'
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Size</h4>
              <select 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full text-sm border-primary/20 bg-background text-primary rounded-xl shadow-sm focus:border-accent focus:ring-accent p-3.5 border outline-none transition-all duration-300"
              >
                <option value="">Any Size</option>
                {SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <div className="mt-8 flex gap-4">
              <button onClick={clearFilters} className="flex-1 py-3.5 border border-primary/20 text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors cursor-pointer text-xs">Clear All</button>
              <button onClick={() => setIsFilterDrawerOpen(false)} className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/95 transition-colors shadow-md cursor-pointer text-xs">Apply Filters</button>
            </div>
          </div>
        </div>
      </div>
      
    </main>
  );
};

export default ProductCatalog;
