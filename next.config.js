/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['ik.imagekit.io', 'images.unsplash.com'],
    unoptimized: true
  },
  output: 'standalone'
}

module.exports = nextConfig