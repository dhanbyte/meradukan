'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { useProductStore } from '@/lib/productStore';
import ProductCard from './ProductCard';

type Category = 'home' | 'tech' | 'ayurvedic';

export default function CategoryProducts({ category }: { category: Category }) {
  const store = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!store.initialized) {
      console.log('Initializing product store...');
      store.init();
    }
  }, [store]);

  useEffect(() => {
    if (store.products.length > 0) {
      console.log(`Filtering ${store.products.length} products for ${category} category`);
      const categoryProducts = store.products.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
      console.log(`Found ${categoryProducts.length} ${category} products`);
      setFilteredProducts(categoryProducts);
    }
  }, [store.products, category]);

  if (store.isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">
          <div className="animate-spin h-5 w-5 mr-3 border-2 border-gray-600 rounded-full border-t-transparent inline-block"></div>
          Loading {category} products...
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-600">No products found in {category} category</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} p={product} />
      ))}
    </div>
  );
}