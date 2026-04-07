require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

// Database Connection
connectDB();

const seedProducts = async () => {
  try {
    // Clear existing products to prevent duplicates
    await Product.deleteMany();
    
    const sampleTemples = [
      {
        name: 'Handcrafted Teak Temple',
        price: 299.99,
        woodType: 'Teak',
        description: 'A beautiful hand-carved temple perfect for home altars.',
        stock: 5
      },
      {
        name: 'Rosewood Miniature Shrine',
        price: 150.00,
        woodType: 'Rosewood',
        description: 'Compact and elegant turned-wood shrine.',
        stock: 12
      },
      {
        name: 'Sandalwood Premium Altar',
        price: 899.50,
        woodType: 'Sandalwood',
        description: 'Luxurious sandalwood finish, intricately designed.',
        stock: 2
      }
    ];

    await Product.insertMany(sampleTemples);
    console.log('Database seeded with 3 sample Wooden Temples!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

// Ensure DB is connected before seeding
mongoose.connection.once('open', () => {
  seedProducts();
});
