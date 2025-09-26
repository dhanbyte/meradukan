export function ensureValidImageUrl(url?: string): string {
  if (!url) return 'https://via.placeholder.com/300';
  
  try {
    // Remove any double slashes (except after protocol)
    let cleaned = url.replace(/([^:]\/)\/+/g, "$1");
    
    // Ensure it's a valid HTTPS URL
    if (!cleaned.startsWith('http')) {
      cleaned = `https://${cleaned}`;
    }
    
    return cleaned;
  } catch (e) {
    console.error('Image URL validation error:', e);
    return 'https://via.placeholder.com/300';
  }
}