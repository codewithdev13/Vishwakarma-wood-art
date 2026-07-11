import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductImageLightbox from '../components/ProductImageLightbox';
import ProductMeta from '../components/ProductMeta';
import { openWhatsAppEnquiry, shareProduct } from '../utils/productShare';

const ProductDetails = ({ shortlist, onToggleShortlist }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-2xl text-primary font-bold animate-pulse">Loading craftsmanship...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="text-2xl text-gray-500 mb-6">Product not found.</div>
        <Link to="/" className="text-primary hover:underline">Return to Collection</Link>
      </div>
    );
  }

  // Fallback to imageUrl if images array is empty or undefined
  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.imageUrl || 'https://images.unsplash.com/photo-1546200230-01ccceb38ab6?q=80&w=600&auto=format&fit=crop&text=Wooden+Texture'];

  const mainImage = images[activeImageIndex];

  const isShortlisted = shortlist ? shortlist.some(item => item._id === product._id) : false;

  const handleWhatsApp = () => {
    openWhatsAppEnquiry(product);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await shareProduct(product, mainImage);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <ProductMeta product={product} imageUrl={mainImage} />
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-text-muted hover:text-accent mb-10 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Collection
        </Link>

        <div className="bg-background rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row border border-primary/10">

          {/* Image Gallery Column */}
          <div className="md:w-1/2 p-6 md:p-10 bg-background-alt/30 border-b md:border-b-0 md:border-r border-primary/10 flex flex-col min-h-0">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group w-full rounded-2xl overflow-hidden bg-background shadow-sm mb-6 flex items-center justify-center max-md:p-0 max-md:m-0 md:aspect-square md:p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 border border-primary/10"
              aria-label="Open full-screen product image"
            >
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-auto max-h-[min(85vh,920px)] md:max-h-none md:h-full object-contain pointer-events-none group-hover:opacity-95 transition-opacity"
              />
            </button>

            {images.length > 1 && (
              <div className="flex-shrink-0 flex gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      activeImageIndex === idx 
                        ? 'border-accent ring-2 ring-accent/30 shadow-md scale-105' 
                        : 'border-primary/10 opacity-60 hover:opacity-100 hover:scale-102'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary mb-4 leading-tight">{product.name}</h1>
            <p className="text-2xl font-bold text-accent mb-6">₹{product.price ? product.price.toLocaleString('en-IN') : '0'}</p>

            <div className="mb-8">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 border-b border-primary/10 pb-2">Product Description</h3>
              <p className="text-text-muted text-sm leading-relaxed whitespace-pre-line">{product.description || "An elegant, handcrafted premium wooden structure designed to bring a profound sense of peace and luxury into your home."}</p>
            </div>

            {/* Premium Structured Specifications (Care, Timeline, Materials) */}
            {/* Real Copy is rendered below, comments are left in code to detail availability */}
            {/* Comment: Care instructions & Delivery details are static and handcrafted specifically for wooden temple structures */}
            <div className="mb-8 border-t border-primary/10 pt-6">
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-accent/10 text-primary mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">Care Instructions</h4>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Gently wipe with a soft, dry micro-fiber cloth. Avoid harsh chemical cleansers, water spills, and direct exposure to intense heat or direct sunlight to preserve the premium natural wood polish.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border-t border-primary/10 pt-4">
                  <div className="p-2 rounded-lg bg-accent/10 text-primary mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">Estimated Delivery Timeline</h4>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Each temple is meticulously handcrafted to order by senior artisans. The typical crafting, quality audit, and delivery timeline ranges between 6 to 8 weeks. White-glove fully insured transit is standard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border-t border-primary/10 pt-4">
                  <div className="p-2 rounded-lg bg-accent/10 text-primary mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">Premium Materials</h4>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Constructed utilizing hand-selected, seasoned premium Teakwood and Rosewood (Seesham) known for longevity and natural wood grain. Varnished with eco-friendly poly-urethane finish and traditional gold-leaf highlights.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-background-alt p-5 rounded-2xl border border-primary/10">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">Wood Type</span>
                <span className="block text-base font-bold text-primary">{product.woodType || 'Premium Hardwood'}</span>
              </div>
              <div className="bg-background-alt p-5 rounded-2xl border border-primary/10">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">Availability</span>
                <span className="block text-base font-bold text-primary">{product.stock > 0 ? `${product.stock} in stock` : 'Made to Order'}</span>
              </div>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleWhatsApp}
                className="flex-1 py-4 px-6 rounded-xl bg-accent hover:bg-accent/90 text-primary font-bold text-base transition-all duration-300 shadow-md hover:shadow-lg flex justify-center items-center gap-3 transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Enquire
              </button>

              <button
                onClick={handleShare}
                disabled={isSharing}
                className="flex-1 py-4 px-6 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white font-bold text-base transition-all duration-300 shadow-sm hover:shadow flex justify-center items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                {isSharing ? 'Sharing...' : 'Share'}
              </button>

              <button
                onClick={() => onToggleShortlist(product)}
                className={`flex-1 py-4 px-6 rounded-xl border text-base font-bold transition-all duration-300 shadow-sm hover:shadow flex justify-center items-center gap-3 cursor-pointer uppercase tracking-wider ${
                  isShortlisted
                    ? 'border-rose-300 bg-rose-50/75 text-rose-600 hover:bg-rose-100/50'
                    : 'border-primary/20 text-primary hover:bg-primary/5'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isShortlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="w-5 h-5 transition-transform duration-300 active:scale-125"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                {isShortlisted ? 'Saved' : 'Save'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {lightboxOpen && (
        <ProductImageLightbox
          images={images}
          activeIndex={activeImageIndex}
          onClose={() => setLightboxOpen(false)}
          onSelectIndex={setActiveImageIndex}
          alt={product.name}
        />
      )}
    </div>
  );
};

export default ProductDetails;
