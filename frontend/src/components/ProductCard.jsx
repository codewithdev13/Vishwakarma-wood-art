import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, isAdmin, onDelete }) => {
  const displayImage = (product.images && product.images.length > 0) ? product.images[0] : product.imageUrl;
  
  const handleWhatsApp = (e) => {
    e.preventDefault();
    const fallbackImage = 'https://images.unsplash.com/photo-1546200230-01ccceb38ab6?q=80&w=600&auto=format&fit=crop&text=Wooden+Texture';
    const imageUrl = displayImage || fallbackImage;
    const textPart = `Hi, I am interested in this product: ${product.name}`;
    const whatsappUrl = `https://wa.me/919510067135?text=${encodeURIComponent(textPart)}%0A%0A${imageUrl}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full mx-auto w-full border border-gray-100 group">
      <Link to={`/product/${product._id}`} className="flex-grow flex flex-col cursor-pointer">
        <div className="w-full h-72 mb-3 relative overflow-hidden rounded-t-xl bg-stone-50">
          <img
            src={displayImage || 'https://images.unsplash.com/photo-1546200230-01ccceb38ab6?q=80&w=600&auto=format&fit=crop&text=Wooden+Texture'}
            alt={product.name || 'Wooden Temple'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546200230-01ccceb38ab6?q=80&w=600&auto=format&fit=crop&text=Wooden+Texture';
            }}
          />
          {isAdmin && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
              className="absolute top-2 right-2 p-2.5 md:p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-500 hover:text-white transition-colors z-10 shadow-sm border border-red-200"
              title="Delete Product"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
        <div className="px-4 mb-2 flex-grow flex flex-col justify-start">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1 hover:text-wood-dark transition-colors">{product.name}</h3>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-base font-bold text-gray-900">₹{product.price ? product.price.toLocaleString('en-IN') : '0'}</span>
          </div>
        </div>
      </Link>
      <div className="flex justify-between items-center mt-auto pt-3 pb-3 px-4 border-t border-gray-100">
        <div className="flex flex-col">
          {product.size && <span className="text-[10px] text-gray-500 truncate max-w-[120px]">{product.size}</span>}
          {product.woodType && <span className="text-[10px] text-gray-400 truncate max-w-[100px]">{product.woodType}</span>}
        </div>
        
        <button
          onClick={handleWhatsApp}
          title="WhatsApp Enquiry"
          className="p-3 md:p-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-sm transition-colors cursor-pointer flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
