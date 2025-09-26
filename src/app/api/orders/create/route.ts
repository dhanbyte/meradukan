import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, items, totalAmount, shippingAddress, paymentMethod } = await request.json();
    
    if (!userId || !items || !items.length || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Start a database session for transaction
    const session = db.startSession();
    
    try {
      let orderId: string;
      
      await session.withTransaction(async () => {
        // 1. Create the order
        const order = {
          userId,
          items,
          totalAmount,
          status: 'pending',
          shippingAddress,
          paymentMethod,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        const orderResult = await db.collection('orders').insertOne(order, { session });
        orderId = orderResult.insertedId.toString();
        
        // 2. Process referral if this is user's first order
        const user = await db.collection('users').findOne(
          { _id: userId },
          { session }
        );
        
        if (user && user.referredBy && !user.hasMadePurchase) {
          // Calculate referral reward (₹5 for orders < ₹100, ₹10 for ≥ ₹100)
          const rewardAmount = totalAmount < 100 ? 5 : 10;
          
          // Add reward to referrer's balance
          await db.collection('users').updateOne(
            { _id: user.referredBy },
            { 
              $inc: { 
                referralBalance: rewardAmount,
                totalEarned: rewardAmount 
              } 
            },
            { session }
          );
          
          // Record the referral reward
          await db.collection('referral_rewards').insertOne(
            {
              referrerId: user.referredBy,
              refereeId: userId,
              orderId: orderId,
              amount: rewardAmount,
              orderAmount: totalAmount,
              status: 'completed',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            { session }
          );
          
          // Mark user as having made a purchase
          await db.collection('users').updateOne(
            { _id: userId },
            { $set: { hasMadePurchase: true } },
            { session }
          );
        }
      });
      
      return NextResponse.json({
        success: true,
        orderId,
        message: 'Order created successfully'
      });
      
    } finally {
      await session.endSession();
    }
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
