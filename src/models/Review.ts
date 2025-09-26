import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    images: {
      type: [String],
      default: [],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add index for faster querying
reviewSchema.index({ productId: 1, status: 1 });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Check if model is already defined to avoid recompilation errors
const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;
