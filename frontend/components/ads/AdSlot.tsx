// @ts-nocheck
import { useEffect, useRef } from 'react';
import { ADS_CONFIG, shouldShowAds } from '../../config/ads';
import { useAdLazyLoad } from '../../hooks/useAdLazyLoad';

interface AdSlotProps {
  adSlot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdSlot({ 
  adSlot, 
  format = 'auto', 
  style, 
  className = '',
  responsive = true 
}: AdSlotProps) {
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
          adRef.current
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
            console.warn(`AdSlot: Container dimensions invalid after ${maxRetries} retries for slot ${adSlot}`);
          }
        }
      } catch (error) {
        console.error(`AdSense error (slot ${adSlot}):`, error);
      }
    };
    
    setTimeout(initAd, 50);
  }, [isVisible, adSlot]);

  // Don't render if ads should not be shown
  if (!shouldShowAds()) {
    return null;
  }

  return (
    <div 
      className={`ad-slot ${className}`} 
      style={{ 
        display: 'block',
        width: '100%',
        minHeight: '90px',
        ...style 
      }} 
      ref={adRef}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: '100%',
          ...style 
        }}
        data-ad-client={ADS_CONFIG.CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}

export default AdSlot;