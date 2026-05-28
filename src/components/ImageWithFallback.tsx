/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sparkles, Building2, Home } from "lucide-react";

interface ImageWithFallbackProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  isVilla?: boolean;
  propertyName?: string;
  propertyGroup?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackSrc,
  isVilla = false,
  propertyName = "Properti",
  propertyGroup = "Prime Series",
}: ImageWithFallbackProps) {
  // 0 = loading original src
  // 1 = loading fallback/default Unsplash
  // 2 = completely failed, show stylized placeholder card
  const [retryStage, setRetryStage] = useState(() => {
    return (!src || src.trim() === "") ? 1 : 0;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Robust, fully-qualified Unsplash fallbacks that are extremely reliable
  const defaultFallback = isVilla
    ? "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80" // Verified Ultra Luxury Villa
    : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"; // Verified Modern Commercial Office/Ruko

  // Handle image load completion
  const handleLoad = () => {
    setIsLoading(false);
  };

  // Handle load failure gracefully
  const handleError = () => {
    if (retryStage === 0) {
      setRetryStage(1); // Try the ultra-reliable unsplash fallback Src next
    } else {
      setRetryStage(2); // Failed both, show elegant blueprint layout card
      setIsLoading(false);
    }
  };

  // Determine current image source
  const imageSrc = retryStage === 1 ? (fallbackSrc || defaultFallback) : src;

  return (
    <div className={`relative overflow-hidden w-full h-full bg-neutral-900 flex ${className}`}>
      {/* Premium Shimmer Loader while loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-[length:200%_100%] animate-pulse" style={{ animationDuration: '1.5s' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-2">
            <Sparkles className="w-5 h-5 text-luxury-gold/40 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-[10px] font-mono tracking-widest text-[#C9A961]/50 uppercase">Loading Visual...</span>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {retryStage !== 2 && (
        <img
          src={imageSrc}
          alt={alt || propertyName}
          onLoad={handleLoad}
          onError={handleError}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        />
      )}

      {/* Elegant Stylized Dark Placeholder Card if image failed to load even with the reliable fallbacks */}
      {retryStage === 2 && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#121214] via-[#1a1a1c] to-[#121214] border border-luxury-gold/10 flex flex-col justify-between p-5 relative z-1 pointer-events-none">
          {/* Decorative Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A96105_1px,transparent_1px),linear-gradient(to_bottom,#C9A96105_1px,transparent_1px)] bg-[size:10px_10px]" />
          
          <div className="flex justify-between items-start relative z-10 w-full">
            <span className="text-[10px] font-mono tracking-widest text-luxury-gold uppercase font-bold">
              {propertyGroup}
            </span>
            <div className="w-8 h-8 rounded-lg bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
              {isVilla ? <Home className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            </div>
          </div>

          <div className="space-y-1 relative z-10">
            <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1">{propertyName}</h4>
            <span className="text-[9px] bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold px-2 py-0.5 rounded font-mono font-bold block w-max uppercase tracking-wider">
              {isVilla ? "Exclusive Villa" : "Premium Ruko"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
