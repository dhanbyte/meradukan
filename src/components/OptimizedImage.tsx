import Image from 'next/image';
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src.trimEnd());
  const [isLoading, setIsLoading] = useState(true);
  
  // Fallback for broken images
  const fallbackImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center';

  // Handle image loading state and errors
  useEffect(() => {
    const img = new window.Image();
    img.src = src.trimEnd();
    
    img.onload = () => {
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setImageSrc(fallbackImage);
      setIsLoading(false);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // Add blur effect while loading
  const blurClass = isLoading ? 'blur-sm scale-95' : 'blur-0 scale-100';

  return (
    <div className={`relative overflow-hidden ${className} aspect-square`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${blurClass} transition-all duration-300 object-cover`}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={quality}
        sizes={sizes}
        onError={() => setImageSrc(fallbackImage)}
        unoptimized={false}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
      )}
    </div>
  );
}