'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { Package, ShoppingCart, Users, Star, TrendingUp, Plus, Eye, Trash2 } from 'lucide-react'

export default function AdminPage() {
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
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchRecentProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=5')
      if (response.ok) {
        const data = await response.json()
        setRecentProducts(data.slice(0, 5))
      }
    } catch (error) {
      console.error('Failed to fetch recent products:', error)
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
      
      const response = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
      })

      const result = await response.json()
      
      if (response.ok) {
        toast({ 
          title: "Success", 
          description: result.message || `Added ${result.insertedCount} products` 
        })
        setBulkData('')
        fetchStats()
        fetchRecentProducts()
      } else {
        toast({ 
          title: "Error", 
          description: result.error || 'Failed to upload products' 
        })
      }
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
      const response = await fetch(`/api/products/${id}`, {
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
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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
                    <p className="text-sm text-gray-600">New Products (7 days)</p>
                    <p className="text-2xl font-bold">{stats.newProducts || 0}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Low Stock Items</p>
                    <p className="text-2xl font-bold">{stats.lowStock || 0}</p>
                  </div>
                  <Package className="h-8 w-8 text-red-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                    <p className="text-2xl font-bold">₹{stats.avgOrderValue || 0}</p>
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
            <Link href="/admin/catalog">
              <Button variant="outline" className="w-full">
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link href="/admin/add-product">
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Single Product
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={fetchStats}>
              <TrendingUp className="h-4 w-4 mr-2" />
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