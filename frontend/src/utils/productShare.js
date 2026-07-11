import { buildWhatsAppUrl } from '../constants/contact';

export const formatProductPrice = (price) => {
  if (price == null || Number.isNaN(Number(price))) return '0';
  return Number(price).toLocaleString('en-IN');
};

export const buildProductUrl = (productId) => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/product/${productId}`;
  }
  return `/product/${productId}`;
};

export const buildWhatsAppEnquiryMessage = (product) => {
  const price = formatProductPrice(product.price);
  const productUrl = buildProductUrl(product._id);
  return `Hi, I'm interested in ${product.name} - ₹${price}. ${productUrl}`;
};

export const buildShareCaption = (product) => {
  const price = formatProductPrice(product.price);
  return `Interested in this: ${product.name}, ₹${price}`;
};

export const openWhatsAppEnquiry = (product) => {
  const message = buildWhatsAppEnquiryMessage(product);
  const whatsappUrl = buildWhatsAppUrl(message);
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

const fetchImageFile = async (imageUrl, productName) => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch product image');
  }

  const blob = await response.blob();
  const extension = blob.type?.split('/')[1] || 'jpg';
  const safeName = productName.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'product';

  return new File([blob], `${safeName}.${extension}`, { type: blob.type || 'image/jpeg' });
};

export const shareProduct = async (product, imageUrl) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    typeof navigator !== 'undefined' ? navigator.userAgent : ''
  );
  const caption = buildShareCaption(product);

  if (isMobile && navigator.share) {
    try {
      let imageFile = null;

      try {
        imageFile = await fetchImageFile(imageUrl, product.name);
      } catch (err) {
        console.error('Failed to fetch image file for sharing:', err);
      }

      if (imageFile) {
        const shareData = {
          title: product.name,
          text: caption,
          files: [imageFile],
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }
    } catch (error) {
      if (error?.name === 'AbortError') {
        // User cancelled the native share dialog, don't trigger the fallback.
        return;
      }
      console.error('Error sharing product:', error);
    }
  }

  // Graceful fallback to WhatsApp Enquiry link on desktop or unsupported environments
  openWhatsAppEnquiry(product);
};

export const buildShortlistEnquiryMessage = (items) => {
  let message = "Hi, I'm interested in the following shortlisted products:\n\n";
  items.forEach((item, index) => {
    const price = formatProductPrice(item.price);
    const productUrl = buildProductUrl(item._id);
    message += `${index + 1}. ${item.name} - ₹${price}\n   Link: ${productUrl}\n\n`;
  });
  return message.trim();
};

export const openShortlistWhatsAppEnquiry = (items) => {
  const message = buildShortlistEnquiryMessage(items);
  const whatsappUrl = buildWhatsAppUrl(message);
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};


