'use client'
import Link from 'next/link'
import PriceTag from './PriceTag'
import RatingStars from './RatingStars'
import WishlistButton from './WishlistButton'
import { useCart } from '../lib/cartStore'
import { toast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import ProductSuggestionsRow from './ProductSuggestionsRow'
import OptimizedImage from './OptimizedImage'
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-2 flex flex-col group"
    >
      <div className="relative aspect-square">
        <Link href={`/product/${productData.slug}`} className="block h-full">
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            <OptimizedImage
              src={productData.image}
              alt={productData.name}
              width={400}
              height={400}
              className="rounded-lg object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
              priority={false}
              quality={65}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {productData.quantity === 0 && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-full">OUT OF STOCK</span>
              </div>
            )}
          </div>
        </Link>
        <div className="absolute right-1 top-1">
          <WishlistButton id={productData.id} />
        </div>
      </div>
      <div className="flex-grow flex flex-col pt-2 px-1">
        <Link href={`/product/${productData.slug}`} className="flex-grow">
          <div className="line-clamp-2 h-9 text-sm font-medium">{productData.name}</div>
          <RatingStars value={productData.ratings?.average || 0} />
          <div className="mt-1">
            <PriceTag original={productData.price.original} discounted={productData.price.discounted} />
          </div>
        </Link>
        <div className="mt-2">
            {productData.quantity > 0 ? (
                <Button onClick={handleAddToCart} size="sm" className="w-full h-9">
                    Add to Cart
                </Button>
            ) : (
                hasNotification(productData.id) ? (
                    <Button size="sm" className="w-full h-9" disabled>
                        <Check className="h-4 w-4 mr-2" />
                        We'll Notify You
                    </Button>
                ) : (
                    <Button onClick={handleNotifyMe} size="sm" variant="secondary" className="w-full h-9">
                        <BellRing className="h-4 w-4 mr-2" />
                        Notify Me
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
