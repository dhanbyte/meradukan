'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Settings, Save } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'ShopWave',
    siteDescription: 'Your one-stop shop for tech and home products',
    contactEmail: 'admin@shopwave.com',
    contactPhone: '+91 91574-99884',
    currency: '₹',
    taxRate: '18',
    shippingCost: '0'
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({ title: "Success", description: "Settings saved successfully!" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Site Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Site Description</label>
              <Textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <Input
                value={settings.contactPhone}
                onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Store Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <Input
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
              <Input
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({...settings, taxRate: e.target.value})}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}