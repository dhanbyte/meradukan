'use client'

export default function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">ShopWave</h2>
        <p className="text-blue-100">Loading your shopping experience...</p>
      </div>
    </div>
  )
}
