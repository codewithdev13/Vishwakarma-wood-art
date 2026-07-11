import { useEffect } from 'react';
import { formatProductPrice, buildProductUrl } from '../utils/productShare';

const setMetaTag = (attribute, key, content) => {
  if (!content) return;

  const selector = attribute === 'name'
    ? `meta[name="${key}"]`
    : `meta[property="${key}"]`;

  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const ProductMeta = ({ product, imageUrl }) => {
  useEffect(() => {
    if (!product) return;

    const productUrl = buildProductUrl(product._id);
    const title = `${product.name} | Vishwakarma Wood Art`;
    const description = product.description
      ? `${product.description.slice(0, 155)}...`
      : `₹${formatProductPrice(product.price)} - Premium handcrafted wooden temple by Vishwakarma Wood Art`;

    const absoluteImageUrl = imageUrl && imageUrl.startsWith('/')
      ? `${window.location.origin}${imageUrl}`
      : imageUrl;

    const previousTitle = document.title;
    document.title = title;

    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', absoluteImageUrl);
    setMetaTag('property', 'og:url', productUrl);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', absoluteImageUrl);

    return () => {
      document.title = previousTitle;
    };
  }, [product, imageUrl]);

  return null;
};

export default ProductMeta;
