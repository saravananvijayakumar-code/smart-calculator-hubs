// @ts-nocheck
import { useEffect, useRef } from 'react';
import { ADS_CONFIG, shouldShowAds } from '../../config/ads';
import { useAdLazyLoad } from '../../hooks/useAdLazyLoad';

interface AutoAdSlotProps {
  className?: string;
  style?: React.CSSProperties;
  placement?: 'top-banner' | 'mid-content' | 'sidebar' | 'bottom-sticky' | 'in-feed' | 'in-article' | 'anchor' | 'multiplex' | 'matched-content' | 'bottom-anchor';
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AutoAdSlot({ 
  className = '',
  style,
  placement = 'mid-content'
}: AutoAdSlotProps) {
  const { adRef, isVisible } = useAdLazyLoad({ threshold: 0.1, rootMargin: '200px' });
  const pushedRef = useRef(false);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    let retryCount = 0;
    const maxRetries = 10;
    let timeoutId: NodeJS.Timeout;

    const initAd = () => {
      try {
        if (
          typeof window !== 'undefined' && 
          window.adsbygoogle && 
          shouldShowAds() && 
          !pushedRef.current &&
          adRef.current &&
          insRef.current &&
          ADS_CONFIG.AUTO_ADS.ENABLED
        ) {
          const rect = adRef.current.getBoundingClientRect();
          
          // Check if container has valid dimensions
          if (rect.width > 0 && rect.height > 0) {
            pushedRef.current = true;
            window.adsbygoogle.push({});
          } else if (retryCount < maxRetries) {
            retryCount++;
            timeoutId = setTimeout(initAd, 100);
          } else {
            console.warn(`AutoAdSlot: Container width is 0 after ${maxRetries} retries for placement: ${placement}`);
          }
        }
      } catch (error) {
        console.error(`Auto AdSense error (placement: ${placement}):`, error);
      }
    };
    
    timeoutId = setTimeout(initAd, 50);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible, placement]);

  // Don't render if ads should not be shown or auto ads are disabled
  if (!shouldShowAds() || !ADS_CONFIG.AUTO_ADS.ENABLED) {
    return null;
  }

  const getPlacementStyles = () => {
    switch (placement) {
      case 'top-banner':
        return { minHeight: '90px', width: '100%', display: 'block' };
      case 'mid-content':
        return { minHeight: '100px', width: '100%', display: 'block' };
      case 'sidebar':
        return { minHeight: '250px', width: '100%', maxWidth: '300px', display: 'block' };
      case 'bottom-sticky':
        return { minHeight: '50px', width: '100%', display: 'block' };
      case 'in-feed':
        return { minHeight: '100px', width: '100%', display: 'block' };
      case 'anchor':
        return { minHeight: '50px', width: '100%', display: 'block' };
      case 'multiplex':
        return { minHeight: '280px', width: '100%', display: 'block' };
      case 'matched-content':
        return { minHeight: '250px', width: '100%', display: 'block' };
      case 'bottom-anchor':
        return { minHeight: '50px', width: '100%', display: 'block' };
      default:
        return { minHeight: '200px', width: '100%', display: 'block' };
    }
  };

  const placementStyles = getPlacementStyles();

  return (
    <div 
      className={`auto-ad-slot ${className}`} 
      style={{ 
        ...placementStyles, 
        ...style 
      }} 
      ref={adRef}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: '100%',
          minHeight: placementStyles.minHeight
        }}
        data-ad-client={ADS_CONFIG.CLIENT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default AutoAdSlot;