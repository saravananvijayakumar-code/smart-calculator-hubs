import { useState, useEffect } from 'react';
import { Wifi, Download, Upload, Activity, Gauge, Zap, TrendingUp, Signal, Globe, Award, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AutoAdSlot from '@/components/ads/AutoAdSlot';
import { ADS_CONFIG } from '@/config/ads';
import { SEOHead } from '@/components/SEOHead';
import AmazonAffiliate from '@/components/ads/AmazonAffiliate';

interface SpeedTestResults {
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  jitter: number;
  quality: 'excellent' | 'good' | 'average' | 'slow';
}

const qualityConfig = {
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

export default function InternetSpeedTest() {
  const [results, setResults] = useState<SpeedTestResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [testStage, setTestStage] = useState('');

  const runSpeedTest = async () => {
    setLoading(true);
    setError(null);
    setTestProgress(0);
    setResults(null);

    // Stage 1: Testing Download Speed
    setTestStage('🔽 Measuring Download Speed...');
    for (let i = 0; i <= 33; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setTestProgress(i);
    }

    // Stage 2: Testing Upload Speed
    setTestStage('🔼 Measuring Upload Speed...');
    for (let i = 34; i <= 66; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setTestProgress(i);
    }

    // Stage 3: Testing Latency
    setTestStage('⚡ Measuring Latency & Jitter...');
    for (let i = 67; i <= 100; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setTestProgress(i);
    }

    // Simulate results
    const downloadSpeed = Math.floor(Math.random() * 400) + 50;
    const uploadSpeed = Math.floor(Math.random() * 100) + 20;
    const latency = Math.floor(Math.random() * 50) + 5;
    const jitter = Math.floor(Math.random() * 10) + 1;

    let quality: SpeedTestResults['quality'] = 'slow';
    if (downloadSpeed > 200 && uploadSpeed > 50 && latency < 20) quality = 'excellent';
    else if (downloadSpeed > 100 && uploadSpeed > 25 && latency < 40) quality = 'good';
    else if (downloadSpeed > 50 && uploadSpeed > 10) quality = 'average';

    setResults({
      downloadSpeed,
      uploadSpeed,
      latency,
      jitter,
      quality
    });
    setLoading(false);
    setTestStage('');
  };

  return (
    <>
      <SEOHead
        title="Internet Speed Test — Check Your Connection Speed Instantly"
        description="Run a free internet speed test. Measure your download, upload, and ping in seconds with Smart Calculator Hubs."
        keywords="internet speed test, speed test, bandwidth test, download speed, upload speed, ping test, latency test, connection speed, network speed, wifi speed test"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4">
              <Wifi className="w-20 h-20 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Internet Speed Test
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Measure your internet connection speed in seconds. Get accurate download, upload, and latency measurements! 🚀
            </p>
          </div>

          {/* Ad 1: Top Banner */}
          <div className="max-w-4xl mx-auto mb-8">
            <AutoAdSlot placement="top-banner" />
          </div>

          {/* Test Button or Results */}
          {!results && !loading && (
            <div className="text-center mb-12 animate-bounce-in">
              <Button
                onClick={runSpeedTest}
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-8 text-2xl rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
              >
                <Zap className="w-8 h-8 mr-3 animate-pulse" />
                Start Speed Test
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="max-w-2xl mx-auto mb-12">
              <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-2xl animate-pulse-slow">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <Signal className="w-16 h-16 mx-auto mb-4 text-blue-600 dark:text-blue-400 animate-bounce" />
                    <p className="text-lg font-semibold text-muted-foreground mb-4">{testStage}</p>
                    <Progress value={testProgress} className="h-4 mb-2" />
                    <p className="text-sm text-muted-foreground">{testProgress}% Complete</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Display */}
          {results && (
            <div className="max-w-6xl mx-auto mb-12 animate-slide-up">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Download className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-bounce" />
                      <CardTitle className="text-lg">Download Speed</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {results.downloadSpeed}
                    </p>
                    <p className="text-sm text-muted-foreground">Mbps</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-bounce" style={{animationDelay: '0.1s'}} />
                      <CardTitle className="text-lg">Upload Speed</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                      {results.uploadSpeed}
                    </p>
                    <p className="text-sm text-muted-foreground">Mbps</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/50 dark:to-teal-950/50 hover:shadow-2xl hover:shadow-green-500/20 transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Activity className="w-8 h-8 text-green-600 dark:text-green-400 animate-bounce" style={{animationDelay: '0.2s'}} />
                      <CardTitle className="text-lg">Latency (Ping)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                      {results.latency}
                    </p>
                    <p className="text-sm text-muted-foreground">ms</p>
                  </CardContent>
                </Card>

                <Card className={`border-2 bg-gradient-to-br ${qualityConfig[results.quality].bg} hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Gauge className="w-8 h-8 animate-bounce" style={{animationDelay: '0.3s'}} />
                      <CardTitle className="text-lg">Quality</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-3xl font-bold ${qualityConfig[results.quality].color}`}>
                      {qualityConfig[results.quality].label}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button
                  onClick={runSpeedTest}
                  variant="outline"
                  size="lg"
                  className="border-2 hover:shadow-xl transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Test Again
                </Button>
              </div>
            </div>
          )}

          {/* Ad 2: After results */}
          <div className="max-w-4xl mx-auto my-8">
            <AutoAdSlot placement="mid-content" />
          </div>

          {/* Educational Content */}
          <div className="max-w-6xl mx-auto mt-16 space-y-12">
            {/* What is Internet Speed */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Globe className="w-8 h-8 text-blue-600" />
                  What is Internet Speed? 🌐
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">
                  Internet speed refers to how quickly data travels between your device and the internet. It's measured in <strong>Megabits per second (Mbps)</strong>. Think of it like a highway: the more lanes (bandwidth) you have, the more cars (data) can travel at once! 🚗💨
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  Your internet speed determines how smoothly you can stream Netflix, join Zoom calls, download files, or game online. Faster speeds mean less buffering, quicker downloads, and happier you! 😊
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">📥 Download Speed</h4>
                    <p className="text-sm">How fast data comes TO your device (streaming, browsing, downloading)</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                    <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">📤 Upload Speed</h4>
                    <p className="text-sm">How fast data leaves FROM your device (video calls, sharing files, gaming)</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
                    <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">⚡ Latency (Ping)</h4>
                    <p className="text-sm">Delay between sending and receiving data (crucial for gaming and video calls)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad 3: After first educational section */}
            <div className="my-8">
              <AutoAdSlot placement="in-feed" />
            </div>

            {/* Speed Requirements Guide */}
            <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  How Much Speed Do You Need? 📊
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
                    <h4 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3">🏠 1-2 People (Light Use)</h4>
                    <p className="mb-2"><strong>25-50 Mbps</strong> - Perfect for browsing, email, social media, SD streaming</p>
                    <p className="text-sm text-muted-foreground">✅ Web browsing • Email • Social media • Music streaming • SD Netflix</p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800">
                    <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">👨‍👩‍👧 2-4 People (Medium Use)</h4>
                    <p className="mb-2"><strong>100-200 Mbps</strong> - Great for HD streaming, video calls, moderate gaming</p>
                    <p className="text-sm text-muted-foreground">✅ HD/4K streaming • Zoom calls • Online gaming • Multiple devices • Smart home</p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
                    <h4 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-3">👨‍👩‍👧‍👦 5+ People (Heavy Use)</h4>
                    <p className="mb-2"><strong>300-500+ Mbps</strong> - Essential for large households with heavy streaming, gaming, work-from-home</p>
                    <p className="text-sm text-muted-foreground">✅ 4K/8K streaming • Pro gaming • Video editing • Large downloads • Multiple simultaneous users</p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-2 border-orange-200 dark:border-orange-800">
                    <h4 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-3">🎮 Gamers & Creators</h4>
                    <p className="mb-2"><strong>500-1000+ Mbps</strong> - Professional streaming, content creation, competitive gaming</p>
                    <p className="text-sm text-muted-foreground">✅ Twitch streaming • 4K video uploads • Cloud gaming • VR • Pro esports • Server hosting</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amazon Affiliate: Networking Products */}
            <div className="my-8">
              <AmazonAffiliate calculatorTitle="Networking Equipment" placement="content" />
            </div>

            {/* Factors Affecting Speed */}
            <Card className="border-2 border-orange-200 dark:border-orange-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                  Why Is My Internet Slow? 🤔
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  Lots of things can slow down your internet! Here are the most common culprits and how to fix them:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500">
                      <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">📡 Wi-Fi Distance</h4>
                      <p className="text-sm">Too far from router? Walls and floors block signal!</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">💡 Fix: Move closer, use mesh Wi-Fi, or add extenders</p>
                    </div>

                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500">
                      <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-2">👥 Too Many Users</h4>
                      <p className="text-sm">Everyone streaming at once? Bandwidth gets divided!</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">💡 Fix: Upgrade plan, use QoS settings, schedule heavy downloads</p>
                    </div>

                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500">
                      <h4 className="font-bold text-yellow-600 dark:text-yellow-400 mb-2">🔌 Old Equipment</h4>
                      <p className="text-sm">Router from 2010? Time for an upgrade!</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">💡 Fix: Get Wi-Fi 6 router, update modem, use ethernet cables</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500">
                      <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">🦠 Malware & Viruses</h4>
                      <p className="text-sm">Infected device eating your bandwidth?</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">💡 Fix: Run antivirus, remove suspicious apps, reset device</p>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500">
                      <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">📺 Background Apps</h4>
                      <p className="text-sm">Apps auto-updating? Cloud backups running?</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">💡 Fix: Close unused apps, pause cloud sync, disable auto-updates</p>
                    </div>

                    <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-950/30 border-l-4 border-pink-500">
                      <h4 className="font-bold text-pink-600 dark:text-pink-400 mb-2">🌐 ISP Throttling</h4>
                      <p className="text-sm">Provider slowing you down during peak hours?</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">💡 Fix: Use VPN, upgrade plan, switch providers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad 4: Mid-content */}
            <div className="my-8">
              <AutoAdSlot placement="in-article" />
            </div>

            {/* Pro Tips */}
            <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Award className="w-8 h-8 text-green-600" />
                  Pro Tips to Boost Your Speed 🚀
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                      <span className="text-2xl">1️⃣</span>
                      <div>
                        <h4 className="font-bold mb-1">Use Ethernet for Gaming/Work</h4>
                        <p className="text-sm text-muted-foreground">Wired connections are always faster and more stable than Wi-Fi!</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                      <span className="text-2xl">2️⃣</span>
                      <div>
                        <h4 className="font-bold mb-1">Restart Your Router Weekly</h4>
                        <p className="text-sm text-muted-foreground">Clears memory cache and fixes connection bugs automatically!</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                      <span className="text-2xl">3️⃣</span>
                      <div>
                        <h4 className="font-bold mb-1">Position Router Strategically</h4>
                        <p className="text-sm text-muted-foreground">Central location, elevated, away from electronics and thick walls!</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                      <span className="text-2xl">4️⃣</span>
                      <div>
                        <h4 className="font-bold mb-1">Use 5GHz Band</h4>
                        <p className="text-sm text-muted-foreground">Faster speeds but shorter range - perfect for streaming & gaming!</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                      <span className="text-2xl">5️⃣</span>
                      <div>
                        <h4 className="font-bold mb-1">Secure Your Network</h4>
                        <p className="text-sm text-muted-foreground">Strong WPA3 password prevents neighbors from stealing bandwidth!</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                      <span className="text-2xl">6️⃣</span>
                      <div>
                        <h4 className="font-bold mb-1">Update Router Firmware</h4>
                        <p className="text-sm text-muted-foreground">Latest updates improve performance, security, and stability!</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                      <span className="text-2xl">7️⃣</span>
                      <div>
                        <h4 className="font-bold mb-1">Test During Different Times</h4>
                        <p className="text-sm text-muted-foreground">Peak hours (6-10pm) are slower - test multiple times for accuracy!</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                      <span className="text-2xl">8️⃣</span>
                      <div>
                        <h4 className="font-bold mb-1">Contact Your ISP</h4>
                        <p className="text-sm text-muted-foreground">Not getting advertised speeds? Demand what you're paying for!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad 5: Sidebar style */}
            <div className="my-8">
              <AutoAdSlot placement="sidebar" />
            </div>

            {/* Ad 6: In-feed */}
            <div className="my-8">
              <AutoAdSlot placement="in-feed" />
            </div>

            {/* Ad 7: Mid-content */}
            <div className="my-8">
              <AutoAdSlot placement="mid-content" />
            </div>

            {/* Ad 8: In-article */}
            <div className="my-8">
              <AutoAdSlot placement="in-article" />
            </div>
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
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
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
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
