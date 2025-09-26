import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        referralCode: user.referralCode,
        referralBalance: user.referralBalance
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}