import { Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export function OfflineIndicator() {
  const { isOffline } = usePWA();

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <WifiOff className="h-4 w-4" />
          <span>You're offline - Limited functionality available</span>
        </div>
      </div>
    </div>
  );
}

export function ConnectionStatus() {
  const { isOffline } = usePWA();

  return (
    <div className="flex items-center space-x-1 text-sm">
      {isOffline ? (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span className="text-red-500">Offline</span>
        </>
      ) : (
        <Wifi className="h-4 w-4 text-green-500" />
      )}
    </div>
  );
}