import { Download, TrendingUp, Smartphone, Globe, Wifi, WifiOff } from 'lucide-react';
import { usePWAStats } from '../hooks/useRealTimeStats';
import type { PWAStats } from '~backend/pwa-stats/types';

export function PWANumbers() {
  const { data: stats, loading, isConnected, lastUpdated } = usePWAStats({
    fetchInterval: 8000,
    onError: (error) => console.error('PWA stats error:', error)
  });

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-blue-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PWA Stats</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-blue-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PWA Stats</h3>
        <div className="ml-auto flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-500" />
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.totalInstalls.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Installs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalShares.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Shares</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalOfflineAccess.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Offline</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.recentEvents.length.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">Event Types</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Installs</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.totalInstalls.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Shares</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.totalShares.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Offline Access</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.totalOfflineAccess.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">Recent Activity</h4>
          </div>
          <div className="space-y-2">
            {stats.recentEvents.slice(0, 5).map((event, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {event.eventType}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {new Date(event.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            {isConnected ? (
              <>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Live data • Updates every 8s
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                Connection lost • Retrying...
              </>
            )}
          </span>
          <span>Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}</span>
        </div>
      </div>
    </div>
  );
}
