import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AdminProduct from '@/models/AdminProduct';

export async function GET() {
  try {
    await dbConnect();
    const products = await AdminProduct.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, price, image, category, quantity } = body;

    if (!id || !name || !price || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    
    const product = new AdminProduct({
      id,
      name,
      description,
      price,
      image: image || '/images/placeholder.jpg',
      category,
      quantity: quantity || 0,
      isNewProduct: true
    });

    await product.save();
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    await dbConnect();
    await AdminProduct.findOneAndDelete({ id });
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}