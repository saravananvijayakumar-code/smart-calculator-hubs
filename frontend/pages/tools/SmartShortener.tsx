import { useState } from "react";
import { Link2, Copy, BarChart3, Check, Sparkles, Zap, Shield, TrendingUp, Globe, Lock, Clock, Users, Target, ArrowRight } from "lucide-react";
import backend from "~backend/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/SEOHead";
import { StructuredData } from "@/components/StructuredData";
import { AdsterraSlot } from "@/components/ads/AdsterraSlot";
import { QRCodeSVG } from "qrcode.react";

export default function SmartShortener() {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL must start with http:// or https://");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await backend.shortener.create({
        url,
        customAlias: customAlias || undefined,
      });

      setShortUrl(result.shortUrl);
      setShortCode(result.shortCode);
    } catch (err: any) {
      setError(err.message || "Failed to shorten URL");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const loadAnalytics = async () => {
    if (!shortCode) return;

    try {
      const data = await backend.shortener.analytics({ shortCode });
      setAnalytics(data);
      setShowAnalytics(true);
    } catch (err: any) {
      console.error("Failed to load analytics:", err);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Smart Shortener",
    description: "Free URL shortener with analytics and QR code generation",
    url: "https://smartcalculatorhubs.com/tools/shortener",
    applicationCategory: "UtilitiesApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      <SEOHead
        title="Free Smart URL Shortener with Analytics & QR Codes | Smart Calculator Hubs"
        description="Transform long URLs into memorable short links. Free URL shortener with real-time analytics, custom aliases, QR code generation, and click tracking. No signup required!"
        keywords="url shortener, link shortener, short link, qr code, analytics, free url shortener, custom short url, link tracking"
        ogType="website"
        ogImage="https://smartcalculatorhubs.com/icons/icon-512x512.png"
      />
      <StructuredData data={structuredData} />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center gap-3 mb-4 group">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smart Shortener
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform endless URLs into powerful, trackable short links — <span className="font-semibold text-indigo-600 dark:text-indigo-400">completely free</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="animate-in fade-in slide-in-from-left-6 duration-500">
              <Card className="backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                  <CardTitle className="flex items-center gap-3 text-white text-2xl">
                    <Link2 className="w-6 h-6" />
                    Create Your Short Link
                  </CardTitle>
                  <p className="text-indigo-100 mt-2">Paste any URL and get instant results</p>
                </div>
                <CardContent className="p-6 space-y-5">
                  <div>
                    <Label htmlFor="url" className="text-base font-semibold">Original URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/your/very/long/url/here"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="mt-2 h-12 text-base"
                      onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                    />
                  </div>

                  <div>
                    <Label htmlFor="alias" className="text-base font-semibold">Custom Alias <span className="text-xs font-normal text-gray-500">(optional)</span></Label>
                    <div className="flex gap-2 mt-2">
                      <span className="inline-flex items-center px-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 text-sm">
                        smartcalculatorhubs.com/s/
                      </span>
                      <Input
                        id="alias"
                        type="text"
                        placeholder="my-awesome-link"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                    </div>
                  )}

                  <Button
                    onClick={handleShorten}
                    disabled={loading}
                    size="lg"
                    className="w-full h-14 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Shortening...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Shorten URL Instantly
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {shortUrl && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <Card className="backdrop-blur-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-2 border-green-200 dark:border-green-800 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Check className="w-6 h-6" />
                      Success! Your Short URL is Ready
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-5">
                    <div className="flex gap-3">
                      <Input
                        value={shortUrl}
                        readOnly
                        className="font-mono bg-white dark:bg-gray-800 h-12 text-base font-semibold text-indigo-600 dark:text-indigo-400"
                      />
                      <Button 
                        onClick={handleCopy} 
                        size="lg"
                        variant="outline"
                        className="px-6 hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                      >
                        {copied ? (
                          <span className="flex items-center gap-2 text-green-600">
                            <Check className="w-5 h-5" />
                            Copied!
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Copy className="w-5 h-5" />
                            Copy
                          </span>
                        )}
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Button
                        onClick={loadAnalytics}
                        variant="outline"
                        size="lg"
                        className="h-12"
                      >
                        <BarChart3 className="w-5 h-5 mr-2" />
                        View Analytics
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-12"
                        onClick={() => {
                          setUrl("");
                          setCustomAlias("");
                          setShortUrl("");
                          setShortCode("");
                          setShowAnalytics(false);
                        }}
                      >
                        Create Another
                      </Button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl flex flex-col items-center gap-3">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300">Scan QR Code</h4>
                      <div className="p-4 bg-white rounded-xl shadow-inner">
                        <QRCodeSVG value={shortUrl} size={180} level="H" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
                        Anyone can scan this QR code to access your shortened link instantly
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <AutoAdSlot slot="in-content-1" className="my-8" />
          </div>

          <div className="space-y-6">
            {showAnalytics && analytics && (
              <div className="animate-in fade-in slide-in-from-right-6 duration-500">
                <Card className="backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                      Link Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl">
                      <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-300 mb-2">
                        {analytics.totalClicks}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                        Total Clicks
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent Activity
                      </h4>
                      <div className="space-y-2 max-h-72 overflow-y-auto">
                        {analytics.recentClicks.length > 0 ? (
                          analytics.recentClicks.map((click: any, idx: number) => (
                            <div
                              key={idx}
                              className="text-xs bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 p-3 rounded-lg"
                            >
                              <div className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                                {new Date(click.clickedAt).toLocaleString()}
                              </div>
                              {click.country && (
                                <div className="text-gray-600 dark:text-gray-400 mt-1">
                                  📍 {click.city}, {click.country}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">No clicks yet</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card className="backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 group">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">100% Free Forever</p>
                    <p className="text-xs text-gray-500">No hidden fees or limits</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Custom Branded Links</p>
                    <p className="text-xs text-gray-500">Create memorable aliases</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">QR Code Generator</p>
                    <p className="text-xs text-gray-500">Instant mobile sharing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Real-Time Analytics</p>
                    <p className="text-xs text-gray-500">Track every click</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">No Registration</p>
                    <p className="text-xs text-gray-500">Start instantly</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AutoAdSlot slot="sidebar-1" />
          </div>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
          <Card className="backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              The Complete Guide to URL Shortening: Everything You Need to Know
            </h2>

            <div className="space-y-8">
              <section>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-indigo-600" />
                  What is a URL Shortener and Why Does It Matter?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  A URL shortener is a powerful web service that transforms long, unwieldy web addresses into compact, manageable links. Think of it as a digital compression tool for your URLs — where a 150-character Amazon product link becomes a sleek 25-character powerhouse. But modern URL shorteners like Smart Shortener go far beyond simple compression.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  In today's digital landscape, where attention spans are measured in milliseconds and mobile users dominate internet traffic, a clean, professional short link can be the difference between a clicked link and a scrolled-past message. When you share content on social media, send marketing emails, or create QR codes for print materials, shortened URLs offer crucial benefits:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Enhanced Trust:</strong> Short, clean links look more professional than sprawling URLs with tracking parameters and session IDs</li>
                  <li><strong>Better User Experience:</strong> Memorable custom aliases (like "smartcalculatorhubs.com/s/summer-sale") are easier to type and remember</li>
                  <li><strong>Character Conservation:</strong> Critical on platforms like Twitter where every character counts</li>
                  <li><strong>Tracking Capabilities:</strong> Modern shorteners provide detailed analytics on clicks, geography, and referral sources</li>
                  <li><strong>Link Management:</strong> Update destination URLs without changing the short link shared publicly</li>
                </ul>
              </section>

              <AutoAdSlot slot="in-content-2" className="my-8" />

              <section>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-indigo-600" />
                  How URL Shorteners Actually Work: The Technical Deep Dive
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Understanding the mechanics behind URL shortening helps you use these tools more effectively. When you submit a URL to Smart Shortener, here's the sophisticated process that happens in milliseconds:
                </p>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-6 rounded-2xl mb-6">
                  <h4 className="font-bold text-lg mb-3 text-indigo-900 dark:text-indigo-200">Step-by-Step URL Shortening Process:</h4>
                  <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li><strong>1. URL Validation:</strong> The system first validates your input URL to ensure it's properly formatted and accessible. This prevents broken links and security issues.</li>
                    <li><strong>2. Hash Generation:</strong> A unique identifier (short code) is generated using a cryptographic algorithm. Smart Shortener uses a base-62 encoding system (a-z, A-Z, 0-9) to create short, URL-safe codes.</li>
                    <li><strong>3. Database Storage:</strong> The original URL and its short code are stored in a high-performance PostgreSQL database with indexed lookups for lightning-fast retrieval.</li>
                    <li><strong>4. Custom Alias Handling:</strong> If you provide a custom alias, the system checks for availability and reserves it for your link, ensuring brand consistency.</li>
                    <li><strong>5. QR Code Generation:</strong> A scannable QR code is automatically created, encoding your short URL for mobile device accessibility.</li>
                    <li><strong>6. Analytics Setup:</strong> Tracking mechanisms are initialized to capture click data, referrers, geographic information, and timing metrics.</li>
                  </ol>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  When someone clicks your shortened link, the server performs a database lookup in microseconds, retrieves the original URL, logs the click event with metadata (timestamp, IP address, user agent, referrer), and issues an HTTP 302 redirect to send the user to their destination. This entire process happens so fast that users experience no noticeable delay — typically under 50 milliseconds for the complete round trip.
                </p>
              </section>

              <section>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                  Advanced Features: Custom Aliases, QR Codes, and Analytics
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Custom Alias Creation: Building Your Brand</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      Custom aliases transform generic short links into powerful branding tools. Instead of "smartcalculatorhubs.com/s/aB3xK9", imagine "smartcalculatorhubs.com/s/holiday-deals". The psychological impact is significant — users are 3x more likely to click branded short links compared to random character strings.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Best practices for custom aliases include: keeping them under 20 characters, using hyphens instead of underscores, avoiding special characters, incorporating relevant keywords, and maintaining consistency across campaigns. For businesses, custom aliases also provide valuable dark social tracking — when users manually type or paste your link, you can still attribute traffic sources.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">QR Code Integration: Bridging Physical and Digital</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      Smart Shortener automatically generates high-resolution QR codes for every shortened URL. These two-dimensional barcodes have become ubiquitous in our post-pandemic world — appearing on restaurant menus, product packaging, event posters, and business cards. The beauty of QR codes is their frictionless nature: point, scan, access.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Our QR codes use error correction level "H" (high), meaning they remain scannable even if up to 30% of the code is damaged or obscured. This makes them perfect for outdoor advertising, printed materials, or any environment where wear and tear is expected. The codes are generated as scalable SVGs, ensuring crystal-clear quality whether displayed on a smartphone screen or a billboard.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Real-Time Analytics: Understanding Your Audience</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      Every click on your shortened URL generates rich analytics data. Smart Shortener tracks total clicks, click timestamps, geographic locations (country and city), referrer information (where the click came from), and user agent data (device and browser type). This information transforms your short link from a simple redirect into a powerful marketing intelligence tool.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Analytics help answer critical business questions: What time of day generates the most engagement? Which social media platforms drive the highest quality traffic? Are mobile or desktop users more likely to convert? Where geographically is your audience concentrated? This data enables continuous optimization of your marketing strategies.
                    </p>
                  </div>
                </div>
              </section>

              <AutoAdSlot slot="in-content-3" className="my-8" />

              <section>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  Real-World Use Cases: Who Benefits from URL Shortening?
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-5 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-blue-900 dark:text-blue-200">Social Media Managers</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Create branded links for every campaign, track performance across platforms (Instagram, Twitter, LinkedIn, TikTok), and measure ROI with precision. Custom aliases like "/instagram-bio" or "/linkedin-article" make attribution effortless.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-5 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-purple-900 dark:text-purple-200">Email Marketers</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Shorten long product URLs, make emails more readable, track click-through rates per campaign, and A/B test different messaging with separate short links to the same destination.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-5 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-green-900 dark:text-green-200">Event Organizers</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Generate QR codes for event registration, ticketing, and venue navigation. Create memorable URLs for promotional materials, posters, and social media announcements that attendees can easily type.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-5 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-orange-900 dark:text-orange-200">Content Creators</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Share affiliate links without overwhelming your audience with tracking parameters. Create clean links for YouTube descriptions, podcast show notes, and blog posts while maintaining full analytics visibility.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 p-5 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-cyan-900 dark:text-cyan-200">Small Business Owners</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Print QR codes on business cards, menus, receipts, and signage. Create memorable links for promotions (/spring-sale), loyalty programs (/rewards), and contact forms (/feedback) that customers can easily access.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 p-5 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-violet-900 dark:text-violet-200">App Developers</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Share deep links to specific app features, track marketing campaigns by channel, and create universal links that work across iOS and Android with a single memorable short URL.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-indigo-600" />
                  Security, Privacy, and Best Practices
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Security is paramount when dealing with URL redirection. Smart Shortener implements multiple layers of protection to ensure both link creators and end users remain safe:
                </p>

                <div className="bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500 p-5 rounded-r-xl mb-4">
                  <h4 className="font-bold text-lg mb-2 text-yellow-900 dark:text-yellow-200">Security Features:</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• <strong>URL Validation:</strong> All submitted URLs are validated to prevent JavaScript injection and malformed redirect attacks</li>
                    <li>• <strong>Rate Limiting:</strong> Automated systems detect and block abuse patterns to prevent spam and phishing campaigns</li>
                    <li>• <strong>HTTPS Encryption:</strong> All short links use secure HTTPS protocol to protect users in transit</li>
                    <li>• <strong>No Malware Hosting:</strong> Links are purely redirects — we never host or proxy content, eliminating malware distribution risks</li>
                    <li>• <strong>Transparent Analytics:</strong> Users can preview analytics without clicking, enabling informed decisions about link safety</li>
                  </ul>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  For optimal results and security when using shortened URLs, follow these expert recommendations:
                </p>

                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Always test your short links before sharing to ensure they redirect correctly</li>
                  <li>Use custom aliases for professional contexts (business emails, marketing campaigns, official communications)</li>
                  <li>Keep a record of your short codes and their destinations for future reference</li>
                  <li>Monitor analytics regularly to detect unusual traffic patterns that might indicate sharing outside your intended audience</li>
                  <li>Consider the longevity of your links — avoid time-sensitive aliases for evergreen content</li>
                  <li>When sharing on social media, add context around your link so users know what to expect</li>
                  <li>Use URL shorteners as a complement to, not replacement for, clear call-to-action language</li>
                </ul>
              </section>

              <AutoAdSlot slot="in-content-4" className="my-8" />

              <section>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  The Future of URL Shortening: Emerging Trends and Innovations
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The URL shortening landscape continues to evolve with technological advancement. Smart Shortener stays at the forefront by incorporating cutting-edge features and anticipating future needs:
                </p>

                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>
                    <strong className="text-indigo-600 dark:text-indigo-400">AI-Powered Link Optimization:</strong> Future iterations will leverage machine learning to suggest optimal custom aliases based on your content, automatically A/B test different short URLs, and predict click-through rates based on historical patterns.
                  </p>
                  <p>
                    <strong className="text-indigo-600 dark:text-indigo-400">Enhanced Privacy Controls:</strong> As privacy regulations like GDPR and CCPA evolve, URL shorteners are implementing granular data retention policies, anonymized analytics options, and user-controlled tracking preferences.
                  </p>
                  <p>
                    <strong className="text-indigo-600 dark:text-indigo-400">Integration Ecosystems:</strong> Modern shorteners integrate seamlessly with marketing platforms, CRM systems, social media schedulers, and analytics dashboards, creating unified workflows for digital marketers.
                  </p>
                  <p>
                    <strong className="text-indigo-600 dark:text-indigo-400">Dynamic QR Codes:</strong> Next-generation QR codes will support dynamic destination updates, allowing you to change where a printed QR code points without reprinting materials.
                  </p>
                  <p>
                    <strong className="text-indigo-600 dark:text-indigo-400">Blockchain-Based Short Links:</strong> Decentralized shorteners using blockchain technology offer censorship resistance and permanent link preservation, crucial for archival and historical content.
                  </p>
                </div>
              </section>

              <section className="mt-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Links?</h3>
                  <p className="text-indigo-100 mb-6 leading-relaxed">
                    Smart Shortener combines enterprise-grade features with consumer-friendly simplicity. Whether you're sharing a single link or managing thousands of marketing campaigns, our platform scales to meet your needs — all while remaining completely free and requiring zero registration.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                      <Zap className="w-5 h-5" />
                      <span className="font-semibold">Instant Results</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                      <Shield className="w-5 h-5" />
                      <span className="font-semibold">Secure & Private</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">Powerful Analytics</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </Card>
        </div>

        <AutoAdSlot slot="bottom-banner" className="mt-12" />
      </div>
    </div>
  );
}
