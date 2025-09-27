import mongoose from 'mongoose';

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

export default mongoose.models.AdminProduct || mongoose.model('AdminProduct', AdminProductSchema);