import { useEffect, useRef, useState } from 'react';

interface UseAdLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useAdLazyLoad(options: UseAdLazyLoadOptions = {}) {
  const { threshold = 0.1, rootMargin = '200px' } = options;
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = adRef.current;
    if (!element || isVisible) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            if (observerRef.current && element) {
              observerRef.current.unobserve(element);
            }
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [threshold, rootMargin, isVisible]);

  return { adRef, isVisible };
}
