'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { Package, ShoppingCart, Users, Star, TrendingUp, Plus, Eye, Trash2, RefreshCw, Settings } from 'lucide-react'
import ErrorBoundary from '@/components/ErrorBoundary'

function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [bulkData, setBulkData] = useState('')
  const [stats, setStats] = useState(null)
  const [recentProducts, setRecentProducts] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
    fetchRecentProducts()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch real data from admin APIs
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/users'),
        fetch('/api/admin/orders')
      ])
      
      const productsData = productsRes.ok ? await productsRes.json() : { products: [] }
      const usersData = usersRes.ok ? await usersRes.json() : { users: [] }
      const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] }
      
      const products = productsData.products || []
      const users = usersData.users || []
      const orders = ordersData.orders || []
      
      let totalRevenue = 0
      orders.forEach(order => {
        totalRevenue += order.total || 0
      })
      
      const stats = {
        totalProducts: products.length,
        newProducts: products.filter(p => p.isNewProduct).length,
        lowStock: products.filter(p => p.quantity <= 5).length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: Math.round(totalRevenue),
        avgOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0
      }
      
      console.log('Dashboard stats:', stats)
      setStats(stats)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setStats({
        totalProducts: 0,
        newProducts: 0,
        lowStock: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        avgOrderValue: 0
      })
    }
  }

  const fetchRecentProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const data = response.ok ? await response.json() : { products: [] }
      const recentProducts = (data.products || []).slice(0, 5)
      setRecentProducts(recentProducts)
      console.log('Recent products loaded:', recentProducts.length)
    } catch (error) {
      console.error('Failed to fetch recent products:', error)
      setRecentProducts([])
    }
  }

  const handleBulkUpload = async () => {
    if (!bulkData.trim()) {
      toast({ title: "Error", description: "Please enter product data" })
      return
    }

    setIsLoading(true)
    try {
      const products = JSON.parse(bulkData)
      
      // Upload each product individually
      let successCount = 0
      for (const product of products) {
        try {
          const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: product.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: product.name,
              description: product.description,
              price: product.price,
              image: product.image,
              category: product.category,
              quantity: product.quantity || 0
            })
          })
          
          if (response.ok) successCount++
        } catch (err) {
          console.error('Error uploading product:', err)
        }
      }
      
      toast({ 
        title: "Success", 
        description: `Added ${successCount} out of ${products.length} products` 
      })
      setBulkData('')
      fetchStats()
      fetchRecentProducts()
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Invalid JSON format" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast({ title: "Success", description: "Product deleted successfully" })
        fetchStats()
        fetchRecentProducts()
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete product" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📊 Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/admin/catalog">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Catalog
              </Button>
            </Link>
            <Link href="/admin/add-product">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Stats Cards */}
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
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold">{stats.totalProducts || 0}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders || 0}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-green-500" />
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
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bulk Upload */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Bulk Product Upload</h2>
            <p className="text-gray-600 mb-4">
              Paste your product JSON array below to add multiple products at once.
            </p>
            
            <Textarea
              placeholder="Paste JSON array of products here..."
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              className="min-h-[200px] mb-4"
            />
            
            <Button 
              onClick={handleBulkUpload}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Uploading...' : 'Upload Products'}
            </Button>
          </div>

          {/* Recent Products */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Products</h2>
              <Link href="/admin/catalog">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {!recentProducts ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded mb-1 w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                ))
              ) : recentProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No products found</p>
                </div>
              ) : (
                recentProducts.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                        {product.isNew && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">NEW</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">₹{product.price.discounted || product.price.original}</span>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Manage Orders
              </Button>
            </Link>
            <Link href="/admin/catalog">
              <Button variant="outline" className="w-full">
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link href="/admin/add-product">
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={fetchStats}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Stats
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Website
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ErrorBoundary>
      <AdminDashboard />
    </ErrorBoundary>
  )
}