// @ts-nocheck
import { useEffect, useRef } from 'react';
import { ADS_CONFIG, shouldShowAds } from '../../config/ads';
import { useAdLazyLoad } from '../../hooks/useAdLazyLoad';

interface MultiAutoAdSlotsProps {
  count?: number;
  spacing?: 'tight' | 'normal' | 'wide';
  placement?: 'article' | 'landing' | 'hub';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

function SingleAdSlot({ index, placement }: { index: number; placement: string }) {
  const { adRef, isVisible } = useAdLazyLoad({ threshold: 0.1, rootMargin: '200px' });
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!isVisible) return;

    let retryCount = 0;
    const maxRetries = 10;

    const initAd = () => {
      try {
        if (
          typeof window !== 'undefined' &&
          window.adsbygoogle &&
          shouldShowAds() &&
          !pushedRef.current &&
          adRef.current &&
          ADS_CONFIG.AUTO_ADS.ENABLED
        ) {
          const rect = adRef.current.getBoundingClientRect();
          
          // Check if container has valid dimensions
          if (rect.width > 0 && rect.height > 0) {
            pushedRef.current = true;
            window.adsbygoogle.push({});
          } else if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(initAd, 100);
          } else {
            console.warn(`MultiAutoAdSlots: Container dimensions invalid after ${maxRetries} retries for slot ${index}`);
          }
        }
      } catch (error) {
        console.error(`Auto AdSense error (slot ${index}):`, error);
      }
    };

    setTimeout(initAd, 50 + index * 100);
  }, [isVisible, index]);

  const minHeight = placement === 'article' ? '280px' : '200px';

  return (
    <div 
      className="auto-ad-slot" 
      ref={adRef}
      style={{
        display: 'block',
        width: '100%',
        minHeight
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight,
          width: '100%',
        }}
        data-ad-client={ADS_CONFIG.CLIENT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function MultiAutoAdSlots({
  count = 8,
  spacing = 'normal',
  placement = 'article',
  className = '',
}: MultiAutoAdSlotsProps) {
  if (!shouldShowAds() || !ADS_CONFIG.AUTO_ADS.ENABLED) {
    return null;
  }

  const spacingClasses = {
    tight: 'space-y-4',
    normal: 'space-y-8',
    wide: 'space-y-12',
  };

  const visibleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? Math.min(count, 5) : count;

  return (
    <div className={`multi-auto-ads ${spacingClasses[spacing]} ${className}`}>
      {Array.from({ length: visibleCount }).map((_, index) => (
        <SingleAdSlot key={`ad-${index}`} index={index} placement={placement} />
      ))}
    </div>
  );
}

export default MultiAutoAdSlots;
