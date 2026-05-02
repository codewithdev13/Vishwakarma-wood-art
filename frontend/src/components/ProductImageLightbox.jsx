import React, { useEffect } from 'react';

/**
 * Full-screen / constrained lightbox for product images.
 * Mobile: full viewport width, minimal chrome so the main image uses maximum space.
 * Desktop: max-width 1000px panel, thumbnails in a separate strip below the image.
 */
const ProductImageLightbox = ({
  images,
  activeIndex,
  onClose,
  onSelectIndex,
  alt = 'Product',
}) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!images?.length) return null;

  const safeIndex = Math.min(Math.max(0, activeIndex), images.length - 1);
  const src = images[safeIndex];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-stretch justify-center md:items-center md:justify-center md:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Product image viewer"
    >
      <button
        type="button"
        className="absolute inset-0 w-full h-full border-0 p-0 bg-black/80 cursor-default"
        onClick={onClose}
        aria-label="Close image viewer"
      />

      <div
        className="
          relative z-10 flex flex-col
          w-screen max-w-[100vw] h-[100dvh] m-0
          md:w-full md:max-w-[1000px] md:h-[min(92dvh,880px)] md:max-h-[92dvh] md:rounded-xl md:shadow-2xl
          bg-neutral-950 overflow-hidden
        "
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 md:top-3 md:right-3"
          aria-label="Close"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Main image: flex-1 keeps thumbnails from overlapping; min-h-0 allows shrinking inside flex */}
        <div
          className="
            flex flex-1 min-h-0 w-full items-center justify-center
            p-0 m-0
            md:p-3
          "
        >
          <img
            src={src}
            alt={alt}
            className="
              block w-full h-auto max-h-full object-contain
              m-0
              max-md:w-full max-md:h-auto max-md:max-w-none
            "
          />
        </div>

        {images.length > 1 && (
          <div
            className="
              flex-shrink-0 flex gap-2 overflow-x-auto overflow-y-hidden
              px-2 py-2 md:px-4 md:py-3
              bg-black/50 border-t border-white/10
              [scrollbar-width:thin]
            "
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className={`
                  flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all
                  ${safeIndex === idx ? 'border-primary ring-2 ring-primary/40' : 'border-transparent opacity-70 hover:opacity-100'}
                `}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageLightbox;
