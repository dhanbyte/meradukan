'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Package, Users, ShoppingCart, ArrowLeft, Home } from 'lucide-react'

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/admin', emoji: '📊' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders', emoji: '📦' },
  { icon: Users, label: 'Customers', href: '/admin/users', emoji: '👥' },
  { icon: Package, label: 'Products', href: '/admin/catalog', emoji: '🛍️' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics', emoji: '📈' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg mr-3">{item.emoji}</span>
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <Link
          href="/"
          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Website
        </Link>
      </div>
    </div>
  )
}