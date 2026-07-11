import React from 'react';
import { Link } from 'react-router-dom';
import { openShortlistWhatsAppEnquiry } from '../utils/productShare';

const ShortlistDrawer = ({ isOpen, onClose, shortlist, onRemove }) => {
  const handleWhatsAppEnquiry = () => {
    if (shortlist.length === 0) return;
    openShortlistWhatsAppEnquiry(shortlist);
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex justify-end transition-all duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
      aria-labelledby="shortlist-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-305 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Slide-over panel */}
      <div
        className={`relative w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm">
          <div>
            <h2 id="shortlist-title" className="text-2xl font-heading font-extrabold text-secondary flex items-center gap-2">
              My Shortlist
              <span className="text-sm font-sans font-medium px-2 py-0.5 bg-warm text-wood rounded-full border border-primary/20">
                {shortlist.length} {shortlist.length === 1 ? 'item' : 'items'}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">Review saved items and enquire in bulk</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close shortlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List of items */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {shortlist.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center px-4">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-300 border border-rose-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-stone-800 font-heading mb-2">Your Shortlist is Empty</h3>
              <p className="text-sm text-stone-500 max-w-[280px] leading-relaxed mb-8">
                Discover our premium collection of handcrafted wooden temples and tap the heart icon to save them.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-secondary hover:bg-stone-800 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all focus:outline-none cursor-pointer"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            shortlist.map((item) => {
              const displayImage = (item.images && item.images.length > 0) ? item.images[0] : item.imageUrl;
              return (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-xl border border-stone-150 shadow-sm flex gap-4 items-center group relative hover:border-primary/30 transition-all hover:shadow-md"
                >
                  <img
                    src={displayImage || 'https://images.unsplash.com/photo-1546200230-01ccceb38ab6?q=80&w=600&auto=format&fit=crop&text=Wooden+Texture'}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-stone-50 border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0 pr-8">
                    <Link
                      to={`/product/${item._id}`}
                      onClick={onClose}
                      className="font-semibold text-stone-800 text-sm hover:text-primary transition-colors block truncate"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-stone-500 mt-0.5">{item.woodType || 'Premium Wood'}</p>
                    <p className="text-sm font-bold text-primary mt-1">
                      ₹{item.price ? item.price.toLocaleString('en-IN') : '0'}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(item)}
                    className="absolute right-4 p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all focus:outline-none cursor-pointer"
                    title="Remove from shortlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {shortlist.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-200 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-stone-500">Shortlisted Items</span>
              <span className="text-lg font-bold text-stone-850">{shortlist.length}</span>
            </div>
            <button
              onClick={handleWhatsAppEnquiry}
              className="w-full py-4 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-md shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Enquire on WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistDrawer;
