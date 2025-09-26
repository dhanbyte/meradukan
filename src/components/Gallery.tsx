
'use client'
import { useState, useEffect } from 'react'
import OptimizedImage from './OptimizedImage'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Gallery({ images, isOutOfStock }: { images: string[]; isOutOfStock: boolean; }) {
  const [active, setActive] = useState(0)
  
  if (!images || images.length === 0) {
    return <div className="aspect-square w-full rounded-xl bg-gray-200" />
  }

  const nextImage = () => {
    setActive((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setActive((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      nextImage()
    } else {
      prevImage()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevImage()
      } else if (e.key === 'ArrowRight') {
        nextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div>
      <div className="relative mb-3 aspect-square w-full max-w-md mx-auto md:max-w-none overflow-hidden rounded-2xl group">
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x
              if (swipe < -10000) {
                handleSwipe('left')
              } else if (swipe > 10000) {
                handleSwipe('right')
              }
            }}
          >
            <div className="relative w-full h-full">
              <OptimizedImage 
                src={images[active]} 
                alt={`Product image ${active + 1}`} 
                width={800}
                height={800}
                priority={true}
                className="object-cover w-full h-full" 
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-white text-lg font-bold bg-black/50 px-4 py-2 rounded-full">OUT OF STOCK</span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {active + 1} / {images.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {images.map((src, i) => (
          <button 
            key={i} 
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === active ? 'border-brand shadow-lg' : 'border-transparent hover:border-brand/50'}`} 
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
          >
            <div className="relative h-full w-full">
                <OptimizedImage src={src} alt={`thumbnail ${i + 1}`} width={64} height={64} className="object-cover w-full h-full" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
