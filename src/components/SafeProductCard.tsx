'use client'
import { ErrorBoundary } from 'react-error-boundary'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/types'

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="bg-gray-100 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-600">Product unavailable</p>
    </div>
  )
}

export default function SafeProductCard({ p, product }: { p?: Product; product?: Product }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ProductCard p={p} product={product} />
    </ErrorBoundary>
  )
}