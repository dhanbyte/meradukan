import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keySecret) {
      return NextResponse.json(
        { error: 'Payment verification failed - configuration error' },
        { status: 500 }
      )
    }

    // Create signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex')

    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified successfully' 
      })
    } else {
      return NextResponse.json(
        { error: 'Payment verification failed - invalid signature' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}