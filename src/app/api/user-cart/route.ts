import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Cart from '@/models/Cart';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    await dbConnect();
    const cart = await Cart.findOne({ userId });
    return NextResponse.json({ success: true, items: cart?.items || [] });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    await dbConnect();
    await Cart.findOneAndUpdate(
      { userId },
      { userId, items, updatedAt: new Date() },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ success: false, error: 'Failed to update cart' }, { status: 500 });
  }
}