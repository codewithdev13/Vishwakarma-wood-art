const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  woodType: {
    type: String,
    enum: ['Sevan', 'Saag']
  },
  size: {
    type: String,
    enum: ['18x12x24 inches', '24x18x36 inches', '36x24x48 inches']
  },
  templeStyle: {
    type: String,
    enum: ['Open', 'Door']
  },
  description: {
    type: String
  },
  stock: {
    type: Number
  },
  imageUrl: {
    type: String
  },
  images: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
