import { useEffect, useRef } from 'react';
import { EZOIC_CONFIG, shouldShowEzoicAds } from '../config/ezoic';

interface EzoicAdSlotProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  minHeight?: string;
}

export default function EzoicAdSlot({ 
  id, 
  className = '', 
  style,
  minHeight = '90px'
}: EzoicAdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!shouldShowEzoicAds() || initializedRef.current) return;

    const initEzoicAd = () => {
      if (typeof window !== 'undefined' && window.ezstandalone?.cmd) {
        window.ezstandalone.cmd.push(() => {
          initializedRef.current = true;
        });
      }
    };

    // Delay initialization slightly to ensure Ezoic script is loaded
    const timer = setTimeout(initEzoicAd, 100);
    
    return () => clearTimeout(timer);
  }, [id]);

  // Don't render if ads are disabled
  if (!shouldShowEzoicAds()) {
    return null;
  }

  return (
    <div
      id={id}
      className={`ezoic-ad-slot my-4 w-full rounded-xl bg-gray-50 shadow-sm ${className}`}
      style={{ minHeight, ...style }}
      data-ez-name={id}
    />
  );
}

export { EzoicAdSlot };
