import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Get all users with referral data
    const users = await db.collection('users').find({ 
      $or: [
        { referralBalance: { $exists: true } },
        { 'referralData': { $exists: true } }
      ]
    }).toArray();
    
    // Process user data to include referral information
    const userBalances = users.map(user => ({
      id: user._id.toString(),
      email: user.email || user.emailAddress || 'No email',
      referralBalance: user.referralBalance || 0,
      totalEarned: user.totalEarned || 0,
      totalWithdrawn: user.totalWithdrawn || 0,
      lastActive: user.lastActive || user.updatedAt || user.createdAt
    }));
    
    // Sort by highest balance first
    const sortedUsers = userBalances.sort((a, b) => b.referralBalance - a.referralBalance);
    
    return NextResponse.json(sortedUsers);
    
  } catch (error) {
    console.error('Error fetching user referral balances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user referral balances' },
      { status: 500 }
    );
  }
}
