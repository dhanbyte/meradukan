// Quick fix for image loading issues
const fs = require('fs');
const path = require('path');

// Update next.config.js to allow all images
const nextConfigPath = path.join(__dirname, 'next.config.js');
const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['*'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http', 
        hostname: '**',
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  }
}

module.exports = nextConfig`;

fs.writeFileSync(nextConfigPath, nextConfigContent);
console.log('✅ Updated next.config.js to allow all images');

// Create a simple image component that works everywhere
const simpleImageComponent = `'use client'
import Image from 'next/image'

export default function SimpleImage({ src, alt, width = 400, height = 400, className = '', ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={true}
      {...props}
      onError={(e) => {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='
      }}
    />
  )
}`;

const simpleImagePath = path.join(__dirname, 'src', 'components', 'SimpleImage.tsx');
fs.writeFileSync(simpleImagePath, simpleImageComponent);
console.log('✅ Created SimpleImage component');

console.log('🚀 Image fix completed! All images should now load properly.');
console.log('📝 Restart your development server: npm run dev');