import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [newWorkerReady, setNewWorkerReady] = useState(false);

  useEffect(() => {
    const handleControllerChange = () => {
      window.location.reload();
    };

    const handleUpdateReady = () => {
      setNewWorkerReady(true);
      setShowUpdate(true);
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    }

    window.addEventListener('sw-update-ready', handleUpdateReady);

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      }
      window.removeEventListener('sw-update-ready', handleUpdateReady);
    };
  }, []);

  const handleUpdate = () => {
    if (newWorkerReady && 'serviceWorker' in navigator) {
      // Get the waiting service worker and tell it to skip waiting
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          registration.waiting.postMessage({ action: 'skipWaiting' });
        } else {
          // Fallback: reload immediately if no waiting worker
          window.location.reload();
        }
      });
    }
    setShowUpdate(false);
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex items-start space-x-3">
        <RefreshCw className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Update Available</p>
          <p className="text-xs opacity-90 mt-1">
            A new version of the app is ready. Refresh to get the latest features.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex space-x-2">
        <Button
          onClick={handleUpdate}
          size="sm"
          variant="secondary"
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          Update Now
        </Button>
        <Button
          onClick={handleDismiss}
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          Later
        </Button>
      </div>
    </div>
  );
}