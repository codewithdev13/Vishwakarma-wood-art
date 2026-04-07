import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  const handleWhatsApp = () => {
    const textPart = `Hi, I am interested in this product: ${product.name}`;
    const whatsappUrl = `https://wa.me/918780829804?text=${encodeURIComponent(textPart)}%0A%0A${mainImage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-warm py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-secondary hover:text-primary mb-10 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Collection
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

          {/* Image Gallery Column */}
          <div className="md:w-1/2 p-6 md:p-10 bg-stone-50 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col">
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-sm mb-6 flex items-center justify-center p-4">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-4 leading-tight">{product.name}</h1>
            <p className="text-2xl font-bold text-primary mb-8">₹{product.price ? product.price.toFixed(2) : '0.00'}</p>

            <div className="mb-10">
              <h3 className="text-lg font-heading font-semibold text-secondary mb-3 border-b border-gray-100 pb-2">Product Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description || "An elegant, handcrafted premium wooden structure designed to bring a profound sense of peace and luxury into your home."}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="bg-stone-50 p-4 rounded-xl border border-gray-100">
                <span className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Wood Type</span>
                <span className="block text-lg font-medium text-secondary">{product.woodType || 'Premium Hardwood'}</span>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-gray-100">
                <span className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Availability</span>
                <span className="block text-lg font-medium text-secondary">{product.stock > 0 ? `${product.stock} in stock` : 'Made to Order'}</span>
              </div>
            </div>

            <div className="mt-auto">
              <button
                onClick={handleWhatsApp}
                className="w-full py-4 px-6 rounded-xl bg-primary hover:bg-[#b0912d] text-secondary font-bold text-lg transition-all shadow-lg hover:shadow-xl flex justify-center items-center gap-3 transform hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Enquire on WhatsApp
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
