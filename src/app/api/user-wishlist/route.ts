import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Wishlist from '@/models/Wishlist';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    await dbConnect();
    const wishlist = await Wishlist.findOne({ userId });
    return NextResponse.json({ success: true, items: wishlist?.items || [] });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch wishlist' }, { status: 500 });
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
    await Wishlist.findOneAndUpdate(
      { userId },
      { userId, items, updatedAt: new Date() },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Wishlist updated' });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    return NextResponse.json({ success: false, error: 'Failed to update wishlist' }, { status: 500 });
  }
}