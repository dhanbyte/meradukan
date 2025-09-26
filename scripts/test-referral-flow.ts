import { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';
import axios from 'axios';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const API_BASE_URL = 'http://localhost:3000/api';

async function clearTestData(db: any) {
  await db.collection('users').deleteMany({ email: /^testuser/ });
  await db.collection('referral_rewards').deleteMany({});
  await db.collection('orders').deleteMany({});
}

async function createTestUser(email: string, name: string, refCode?: string) {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, {
    email,
    name,
    password: 'Test@123',
    refCode
  });
  return response.data;
}

async function createTestOrder(userId: string, amount: number) {
  const response = await axios.post(`${API_BASE_URL}/orders/create`, {
    userId,
    items: [{ name: 'Test Product', price: amount, quantity: 1 }],
    totalAmount: amount,
    shippingAddress: '123 Test St, Test City',
    paymentMethod: 'test'
  });
  return response.data;
}

async function testReferralFlow() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db();

  try {
    console.log('🚀 Starting referral flow test...');
    
    // Clean up any existing test data
    await clearTestData(db);
    console.log('🧹 Cleared test data');

    // 1. Create referrer user
    console.log('\n1. Creating referrer user...');
    const referrer = await createTestUser('testuser_referrer@example.com', 'Test Referrer');
    console.log('✅ Referrer created:', referrer.userId);

    // Get referrer's code
    const referrerUser = await db.collection('users').findOne({ _id: referrer.userId });
    const referrerCode = referrerUser.referralCode;
    console.log('🔗 Referral code:', referrerCode);

    // 2. Create referred user using the referral code
    console.log('\n2. Creating referred user...');
    const referred = await createTestUser(
      'testuser_referred@example.com',
      'Test Referred',
      referrerCode
    );
    console.log('✅ Referred user created:', referred.userId);

    // Verify referral link was recorded
    const referredUser = await db.collection('users').findOne({ _id: referred.userId });
    console.log('🔍 Referred by:', referredUser.referredBy?.toString());
    console.log('✅ Referral linked in user document');

    // 3. Make a purchase with the referred user
    console.log('\n3. Making a purchase with referred user...');
    const orderAmount = 150; // Amount > 100 to test the higher reward tier
    const order = await createTestOrder(referred.userId, orderAmount);
    console.log('✅ Order created:', order.orderId);

    // 4. Verify the referral reward was processed
    console.log('\n4. Verifying referral reward...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for async processing

    // Check referrer's updated balance
    const updatedReferrer = await db.collection('users').findOne({ _id: referrer.userId });
    console.log('💰 Referrer balance:', updatedReferrer.referralBalance);
    
    // Check referral rewards
    const reward = await db.collection('referral_rewards').findOne({
      referrerId: referrer.userId,
      refereeId: referred.userId,
      orderId: order.orderId
    });
    
    console.log('🎯 Referral reward:', {
      amount: reward?.amount,
      status: reward?.status,
      orderAmount: reward?.orderAmount
    });

    // 5. Verify database state
    console.log('\n5. Verifying database state...');
    const rewards = await db.collection('referral_rewards').find({}).toArray();
    console.log('📊 All referral rewards:', rewards);

    console.log('\n🎉 Referral flow test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  } finally {
    await client.close();
  }
}

// Run the test
testReferralFlow().catch(console.error);
