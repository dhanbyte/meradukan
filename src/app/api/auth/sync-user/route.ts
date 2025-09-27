import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import AdminUser from '@/models/AdminUser';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    await dbConnect();
    
    const existingUser = await AdminUser.findOne({ userId: user.id });
    
    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        user: existingUser,
        message: 'User already synced' 
      });
    }

    const newUser = new AdminUser({
      userId: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      fullName: user.fullName || user.firstName + ' ' + user.lastName || 'User',
      phone: user.primaryPhoneNumber?.phoneNumber || '',
      coins: 5,
      referralCode: Math.random().toString(36).substring(2, 10).toUpperCase()
    });

    await newUser.save();

    return NextResponse.json({ 
      success: true, 
      user: newUser,
      message: 'User synced successfully' 
    });

  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to sync user' 
    }, { status: 500 });
  }
}