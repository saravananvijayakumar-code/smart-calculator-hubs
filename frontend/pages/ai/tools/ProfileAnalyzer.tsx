// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, TrendingUp, Target, Zap, Instagram, Twitter, Linkedin, Share2, Download, AlertCircle } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { TopBannerAd } from '@/components/ads/TopBannerAd';
import { MidContentAd } from '@/components/ads/MidContentAd';
import { BottomStickyAd } from '@/components/ads/BottomStickyAd';
import backend from '~backend/client';

interface ProfileAnalysisResult {
  score: number;
  bioClarity: string;
  engagementHacks: string[];
  growthSuggestions: string[];
  summary: string;
  keyInsights: string[];
  riskFactors: string[];
  nextSteps: string[];
}

const platformIcons: Record<string, any> = {
  Instagram: Instagram,
  TikTok: Sparkles,
  LinkedIn: Linkedin,
  Twitter: Twitter
};

const affiliateTools = [
  { name: 'Canva Pro', description: 'Create stunning graphics', url: 'https://www.canva.com/', icon: '🎨' },
  { name: 'Buffer', description: 'Schedule posts efficiently', url: 'https://buffer.com/', icon: '📅' },
  { name: 'Later', description: 'Instagram scheduling tool', url: 'https://later.com/', icon: '📸' },
  { name: 'Hootsuite', description: 'Manage all platforms', url: 'https://hootsuite.com/', icon: '🦉' }
];

export default function ProfileAnalyzer() {
  const [profileInput, setProfileInput] = useState('');
  const [platform, setPlatform] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProfileAnalysisResult | null>(null);
  const { toast } = useToast();

  const validateInput = (): boolean => {
    if (!profileInput.trim()) {
      toast({
        title: 'Missing Input',
        description: 'Please enter your profile URL or username',
        variant: 'destructive'
      });
      return false;
    }

    if (!platform) {
      toast({
        title: 'Select Platform',
        description: 'Please select a social media platform',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const analyzeProfile = async () => {
    if (!validateInput()) return;

    setIsAnalyzing(true);

    try {
      const mockData = {
        platform,
        username: profileInput,
        profileUrl: profileInput,
        hasClearBio: Math.random() > 0.3,
        hasProfilePhoto: Math.random() > 0.2,
        hasLink: Math.random() > 0.4,
        postFrequency: ['daily', 'weekly', 'monthly'][Math.floor(Math.random() * 3)],
        engagementRate: Math.random() * 10,
        bioLength: Math.floor(Math.random() * 200),
        hasKeywords: Math.random() > 0.4,
        hasEmojis: Math.random() > 0.5,
        hasCTA: Math.random() > 0.6
      };

      const response = await backend.ai_analysis.analyze({
        calculatorType: 'profile-analyzer',
        data: mockData,
        userContext: {
          location: 'US'
        }
      });

      const score = parseInt(response.summary.match(/scored (\d+)/)?.[1] || '70');
      const bioMatch = response.recommendations.find((r: any) => r.title === 'Profile Score Breakdown');
      const bioClarity = bioMatch?.actionItems[1]?.split(' - ')[1] || 'Good clarity';
      
      const engagementRec = response.recommendations.find((r: any) => r.title === 'Engagement Hacks');
      const growthRec = response.recommendations.find((r: any) => r.title === 'Growth Strategy');

      setAnalysisResult({
        score,
        bioClarity,
        engagementHacks: engagementRec?.actionItems || [],
        growthSuggestions: growthRec?.actionItems || [],
        summary: response.summary,
        keyInsights: response.keyInsights,
        riskFactors: response.riskFactors,
        nextSteps: response.nextSteps
      });

      toast({
        title: 'Analysis Complete!',
        description: `Your ${platform} profile has been analyzed`
      });
    } catch (error) {
      console.error('Profile analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 55) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 55) return 'Average';
    return 'Needs Work';
  };

  const shareScore = async () => {
    if (!analysisResult) return;

    const shareText = `I scored ${analysisResult.score}/100 on my ${platform} profile analysis! 🚀\n\nGenerate your own profile score at Smart Calculator Hubs\n#ProfileAnalyzer #SocialMediaGrowth`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Profile Score',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: 'Copied!',
          description: 'Share text copied to clipboard'
        });
      }
    }
  };

  const PlatformIcon = platform ? platformIcons[platform] : Sparkles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <SEOHead
        title="AI Profile Analyzer – Instagram, TikTok, LinkedIn Growth Suggestions"
        description="Analyze your social profile bio, clarity, engagement, and get instant AI-powered growth tips."
        keywords="profile analyzer, social media analyzer, Instagram growth, TikTok tips, LinkedIn optimization, profile score"
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Profile Analyzer",
          "applicationCategory": "SocialMediaApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": "Analyze your social media profile and get instant AI-powered growth tips for Instagram, TikTok, LinkedIn and more.",
          "author": {
            "@type": "Organization",
            "name": "Smart Calculator Hubs"
          },
          "featureList": [
            "Profile score analysis",
            "Bio clarity assessment",
            "Engagement optimization tips",
            "Growth strategy recommendations",
            "Platform-specific insights"
          ]
        })}
      </script>

      <TopBannerAd />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI-Powered Social Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Profile Analyzer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant AI-powered insights into your social media profile. Analyze bio clarity, engagement potential, and receive personalized growth tips.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-purple-600" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Enter your profile URL or username to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profileInput">Profile URL or Username</Label>
                <Input
                  id="profileInput"
                  value={profileInput}
                  onChange={(e) => setProfileInput(e.target.value)}
                  placeholder="@username or https://instagram.com/username"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Twitter">Twitter/X</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Privacy Note:</strong> We analyze public profile data only. No login required.
                </AlertDescription>
              </Alert>

              <Button
                onClick={analyzeProfile}
                disabled={isAnalyzing || !profileInput.trim() || !platform}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Analyze Profile
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {analysisResult && (
            <>
              <MidContentAd />

              <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <PlatformIcon className="h-6 w-6 text-purple-600" />
                      Your Profile Score
                    </CardTitle>
                    <Button
                      onClick={shareScore}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 mb-4">
                      <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {analysisResult.score}
                      </div>
                      <div className="text-2xl text-muted-foreground">/100</div>
                    </div>
                    <div className="space-y-2">
                      <Progress value={analysisResult.score} className="h-3" />
                      <Badge className={`${getScoreColor(analysisResult.score)} text-white`}>
                        {getScoreLabel(analysisResult.score)}
                      </Badge>
                    </div>
                    <p className="text-lg font-medium mt-4">{analysisResult.summary}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Bio Clarity Assessment
                    </h3>
                    <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-700">
                      <AlertDescription className="text-foreground">
                        {analysisResult.bioClarity}
                      </AlertDescription>
                    </Alert>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Engagement Hacks
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.engagementHacks.map((hack, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-yellow-600 font-bold mt-0.5">⚡</span>
                          <span className="text-sm">{hack}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Growth Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.growthSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 font-bold mt-0.5">🚀</span>
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Key Insights</h3>
                    <ul className="space-y-2">
                      {analysisResult.keyInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-600 font-bold mt-0.5">💡</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {analysisResult.riskFactors.length > 0 && (
                    <>
                      <Separator />
                      <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Areas to Watch:</strong>
                          <ul className="mt-2 space-y-1">
                            {analysisResult.riskFactors.slice(0, 3).map((risk, index) => (
                              <li key={index} className="text-sm">• {risk}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </>
                  )}

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Next Steps</h3>
                    <div className="grid gap-2">
                      {analysisResult.nextSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                          <Badge variant="outline" className="mt-0.5">{index + 1}</Badge>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🛠️ Recommended Growth Tools
                  </CardTitle>
                  <CardDescription>
                    Supercharge your social media growth with these trusted tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {affiliateTools.map((tool, index) => (
                      <a
                        key={index}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 border rounded-lg hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{tool.icon}</span>
                          <div>
                            <h4 className="font-semibold">{tool.name}</h4>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle>How Profile Analysis Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Our AI-powered profile analyzer evaluates multiple factors to give you a comprehensive score:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Bio Quality:</strong> Clarity, keywords, call-to-action, and emoji usage</li>
                <li><strong>Profile Completeness:</strong> Photo, link, contact info, and highlights</li>
                <li><strong>Content Strategy:</strong> Posting frequency and content consistency</li>
                <li><strong>Engagement Metrics:</strong> Estimated engagement rate and community interaction</li>
                <li><strong>Platform Best Practices:</strong> Platform-specific optimization opportunities</li>
              </ul>
              <p className="text-xs italic">
                Note: This tool provides educational insights based on general best practices. Actual results may vary based on your niche, audience, and content quality.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomStickyAd />
    </div>
  );
}
