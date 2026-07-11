const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatProductPrice = (price) => {
  if (price == null || Number.isNaN(Number(price))) return '0';
  return Number(price).toLocaleString('en-IN');
};

const getSiteOrigin = (request) => {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  return `${protocol}://${host}`;
};

export default async function handler(request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').pop();

  if (!id) {
    return new Response('Product not found', { status: 404 });
  }

  try {
    const origin = getSiteOrigin(request);
    const productResponse = await fetch(`${origin}/api/products/${id}`);

    if (!productResponse.ok) {
      return new Response('Product not found', { status: 404 });
    }

    const product = await productResponse.json();
    const productUrl = `${origin}/product/${id}`;
    const imageUrl = (product.images && product.images.length > 0)
      ? product.images[0]
      : (product.imageUrl || 'https://images.unsplash.com/photo-1546200230-01ccceb38ab6?q=80&w=600&auto=format&fit=crop&text=Wooden+Texture');

    const absoluteImageUrl = imageUrl.startsWith('/')
      ? `${origin}${imageUrl}`
      : imageUrl;

    const title = `${product.name} | Vishwakarma Wood Art`;
    const description = product.description
      ? product.description.slice(0, 200)
      : `₹${formatProductPrice(product.price)} - Premium handcrafted wooden temple by Vishwakarma Wood Art`;

    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(absoluteImageUrl)}" />
    <meta property="og:url" content="${escapeHtml(productUrl)}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(absoluteImageUrl)}" />
    <meta http-equiv="refresh" content="0;url=${escapeHtml(productUrl)}" />
  </head>
  <body>
    <p>Loading <a href="${escapeHtml(productUrl)}">${escapeHtml(product.name)}</a>...</p>
  </body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('OG preview error:', error);
    return new Response('Unable to load product preview', { status: 500 });
  }
}
