import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AdminUser from '@/models/AdminUser';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, fullName, phone } = body;

    if (!userId || !email || !fullName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    await dbConnect();
    
    // Check if user already exists
    const existingUser = await AdminUser.findOne({ 
      $or: [{ userId }, { email }] 
    });

    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        user: existingUser,
        message: 'User already exists' 
      });
    }

    // Create new user
    const user = new AdminUser({
      userId,
      email,
      fullName,
      phone,
      coins: 5, // Welcome coins
      referralCode: Math.random().toString(36).substring(2, 10).toUpperCase()
    });

    await user.save();

    return NextResponse.json({ 
      success: true, 
      user,
      message: 'User registered successfully' 
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to register user' 
    }, { status: 500 });
  }
}