import mongoose from 'mongoose';

export interface ICategory extends mongoose.Document {
  name: string;
  slug: string;
  description?: string;
  parent?: mongoose.Types.ObjectId;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  image: { type: String },
}, {
  timestamps: true
});

// Add text index for search
categorySchema.index({ 
  name: 'text', 
  description: 'text'
});

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default Category;