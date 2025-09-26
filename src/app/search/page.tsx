

'use client'
import { useMemo, Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';
import { filterProducts } from '@/lib/search'
import Filters from '@/components/Filters'
import SortBar from '@/components/SortBar'
import ProductCard from '@/components/ProductCard'
import CategoryPills from '@/components/CategoryPills'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Filter, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryGrid from '@/components/CategoryGrid';
import { cn } from '@/lib/utils';
import { useProductStore } from '@/lib/productStore';
import LoadingSpinner from '@/components/LoadingSpinner';

const techCategories = [
  { name: 'Accessories', href: '/search?category=Tech&subcategory=Accessories', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/0294.webp?updatedAt=1756627296166', dataAiHint: 'mobile accessories' },
  { name: 'Decor & Lighting', href: '/search?category=Tech&subcategory=Decor%20%26%20Lighting', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_5ba5639c-603e-428a-afe3-eefdc5f0f696.webp?updatedAt=1757157493441', dataAiHint: 'decor lighting' },
  { name: 'Audio', href: '/search?category=Tech&subcategory=Audio', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_413ce869-b6ef-477c-8be8-b78545b87afb.webp?updatedAt=1757152313606', dataAiHint: 'audio speakers' },
  { name: 'Computer Accessories', href: '/search?category=Tech&subcategory=Computer%20Accessories', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/e352de8b-cbde-4b0c-84d9-e7cefc7086fc.webp', dataAiHint: 'computer accessories' },
  { name: 'Outdoor Lighting', href: '/search?category=Tech&subcategory=Outdoor%20Lighting', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/5f7e872992d2b507f33f68da-9-large_0e2c40e8-8e9c-426a-b98c-968cddb10225.avif', dataAiHint: 'outdoor lighting' },
];

const homeCategories = [
    { name: 'Puja-Essentials', href: '/search?category=Home&subcategory=Puja-Essentials', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/Pooja%20Essential%20Pooja%20Essentials/1/1.webp?updatedAt=1756551012208', dataAiHint: 'puja essentials' },
    { name: 'Bathroom-Accessories', href: '/search?category=Home&subcategory=Bathroom-Accessories', image: 'https://Shopwave.b-cdn.net/puja%20photos/e7f464c4-3c4f-4b07-82f4-e4d1eee94930_1.b3569a78f0f854174520dbe2b1ef52d8.webp', dataAiHint: 'bathroom accessories' },
    { name: 'Kitchenware', href: '/search?category=Home&subcategory=Kitchenware', image: 'https://Shopwave.b-cdn.net/Homekichan/01_a4e3c239-73ae-4939-8b28-aa03ed6f760f.webp', dataAiHint: 'kitchenware' },
    { name: 'Household-Appliances', href: '/search?category=Home&subcategory=Household-Appliances', image: 'https://Shopwave.b-cdn.net/Homekichan/02_13a215dc-07e6-4d05-98bc-dd30f55e92dc.webp', dataAiHint: 'household appliances' },
    { name: 'Food Storage', href: '/search?category=Home&subcategory=Food%20Storage', image: 'https://Shopwave.b-cdn.net/Eltronicpart-2/storage-box-02.webp', dataAiHint: 'food storage' },
    { name: 'Drinkware', href: '/search?category=Home&subcategory=Drinkware', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/Tumbler-04_8520f518-fd21-4ca9-98f2-149e361dda36.webp?updatedAt=1757179631247', dataAiHint: 'drinkware' },
    { name: 'Kitchen Tools', href: '/search?category=Home&subcategory=Kitchen%20Tools', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/05_af19803f-0274-4f7b-829b-3974c9c6365d.avif?updatedAt=1757139103515', dataAiHint: 'kitchen tools' },
    { name: 'Storage & Organization', href: '/search?category=Home&subcategory=Storage%20%26%20Organization', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/06_d748bf1f-ff1c-42fe-9c83-826bd1544147.avif?updatedAt=1757139337543', dataAiHint: 'storage organization' },
    { name: 'Baking Tools', href: '/search?category=Home&subcategory=Baking%20Tools', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/7636fc2e-a31a-4ba5-bd9a-d985e02e1f0f_f44e78eb-ccad-4b77-9eb4-3ef45c19b93d.webp', dataAiHint: 'baking tools' },
];

const newArrivalsSubCategories = [
  { name: 'diwali Special', href: '/search?category=New%20Arrivals&subcategory=diwali%20Special', image: 'https://ik.imagekit.io/b5qewhvhb/WhatsApp%20Image%202025-09-22%20at%2017.55.22_ee418f7e.jpg', dataAiHint: 'diwali special' },
  { name: 'Gifts', href: '/search?category=New%20Arrivals&subcategory=Gifts', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_6d35b019-089f-4949-9571-7a7bd595fccd.webp', dataAiHint: 'gifts' },
  { name: 'Car Accessories', href: '/search?category=New%20Arrivals&subcategory=Car%20Accessories', image: 'https://Shopwave.b-cdn.net/new%20arival/01_15d3c786-e22a-4818-8a49-d1c8c6662719.webp', dataAiHint: 'car accessories' },
  { name: 'Kitchen Appliances', href: '/search?category=New%20Arrivals&subcategory=Kitchen%20Appliances', image: 'https://Shopwave.b-cdn.net/new%20arival/17865..1.webp', dataAiHint: 'kitchen appliances' },
  { name: 'Home Appliances', href: '/search?category=New%20Arrivals&subcategory=Home%20Appliances', image: 'https://Shopwave.b-cdn.net/new%20arival/4ce6bdd6-4139-4645-8183-d71554df6b88_38f14c77-c503-46cd-be19-4ae0e0c88eb0.webp', dataAiHint: 'home appliances' },
  { name: 'Cleaning Tools', href: '/search?category=New%20Arrivals&subcategory=Cleaning%20Tools', image: 'https://Shopwave.b-cdn.net/new%20arival/609b820c1ce70f90287cc903-large_1_c7125055-2828-46c0-b762-d19bfcdf24ea.webp', dataAiHint: 'cleaning tools' },
  { name: 'Health & Personal Care', href: '/search?category=New%20Arrivals&subcategory=Health%20%26%20Personal%20Care', image: 'https://Shopwave.b-cdn.net/new%20arival/01_c87acdae-de5c-49b0-80e0-5e1af7ed7fa5.webp', dataAiHint: 'health care' },
  { name: 'Cables & Chargers', href: '/search?category=New%20Arrivals&subcategory=Cables%20%26%20Chargers', image: 'https://Shopwave.b-cdn.net/new%20arival/02_71c68310-5be0-4fac-97e3-de92ea6df361.webp', dataAiHint: 'cables chargers' },
  { name: 'Home Organization', href: '/search?category=New%20Arrivals&subcategory=Home%20Organization', image: 'https://Shopwave.b-cdn.net/new%20arival/07_24b9ce72-1c0c-4c5b-bf59-99fefbaa0619.webp', dataAiHint: 'home organization' },
  { name: 'LED Lights', href: '/search?category=New%20Arrivals&subcategory=LED%20Lights', image: 'https://Shopwave.b-cdn.net/new%20arival/Crystal-Ball-Lamp-01_0069f489-bb55-4c74-b7d9-744a6a42123a.webp', dataAiHint: 'led lights' },
  { name: 'Table Lamps', href: '/search?category=New%20Arrivals&subcategory=Table%20Lamps', image: 'https://Shopwave.b-cdn.net/new%20arival/Crystal-Ball-Lamp-03_7b9c5da7-e695-4ee6-aeae-4ac590929bcf.webp', dataAiHint: 'table lamps' },
  { name: 'Photo Frames', href: '/search?category=New%20Arrivals&subcategory=Photo%20Frames', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/0294.webp?updatedAt=1756627296166', dataAiHint: 'photo frames' },
];

const poojaSubCategories = [
    { name: 'Dhoop', href: '/search?category=Pooja&subcategory=Dhoop', image: 'https://images.unsplash.com/photo-1604543213568-963e6e8a4947?q=80&w=800&auto=format&fit=crop', dataAiHint: 'incense dhoop' },
    { name: 'Agarbatti', href: '/search?category=Pooja&subcategory=Agarbatti', image: 'https://images.unsplash.com/photo-1596701878278-2de47143b4eb?q=80&w=800&auto=format&fit=crop', dataAiHint: 'incense sticks' },
    { name: 'Aasan and Mala', href: '/search?category=Pooja&subcategory=Aasan%20and%20Mala', image: 'https://images.unsplash.com/photo-1616836109961-c8a74e5b2e5e?q=80&w=800&auto=format&fit=crop', dataAiHint: 'prayer beads' },
    { name: 'Photo Frame', href: '/search?category=Pooja&subcategory=Photo%20Frame', image: 'https://images.unsplash.com/photo-1579541620958-c6996119565e?q=80&w=800&auto=format&fit=crop', dataAiHint: 'photo frame' },
];

const foodAndDrinksCategories = [
  { name: 'Beverages', href: '/search?category=Food%20%26%20Drinks&subcategory=Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800&auto=format&fit=crop', dataAiHint: 'healthy beverages' },
  { name: 'Dry Fruits', href: '/search?category=Food%20%26%20Drinks&subcategory=Dry%20Fruits', image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?q=80&w=800&auto=format&fit=crop', dataAiHint: 'premium dry fruits' },
  { name: 'Healthy Juice', href: '/search?category=Food%20%26%20Drinks&subcategory=Healthy%20Juice', image: 'https://images.unsplash.com/photo-1578852632225-17a4c48a472c?q=80&w=800&auto=format&fit=crop', dataAiHint: 'healthy juices' },
];

function CategoryHeader({ title, description, linkText, bannerImages, categories, bannerColor = "bg-gray-100", buttonColor = "bg-primary" }: { title: string, description: string, linkText: string, bannerImages: string[], categories?: any[], bannerColor?: string, buttonColor?:string }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (bannerImages.length === 0) return;

        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => {
                // Instead of cycling back to 0, pause at the last image
                if (prevIndex >= bannerImages.length - 1) {
                    return prevIndex; // Stay at last image
                }
                return prevIndex + 1;
            });
        }, 4000); // Increased interval to 4 seconds for better viewing

        return () => clearInterval(timer);
    }, [bannerImages.length]);

    // Only show if we have banner images
    if (bannerImages.length === 0) return null;

    return (
        <div className="space-y-8 mb-8">
            <section>
                <div className={cn("relative overflow-hidden rounded-2xl p-4 md:py-2 md:px-6", bannerColor)}>
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="text-center md:text-left z-10">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
                            <p className="mt-2 text-sm md:text-base text-gray-600 max-w-md mx-auto md:mx-0">{description}</p>
                            <Button asChild className={cn("mt-4 text-white px-6 py-2 rounded-lg font-semibold transition-colors", buttonColor)}>
                                <Link href="#product-grid">
                                    {linkText}
                                </Link>
                            </Button>
                        </div>
                        <div className="relative h-32 md:h-40">
                            <AnimatePresence initial={false} mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={bannerImages[currentImageIndex]}
                                        alt={`Banner ${currentImageIndex + 1}`}
                                        fill
                                        className="object-cover rounded-lg shadow-lg"
                                        priority={currentImageIndex === 0}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Progress indicators */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {bannerImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-300",
                                            index === currentImageIndex
                                                ? "bg-white shadow-lg scale-125"
                                                : "bg-white/50 hover:bg-white/75"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {categories && <CategoryGrid categories={categories} buttonColor={buttonColor} />}
        </div>
    );
}

function SearchContent() {
  const sp = useSearchParams()
  const router = useRouter()
  const { products, isLoading } = useProductStore();
  const [isFilterOpen, setFilterOpen] = useState(false)
  const [isFilterVisible, setIsFilterVisible] = useState(true)
  const [showAllCategories, setShowAllCategories] = useState(false);

  const opts = {
    q: sp.get('query') || undefined,
    category: sp.get('category') || undefined,
    subcategory: sp.get('subcategory') || undefined,
    tertiaryCategory: sp.get('tertiaryCategory') || undefined,
    min: sp.get('min') ? Number(sp.get('min')) : undefined,
    max: sp.get('max') ? Number(sp.get('max')) : undefined,
    brand: sp.get('brand') || undefined,
    rating: sp.get('rating') ? Number(sp.get('rating')) : undefined,
    sort: (sp.get('sort') as any) || undefined,
  }
  
  const list = useMemo(() => filterProducts(products, opts), [products, sp])

  const bestSellers = useMemo(() => {
    const inStockProducts = products.filter(p => p.quantity > 0);
    const shuffled = [...inStockProducts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 50);
  }, [products]);
  
  const mobileAccessories = useMemo(() => {
    return products.filter(p => p.quantity > 0 && (p.name.toLowerCase().includes('mobile') || p.name.toLowerCase().includes('phone') || p.name.toLowerCase().includes('stand'))).slice(0, 8);
  }, [products]);
  
  const fansAndCooling = useMemo(() => {
    return products.filter(p => p.quantity > 0 && (p.name.toLowerCase().includes('fan') || p.name.toLowerCase().includes('cooling') || p.name.toLowerCase().includes('cooler'))).slice(0, 8);
  }, [products]);
  
  const audioProducts = useMemo(() => {
    return products.filter(p => p.quantity > 0 && (p.name.toLowerCase().includes('headphone') || p.name.toLowerCase().includes('audio') || p.name.toLowerCase().includes('speaker'))).slice(0, 8);
  }, [products]);
  
  const lightingProducts = useMemo(() => {
    return products.filter(p => p.quantity > 0 && (p.name.toLowerCase().includes('light') || p.name.toLowerCase().includes('led') || p.name.toLowerCase().includes('bulb'))).slice(0, 8);
  }, [products]);
  
  const computerAccessories = useMemo(() => {
    return products.filter(p => p.quantity > 0 && (p.name.toLowerCase().includes('mouse') || p.name.toLowerCase().includes('computer') || p.name.toLowerCase().includes('laptop'))).slice(0, 8);
  }, [products]);
  
  const powerAndCables = useMemo(() => {
    return products.filter(p => p.quantity > 0 && (p.name.toLowerCase().includes('cable') || p.name.toLowerCase().includes('adapter') || p.name.toLowerCase().includes('charger') || p.name.toLowerCase().includes('usb'))).slice(0, 8);
  }, [products]);
  
  const allCategoryLinks = [
      { name: 'Tech', href: '/search?category=Tech', image: 'https://images.unsplash.com/photo-1550009158-94ae76552485?q=80&w=400&auto=format&fit=crop', dataAiHint: 'latest gadgets' },
      { name: 'Home', href: '/search?category=Home', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop', dataAiHint: 'stylish apparel' },
      { name: 'New Arrivals', href: '/search?category=New%20Arrivals', image: newArrivalsSubCategories[0].image, dataAiHint: 'new arrivals' },
    
      { name: 'Pooja', href: '/search?category=Pooja', image: poojaSubCategories[0]?.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', dataAiHint: 'pooja items' },
      { name: 'Groceries', href: '/search?category=Groceries', image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?q=80&w=800&auto=format&fit=crop', dataAiHint: 'fresh groceries' },
  ];
  
  const renderCategoryHeader = () => {
    if (opts.q || opts.subcategory || opts.tertiaryCategory || showAllCategories) return null;

    switch (opts.category) {
        case 'New Arrivals':
            return (
                <div className="mb-8 space-y-8">
                  <CategoryHeader 
                      title="Latest New Arrivals"
                      description="Discover our newest collection with special offers and trending products!"
                      linkText="Shop Now"
                      bannerImages={[
                          "https://ik.imagekit.io/b5qewhvhb/WhatsApp%20Image%202025-09-22%20at%2017.55.22_ee418f7e.jpg",
                          "https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_6d35b019-089f-4949-9571-7a7bd595fccd.webp",
                          "https://Shopwave.b-cdn.net/new%20arival/01_15d3c786-e22a-4818-8a49-d1c8c6662719.webp",
                          "https://Shopwave.b-cdn.net/new%20arival/17865..1.webp",
                          "https://Shopwave.b-cdn.net/new%20arival/4ce6bdd6-4139-4645-8183-d71554df6b88_38f14c77-c503-46cd-be19-4ae0e0c88eb0.webp"
                      ]}
                      bannerColor="bg-purple-50"
                      buttonColor="bg-purple-600 hover:bg-purple-700"
                  />
                  <div>
                      <h2 className="text-2xl font-bold mb-4 text-center">Top New Arrivals</h2>
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {newArrivalsSubCategories.map((category) => (
                          <Link key={category.name} href={category.href} className="group block text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                            <div className="relative w-16 h-16 mx-auto rounded-lg bg-gray-100 overflow-hidden transition-all duration-300 group-hover:scale-105">
                                <Image
                                  src={category.image}
                                  alt={category.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover transition-transform duration-300"
                                  data-ai-hint={category.dataAiHint}
                                />
                            </div>
                            <h3 className="mt-2 text-xs font-medium text-gray-700 group-hover:text-brand">{category.name}</h3>
                          </Link>
                        ))}
                      </div>
                  </div>
                </div>
            )
        case 'Tech':
            return (
                <div className="mb-8 space-y-8">
                  <CategoryHeader 
                      title="Latest in Tech"
                      description="Explore the newest gadgets and accessories to elevate your lifestyle."
                      linkText="Shop Tech"
                      bannerImages={[
                          "https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/0294.webp?updatedAt=1756627296166",
                          "https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/12249d16-5521-4931-b03a-e672fc47fb87.webp?updatedAt=1757057794638",
                          "https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_413ce869-b6ef-477c-8be8-b78545b87afb.webp?updatedAt=1757152313606",
                          "https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/e352de8b-cbde-4b0c-84d9-e7cefc7086fc.webp",
                          "https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_5ba5639c-603e-428a-afe3-eefdc5f0f696.webp?updatedAt=1757157493441"
                      ]}
                      bannerColor="bg-blue-50"
                      buttonColor="bg-blue-600 hover:bg-blue-700"
                  />
                  <div>
                      <h2 className="text-2xl font-bold mb-4 text-center">Top Tech Categories</h2>
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {techCategories.map((category) => (
                          <Link key={category.name} href={category.href} className="group block text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                            <div className="relative w-16 h-16 mx-auto rounded-lg bg-gray-100 overflow-hidden transition-all duration-300 group-hover:scale-105">
                                <Image
                                  src={category.image}
                                  alt={category.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover transition-transform duration-300"
                                  data-ai-hint={category.dataAiHint}
                                />
                            </div>
                            <h3 className="mt-2 text-xs font-medium text-gray-700 group-hover:text-brand">{category.name}</h3>
                          </Link>
                        ))}
                      </div>
                  </div>
                  

                </div>
            );
        case 'Home':
             return (
                <div className="mb-8 space-y-8">
                  <CategoryHeader 
                      title="Beautiful Home & Kitchen"
                      description="Elevate your living space with our curated collection of home and kitchen accessories."
                      linkText="Shop Home & Kitchen"
                      bannerImages={[
                          "https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/05_af19803f-0274-4f7b-829b-3974c9c6365d.avif?updatedAt=1757139103515",
                          "https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/7636fc2e-a31a-4ba5-bd9a-d985e02e1f0f_f44e78eb-ccad-4b77-9eb4-3ef45c19b93d.webp",
                          "https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/06_d748bf1f-ff1c-42fe-9c83-826bd1544147.avif?updatedAt=1757139337543",
                          "https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/Tumbler-04_8520f518-fd21-4ca9-98f2-149e361dda36.webp?updatedAt=1757179631247",
                          "https://Shopwave.b-cdn.net/Homekichan/01_a4e3c239-73ae-4939-8b28-aa03ed6f760f.webp"
                      ]}
                      bannerColor="bg-pink-50"
                      buttonColor="bg-pink-600 hover:bg-pink-700"
                  />
                  <div>
                      <h2 className="text-2xl font-bold mb-4 text-center">Top Home Categories</h2>
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {homeCategories.map((category) => (
                          <Link key={category.name} href={category.href} className="group block text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                            <div className="relative w-16 h-16 mx-auto rounded-lg bg-gray-100 overflow-hidden transition-all duration-300 group-hover:scale-105">
                                <Image
                                  src={category.image}
                                  alt={category.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover transition-transform duration-300"
                                  data-ai-hint={category.dataAiHint}
                                />
                            </div>
                            <h3 className="mt-2 text-xs font-medium text-gray-700 group-hover:text-brand">{category.name}</h3>
                          </Link>
                        ))}
                      </div>
                  </div>
                </div>
             )
        case 'Food & Drinks':
             return null;
        case 'Pooja':
            return null;
        case 'Groceries':
            return <CategoryHeader 
                title="Fresh Groceries & Daily Needs"
                description="Get all your daily essentials delivered fresh to your doorstep."
                linkText="Shop Groceries"
                bannerImages={[
                    "https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200&auto=format&fit=crop",
                ]}
                categories={groceriesCategories}
                bannerColor="bg-green-50"
                buttonColor="bg-green-600 hover:bg-green-700"
            />
        default:
             if (!opts.category) {
                return null;
            }
            return null;
    }
  }

  const renderTertiaryCategoryHeader = () => {
      const sub = opts.subcategory;
      if (!sub || opts.tertiaryCategory) return null;
      
      const subcategoryTertiary = [...new Set(products
          .filter(p => p.subcategory === sub && p.tertiaryCategory)
          .map(p => p.tertiaryCategory!)
      )].map(tc => ({
          name: (tc as string).replace(/-/g, ' '),
          href: `/search?category=${opts.category}&subcategory=${sub}&tertiaryCategory=${tc}`,
          image: products.find(p => p.tertiaryCategory === tc)?.image || 'https://images.unsplash.com/photo-1617470732899-736c4f3a743b?q=80&w=800&auto=format&fit=crop',
          dataAiHint: (tc as string).toLowerCase()
      }));

      if(subcategoryTertiary.length === 0) return null;

      return <CategoryHeader 
            title={(sub as string).replace(/-/g, ' ')}
            description="Traditional and effective remedies for your health and well-being."
            linkText="Explore Now"
            bannerImages={[
                'https://images.unsplash.com/photo-1594495894542-a46cc73e081a?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1704650312022-ed1a76dbed1b?q=80&w=1200&auto=format&fit=crop'
            ]}
            categories={subcategoryTertiary}
            bannerColor="bg-emerald-50"
            buttonColor="bg-emerald-700 hover:bg-emerald-800"
        />
  }
  
  const PageTitle = () => {
    if (opts.q) {
      return <h1 className="text-2xl font-bold mb-4">Search results for &quot;{opts.q}&quot;</h1>
    }
    
    if (!opts.category && !showAllCategories) {
        return (
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold">Our Best Sellers</h1>
                <p className="text-gray-600 mt-1">Handpicked for you from our most popular items.</p>
            </div>
        )
    }

    if (!opts.category && showAllCategories) {
         return (
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold">Shop by Category</h1>
                <p className="text-gray-600 mt-1">Find what you're looking for from our wide selection of categories.</p>
            </div>
        )
    }

    const Breadcrumb = () => (
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <Link href="/search" className="hover:text-brand">Home</Link>
        {opts.category && (
          <>
            <ChevronRight size={16} className="mx-1" />
            <Link href={`/search?category=${opts.category}`} className="hover:text-brand">
              {opts.category?.replace(/%20/g, ' ')}
            </Link>
          </>
        )}
        {opts.subcategory && (
          <>
            <ChevronRight size={16} className="mx-1" />
            <Link href={`/search?category=${opts.category}&subcategory=${opts.subcategory}`} className="hover:text-brand">
              {opts.subcategory?.replace(/-/g, ' ')}
            </Link>
          </>
        )}
        {opts.tertiaryCategory && (
          <>
            <ChevronRight size={16} className="mx-1" />
            <span className="font-semibold text-gray-700">
                {opts.tertiaryCategory?.replace(/-/g, ' ')}
            </span>
          </>
        )}
      </nav>
    );

    return (
        <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100">
                <ChevronLeft size={20} />
            </button>
            <Breadcrumb />
        </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
          <LoadingSpinner />
      </div>
    )
  }

  const renderContent = () => {
    if (!opts.q && !opts.category && !opts.subcategory && !opts.tertiaryCategory && !showAllCategories) {
      // Best Seller View
      return (
        <>
          <PageTitle />
          <div className="text-center mb-8">
            <Button onClick={() => setShowAllCategories(true)} variant="outline">
              Or, Shop All Categories &rarr;
            </Button>
          </div>

          {/* Popular Categories Section */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Categories</h2>
              <p className="text-gray-600">Shop from our most loved categories</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {/* Mobile Accessories */}
              <Link href="/search?category=Tech&subcategory=Accessories" className="group block text-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/0294.webp?updatedAt=1756627296166"
                    alt="Mobile Accessories"
                    fill
                    sizes="96px"
                    className="object-cover p-3"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">Mobile Accessories</h3>
                <p className="text-xs text-gray-500">Tech</p>
              </Link>

              {/* Computer Accessories */}
              <Link href="/search?category=Tech&subcategory=Computer%20Accessories" className="group block text-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-50 to-green-100 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/e352de8b-cbde-4b0c-84d9-e7cefc7086fc.webp"
                    alt="Computer Accessories"
                    fill
                    sizes="96px"
                    className="object-cover p-3"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-green-600">Computer Accessories</h3>
                <p className="text-xs text-gray-500">Tech</p>
              </Link>

              {/* Audio */}
              <Link href="/search?category=Tech&subcategory=Audio" className="group block text-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_413ce869-b6ef-477c-8be8-b78545b87afb.webp?updatedAt=1757152313606"
                    alt="Audio"
                    fill
                    sizes="96px"
                    className="object-cover p-3"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-purple-600">Audio</h3>
                <p className="text-xs text-gray-500">Tech</p>
              </Link>

              {/* Lighting */}
              <Link href="/search?category=Tech&subcategory=Decor%20%26%20Lighting" className="group block text-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_5ba5639c-603e-428a-afe3-eefdc5f0f696.webp?updatedAt=1757157493441"
                    alt="Lighting"
                    fill
                    sizes="96px"
                    className="object-cover p-3"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-yellow-600">Lighting</h3>
                <p className="text-xs text-gray-500">Tech</p>
              </Link>

              {/* Power & Cables */}
              <Link href="/search?category=Tech&subcategory=Accessories" className="group block text-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/0260_otg_1.webp?updatedAt=1756627844923"
                    alt="Power & Cables"
                    fill
                    sizes="96px"
                    className="object-cover p-3"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-orange-600">Power & Cables</h3>
                <p className="text-xs text-gray-500">Tech</p>
              </Link>

              {/* Fans & Cooling */}
              <Link href="/search?category=Tech&subcategory=Accessories" className="group block text-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-50 to-cyan-100 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/12249d16-5521-4931-b03a-e672fc47fb87.webp?updatedAt=1757057794638"
                    alt="Fans & Cooling"
                    fill
                    sizes="96px"
                    className="object-cover p-3"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-cyan-600">Fans & Cooling</h3>
                <p className="text-xs text-gray-500">Tech</p>
              </Link>
            </div>
          </section>

          {/* Trending Products Section */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Top Products</h2>
              <p className="text-gray-600">Our most popular items this season</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {/* Kitchen Tools */}
              <Link href="/search?category=Home&subcategory=Kitchen%20Tools" className="group block text-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-50 to-red-100 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/05_af19803f-0274-4f7b-829b-3974c9c6365d.avif?updatedAt=1757139103515"
                    alt="Kitchen Tools"
                    fill
                    sizes="96px"
                    className="object-cover p-3"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-red-600">Kitchen Tools</h3>
                <p className="text-xs text-gray-500">Home</p>
              </Link>

              {/* Kitchen Appliances */}
              <Link href="/search?category=New%20Arrivals&subcategory=Kitchen%20Appliances" className="group block text-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="https://Shopwave.b-cdn.net/new%20arival/17865..1.webp"
                    alt="Kitchen Appliances"
                    fill
                    sizes="96px"
                    className="object-cover p-3"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600">Kitchen Appliances</h3>
                <p className="text-xs text-gray-500">Home</p>
              </Link>

              {/* Home Appliances */}
              <Link href="/search?category=New%20Arrivals&subcategory=Home%20Appliances" className="group block text-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="https://Shopwave.b-cdn.net/new%20arival/4ce6bdd6-4139-4645-8183-d71554df6b88_38f14c77-c503-46cd-be19-4ae0e0c88eb0.webp"
                    alt="Home Appliances"
                    fill
                    sizes="96px"
                    className="object-cover p-3"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600">Home Appliances</h3>
                <p className="text-xs text-gray-500">Home</p>
              </Link>

              {/* Cleaning Tools */}
              <Link href="/search?category=New%20Arrivals&subcategory=Cleaning%20Tools" className="group block text-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-teal-50 to-teal-100 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="https://Shopwave.b-cdn.net/new%20arival/609b820c1ce70f90287cc903-large_1_c7125055-2828-46c0-b762-d19bfcdf24ea.webp"
                    alt="Cleaning Tools"
                    fill
                    sizes="96px"
                    className="object-cover p-3"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-teal-600">Cleaning Tools</h3>
                <p className="text-xs text-gray-500">Home</p>
              </Link>

              {/* Health & Personal Care */}
              <Link href="/search?category=New%20Arrivals&subcategory=Health%20%26%20Personal%20Care" className="group block text-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-pink-50 to-pink-100 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="https://Shopwave.b-cdn.net/new%20arival/01_c87acdae-de5c-49b0-80e0-5e1af7ed7fa5.webp"
                    alt="Health & Personal Care"
                    fill
                    sizes="96px"
                    className="object-cover p-3"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-pink-600">Health & Personal Care</h3>
                <p className="text-xs text-gray-500">Home</p>
              </Link>

              {/* Home Organization */}
              <Link href="/search?category=New%20Arrivals&subcategory=Home%20Organization" className="group block text-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="https://Shopwave.b-cdn.net/new%20arival/07_24b9ce72-1c0c-4c5b-bf59-99fefbaa0619.webp"
                    alt="Home Organization"
                    fill
                    sizes="96px"
                    className="object-cover p-3"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-amber-600">Home Organization</h3>
                <p className="text-xs text-gray-500">Home</p>
              </Link>
            </div>
          </section>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {bestSellers.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </>
      );
    }

    if (showAllCategories) {
      // All Categories View
       return (
        <>
            <PageTitle />
             <div className="text-center mb-8">
                <Button onClick={() => setShowAllCategories(false)} variant="outline">
                  &larr; Back to Best Sellers
                </Button>
            </div>
            <CategoryGrid categories={allCategoryLinks} />
        </>
       )
    }

    // Default Filtered View
    return (
      <div id="product-grid" className="scroll-mt-20">
        <div className="md:hidden">
          <CategoryPills />
        </div>
        <div className="grid md:grid-cols-[auto_1fr] gap-6">
          <AnimatePresence>
            {isFilterVisible && (
              <motion.aside 
                className="hidden md:block w-[240px]"
                initial={{ width: 0, opacity: 0, x: -100 }}
                animate={{ width: 240, opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: -100 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="sticky top-24">
                  <Filters />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <section>
            <PageTitle />
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="md:hidden">
                        <Sheet open={isFilterOpen} onOpenChange={setFilterOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <div className="p-4 overflow-y-auto">
                                    <h3 className="text-lg font-semibold mb-4">Filters</h3>
                                    <Filters />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setIsFilterVisible(!isFilterVisible)}
                      className="hidden md:inline-flex"
                    >
                      {isFilterVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                    </Button>
                    <div className="hidden sm:block">
                      <div className="text-sm text-gray-600">Showing {list.length} result{list.length === 1 ? '' : 's'}</div>
                      {opts.q && !opts.subcategory && <div className="text-xs text-gray-500">for &quot;{opts.q}&quot;</div>}
                    </div>
                </div>
              <SortBar />
            </div>
            {list.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {list.map((p, index) => (
                  <ProductCard key={`${p.id}-${index}`} p={p} />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center py-10 rounded-xl border bg-white">
                    <p className="text-gray-600">No products found in this category.</p>
                    <p className="text-sm text-gray-500">But here are some related products you might like:</p>
                </div>
                
                {/* Show related products when category is empty */}
                {(() => {
                  let relatedProducts = [];
                  
                  // If searching in Tech category, show all tech products
                  if (opts.category === 'Tech') {
                    relatedProducts = products.filter(p => p.category === 'Tech' && p.quantity > 0).slice(0, 12);
                  }
                  // If searching in Home category, show home products
                  else if (opts.category === 'Home') {
                    relatedProducts = products.filter(p => p.category === 'Home' && p.quantity > 0).slice(0, 12);
                  }
                  // If searching in New Arrivals category, show new arrivals products
                  else if (opts.category === 'New Arrivals') {
                    relatedProducts = products.filter(p => 
                      (p.category === 'New Arrivals' || 
                       p.subcategory === 'Diwali Special' ||
                       p.subcategory === 'Best Selling' ||
                       p.subcategory === 'Gifts' ||
                       p.subcategory === 'Navratri' ||
                       p.subcategory === 'Pooja Essentials' ||
                       p.subcategory === 'Fragrance') && p.quantity > 0
                    ).slice(0, 12);
                  }
                  // If searching in Food & Drinks category
                  else if (opts.category === 'Food & Drinks') {
                    relatedProducts = products.filter(p => p.category === 'Food & Drinks' && p.quantity > 0).slice(0, 12);
                  }
                  // If searching in Pooja category
                  else if (opts.category === 'Pooja') {
                    relatedProducts = products.filter(p => p.category === 'Pooja' && p.quantity > 0).slice(0, 12);
                  }
                  // Default: show popular products from all categories
                  else {
                    relatedProducts = products.filter(p => p.quantity > 0 && p.price.discounted).slice(0, 12);
                  }
                  
                  if (relatedProducts.length === 0) {
                    relatedProducts = products.filter(p => p.quantity > 0).slice(0, 12);
                  }
                  
                  return relatedProducts.length > 0 ? (
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-center">Related Products</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {relatedProducts.map(p => (
                          <ProductCard key={p.id} p={p} />
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </section>
        </div>
      </div>
    )
  }
  
  return (
    <>
      {renderCategoryHeader()}
      {renderTertiaryCategoryHeader()}
      {renderContent()}
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-10"><LoadingSpinner /></div>}>
      <SearchContent />
    </Suspense>
  )
}
