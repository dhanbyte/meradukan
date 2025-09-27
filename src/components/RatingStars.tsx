import { Star } from 'lucide-react'
export default function RatingStars({ value = 0, size = 'md' }: { value?: number; size?: 'xs' | 'sm' | 'md' }) {
  const safeValue = typeof value === 'number' ? value : 0
  const full = Math.round(safeValue)
  const sizeClasses = {
    xs: { star: 'h-2.5 w-2.5', text: 'text-[9px]', gap: 'gap-0' },
    sm: { star: 'h-3 w-3', text: 'text-[10px]', gap: 'gap-0.5' },
    md: { star: 'h-4 w-4', text: 'text-xs', gap: 'gap-0.5' }
  }

  return (
    <div className={`flex items-center ${sizeClasses[size].gap}`} aria-label={`Rated ${safeValue} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${sizeClasses[size].star} ${i < full ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'}`} />
      ))}
      <span className={`ml-1 ${sizeClasses[size].text} text-gray-500`}>{safeValue.toFixed(1)}</span>
    </div>
  )
}
