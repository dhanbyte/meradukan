import mongoose from 'mongoose';

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

export default mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);