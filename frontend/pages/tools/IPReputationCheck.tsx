import { useState, useEffect } from 'react';
import { Shield, MapPin, Server, AlertTriangle, CheckCircle, Info, Globe, Lock, Eye, Zap, Target, Award, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AutoAdSlot from '@/components/ads/AutoAdSlot';
import { ADS_CONFIG } from '@/config/ads';
import { SEOHead } from '@/components/SEOHead';
import AmazonAffiliate from '@/components/ads/AmazonAffiliate';

interface IPReputationData {
  ip: string;
  city: string;
  region: string;
  countryName: string;
  org: string;
  isp: string;
  isVPN: boolean;
  isProxy: boolean;
  isTor: boolean;
  riskScore: number;
  blacklisted: boolean;
  isDatacenter: boolean;
  threatLevel: 'low' | 'medium' | 'high';
}

const threatConfig = {
  low: {
    label: '✅ Trusted',
    color: 'text-green-600 dark:text-green-400',
    bg: 'from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-100 dark:border-green-900/50'
  },
  medium: {
    label: '⚠️ Moderate Risk',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 border-yellow-100 dark:border-yellow-900/50'
  },
  high: {
    label: '🚨 High Risk',
    color: 'text-red-600 dark:text-red-400',
    bg: 'from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 border-red-100 dark:border-red-900/50'
  }
};

export default function IPReputationCheck() {
  const [data, setData] = useState<IPReputationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIPReputation = async () => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock data
    const mockData: IPReputationData = {
      ip: '203.0.113.' + Math.floor(Math.random() * 255),
      city: 'San Francisco',
      region: 'California',
      countryName: 'United States',
      org: 'Example ISP Inc.',
      isp: 'Example Broadband',
      isVPN: Math.random() > 0.7,
      isProxy: Math.random() > 0.8,
      isTor: Math.random() > 0.95,
      riskScore: Math.floor(Math.random() * 100),
      blacklisted: Math.random() > 0.9,
      isDatacenter: Math.random() > 0.7,
      threatLevel: 'low'
    };

    if (mockData.riskScore > 70 || mockData.isTor) mockData.threatLevel = 'high';
    else if (mockData.riskScore > 40 || mockData.isVPN) mockData.threatLevel = 'medium';

    setData(mockData);
    setLoading(false);
  };

  useEffect(() => {
    fetchIPReputation();
  }, []);

  return (
    <>
      <SEOHead
        title="IP Reputation & VPN Detection — Check If Your IP Is Blacklisted"
        description="Find out if your IP is on spam or VPN lists. Instantly check IP reputation, risk score, and ISP details."
        keywords="ip reputation, vpn detection, proxy detection, ip blacklist, spam check, ip risk score, tor detection, ip security, blacklist check, ip trust score"
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4">
              <Shield className="w-20 h-20 text-purple-600 dark:text-purple-400 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              IP Reputation & VPN Detector
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover your IP's reputation score, detect VPNs & proxies, and check if you're blacklisted! 🔐
            </p>
          </div>

          {/* Ad 1: Top Banner */}
          <div className="max-w-4xl mx-auto mb-8">
            <AutoAdSlot placement="top-banner" />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="max-w-2xl mx-auto mb-12">
              <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-2xl animate-pulse-slow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-purple-600 dark:text-purple-400 animate-spin-slow" />
                    <p className="text-lg font-semibold">🔍 Analyzing your IP address...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Display */}
          {data && !loading && (
            <>
              {/* Main IP Display */}
              <div className="max-w-4xl mx-auto mb-12 animate-slide-up">
                <Card className="border-4 border-purple-300 dark:border-purple-700 shadow-2xl bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/50">
                  <CardContent className="pt-8 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Your IP Address</p>
                    <p className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-4 font-mono tracking-wider">
                      {data.ip}
                    </p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-300 dark:border-purple-700">
                      <span className={`text-2xl font-bold ${threatConfig[data.threatLevel].color}`}>
                        {threatConfig[data.threatLevel].label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Details Grid */}
              <div className="max-w-6xl mx-auto mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
                  <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-bounce" />
                        <CardTitle className="text-lg">Location</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {data.city}, {data.region}
                      </p>
                      <p className="text-sm text-muted-foreground">{data.countryName}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Server className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-bounce" style={{animationDelay: '0.1s'}} />
                        <CardTitle className="text-lg">ISP / Organization</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {data.org || data.isp}
                      </p>
                      <p className="text-sm text-muted-foreground">Internet Service Provider</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/50 dark:to-teal-950/50 hover:shadow-2xl hover:shadow-green-500/20 transform hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Eye className="w-8 h-8 text-green-600 dark:text-green-400 animate-bounce" style={{animationDelay: '0.2s'}} />
                        <CardTitle className="text-lg">VPN / Proxy Status</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {data.isVPN ? (
                          <p className="text-lg font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> VPN Detected
                          </p>
                        ) : (
                          <p className="text-lg font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" /> No VPN
                          </p>
                        )}
                        {data.isProxy && (
                          <p className="text-sm text-orange-600 dark:text-orange-400">⚠️ Proxy Detected</p>
                        )}
                        {data.isTor && (
                          <p className="text-sm text-red-600 dark:text-red-400">🚨 Tor Network</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`border-2 bg-gradient-to-br ${threatConfig[data.threatLevel].bg} hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Target className="w-8 h-8 animate-bounce" style={{animationDelay: '0.3s'}} />
                        <CardTitle className="text-lg">Risk Assessment</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Risk Score</span>
                            <span className="text-2xl font-bold">{data.riskScore}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-1000 ${
                                data.riskScore < 30 ? 'bg-green-500' :
                                data.riskScore < 70 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${data.riskScore}%` }}
                            />
                          </div>
                        </div>
                        {data.blacklisted && (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" /> Potentially Blacklisted
                          </p>
                        )}
                        {data.isDatacenter && (
                          <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                            <Server className="w-4 h-4" /> Datacenter IP
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Button
                    onClick={fetchIPReputation}
                    variant="outline"
                    size="lg"
                    className="border-2 hover:shadow-xl transition-all duration-300"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Refresh Check
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Ad 2: After results */}
          <div className="max-w-4xl mx-auto my-8">
            <AutoAdSlot placement="mid-content" />
          </div>

          {/* Educational Content */}
          <div className="max-w-6xl mx-auto mt-16 space-y-12">
            {/* What is IP Reputation */}
            <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Info className="w-8 h-8 text-purple-600" />
                  What is IP Reputation? 🤔
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">
                  Your <strong>IP address</strong> (Internet Protocol address) is like your home address on the internet. Every device connected to the internet has one! But did you know your IP can have a "reputation"? 🏠
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  <strong>IP reputation</strong> is a trust score based on your IP's history. Websites and services use it to decide if you're a legitimate user or potential threat. Think of it like a credit score, but for your internet connection!
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Good Reputation
                    </h4>
                    <p className="text-sm">Clean history, residential IP, no spam or abuse - websites trust you! ✅</p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-bold text-yellow-600 dark:text-yellow-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> Moderate Risk
                    </h4>
                    <p className="text-sm">VPN/proxy use, datacenter IP, or shared hosting - sometimes flagged ⚠️</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800">
                    <h4 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> High Risk
                    </h4>
                    <p className="text-sm">Blacklisted, Tor network, spam history, or malware activity - blocked! 🚫</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad 3: After first section */}
            <div className="my-8">
              <AutoAdSlot placement="in-feed" />
            </div>

            {/* VPN & Proxy Detection */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Lock className="w-8 h-8 text-blue-600" />
                  VPN & Proxy Detection Explained 🔐
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  VPNs and proxies mask your real IP address. While they're great for privacy, some websites block them to prevent fraud or region restrictions. Here's what you need to know:
                </p>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800">
                    <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                      <Shield className="w-6 h-6" /> What is a VPN?
                    </h4>
                    <p className="mb-3"><strong>Virtual Private Network</strong> - Creates an encrypted tunnel between you and the internet. Your traffic appears to come from the VPN server, not your real location! 🌐</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 rounded bg-green-50 dark:bg-green-950/30">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">✅ Pros:</p>
                        <ul className="text-xs space-y-1 text-green-600 dark:text-green-400">
                          <li>• Privacy & anonymity</li>
                          <li>• Bypass geo-blocks</li>
                          <li>• Secure public Wi-Fi</li>
                          <li>• Hide from ISP tracking</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded bg-red-50 dark:bg-red-950/30">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">❌ Cons:</p>
                        <ul className="text-xs space-y-1 text-red-600 dark:text-red-400">
                          <li>• Slower speeds</li>
                          <li>• Blocked by Netflix, banking</li>
                          <li>• CAPTCHAs everywhere</li>
                          <li>• Bad reputation IPs</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
                    <h4 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                      <Server className="w-6 h-6" /> What is a Proxy?
                    </h4>
                    <p className="mb-3"><strong>Intermediary Server</strong> - Routes your traffic through another server. Similar to VPN but usually less secure and no encryption! 🔄</p>
                    <div className="space-y-2">
                      <p className="text-sm"><strong className="text-purple-600 dark:text-purple-400">HTTP Proxy:</strong> Only for web browsing (not encrypted)</p>
                      <p className="text-sm"><strong className="text-purple-600 dark:text-purple-400">SOCKS Proxy:</strong> Works for all traffic but still no encryption</p>
                      <p className="text-sm"><strong className="text-purple-600 dark:text-purple-400">Transparent Proxy:</strong> Used by ISPs and workplaces (you might not even know!)</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-200 dark:border-red-800">
                    <h4 className="text-xl font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6" /> What is Tor Network?
                    </h4>
                    <p className="mb-3"><strong>The Onion Router</strong> - Routes traffic through multiple encrypted layers for maximum anonymity. Used by journalists, activists, and privacy advocates! 🧅</p>
                    <p className="text-sm text-red-600 dark:text-red-400"><strong>⚠️ Warning:</strong> Most websites block Tor completely due to abuse history. Expect CAPTCHAs and access denials!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amazon Affiliate: VPN/Security */}
            <div className="my-8">
              <AmazonAffiliate calculatorTitle="VPN Security Tools" placement="content" />
            </div>

            {/* Ad 4: Mid-content */}
            <div className="my-8">
              <AutoAdSlot placement="in-article" />
            </div>

            {/* Why Websites Block IPs */}
            <Card className="border-2 border-orange-200 dark:border-orange-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                  Why Do Websites Block Certain IPs? 🚫
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  Ever wondered why you get CAPTCHAs or "access denied" errors? Here's why websites are suspicious of certain IPs:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500">
                      <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">🤖 Bot & Scraper Protection</h4>
                      <p className="text-sm">Datacenter IPs and VPNs are often used by bots to scrape data, create fake accounts, or DDoS attack websites.</p>
                      <p className="text-xs text-muted-foreground mt-2">Example: Ticket scalpers using bots to buy concert tickets</p>
                    </div>

                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500">
                      <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-2">💳 Fraud Prevention</h4>
                      <p className="text-sm">Banks and payment processors block VPNs to prevent credit card fraud, money laundering, and identity theft.</p>
                      <p className="text-xs text-muted-foreground mt-2">Example: PayPal blocking transactions from known VPN IPs</p>
                    </div>

                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500">
                      <h4 className="font-bold text-yellow-600 dark:text-yellow-400 mb-2">🌍 Geo-Restrictions</h4>
                      <p className="text-sm">Streaming services block VPNs to enforce content licensing agreements and regional restrictions.</p>
                      <p className="text-xs text-muted-foreground mt-2">Example: Netflix detecting and blocking VPN users</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500">
                      <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">📧 Spam Prevention</h4>
                      <p className="text-sm">Email providers block IPs with spam history to protect users from phishing, scams, and junk mail.</p>
                      <p className="text-xs text-muted-foreground mt-2">Example: Gmail rejecting emails from blacklisted IPs</p>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500">
                      <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">🎮 Gaming & Betting</h4>
                      <p className="text-sm">Online games and betting sites block VPNs to prevent cheating, multi-accounting, and jurisdiction violations.</p>
                      <p className="text-xs text-muted-foreground mt-2">Example: Fortnite banning players using VPNs to smurf</p>
                    </div>

                    <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-950/30 border-l-4 border-pink-500">
                      <h4 className="font-bold text-pink-600 dark:text-pink-400 mb-2">🛡️ Security Threats</h4>
                      <p className="text-sm">IPs associated with malware, hacking, or DDoS attacks get permanently blacklisted for everyone's safety.</p>
                      <p className="text-xs text-muted-foreground mt-2">Example: Tor exit nodes blocked due to abuse history</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad 5: Sidebar style */}
            <div className="my-8">
              <AutoAdSlot placement="sidebar" />
            </div>

            {/* How to Improve IP Reputation */}
            <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Award className="w-8 h-8 text-green-600" />
                  How to Improve Your IP Reputation 🌟
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed mb-6">
                    Got a bad IP reputation? Here's how to fix it and avoid future problems:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                      <span className="text-3xl">1️⃣</span>
                      <div>
                        <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Use Residential IP</h4>
                        <p className="text-sm text-muted-foreground">Your home ISP IP has the best reputation. Avoid cheap VPNs and shared hosting!</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                      <span className="text-3xl">2️⃣</span>
                      <div>
                        <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Request IP Change</h4>
                        <p className="text-sm text-muted-foreground">Contact your ISP for a new IP if yours is blacklisted (usually free!)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                      <span className="text-3xl">3️⃣</span>
                      <div>
                        <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Remove from Blacklists</h4>
                        <p className="text-sm text-muted-foreground">Submit delisting requests to Spamhaus, SORBS, and other RBL databases</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                      <span className="text-3xl">4️⃣</span>
                      <div>
                        <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Use Premium VPN</h4>
                        <p className="text-sm text-muted-foreground">NordVPN, ExpressVPN have dedicated IPs with better reputation than free VPNs</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                      <span className="text-3xl">5️⃣</span>
                      <div>
                        <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Scan for Malware</h4>
                        <p className="text-sm text-muted-foreground">Your device might be infected! Run Malwarebytes and check for botnet activity</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                      <span className="text-3xl">6️⃣</span>
                      <div>
                        <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Secure Your Network</h4>
                        <p className="text-sm text-muted-foreground">Change router password, enable WPA3, prevent others from using your IP for spam</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                      <span className="text-3xl">7️⃣</span>
                      <div>
                        <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Wait It Out</h4>
                        <p className="text-sm text-muted-foreground">Most blacklists auto-expire after 30-90 days of clean behavior</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                      <span className="text-3xl">8️⃣</span>
                      <div>
                        <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Monitor Regularly</h4>
                        <p className="text-sm text-muted-foreground">Check your IP reputation monthly to catch problems early!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Blacklist Databases */}
            <Card className="border-2 border-pink-200 dark:border-pink-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Server className="w-8 h-8 text-pink-600" />
                  Popular IP Blacklist Databases 📚
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border-2 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors">
                    <h4 className="font-bold text-pink-600 dark:text-pink-400 mb-2">🛡️ Spamhaus</h4>
                    <p className="text-sm text-muted-foreground mb-2">Most trusted anti-spam blacklist. Used by Gmail, Outlook, and major ISPs worldwide.</p>
                    <p className="text-xs"><strong>Check:</strong> spamhaus.org</p>
                  </div>
                  <div className="p-4 rounded-lg border-2 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors">
                    <h4 className="font-bold text-pink-600 dark:text-pink-400 mb-2">📧 SORBS</h4>
                    <p className="text-sm text-muted-foreground mb-2">Spam and Open Relay Blocking System. Tracks spam sources and open proxies.</p>
                    <p className="text-xs"><strong>Check:</strong> sorbs.net</p>
                  </div>
                  <div className="p-4 rounded-lg border-2 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors">
                    <h4 className="font-bold text-pink-600 dark:text-pink-400 mb-2">🔍 Project Honey Pot</h4>
                    <p className="text-sm text-muted-foreground mb-2">Tracks email harvesters, comment spammers, and malicious bots.</p>
                    <p className="text-xs"><strong>Check:</strong> projecthoneypot.org</p>
                  </div>
                  <div className="p-4 rounded-lg border-2 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors">
                    <h4 className="font-bold text-pink-600 dark:text-pink-400 mb-2">🌐 AbuseIPDB</h4>
                    <p className="text-sm text-muted-foreground mb-2">Crowdsourced IP abuse reports. Community-driven blacklist database.</p>
                    <p className="text-xs"><strong>Check:</strong> abuseipdb.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  );
}
