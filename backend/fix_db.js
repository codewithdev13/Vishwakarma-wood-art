const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.useDb('test');
  const collection = db.collection('products');
  
  const doorProduct = await collection.findOne({ name: '21 * 15 (DOOR)' });
  if (doorProduct) {
    await collection.updateOne(
      { _id: doorProduct._id },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=600&auto=format&fit=crop&text=Wooden+Door' } }
    );
    console.log("Door image URL updated successfully!");
  } else {
    console.log("Door product not found!");
  }
  process.exit(0);
});
