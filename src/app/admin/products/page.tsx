'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { Package, Plus, Edit, Eye, Trash2 } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch products" })
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
        setProducts(products.filter((p: any) => p.id !== id))
        toast({ title: "Success", description: "Product deleted successfully" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete product" })
    }
  }

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Link href="/admin/add-product">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                          {product.isNew && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">NEW</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{product.category}</div>
                      <div className="text-sm text-gray-500">{product.subcategory}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{product.price.discounted || product.price.original}
                      </div>
                      {product.price.discounted && (
                        <div className="text-sm text-gray-500 line-through">₹{product.price.original}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${product.quantity > 5 ? 'text-green-600' : product.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {product.quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => window.open(`/product/${product.slug}`, '_blank')}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => window.location.href = `/admin/products/${product.id}/edit`}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => deleteProduct(product.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}