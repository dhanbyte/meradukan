import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password, name, refCode } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user object
    const userData: any = {
      email,
      password,
      name,
      referredBy: null,
      referralBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      hasMadePurchase: false,
      referralCount: 0
    };

    // Handle referral if refCode exists
    if (refCode) {
      const referrer = await User.findOne({ referralCode: refCode });
      if (referrer) {
        userData.referredBy = referrer._id;
      }
    }

    // Create user
    const newUser = new User(userData);
    await newUser.save();

    // Update referrer's count if applicable
    if (refCode && userData.referredBy) {
      await User.findByIdAndUpdate(userData.referredBy, {
        $inc: { referralCount: 1 }
      });
    }

    // Generate token
    const token = generateToken(newUser._id);

    // Return success response
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        referralCode: newUser.referralCode,
        referralBalance: newUser.referralBalance
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
