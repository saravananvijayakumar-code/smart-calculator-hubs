// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, AlertTriangle, Info, Bug, Skull, RefreshCw, Trash2, Download, Filter, ChevronDown, ChevronRight } from 'lucide-react';

type LogLevel = 'critical' | 'error' | 'warn' | 'info' | 'debug';
type ErrorLog = any;
type LogStats = any;

export function LogsViewer() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterService, setFilterService] = useState('');
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    setLogs([]);
  };

  const fetchStats = async () => {
    setStats({
      totalLogs: 0,
      criticalErrors: 0,
      recentErrors: 0,
      byLevel: { error: 0, warn: 0, info: 0, debug: 0, critical: 0 }
    });
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchLogs(), fetchStats()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filterLevel, filterService]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs?')) return;
    console.log('Logs service not implemented');
  };

  const handleTestError = async () => {
    console.log('Logs service not implemented');
  };

  const toggleExpanded = (logId: number) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'critical':
        return <Skull className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      case 'debug':
        return <Bug className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'critical':
        return 'bg-red-900 text-white border-red-950';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warn':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'debug':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-600 mt-1">Monitor and analyze application errors</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleTestError} variant="outline">
            Test Error
          </Button>
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleClearLogs} variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Logs
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLogs.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-900">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{stats.criticalErrors.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-900">Recent (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.recentErrors.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byLevel.error.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byLevel.warn.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Log Level</Label>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Service Name</Label>
              <Input
                placeholder="Filter by service..."
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Logs ({logs.length})</CardTitle>
          <CardDescription>Recent errors and warnings from the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No logs found</p>
                <p className="text-sm">Try adjusting your filters or create a test error</p>
              </div>
            ) : (
              logs.map((log) => {
                const isExpanded = expandedLogs.has(log.id);
                return (
                  <div key={log.id} className="border rounded-lg overflow-hidden">
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleExpanded(log.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400 mt-1" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getLevelColor(log.level)}>
                                {getLevelIcon(log.level)}
                                <span className="ml-1">{log.level.toUpperCase()}</span>
                              </Badge>
                              {log.serviceName && (
                                <Badge variant="outline">{log.serviceName}</Badge>
                              )}
                              {log.errorType && (
                                <Badge variant="secondary">{log.errorType}</Badge>
                              )}
                              <span className="text-xs text-gray-500 ml-auto">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{log.message}</p>
                            {log.endpoint && (
                              <p className="text-xs text-gray-500 mt-1">Endpoint: {log.endpoint}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t bg-gray-50 p-4 space-y-3">
                        {log.stackTrace && (
                          <div>
                            <Label className="text-xs font-semibold text-gray-700">Stack Trace</Label>
                            <pre className="mt-1 text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                              {log.stackTrace}
                            </pre>
                          </div>
                        )}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div>
                            <Label className="text-xs font-semibold text-gray-700">Metadata</Label>
                            <pre className="mt-1 text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {log.requestId && (
                            <div>
                              <span className="font-semibold text-gray-700">Request ID:</span>
                              <div className="text-gray-600">{log.requestId}</div>
                            </div>
                          )}
                          {log.userId && (
                            <div>
                              <span className="font-semibold text-gray-700">User ID:</span>
                              <div className="text-gray-600">{log.userId}</div>
                            </div>
                          )}
                          {log.ipAddress && (
                            <div>
                              <span className="font-semibold text-gray-700">IP Address:</span>
                              <div className="text-gray-600">{log.ipAddress}</div>
                            </div>
                          )}
                          {log.environment && (
                            <div>
                              <span className="font-semibold text-gray-700">Environment:</span>
                              <div className="text-gray-600">{log.environment}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
