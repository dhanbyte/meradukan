const testAddressSync = async () => {
  const baseUrl = 'http://localhost:3000';
  const testUserId = 'test_user_address_123';
  
  console.log('🧪 Testing Address Real-time Sync...\n');
  
  const testAddress = {
    name: 'John Doe',
    phone: '9876543210',
    address: '123 Test Street, Test Area',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    default: true
  };
  
  try {
    // 1. Save address to database
    console.log('1️⃣ Saving address to database');
    const saveResponse = await fetch(`${baseUrl}/api/user-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testUserId,
        type: 'addresses',
        data: [testAddress]
      })
    });
    
    const saveResult = await saveResponse.json();
    console.log('Save Status:', saveResponse.status);
    console.log('Save Result:', saveResult);
    
    // 2. Retrieve address from database
    console.log('\n2️⃣ Retrieving address from database');
    const getResponse = await fetch(`${baseUrl}/api/user-data?userId=${testUserId}&type=addresses`);
    const addresses = await getResponse.json();
    
    console.log('Get Status:', getResponse.status);
    console.log('Retrieved Addresses:', addresses);
    
    if (addresses && addresses.length > 0) {
      console.log('✅ Address sync working properly!');
      console.log('Address Details:', {
        name: addresses[0].name,
        city: addresses[0].city,
        pincode: addresses[0].pincode
      });
    } else {
      console.log('❌ No addresses found');
    }
    
  } catch (error) {
    console.error('❌ Error testing address sync:', error.message);
  }
};

// Run if called directly
if (typeof window === 'undefined') {
  testAddressSync();
}

module.exports = testAddressSync;