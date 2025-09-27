export default function PriceTag({ original, discounted, currency = '₹', size = 'md' }: { original: number; discounted?: number; currency?: string; size?: 'sm' | 'md' | 'lg' }) {
  const safeOriginal = original || 0
  const safeDiscounted = discounted || 0
  const price = safeDiscounted || safeOriginal
  const off = safeDiscounted ? Math.round(((safeOriginal - safeDiscounted) / safeOriginal) * 100) : 0
  const savings = safeDiscounted ? safeOriginal - safeDiscounted : 0;

  const sizeClasses = {
    sm: {
      price: 'text-xs font-semibold',
      original: 'text-[10px] text-gray-400 line-through',
      discount: 'text-[9px] font-medium text-green-600'
    },
    md: {
      price: 'text-lg font-semibold',
      original: 'text-sm text-gray-400 line-through',
      discount: 'text-xs font-medium text-green-600'
    },
    lg: {
      price: 'text-xl font-semibold',
      original: 'text-base text-gray-400 line-through',
      discount: 'text-sm font-medium text-green-600'
    }
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-1">
      <span className={sizeClasses[size].price}>{currency}{price.toLocaleString('en-IN')}</span>
      {safeDiscounted && (
        <>
          <span className={sizeClasses[size].original}>{currency}{safeOriginal.toLocaleString('en-IN')}</span>
          {size !== 'sm' && (
            <span className={sizeClasses[size].discount}>
              {off}% off
            </span>
          )}
        </>
      )}
    </div>
  )
}
