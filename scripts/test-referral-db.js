const { MongoClient } = require('mongodb');

// Database connection
const MONGODB_URI = 'mongodb://localhost:27017/shopwave';

async function testReferral() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🚀 Connecting to database...');
    await client.connect();
    const db = client.db();
    
    // 1. Clean up any existing test data
    console.log('🧹 Cleaning up test data...');
    await db.collection('users').deleteMany({ email: /^testuser/ });
    await db.collection('referral_rewards').deleteMany({});
    await db.collection('orders').deleteMany({});
    
    // 2. Create a referrer user
    console.log('\n👤 Creating referrer user...');
    const referrer = await db.collection('users').insertOne({
      email: 'test_referrer@example.com',
      name: 'Test Referrer',
      password: 'hashedpassword',
      referralCode: 'TESTREF1',
      referralBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      hasMadePurchase: false,
      referralCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`✅ Created referrer: ${referrer.insertedId}`);
    
    // 3. Create a referred user
    console.log('\n👥 Creating referred user...');
    const referred = await db.collection('users').insertOne({
      email: 'test_referred@example.com',
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
    
    // 4. Create a test order
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
    
    // 5. Manually create a referral reward
    console.log('\n💰 Creating referral reward...');
    const rewardAmount = 10; // ₹10 for orders ≥ ₹100
    await db.collection('referral_rewards').insertOne({
      referrerId: referrer.insertedId,
      refereeId: referred.insertedId,
      orderId: order.insertedId,
      amount: rewardAmount,
      orderAmount: 150,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // 6. Update referrer's balance
    console.log('\n🔄 Updating referrer balance...');
    await db.collection('users').updateOne(
      { _id: referrer.insertedId },
      { 
        $inc: { 
          referralBalance: rewardAmount,
          totalEarned: rewardAmount,
          referralCount: 1
        },
        $set: { updatedAt: new Date() }
      }
    );
    
    // 7. Mark user as having made a purchase
    await db.collection('users').updateOne(
      { _id: referred.insertedId },
      { 
        $set: { 
          hasMadePurchase: true,
          updatedAt: new Date() 
        } 
      }
    );
    
    // 8. Verify the results
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
    
    // Check referral rewards
    const rewards = await db.collection('referral_rewards').find({
      referrerId: referrer.insertedId
    }).toArray();
    
    console.log('\n🎯 Referral Rewards:', JSON.stringify(rewards, null, 2));
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
testReferral();
