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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    addedAt: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});

const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: String,
    name: String,
    price: Number,
    image: String,
    addedAt: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});

async function testUserDataSync() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const AdminUser = mongoose.model('AdminUser', AdminUserSchema);
    const Cart = mongoose.model('Cart', CartSchema);
    const Wishlist = mongoose.model('Wishlist', WishlistSchema);

    // Create test users with cart and wishlist data
    const testUsers = [
      {
        userId: 'user1@example.com',
        email: 'user1@example.com',
        fullName: 'Rahul Sharma',
        phone: '9876543210',
        coins: 25,
        referralCode: 'RAHUL001'
      },
      {
        userId: 'user2@example.com',
        email: 'user2@example.com',
        fullName: 'Priya Singh',
        phone: '9876543211',
        coins: 15,
        referralCode: 'PRIYA001'
      },
      {
        userId: 'user3@example.com',
        email: 'user3@example.com',
        fullName: 'Amit Kumar',
        phone: '9876543212',
        coins: 30,
        referralCode: 'AMIT001'
      }
    ];

    // Insert users
    for (const userData of testUsers) {
      await AdminUser.findOneAndUpdate(
        { userId: userData.userId },
        userData,
        { upsert: true }
      );
    }

    // Create cart data for users
    const cartData = [
      {
        userId: 'user1@example.com',
        items: [
          {
            productId: 'tech-001',
            name: 'Wireless Headphones',
            price: 1999,
            quantity: 1,
            image: '/images/placeholder.jpg'
          },
          {
            productId: 'home-001',
            name: 'Smart LED Bulb',
            price: 699,
            quantity: 2,
            image: '/images/placeholder.jpg'
          }
        ]
      },
      {
        userId: 'user2@example.com',
        items: [
          {
            productId: 'fashion-001',
            name: 'Cotton T-Shirt',
            price: 399,
            quantity: 1,
            image: '/images/placeholder.jpg'
          }
        ]
      }
    ];

    // Insert cart data
    for (const cart of cartData) {
      await Cart.findOneAndUpdate(
        { userId: cart.userId },
        cart,
        { upsert: true }
      );
    }

    // Create wishlist data for users
    const wishlistData = [
      {
        userId: 'user1@example.com',
        items: [
          {
            productId: 'tech-002',
            name: 'Smartphone',
            price: 15999,
            image: '/images/placeholder.jpg'
          }
        ]
      },
      {
        userId: 'user2@example.com',
        items: [
          {
            productId: 'home-002',
            name: 'Air Purifier',
            price: 8999,
            image: '/images/placeholder.jpg'
          },
          {
            productId: 'tech-003',
            name: 'Laptop',
            price: 45999,
            image: '/images/placeholder.jpg'
          }
        ]
      }
    ];

    // Insert wishlist data
    for (const wishlist of wishlistData) {
      await Wishlist.findOneAndUpdate(
        { userId: wishlist.userId },
        wishlist,
        { upsert: true }
      );
    }

    console.log('✅ Test data created successfully!');
    console.log('📊 Summary:');
    console.log(`- Users: ${await AdminUser.countDocuments()}`);
    console.log(`- Carts: ${await Cart.countDocuments()}`);
    console.log(`- Wishlists: ${await Wishlist.countDocuments()}`);

    console.log('\n🎉 User data sync system is ready!');
    console.log('\n📝 APIs available:');
    console.log('- GET /api/user-cart?userId=user@example.com');
    console.log('- POST /api/user-cart (to sync cart)');
    console.log('- GET /api/user-wishlist?userId=user@example.com');
    console.log('- POST /api/user-wishlist (to sync wishlist)');
    console.log('- GET /api/admin/users (shows all user data in admin)');

  } catch (error) {
    console.error('❌ Error testing user data sync:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testUserDataSync();