const axios = require('axios');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const API_BASE_URL = 'http://localhost:3000/api';

async function testReferralFlow() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🚀 Starting referral flow test...');
    await client.connect();
    const db = client.db();

    // Clean up test data
    await db.collection('users').deleteMany({ email: /^testuser/ });
    await db.collection('referral_rewards').deleteMany({});
    await db.collection('orders').deleteMany({});
    console.log('🧹 Cleared test data');

    // 1. Create referrer user
    console.log('\n1. Creating referrer user...');
    const hashedPassword = await bcrypt.hash('Test@123', 12);
    const referrer = await db.collection('users').insertOne({
      email: 'testuser_referrer@example.com',
      name: 'Test Referrer',
      password: hashedPassword,
      role: 'user',
      referralCode: 'TESTREF123',
      referralBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      hasMadePurchase: false,
      referralCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Referrer created:', referrer.insertedId);

    // 2. Create referred user
    console.log('\n2. Creating referred user...');
    const referred = await db.collection('users').insertOne({
      email: 'testuser_referred@example.com',
      name: 'Test Referred',
      password: hashedPassword,
      role: 'user',
      referredBy: referrer.insertedId,
      referralCode: 'REFERRED1',
      referralBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      hasMadePurchase: false,
      referralCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Referred user created:', referred.insertedId);

    // 3. Create test order
    console.log('\n3. Creating test order...');
    const order = await db.collection('orders').insertOne({
      userId: referred.insertedId,
      items: [{ name: 'Test Product', price: 150, quantity: 1 }],
      totalAmount: 150,
      shippingAddress: '123 Test St',
      paymentMethod: 'test',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Order created:', order.insertedId);

    // 4. Process referral reward
    console.log('\n4. Processing referral reward...');
    const response = await axios.post(`${API_BASE_URL}/referral/process`, {
      orderId: order.insertedId,
      userId: referred.insertedId,
      amount: 150
    });
    console.log('✅ Referral processed:', response.data);

    // 5. Verify results
    console.log('\n5. Verifying results...');
    const updatedReferrer = await db.collection('users').findOne({ _id: referrer.insertedId });
    const reward = await db.collection('referral_rewards').findOne({
      referrerId: referrer.insertedId,
      refereeId: referred.insertedId,
      orderId: order.insertedId
    });

    console.log('📊 Results:', {
      'Referrer Balance': updatedReferrer.referralBalance,
      'Reward Amount': reward?.amount,
      'Reward Status': reward?.status
    });

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  } finally {
    await client.close();
  }
}

testReferralFlow().catch(console.error);
