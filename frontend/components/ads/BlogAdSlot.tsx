import { useEffect, useRef, useState } from 'react';

interface BlogAdSlotProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

export function BlogAdSlot({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = ''
}: BlogAdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLInsElement>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const mountedRef = useRef(false);
  const adPushedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    adPushedRef.current = false;
    
    const timer = setTimeout(() => {
      try {
        if (mountedRef.current && adRef.current && typeof window !== 'undefined' && !adPushedRef.current) {
          const parent = adRef.current.parentNode;
          if (parent && containerRef.current && parent === containerRef.current) {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            adPushedRef.current = true;
            if (mountedRef.current) {
              setIsAdLoaded(true);
            }
          }
        }
      } catch (err) {
        console.warn('AdSense initialization suppressed:', err);
      }
    }, 200);
    
    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className={`my-8 ${className}`}>
      <div className="text-xs text-center text-slate-400 mb-2">Advertisement</div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7271075626732183"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      ></ins>
    </div>
  );
}

export function InContentAd() {
  return (
    <BlogAdSlot 
      slot="1234567890" 
      format="fluid"
      className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4"
    />
  );
}

export function SidebarBlogAd() {
  return (
    <BlogAdSlot 
      slot="0987654321"
      format="rectangle"
      responsive={false}
      className="sticky top-4"
    />
  );
}
