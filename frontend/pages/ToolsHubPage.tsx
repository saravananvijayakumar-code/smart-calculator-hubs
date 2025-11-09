// @ts-nocheck
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Wifi, 
  Monitor, 
  Image, 
  Lock, 
  Search,
  Zap,
  Shield,
  Gauge,
  Network,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Rocket,
  Target,
  TrendingUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead';
import NativeBanner from '@/components/ads/NativeBanner';
import AmazonAffiliate from '@/components/ads/AmazonAffiliate';
import { shouldShowAds } from '@/config/ads';

interface Tool {
  title: string;
  description: string;
  path: string;
  icon: any;
  color: string;
  gradient: string;
  features: string[];
  category: string;
}

const tools: Tool[] = [
  {
    title: "What's My IP",
    description: "Instantly discover your public IP address and detailed geolocation information including city, region, country, ISP, and timezone.",
    path: "/know-my-ip",
    icon: Globe,
    color: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500",
    features: ["IPv4 & IPv6 Detection", "Geolocation Data", "ISP Information", "Timezone Detection"],
    category: "Network"
  },
  {
    title: "Browser & Device Info",
    description: "Get comprehensive details about your browser, operating system, device specifications, screen resolution, and system capabilities.",
    path: "/tools/browser-device-info",
    icon: Monitor,
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-500",
    features: ["Browser Detection", "OS Information", "Screen Details", "Hardware Specs"],
    category: "System"
  },
  {
    title: "Internet Speed Test",
    description: "Measure your internet connection speed with accurate download, upload, and ping tests. Track your network performance over time.",
    path: "/tools/internet-speed-test",
    icon: Gauge,
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-500",
    features: ["Download Speed", "Upload Speed", "Ping & Latency", "Performance History"],
    category: "Network"
  },
  {
    title: "Image Compressor",
    description: "Compress and optimize your images without losing quality. Support for JPEG, PNG, and WebP formats with real-time preview and batch processing.",
    path: "/tools/image-compressor",
    icon: Image,
    color: "text-orange-600",
    gradient: "from-orange-500 to-red-500",
    features: ["Multi-format Support", "Batch Processing", "Quality Control", "Privacy-First"],
    category: "Media"
  },
  {
    title: "SSL/TLS Domain Checker",
    description: "Verify SSL certificates, check security ratings, and ensure your website's encryption is properly configured and up-to-date.",
    path: "/tools/ssl-domain-checker",
    icon: Lock,
    color: "text-red-600",
    gradient: "from-red-500 to-rose-500",
    features: ["Certificate Validation", "Expiry Alerts", "Security Rating", "Chain Analysis"],
    category: "Security"
  },
  {
    title: "IP Reputation Checker",
    description: "Analyze IP addresses for reputation, blocklist status, abuse reports, and security threats. Perfect for email deliverability and security audits.",
    path: "/tools/ip-reputation-check",
    icon: Shield,
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-blue-500",
    features: ["Blocklist Lookup", "Threat Analysis", "Abuse Reports", "Security Score"],
    category: "Security"
  },
  {
    title: "DNS Ping Test",
    description: "Test DNS resolution speed, check server response times, and diagnose DNS-related network issues with detailed analytics.",
    path: "/tools/dns-ping-test",
    icon: Network,
    color: "text-teal-600",
    gradient: "from-teal-500 to-cyan-500",
    features: ["DNS Resolution", "Response Time", "Server Analysis", "Issue Diagnosis"],
    category: "Network"
  }
];

const categories = Array.from(new Set(tools.map(tool => tool.category)));

export default function ToolsHubPage() {
  return (
    <>
      <SEOHead 
        title="Free Online Tools - Network, Security & System Analysis Tools"
        description="Discover our comprehensive suite of free online tools for network analysis, security testing, system information, and media optimization. Check your IP, test internet speed, compress images, verify SSL certificates, and more."
        keywords="online tools, ip checker, internet speed test, image compressor, ssl checker, dns test, browser info, network tools, security tools"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mb-6 border border-blue-200/50 dark:border-blue-700/50">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Professional-Grade Tools
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Powerful Online Tools
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed mb-4">
              Your Complete Digital Swiss Army Knife
            </p>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Free, fast, and privacy-focused tools for developers, IT professionals, and everyday users
            </p>
          </div>

          {/* Native Banner 1 - Top */}
          <div className="mb-8">
            <NativeBanner position="top" />
          </div>

          <div className="mb-16 animate-slide-up">
            <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-blue-100 dark:border-blue-900/50 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-blue-600" />
                    Why Choose Our Tools?
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">100% Free Forever</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">No hidden fees, subscriptions, or premium tiers. All tools are completely free to use, unlimited times.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Privacy-First Design</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Your data stays private. Most tools process information locally in your browser without sending data to servers.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Lightning Fast</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Optimized for speed with instant results. No waiting, no loading screens, just immediate answers.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Target className="h-6 w-6 text-purple-600" />
                    Perfect For
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Developers & IT Professionals</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Debug network issues, verify SSL certificates, and analyze system information during development.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Content Creators</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Optimize images for web, check connection speeds for streaming, and ensure your online presence is secure.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Everyday Users</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Troubleshoot internet problems, check device compatibility, and stay informed about your digital footprint.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {shouldShowAds() && (
            <div className="mb-8">
              <AutoAdSlot placement="in-article" />
            </div>
          )}

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              Explore Our Tools by Category
            </h2>
            
            {categories.map((category, idx) => (
              <div key={category} className="mb-12 animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 flex-grow bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {category} Tools
                  </h3>
                  <div className="h-1 flex-grow bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {tools.filter(tool => tool.category === category).map((tool, toolIdx) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="group block animate-scale-in"
                        style={{ animationDelay: `${(idx * 100) + (toolIdx * 50)}ms` }}
                      >
                        <Card className="h-full p-6 bg-white dark:bg-slate-800 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600 transform hover:-translate-y-1 hover:scale-105">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.gradient} shadow-lg group-hover:shadow-xl transition-shadow`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                {tool.title}
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                              </h4>
                              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                                {tool.description}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                              Key Features:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {tool.features.map((feature) => (
                                <div key={feature} className="flex items-center gap-2">
                                  <Zap className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                                  <span className="text-xs text-slate-700 dark:text-slate-300">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Button 
                            className={`w-full bg-gradient-to-r ${tool.gradient} hover:shadow-lg transform transition-all group-hover:scale-105`}
                          >
                            <span className="text-white font-semibold">Try Now</span>
                            <ArrowRight className="ml-2 h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Native Banner 2 - Middle */}
          <div className="mb-8">
            <NativeBanner position="middle" />
          </div>

          <AmazonAffiliate calculatorTitle="Online Tools" placement="content" />

          <div className="mb-12">
            <Card className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 text-center">
                The Ultimate Tool Suite for Digital Excellence
              </h2>
              
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-4">
                  In today's digital world, having access to reliable, fast, and accurate online tools is essential. Whether you're a seasoned developer debugging a critical production issue, a content creator optimizing images for your latest blog post, or simply someone trying to troubleshoot why Netflix keeps buffering, our comprehensive suite of tools has you covered.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-white">Network Analysis & Diagnostics</h3>
                <p className="text-lg leading-relaxed mb-4">
                  Our network tools provide deep insights into your internet connection and network infrastructure. The <strong>IP Address Checker</strong> doesn't just show your public IP—it reveals your complete digital location including city-level geolocation, ISP information, and timezone data. This is invaluable for verifying VPN connections, understanding geo-restrictions, or simply satisfying your curiosity about how the internet sees you.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  The <strong>Internet Speed Test</strong> goes beyond basic download speeds. It measures upload bandwidth, ping latency, and jitter—critical metrics for video conferencing, online gaming, and cloud services. Track your results over time to identify patterns, hold your ISP accountable, or determine the best times for bandwidth-intensive activities.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  For technical troubleshooting, our <strong>DNS Ping Test</strong> tool is indispensable. DNS issues are often the hidden culprit behind slow website loading and connection failures. This tool helps you identify DNS resolution problems, compare different DNS providers, and optimize your browsing experience by choosing the fastest DNS servers for your location.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-white">Security & Privacy Tools</h3>
                <p className="text-lg leading-relaxed mb-4">
                  Security isn't optional—it's essential. Our <strong>SSL/TLS Domain Checker</strong> helps website owners and administrators ensure their sites are properly secured. It verifies certificate validity, checks expiration dates, analyzes the certificate chain, and provides a security rating. In an era where browsers flag insecure sites and search engines penalize them, maintaining valid SSL certificates is critical for trust and SEO.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  The <strong>IP Reputation Checker</strong> is crucial for email deliverability and security audits. It scans multiple blocklists, analyzes historical abuse reports, and provides a comprehensive reputation score. For email marketers, this tool can mean the difference between landing in the inbox or the spam folder. For security professionals, it's essential for identifying potentially malicious IP addresses and protecting your infrastructure.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-white">System Information & Compatibility</h3>
                <p className="text-lg leading-relaxed mb-4">
                  The <strong>Browser & Device Info</strong> tool provides comprehensive details about your system that you won't find in your settings menu. It detects your exact browser version, operating system details, screen specifications, color depth, pixel ratio, installed languages, and more. This information is invaluable for web developers testing cross-browser compatibility, support teams diagnosing technical issues, or anyone curious about their device's capabilities.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Understanding your system specs helps you make informed decisions about software compatibility, troubleshoot rendering issues, and verify that websites are detecting your device correctly. It's also useful for privacy-conscious users who want to understand their browser fingerprint.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-white">Media Optimization</h3>
                <p className="text-lg leading-relaxed mb-4">
                  The <strong>Image Compressor</strong> is a game-changer for anyone working with digital images. It uses advanced compression algorithms to reduce file sizes by up to 80% while maintaining visual quality. Unlike many online tools that upload your images to remote servers, our compressor processes everything locally in your browser, ensuring complete privacy.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Support for multiple formats (JPEG, PNG, WebP), batch processing capabilities, and real-time previews make it perfect for optimizing website images, preparing photos for email, or reducing storage usage. Smaller images mean faster page loads, better SEO rankings, reduced bandwidth costs, and improved user experience—especially on mobile devices.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-white">Privacy-First Philosophy</h3>
                <p className="text-lg leading-relaxed mb-4">
                  We built these tools with privacy as a core principle. Whenever possible, processing happens entirely in your browser. Your data never leaves your device. For tools that require external lookups (like IP geolocation or DNS testing), we use trusted third-party services and never store or log your queries.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  No registration required. No tracking cookies. No data collection. Just tools that work, respecting your privacy every step of the way.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-white">Built for Performance</h3>
                <p className="text-lg leading-relaxed mb-4">
                  Every tool is optimized for speed and efficiency. We use modern web technologies, efficient algorithms, and smart caching to deliver instant results. Whether you're testing your internet speed or compressing a batch of images, you'll appreciate the responsive interface and quick processing times.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Our tools are mobile-responsive and work seamlessly across all devices. Use them on your desktop workstation, laptop, tablet, or smartphone—the experience is consistently excellent.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-white">Continuous Improvement</h3>
                <p className="text-lg leading-relaxed mb-4">
                  We're constantly updating our tools with new features, improvements, and optimizations. Our development team monitors the latest web standards, security best practices, and user feedback to ensure our tools remain cutting-edge and useful.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Have a suggestion for a new tool or feature? We'd love to hear from you. Our goal is to build the most comprehensive, reliable, and user-friendly suite of online tools available—and your feedback helps us get there.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-white">Join Thousands of Satisfied Users</h3>
                <p className="text-lg leading-relaxed">
                  Thousands of developers, IT professionals, content creators, and everyday users rely on our tools every day. From Fortune 500 companies to individual freelancers, our tools help people solve problems, save time, and work more efficiently. Try them today and discover why our tools are trusted by users worldwide.
                </p>
              </div>
            </Card>
          </div>

          {/* Native Banner 3 - Bottom */}
          <div className="mb-12">
            <NativeBanner position="bottom" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 bg-white dark:bg-slate-800 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Instant Results
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Get answers in milliseconds, not minutes. Our tools are optimized for speed.
              </p>
            </Card>

            <Card className="p-6 bg-white dark:bg-slate-800 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your data is processed locally whenever possible. No tracking, no logs.
              </p>
            </Card>

            <Card className="p-6 bg-white dark:bg-slate-800 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Always Free
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                No subscriptions, no paywalls, no hidden costs. Free forever for everyone.
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Card className="inline-block p-8 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl">
                Choose any tool above to begin. No sign-up required, no credit card needed. Just powerful tools at your fingertips.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/know-my-ip">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Globe className="mr-2 h-4 w-4" />
                    Check My IP
                  </Button>
                </Link>
                <Link to="/tools/internet-speed-test">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Gauge className="mr-2 h-4 w-4" />
                    Test Speed
                  </Button>
                </Link>
                <Link to="/tools/image-compressor">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Image className="mr-2 h-4 w-4" />
                    Compress Images
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out backwards;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgb(148 163 184 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(148 163 184 / 0.1) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
      `}</style>
    </>
  );
}
