import { Eye, Users, TrendingUp, Globe, BarChart3, Wifi, WifiOff } from 'lucide-react';
import { usePageViewStats } from '../hooks/useRealTimeStats';
import type { PageViewStats } from '~backend/pageviews/types';

export function PageviewStats() {
  const { data: stats, loading, isConnected, lastUpdated } = usePageViewStats({
    fetchInterval: 8000, // 8 seconds for faster updates
    onError: (error) => console.error('Pageview stats error:', error)
  });

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-green-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Page Views</h3>
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
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-green-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Page Views</h3>
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
            {stats.totalViews.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.todayViews.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.thisWeekViews.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">This Week</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.thisMonthViews.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">This Month</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Unique Visitors */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">Unique Visitors</h4>
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.uniqueVisitors.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active sessions</div>
        </div>

        {/* Top Pages */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">Top Pages</h4>
          </div>
          <div className="space-y-2">
            {Object.entries(stats.viewsByPage)
              .slice(0, 3)
              .map(([page, count]) => (
                <div key={page} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {page.length > 15 ? page.substring(0, 15) + '...' : page}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{count.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">By Region</h4>
          </div>
          <div className="space-y-2">
            {Object.entries(stats.viewsByCountry)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([country, count]) => (
                <div key={country} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {country.length > 12 ? country.substring(0, 12) + '...' : country}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{count.toLocaleString()}</span>
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