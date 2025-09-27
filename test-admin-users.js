const testAdminUsers = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Admin Users API...\n');
  
  try {
    // Test GET /api/admin/users
    console.log('📋 Testing GET /api/admin/users');
    const response = await fetch(`${baseUrl}/api/admin/users`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Success:', data.success);
    console.log('Users count:', data.users?.length || 0);
    
    if (data.users && data.users.length > 0) {
      console.log('Sample user:', {
        fullName: data.users[0].fullName,
        email: data.users[0].email,
        cartItems: data.users[0].cart?.length || 0,
        wishlistItems: data.users[0].wishlist?.length || 0,
        orders: data.users[0].orderCount || 0
      });
    }
    
    if (response.status === 200) {
      console.log('✅ Admin Users API working properly!');
    } else {
      console.log('❌ Admin Users API has issues');
      console.log('Error:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing admin users API:', error.message);
  }
};

// Run if called directly
if (typeof window === 'undefined') {
  testAdminUsers();
}

module.exports = testAdminUsers;