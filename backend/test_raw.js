const { MongoClient } = require('mongodb');
require('dotenv').config();

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db('test'); // Or whatever the DB name is, usually the default from URI
    // Let's just list from products collection
    const collection = db.collection('products');
    const docs = await collection.find({}).toArray();
    console.log(JSON.stringify(docs, null, 2));
  } finally {
    await client.close();
  }
}
run().catch(console.error);
