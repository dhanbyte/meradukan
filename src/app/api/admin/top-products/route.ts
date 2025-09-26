import { NextResponse } from 'next/server'

export async function GET() {
  try {
    let topProducts: any[] = []
    
    try {
      const UserData = require('@/models/UserData').default
      
      const orderData = await UserData.find({ type: 'orders' })
      const productSales: Record<string, { quantity: number, revenue: number, name: string }> = {}
      
      orderData.forEach((userData: any) => {
        if (userData.data && Array.isArray(userData.data)) {
          userData.data.forEach((order: any) => {
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item: any) => {
                if (!productSales[item.id]) {
                  productSales[item.id] = { quantity: 0, revenue: 0, name: item.name }
                }
                productSales[item.id].quantity += item.qty || 1
                productSales[item.id].revenue += (item.price || 0) * (item.qty || 1)
              })
            }
          })
        }
      })
      
      topProducts = Object.entries(productSales)
        .map(([id, data]) => ({
          id,
          name: data.name,
          unitsSold: data.quantity,
          revenue: Math.round(data.revenue)
        }))
        .sort((a, b) => b.unitsSold - a.unitsSold)
        .slice(0, 5)
        
    } catch (dbError) {
      console.warn('Could not fetch top products:', dbError)
    }

    return NextResponse.json({
      success: true,
      topProducts
    })
    
  } catch (error) {
    console.error('Error fetching top products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top products' },
      { status: 500 }
    )
  }
}