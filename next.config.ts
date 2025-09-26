import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  srcDir: true,
  outputFileTracingRoot: __dirname,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app', 'shopwave.social', '*.shopwave.social']
    }
  },
  images: {
    // List of allowed domains for image optimization
    domains: [
      'images.unsplash.com',
      'source.unsplash.com', 
      'images.pexels.com',
      'cdn.pixabay.com',
      'ik.imagekit.io',
      'via.placeholder.com'
    ],
    // Remote patterns for more specific control
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all domains (be cautious with this in production)
      },
    ],
    // Performance optimizations
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [64, 96, 128, 256, 384, 512],
    formats: ['image/webp'], // Using only webp for better compatibility
    // Disable optimization in development for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
    // Security settings
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self' https: data:; img-src * 'self' data: https:; media-src * 'self' data: https:;"
  },
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_Y2xlcmsuaW5jbHVkZWQua2F0eWRpZC05Mi5sY2wuZGV2JA'
  }
}

export default nextConfig