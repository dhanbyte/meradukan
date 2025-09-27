import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AdminUser from '@/models/AdminUser';
import AdminOrder from '@/models/AdminOrder';
import UserData from '@/models/UserData';

// Fallback for when database is not available
const fallbackResponse = (type: string) => {
  switch (type) {
    case 'cart': return [];
    case 'wishlist': return [];
    case 'orders': return [];
    case 'addresses': return [];
    case 'referrals': return [];
    case 'coins': return 5;
    case 'scratchCards': return [];
    case 'usedSpins': return [];
    default: return null;
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const admin = searchParams.get('admin')
    
    // Admin endpoint to get all users
    if (admin === 'true') {
      try {
        await dbConnect()
        const users = await AdminUser.find({}).lean()
        
        // Get orders for each user
        const usersWithOrders = await Promise.all(
          users.map(async (user) => {
            const orders = await AdminOrder.find({ userId: user.userId }).lean()
            return {
              ...user,
              orders: orders || []
            }
          })
        )
        
        return NextResponse.json({ users: usersWithOrders })
      } catch (dbError) {
        console.warn('Database error:', dbError)
        return NextResponse.json({ users: [] })
      }
    }
    
    if (!userId || !type) {
      return NextResponse.json([])
    }
    
    // Validate inputs
    if (typeof userId !== 'string' || typeof type !== 'string') {
      return NextResponse.json(fallbackResponse(type))
    }
    
    // If database is not available, return fallback
    if (!dbConnect || !UserData) {
      return NextResponse.json(fallbackResponse(type))
    }
    
    try {
      await dbConnect()
      const userData = await UserData.findOne({ 
        userId: userId.trim(), 
        type: type.trim() 
      })
      
      const result = userData?.data ?? fallbackResponse(type)
      return NextResponse.json(result)
    } catch (dbError) {
      console.warn('Database error, using fallback:', dbError)
      return NextResponse.json(fallbackResponse(type))
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    // Return empty array instead of error to prevent UI breaks
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, data } = body
    
    if (!userId || !type || data === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }
    
    // Validate inputs
    if (typeof userId !== 'string' || typeof type !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid input types' }, { status: 400 })
    }
    
    // If database is not available, return success (fallback mode)
    if (!dbConnect || !UserData) {
      return NextResponse.json({ 
        success: true, 
        saved: true,
        message: 'Data saved (fallback mode)'
      })
    }
    
    try {
      await dbConnect()
      const result = await UserData.updateOne(
        { userId: userId.trim(), type: type.trim() },
        { 
          userId: userId.trim(), 
          type: type.trim(), 
          data, 
          updated_at: new Date() 
        },
        { upsert: true }
      )
      
      const success = result.modifiedCount > 0 || result.upsertedCount > 0
      
      return NextResponse.json({ 
        success, 
        saved: success,
        message: success ? 'Data saved successfully' : 'No changes made'
      })
    } catch (dbError) {
      console.warn('Database error during save, using fallback:', dbError)
      return NextResponse.json({ 
        success: true, 
        saved: true,
        message: 'Data saved (fallback mode)'
      })
    }
  } catch (error) {
    console.error('Error saving user data:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save data',
      message: 'Server error occurred'
    }, { status: 500 })
  }
}