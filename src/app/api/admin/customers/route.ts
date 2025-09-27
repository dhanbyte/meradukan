import { NextResponse } from 'next/server'

let dbConnect: any;
let Customer: any;
let Cart: any;
let Wishlist: any;

try {
  dbConnect = require('../../../../lib/dbConnect').default;
  Customer = require('../../../../models/Customer').default;
  const mongoose = require('mongoose');
  
  const CartSchema = new mongoose.Schema({ userId: String, items: Array });
  const WishlistSchema = new mongoose.Schema({ userId: String, items: Array });
  
  Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
  Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
} catch (error) {
  console.warn('Database modules not available');
}

export async function GET() {
  try {
    let customers: any[] = []
    
    if (!dbConnect || !Customer) {
      return NextResponse.json({
        success: true,
        customers: [],
        total: 0
      })
    }
    
    try {
      await dbConnect()
      const customerData = await Customer.find({}).lean()
      
      for (const customer of customerData) {
        // Get cart and wishlist counts
        const cart = await Cart.findOne({ userId: customer.userId })
        const wishlist = await Wishlist.findOne({ userId: customer.userId })
        
        customers.push({
          id: customer.userId,
          name: customer.name,
          email: customer.email,
          phone: customer.phone || 'No phone',
          wishlistCount: wishlist?.items?.length || 0,
          cartCount: cart?.items?.length || 0,
          orders: customer.totalOrders,
          totalSpent: customer.totalSpent,
          status: customer.status,
          joinedDate: customer.createdAt,
          lastActivity: customer.updatedAt
        })
      }
      
    } catch (dbError) {
      console.warn('Could not fetch customers:', dbError)
    }

    return NextResponse.json({
      success: true,
      customers,
      total: customers.length
    })
    
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { success: true, customers: [], total: 0 },
      { status: 200 }
    )
  }
}