import mongoose from 'mongoose';

// Order Model
const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  items: [{
    id: String,
    name: String,
    price: Number,
    qty: Number,
    image: String
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
  address: {
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  payment: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Customer Model
const CustomerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  status: { type: String, default: 'New', enum: ['New', 'Active', 'VIP'] },
  lastOrderDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Cart Model
const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    id: String,
    name: String,
    price: Number,
    qty: Number,
    image: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

// Wishlist Model
const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    id: String,
    name: String,
    price: Number,
    image: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
export const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
export const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);