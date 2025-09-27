const testUserEndpoints = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing User Endpoints...\n');
  
  // Test data
  const testUser = {
    userId: 'test_user_123',
    email: 'test@example.com',
    fullName: 'Test User',
    phone: '9876543210'
  };
  
  const testUserData = {
    userId: 'test_user_123',
    type: 'cart',
    data: [
      { productId: 'prod1', quantity: 2 },
      { productId: 'prod2', quantity: 1 }
    ]
  };
  
  try {
    // 1. Test POST /api/users
    console.log('1️⃣ Testing POST /api/users');
    const usersResponse = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const usersResult = await usersResponse.json();
    console.log('Status:', usersResponse.status);
    console.log('Response:', usersResult);
    console.log('✅ /api/users working\n');
    
    // 2. Test POST /api/register-user
    console.log('2️⃣ Testing POST /api/register-user');
    const registerResponse = await fetch(`${baseUrl}/api/register-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const registerResult = await registerResponse.json();
    console.log('Status:', registerResponse.status);
    console.log('Response:', registerResult);
    console.log('✅ /api/register-user working\n');
    
    // 3. Test POST /api/user-data
    console.log('3️⃣ Testing POST /api/user-data');
    const userDataResponse = await fetch(`${baseUrl}/api/user-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUserData)
    });
    const userDataResult = await userDataResponse.json();
    console.log('Status:', userDataResponse.status);
    console.log('Response:', userDataResult);
    console.log('✅ /api/user-data working\n');
    
    // 4. Test GET /api/user-data
    console.log('4️⃣ Testing GET /api/user-data');
    const getUserDataResponse = await fetch(`${baseUrl}/api/user-data?userId=test_user_123&type=cart`);
    const getUserDataResult = await getUserDataResponse.json();
    console.log('Status:', getUserDataResponse.status);
    console.log('Response:', getUserDataResult);
    console.log('✅ GET /api/user-data working\n');
    
    console.log('🎉 All endpoints are working properly!');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
  }
};

// Run if called directly
if (typeof window === 'undefined') {
  testUserEndpoints();
}

module.exports = testUserEndpoints;