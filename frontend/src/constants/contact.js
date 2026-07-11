export const WHATSAPP_NUMBER = '918780829804';

export const buildWhatsAppUrl = (message, imageUrl) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}%0A%0A${imageUrl}`;
