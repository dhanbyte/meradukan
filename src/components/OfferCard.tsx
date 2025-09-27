
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/lib/types';

const useProductCycler = (products: Product[], count: number, interval: number) => {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (products.length <= count) return;
    
    const timer = setInterval(() => {
      setStartIndex(prevIndex => (prevIndex + count) % products.length);
    }, interval);

    return () => clearInterval(timer);
  }, [products.length, count, interval]);

  const getVisibleProducts = () => {
    if (products.length === 0) return [];
    const visible: Product[] = [];
    for (let i = 0; i < count; i++) {
        // Loop back to the start if we run out of products
        visible.push(products[(startIndex + i) % products.length]);
    }
    return visible;
  }

  return getVisibleProducts();
};

export default function OfferCard({ title, products, href }: { title: string; products: Product[]; href: string }) {
  // We need 4 products for a 2x2 grid. Cycle every 5 seconds.
  const visibleProducts = useProductCycler(products, 4, 5000);

  // A unique key for the AnimatePresence component based on the visible products
  const animationKey = visibleProducts.map(p => p.id).join('-');

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-2 h-full flex flex-col">
        <h3 className="font-bold text-xs sm:text-sm">{title}</h3>
        <p className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2">Top picks</p>
        <div className="relative flex-grow aspect-square">
             <AnimatePresence initial={false}>
                <motion.div
                    key={animationKey} // Key changes when products cycle
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="grid grid-cols-2 grid-rows-2 gap-0.5 sm:gap-1 absolute inset-0"
                >
                    {visibleProducts.map((p, i) => (
                        <Link key={`${p.id}-${i}`} href={`/product/${p.slug}`} className="block w-full h-full relative rounded-md md:rounded-lg overflow-hidden group">
                            <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                sizes="(max-width: 768px) 12vw, 25vw"
                                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                        </Link>
                    ))}
                </motion.div>
             </AnimatePresence>
        </div>
        <Link href={href} className="block mt-2 md:mt-4 text-center text-xs md:text-sm font-semibold text-brand hover:underline">
            See all deals
        </Link>
    </div>
  );
}
