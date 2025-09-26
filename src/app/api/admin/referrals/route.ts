import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

export async function GET() {
  try {
    const db = await getDatabase()
    
    // Get all users with their referral data
    const users = await db.collection('users').find({}).toArray()
    const allUserData = await db.collection('user_data').find({}).toArray()
    
    // Get all referral data
    const referralData = allUserData.filter(data => data.type === 'referral_stats')
    
    // Process referral data to get referrer information
    const referralStats = referralData.map(stats => {
      const user = users.find(u => u._id.toString() === stats.userId || u.email === stats.userId || u.emailAddress === stats.userId)
      
      return {
        userId: stats.userId,
        name: user?.full_name || user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Unknown User'),
        email: user?.email || user?.emailAddress || 'No email',
        totalReferrals: stats.data?.totalReferrals || 0,
        totalSignups: stats.data?.totalSignups || 0,
        totalEarnings: stats.data?.totalEarnings || 0,
        lastUpdated: stats.updatedAt || stats.createdAt || new Date().toISOString()
      }
    })
    
    // Sort by most referrals first
    const sortedStats = referralStats.sort((a, b) => b.totalReferrals - a.totalReferrals)
    
    return NextResponse.json(sortedStats)
    
  } catch (error) {
    console.error('Error fetching referral stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral statistics' },
      { status: 500 }
    )
  }
}
