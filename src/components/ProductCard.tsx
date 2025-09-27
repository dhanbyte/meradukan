'use client'
import Link from 'next/link'
import PriceTag from './PriceTag'
import RatingStars from './RatingStars'
import WishlistButton from './WishlistButton'
import { useCart } from '../lib/cartStore'
import { toast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import ProductSuggestionsRow from './ProductSuggestionsRow'
import UniversalImage from './UniversalImage'
import type { Product } from '../lib/types'
import { Button } from './ui/button'
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useNotificationStore } from '../lib/notificationStore'
import { BellRing, Check } from 'lucide-react'

export default function ProductCard({ p, product, suggest }: { p?: Product; product?: Product; suggest?: any[] }) {
  const productData = p || product;
  if (!productData) return null;
  
  const { add } = useCart();
  const { requireAuth, user } = useRequireAuth();
  const { addNotification, hasNotification } = useNotificationStore();
  const price = productData.price.discounted ?? productData.price.original;
  
  const handleAddToCart = () => {
    if (!requireAuth('add items to cart')) {
      return;
    }
    add(user.id, { id: productData.id, qty: 1, price, name: productData.name, image: productData.image });
    toast({
      title: "Added to Cart",
      description: `${productData.name} has been added to your cart.`,
      className: "bg-green-500 text-white"
    });
  };

  const handleNotifyMe = () => {
    if (!requireAuth('get notified about this product')) {
      return;
    }
    if (!hasNotification(productData.id)) {
      addNotification(user.id, productData.id);
      toast({ 
        title: "You're on the list!", 
        description: `We'll notify you when ${productData.name} is back in stock.`,
        className: "bg-blue-500 text-white"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg border border-gray-100 p-2 flex flex-col group hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square mb-2">
        <Link href={`/product/${productData.slug}`} className="block h-full">
          <div className="relative w-full h-full overflow-hidden rounded-md">
            <UniversalImage
              src={productData.image}
              alt={productData.name}
              width={200}
              height={200}
              className="rounded-md object-cover w-full h-full"
              priority={false}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
            />
            {productData.quantity === 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold bg-red-500 px-1.5 py-0.5 rounded">OUT OF STOCK</span>
              </div>
            )}
          </div>
        </Link>
        <div className="absolute right-1 top-1">
          <WishlistButton id={productData.id} />
        </div>
      </div>
      <div className="flex-grow flex flex-col">
        <Link href={`/product/${productData.slug}`} className="flex-grow">
          <div className="line-clamp-2 text-[11px] sm:text-xs font-medium leading-tight mb-1 h-6">{productData.name}</div>
          <div className="mb-1">
            <RatingStars value={productData.ratings?.average || 0} />
          </div>
          <div className="mb-2">
            <PriceTag original={productData.price.original} discounted={productData.price.discounted} />
          </div>
        </Link>
        <div>
            {productData.quantity > 0 ? (
                <Button onClick={handleAddToCart} size="sm" className="w-full h-6 text-[10px] sm:text-xs py-0">
                    Add to Cart
                </Button>
            ) : (
                hasNotification(productData.id) ? (
                    <Button size="sm" className="w-full h-6 text-[10px] py-0" disabled>
                        <Check className="h-2.5 w-2.5 mr-1" />
                        Notify Me
                    </Button>
                ) : (
                    <Button onClick={handleNotifyMe} size="sm" variant="secondary" className="w-full h-6 text-[10px] py-0">
                        <BellRing className="h-2.5 w-2.5 mr-1" />
                        Notify
                    </Button>
                )
            )}
        </div>
      </div>
      {/* Below-card suggestions */}
      {suggest && suggest.length > 0 && (
        <div className="mt-4 border-t pt-2">
          <div className="mb-1 text-xs font-medium text-gray-500">Customers also viewed</div>
          <ProductSuggestionsRow products={suggest} />
        </div>
      )}
    </motion.div>
  )
}
