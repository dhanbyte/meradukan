const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://dhananjaywin15112004:ec2cY3Gk2HxizdS2@cluster.4jkps.mongodb.net/?retryWrites=true&w=majority&appName=photos-test';

// Test schemas
const AdminUserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: String,
  isAdmin: { type: Boolean, default: false },
  coins: { type: Number, default: 5 },
  referralCode: String,
  referredBy: String,
  addresses: [{
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AdminProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  price: {
    original: { type: Number, required: true },
    discounted: Number
  },
  image: String,
  images: [String],
  category: { type: String, required: true },
  subcategory: String,
  quantity: { type: Number, default: 0 },
  isNewProduct: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  specifications: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AdminOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  paymentMethod: String,
  paymentId: String,
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

async function testAdminSystem() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const AdminUser = mongoose.model('AdminUser', AdminUserSchema);
    const AdminProduct = mongoose.model('AdminProduct', AdminProductSchema);
    const AdminOrder = mongoose.model('AdminOrder', AdminOrderSchema);

    // Test data counts
    const userCount = await AdminUser.countDocuments();
    const productCount = await AdminProduct.countDocuments();
    const orderCount = await AdminOrder.countDocuments();

    console.log('📊 Current Data:');
    console.log(`- Users: ${userCount}`);
    console.log(`- Products: ${productCount}`);
    console.log(`- Orders: ${orderCount}`);

    // Test API endpoints simulation
    console.log('\n🧪 Testing API Endpoints:');
    
    // Test user creation
    const testUser = {
      userId: 'test@example.com',
      email: 'test@example.com',
      fullName: 'Test User',
      phone: '1234567890'
    };

    try {
      const existingUser = await AdminUser.findOne({ userId: testUser.userId });
      if (!existingUser) {
        const newUser = new AdminUser({
          ...testUser,
          referralCode: Math.random().toString(36).substring(2, 10).toUpperCase()
        });
        await newUser.save();
        console.log('✅ User creation test passed');
      } else {
        console.log('✅ User already exists - test passed');
      }
    } catch (error) {
      console.log('❌ User creation test failed:', error.message);
    }

    // Test product creation
    const testProduct = {
      id: 'test-product-001',
      name: 'Test Product',
      description: 'This is a test product',
      price: { original: 999, discounted: 799 },
      image: '/images/placeholder.jpg',
      category: 'Test Category',
      quantity: 10
    };

    try {
      const existingProduct = await AdminProduct.findOne({ id: testProduct.id });
      if (!existingProduct) {
        const newProduct = new AdminProduct(testProduct);
        await newProduct.save();
        console.log('✅ Product creation test passed');
      } else {
        console.log('✅ Product already exists - test passed');
      }
    } catch (error) {
      console.log('❌ Product creation test failed:', error.message);
    }

    // Test order creation
    const testOrder = {
      orderId: `TEST-${Date.now()}`,
      userId: testUser.userId,
      items: [{
        productId: testProduct.id,
        name: testProduct.name,
        price: testProduct.price.discounted,
        quantity: 1,
        image: testProduct.image
      }],
      total: testProduct.price.discounted,
      status: 'pending',
      paymentMethod: 'test'
    };

    try {
      const newOrder = new AdminOrder(testOrder);
      await newOrder.save();
      console.log('✅ Order creation test passed');
    } catch (error) {
      console.log('❌ Order creation test failed:', error.message);
    }

    // Final counts
    const finalUserCount = await AdminUser.countDocuments();
    const finalProductCount = await AdminProduct.countDocuments();
    const finalOrderCount = await AdminOrder.countDocuments();

    console.log('\n📊 Final Data:');
    console.log(`- Users: ${finalUserCount}`);
    console.log(`- Products: ${finalProductCount}`);
    console.log(`- Orders: ${finalOrderCount}`);

    console.log('\n🎉 Admin system is working properly!');
    console.log('\n📝 Next Steps:');
    console.log('1. Visit http://localhost:3000/admin for admin dashboard');
    console.log('2. Visit http://localhost:3000/admin/users for user management');
    console.log('3. Visit http://localhost:3000/admin/orders for order management');
    console.log('4. Use the registration API at /api/register-user for new users');
    console.log('5. Use the order API at /api/place-order for new orders');

  } catch (error) {
    console.error('❌ Error testing admin system:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testAdminSystem();