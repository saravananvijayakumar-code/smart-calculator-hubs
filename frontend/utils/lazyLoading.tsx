import { lazy, Suspense, ComponentType } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Loading component for suspense fallback
export const LoadingCalculator = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      {/* Content skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Higher-order component for lazy loading with custom loading component
export function withLazyLoading<T extends object>(
  componentImport: () => Promise<{ default: ComponentType<T> }>,
  fallback: ComponentType = LoadingCalculator
) {
  const LazyComponent = lazy(componentImport);
  
  return (props: T) => (
    <Suspense fallback={<Fallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  function Fallback() {
    const FallbackComponent = fallback;
    return <FallbackComponent />;
  }
}

// Preload function for critical calculators
export function preloadCalculator(calculatorName: string) {
  switch (calculatorName) {
    case 'mortgage':
      return import('../pages/calculators/us/MortgageCalculatorUS');
    case 'bmi':
      return import('../pages/calculators/health/BMICalculator');
    case 'percentage':
      return import('../pages/calculators/math/PercentageCalculator');
    case 'investment':
      return import('../pages/calculators/financial/InvestmentCalculator');
    default:
      return Promise.resolve();
  }
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const observe = (element: HTMLElement | null) => {
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(element);
        }
      });
    }, options);

    observer.observe(element);
    return () => observer.unobserve(element);
  };

  return observe;
}