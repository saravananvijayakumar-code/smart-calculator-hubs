import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Sparkles } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Check if banner was previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-banner-dismissed') === 'true';
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  // Don't show banner if app is installed, not installable, or dismissed
  if (isInstalled || !isInstallable || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const installed = await installApp();
      if (!installed) {
        // If installation was cancelled or failed, keep banner visible
        setIsInstalling(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  return (
    <div 
      className={`pwa-install-banner fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl z-50 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
      style={{
        backgroundSize: '200% 200%',
        animation: 'gradientShift 6s ease infinite'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-md animate-pulse"></div>
              <div className="relative bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Smartphone className="h-6 w-6 animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold">
                  Install Calculator Hub
                </p>
                <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                ⚡ Quick access • 📱 Works offline • 🎯 No distractions
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="pwa-install-btn bg-white text-blue-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 hover:scale-105 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              <Download className={`h-4 w-4 ${isInstalling ? 'animate-bounce' : ''}`} />
              <span>{isInstalling ? 'Installing...' : 'Install Now'}</span>
            </button>
            
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90"
              aria-label="Dismiss install banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PWAInstallButton({ className = '' }: { className?: string }) {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  if (isInstalled || !isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await installApp();
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <button
      onClick={handleInstall}
      disabled={isInstalling}
      className={`pwa-install-btn inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 disabled:opacity-50 hover:scale-105 hover:shadow-lg ${className}`}
    >
      <Download className={`h-4 w-4 ${isInstalling ? 'animate-spin' : ''}`} />
      <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
      <Sparkles className="h-3 w-3 animate-pulse" />
    </button>
  );
}