import { NextResponse } from 'next/server'

export async function GET() {
  try {
    let orders: any[] = []
    
    try {
      const UserData = require('@/models/UserData').default
      
      const orderData = await UserData.find({ type: 'orders' })
      
      orderData.forEach((userData: any) => {
        if (userData.data && Array.isArray(userData.data)) {
          userData.data.forEach((order: any) => {
            orders.push({
              id: order.id,
              customerName: order.address?.fullName || 'Unknown',
              email: order.address?.email || 'N/A',
              address: order.address ? `${order.address.city}, ${order.address.state}` : 'N/A',
              items: order.items?.length || 0,
              total: order.total || 0,
              status: order.status || 'pending',
              date: order.createdAt || new Date().toISOString(),
              payment: order.payment || 'Unknown'
            })
          })
        }
      })
      
      // Sort by date (newest first)
      orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
    } catch (dbError) {
      console.warn('Could not fetch orders:', dbError)
    }

    return NextResponse.json({
      success: true,
      orders,
      total: orders.length
    })
    
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}