import { useEffect, useRef } from 'react';

interface NativeBannerProps {
  position?: 'top' | 'middle' | 'bottom';
  className?: string;
}

export function NativeBanner({ position = 'middle', className = '' }: NativeBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  const containerId = `container-9fa6e693b0eb06496b74323b72b85d07-${position}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (typeof window === 'undefined' || scriptLoadedRef.current) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//pl27985371.effectivegatecpm.com/9fa6e693b0eb06496b74323b72b85d07/invoke.js';

    if (containerRef.current) {
      containerRef.current.appendChild(script);
      scriptLoadedRef.current = true;
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className={`native-banner-wrapper ${className}`} ref={containerRef}>
      <div id={containerId}></div>
    </div>
  );
}

export default NativeBanner;
