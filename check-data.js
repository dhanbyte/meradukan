const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://dhananjaywin15112004:ec2cY3Gk2HxizdS2@cluster.4jkps.mongodb.net/?retryWrites=true&w=majority&appName=photos-test';

async function checkData() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const UserData = mongoose.model('UserData', new mongoose.Schema({
      userId: String, 
      type: String, 
      data: mongoose.Schema.Types.Mixed,
      updated_at: Date
    }));
    
    const allData = await UserData.find({});
    
    console.log('📊 Current Database Contents:');
    console.log(`Total records: ${allData.length}\n`);
    
    allData.forEach((item, index) => {
      console.log(`${index + 1}. User: ${item.userId}`);
      console.log(`   Type: ${item.type}`);
      console.log(`   Data: ${JSON.stringify(item.data, null, 2)}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkData();