
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import BannerSlider from '@/components/BannerSlider';
import ProductCard from '@/components/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel"
import OfferCard from '@/components/OfferCard';
import type { Product } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '@/lib/productStore';
import { NEWARRIVALS_PRODUCTS } from '@/lib/data/newarrivals';
import LoadingSpinner from '@/components/LoadingSpinner';
import MixedProductGrid from '@/components/MixedProductGrid';
import { useToast } from '@/hooks/use-toast';
import { X, MessageCircle, Users, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';


const topCategories = [
  // Tech Subcategories (Top 6) - Using real product images
  { name: 'Mobile Accessories', href: '/search?subcategory=Accessories', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/01_0748acd3-4797-400f-997d-6cecf6b22f5a.webp?updatedAt=1756628128432', dataAiHint: 'mobile accessories', category: 'Tech' },
  { name: 'Computer Accessories', href: '/search?subcategory=Computer%20Accessories', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/01_d6ef1d68-1400-4132-ad4a-a54ca8de4577.avif', dataAiHint: 'computer accessories', category: 'Tech' },
  { name: 'Audio', href: '/search?subcategory=Audio', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/01_53521c05-9caa-4905-9410-e18e9ee19322.webp?updatedAt=1756627475239', dataAiHint: 'audio headphones', category: 'Tech' },
  { name: 'Lighting', href: '/search?subcategory=Lighting', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/07_4a3ac08b-5f90-4f47-9c6f-a48d0999f3e7.webp?updatedAt=1756628649421', dataAiHint: 'led lighting', category: 'Tech' },
  { name: 'Power & Cables', href: '/search?subcategory=Power%20%26%20Cables', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/01_0748acd3-4797-400f-997d-6cecf6b22f5a.webp?updatedAt=1756628128432', dataAiHint: 'power cables', category: 'Tech' },
  { name: 'Fans & Cooling', href: '/search?subcategory=Fans', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/12249d16-5521-4931-b03a-e672fc47fb87.webp?updatedAt=1757057794638', dataAiHint: 'cooling fans', category: 'Tech' },

  // New Arrivals Subcategories (Top 6) - Using real product images
  { name: 'LED Lights', href: '/search?subcategory=LED%20Lights', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_6d35b019-089f-4949-9571-7a7bd595fccd.webp', dataAiHint: 'led lights', category: 'New Arrivals' },
  { name: 'Car Accessories', href: '/search?subcategory=Car%20Accessories', image: 'https://Shopwave.b-cdn.net/new%20arival/01_15d3c786-e22a-4818-8a49-d1c8c6662719.webp', dataAiHint: 'car accessories', category: 'New Arrivals' },
  { name: 'Kitchen Appliances', href: '/search?subcategory=Kitchen%20Appliances', image: 'https://Shopwave.b-cdn.net/new%20arival/17865..1.webp', dataAiHint: 'kitchen appliances', category: 'New Arrivals' },
  { name: 'Cables & Chargers', href: '/search?subcategory=Cables%20%26%20Chargers', image: 'https://Shopwave.b-cdn.net/new%20arival/02_71c68310-5be0-4fac-97e3-de92ea6df361.webp', dataAiHint: 'cables chargers', category: 'New Arrivals' },
  { name: 'Gifts', href: '/search?subcategory=Gifts', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/04_light_59099232-79e1-4dec-805f-42dc9208c96b.webp', dataAiHint: 'gifts', category: 'New Arrivals' },
  { name: 'Home Organization', href: '/search?subcategory=Home%20Organization', image: 'https://Shopwave.b-cdn.net/new%20arival/07_24b9ce72-1c0c-4c5b-bf59-99fefbaa0619.webp', dataAiHint: 'home organization', category: 'New Arrivals' },
];


const filterCategories = ['All', 'Electronics', 'Home', 'New Arrivals'];
const PRODUCTS_TO_SHOW = 10;
const VISIBLE_COUNT_KEY = 'home_visible_count';
const SELECTED_CATEGORY_KEY = 'home_selected_category';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { products, isLoading } = useProductStore();
  const { toast } = useToast();
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_TO_SHOW);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [api, setApi] = useState<CarouselApi>();
  const [showDropshipPopup, setShowDropshipPopup] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show popup every 30 minutes
  useEffect(() => {
    const showPopup = () => {
      setShowDropshipPopup(true);
    };

    // Show first popup after 30 seconds
    const initialTimer = setTimeout(showPopup, 30000);
    
    // Then show every 30 minutes
    const intervalTimer = setInterval(showPopup, 30 * 60 * 1000); // 30 minutes

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  // Load persisted state on mount
  useEffect(() => {
    const savedVisibleCount = localStorage.getItem(VISIBLE_COUNT_KEY);
    const savedCategory = localStorage.getItem(SELECTED_CATEGORY_KEY);

    if (savedVisibleCount) {
      setVisibleCount(parseInt(savedVisibleCount, 10));
    }
    if (savedCategory) {
      setSelectedCategory(savedCategory);
    }
  }, []);

  useEffect(() => {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search)
    const refCode = urlParams.get('ref')

    if (refCode) {
      toast({
        title: "Referral Link Detected!",
        description: `Use code ${refCode} at checkout for 5% discount`,
      })

      // Clean URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  }, [toast])

  // Auto-scroll for mobile carousel
  useEffect(() => {
    if (!api) return;

    const autoScroll = () => {
      if (window.innerWidth < 640) { // Only on mobile
        api.scrollNext();
      }
    };

    const interval = setInterval(autoScroll, 3000);
    return () => clearInterval(interval);
  }, [api])



  const techDeals = useMemo(() => {
    const discounted = products.filter(p => (p.category === 'Tech' || p.category === 'Electronics') && p.price.discounted && p.quantity > 0);
    const regular = products.filter(p => (p.category === 'Tech' || p.category === 'Electronics') && !p.price.discounted && p.quantity > 0);
    return [...discounted, ...regular].slice(0, 8);
  }, [products]);

  const homeDeals = useMemo(() => {
    const discounted = products.filter(p => p.category === 'Home' && p.price.discounted && p.quantity > 0);
    const regular = products.filter(p => p.category === 'Home' && !p.price.discounted && p.quantity > 0);
    return [...discounted, ...regular].slice(0, 8);
  }, [products]);

  const newArrivals = useMemo(() => {
    // Combine API products and JSON products for New Arrivals
    const apiNewArrivals = products.filter(p => p.category === 'New Arrivals' && p.quantity > 0);
    const jsonNewArrivals = NEWARRIVALS_PRODUCTS.filter(p => p.quantity > 0);
    const allNewArrivals = [...apiNewArrivals, ...jsonNewArrivals];
    const discounted = allNewArrivals.filter(p => p.price.discounted);
    const regular = allNewArrivals.filter(p => !p.price.discounted);
    return [...discounted, ...regular].slice(0, 8);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const inStockProducts = products.filter(p => p.quantity > 0);
    if (selectedCategory === 'All') {
      return inStockProducts;
    }
    if (selectedCategory === 'Electronics') {
      return inStockProducts.filter(p => p.category === 'Electronics' || p.category === 'Tech');
    }
    if (selectedCategory === 'New Arrivals') {
      const apiNewArrivals = inStockProducts.filter(p => p.category === 'New Arrivals');
      const jsonNewArrivals = NEWARRIVALS_PRODUCTS.filter(p => p.quantity > 0);
      return [...apiNewArrivals, ...jsonNewArrivals];
    }
    return inStockProducts.filter(p => p.category === selectedCategory);
  }, [selectedCategory, products]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(PRODUCTS_TO_SHOW);
    localStorage.setItem(SELECTED_CATEGORY_KEY, category);
    localStorage.setItem(VISIBLE_COUNT_KEY, PRODUCTS_TO_SHOW.toString());
  };

  const handleViewMore = () => {
    const newCount = visibleCount + PRODUCTS_TO_SHOW;
    setVisibleCount(newCount);
    localStorage.setItem(VISIBLE_COUNT_KEY, newCount.toString());
  };



  if (!mounted) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "ShopWave",
              "alternateName": "Shop Wave",
              "description": "ShopWave - India's #1 online shopping destination! Cheapest prices guaranteed, free delivery, 50% off deals on tech accessories, home essentials & ayurvedic products across India.",
              "url": "/",
              "telephone": "+91-91574-99884",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "ShopWave Products",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Tech Accessories",
                      "category": "Electronics"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Home & Kitchen",
                      "category": "Home & Garden"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Ayurvedic Products",
                      "category": "Health & Beauty"
                    }
                  }
                ]
              }
            })
          }}
        />
      </Head>
      <div className="space-y-8">
      <BannerSlider />

      <section>
        <div className="grid grid-cols-3 gap-2 md:gap-3">
            <Link href="/search?category=Tech" className="relative block h-20 md:h-48 overflow-hidden rounded-lg md:rounded-xl group">
                <Image src="https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/01_0748acd3-4797-400f-997d-6cecf6b22f5a.webp?updatedAt=1756628128432" alt="Tech" fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint="tech gadgets" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex items-center justify-center p-1 md:p-2">
                    <h3 className="text-xs md:text-md font-bold text-white text-center">Tech Accessories</h3>
                </div>
            </Link>
            <Link href="/search?category=Home" className="relative block h-20 md:h-48 overflow-hidden rounded-lg md:rounded-xl group">
                <Image src="https://Shopwave.b-cdn.net/new%20arival/17865..1.webp" alt="Home" fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint="modern living room" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex items-center justify-center p-1 md:p-2">
                    <h3 className="text-xs md:text-md font-bold text-white text-center">Home & Kitchen</h3>
                </div>
            </Link>
            <Link href="/new-arrivals" className="relative block h-20 md:h-48 overflow-hidden rounded-lg md:rounded-xl group">
                <Image src="https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_6d35b019-089f-4949-9571-7a7bd595fccd.webp" alt="New Arrivals" fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint="new arrivals shopping" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex items-center justify-center p-1 md:p-2">
                    <h3 className="text-xs md:text-md font-bold text-white text-center">New Arrivals</h3>
                </div>
            </Link>
        </div>
      </section>



      <section id="tech-offers">
        <h2 className="text-2xl font-bold mb-4 text-center">Top Offers</h2>
         <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
            <CarouselItem className="pl-1 sm:pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/3"><OfferCard title="Mobile Accessories" products={techDeals} href="/search?subcategory=Accessories"/></CarouselItem>
            <CarouselItem className="pl-1 sm:pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/3"><OfferCard title="Kitchen Tools" products={homeDeals} href="/search?subcategory=Kitchen%20Tools"/></CarouselItem>
            <CarouselItem className="pl-1 sm:pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/3"><OfferCard title="LED Lights" products={newArrivals} href="/search?subcategory=LED%20Lights"/></CarouselItem>
          </CarouselContent>

        </Carousel>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>

        {/* All Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {topCategories.map((category, index) => (
            <Link key={category.name} href={category.href} className="group block text-center">
              <div className="relative w-full mx-auto mb-3">
                <div className="aspect-square w-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={64}
                    height={64}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-lg drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={category.dataAiHint}
                  />
                </div>
              </div>
              <h4 className="text-sm md:text-base font-medium text-gray-700 group-hover:text-brand leading-tight px-1">{category.name}</h4>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-center">Featured Products</h2>

        <div className="flex justify-center mb-4">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 bg-gray-100 rounded-full p-1">
            {filterCategories.map(c => (
              <button
                key={c}
                onClick={() => handleCategoryClick(c)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${selectedCategory === c ? 'bg-brand text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap -mx-1.5 md:-mx-2">
           {visibleProducts.map((p, index) => (
            <div key={`${p.id}-${index}`} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-1.5 md:p-2">
              <ProductCard p={p} />
            </div>
          ))}
        </div>

        {visibleCount < filteredProducts.length && (
          <div className="text-center mt-8">
            <motion.button
              onClick={handleViewMore}
              className="rounded-xl bg-brand/90 px-8 py-3 font-semibold text-white transition-colors hover:bg-brand"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              View More
            </motion.button>
          </div>
        )}
      </section>

      {/* Footer with Dropshipping Links */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ShopWave</h3>
              <p className="text-gray-300">India's #1 online shopping destination with cheapest prices guaranteed!</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/search?category=Tech" className="text-gray-300 hover:text-white">Tech Accessories</Link></li>
                <li><Link href="/search?category=Home" className="text-gray-300 hover:text-white">Home & Kitchen</Link></li>
                <li><Link href="/new-arrivals" className="text-gray-300 hover:text-white">New Arrivals</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Business Inquiries</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-300 mb-2">For Dropshipping & Wholesale:</p>
                  <div className="flex flex-col space-y-2">
                    <a
                      href="https://chat.whatsapp.com/JmDFMt0uUhpHVSut4ZctfF"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Join Dropshipping Group
                    </a>
                    <a
                      href="https://whatsapp.com/channel/0029VbAxgRFIN9ihjNsphG0D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Join Wholesale Channel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-4 text-center">
            <p className="text-gray-400">&copy; 2024 ShopWave. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Dropshipping Popup */}
      <Dialog open={showDropshipPopup} onOpenChange={setShowDropshipPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Business Opportunity
            </DialogTitle>
            <DialogDescription>
              Interested in Dropshipping or Wholesale business? Join our exclusive groups!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Dropshipping Group</h4>
              <p className="text-sm text-green-700 mb-3">Join our dropshipping community for exclusive deals and business opportunities.</p>
              <a
                href="https://chat.whatsapp.com/JmDFMt0uUhpHVSut4ZctfF"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Dropshipping Group
              </a>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Wholesale Channel</h4>
              <p className="text-sm text-blue-700 mb-3">Get access to wholesale prices and bulk order opportunities.</p>
              <a
                href="https://whatsapp.com/channel/0029VbAxgRFIN9ihjNsphG0D"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4 mr-2" />
                Join Wholesale Channel
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
    </>
  );
}
