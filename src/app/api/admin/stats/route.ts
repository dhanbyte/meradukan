import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    const totalProducts = await Product.countDocuments({
      category: { $ne: 'Ayurvedic' }
    });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newProducts = await Product.countDocuments({
      category: { $ne: 'Ayurvedic' },
      createdAt: { $gte: sevenDaysAgo }
    });

    const lowStock = await Product.countDocuments({
      category: { $ne: 'Ayurvedic' },
      quantity: { $lte: 5 }
    });

    // Get real order and user data from UserData collection
    let totalOrders = 0;
    let totalRevenue = 0;
    let totalUsers = 0;
    
    try {
      const UserData = require('@/models/UserData').default;
      
      // Count unique users who have orders
      const usersWithOrders = await UserData.distinct('userId', { type: 'orders' });
      totalUsers = usersWithOrders.length;
      
      // Get all order data
      const orderData = await UserData.find({ type: 'orders' });
      
      orderData.forEach(userData => {
        if (userData.data && Array.isArray(userData.data)) {
          totalOrders += userData.data.length;
          userData.data.forEach((order: any) => {
            if (order.total && typeof order.total === 'number') {
              totalRevenue += order.total;
            }
          });
        }
      });
    } catch (dbError) {
      console.warn('Could not fetch order/user data:', dbError);
    }

    const stats = {
      totalProducts,
      newProducts,
      lowStock,
      totalOrders,
      totalUsers,
      totalRevenue: Math.round(totalRevenue),
      avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    };

    return NextResponse.json(stats);
    
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}