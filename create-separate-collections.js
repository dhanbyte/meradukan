const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://dhananjaywin15112004:ec2cY3Gk2HxizdS2@cluster.4jkps.mongodb.net/?retryWrites=true&w=majority&appName=photos-test';

// Separate Models
const OrderSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  customerName: String,
  email: String,
  phone: String,
  items: Array,
  total: Number,
  status: String,
  address: Object,
  payment: String,
  createdAt: { type: Date, default: Date.now }
});

const CustomerSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  phone: String,
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  status: { type: String, default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

const CartSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  updatedAt: { type: Date, default: Date.now }
});

const WishlistSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  updatedAt: { type: Date, default: Date.now }
});

async function createSeparateCollections() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Order = mongoose.model('Order', OrderSchema);
    const Customer = mongoose.model('Customer', CustomerSchema);
    const Cart = mongoose.model('Cart', CartSchema);
    const Wishlist = mongoose.model('Wishlist', WishlistSchema);

    // Get existing data
    const UserData = mongoose.model('UserData', new mongoose.Schema({
      userId: String, type: String, data: mongoose.Schema.Types.Mixed
    }));
    
    const existingData = await UserData.find({});
    
    console.log('🔄 Migrating data to separate collections...');
    
    // Process existing data
    const customers = new Map();
    
    for (const item of existingData) {
      const { userId, type, data } = item;
      
      if (type === 'orders' && Array.isArray(data)) {
        for (const order of data) {
          // Create order
          await Order.create({
            orderId: order.id,
            userId: userId,
            customerName: order.address?.fullName || 'Unknown',
            email: userId,
            phone: order.address?.phone || 'No phone',
            items: order.items || [],
            total: order.total || 0,
            status: order.status || 'pending',
            address: order.address || {},
            payment: order.payment || 'Unknown',
            createdAt: new Date(order.createdAt || Date.now())
          });
          
          // Update customer info
          if (!customers.has(userId)) {
            customers.set(userId, {
              userId,
              name: order.address?.fullName || 'Unknown',
              email: userId,
              phone: order.address?.phone || 'No phone',
              totalOrders: 0,
              totalSpent: 0,
              status: 'New'
            });
          }
          
          const customer = customers.get(userId);
          customer.totalOrders += 1;
          customer.totalSpent += order.total || 0;
          customer.status = customer.totalOrders > 0 ? 'Active' : 'New';
        }
      }
      
      if (type === 'cart' && Array.isArray(data)) {
        await Cart.create({
          userId: userId,
          items: data
        });
      }
      
      if (type === 'wishlist' && Array.isArray(data)) {
        await Wishlist.create({
          userId: userId,
          items: data
        });
      }
    }
    
    // Save customers
    for (const customer of customers.values()) {
      await Customer.create(customer);
    }
    
    console.log('✅ Migration completed!');
    console.log(`- ${await Order.countDocuments()} orders created`);
    console.log(`- ${await Customer.countDocuments()} customers created`);
    console.log(`- ${await Cart.countDocuments()} carts created`);
    console.log(`- ${await Wishlist.countDocuments()} wishlists created`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createSeparateCollections();