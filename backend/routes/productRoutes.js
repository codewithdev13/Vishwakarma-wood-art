const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');
const { cloudinary } = require('../utils/cloudinary');
const fs = require('fs');

// @route   GET /api/products
// @desc    Fetch all products
router.get('/', async (req, res) => {
  try {
    const { woodType, style, size } = req.query;
    let query = {};
    
    // We check if woodType is present and handle arrays (multiple checkboxes)
    if (woodType) {
      if (Array.isArray(woodType)) {
        query.woodType = { $in: woodType };
      } else {
        query.woodType = { $in: woodType.split(',') }; 
      }
    }
    
    if (style) {
      query.templeStyle = style;
    }
    
    if (size) {
      query.size = size;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Fetch single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products/add
// @desc    Add a new product with images
router.post('/add', adminAuth, upload.array('images', 3), async (req, res) => {
  try {
    const { name, woodType, price, size, templeStyle } = req.body;
    let images = [];
    let imageUrl = '';

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'wooden_temples_products',
        });
        images.push(result.secure_url);
        fs.unlinkSync(file.path); // Remove local file after upload
      }
      imageUrl = images[0]; // Fallback for backward compatibility
    }

    const product = new Product({
      name,
      woodType,
      size,
      templeStyle,
      price,
      images,
      imageUrl,
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
