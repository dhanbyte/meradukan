import mongoose from 'mongoose';

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
  status: { type: String, default: 'pending' },
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

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);