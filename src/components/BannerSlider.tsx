
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const BANNERS = [
  { 
    id: 1, 
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=300&fit=crop&crop=center', 
    title: 'DURABLE TRAVEL ACCESSORIES',
    subtitle: 'For Every Journey',
    discount: 'GET UP TO 85% OFF',
    link: '/search?category=Tech' 
  },
  { 
    id: 2, 
    img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=300&fit=crop&crop=center', 
    title: 'DURABLE AUTOMOTIVE ACCESSORIES',
    subtitle: 'FOR EVERY VEHICLE',
    discount: 'Starting from just Rs. 10',
    link: '/search?category=Home' 
  },
  { 
    id: 3, 
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=300&fit=crop&crop=center', 
    title: 'Beautiful HOME DECOR ITEMS',
    subtitle: 'FOR EVERY ONE',
    discount: 'GET UP TO 80% OFF',
    link: '/search?category=Home' 
  },
  { 
    id: 4, 
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=300&fit=crop&crop=center', 
    title: 'PREMIUM ELECTRONICS',
    subtitle: 'Latest Technology',
    discount: 'SPECIAL DEALS',
    link: '/search?category=Tech' 
  },
  { 
    id: 5, 
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=300&fit=crop&crop=center', 
    title: 'KITCHEN ESSENTIALS',
    subtitle: 'Modern Solutions',
    discount: 'UP TO 70% OFF',
    link: '/search?category=Home' 
  },
]

export default function BannerSlider(){
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => { 
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % BANNERS.length)
    }, 4000); // Increased to 4 seconds for better viewing
    return () => clearInterval(timer) 
  }, [])
  
  return (
    <div className="w-full overflow-hidden">
      <div className="relative">
        <motion.div 
          className="flex gap-4"
          animate={{ x: `-${currentIndex * (100 / 2.2)}%` }}
          transition={{ 
            duration: 0.8, 
            ease: 'easeInOut' 
          }}
        >
          {BANNERS.map((banner, index) => (
            <motion.a
              key={banner.id}
              href={banner.link}
              className="flex-shrink-0 w-[45%] md:w-[48%] lg:w-[48%] relative rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-600 to-purple-700 h-32 md:h-40 lg:h-48"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0">
                <Image 
                  src={banner.img} 
                  alt={banner.title} 
                  fill 
                  sizes="(max-width: 768px) 45vw, 48vw" 
                  className="object-cover opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
              </div>
              
              <div className="relative z-10 p-3 md:p-4 lg:p-6 h-full flex flex-col justify-between text-white">
                <div>
                  <h3 className="text-[10px] md:text-xs lg:text-sm font-bold leading-tight mb-1">
                    {banner.title}
                  </h3>
                  <p className="text-[8px] md:text-xs opacity-90 mb-1">
                    {banner.subtitle}
                  </p>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <div className="bg-red-500 text-white text-[8px] md:text-xs px-1.5 py-0.5 rounded-full mb-1 inline-block">
                      {banner.discount}
                    </div>
                    <button className="bg-white text-red-600 text-[8px] md:text-xs font-semibold px-2 py-0.5 rounded-full hover:bg-gray-100 transition-colors">
                      SHOP NOW
                    </button>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center mt-4 gap-2">
        {BANNERS.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentIndex(i)} 
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex 
                ? 'bg-blue-600 w-6' 
                : 'bg-gray-300 w-2 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
