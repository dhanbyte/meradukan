// DEPRECATED: This route is no longer used
// Reviews are now handled at /api/products/[id]/reviews
export async function GET() {
  return new Response(JSON.stringify({ 
    error: 'This endpoint is deprecated. Use /api/products/[id]/reviews instead' 
  }), { 
    status: 410,
    headers: { 'Content-Type': 'application/json' }
  });
}