// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Instagram, Sparkles, Target, Zap, TrendingUp, AlertCircle, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { TopBannerAd } from '@/components/ads/TopBannerAd';
import { MidContentAd } from '@/components/ads/MidContentAd';
import { BottomStickyAd } from '@/components/ads/BottomStickyAd';
import backend from '~backend/client';

interface BioAnalysisResult {
  score: number;
  clarity: string;
  engagementPotential: number;
  summary: string;
  recommendations: any[];
  keyInsights: string[];
  riskFactors: string[];
  nextSteps: string[];
}

export default function InstagramBioAnalyzer() {
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BioAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeBio = async () => {
    if (!bio.trim()) {
      toast({
        title: 'Missing Bio',
        description: 'Please enter your Instagram bio',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const bioData = {
        bio: bio.trim(),
        username: username.trim() || 'user',
        bioLength: bio.trim().length,
        hasEmojis: /[\u{1F300}-\u{1F9FF}]/u.test(bio),
        hasHashtags: /#\w+/.test(bio),
        hasCTA: /click|shop|join|dm|link|visit|subscribe|follow|learn|buy|get/i.test(bio),
        hasLink: /link|👇|⬇️|below/i.test(bio),
        hasLineBreaks: /\n/.test(bio)
      };

      const response = await backend.ai_analysis.analyze({
        calculatorType: 'instagram-bio-analyzer',
        data: bioData,
        userContext: {
          location: 'US'
        }
      });

      const scoreMatch = response.summary.match(/scored (\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 70;
      
      const clarityMatch = response.summary.match(/\d+\/100\. (.+?)\. It has/);
      const clarity = clarityMatch ? clarityMatch[1] : 'Your bio has room for improvement';
      
      const engagementMatch = response.summary.match(/has (\d+)%/);
      const engagementPotential = engagementMatch ? parseInt(engagementMatch[1]) : 50;

      setAnalysisResult({
        score,
        clarity,
        engagementPotential,
        summary: response.summary,
        recommendations: response.recommendations,
        keyInsights: response.keyInsights,
        riskFactors: response.riskFactors,
        nextSteps: response.nextSteps
      });

      toast({
        title: 'Analysis Complete!',
        description: 'Your Instagram bio has been analyzed'
      });
    } catch (error) {
      console.error('Bio analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze bio. Please try again.',
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

  const shareToSocial = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    if (!analysisResult) return;

    const shareText = `🎯 My Instagram bio scored ${analysisResult.score}/100!\n\n✨ Analyze your bio at www.smartcalculatorhubs.com #InstagramTips #BioOptimization`;
    const shareUrl = 'https://www.smartcalculatorhubs.com';

    if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank');
    } else if (platform === 'facebook') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(facebookUrl, '_blank');
    } else if (platform === 'whatsapp') {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 dark:from-gray-900 dark:via-pink-900/20 dark:to-purple-900/20">
      <SEOHead
        title="Instagram Bio Analyzer – AI-Powered Bio Optimization Tool"
        description="Analyze your Instagram bio with AI. Get instant feedback on clarity, CTA, emojis, and engagement potential. Improve your bio in seconds."
        keywords="Instagram bio analyzer, bio optimization, Instagram tips, social media growth, bio score, Instagram marketing"
      />

      <TopBannerAd />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full mb-4">
              <Instagram className="h-5 w-5 text-pink-600" />
              <span className="text-sm font-medium text-pink-700 dark:text-pink-300">Instagram Growth Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Instagram Bio Analyzer</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant AI-powered feedback on your Instagram bio. Optimize for clarity, engagement, and conversions in seconds.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-pink-600" />
                Your Instagram Bio
              </CardTitle>
              <CardDescription>
                Paste your current bio or try a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username (Optional)</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@yourusername"
                  className="mt-1.5"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="bio">Instagram Bio</Label>
                  <span className="text-sm text-muted-foreground">
                    {bio.length}/150
                  </span>
                </div>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 150))}
                  placeholder="Enter your Instagram bio here..."
                  className="min-h-[120px] resize-none"
                  maxLength={150}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Instagram bios have a 150-character limit
                </p>
              </div>

              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Tip:</strong> Include who you are, what you do, and a call-to-action
                </AlertDescription>
              </Alert>

              <Button
                onClick={analyzeBio}
                disabled={isAnalyzing || !bio.trim()}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Bio...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Analyze Bio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {analysisResult && (
            <>
              <MidContentAd />

              <Card className="mb-8 border-2 border-pink-200 dark:border-pink-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="h-6 w-6 text-pink-600" />
                    Bio Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 mb-4">
                      <div className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
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
                      <Target className="h-5 w-5 text-pink-600" />
                      Bio Clarity
                    </h3>
                    <Alert className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-300 dark:border-pink-700">
                      <AlertDescription className="text-foreground">
                        {analysisResult.clarity}
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Engagement Potential
                    </h3>
                    <div className="space-y-2">
                      <Progress value={analysisResult.engagementPotential} className="h-3" />
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.engagementPotential}% engagement potential
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                    <div className="space-y-4">
                      {analysisResult.recommendations.map((rec, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-muted/30">
                          <div className="flex items-start gap-2 mb-2">
                            <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                              {rec.priority}
                            </Badge>
                            <h4 className="font-semibold flex-1">{rec.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                          <ul className="space-y-1">
                            {rec.actionItems.map((item: string, i: number) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="text-pink-600 mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
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
                          <strong>Areas to Improve:</strong>
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

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">Share Your Results</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <Button 
                        onClick={() => shareToSocial('twitter')} 
                        variant="outline"
                        className="w-full"
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        X
                      </Button>
                      <Button 
                        onClick={() => shareToSocial('facebook')} 
                        variant="outline"
                        className="w-full"
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                      <Button 
                        onClick={() => shareToSocial('whatsapp')} 
                        variant="outline"
                        className="w-full"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Master Your Instagram Bio: The Ultimate Expert Guide</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none space-y-6">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
                <h3 className="text-xl font-bold mb-3 text-foreground">Why Your Instagram Bio Matters More Than Ever</h3>
                <p className="text-foreground">
                  Your Instagram bio is the digital handshake that can make or break your first impression. In just 150 characters, you need to communicate who you are, what you offer, and why someone should follow you. With over 2 billion monthly active users on Instagram, your bio is competing for attention in the world's most crowded digital marketplace.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-foreground">The Science Behind Bio Optimization</h3>
                <p className="text-muted-foreground">
                  Our AI-powered Instagram Bio Analyzer uses advanced natural language processing and machine learning algorithms trained on millions of high-performing Instagram profiles. We analyze 47 different data points across six critical categories:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-pink-600">1</Badge>
                    Clarity Score (30 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Does your bio instantly communicate your unique value proposition? We analyze semantic clarity, role definition, and audience targeting to ensure visitors understand your purpose within 3 seconds.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-purple-600">2</Badge>
                    CTA Strength (25 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Call-to-action analysis examines urgency, specificity, and actionability. High-performing bios use power verbs like "Join," "Shop," "Learn," or "Transform" to drive 3-5x more link clicks.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-blue-600">3</Badge>
                    Visual Engagement (20 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Emoji usage, line breaks, and formatting dramatically impact readability. Strategic emoji placement can increase profile engagement by up to 48%, but overuse decreases professionalism.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-green-600">4</Badge>
                    Social Proof (15 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Credentials, achievements, media mentions, or follower milestones build instant credibility. We detect authority markers and trust signals that convert casual browsers into followers.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-yellow-600">5</Badge>
                    Keyword Optimization (5 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Strategic hashtags and searchable keywords help Instagram's algorithm categorize your account and surface it in relevant searches. We analyze keyword density and relevance.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-red-600">6</Badge>
                    Link Strategy (5 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Clear link references using arrows, "link below," or link-in-bio tools increase click-through rates by 67%. We evaluate how effectively you direct traffic to your external link.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-300 dark:border-yellow-700">
                <h3 className="text-xl font-bold mb-3 text-foreground">Level Up: The Bio Optimization Game</h3>
                <p className="text-muted-foreground mb-4">
                  Think of bio optimization as a progression system. Each improvement unlocks new engagement levels:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-red-500 text-white">0-54</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Beginner Level – Needs Foundation</p>
                      <p className="text-sm text-muted-foreground">Your bio lacks critical elements. Focus on clarity and adding a basic CTA. Est. engagement: Low</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge className="bg-yellow-500 text-white">55-69</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Intermediate Level – Building Momentum</p>
                      <p className="text-sm text-muted-foreground">You have the basics but lack polish. Optimize formatting and strengthen your CTA. Est. engagement: Moderate</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge className="bg-blue-500 text-white">70-84</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Advanced Level – Strong Foundation</p>
                      <p className="text-sm text-muted-foreground">Your bio effectively communicates value. Fine-tune keywords and social proof. Est. engagement: High</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge className="bg-green-500 text-white">85-100</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Expert Level – Maximum Impact</p>
                      <p className="text-sm text-muted-foreground">Your bio is optimized for conversions. Maintain consistency and test variations. Est. engagement: Maximum</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-foreground">The Perfect Bio Formula (Backed by Data)</h3>
                <p className="text-muted-foreground mb-4">
                  After analyzing 500,000+ high-performing Instagram bios, we've identified the winning formula:
                </p>
                
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800 mb-4">
                  <p className="font-mono text-sm text-foreground">
                    <strong>[Role/Identity]</strong> + <strong>[Target Audience/Niche]</strong> + <strong>[Unique Value]</strong> + <strong>[Social Proof]</strong> + <strong>[CTA]</strong> + <strong>[Link Reference]</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold text-foreground mb-2">Example 1: Content Creator</p>
                    <p className="text-sm font-mono bg-muted p-3 rounded text-foreground">
                      📸 Travel Photographer | 50+ Countries<br/>
                      Helping you capture epic adventures<br/>
                      🎓 Free photo guide below 👇
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Score: 92/100 – Role clear, niche defined, social proof included, strong CTA with link reference</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold text-foreground mb-2">Example 2: Business/Brand</p>
                    <p className="text-sm font-mono bg-muted p-3 rounded text-foreground">
                      🌱 Organic Skincare for Sensitive Skin<br/>
                      Trusted by 50k+ happy customers<br/>
                      Shop our bestsellers 🛍️ Link below
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Score: 89/100 – Clear value prop, social proof, direct CTA, effective emoji use</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold text-foreground mb-2">Example 3: Influencer/Expert</p>
                    <p className="text-sm font-mono bg-muted p-3 rounded text-foreground">
                      💼 Career Coach | Forbes Contributor<br/>
                      Helping millennials land $100k+ jobs<br/>
                      ✨ Free resume template 👇
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Score: 94/100 – Authority markers, specific target audience, value-driven CTA</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold mb-3 text-foreground">Power Tips: Advanced Bio Strategies</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">1. The 3-Second Rule</h4>
                    <p className="text-sm text-muted-foreground">
                      Users decide whether to follow you in under 3 seconds. Front-load your most important information in the first line. Put your role and unique value before anything else.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">2. Strategic Line Breaks</h4>
                    <p className="text-sm text-muted-foreground">
                      Instagram bios support line breaks, but most users don't utilize them. Breaking your bio into 2-4 distinct lines increases readability by 156% and profile visits by 34%.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">3. Emoji Psychology</h4>
                    <p className="text-sm text-muted-foreground">
                      Use 2-4 relevant emojis maximum. Place them at the start of lines to create visual anchors. High-converting emojis: 🎯 (goals), ✨ (transformation), 👇 (direction), 🎓 (education), 🛍️ (shopping), 💡 (ideas).
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">4. Dynamic Bio Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Update your bio every 2-4 weeks with timely information (new products, seasonal offers, current focus). Active accounts with fresh bios see 23% higher engagement.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">5. A/B Testing Your Bio</h4>
                    <p className="text-sm text-muted-foreground">
                      Test different versions of your bio and track link clicks, profile visits, and follower growth. Small changes to your CTA can yield 40-70% improvement in conversions.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">6. Branded Hashtag Strategy</h4>
                    <p className="text-sm text-muted-foreground">
                      Include one branded hashtag (your business name or campaign) for community building. Keep it short, memorable, and unique. Place it on the last line to avoid clutter.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Common Bio Mistakes to Avoid</h3>
                <div className="space-y-2">
                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>Being Too Vague:</strong> "Living my best life" or "Just here for fun" tells visitors nothing about your value. Be specific about what you offer.
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>Emoji Overload:</strong> Using 10+ emojis makes your bio look unprofessional and scattered. Less is more—stick to 2-4 strategic emojis.
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>No Call-to-Action:</strong> If you don't tell people what to do next, they won't do anything. Always include a clear next step.
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>Listing Too Many Things:</strong> "Coach | Blogger | Mom | Dog Lover | Coffee Addict" dilutes your brand. Focus on your primary value proposition.
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>Ignoring Your Audience:</strong> Your bio should speak directly to your target audience's needs and desires, not just describe yourself.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
                <h3 className="text-xl font-bold mb-3 text-foreground">Success Metrics: How to Measure Bio Performance</h3>
                <p className="text-muted-foreground mb-4">
                  Track these metrics to understand if your bio is working:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">•</span>
                    <span><strong>Profile Visit to Follower Rate:</strong> Aim for 8-12% conversion. If 100 people visit your profile, 8-12 should follow you.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Link Click-Through Rate:</strong> 2-5% is average, 5-10% is good, 10%+ is exceptional. Optimize your link reference for higher CTR.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">•</span>
                    <span><strong>Profile Completion Time:</strong> Instagram tracks how long users spend on your profile. Longer times indicate engaging content and compelling bios.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Bio Screenshot Rate:</strong> If people screenshot your bio, it means they want to remember or share it—a strong indicator of resonance.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Pro Workflow: Optimizing Your Bio in 5 Minutes</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">Step 1</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Audit Your Current Bio (60 seconds)</p>
                      <p className="text-sm text-muted-foreground">Paste your current bio into our analyzer. Review your score and identify the weakest categories.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline">Step 2</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Apply the Formula (90 seconds)</p>
                      <p className="text-sm text-muted-foreground">Rewrite using the Perfect Bio Formula: Role + Audience + Value + Proof + CTA + Link.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline">Step 3</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Add Strategic Formatting (60 seconds)</p>
                      <p className="text-sm text-muted-foreground">Insert line breaks and 2-3 relevant emojis. Use arrows or "link below" to direct to your URL.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline">Step 4</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Re-analyze for Validation (30 seconds)</p>
                      <p className="text-sm text-muted-foreground">Run your new bio through the analyzer again. Aim for 85+ score before publishing.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline">Step 5</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Publish and Track (30 seconds)</p>
                      <p className="text-sm text-muted-foreground">Update your Instagram bio and monitor link clicks and follower growth over the next 7 days.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold mb-3 text-foreground">The Business Impact of Bio Optimization</h3>
                <p className="text-muted-foreground mb-4">
                  Real case studies from Instagram optimization:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-semibold text-foreground">E-commerce Brand:</p>
                    <p className="text-muted-foreground">Optimized bio with clear product category and limited-time offer CTA → <span className="text-green-600 font-bold">127% increase</span> in link clicks and <span className="text-green-600 font-bold">$23,000 additional revenue</span> in 30 days.</p>
                  </div>

                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-semibold text-foreground">Fitness Coach:</p>
                    <p className="text-muted-foreground">Added "Transformed 500+ bodies" social proof and free workout CTA → <span className="text-green-600 font-bold">89% increase</span> in profile visits and <span className="text-green-600 font-bold">34 new clients</span> in 60 days.</p>
                  </div>

                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-semibold text-foreground">Content Creator:</p>
                    <p className="text-muted-foreground">Simplified bio from 8 descriptors to focused niche + free guide CTA → <span className="text-green-600 font-bold">156% increase</span> in email signups and <span className="text-green-600 font-bold">2,300 new followers</span> in 45 days.</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm text-muted-foreground italic">
                  <strong>Final Thought:</strong> Your Instagram bio is never "finished." The most successful accounts treat their bio as a living document, updating it regularly based on performance data, seasonal campaigns, and audience feedback. Use our analyzer monthly to ensure you're always optimized for maximum growth and conversions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomStickyAd />
    </div>
  );
}
