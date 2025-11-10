import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Globe, Eye, Copy, CheckCircle, Wifi, Cpu, HardDrive, Chrome, Zap, Info, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { SEOHead } from '@/components/SEOHead';
import { AdsterraSlot } from '@/components/ads/AdsterraSlot';

interface DeviceInfo {
  browser: string;
  browserVersion: string;
  engine: string;
  platform: string;
  os: string;
  device: string;
  language: string;
  languages: string[];
  screen: string;
  colorDepth: number;
  pixelRatio: number;
  viewport: string;
  timezone: string;
  cookiesEnabled: boolean;
  doNotTrack: string;
  javaEnabled: boolean;
  onlineStatus: boolean;
  cores: number;
  memory?: number;
  connection?: string;
  touchSupport: boolean;
}

export default function BrowserDeviceInfo() {
  const { toast } = useToast();
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    detectDeviceInfo();
  }, []);

  const detectDeviceInfo = () => {
    const ua = navigator.userAgent;
    
    // Browser detection
    let browser = 'Unknown';
    let browserVersion = '';
    if (ua.includes('Firefox/')) {
      browser = 'Firefox';
      browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.includes('Edg/')) {
      browser = 'Microsoft Edge';
      browserVersion = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.includes('Chrome/')) {
      browser = 'Google Chrome';
      browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
      browser = 'Safari';
      browserVersion = ua.match(/Version\/(\d+\.\d+)/)?.[1] || '';
    }

    // OS detection
    let os = 'Unknown';
    if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11';
    else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
    else if (ua.includes('Windows NT 6.2')) os = 'Windows 8';
    else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
    else if (ua.includes('Mac OS X')) os = 'macOS ' + (ua.match(/Mac OS X (\d+[._]\d+)/)?.[1].replace('_', '.') || '');
    else if (ua.includes('Android')) os = 'Android ' + (ua.match(/Android (\d+\.\d+)/)?.[1] || '');
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS ' + (ua.match(/OS (\d+_\d+)/)?.[1].replace('_', '.') || '');
    else if (ua.includes('Linux')) os = 'Linux';

    // Device type
    let device = 'Desktop';
    if (ua.includes('Mobile')) device = 'Mobile';
    else if (ua.includes('Tablet') || ua.includes('iPad')) device = 'Tablet';

    const deviceInfo: DeviceInfo = {
      browser,
      browserVersion,
      engine: ua.includes('Gecko') ? 'Gecko' : ua.includes('WebKit') ? 'WebKit' : 'Unknown',
      platform: navigator.platform,
      os,
      device,
      language: navigator.language,
      languages: navigator.languages ? Array.from(navigator.languages) : [navigator.language],
      screen: `${window.screen.width} x ${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      viewport: `${window.innerWidth} x ${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || 'Not set',
      javaEnabled: false,
      onlineStatus: navigator.onLine,
      cores: navigator.hardwareConcurrency || 0,
      memory: (navigator as any).deviceMemory,
      connection: (navigator as any).connection?.effectiveType,
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };

    setInfo(deviceInfo);
  };

  const copyToClipboard = () => {
    if (!info) return;
    
    const text = `
Browser: ${info.browser} ${info.browserVersion}
OS: ${info.os}
Device: ${info.device}
Screen: ${info.screen}
Viewport: ${info.viewport}
Language: ${info.language}
Timezone: ${info.timezone}
Online: ${info.onlineStatus ? 'Yes' : 'No'}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Device info copied to clipboard'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEOHead
        title="Browser & Device Info — Check Your System Details"
        description="View your browser, operating system, screen resolution, and device information instantly. Free browser fingerprint checker."
        keywords="browser info, device info, user agent, screen resolution, browser fingerprint, system info, browser details, device checker"
      />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="container mx-auto px-4 py-12">
          <AdsterraSlot position="top" className="mb-6" />

          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4">
              <Monitor className="w-20 h-20 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Browser & Device Info
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover everything about your browser, operating system, and device specifications! 🖥️
            </p>
          </div>

          <AdsterraSlot position="middle" className="mb-6" />

          {/* Quick Actions */}
          {info && (
            <div className="max-w-4xl mx-auto mb-8 animate-bounce-in">
              <div className="flex justify-center gap-4">
                <Button
                  onClick={copyToClipboard}
                  size="lg"
                  variant="outline"
                  className="border-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copy Info
                    </>
                  )}
                </Button>
                <Button
                  onClick={detectDeviceInfo}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          )}

          {/* Main Info Grid */}
          {info && (
            <div className="max-w-6xl mx-auto mb-12 animate-slide-up">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 hover:shadow-2xl hover:shadow-indigo-500/20 transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Chrome className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-bounce" />
                      <CardTitle className="text-lg">Browser</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {info.browser}
                    </p>
                    <p className="text-sm text-muted-foreground">Version {info.browserVersion}</p>
                    <p className="text-xs text-muted-foreground mt-1">{info.engine} Engine</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Cpu className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-bounce" style={{animationDelay: '0.1s'}} />
                      <CardTitle className="text-lg">Operating System</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {info.os}
                    </p>
                    <p className="text-sm text-muted-foreground">{info.platform}</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 hover:shadow-2xl hover:shadow-pink-500/20 transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-8 h-8 text-pink-600 dark:text-pink-400 animate-bounce" style={{animationDelay: '0.2s'}} />
                      <CardTitle className="text-lg">Device Type</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                      {info.device}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {info.touchSupport ? '✅ Touch Enabled' : '❌ No Touch'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Monitor className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-bounce" style={{animationDelay: '0.3s'}} />
                      <CardTitle className="text-lg">Screen Resolution</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {info.screen}
                    </p>
                    <p className="text-sm text-muted-foreground">{info.colorDepth}-bit Color</p>
                    <p className="text-xs text-muted-foreground mt-1">Pixel Ratio: {info.pixelRatio}x</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 hover:shadow-2xl hover:shadow-green-500/20 transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Eye className="w-8 h-8 text-green-600 dark:text-green-400 animate-bounce" style={{animationDelay: '0.4s'}} />
                      <CardTitle className="text-lg">Viewport Size</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {info.viewport}
                    </p>
                    <p className="text-sm text-muted-foreground">Current Window</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 hover:shadow-2xl hover:shadow-orange-500/20 transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Globe className="w-8 h-8 text-orange-600 dark:text-orange-400 animate-bounce" style={{animationDelay: '0.5s'}} />
                      <CardTitle className="text-lg">Language</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {info.language}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {info.languages.slice(0, 3).join(', ')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 hover:shadow-2xl hover:shadow-teal-500/20 transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Globe className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-bounce" style={{animationDelay: '0.6s'}} />
                      <CardTitle className="text-lg">Timezone</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      {info.timezone}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 hover:shadow-2xl hover:shadow-violet-500/20 transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Wifi className="w-8 h-8 text-violet-600 dark:text-violet-400 animate-bounce" style={{animationDelay: '0.7s'}} />
                      <CardTitle className="text-lg">Connection</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-2xl font-bold ${info.onlineStatus ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {info.onlineStatus ? '🟢 Online' : '🔴 Offline'}
                    </p>
                    {info.connection && (
                      <p className="text-sm text-muted-foreground">{info.connection.toUpperCase()}</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-2 border-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 hover:shadow-2xl hover:shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Cpu className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-bounce" style={{animationDelay: '0.8s'}} />
                      <CardTitle className="text-lg">CPU Cores</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                      {info.cores || 'Unknown'}
                    </p>
                    {info.memory && (
                      <p className="text-sm text-muted-foreground">{info.memory} GB RAM</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Privacy Settings */}
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <Card className="border-2 border-purple-200 dark:border-purple-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Cookies</p>
                        <p className="text-sm text-muted-foreground">Browser Storage</p>
                      </div>
                      <div className={`text-2xl ${info.cookiesEnabled ? 'text-green-600' : 'text-red-600'}`}>
                        {info.cookiesEnabled ? '✅' : '❌'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Do Not Track</p>
                        <p className="text-sm text-muted-foreground">Privacy Signal</p>
                      </div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {info.doNotTrack}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 dark:border-green-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Java Support</p>
                        <p className="text-sm text-muted-foreground">Plugin Status</p>
                      </div>
                      <div className={`text-2xl ${info.javaEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                        {info.javaEnabled ? '✅' : '❌'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <AutoAdSlot placement="mid-content" />

          <AutoAdSlot placement="in-feed" />

          <AmazonAffiliate calculatorTitle="Privacy Tools" placement="content" />

          {/* Educational Content */}
          <div className="max-w-6xl mx-auto mt-16 space-y-12">
            <AutoAdSlot placement="in-article" />

            {/* Browser Fingerprinting */}
            <Card className="border-2 border-indigo-200 dark:border-indigo-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Eye className="w-8 h-8 text-indigo-600" />
                  What is Browser Fingerprinting? 🔍
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">
                  Every time you visit a website, your browser reveals tons of information about you! <strong>Browser fingerprinting</strong> is a technique that combines all these details (screen size, fonts, plugins, timezone, etc.) to create a unique "fingerprint" that can track you across websites—even without cookies! 🕵️
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  Your fingerprint is so unique that research shows <strong>87% of browsers can be uniquely identified</strong> just from these technical details. Scary, right? But understanding what's exposed is the first step to protecting your privacy! 🛡️
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800">
                    <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">⚠️ High Risk Data</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Canvas fingerprint</li>
                      <li>• WebGL renderer</li>
                      <li>• Installed fonts</li>
                      <li>• Audio context</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-bold text-yellow-600 dark:text-yellow-400 mb-2">⚡ Medium Risk Data</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Screen resolution</li>
                      <li>• Timezone</li>
                      <li>• Language settings</li>
                      <li>• Platform details</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">✅ Low Risk Data</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Browser type</li>
                      <li>• Device type</li>
                      <li>• OS version</li>
                      <li>• Online status</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AutoAdSlot placement="sidebar" />

            {/* User Agent Explained */}
            <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Info className="w-8 h-8 text-purple-600" />
                  Understanding User Agents 🤖
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  Your <strong>User Agent</strong> is a text string your browser sends to every website, announcing who you are. It's like your browser's business card! Here's what a typical one looks like and what each part means:
                </p>
                
                <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800 font-mono text-sm mb-6 overflow-x-auto">
                  <p className="mb-4"><strong>Example:</strong></p>
                  <p className="text-xs md:text-sm break-all">
                    Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Mozilla/5.0</h4>
                    <p className="text-sm">Historical compatibility token. ALL browsers claim to be "Mozilla" for legacy reasons dating back to the 1990s browser wars!</p>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500">
                    <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">(Windows NT 10.0; Win64; x64)</h4>
                    <p className="text-sm">Operating system info: Windows 10/11, 64-bit architecture. Tells websites what OS you're running.</p>
                  </div>

                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500">
                    <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">AppleWebKit/537.36</h4>
                    <p className="text-sm">Rendering engine version. Chrome, Safari, and Edge all use WebKit/Blink (a WebKit fork).</p>
                  </div>

                  <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500">
                    <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-2">Chrome/120.0.0.0</h4>
                    <p className="text-sm">Actual browser name and version number. This is the real identity of your browser!</p>
                  </div>

                  <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-950/30 border-l-4 border-pink-500">
                    <h4 className="font-bold text-pink-600 dark:text-pink-400 mb-2">Safari/537.36</h4>
                    <p className="text-sm">More compatibility nonsense! Chrome pretends to be Safari to avoid website blocking. It's a mess! 😅</p>
                  </div>
                </div>

                <p className="mt-6 text-sm text-muted-foreground p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <strong>💡 Fun Fact:</strong> The User Agent string is a hilarious historical accident. Every browser lies about its identity to maintain compatibility with websites that check for specific browsers. It's basically the internet's version of "I'm not a robot" but for browsers! 🤖
                </p>
              </CardContent>
            </Card>

            <AutoAdSlot placement="in-feed" />

            {/* Privacy Protection Tips */}
            <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-600" />
                  How to Protect Your Privacy 🛡️
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">1️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Use Privacy-Focused Browsers</h4>
                      <p className="text-sm text-muted-foreground">Try Brave, Firefox with privacy add-ons, or Tor Browser for maximum anonymity</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">2️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Install Privacy Extensions</h4>
                      <p className="text-sm text-muted-foreground">uBlock Origin blocks trackers, Privacy Badger stops fingerprinting, HTTPS Everywhere encrypts</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">3️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Use VPN Services</h4>
                      <p className="text-sm text-muted-foreground">Hide your IP address and location (but VPNs can't stop fingerprinting!)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">4️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Enable Do Not Track</h4>
                      <p className="text-sm text-muted-foreground">Politely asks websites not to track you (they often ignore it, but worth enabling!)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">5️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Clear Cookies Regularly</h4>
                      <p className="text-sm text-muted-foreground">Use containers (Firefox) or Incognito mode to separate browsing sessions</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">6️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Resist Fingerprinting</h4>
                      <p className="text-sm text-muted-foreground">Firefox's Enhanced Tracking Protection resists common fingerprinting techniques</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">7️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Use Different Browsers</h4>
                      <p className="text-sm text-muted-foreground">Separate work/personal browsing to compartmentalize your digital footprint</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">8️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Disable JavaScript Selectively</h4>
                      <p className="text-sm text-muted-foreground">Use NoScript or uMatrix to block scripts on sketchy sites (breaks many sites though!)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AutoAdSlot placement="mid-content" />

            {/* Browser Comparison */}
            <Card className="border-2 border-orange-200 dark:border-orange-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Award className="w-8 h-8 text-orange-600" />
                  Browser Privacy Comparison 2024 🏆
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-2 border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-orange-600 dark:text-orange-400">🦁 Brave Browser</h4>
                      <span className="text-2xl">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p className="text-sm mb-2"><strong>Privacy:</strong> Excellent • Built-in ad/tracker blocking, fingerprint randomization, Tor mode</p>
                    <p className="text-xs text-muted-foreground"><strong>Pros:</strong> Best privacy out-of-box, crypto wallet, rewards • <strong>Cons:</strong> Smaller market share, some compatibility issues</p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400">🦊 Firefox</h4>
                      <span className="text-2xl">⭐⭐⭐⭐</span>
                    </div>
                    <p className="text-sm mb-2"><strong>Privacy:</strong> Very Good • Enhanced Tracking Protection, fingerprint resistance, open source</p>
                    <p className="text-xs text-muted-foreground"><strong>Pros:</strong> Customizable, great extensions, non-profit • <strong>Cons:</strong> Slower than Chrome, telemetry enabled by default</p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-2 border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-green-600 dark:text-green-400">🍎 Safari</h4>
                      <span className="text-2xl">⭐⭐⭐⭐</span>
                    </div>
                    <p className="text-sm mb-2"><strong>Privacy:</strong> Very Good • Intelligent Tracking Prevention, privacy labels in App Store</p>
                    <p className="text-xs text-muted-foreground"><strong>Pros:</strong> Apple ecosystem integration, battery efficient • <strong>Cons:</strong> Mac/iOS only, limited extension support</p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-2 border-cyan-200 dark:border-cyan-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-cyan-600 dark:text-cyan-400">🔵 Microsoft Edge</h4>
                      <span className="text-2xl">⭐⭐⭐</span>
                    </div>
                    <p className="text-sm mb-2"><strong>Privacy:</strong> Good • Tracking prevention, InPrivate mode, password leak detection</p>
                    <p className="text-xs text-muted-foreground"><strong>Pros:</strong> Fast, Windows integration, vertical tabs • <strong>Cons:</strong> Microsoft telemetry, promotes Bing heavily</p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-2 border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-red-600 dark:text-red-400">🔴 Google Chrome</h4>
                      <span className="text-2xl">⭐⭐</span>
                    </div>
                    <p className="text-sm mb-2"><strong>Privacy:</strong> Poor • Heavy tracking for ad targeting, sync with Google account</p>
                    <p className="text-xs text-muted-foreground"><strong>Pros:</strong> Fastest, best compatibility, huge extension library • <strong>Cons:</strong> Google surveillance, resource-hungry, privacy nightmare</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AutoAdSlot placement="in-article" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </>
  );
}
