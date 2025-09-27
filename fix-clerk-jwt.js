// Quick fix for Clerk JWT issue in development
const fs = require('fs');
const path = require('path');

// Clear Clerk cache
const clerkCacheDir = path.join(__dirname, '.clerk');
if (fs.existsSync(clerkCacheDir)) {
  fs.rmSync(clerkCacheDir, { recursive: true, force: true });
  console.log('✅ Cleared Clerk cache');
}

// Clear Next.js cache
const nextCacheDir = path.join(__dirname, '.next');
if (fs.existsSync(nextCacheDir)) {
  fs.rmSync(nextCacheDir, { recursive: true, force: true });
  console.log('✅ Cleared Next.js cache');
}

console.log('🔄 Restart your development server now');
console.log('Run: npm run dev');