import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Google AdSense Configuration
const ADSENSE_CONFIG = {
  client: 'ca-pub-1661766797463818',
  slot: '8087878505',
};

// Declare adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function BannerAd() {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdLoaded = useRef(false);
  const isMobile = useIsMobile();
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    // Don't load ad on mobile
    if (isMobile) return;

    // Only load ad once
    if (isAdLoaded.current) return;

    try {
      // Push ad to adsbygoogle array
      if (typeof window !== 'undefined' && window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        window.adsbygoogle.push({});
        isAdLoaded.current = true;

        // Check if ad loaded after a delay
        setTimeout(() => {
          const insElement = adRef.current?.querySelector('ins');
          if (insElement && insElement.getAttribute('data-ad-status') === 'filled') {
            setShowPlaceholder(false);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [isMobile]);

  // Don't render on mobile - removes the bottom space completely
  if (isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div ref={adRef} className="w-full flex justify-center items-center relative" style={{ minHeight: '90px' }}>
        {/* Placeholder/Test Banner - shows when AdSense isn't loading */}
        {showPlaceholder && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="text-center text-white">
              <p className="text-sm font-semibold">Advertisement</p>
              <p className="text-xs opacity-80">Banner Ad Space</p>
            </div>
          </div>
        )}

        {/* Real AdSense Ad */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '90px' }}
          data-ad-client={ADSENSE_CONFIG.client}
          data-ad-slot={ADSENSE_CONFIG.slot}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
