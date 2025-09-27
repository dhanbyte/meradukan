const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://dhananjaywin15112004:ec2cY3Gk2HxizdS2@cluster.4jkps.mongodb.net/?retryWrites=true&w=majority&appName=photos-test';

// UserData schema
const UserDataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updated_at: { type: Date, default: Date.now }
});

UserDataSchema.index({ userId: 1, type: 1 }, { unique: true });
const UserData = mongoose.model('UserData', UserDataSchema);

async function addTestData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test customer 1
    const testUserId1 = 'test@example.com';
    
    // Add test order
    const testOrder = {
      id: `order_${Date.now()}`,
      items: [
        {
          id: 'test-product-1',
          name: 'Test Product 1',
          price: 299,
          qty: 2,
          image: 'https://via.placeholder.com/150'
        }
      ],
      total: 598,
      status: 'pending',
      createdAt: new Date().toISOString(),
      address: {
        fullName: 'Test Customer',
        phone: '9876543210',
        line1: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      payment: 'UPI'
    };

    // Save order
    await UserData.updateOne(
      { userId: testUserId1, type: 'orders' },
      { 
        userId: testUserId1, 
        type: 'orders', 
        data: [testOrder], 
        updated_at: new Date() 
      },
      { upsert: true }
    );

    // Add test cart
    await UserData.updateOne(
      { userId: testUserId1, type: 'cart' },
      { 
        userId: testUserId1, 
        type: 'cart', 
        data: [
          {
            id: 'test-product-2',
            name: 'Test Product 2',
            price: 199,
            qty: 1
          }
        ], 
        updated_at: new Date() 
      },
      { upsert: true }
    );

    // Add test wishlist
    await UserData.updateOne(
      { userId: testUserId1, type: 'wishlist' },
      { 
        userId: testUserId1, 
        type: 'wishlist', 
        data: [
          {
            id: 'test-product-3',
            name: 'Test Product 3',
            price: 399
          }
        ], 
        updated_at: new Date() 
      },
      { upsert: true }
    );

    // Test customer 2
    const testUserId2 = 'customer2@test.com';
    
    const testOrder2 = {
      id: `order_${Date.now() + 1}`,
      items: [
        {
          id: 'test-product-4',
          name: 'Test Product 4',
          price: 499,
          qty: 1,
          image: 'https://via.placeholder.com/150'
        }
      ],
      total: 499,
      status: 'delivered',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      address: {
        fullName: 'Customer Two',
        phone: '9876543211',
        line1: '456 Test Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      payment: 'Card'
    };

    await UserData.updateOne(
      { userId: testUserId2, type: 'orders' },
      { 
        userId: testUserId2, 
        type: 'orders', 
        data: [testOrder2], 
        updated_at: new Date() 
      },
      { upsert: true }
    );

    console.log('✅ Test data added successfully!');
    console.log('- 2 test customers created');
    console.log('- 2 test orders added');
    console.log('- 1 cart item added');
    console.log('- 1 wishlist item added');
    
  } catch (error) {
    console.error('❌ Error adding test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addTestData();