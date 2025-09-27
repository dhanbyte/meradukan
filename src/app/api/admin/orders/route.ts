import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AdminOrder from '@/models/AdminOrder';

export async function GET() {
  try {
    await dbConnect();
    const orders = await AdminOrder.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    console.log('🔄 Updating order:', { orderId, status });

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    
    // First check if order exists by orderId or _id
    let existingOrder = await AdminOrder.findOne({ orderId });
    if (!existingOrder) {
      existingOrder = await AdminOrder.findById(orderId);
    }
    console.log('📋 Existing order:', existingOrder ? 'Found' : 'Not found');
    
    // Try to update by orderId first, then by _id
    let order = await AdminOrder.findOneAndUpdate(
      { orderId },
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!order) {
      order = await AdminOrder.findByIdAndUpdate(
        orderId,
        { status, updatedAt: new Date() },
        { new: true }
      );
    }

    if (!order) {
      console.log('❌ Order not found for update:', orderId);
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    console.log('✅ Order updated successfully:', order.orderId, 'Status:', order.status);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('❌ Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}