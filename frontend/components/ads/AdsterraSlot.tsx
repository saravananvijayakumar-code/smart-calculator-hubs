import { useEffect, useRef } from 'react';

interface AdsterraSlotProps {
  className?: string;
  position?: 'top' | 'middle' | 'bottom';
}

export function AdsterraSlot({ className = '', position = 'top' }: AdsterraSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current || !containerRef.current) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//pl27997161.effectivegatecpm.com/120740d0fd4434c9ec79708b1058347a/invoke.js';
    
    script.onerror = () => {
      console.debug('Adsterra script failed to load');
    };

    containerRef.current.appendChild(script);
    scriptLoadedRef.current = true;

    return () => {
      scriptLoadedRef.current = false;
    };
  }, []);

  return (
    <div className={`my-4 ${className}`}>
      <div className="text-xs text-center text-muted-foreground mb-2">Advertisement</div>
      <div ref={containerRef}>
        <div id="container-120740d0fd4434c9ec79708b1058347a"></div>
      </div>
    </div>
  );
}
