import mongoose from 'mongoose';

const UserDataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updated_at: { type: Date, default: Date.now }
});

UserDataSchema.index({ userId: 1, type: 1 }, { unique: true });

export default mongoose.models.UserData || mongoose.model('UserData', UserDataSchema);