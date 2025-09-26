'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { useProductStore } from '@/lib/productStore'

const categoryMap = {
  'mobile-accessories': 'Accessories',
  'fans-cooling': 'Fans',
  'audio-headphones': 'Audio',
  'lighting-led': 'Lighting',
  'computer-accessories': 'Computer Accessories',
  'power-cables': 'Power & Cables'
}

const categoryImages = {
  'mobile-accessories': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
  'fans-cooling': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
  'audio-headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
  'lighting-led': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center',
  'computer-accessories': 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/01_d6ef1d68-1400-4132-ad4a-a54ca8de4577.avif',
  'power-cables': 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/01_0748acd3-4797-400f-997d-6cecf6b22f5a.webp?updatedAt=1756628128432'
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { products, isLoading } = useProductStore()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortBy, setSortBy] = useState('relevance')

  const categoryName = categoryMap[slug] || slug
  const categoryImage = categoryImages[slug]

  useEffect(() => {
    if (products.length > 0) {
      let filtered = products.filter(product => 
        product.category === 'Tech' && 
        (product.subcategory === categoryName || 
         product.subcategory?.toLowerCase().includes(categoryName.toLowerCase()))
      )

      if (sortBy === 'price-low') {
        filtered = filtered.sort((a, b) => (a.price?.original || 0) - (b.price?.original || 0))
      } else if (sortBy === 'price-high') {
        filtered = filtered.sort((a, b) => (b.price?.original || 0) - (a.price?.original || 0))
      }

      setFilteredProducts(filtered)
    }
  }, [products, categoryName, sortBy])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {categoryImage && (
              <img 
                src={categoryImage} 
                alt={categoryName}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
              <p className="text-gray-600">Showing {filteredProducts.length} results</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-3">Quick Filters</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSortBy('relevance')}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    sortBy === 'relevance' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Most Relevant
                </button>
                <button
                  onClick={() => setSortBy('price-low')}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    sortBy === 'price-low' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => setSortBy('price-high')}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    sortBy === 'price-high' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Price: High to Low
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex justify-between items-center">
                <span>Showing {filteredProducts.length} results</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}