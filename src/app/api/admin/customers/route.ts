import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return empty customers array since no real customer data exists
    return NextResponse.json({
      success: true,
      customers: [],
      total: 0
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}