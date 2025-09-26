'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Package, Truck, CheckCircle } from 'lucide-react'
import ErrorBoundary from '@/components/ErrorBoundary'

function OrdersContent() {
  const [orders, setOrders] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Package className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      default: return <ShoppingCart className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">{orders ? orders.length : 0} total orders</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <Input
            placeholder="Search orders by ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders && orders.filter((order: any) => 
                  order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                        <div className="text-sm text-gray-500">{order.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.items || 0}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{order.total?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status || 'pending')}`}>
                        {getStatusIcon(order.status || 'pending')}
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {orders && orders.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OrdersPage() {
  return (
    <ErrorBoundary>
      <OrdersContent />
    </ErrorBoundary>
  )
}