const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const products = await Product.find().lean();
    console.log(JSON.stringify(products, null, 2));
    process.exit(0);
  });
