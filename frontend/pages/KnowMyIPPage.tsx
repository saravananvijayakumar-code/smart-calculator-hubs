import { useState, useEffect } from 'react';
import { Globe, MapPin, Wifi, Copy, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';
import { AffiliateBanner } from '@/components/AffiliateBanner';
import { useToast } from '@/components/ui/use-toast';
import EnhancedAIAnalysis from '@/components/EnhancedAIAnalysis';
import { ADS_CONFIG } from '@/config/ads';
import NativeBanner from '@/components/ads/NativeBanner';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface IPData {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_name?: string;
  org?: string;
  version?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  postal?: string;
}

export default function KnowMyIPPage() {
  const [ipData, setIpData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const fetchIPData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://ipapi.co/json/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch IP data from primary source');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'API error');
      }

      setIpData(data);
    } catch (err) {
      console.error('Primary API failed, trying fallback:', err);
      
      try {
        const fallbackResponse = await fetch('https://api.ipify.org?format=json');
        
        if (!fallbackResponse.ok) {
          throw new Error('Fallback API also failed');
        }

        const fallbackData = await fallbackResponse.json();
        setIpData({ 
          ip: fallbackData.ip,
          version: fallbackData.ip.includes(':') ? 'IPv6' : 'IPv4'
        });
      } catch (fallbackErr) {
        console.error('All API attempts failed:', fallbackErr);
        setError('Unable to fetch IP information. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle && ADS_CONFIG.AUTO_ADS.ENABLED) {
      try {
        const adElements = document.querySelectorAll('.adsbygoogle');
        adElements.forEach(() => {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        });
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [ipData]);

  const copyToClipboard = async () => {
    if (!ipData?.ip) return;

    try {
      await navigator.clipboard.writeText(ipData.ip);
      setCopied(true);
      toast({
        title: "IP Address Copied!",
        description: "Your IP address has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getIPVersion = () => {
    if (!ipData?.ip) return 'Unknown';
    return ipData.ip.includes(':') ? 'IPv6' : 'IPv4';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      <SEOHead
        title="Know My IP Address — Instantly Check Your Public IP, Location & ISP"
        description="Find your public IP address instantly with Smart Calculator Hubs. See your location, ISP, and IP type, plus learn how IP addresses work in our expert guide."
        keywords="IP address, what is my IP, public IP, IP lookup, IP location, ISP lookup, IPv4, IPv6, IP geolocation, check my IP"
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
              <Globe className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Know Your IP Address
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Instantly discover your public IP address, location, and internet service provider
            </p>
          </div>

          <Card className="mb-8 p-6 md:p-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border-2 border-white/20 dark:border-gray-700/20 animate-slide-up">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 md:py-20">
                <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-blue-600 mb-4" />
                <p className="text-muted-foreground text-sm md:text-base">Detecting your IP address...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 md:py-20">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                </div>
                <p className="text-red-600 dark:text-red-400 mb-4 text-center text-sm md:text-base">{error}</p>
                <Button onClick={fetchIPData} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            ) : ipData ? (
              <div className="space-y-6 md:space-y-8">
                <div className="text-center border-b pb-6 md:pb-8">
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 uppercase tracking-wider font-semibold">
                    Your Public IP Address
                  </p>
                  <div className="flex items-center justify-center gap-3 md:gap-4 mb-4">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                      {ipData.ip}
                    </h2>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 md:h-12 md:w-12 rounded-full hover:scale-110 transition-transform"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 md:w-6 md:h-6" />
                      )}
                    </Button>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs md:text-sm font-semibold text-blue-900 dark:text-blue-100">
                      {getIPVersion()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {ipData.city && ipData.region && (
                    <div className="group p-4 md:p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-100 dark:border-blue-900/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="p-2 md:p-3 rounded-lg bg-blue-600 group-hover:scale-110 transition-transform">
                          <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm text-muted-foreground mb-1 font-semibold">Location</p>
                          <p className="text-base md:text-lg font-bold text-foreground truncate">
                            {ipData.city}, {ipData.region}
                          </p>
                          {ipData.country_name && (
                            <p className="text-xs md:text-sm text-muted-foreground mt-1">
                              {ipData.country_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {ipData.org && (
                    <div className="group p-4 md:p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-100 dark:border-purple-900/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="p-2 md:p-3 rounded-lg bg-purple-600 group-hover:scale-110 transition-transform">
                          <Wifi className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm text-muted-foreground mb-1 font-semibold">ISP</p>
                          <p className="text-base md:text-lg font-bold text-foreground break-words">
                            {ipData.org}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {ipData.timezone && (
                    <div className="group p-4 md:p-6 rounded-xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/50 dark:to-teal-950/50 border border-green-100 dark:border-green-900/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="p-2 md:p-3 rounded-lg bg-green-600 group-hover:scale-110 transition-transform">
                          <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm text-muted-foreground mb-1 font-semibold">Timezone</p>
                          <p className="text-base md:text-lg font-bold text-foreground">
                            {ipData.timezone}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {ipData.postal && (
                    <div className="group p-4 md:p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 border border-orange-100 dark:border-orange-900/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="p-2 md:p-3 rounded-lg bg-orange-600 group-hover:scale-110 transition-transform">
                          <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm text-muted-foreground mb-1 font-semibold">Postal Code</p>
                          <p className="text-base md:text-lg font-bold text-foreground">
                            {ipData.postal}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    onClick={fetchIPData}
                    variant="outline"
                    className="gap-2 hover:scale-105 transition-transform"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh IP Information
                  </Button>
                </div>
              </div>
            ) : null}
          </Card>

          {ipData && (
            <div className="mb-12">
              <EnhancedAIAnalysis
                calculatorType="ip-lookup"
                data={{
                  ip: ipData.ip,
                  location: ipData.city && ipData.region ? `${ipData.city}, ${ipData.region}` : undefined,
                  isp: ipData.org,
                  ipVersion: getIPVersion()
                }}
              />
            </div>
          )}

          <div className="mb-8">
            <NativeBanner position="middle" />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-xl border border-gray-200 dark:border-gray-800">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🌐 Complete Guide to IP Addresses: Everything You Need to Know
              </h2>

              <section className="mb-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">1</span>
                  What is an IP Address?
                </h3>
                <div className="space-y-4 text-base md:text-lg leading-relaxed">
                  <p>
                    An <strong>IP address</strong> (Internet Protocol address) is a unique numerical identifier assigned to every device connected to the internet or a local network. Think of it as your device's digital home address—it allows computers, smartphones, servers, and IoT devices to find and communicate with each other across the vast internet infrastructure.
                  </p>
                  <p>
                    IP addresses serve two primary functions: <strong>host identification</strong> and <strong>location addressing</strong>. When you visit a website, send an email, or stream a video, your IP address tells servers where to send the requested data. Without IP addresses, the internet as we know it simply couldn't function.
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-xl border-l-4 border-blue-600">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Quick Analogy:</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      If the internet is a massive city, your IP address is your street address. Just as the postal service needs your address to deliver mail, internet servers need your IP address to deliver web pages, emails, and other data to your device.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white text-lg">2</span>
                  IPv4 vs IPv6: Understanding the Difference
                </h3>
                <div className="space-y-4 text-base md:text-lg leading-relaxed">
                  <p>
                    There are two versions of IP addresses currently in use: <strong>IPv4</strong> and <strong>IPv6</strong>. Understanding the difference between them is crucial for grasping the evolution of internet infrastructure.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                      <h4 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-300">IPv4 (Version 4)</h4>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>Format:</strong> Four numbers separated by dots (e.g., 192.168.1.1)</li>
                        <li><strong>Range:</strong> 0-255 for each number</li>
                        <li><strong>Total Addresses:</strong> ~4.3 billion</li>
                        <li><strong>Example:</strong> 203.0.113.45</li>
                        <li><strong>Status:</strong> Still widely used, but addresses are depleted</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                      <h4 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-300">IPv6 (Version 6)</h4>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>Format:</strong> Eight groups of hexadecimal numbers (e.g., 2001:0db8:85a3::8a2e:0370:7334)</li>
                        <li><strong>Range:</strong> 0-9 and a-f for each character</li>
                        <li><strong>Total Addresses:</strong> 340 undecillion (340 trillion trillion trillion)</li>
                        <li><strong>Example:</strong> 2001:0db8:85a3:0000:0000:8a2e:0370:7334</li>
                        <li><strong>Status:</strong> Gradually replacing IPv4</li>
                      </ul>
                    </div>
                  </div>

                  <p>
                    The transition from IPv4 to IPv6 was necessary because we simply ran out of IPv4 addresses. With the explosive growth of internet-connected devices—smartphones, smart homes, IoT devices, and more—the 4.3 billion addresses provided by IPv4 weren't enough. IPv6's 340 undecillion addresses ensure we'll never run out again.
                  </p>
                </div>
              </section>

              <section className="mb-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-green-600 dark:text-green-400 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white text-lg">3</span>
                  Public vs Private IP Addresses
                </h3>
                <div className="space-y-4 text-base md:text-lg leading-relaxed">
                  <p>
                    Not all IP addresses are created equal. There are two main categories: <strong>public IP addresses</strong> and <strong>private IP addresses</strong>.
                  </p>

                  <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 p-6 rounded-xl border-l-4 border-green-600">
                    <h4 className="text-xl font-bold mb-3 text-green-700 dark:text-green-300">🌍 Public IP Address</h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      Your <strong>public IP address</strong> is the address visible to the outside world. It's assigned by your Internet Service Provider (ISP) and is what websites see when you visit them. This is the IP address displayed on this page.
                    </p>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                      <li>Unique across the entire internet</li>
                      <li>Assigned by your ISP</li>
                      <li>Can be static (doesn't change) or dynamic (changes periodically)</li>
                      <li>Visible to websites and services you connect to</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-6 rounded-xl border-l-4 border-orange-600">
                    <h4 className="text-xl font-bold mb-3 text-orange-700 dark:text-orange-300">🏠 Private IP Address</h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      Your <strong>private IP address</strong> is used within your local network (home or office). Your router assigns these addresses to devices connected to your Wi-Fi or Ethernet.
                    </p>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                      <li>Only unique within your local network</li>
                      <li>Assigned by your router (using DHCP)</li>
                      <li>Common ranges: 192.168.x.x, 10.x.x.x, 172.16.x.x</li>
                      <li>Not visible to the outside internet</li>
                    </ul>
                  </div>

                  <p>
                    Your router uses a technology called <strong>Network Address Translation (NAT)</strong> to allow multiple devices with private IP addresses to share a single public IP address. This is why all devices in your home appear to websites as coming from the same public IP address.
                  </p>
                </div>
              </section>

              <section className="mb-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-lg">4</span>
                  Static vs Dynamic IP Addresses
                </h3>
                <div className="space-y-4 text-base md:text-lg leading-relaxed">
                  <p>
                    Public IP addresses can be either <strong>static</strong> or <strong>dynamic</strong>, each with its own advantages and use cases.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 p-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                      <h4 className="text-xl font-bold mb-3 text-indigo-700 dark:text-indigo-300">🔒 Static IP Address</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        A permanent address that never changes.
                      </p>
                      <p className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Best For:</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside mb-3">
                        <li>Web servers</li>
                        <li>Email servers</li>
                        <li>VPN connections</li>
                        <li>Remote desktop access</li>
                        <li>Gaming servers</li>
                      </ul>
                      <p className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Pros:</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                        <li>Reliable for hosting services</li>
                        <li>Easier for remote access</li>
                        <li>Better for certain applications</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                      <h4 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-300">🔄 Dynamic IP Address</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        Changes periodically (days, weeks, or months).
                      </p>
                      <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Best For:</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside mb-3">
                        <li>Home internet users</li>
                        <li>Small businesses</li>
                        <li>Mobile devices</li>
                        <li>General browsing</li>
                      </ul>
                      <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Pros:</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                        <li>Usually free from ISPs</li>
                        <li>Better security (harder to track)</li>
                        <li>More efficient IP allocation</li>
                      </ul>
                    </div>
                  </div>

                  <p>
                    Most home internet users have dynamic IP addresses. Your ISP typically charges extra for a static IP address since it requires dedicated resources. Unless you're running a server or need reliable remote access, a dynamic IP is perfectly fine for everyday use.
                  </p>
                </div>
              </section>

              <div className="my-10">
                <AutoAdSlot placement="mid-content" />
              </div>

              <section className="mb-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-red-600 dark:text-red-400 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white text-lg">5</span>
                  How Websites Detect Your IP Address
                </h3>
                <div className="space-y-4 text-base md:text-lg leading-relaxed">
                  <p>
                    Every time you connect to a website, your IP address is automatically shared as part of the connection process. This isn't a security flaw—it's how the internet works. Here's what happens:
                  </p>

                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 p-6 rounded-xl">
                    <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex gap-3">
                        <span className="font-bold text-red-600 dark:text-red-400">1.</span>
                        <span>You type a URL into your browser and hit Enter</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-red-600 dark:text-red-400">2.</span>
                        <span>Your browser sends a request to the website's server, including your IP address in the request header</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-red-600 dark:text-red-400">3.</span>
                        <span>The server processes your request and uses your IP address to know where to send the response</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-red-600 dark:text-red-400">4.</span>
                        <span>The website can also use your IP to determine your approximate location, ISP, and other details</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-red-600 dark:text-red-400">5.</span>
                        <span>This information might be logged for analytics, security, or personalization purposes</span>
                      </li>
                    </ol>
                  </div>

                  <p>
                    Websites use IP addresses for various legitimate purposes, including:
                  </p>

                  <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300 ml-4">
                    <li><strong>Geolocation:</strong> Serving content in your language or currency</li>
                    <li><strong>Security:</strong> Detecting suspicious activity or preventing fraud</li>
                    <li><strong>Analytics:</strong> Understanding where visitors come from</li>
                    <li><strong>Compliance:</strong> Restricting access based on geographic regulations</li>
                    <li><strong>Rate limiting:</strong> Preventing abuse or spam</li>
                  </ul>
                </div>
              </section>

              <section className="mb-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-lg">6</span>
                  How to Change or Hide Your IP Address
                </h3>
                <div className="space-y-4 text-base md:text-lg leading-relaxed">
                  <p>
                    There are several legitimate reasons to change or hide your IP address: privacy, security, accessing geo-restricted content, or avoiding IP-based tracking. Here are the most effective methods:
                  </p>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-6 rounded-xl border-l-4 border-blue-600">
                      <h4 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-300">🔐 1. Use a VPN (Virtual Private Network)</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        The most popular and effective method. A VPN encrypts your internet traffic and routes it through a server in a location of your choice.
                      </p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                        <li><strong>Pros:</strong> Strong encryption, easy to use, fast speeds</li>
                        <li><strong>Cons:</strong> Requires subscription (paid VPNs are more reliable)</li>
                        <li><strong>Best For:</strong> Privacy, security, accessing streaming services</li>
                        <li><strong>Popular Options:</strong> NordVPN, ExpressVPN, Surfshark, ProtonVPN</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 p-6 rounded-xl border-l-4 border-purple-600">
                      <h4 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-300">🌐 2. Use a Proxy Server</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        Acts as an intermediary between your device and the internet, masking your IP address.
                      </p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                        <li><strong>Pros:</strong> Simple, often free, no software required</li>
                        <li><strong>Cons:</strong> Slower than VPNs, less secure, may not work with all sites</li>
                        <li><strong>Best For:</strong> Quick IP changes, bypassing simple geo-blocks</li>
                        <li><strong>Types:</strong> HTTP proxies, SOCKS proxies, web proxies</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 rounded-xl border-l-4 border-green-600">
                      <h4 className="text-xl font-bold mb-3 text-green-700 dark:text-green-300">🧅 3. Use Tor Browser</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        Routes your traffic through multiple encrypted nodes for maximum anonymity.
                      </p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                        <li><strong>Pros:</strong> Free, extremely private, decentralized</li>
                        <li><strong>Cons:</strong> Very slow, some sites block Tor, learning curve</li>
                        <li><strong>Best For:</strong> Maximum privacy, whistleblowing, accessing .onion sites</li>
                        <li><strong>Note:</strong> Not suitable for streaming or torrenting</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-6 rounded-xl border-l-4 border-orange-600">
                      <h4 className="text-xl font-bold mb-3 text-orange-700 dark:text-orange-300">📱 4. Use Mobile Data or Switch Networks</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        Your IP changes when you switch between Wi-Fi and mobile data or connect to different networks.
                      </p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                        <li><strong>Pros:</strong> Simple, free, no additional software</li>
                        <li><strong>Cons:</strong> Temporary, limited control over new IP location</li>
                        <li><strong>Best For:</strong> Quick IP changes, bypassing IP bans</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 p-6 rounded-xl border-l-4 border-red-600">
                      <h4 className="text-xl font-bold mb-3 text-red-700 dark:text-red-300">🔄 5. Restart Your Router (for Dynamic IPs)</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        If you have a dynamic IP, your ISP might assign you a new one when you reconnect.
                      </p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                        <li><strong>Pros:</strong> Free, simple, no additional tools</li>
                        <li><strong>Cons:</strong> Not guaranteed to work, new IP from same ISP/region</li>
                        <li><strong>Best For:</strong> Bypassing temporary IP bans</li>
                        <li><strong>How:</strong> Unplug router for 5-10 minutes, then reconnect</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <div className="my-10">
                <AutoAdSlot placement="mid-content" />
              </div>

              <section className="mb-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-yellow-600 dark:text-yellow-400 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 text-white text-lg">7</span>
                  Frequently Asked Questions (FAQs)
                </h3>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 p-6 rounded-xl">
                    <h4 className="text-lg font-bold mb-2 text-yellow-800 dark:text-yellow-200">❓ Can someone track me using my IP address?</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Your IP address can reveal your approximate location (city/region), ISP, and timezone, but it cannot pinpoint your exact physical address or identify you personally. Law enforcement with a court order can request your identity from your ISP, but regular individuals cannot track you to your doorstep using just your IP.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-xl">
                    <h4 className="text-lg font-bold mb-2 text-blue-800 dark:text-blue-200">❓ What's the difference between my IP and my MAC address?</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Your IP address is assigned by your ISP or router and can change. Your MAC (Media Access Control) address is a permanent hardware identifier burned into your device's network card during manufacturing. MAC addresses are only visible on your local network, while IP addresses are visible across the internet.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-xl">
                    <h4 className="text-lg font-bold mb-2 text-purple-800 dark:text-purple-200">❓ Is my IP address the same on all devices?</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Devices connected to the same Wi-Fi network share the same <strong>public IP address</strong> but have different <strong>private IP addresses</strong> within your local network. If you use mobile data, your phone will have a different public IP from your home network.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 p-6 rounded-xl">
                    <h4 className="text-lg font-bold mb-2 text-green-800 dark:text-green-200">❓ Can websites see my private IP address?</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      No, websites can only see your <strong>public IP address</strong>. Your private IP (like 192.168.1.x) is only visible to other devices on your local network. Your router's NAT (Network Address Translation) ensures that only your public IP is exposed to the internet.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 p-6 rounded-xl">
                    <h4 className="text-lg font-bold mb-2 text-red-800 dark:text-red-200">❓ Why does my IP address keep changing?</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      If you have a <strong>dynamic IP address</strong> (which most home users do), your ISP periodically changes it to efficiently manage their IP address pool. This typically happens when you restart your router or after a certain lease period expires (days to months). If you need a consistent IP, you can request a static IP from your ISP for an additional fee.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 p-6 rounded-xl">
                    <h4 className="text-lg font-bold mb-2 text-indigo-800 dark:text-indigo-200">❓ Is it illegal to hide my IP address?</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      No, using a VPN or other methods to hide your IP address is completely legal in most countries. It's a legitimate privacy measure. However, what you <em>do</em> while your IP is hidden must still be legal. Using a VPN doesn't make illegal activities legal—it just makes them harder to trace.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-6 rounded-xl">
                    <h4 className="text-lg font-bold mb-2 text-orange-800 dark:text-orange-200">❓ How accurate is IP-based geolocation?</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      IP geolocation is typically accurate to the city or metropolitan area level, but it's not precise enough to identify your exact address or building. Accuracy varies by ISP and location—it's generally better in urban areas than rural ones. Factors like VPNs, proxies, and mobile networks can also affect accuracy.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 p-6 rounded-xl">
                    <h4 className="text-lg font-bold mb-2 text-cyan-800 dark:text-cyan-200">❓ What is an IP blacklist?</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      An IP blacklist is a database of IP addresses known for sending spam, malware, or engaging in malicious activity. If your IP gets blacklisted (often due to malware on your network or sharing an IP with bad actors), you might have trouble sending emails or accessing certain websites. Contact your ISP if this happens.
                    </p>
                  </div>
                </div>
              </section>

              <div className="my-10">
                <AutoAdSlot placement="mid-content" />
              </div>

              <AutoAdSlot placement="in-article" className="my-8" />

              <section className="mb-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-lg">8</span>
                  Understanding IP Security and Privacy
                </h3>
                <div className="space-y-4 text-base md:text-lg leading-relaxed">
                  <p>
                    Your IP address is a valuable piece of information that can be used for both legitimate and malicious purposes. Understanding the security implications helps you protect your privacy online.
                  </p>

                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 p-6 rounded-xl border-l-4 border-red-600">
                    <h4 className="text-xl font-bold mb-3 text-red-700 dark:text-red-300">⚠️ Potential Security Risks</h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
                      <li><strong>DDoS Attacks:</strong> Hackers can flood your IP with traffic, causing service disruptions</li>
                      <li><strong>Targeted Attacks:</strong> Knowing your IP allows attackers to probe for vulnerabilities</li>
                      <li><strong>IP Spoofing:</strong> Criminals can fake your IP to commit fraud or cybercrimes</li>
                      <li><strong>Tracking:</strong> Websites and advertisers can track your browsing habits across sessions</li>
                      <li><strong>Doxxing:</strong> Your approximate location can be revealed through IP lookup</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 rounded-xl border-l-4 border-green-600">
                    <h4 className="text-xl font-bold mb-3 text-green-700 dark:text-green-300">✅ Best Practices for IP Security</h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
                      <li><strong>Use a VPN:</strong> Especially on public Wi-Fi networks</li>
                      <li><strong>Enable Firewall:</strong> Both on your router and individual devices</li>
                      <li><strong>Keep Software Updated:</strong> Patch security vulnerabilities promptly</li>
                      <li><strong>Avoid Clicking Suspicious Links:</strong> IP grabbers can capture your IP through malicious links</li>
                      <li><strong>Use Strong Router Passwords:</strong> Prevent unauthorized access to your network</li>
                      <li><strong>Monitor Network Activity:</strong> Check for unusual connections or devices</li>
                      <li><strong>Be Cautious with IP-Based Games:</strong> Some online games expose your IP to other players</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-600 text-white text-lg">9</span>
                  Future of IP Addresses
                </h3>
                <div className="space-y-4 text-base md:text-lg leading-relaxed">
                  <p>
                    As the internet continues to evolve, so does the infrastructure that supports it. Here's what the future holds for IP addresses:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-6 rounded-xl">
                      <h4 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-300">🚀 IPv6 Adoption</h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        The transition to IPv6 is gradually accelerating. Major internet providers, cloud services, and mobile networks are prioritizing IPv6. By 2030, IPv6 is expected to dominate internet traffic, though IPv4 will likely coexist for decades.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 p-6 rounded-xl">
                      <h4 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-300">🌐 IoT Explosion</h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        The Internet of Things (IoT) requires billions of IP addresses for smart devices. IPv6's massive address space makes it possible to assign unique IPs to every sensor, appliance, and wearable device.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 rounded-xl">
                      <h4 className="text-xl font-bold mb-3 text-green-700 dark:text-green-300">🔒 Enhanced Security</h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        IPv6 includes built-in security features like IPsec (Internet Protocol Security), making encryption and authentication more robust. Future IP protocols will prioritize privacy and security by design.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-6 rounded-xl">
                      <h4 className="text-xl font-bold mb-3 text-orange-700 dark:text-orange-300">⚡ 5G and Beyond</h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        5G networks are designed with IPv6 in mind, enabling faster deployment and better device management. As 6G development begins, IP addressing will evolve to support even higher speeds and lower latency.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">🎯 Conclusion</h3>
                <p className="text-base md:text-lg leading-relaxed">
                  Your IP address is a fundamental component of how the internet works, serving as your device's unique identifier in the vast digital landscape. Whether you're concerned about privacy, need to troubleshoot network issues, or simply want to understand how you're connected to the world, knowing your IP address and how it works is essential knowledge in today's connected world.
                </p>
                <p className="mt-4 text-base md:text-lg">
                  Use this tool whenever you need to quickly check your public IP, location, and ISP information—it's instant, free, and always accurate.
                </p>
              </div>
            </div>
          </div>

          <AutoAdSlot placement="bottom-sticky" className="mt-8" />

          <AffiliateBanner type="amazon-tools" className="mt-12" />

          <AutoAdSlot placement="in-feed" className="mt-8" />
        </div>
      </div>
    </div>
  );
}
