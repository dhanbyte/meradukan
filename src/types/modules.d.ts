// Type definitions for module paths
declare module '@/lib/dbConnect' {
  import { Mongoose } from 'mongoose';
  const dbConnect: () => Promise<Mongoose>;
  export default dbConnect;
}

declare module '@/models/Product' {
  import { Document, Model } from 'mongoose';
  
  interface IProduct extends Document {
    // Add your Product interface properties here
    _id: any;
    name: string;
    // Add other fields as needed
  }

  const Product: Model<IProduct>;
  export = Product;
  export type { IProduct };
}
