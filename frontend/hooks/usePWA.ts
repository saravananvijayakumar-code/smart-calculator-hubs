import { useEffect, useState, useRef } from 'react';
import backend from '~backend/client';

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('calculatorHubSessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('calculatorHubSessionId', sessionId);
  }
  return sessionId;
};

declare global {
  interface Window {
    __SW_REGISTERED__?: boolean;
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOffline: boolean;
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOffline: !navigator.onLine,
  });
  const installPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // Force show installable for testing on localhost
  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('[usePWA] Running on localhost, forcing isInstallable to true for testing');
      setPwaState(prev => ({ ...prev, isInstallable: true }));
    }
  }, []);

  useEffect(() => {
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode (installed PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // Check if launched from home screen on iOS
      const isIOSStandalone = (window.navigator as any).standalone === true;
      // Check for minimal-ui or fullscreen modes
      const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
      const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
      
      const installed = isStandalone || isIOSStandalone || isMinimalUI || isFullscreen;
      console.log('[usePWA] Install check:', { isStandalone, isIOSStandalone, isMinimalUI, isFullscreen, installed });
      
      setPwaState(prev => ({
        ...prev,
        isInstalled: installed
      }));
    };

    checkIfInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[usePWA] beforeinstallprompt event fired!');
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      
      installPromptRef.current = event;
      setPwaState(prev => ({
        ...prev,
        isInstallable: true
      }));
      console.log('[usePWA] Install prompt saved, isInstallable set to true');
    };

    // Listen for app installed event
    const handleAppInstalled = async () => {
      installPromptRef.current = null;
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false
      }));

      // Track PWA installation in both systems
      try {
        await Promise.all([
          backend.pwa_stats.track({
            eventType: 'install',
            sessionId: getSessionId(),
            metadata: { userAgent: navigator.userAgent, platform: navigator.platform }
          }),
          backend.pwa_install.track({
            userId: getSessionId(),
            userAgent: navigator.userAgent,
            platform: navigator.platform
          })
        ]);
      } catch (error) {
        console.error('Error tracking PWA install:', error);
      }
    };

    // Listen for online/offline events
    const handleOnline = () => {
      setPwaState(prev => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      setPwaState(prev => ({ ...prev, isOffline: true }));
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker only once
    if ('serviceWorker' in navigator && !window.__SW_REGISTERED__) {
      window.__SW_REGISTERED__ = true;
      navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Always check for updates
      })
        .then(registration => {
          console.log('Service Worker registered successfully');
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is ready
                  window.dispatchEvent(new CustomEvent('sw-update-ready'));
                }
              });
            }
          });
          
          // Force update check on page load
          registration.update();
          
          // Check for updates every 30 seconds when page is visible
          setInterval(() => {
            if (!document.hidden) {
              registration.update();
            }
          }, 30000);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
          window.__SW_REGISTERED__ = false;
        });
    }

    // Cleanup event listeners
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (!installPromptRef.current) {
      // Check if this is iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isIOS && isSafari) {
        alert('To install this app:\n\n1. Tap the Share button (square with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm');
        return false;
      }
      
      // Show generic instructions for browsers that don't support beforeinstallprompt
      alert('To install this app:\n\n1. Click the browser menu (⋮)\n2. Look for "Install app" or "Add to Home screen"\n3. Follow the prompts');
      return false;
    }

    try {
      console.log('Showing install prompt...');
      await installPromptRef.current.prompt();
      const choiceResult = await installPromptRef.current.userChoice;
      
      console.log('User choice:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        installPromptRef.current = null;
        setPwaState(prev => ({
          ...prev,
          isInstallable: false
        }));

        // Track PWA installation in both systems
        try {
          await Promise.all([
            backend.pwa_stats.track({
              eventType: 'install',
              sessionId: getSessionId(),
              metadata: { userAgent: navigator.userAgent, platform: navigator.platform }
            }),
            backend.pwa_install.track({
              userId: getSessionId(),
              userAgent: navigator.userAgent,
              platform: navigator.platform
            })
          ]);
        } catch (error) {
          console.error('Error tracking PWA install:', error);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  };

  const shareApp = async (data?: { title?: string; text?: string; url?: string }) => {
    const shareData = {
      title: data?.title || 'Smart Calculator Hubs',
      text: data?.text || 'A comprehensive collection of financial, mathematical, and utility calculators',
      url: data?.url || window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareData.url);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  };

  return {
    ...pwaState,
    installApp,
    shareApp
  };
}