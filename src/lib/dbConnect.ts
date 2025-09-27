import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopwave';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    const conn = await cached.promise;
    cached.conn = conn;
    return conn;
  } catch (e) {
    console.error('❌ MongoDB connection failed:', e);
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;
