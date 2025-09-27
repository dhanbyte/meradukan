const mongoose = require('mongoose');

async function checkCollections() {
  try {
    await mongoose.connect('mongodb+srv://dhananjaywin15112004:ec2cY3Gk2HxizdS2@cluster.4jkps.mongodb.net/?retryWrites=true&w=majority&appName=photos-test');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('📁 Current Collections in Database:');
    collections.forEach(c => {
      console.log(`✅ ${c.name}`);
    });
    
    console.log(`\n📊 Total: ${collections.length} collections`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkCollections();