import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, AlertTriangle, Info, Bug } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function TestLogsPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createTestLog = async (level: 'debug' | 'info' | 'warn' | 'error' | 'critical') => {
    setLoading(true);
    try {
      toast({
        title: 'Error',
        description: 'Logs service not implemented',
        variant: 'destructive',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to create log: ${error.message}`,
        variant: 'destructive',
      });
      console.error('Failed to create log:', error);
    } finally {
      setLoading(false);
    }
  };

  const createComponentError = () => {
    throw new Error('Test error from component - this should be caught by ErrorBoundary');
  };

  const createApiError = async () => {
    setLoading(true);
    try {
      toast({
        title: 'Info',
        description: 'Test API error - service not fully implemented',
      });
    } catch (error: any) {
      console.error('Expected API error:', error);
      toast({
        title: 'Expected Error Logged',
        description: 'This API error was intentional and has been logged',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Logging System Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Create Test Logs</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Button
                onClick={() => createTestLog('debug')}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Bug className="w-4 h-4" />
                Debug
              </Button>
              <Button
                onClick={() => createTestLog('info')}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Info className="w-4 h-4" />
                Info
              </Button>
              <Button
                onClick={() => createTestLog('warn')}
                disabled={loading}
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700"
              >
                <AlertTriangle className="w-4 h-4" />
                Warning
              </Button>
              <Button
                onClick={() => createTestLog('error')}
                disabled={loading}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <AlertCircle className="w-4 h-4" />
                Error
              </Button>
              <Button
                onClick={() => createTestLog('critical')}
                disabled={loading}
                className="flex items-center gap-2 bg-red-900 hover:bg-red-950"
              >
                <AlertCircle className="w-4 h-4" />
                Critical
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Error Boundary Tests</h3>
            <div className="space-y-3">
              <Button
                onClick={createComponentError}
                variant="destructive"
                className="w-full"
              >
                Throw Component Error (ErrorBoundary Test)
              </Button>
              <Button
                onClick={createApiError}
                variant="outline"
                disabled={loading}
                className="w-full"
              >
                Trigger API Error (useErrorHandler Test)
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">View Logs</h3>
            <Button
              onClick={() => window.location.href = '/admin/logs'}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Go to Admin Logs Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
