const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../src/models/User');

// Configuration
const API_URL = 'http://localhost:3000/api';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopwave';

// Test data
const testUsers = {
  referrer: {
    name: 'Test Referrer',
    email: 'test-referrer@example.com',
    password: 'password123'
  },
  referred: {
    name: 'Test Referred',
    email: 'test-referred@example.com',
    password: 'password123'
  }
};

let referrerToken = '';
let referredToken = '';
let referrerCode = '';

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, token = '') {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {},
      data
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function testReferralFlow() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await User.deleteMany({ email: { $in: [testUsers.referrer.email, testUsers.referred.email] } });

    // 1. Register referrer user
    console.log('\n1. Registering referrer user...');
    const registerReferrer = await apiRequest('post', '/auth/register', {
      name: testUsers.referrer.name,
      email: testUsers.referrer.email,
      password: testUsers.referrer.password
    });
    
    if (registerReferrer.success) {
      referrerToken = registerReferrer.token;
      referrerCode = registerReferrer.user.referralCode;
      console.log(`✅ Referrer registered - Code: ${referrerCode}`);
    }

    // 2. Register referred user
    console.log('\n2. Registering referred user...');
    const registerReferred = await apiRequest('post', '/auth/register', {
      name: testUsers.referred.name,
      email: testUsers.referred.email,
      password: testUsers.referred.password,
      refCode: referrerCode
    });

    if (registerReferred.success) {
      referredToken = registerReferred.token;
      console.log('✅ Referred user registered with referral code');
    }

    // 3. Verify referral in database
    console.log('\n3. Verifying referral in database...');
    const referrer = await User.findOne({ email: testUsers.referrer.email });
    const referred = await User.findOne({ email: testUsers.referred.email });

    if (referred.referredBy && referred.referredBy.toString() === referrer._id.toString()) {
      console.log('✅ Referral link verified in database');
      console.log(`   Referrer's referral count: ${referrer.referralCount}`);
    } else {
      console.error('❌ Referral verification failed');
    }

    // 4. Test login for both users
    console.log('\n4. Testing login...');
    const loginReferrer = await apiRequest('post', '/auth/login', {
      email: testUsers.referrer.email,
      password: testUsers.referrer.password
    });

    const loginReferred = await apiRequest('post', '/auth/login', {
      email: testUsers.referred.email,
      password: testUsers.referred.password
    });

    if (loginReferrer.success && loginReferred.success) {
      console.log('✅ Both users can log in successfully');
    }

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the test
testReferralFlow();
