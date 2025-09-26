const { MongoClient } = require('mongodb');
const axios = require('axios');

// Configuration
const MONGODB_URI = 'mongodb://localhost:27017/shopwave';
const API_BASE_URL = 'http://localhost:3000/api';

async function testReferralFlow() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🚀 Starting test...');
    await client.connect();
    const db = client.db();
    
    // 1. Clean up test data
    console.log('🧹 Cleaning up test data...');
    await db.collection('users').deleteMany({ email: /^testuser/ });
    await db.collection('referral_rewards').deleteMany({});
    await db.collection('orders').deleteMany({});
    
    // 2. Create test users directly in the database
    console.log('\n👥 Creating test users...');
    const referrer = await db.collection('users').insertOne({
      email: 'testuser_referrer@example.com',
      name: 'Test Referrer',
      password: 'hashedpassword',
      referralCode: 'TESTREF123',
      referralBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      hasMadePurchase: true, // Has made a purchase before
      referralCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const referred = await db.collection('users').insertOne({
      email: 'testuser_referred@example.com',
      name: 'Test Referred',
      password: 'hashedpassword',
      referredBy: referrer.insertedId,
      referralCode: 'REFERRED1',
      referralBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      hasMadePurchase: false, // Has not made a purchase yet
      referralCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`✅ Created referrer: ${referrer.insertedId}`);
    console.log(`✅ Created referred user: ${referred.insertedId}`);
    
    // 3. Create a test order
    console.log('\n🛒 Creating test order...');
    const order = await db.collection('orders').insertOne({
      userId: referred.insertedId,
      items: [{ name: 'Test Product', price: 150, quantity: 1 }],
      totalAmount: 150,
      status: 'completed',
      shippingAddress: '123 Test St',
      paymentMethod: 'test',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`✅ Created order: ${order.insertedId}`);
    
    // 4. Call the process endpoint
    console.log('\n📤 Calling /api/referral/process endpoint...');
    const processResponse = await axios.post(
      `${API_BASE_URL}/referral/process`,
      {
        orderId: order.insertedId,
        userId: referred.insertedId,
        amount: 150
      }
    );
    
    console.log('✅ Process endpoint response:', processResponse.data);
    
    // 5. Verify the results
    console.log('\n🔍 Verifying results...');
    
    // Check referrer's updated balance
    const updatedReferrer = await db.collection('users').findOne({ _id: referrer.insertedId });
    console.log('\n📊 Referrer Details:', {
      name: updatedReferrer.name,
      email: updatedReferrer.email,
      referralBalance: updatedReferrer.referralBalance,
      totalEarned: updatedReferrer.totalEarned,
      referralCount: updatedReferrer.referralCount
    });
    
    // Check referred user's status
    const updatedReferred = await db.collection('users').findOne({ _id: referred.insertedId });
    console.log('\n👤 Referred User Status:', {
      hasMadePurchase: updatedReferred.hasMadePurchase,
      referredBy: updatedReferred.referredBy
    });
    
    // Check referral rewards
    const rewards = await db.collection('referral_rewards').find({
      referrerId: referrer.insertedId
    }).toArray();
    
    console.log('\n🎯 Referral Rewards:', JSON.stringify(rewards, null, 2));
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
testReferral();
