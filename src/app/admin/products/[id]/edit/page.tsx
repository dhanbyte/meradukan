'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Tech',
    subcategory: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    quantity: '',
    image: '',
    extraImages: '',
    features: '',
    sku: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const categories = {
    'Tech': ['Mobile Accessories', 'Audio & Headphones', 'Lighting & LED', 'Computer Accessories', 'Power & Cables', 'Fans & Cooling'],
    'Home': ['Kitchenware', 'Puja-Essentials', 'Bathroom-Accessories'],
    'New Arrivals': ['Best Selling', 'Diwali Special', 'Gifts', 'Navratri', 'Pooja Essentials', 'Fragrance']
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const product = await response.json()
        setFormData({
          name: product.name || '',
          brand: product.brand || '',
          category: product.category || 'Tech',
          subcategory: product.subcategory || '',
          description: product.description || '',
          originalPrice: product.price?.original?.toString() || '',
          discountedPrice: product.price?.discounted?.toString() || '',
          quantity: product.quantity?.toString() || '',
          image: product.image || '',
          extraImages: product.extraImages?.join(', ') || '',
          features: product.features?.join(', ') || '',
          sku: product.sku || ''
        })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load product" })
    } finally {
      setIsLoadingProduct(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const productData = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        price: {
          original: parseInt(formData.originalPrice),
          discounted: formData.discountedPrice ? parseInt(formData.discountedPrice) : undefined,
          currency: '₹'
        },
        quantity: parseInt(formData.quantity),
        image: formData.image,
        extraImages: formData.extraImages ? formData.extraImages.split(',').map(url => url.trim()) : [],
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
        sku: formData.sku
      }

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        toast({ title: "Success", description: "Product updated successfully!" })
        router.push('/admin/catalog')
      } else {
        toast({ title: "Error", description: 'Failed to update product' })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update product" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProduct) {
    return <div className="p-6">Loading product...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <Input
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              {Object.keys(categories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subcategory</label>
            <select
              value={formData.subcategory}
              onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select Subcategory</option>
              {categories[formData.category as keyof typeof categories]?.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Original Price *</label>
            <Input
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discounted Price</label>
            <Input
              type="number"
              value={formData.discountedPrice}
              onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quantity *</label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Updating...' : 'Update Product'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}