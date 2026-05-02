import React, { useEffect } from 'react';

/**
 * Full-screen / constrained lightbox for product images.
 * Mobile: full viewport width & height, zero padding — image fills maximum space.
 * Desktop: max-width 1000px panel with slight rounding and padding.
 * Thumbnails sit in a fixed-height strip that never compresses the main image.
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
  const hasThumbs = images.length > 1;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Product image viewer"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 w-full h-full border-0 p-0 bg-black/85 cursor-default"
        onClick={onClose}
        aria-label="Close image viewer"
      />

      {/* Modal panel */}
      <div
        className="
          relative z-10 flex flex-col
          w-[100vw] h-[100dvh]
          md:w-[min(1000px,94vw)] md:h-auto md:max-h-[94dvh] md:rounded-xl md:shadow-2xl
          bg-neutral-950 overflow-hidden
        "
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 md:top-3 md:right-3 transition-colors"
          aria-label="Close"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ---- Main image area ---- */}
        {/* Mobile: fills all available space (100vw wide, flex-1 tall minus thumb strip) */}
        {/* Desktop: auto-height, capped by max-h on the panel */}
        <div
          className="
            flex flex-1 min-h-0 w-full items-center justify-center
            p-0 m-0
            md:p-4
            bg-neutral-950
          "
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="
              block max-w-full max-h-full object-contain select-none
              w-full h-auto
            "
            style={{
              /* Mobile: let the image use every pixel of width; height is auto.
                 Desktop: constrained by the panel max-h so object-fit: contain handles it. */
            }}
          />
        </div>

        {/* ---- Thumbnail strip ---- */}
        {hasThumbs && (
          <div
            className="
              flex-shrink-0 flex items-center gap-2 overflow-x-auto overflow-y-hidden
              px-3 py-2 md:px-4 md:py-3
              bg-black/60 border-t border-white/10
              [scrollbar-width:thin]
            "
            style={{ minHeight: '72px' }}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className={`
                  flex-shrink-0 w-14 h-14 md:w-[72px] md:h-[72px] rounded-lg overflow-hidden border-2 transition-all
                  ${safeIndex === idx ? 'border-primary ring-2 ring-primary/40 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}
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
