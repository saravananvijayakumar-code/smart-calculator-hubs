// @ts-nocheck
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Globe, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SEOHead } from "@/components/SEOHead";

export default function IndexingTest() {
  const { toast } = useToast();
  const [testUrl, setTestUrl] = useState("/blog/test");
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexResult, setIndexResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isIndexingStatic, setIsIndexingStatic] = useState(false);
  const [staticIndexResult, setStaticIndexResult] = useState<any>(null);

  const handleIndexUrl = async () => {
    if (!testUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to index",
        variant: "destructive",
      });
      return;
    }

    setIsIndexing(true);
    setIndexResult(null);

    try {
      const fullUrl = testUrl.startsWith("http")
        ? testUrl
        : `https://smartcalculatorhubs.com${testUrl.startsWith("/") ? testUrl : `/${testUrl}`}`;

      setIndexResult({
        success: false,
        message: "Google indexing service not implemented"
      });

      toast({
        title: "Error",
        description: "Google indexing service not implemented",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Indexing error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to index URL";
      
      setIndexResult({
        success: false,
        message: errorMessage,
      });

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsIndexing(false);
    }
  };

  const handleIndexStaticPages = async () => {
    setIsIndexingStatic(true);
    setStaticIndexResult(null);

    try {
      setStaticIndexResult({
        success: false,
        message: "Google indexing service not implemented"
      });

      toast({
        title: "Error",
        description: "Google indexing service not implemented",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Static indexing error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to index static pages";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsIndexingStatic(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <SEOHead
        title="Google Indexing Test - Admin Panel"
        description="Test and manage Google indexing for SmartCalculatorHub pages"
      />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Google Indexing Test Panel
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Test and monitor Google indexing for your pages
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              URL Indexing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Enter URL to Index
              </label>
              <Input
                type="text"
                placeholder="/blog/my-article or https://smartcalculatorhubs.com/..."
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter a relative path (e.g., /blog/my-article) or full URL
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleIndexUrl}
                disabled={isIndexing || !testUrl.trim()}
                className="flex-1"
              >
                {isIndexing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Indexing...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Index URL
                  </>
                )}
              </Button>
            </div>

            {indexResult && (
              <Alert variant={indexResult.success ? "default" : "destructive"}>
                <div className="flex items-start gap-2">
                  {indexResult.success ? (
                    <CheckCircle className="h-4 w-4 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 mt-0.5" />
                  )}
                  <AlertDescription className="whitespace-pre-wrap">
                    {indexResult.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
              <RefreshCw className="w-5 h-5" />
              SmartTimer Auto-Indexing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-green-800 dark:text-green-200">
              Index all SmartTimer pages with Google Indexing API. This submits 6 URLs immediately for crawling.
            </p>

            <div className="bg-white dark:bg-slate-900 p-3 rounded border border-green-200 dark:border-green-700">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Pages to index:</p>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <li>• /smarttimer</li>
                <li>• /smarttimer/stopwatch</li>
                <li>• /smarttimer/countdown</li>
                <li>• /smarttimer/pomodoro</li>
                <li>• /smarttimer/multi-timer</li>
                <li>• /smarttimer/event</li>
              </ul>
            </div>

            <Button
              onClick={handleIndexStaticPages}
              disabled={isIndexingStatic}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isIndexingStatic ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Indexing SmartTimer Pages...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Index All SmartTimer Pages
                </>
              )}
            </Button>

            {staticIndexResult && (
              <Alert variant={staticIndexResult.success ? "default" : "destructive"}>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    {staticIndexResult.success ? (
                      <CheckCircle className="h-4 w-4 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 mt-0.5" />
                    )}
                    <AlertDescription>
                      {staticIndexResult.message}
                    </AlertDescription>
                  </div>
                  {staticIndexResult.results && staticIndexResult.results.length > 0 && (
                    <div className="ml-6 mt-2 space-y-1">
                      {staticIndexResult.results.map((result: any, index: number) => (
                        <div key={index} className="text-xs flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                          <span className="font-mono">{result.url}</span>
                          {!result.success && (
                            <span className="text-red-600 dark:text-red-400">- {result.message}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Alert>
            )}

            <Alert>
              <AlertDescription className="text-xs">
                <strong>Note:</strong> Rate-limited to once per 24 hours to avoid Google API quotas. 
                The system automatically tracks when pages were last indexed.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <RefreshCw className="w-5 h-5" />
              Sitemap Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your sitemap is available at:
              </p>
              <a 
                href="https://smartcalculatorhubs.com/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs bg-white dark:bg-slate-900 px-3 py-2 rounded border border-blue-200 dark:border-blue-700 block hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              >
                https://smartcalculatorhubs.com/sitemap.xml
              </a>
            </div>

            <Alert>
              <AlertDescription className="text-xs">
                <strong>Note:</strong> Google's sitemap ping endpoint is deprecated. 
                Google automatically discovers your sitemap from robots.txt. 
                To manually submit your sitemap, go to{" "}
                <a 
                  href="https://search.google.com/search-console" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  Google Search Console
                </a>
                {" "}→ Sitemaps → Add sitemap URL.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>



        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">How it works:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>Index URL:</strong> Submits a specific URL to Google Indexing API for immediate crawling
                </li>
                <li>
                  <strong>Sitemap:</strong> Auto-generated and discoverable by Google via robots.txt
                </li>
                <li>
                  <strong>Auto-indexing:</strong> New blog posts are automatically indexed when published
                </li>
              </ul>

              <h3 className="font-semibold text-slate-900 dark:text-white mt-4">Requirements:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Google Service Account JSON must be configured in Settings</li>
                <li>Service account must have Indexing API permissions</li>
                <li>Site must be verified in Google Search Console</li>
                <li>Submit sitemap manually in Search Console (one-time setup)</li>
              </ul>
              
              <h3 className="font-semibold text-slate-900 dark:text-white mt-4">Manual Sitemap Submission:</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Google Search Console</a></li>
                <li>Select your property</li>
                <li>Click "Sitemaps" in the left sidebar</li>
                <li>Enter: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">sitemap.xml</code></li>
                <li>Click "Submit"</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
