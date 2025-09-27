const testPayment = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Payment System...\n');
  
  try {
    // Test Razorpay order creation
    console.log('1️⃣ Testing Razorpay order creation');
    const response = await fetch(`${baseUrl}/api/razorpay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 100 }) // ₹100 test amount
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.status === 200) {
      console.log('✅ Razorpay order creation working!');
      console.log('Order ID:', data.order.id);
      console.log('Amount:', data.order.amount / 100, 'INR');
    } else {
      console.log('❌ Razorpay order creation failed');
      console.log('Error:', data.error);
    }
    
    // Test environment variables
    console.log('\n2️⃣ Checking environment variables');
    console.log('NEXT_PUBLIC_RAZORPAY_KEY_ID exists:', !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    console.log('RAZORPAY_KEY_SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET);
    
  } catch (error) {
    console.error('❌ Error testing payment:', error.message);
  }
};

// Run if called directly
if (typeof window === 'undefined') {
  testPayment();
}

module.exports = testPayment;