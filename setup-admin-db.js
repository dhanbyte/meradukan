const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://dhananjaywin15112004:ec2cY3Gk2HxizdS2@cluster.4jkps.mongodb.net/?retryWrites=true&w=majority&appName=photos-test';

// User Schema
const UserSchema = new mongoose.Schema({
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

// Product Schema
const ProductSchema = new mongoose.Schema({
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
  isNew: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  specifications: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Order Schema
const OrderSchema = new mongoose.Schema({
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

// Cart Schema
const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

// Wishlist Schema
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

async function setupDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create models
    const User = mongoose.model('User', UserSchema);
    const Product = mongoose.model('Product', ProductSchema);
    const Order = mongoose.model('Order', OrderSchema);
    const Cart = mongoose.model('Cart', CartSchema);
    const Wishlist = mongoose.model('Wishlist', WishlistSchema);

    // Clear existing collections
    console.log('🧹 Cleaning existing collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    await User.create({
      userId: 'admin@meradukan.com',
      email: 'admin@meradukan.com',
      fullName: 'Admin User',
      isAdmin: true,
      coins: 1000,
      referralCode: 'ADMIN001'
    });

    // Create sample users
    console.log('👥 Creating sample users...');
    const sampleUsers = [
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
      }
    ];

    await User.insertMany(sampleUsers);

    // Load and insert products from JSON files
    console.log('📦 Loading products...');
    
    // Sample products to ensure we have data
    const sampleProducts = [
      {
        id: 'tech-001',
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: { original: 2999, discounted: 1999 },
        image: '/images/placeholder.jpg',
        category: 'Electronics',
        subcategory: 'Audio',
        quantity: 50,
        isNew: true,
        isFeatured: true,
        tags: ['wireless', 'bluetooth', 'headphones']
      },
      {
        id: 'home-001',
        name: 'Smart LED Bulb',
        description: 'WiFi enabled smart LED bulb with color changing',
        price: { original: 899, discounted: 699 },
        image: '/images/placeholder.jpg',
        category: 'Home & Garden',
        subcategory: 'Lighting',
        quantity: 100,
        isNew: false,
        isFeatured: true,
        tags: ['smart', 'led', 'wifi']
      },
      {
        id: 'fashion-001',
        name: 'Cotton T-Shirt',
        description: 'Premium quality cotton t-shirt',
        price: { original: 599, discounted: 399 },
        image: '/images/placeholder.jpg',
        category: 'Fashion',
        subcategory: 'Clothing',
        quantity: 75,
        isNew: true,
        isFeatured: false,
        tags: ['cotton', 'tshirt', 'casual']
      }
    ];

    await Product.insertMany(sampleProducts);

    // Create sample orders
    console.log('🛒 Creating sample orders...');
    const sampleOrders = [
      {
        orderId: 'ORD-001',
        userId: 'user1@example.com',
        items: [{
          productId: 'tech-001',
          name: 'Wireless Bluetooth Headphones',
          price: 1999,
          quantity: 1,
          image: '/images/placeholder.jpg'
        }],
        total: 1999,
        status: 'delivered',
        paymentMethod: 'razorpay',
        paymentId: 'pay_test123',
        shippingAddress: {
          name: 'Rahul Sharma',
          phone: '9876543210',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        }
      },
      {
        orderId: 'ORD-002',
        userId: 'user2@example.com',
        items: [{
          productId: 'home-001',
          name: 'Smart LED Bulb',
          price: 699,
          quantity: 2,
          image: '/images/placeholder.jpg'
        }],
        total: 1398,
        status: 'shipped',
        paymentMethod: 'razorpay',
        paymentId: 'pay_test456'
      }
    ];

    await Order.insertMany(sampleOrders);

    console.log('✅ Database setup completed successfully!');
    console.log('📊 Summary:');
    console.log(`- Users: ${await User.countDocuments()}`);
    console.log(`- Products: ${await Product.countDocuments()}`);
    console.log(`- Orders: ${await Order.countDocuments()}`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

setupDatabase();