const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://dhananjaywin15112004:ec2cY3Gk2HxizdS2@cluster.4jkps.mongodb.net/?retryWrites=true&w=majority&appName=photos-test';

async function finalCleanup() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Collections to DELETE (useless duplicates)
    const deleteCollections = ['carts', 'orders', 'test', 'userData', 'user_data', 'users'];
    
    console.log('🗑️ Deleting useless collections...');
    
    for (const collectionName of deleteCollections) {
      try {
        await db.dropCollection(collectionName);
        console.log(`✅ Deleted: ${collectionName}`);
      } catch (error) {
        console.log(`⚠️ ${collectionName} not found or already deleted`);
      }
    }
    
    // Check final collections
    const finalCollections = await db.listCollections().toArray();
    console.log('\n📁 Final collections (kept):');
    finalCollections.forEach(c => {
      console.log(`✅ ${c.name}`);
    });
    
    console.log('\n🎯 Database optimized!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

finalCleanup();