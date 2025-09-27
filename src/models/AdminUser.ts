import mongoose from 'mongoose';

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

export default mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);