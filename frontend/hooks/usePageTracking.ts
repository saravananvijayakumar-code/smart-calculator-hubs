import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import backend from '~backend/client';

// Generate a simple session ID that persists during the browser session
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('calculatorHubSessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('calculatorHubSessionId', sessionId);
  }
  return sessionId;
};

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await backend.pageviews.track({
          pagePath: location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          sessionId: getSessionId()
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        // Only log in development mode
        if (import.meta.env.DEV) {
          console.debug('Page tracking failed:', error);
        }
      }
    };

    // Small delay to ensure page has loaded
    const timer = setTimeout(trackPageView, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);
}