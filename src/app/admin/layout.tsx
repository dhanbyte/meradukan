import { Metadata } from 'next'
import AdminSidebar from '@/components/AdminSidebar'
import AdminProtection from '@/components/AdminProtection'

export const metadata: Metadata = {
  title: 'Admin Dashboard - ShopWave',
  description: 'Admin panel for managing products and catalog',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="ml-64">
          {children}
        </div>
      </div>
    </AdminProtection>
  )
}