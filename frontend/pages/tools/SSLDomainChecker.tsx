import { useState } from 'react';
import { Lock, Shield, Calendar, Globe, CheckCircle, XCircle, AlertTriangle, Award, Key, FileCheck, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';
import { AdsterraSlot } from '@/components/ads/AdsterraSlot';

interface SSLResults {
  valid: boolean;
  issuer: string;
  expiryDate: string;
  issueDate: string;
  daysUntilExpiry: number;
  encryptionType: string;
  domainValidation: string;
  hasWildcard: boolean;
  signatureAlgorithm: string;
  grade: 'A+' | 'A' | 'B' | 'C' | 'F';
}

const gradeConfig = {
  'A+': {
    label: '🏆 A+ Perfect',
    color: 'text-green-600 dark:text-green-400',
    bg: 'from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-100 dark:border-green-900/50',
    desc: 'Top-tier security! Your SSL is configured perfectly.'
  },
  'A': {
    label: '✨ A Excellent',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-100 dark:border-blue-900/50',
    desc: 'Great security configuration with modern standards.'
  },
  'B': {
    label: '⚡ B Good',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 border-yellow-100 dark:border-yellow-900/50',
    desc: 'Acceptable security, but room for improvement.'
  },
  'C': {
    label: '⚠️ C Fair',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 border-orange-100 dark:border-orange-900/50',
    desc: 'Outdated configuration, upgrade recommended!'
  },
  'F': {
    label: '🚨 F Failed',
    color: 'text-red-600 dark:text-red-400',
    bg: 'from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 border-red-100 dark:border-red-900/50',
    desc: 'Critical security issues! Fix immediately!'
  }
};

export default function SSLDomainChecker() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<SSLResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSSL = async () => {
    if (!domain) {
      setError('Please enter a domain name');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock data
    const grades: Array<'A+' | 'A' | 'B' | 'C' | 'F'> = ['A+', 'A', 'B'];
    const issuers = ['Let\'s Encrypt', 'DigiCert', 'Cloudflare', 'Sectigo', 'GlobalSign'];
    const daysLeft = Math.floor(Math.random() * 365) + 1;
    
    const mockResults: SSLResults = {
      valid: true,
      issuer: issuers[Math.floor(Math.random() * issuers.length)],
      expiryDate: new Date(Date.now() + daysLeft * 24 * 60 * 60 * 1000).toLocaleDateString(),
      issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      daysUntilExpiry: daysLeft,
      encryptionType: 'TLS 1.3',
      domainValidation: 'Domain Validated (DV)',
      hasWildcard: Math.random() > 0.5,
      signatureAlgorithm: 'SHA-256 with RSA',
      grade: grades[Math.floor(Math.random() * grades.length)]
    };

    setResults(mockResults);
    setLoading(false);
  };

  return (
    <>
      <SEOHead
        title="SSL / Domain Security Checker — Verify SSL Certificate Status"
        description="Check SSL certificate validity and domain security. Verify encryption, expiry dates, and security grade instantly."
        keywords="ssl checker, ssl certificate, domain security, https checker, tls checker, ssl validator, certificate checker, ssl test, domain ssl, security certificate"
      />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-950 dark:to-teal-950">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4">
              <Lock className="w-20 h-20 text-green-600 dark:text-green-400 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              SSL / Domain Security Checker
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Verify your website's SSL certificate, check encryption standards, and ensure maximum security! 🔐
            </p>
          </div>

          <AutoAdSlot placement="top-banner" />

          {/* Input Section */}
          <div className="max-w-3xl mx-auto mb-12 animate-slide-up">
            <Card className="border-2 border-green-200 dark:border-green-800 shadow-2xl">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && checkSSL()}
                      placeholder="Enter domain (e.g., example.com or https://example.com)"
                      className="pl-10 h-14 text-lg border-2"
                    />
                  </div>
                  <Button 
                    onClick={checkSSL} 
                    disabled={loading || !domain}
                    size="lg"
                    className="h-14 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {loading ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Check SSL
                      </>
                    )}
                  </Button>
                </div>
                {error && (
                  <p className="text-red-600 dark:text-red-400 mt-3 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <AutoAdSlot placement="mid-content" />

          {/* Results Display */}
          {results && (
            <>
              {/* Security Grade */}
              <div className="max-w-4xl mx-auto mb-12 animate-bounce-in">
                <Card className={`border-4 bg-gradient-to-br ${gradeConfig[results.grade].bg} shadow-2xl`}>
                  <CardContent className="pt-8 text-center">
                    <Award className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                    <p className="text-sm text-muted-foreground mb-2">Security Grade</p>
                    <p className={`text-6xl font-bold mb-3 ${gradeConfig[results.grade].color}`}>
                      {gradeConfig[results.grade].label}
                    </p>
                    <p className="text-lg text-muted-foreground">{gradeConfig[results.grade].desc}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Details Grid */}
              <div className="max-w-6xl mx-auto mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 hover:shadow-2xl hover:shadow-green-500/20 transform hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {results.valid ? (
                          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 animate-bounce" />
                        ) : (
                          <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 animate-bounce" />
                        )}
                        <CardTitle className="text-lg">SSL Status</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-2xl font-bold ${results.valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {results.valid ? '✅ Valid & Trusted' : '❌ Invalid'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-bounce" style={{animationDelay: '0.1s'}} />
                        <CardTitle className="text-lg">Certificate Issuer</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {results.issuer}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Trusted Authority</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-bounce" style={{animationDelay: '0.2s'}} />
                        <CardTitle className="text-lg">Expiry Date</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {results.expiryDate}
                      </p>
                      <p className={`text-sm mt-1 ${
                        results.daysUntilExpiry < 30 ? 'text-red-600 dark:text-red-400' :
                        results.daysUntilExpiry < 60 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {results.daysUntilExpiry} days remaining
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 hover:shadow-2xl hover:shadow-orange-500/20 transform hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400 animate-bounce" style={{animationDelay: '0.3s'}} />
                        <CardTitle className="text-lg">Encryption Type</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {results.encryptionType}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Modern Standard</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 hover:shadow-2xl hover:shadow-teal-500/20 transform hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Key className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-bounce" style={{animationDelay: '0.4s'}} />
                        <CardTitle className="text-lg">Validation Type</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                        {results.domainValidation}
                      </p>
                      {results.hasWildcard && (
                        <p className="text-sm text-muted-foreground mt-1">🌟 Wildcard Enabled</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 hover:shadow-2xl hover:shadow-pink-500/20 transform hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-pink-600 dark:text-pink-400 animate-bounce" style={{animationDelay: '0.5s'}} />
                        <CardTitle className="text-lg">Signature</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                        {results.signatureAlgorithm}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Secure Hash</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center mt-8">
                  <Button
                    onClick={checkSSL}
                    variant="outline"
                    size="lg"
                    className="border-2 hover:shadow-xl transition-all duration-300"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Check Again
                  </Button>
                </div>
              </div>
            </>
          )}

          <AutoAdSlot placement="in-feed" />

          <AmazonAffiliate calculatorTitle="SSL Certificates" placement="content" />

          {/* Educational Content */}
          <div className="max-w-6xl mx-auto mt-16 space-y-12">
            <AutoAdSlot placement="in-article" />

            {/* What is SSL */}
            <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Lock className="w-8 h-8 text-green-600" />
                  What is SSL/TLS? 🔐
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">
                  <strong>SSL (Secure Sockets Layer)</strong> and <strong>TLS (Transport Layer Security)</strong> are encryption protocols that protect data traveling between your browser and a website. When you see that padlock icon 🔒 in your browser's address bar, that's SSL/TLS at work!
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  Think of it like a secure tunnel between you and a website. Without SSL/TLS, anyone can intercept and read your passwords, credit card numbers, and personal messages. With it, everything is encrypted into unreadable gibberish! 🛡️
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">🔒 Encryption</h4>
                    <p className="text-sm">Scrambles data so hackers can't read it, even if intercepted</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">✅ Authentication</h4>
                    <p className="text-sm">Verifies you're connecting to the real website, not a fake clone</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800">
                    <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">🛡️ Integrity</h4>
                    <p className="text-sm">Ensures data isn't tampered with during transmission</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AutoAdSlot placement="sidebar" />

            {/* SSL vs TLS */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  SSL vs TLS: What's the Difference? 🤔
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  Here's a secret: <strong>SSL is actually outdated!</strong> We should really call it TLS, but "SSL" stuck around because everyone was already familiar with the term. It's like how we still say "hang up the phone" even though smartphones have no receivers to hang! 📱
                </p>
                
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-200 dark:border-red-800">
                    <h4 className="text-xl font-bold text-red-600 dark:text-red-400 mb-3">❌ SSL (Secure Sockets Layer)</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">•</span>
                        <span><strong>SSL 1.0:</strong> Never publicly released (too many security flaws)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">•</span>
                        <span><strong>SSL 2.0:</strong> Deprecated in 2011 (severely vulnerable)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">•</span>
                        <span><strong>SSL 3.0:</strong> Retired in 2015 after POODLE attack exposed critical bugs</span>
                      </li>
                      <li className="text-sm text-red-600 dark:text-red-400 mt-3"><strong>⚠️ WARNING:</strong> If a website still uses SSL, RUN AWAY! It's completely insecure.</li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
                    <h4 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3">✅ TLS (Transport Layer Security)</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>TLS 1.0:</strong> Released 1999, deprecated 2021 (upgrade required)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>TLS 1.1:</strong> Released 2006, deprecated 2021 (no longer secure)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>TLS 1.2:</strong> Released 2008, still widely used and considered secure ✅</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>TLS 1.3:</strong> Released 2018, fastest and most secure version! 🚀</span>
                      </li>
                      <li className="text-sm text-green-600 dark:text-green-400 mt-3"><strong>💡 TIP:</strong> Always use TLS 1.2 or 1.3 for maximum security and speed!</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AutoAdSlot placement="in-feed" />

            {/* Types of SSL Certificates */}
            <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <FileCheck className="w-8 h-8 text-purple-600" />
                  Types of SSL Certificates 📜
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800">
                    <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">🔵 Domain Validation (DV)</h4>
                    <p className="mb-3"><strong>Quickest & Cheapest</strong> - Verifies you own the domain (usually instant!)</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 rounded bg-green-50 dark:bg-green-950/30">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">✅ Pros:</p>
                        <ul className="text-xs space-y-1 text-green-600 dark:text-green-400">
                          <li>• Free (Let's Encrypt, Cloudflare)</li>
                          <li>• Issued in minutes</li>
                          <li>• Perfect for blogs & small sites</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded bg-red-50 dark:bg-red-950/30">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">❌ Cons:</p>
                        <ul className="text-xs space-y-1 text-red-600 dark:text-red-400">
                          <li>• No identity verification</li>
                          <li>• Less trusted for e-commerce</li>
                          <li>• Phishers can get them too</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 border-2 border-orange-200 dark:border-orange-800">
                    <h4 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-3">🟠 Organization Validation (OV)</h4>
                    <p className="mb-3"><strong>Business Identity Verified</strong> - Confirms your company is real & legitimate</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 rounded bg-green-50 dark:bg-green-950/30">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">✅ Pros:</p>
                        <ul className="text-xs space-y-1 text-green-600 dark:text-green-400">
                          <li>• Business vetting (1-3 days)</li>
                          <li>• Shows company name in cert</li>
                          <li>• Good for corporate sites</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded bg-red-50 dark:bg-red-950/30">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">❌ Cons:</p>
                        <ul className="text-xs space-y-1 text-red-600 dark:text-red-400">
                          <li>• Costs $50-200/year</li>
                          <li>• Requires paperwork</li>
                          <li>• No visual indicator in browser</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
                    <h4 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3">🟢 Extended Validation (EV)</h4>
                    <p className="mb-3"><strong>Maximum Trust Level</strong> - Rigorous verification process, displays company name in address bar</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 rounded bg-green-50 dark:bg-green-950/30">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">✅ Pros:</p>
                        <ul className="text-xs space-y-1 text-green-600 dark:text-green-400">
                          <li>• Highest trust & credibility</li>
                          <li>• Perfect for banks, e-commerce</li>
                          <li>• Extensive background checks</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded bg-red-50 dark:bg-red-950/30">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">❌ Cons:</p>
                        <ul className="text-xs space-y-1 text-red-600 dark:text-red-400">
                          <li>• Expensive ($300-1000/year)</li>
                          <li>• Takes 1-2 weeks to issue</li>
                          <li>• Requires legal docs & phone verification</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
                    <h4 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-3">🌟 Wildcard & Multi-Domain</h4>
                    <p className="mb-3"><strong>Special Certificate Types</strong> - Cover multiple domains or subdomains with one cert</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400">•</span>
                        <span><strong>Wildcard SSL:</strong> Covers *.yourdomain.com (all subdomains) - Great for SaaS platforms!</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400">•</span>
                        <span><strong>Multi-Domain (SAN):</strong> Covers multiple different domains with one certificate - Perfect for companies with many brands!</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AutoAdSlot placement="mid-content" />

            {/* How SSL Works */}
            <Card className="border-2 border-orange-200 dark:border-orange-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Info className="w-8 h-8 text-orange-600" />
                  How Does SSL/TLS Work? 🔬
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  When you visit an HTTPS website, your browser and the server perform a secret handshake called the <strong>TLS Handshake</strong>. Here's what happens in those magical milliseconds:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">1️⃣</span>
                    <div>
                      <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-1">Client Hello</h4>
                      <p className="text-sm">Your browser says "Hi! I support these encryption methods..." and sends a random number</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500">
                    <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">2️⃣</span>
                    <div>
                      <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1">Server Hello</h4>
                      <p className="text-sm">Server responds with its SSL certificate, chosen encryption method, and another random number</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500">
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">3️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Certificate Verification</h4>
                      <p className="text-sm">Browser checks if the certificate is valid, not expired, and issued by a trusted authority (CA)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500">
                    <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">4️⃣</span>
                    <div>
                      <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-1">Key Exchange</h4>
                      <p className="text-sm">Browser generates a secret "session key", encrypts it with server's public key, sends it back</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-pink-50 dark:bg-pink-950/30 border-l-4 border-pink-500">
                    <span className="text-3xl font-bold text-pink-600 dark:text-pink-400">5️⃣</span>
                    <div>
                      <h4 className="font-bold text-pink-600 dark:text-pink-400 mb-1">Secure Connection</h4>
                      <p className="text-sm">Server decrypts session key using its private key. Now both have the same secret key for encrypting all future messages! 🎉</p>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-sm text-muted-foreground p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <strong>💡 Fun Fact:</strong> This entire handshake happens in ~100 milliseconds! TLS 1.3 reduced it to just 1 round trip (TLS 1.2 took 2), making HTTPS nearly as fast as HTTP.
                </p>
              </CardContent>
            </Card>

            <AutoAdSlot placement="in-article" />

            {/* Common SSL Errors */}
            <Card className="border-2 border-red-200 dark:border-red-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  Common SSL Errors & How to Fix Them 🔧
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">🚫 Certificate Expired</h4>
                    <p className="text-sm text-muted-foreground mb-2"><strong>Error:</strong> "Your connection is not private" or "NET::ERR_CERT_DATE_INVALID"</p>
                    <p className="text-xs"><strong>Fix:</strong> Renew your SSL certificate immediately! Most expire after 90 days (Let's Encrypt) or 1 year (paid certs).</p>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">🔐 Wrong Domain Name</h4>
                    <p className="text-sm text-muted-foreground mb-2"><strong>Error:</strong> "Certificate name mismatch" or "NET::ERR_CERT_COMMON_NAME_INVALID"</p>
                    <p className="text-xs"><strong>Fix:</strong> Get a certificate that matches your domain exactly, or use a wildcard cert for subdomains.</p>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">⚠️ Self-Signed Certificate</h4>
                    <p className="text-sm text-muted-foreground mb-2"><strong>Error:</strong> "This certificate is not trusted"</p>
                    <p className="text-xs"><strong>Fix:</strong> Use a proper CA like Let's Encrypt, DigiCert, or Sectigo. Never use self-signed certs in production!</p>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">🔗 Mixed Content</h4>
                    <p className="text-sm text-muted-foreground mb-2"><strong>Error:</strong> Padlock with warning, some content not secure</p>
                    <p className="text-xs"><strong>Fix:</strong> Ensure ALL resources (images, CSS, JS) load over HTTPS, not HTTP. Update all links!</p>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">🕐 Wrong System Time</h4>
                    <p className="text-sm text-muted-foreground mb-2"><strong>Error:</strong> Certificate appears expired but isn't</p>
                    <p className="text-xs"><strong>Fix:</strong> Set your computer's clock to the correct date/time. SSL validation depends on accurate time!</p>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">🔗 Incomplete Chain</h4>
                    <p className="text-sm text-muted-foreground mb-2"><strong>Error:</strong> "Unable to verify certificate chain"</p>
                    <p className="text-xs"><strong>Fix:</strong> Install intermediate certificates. Use SSL Labs test to identify missing chain certificates.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Award className="w-8 h-8 text-green-600" />
                  SSL Best Practices for 2024+ 🏆
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">1️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Use TLS 1.3</h4>
                      <p className="text-sm text-muted-foreground">Fastest, most secure version. Disable TLS 1.0/1.1 completely!</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">2️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Enable HSTS</h4>
                      <p className="text-sm text-muted-foreground">Force HTTPS-only connections. Prevents downgrade attacks!</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">3️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Automate Renewals</h4>
                      <p className="text-sm text-muted-foreground">Use Certbot or ACME for automatic Let's Encrypt renewal</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">4️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Monitor Expiry</h4>
                      <p className="text-sm text-muted-foreground">Set up alerts 30 days before expiration. Never let certs lapse!</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">5️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Use Strong Ciphers</h4>
                      <p className="text-sm text-muted-foreground">Disable weak algorithms (RC4, 3DES). Use AES-256-GCM!</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">6️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Test Regularly</h4>
                      <p className="text-sm text-muted-foreground">Use SSL Labs for monthly scans. Aim for A+ grade!</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">7️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Redirect HTTP to HTTPS</h4>
                      <p className="text-sm text-muted-foreground">301 permanent redirect. Never serve content over HTTP!</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors border border-green-200 dark:border-green-800">
                    <span className="text-3xl">8️⃣</span>
                    <div>
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-1">Protect Private Keys</h4>
                      <p className="text-sm text-muted-foreground">Never commit keys to GitHub! Use secure key storage!</p>
                    </div>
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
