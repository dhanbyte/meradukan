import mongoose, { Document, Schema } from 'mongoose';

// Define the Product interface
interface IProduct extends Document {
  slug: string;
  name: string;
  brand?: string;
  description: string;
  shortDescription?: string;
  price: {
    original: number;
    discounted?: number;
    currency: string;
  };
  image: string;
  extraImages?: string[];
  video?: string;
  category: string;
  subcategory?: string;
  tertiaryCategory?: string;
  tags?: string[];
  features?: string[];
  specifications?: Record<string, any>;
  quantity: number;
  sku?: string;
  shippingCost: number;
  taxPercent: number;
  inventory: {
    inStock: boolean;
    lowStockThreshold: number;
  };
  ratings: {
    average: number;
    count: number;
  };
  status: 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
  returnPolicy: {
    eligible: boolean;
    duration: number;
  };
  warranty: string;
  createdAt: Date;
  updatedAt: Date;
}

// Delete existing model to avoid cache issues
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const productSchema = new Schema<IProduct>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: String,
  description: { type: String, required: true },
  shortDescription: String,
  price: {
    original: { type: Number, required: true },
    discounted: Number,
    currency: { type: String, default: '₹' }
  },
  image: { type: String, required: true },
  extraImages: [String],
  video: String,
  category: { type: String, required: true },
  subcategory: String,
  tertiaryCategory: String,
  tags: [String],
  features: [String],
  specifications: mongoose.Schema.Types.Mixed,
  quantity: { type: Number, default: 0 },
  sku: String,
  shippingCost: { type: Number, default: 0 },
  taxPercent: { type: Number, default: 18 },
  inventory: {
    inStock: { type: Boolean, default: true },
    lowStockThreshold: { type: Number, default: 5 }
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['active', 'inactive', 'out_of_stock', 'discontinued'], default: 'active' },
  returnPolicy: {
    eligible: { type: Boolean, default: true },
    duration: { type: Number, default: 7 }
  },
  warranty: { type: String, default: '1 Year Warranty' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId',
  match: { status: 'approved' },
  options: { sort: { createdAt: -1 } }
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export type { IProduct };
export default Product;