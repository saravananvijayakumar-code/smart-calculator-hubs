import { useState, useEffect } from "react";
import backend from "~backend/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, TrendingUp, Globe, Users, RefreshCw } from "lucide-react";

interface PWAInstallStats {
  date: string;
  installs: number;
}

interface PWAInstallRecord {
  id: number;
  user_id: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  platform: string | null;
  installed_at: Date;
}

interface StatsData {
  totalInstalls: number;
  last7Days: PWAInstallStats[];
  last30Days: PWAInstallStats[];
  byPlatform: { platform: string; count: number }[];
  byCountry: { country: string; count: number }[];
  recentInstalls: PWAInstallRecord[];
}

export default function PWAAnalytics() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await backend.pwa_install.getStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching PWA analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <p>Failed to load PWA analytics</p>
            <Button onClick={fetchStats} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const last7DaysTotal = stats.last7Days.reduce((sum, day) => sum + day.installs, 0);
  const last30DaysTotal = stats.last30Days.reduce((sum, day) => sum + day.installs, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Smartphone className="w-10 h-10 text-purple-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">PWA Install Analytics</h1>
              <p className="text-purple-300 mt-1">Track progressive web app installations</p>
            </div>
          </div>
          <Button
            onClick={fetchStats}
            variant="outline"
            className="gap-2 bg-purple-500/10 border-purple-500/50 text-white hover:bg-purple-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300 mb-1">Total Installs</p>
                <p className="text-3xl font-bold text-white">{stats.totalInstalls}</p>
              </div>
              <Users className="w-12 h-12 text-purple-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300 mb-1">Last 7 Days</p>
                <p className="text-3xl font-bold text-white">{last7DaysTotal}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-cyan-500/20 to-green-500/20 border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-300 mb-1">Last 30 Days</p>
                <p className="text-3xl font-bold text-white">{last30DaysTotal}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-cyan-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300 mb-1">Countries</p>
                <p className="text-3xl font-bold text-white">{stats.byCountry.length}</p>
              </div>
              <Globe className="w-12 h-12 text-green-400 opacity-50" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-slate-800/50 border-purple-500/30">
              <h2 className="text-xl font-bold text-white mb-4">Installs by Platform</h2>
              <div className="space-y-3">
                {stats.byPlatform.length > 0 ? (
                  stats.byPlatform.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-purple-200">{item.platform}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{
                              width: `${(item.count / stats.totalInstalls) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold w-12 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-purple-300 text-center py-4">No platform data available</p>
                )}
              </div>
            </Card>

          <Card className="p-6 bg-slate-800/50 border-purple-500/30">
              <h2 className="text-xl font-bold text-white mb-4">Installs by Country</h2>
              <div className="space-y-3">
                {stats.byCountry.length > 0 ? (
                  stats.byCountry.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-purple-200">{item.country}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            style={{
                              width: `${(item.count / stats.totalInstalls) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold w-12 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-purple-300 text-center py-4">No country data available</p>
                )}
              </div>
            </Card>
        </div>

        <Card className="p-6 bg-slate-800/50 border-purple-500/30">
            <h2 className="text-xl font-bold text-white mb-4">Recent Installs (Last 50)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left text-purple-300 pb-3 px-4">Date & Time</th>
                    <th className="text-left text-purple-300 pb-3 px-4">Platform</th>
                    <th className="text-left text-purple-300 pb-3 px-4">Location</th>
                    <th className="text-left text-purple-300 pb-3 px-4">User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentInstalls.length > 0 ? (
                    stats.recentInstalls.map((install) => (
                      <tr key={install.id} className="border-b border-slate-700/50 hover:bg-purple-500/10">
                        <td className="py-3 px-4 text-white text-sm">
                          {formatDateTime(install.installed_at)}
                        </td>
                        <td className="py-3 px-4 text-purple-200 text-sm">
                          {install.platform || "Unknown"}
                        </td>
                        <td className="py-3 px-4 text-purple-200 text-sm">
                          {install.city && install.country
                            ? `${install.city}, ${install.country}`
                            : install.country || "Unknown"}
                        </td>
                        <td className="py-3 px-4 text-purple-200 text-sm max-w-md truncate">
                          {install.user_agent || "Unknown"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-purple-300">
                        No install records available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        <Card className="p-6 bg-slate-800/50 border-purple-500/30 mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Daily Install Trend (Last 30 Days)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left text-purple-300 pb-3 px-4">Date</th>
                    <th className="text-left text-purple-300 pb-3 px-4">Installs</th>
                    <th className="text-left text-purple-300 pb-3 px-4">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.last30Days.length > 0 ? (
                    stats.last30Days.map((day, index) => (
                      <tr key={day.date} className="border-b border-slate-700/50 hover:bg-purple-500/10">
                        <td className="py-3 px-4 text-white text-sm">{formatDate(day.date)}</td>
                        <td className="py-3 px-4 text-purple-200 text-sm font-semibold">
                          {day.installs}
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-full max-w-xs h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                              style={{
                                width: `${Math.min((day.installs / Math.max(...stats.last30Days.map(d => d.installs))) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-purple-300">
                        No trend data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
      </div>
    </div>
  );
}
