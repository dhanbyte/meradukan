'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Mail, Phone, Calendar } from 'lucide-react'

export default function CustomersPage() {
  const [customers, setCustomers] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers || [])
      } else {
        setCustomers([])
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
      setCustomers([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCustomers = customers ? customers.filter((customer: any) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">{customers ? customers.length : 0} total customers</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <Input
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading customers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">ID: {customer.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.orders}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{customer.totalSpent?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {customer.joinedDate ? new Date(customer.joinedDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.status || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredCustomers.length === 0 && (
          <div className="text-center py-10">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No customers found</p>
          </div>
        )}
      </div>
    </div>
  )
}