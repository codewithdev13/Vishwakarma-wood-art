require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

// Database Connection
connectDB();

const app = express();
const path = require('path');

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins for Vercel deployment
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Main Express Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);

app.get('/api/og/:id', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    const host = req.headers['x-forwarded-host'] || req.headers['host'];
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const origin = `${protocol}://${host}`;

    const productUrl = `${origin}/product/${product._id}`;
    const imageUrl = (product.images && product.images.length > 0)
      ? product.images[0]
      : (product.imageUrl || 'https://images.unsplash.com/photo-1546200230-01ccceb38ab6?q=80&w=600&auto=format&fit=crop&text=Wooden+Texture');

    const absoluteImageUrl = imageUrl.startsWith('/')
      ? `${origin}${imageUrl}`
      : imageUrl;

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

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.send(html);
  } catch (error) {
    console.error('OG preview error:', error);
    res.status(500).send('Unable to load product preview');
  }
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Server Error:", err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Export the Express API for Vercel Serverless Functions
module.exports = app;
