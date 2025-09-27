const Razorpay = require('razorpay');

// Test Razorpay connection
const keyId = 'rzp_test_RDS7GUfIddVKwK';
const keySecret = 'Sk0lz17w2Hz328cgvSs9WsVR';

async function testRazorpay() {
  try {
    console.log('🔄 Testing Razorpay connection...');
    
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Create a test order
    const options = {
      amount: 10000, // ₹100 in paise
      currency: 'INR',
      receipt: `test_receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    console.log('✅ Razorpay connection successful!');
    console.log('📋 Test order created:', {
      id: order.id,
      amount: order.amount / 100, // Convert back to rupees
      currency: order.currency,
      status: order.status
    });
    
    console.log('\n🎯 Test Payment Details:');
    console.log('- Card Number: 4111 1111 1111 1111');
    console.log('- CVV: Any 3 digits (e.g., 123)');
    console.log('- Expiry: Any future date (e.g., 12/25)');
    console.log('- UPI Success: success@razorpay');
    console.log('- UPI Failure: failure@razorpay');
    
  } catch (error) {
    console.error('❌ Razorpay test failed:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('🔑 Check your Razorpay API keys in .env.local');
    }
  }
}

testRazorpay();