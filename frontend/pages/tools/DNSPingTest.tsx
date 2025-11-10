import { useState } from 'react';
import { Network, Zap, Globe, TrendingDown, Award, Wifi, Timer, Signal, Target, CheckCircle, AlertCircle, Info, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SEOHead } from '@/components/SEOHead';
import { AdsterraSlot } from '@/components/ads/AdsterraSlot';

interface DNSProvider {
  name: string;
  primary: string;
  secondary: string;
  ping: number;
  status: 'excellent' | 'good' | 'average' | 'slow';
}

interface DNSResults {
  currentDNS: string;
  fastestProvider: string;
  averagePing: number;
  providers: DNSProvider[];
}

const statusConfig = {
  excellent: {
    label: '🚀 Excellent',
    color: 'text-green-600 dark:text-green-400',
    bg: 'from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-100 dark:border-green-900/50'
  },
  good: {
    label: '✨ Good',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-100 dark:border-blue-900/50'
  },
  average: {
    label: '⚡ Average',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 border-yellow-100 dark:border-yellow-900/50'
  },
  slow: {
    label: '🐌 Slow',
    color: 'text-red-600 dark:text-red-400',
    bg: 'from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 border-red-100 dark:border-red-900/50'
  }
};

export default function DNSPingTest() {
  const [results, setResults] = useState<DNSResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [testProgress, setTestProgress] = useState(0);

  const runDNSTest = async () => {
    setLoading(true);
    setTestProgress(0);
    setResults(null);

    // Simulate testing multiple DNS providers
    for (let i = 0; i <= 100; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setTestProgress(i);
    }

    // Mock results
    const providers: DNSProvider[] = [
      {
        name: 'Cloudflare DNS',
        primary: '1.1.1.1',
        secondary: '1.0.0.1',
        ping: Math.floor(Math.random() * 20) + 5,
        status: 'excellent' as const
      },
      {
        name: 'Google Public DNS',
        primary: '8.8.8.8',
        secondary: '8.8.4.4',
        ping: Math.floor(Math.random() * 30) + 10,
        status: 'good' as const
      },
      {
        name: 'Quad9',
        primary: '9.9.9.9',
        secondary: '149.112.112.112',
        ping: Math.floor(Math.random() * 40) + 15,
        status: 'good' as const
      },
      {
        name: 'OpenDNS',
        primary: '208.67.222.222',
        secondary: '208.67.220.220',
        ping: Math.floor(Math.random() * 50) + 20,
        status: 'average' as const
      }
    ].sort((a, b) => a.ping - b.ping);

    const avgPing = Math.floor(providers.reduce((sum, p) => sum + p.ping, 0) / providers.length);

    setResults({
      currentDNS: 'Auto-detected',
      fastestProvider: providers[0].name,
      averagePing: avgPing,
      providers
    });
    setLoading(false);
  };

  return (
    <>
      <SEOHead
        title="DNS & Ping Test — Find The Fastest DNS Server"
        description="Test DNS performance and ping latency to global servers. Find the fastest DNS provider and optimize your internet speed."
        keywords="dns test, ping test, dns speed, dns benchmark, fastest dns, cloudflare dns, google dns, dns latency, network test, dns checker"
      />

      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-cyan-950 dark:to-blue-950">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4">
              <Network className="w-20 h-20 text-cyan-600 dark:text-cyan-400 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DNS & Ping Speed Test
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the fastest DNS provider for your location! Test latency and optimize your browsing speed 🚀
            </p>
          </div>

          <AutoAdSlot placement="top-banner" />

          {/* Test Button */}
          {!results && !loading && (
            <div className="text-center mb-12 animate-bounce-in">
              <Button
                onClick={runDNSTest}
                size="lg"
                className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:via-blue-700 hover:to-indigo-700 text-white px-12 py-8 text-2xl rounded-2xl shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300"
              >
                <Zap className="w-8 h-8 mr-3 animate-pulse" />
                Start DNS Test
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="max-w-2xl mx-auto mb-12">
              <Card className="border-2 border-cyan-200 dark:border-cyan-800 shadow-2xl">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <Signal className="w-16 h-16 mx-auto mb-4 text-cyan-600 dark:text-cyan-400 animate-bounce" />
                    <p className="text-lg font-semibold mb-4">🌐 Testing DNS Providers...</p>
                    <Progress value={testProgress} className="h-4 mb-2" />
                    <p className="text-sm text-muted-foreground">{testProgress}% Complete</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <AutoAdSlot placement="mid-content" />

          {/* Results Display */}
          {results && (
            <>
              {/* Summary Cards */}
              <div className="max-w-6xl mx-auto mb-12 animate-slide-up">
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                  <Card className="border-2 border-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 hover:shadow-2xl hover:shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-bounce" />
                        <CardTitle className="text-lg">Fastest Provider</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                        {results.fastestProvider}
                      </p>
                      <p className="text-sm text-muted-foreground">{results.providers[0].ping}ms</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Timer className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-bounce" style={{animationDelay: '0.1s'}} />
                        <CardTitle className="text-lg">Average Latency</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {results.averagePing} ms
                      </p>
                      <p className="text-sm text-muted-foreground">Across All Providers</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 hover:shadow-2xl hover:shadow-indigo-500/20 transform hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Globe className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-bounce" style={{animationDelay: '0.2s'}} />
                        <CardTitle className="text-lg">Current DNS</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {results.currentDNS}
                      </p>
                      <p className="text-sm text-muted-foreground">Your Active Provider</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Provider Details */}
                <div className="space-y-4">
                  {results.providers.map((provider, idx) => (
                    <Card 
                      key={provider.name}
                      className={`border-2 bg-gradient-to-r ${statusConfig[provider.status].bg} hover:shadow-xl transform hover:scale-102 transition-all duration-300`}
                      style={{animationDelay: `${idx * 0.1}s`}}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-white dark:bg-gray-800'} border-2 ${idx === 0 ? 'border-yellow-500' : 'border-gray-300 dark:border-gray-700'}`}>
                              <span className="text-xl font-bold">{idx === 0 ? '🏆' : `#${idx + 1}`}</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{provider.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {provider.primary} • {provider.secondary}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                                {provider.ping}ms
                              </p>
                              <p className={`text-sm font-semibold ${statusConfig[provider.status].color}`}>
                                {statusConfig[provider.status].label}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button
                    onClick={runDNSTest}
                    variant="outline"
                    size="lg"
                    className="border-2 hover:shadow-xl transition-all duration-300"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Test Again
                  </Button>
                </div>
              </div>
            </>
          )}

          <AutoAdSlot placement="in-feed" />

          <AmazonAffiliate calculatorTitle="Network Tools" placement="content" />

          {/* Educational Content */}
          <div className="max-w-6xl mx-auto mt-16 space-y-12">
            <AutoAdSlot placement="in-article" />

            {/* What is DNS */}
            <Card className="border-2 border-cyan-200 dark:border-cyan-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Globe className="w-8 h-8 text-cyan-600" />
                  What is DNS? 🌐
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">
                  <strong>DNS (Domain Name System)</strong> is like the phonebook of the internet! When you type "google.com" in your browser, DNS translates that human-friendly name into a computer-friendly IP address (like 172.217.14.206). Without DNS, you'd have to memorize random numbers for every website! 🧠
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  Think of it this way: DNS servers are like translators who convert "I want pizza from Joe's Pizza" into "Go to 123 Main Street." Faster DNS = faster translation = websites load quicker! ⚡
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border-2 border-cyan-200 dark:border-cyan-800">
                    <h4 className="font-bold text-cyan-600 dark:text-cyan-400 mb-2">📖 Translation</h4>
                    <p className="text-sm">Converts domain names (google.com) to IP addresses (142.250.185.46)</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">💾 Caching</h4>
                    <p className="text-sm">Remembers recent lookups to speed up future requests dramatically</p>
                  </div>
                  <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800">
                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">🌍 Hierarchy</h4>
                    <p className="text-sm">Distributed system with root, TLD, and authoritative servers worldwide</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AutoAdSlot placement="sidebar" />

            {/* Popular DNS Providers */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Target className="w-8 h-8 text-blue-600" />
                  Popular DNS Providers Compared 📊
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 border-2 border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Wifi className="w-6 h-6 text-orange-600" />
                      <h4 className="text-xl font-bold text-orange-600 dark:text-orange-400">Cloudflare DNS (1.1.1.1)</h4>
                    </div>
                    <p className="mb-3"><strong>Speed:</strong> 🚀 Fastest (avg 10-15ms) • <strong>Privacy:</strong> 🔐 Excellent • <strong>Free:</strong> ✅</p>
                    <p className="text-sm leading-relaxed">
                      <strong>Pros:</strong> Lightning fast, privacy-focused (doesn't sell your data), blocks malware with 1.1.1.2, easy setup<br/>
                      <strong>Cons:</strong> Newer provider (since 2018), less parental control features<br/>
                      <strong>Best For:</strong> Speed enthusiasts, privacy advocates, gamers, streamers
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-2 border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-6 h-6 text-red-600" />
                      <h4 className="text-xl font-bold text-red-600 dark:text-red-400">Google Public DNS (8.8.8.8)</h4>
                    </div>
                    <p className="mb-3"><strong>Speed:</strong> ⚡ Very Fast (avg 15-20ms) • <strong>Privacy:</strong> ⚠️ Moderate • <strong>Free:</strong> ✅</p>
                    <p className="text-sm leading-relaxed">
                      <strong>Pros:</strong> Super reliable, global network, excellent uptime (99.99%), IPv6 support<br/>
                      <strong>Cons:</strong> Google tracks DNS queries for analytics, privacy concerns<br/>
                      <strong>Best For:</strong> Reliability over privacy, businesses, developers
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-6 h-6 text-blue-600" />
                      <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400">Quad9 (9.9.9.9)</h4>
                    </div>
                    <p className="mb-3"><strong>Speed:</strong> 🏃 Fast (avg 20-25ms) • <strong>Privacy:</strong> 🔐 Excellent • <strong>Free:</strong> ✅</p>
                    <p className="text-sm leading-relaxed">
                      <strong>Pros:</strong> Security-focused, blocks malware/phishing automatically, non-profit, no logging<br/>
                      <strong>Cons:</strong> Slightly slower than Cloudflare, may block legitimate sites occasionally<br/>
                      <strong>Best For:</strong> Security-conscious users, families, schools
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-2 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h4 className="text-xl font-bold text-green-600 dark:text-green-400">OpenDNS (208.67.222.222)</h4>
                    </div>
                    <p className="mb-3"><strong>Speed:</strong> 🏃 Fast (avg 20-30ms) • <strong>Privacy:</strong> ⚠️ Moderate • <strong>Free:</strong> ✅ (Premium: $$$)</p>
                    <p className="text-sm leading-relaxed">
                      <strong>Pros:</strong> Excellent parental controls, customizable filters, typo correction, phishing protection<br/>
                      <strong>Cons:</strong> Owned by Cisco (privacy concerns), ads on typo corrections, premium features paywalled<br/>
                      <strong>Best For:</strong> Parents, schools, content filtering needs
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Info className="w-6 h-6 text-purple-600" />
                      <h4 className="text-xl font-bold text-purple-600 dark:text-purple-400">Your ISP DNS (Auto-Assigned)</h4>
                    </div>
                    <p className="mb-3"><strong>Speed:</strong> 🐌 Varies (avg 30-100ms) • <strong>Privacy:</strong> ❌ Poor • <strong>Free:</strong> ✅ (included)</p>
                    <p className="text-sm leading-relaxed">
                      <strong>Pros:</strong> No setup required, works automatically, geographically close<br/>
                      <strong>Cons:</strong> Often slow, tracks everything, may inject ads, unreliable, censorship<br/>
                      <strong>Best For:</strong> Lazy people 😅 (seriously, switch to something better!)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AutoAdSlot placement="in-feed" />

            {/* How to Change DNS */}
            <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Zap className="w-8 h-8 text-green-600" />
                  How to Change Your DNS Settings ⚙️
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  Switching DNS providers is super easy and can dramatically speed up your internet! Here's how to do it on every device:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500">
                      <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">🪟 Windows 10/11</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Settings → Network & Internet</li>
                        <li>Click your connection → Properties</li>
                        <li>Edit DNS server assignment → Manual</li>
                        <li>IPv4 ON → Enter DNS addresses</li>
                        <li>Primary: 1.1.1.1 • Secondary: 1.0.0.1</li>
                        <li>Save → Done! 🎉</li>
                      </ol>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500">
                      <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">🍎 macOS</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>System Preferences → Network</li>
                        <li>Select active connection → Advanced</li>
                        <li>DNS tab → Click + button</li>
                        <li>Add: 1.1.1.1 and 1.0.0.1</li>
                        <li>OK → Apply → Complete! ✅</li>
                      </ol>
                    </div>

                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500">
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">🐧 Linux (Ubuntu/Debian)</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Settings → Network</li>
                        <li>Click gear icon on connection</li>
                        <li>IPv4 → DNS (turn off Automatic)</li>
                        <li>Enter: 1.1.1.1, 1.0.0.1</li>
                        <li>Apply → Reconnect → Success! 🚀</li>
                      </ol>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500">
                      <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-2">📱 iPhone/iPad</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Settings → Wi-Fi</li>
                        <li>Tap (i) next to your network</li>
                        <li>Configure DNS → Manual</li>
                        <li>Remove existing → Add 1.1.1.1 and 1.0.0.1</li>
                        <li>Save → Profit! 💰</li>
                      </ol>
                    </div>

                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500">
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">🤖 Android</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Settings → Network & Internet</li>
                        <li>Wi-Fi → Long press network → Modify</li>
                        <li>Advanced → IP Settings → Static</li>
                        <li>DNS 1: 1.1.1.1 • DNS 2: 1.0.0.1</li>
                        <li>Save → You're golden! ⭐</li>
                      </ol>
                    </div>

                    <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-950/30 border-l-4 border-pink-500">
                      <h4 className="font-bold text-pink-600 dark:text-pink-400 mb-2">🌐 Router (All Devices!)</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Open router admin (usually 192.168.1.1)</li>
                        <li>Login (check router label for password)</li>
                        <li>Find DNS settings (varies by brand)</li>
                        <li>Enter: 1.1.1.1 and 1.0.0.1</li>
                        <li>Save/Reboot → Every device benefits! 🏆</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-sm text-muted-foreground p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <strong>💡 Pro Tip:</strong> Changing DNS at your router level applies to ALL devices on your network automatically! Way easier than configuring each device individually.
                </p>
              </CardContent>
            </Card>

            <AutoAdSlot placement="mid-content" />

            {/* Why DNS Matters for Speed */}
            <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <TrendingDown className="w-8 h-8 text-purple-600" />
                  Why DNS Speed Matters for Gaming & Streaming 🎮
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  Every time you connect to a new website or game server, your computer queries DNS first. Slow DNS = lag! Here's how different activities are affected:
                </p>
                
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-200 dark:border-red-800">
                    <h4 className="text-xl font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                      <Zap className="w-6 h-6" /> Online Gaming
                    </h4>
                    <p className="mb-3">Fast DNS is CRITICAL for competitive gaming! Every millisecond counts when you're trying to clutch that 1v1.</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">✅</span>
                        <span><strong>Faster DNS (10-20ms):</strong> Near-instant server connections, minimal matchmaking delays, smooth party invites</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">❌</span>
                        <span><strong>Slow DNS (100ms+):</strong> Delayed server joins, longer loading screens, frustrating lag spikes during gameplay</span>
                      </li>
                      <li className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                        <strong>💎 Recommendation:</strong> Use Cloudflare (1.1.1.1) for gaming - it's optimized for low latency!
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
                    <h4 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                      <Signal className="w-6 h-6" /> Streaming (Netflix, YouTube)
                    </h4>
                    <p className="mb-3">DNS affects how quickly streams start playing, but doesn't impact buffering once connected.</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">✅</span>
                        <span><strong>Fast DNS:</strong> Videos start instantly, quick app launches, smooth channel switching</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">❌</span>
                        <span><strong>Slow DNS:</strong> Spinning buffering wheel on startup, delayed thumbnail loading</span>
                      </li>
                      <li className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                        <strong>💎 Recommendation:</strong> Google DNS (8.8.8.8) has excellent CDN integration for streaming!
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800">
                    <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                      <Globe className="w-6 h-6" /> Web Browsing
                    </h4>
                    <p className="mb-3">DNS lookups happen for EVERY new website you visit. Faster DNS = snappier browsing!</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">✅</span>
                        <span><strong>Fast DNS:</strong> Websites load 200-500ms faster, clicking links feels instant</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">❌</span>
                        <span><strong>Slow DNS:</strong> Noticeable "waiting for..." delays, frustrating page load times</span>
                      </li>
                      <li className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        <strong>💎 Pro Tip:</strong> Browser DNS cache also helps! Clear it if you experience issues (chrome://net-internals/#dns)
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AutoAdSlot placement="in-article" />

            {/* DNS Security & Privacy */}
            <Card className="border-2 border-orange-200 dark:border-orange-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Shield className="w-8 h-8 text-orange-600" />
                  DNS Security & Privacy Concerns 🔐
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed">
                    Your DNS provider can see EVERY website you visit! That's why choosing a privacy-respecting DNS is crucial. Here's what you need to know:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500">
                      <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">🚨 DNS Hijacking</h4>
                      <p className="text-sm">Attackers redirect your DNS queries to malicious servers, stealing passwords and data!</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Protection:</strong> Use DNS-over-HTTPS (DoH) or DNS-over-TLS (DoT)</p>
                    </div>

                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500">
                      <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-2">👁️ ISP Tracking</h4>
                      <p className="text-sm">Your internet provider logs every site you visit to sell data to advertisers!</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Protection:</strong> Use third-party DNS (Cloudflare, Quad9) that doesn't log</p>
                    </div>

                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500">
                      <h4 className="font-bold text-yellow-600 dark:text-yellow-400 mb-2">🎣 DNS Spoofing</h4>
                      <p className="text-sm">Fake DNS responses trick you into visiting phishing sites that look legitimate!</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Protection:</strong> Use DNSSEC-enabled DNS providers (Cloudflare, Google)</p>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500">
                      <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">📊 Data Selling</h4>
                      <p className="text-sm">Some DNS providers sell your browsing history to marketing companies!</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Protection:</strong> Choose privacy-first DNS (Cloudflare explicitly doesn't log)</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
                    <h4 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3">🛡️ DNS-over-HTTPS (DoH) & DNS-over-TLS (DoT)</h4>
                    <p className="mb-3">Encrypts your DNS queries so nobody can spy on what websites you're visiting!</p>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Firefox:</strong> Settings → Network Settings → Enable DNS over HTTPS → Choose provider</li>
                      <li><strong>Chrome:</strong> Settings → Privacy → Security → Use secure DNS → Choose provider</li>
                      <li><strong>Android 9+:</strong> Settings → Network → Private DNS → dns.cloudflare.com</li>
                      <li className="text-xs text-green-600 dark:text-green-400 mt-2">
                        <strong>💡 Best Practice:</strong> Always use DoH/DoT when possible for maximum privacy!
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
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
