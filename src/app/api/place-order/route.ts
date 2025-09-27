import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AdminOrder from '@/models/AdminOrder';
import AdminUser from '@/models/AdminUser';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items, total, paymentMethod, paymentId, shippingAddress } = body;

    if (!userId || !items || !total) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    await dbConnect();
    
    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create new order
    const order = new AdminOrder({
      orderId,
      userId,
      items,
      total,
      status: 'pending',
      paymentMethod,
      paymentId,
      shippingAddress
    });

    await order.save();

    // Update user's purchase status
    await AdminUser.findOneAndUpdate(
      { userId },
      { 
        $inc: { coins: Math.floor(total * 0.01) }, // 1% cashback in coins
        updatedAt: new Date()
      }
    );

    return NextResponse.json({ 
      success: true, 
      order,
      orderId,
      message: 'Order placed successfully' 
    });

  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to place order' 
    }, { status: 500 });
  }
}