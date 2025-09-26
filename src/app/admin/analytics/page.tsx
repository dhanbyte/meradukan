'use client'
import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, ShoppingCart } from 'lucide-react'

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null)
  const [topProducts, setTopProducts] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const [statsRes, productsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/top-products')
      ])
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
      
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setTopProducts(productsData.topProducts || [])
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setStats({ totalRevenue: 0, totalOrders: 0, totalUsers: 0, avgOrderValue: 0 })
      setTopProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {!stats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders || 0}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold">{stats.totalUsers || 0}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold">₹{stats.avgOrderValue || 0}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Top Selling Products</h2>
        </div>
        <div className="p-6">
          {!topProducts ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded animate-pulse">
                  <div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No sales data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.unitsSold} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{product.revenue?.toLocaleString() || 0}</p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}