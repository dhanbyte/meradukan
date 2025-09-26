'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Users, 
  Star, 
  ShoppingCart,
  BarChart3,
  Settings,
  Home
} from 'lucide-react'

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/add-product', icon: Plus, label: 'Add Product' },
  { href: '/admin/catalog', icon: Package, label: 'Catalog' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/reviews', icon: Star, label: 'Reviews' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-40">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">ShopWave Admin</span>
        </Link>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <Link 
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <Home className="h-4 w-4" />
          Back to Website
        </Link>
      </div>
    </div>
  )
}