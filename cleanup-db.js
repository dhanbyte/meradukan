const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://dhananjaywin15112004:ec2cY3Gk2HxizdS2@cluster.4jkps.mongodb.net/?retryWrites=true&w=majority&appName=photos-test';

async function cleanupDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Current collections:', collections.map(c => c.name));
    
    // Collections to keep
    const keepCollections = ['userdatas', 'products', 'reviews'];
    
    // Collections to remove (duplicates/unused)
    const removeCollections = ['carts', 'orders', 'test', 'userData', 'user_data', 'users'];
    
    for (const collectionName of removeCollections) {
      try {
        const exists = collections.find(c => c.name === collectionName);
        if (exists) {
          await db.dropCollection(collectionName);
          console.log(`✅ Dropped collection: ${collectionName}`);
        }
      } catch (error) {
        console.log(`⚠️ Could not drop ${collectionName}:`, error.message);
      }
    }
    
    // Check remaining collections
    const remainingCollections = await db.listCollections().toArray();
    console.log('Remaining collections:', remainingCollections.map(c => c.name));
    
    console.log('✅ Database cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

cleanupDatabase();