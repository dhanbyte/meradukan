const { MongoClient } = require('mongodb');

async function testReferralFlow() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopwave';
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🚀 Starting test...');
    await client.connect();
    console.log('✅ Connected to database');
    
    const db = client.db();
    
    // Clean up
    console.log('🧹 Cleaning up test data...');
    await db.collection('users').deleteMany({ email: /^testuser/ });
    await db.collection('referral_rewards').deleteMany({});
    await db.collection('orders').deleteMany({});
    
    // 1. Create referrer
    console.log('\n1. Creating referrer user...');
    const referrer = await db.collection('users').insertOne({
      email: 'testuser_referrer@example.com',
      name: 'Test Referrer',
      password: 'hashedpassword',
      referralCode: 'TESTREF123',
      referralBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      hasMadePurchase: false,
      referralCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`✅ Created referrer: ${referrer.insertedId}`);
    
    // 2. Create referred user
    console.log('\n2. Creating referred user...');
    const referred = await db.collection('users').insertOne({
      email: 'testuser_referred@example.com',
      name: 'Test Referred',
      password: 'hashedpassword',
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
    console.log(`✅ Created referred user: ${referred.insertedId}`);
    
    // 3. Create test order
    console.log('\n3. Creating test order...');
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
    
    // 4. Manually call the referral process
    console.log('\n4. Processing referral...');
    const referralService = require('../src/lib/referralService');
    await referralService.processReferral({
      orderId: order.insertedId,
      userId: referred.insertedId,
      amount: 150
    });
    
    // 5. Verify results
    console.log('\n5. Verifying results...');
    
    // Check referrer's balance
    const updatedReferrer = await db.collection('users').findOne({ _id: referrer.insertedId });
    console.log('💰 Referrer balance:', updatedReferrer.referralBalance);
    
    // Check referral rewards
    const rewards = await db.collection('referral_rewards').find({
      referrerId: referrer.insertedId,
      refereeId: referred.insertedId
    }).toArray();
    
    console.log('\n🎯 Referral Rewards:', JSON.stringify(rewards, null, 2));
    
    if (rewards.length > 0) {
      console.log('✅ Referral reward processed successfully!');
    } else {
      console.log('❌ No referral rewards found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.close();
    console.log('\n🏁 Test completed');
  }
}

testReferralFlow();
