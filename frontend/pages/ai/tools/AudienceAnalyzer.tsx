// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Users, TrendingUp, Target, BarChart3, Sparkles, Brain, Zap, Award, Eye, Heart, MessageCircle, Share2, DollarSign, Rocket, TrendingDown, AlertCircle, CheckCircle2, Info, Clock, Palette, Image as ImageIcon, Download, Lightbulb, Layout, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { SEOHead } from '@/components/SEOHead';
import backend from '~backend/client';

export default function AudienceAnalyzer() {
  const [followers, setFollowers] = useState('');
  const [avgLikes, setAvgLikes] = useState('');
  const [avgComments, setAvgComments] = useState('');
  const [avgShares, setAvgShares] = useState('');
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState<string>('');
  const [contentType, setContentType] = useState<string>('');
  const [postingFrequency, setPostingFrequency] = useState('');
  const [topCompetitors, setTopCompetitors] = useState('');
  const [audienceGoals, setAudienceGoals] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!followers || !avgLikes || !niche) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const engagementRate = ((parseInt(avgLikes) + parseInt(avgComments || '0')) / parseInt(followers)) * 100;
      
      const prompt = `You are an elite social media strategist and audience intelligence expert. Conduct a comprehensive, advanced analysis of this account.

Account Metrics:
- Platform: ${platform || 'Not specified'}
- Followers: ${followers}
- Average Likes: ${avgLikes}
- Average Comments: ${avgComments || 'Not provided'}
- Average Shares: ${avgShares || 'Not provided'}
- Niche: ${niche}
- Primary Content Type: ${contentType || 'Not specified'}
- Posting Frequency: ${postingFrequency || 'Not specified'}
- Calculated Engagement Rate: ${engagementRate.toFixed(2)}%
- Top Competitors: ${topCompetitors || 'Not provided'}
- Audience Goals: ${audienceGoals || 'Not provided'}

Provide an ADVANCED, comprehensive analysis with:

## 1. 🎯 Audience Health Score (1-10)
- Overall quality rating with detailed justification
- Comparison to platform and niche benchmarks
- Key factors elevating or lowering the score

## 2. 📊 Deep Engagement Intelligence
- Engagement rate analysis for ${platform || 'this platform'} in ${niche}
- Likes-to-comments ratio (quality indicator)
- Shares analysis (viral potential)
- Algorithm favorability prediction
- Audience authenticity assessment

## 3. 👥 Psychographic Audience Profile
- Predicted demographics (age, gender, location)
- Psychographic traits (values, interests, lifestyle)
- Pain points and desires
- Buying behavior and decision-making patterns
- Community engagement style
- Emotional triggers that resonate

## 4. 📈 Growth Trajectory Analysis
- Current growth stage assessment
- 3-month and 12-month growth predictions
- Bottlenecks limiting growth
- Untapped growth opportunities
- Viral potential assessment

## 5. 🎬 Content Format Strategy
- Best-performing content types for this audience
- Video vs. image vs. carousel recommendations
- Content length preferences
- Visual aesthetic recommendations (colors, style, tone)
- Trending formats to leverage

## 6. ⏰ Optimal Posting Schedule
- Best days to post (based on niche and audience)
- Ideal posting times (with timezone considerations)
- Recommended posting frequency
- Content calendar structure

## 7. 🔥 Competitor Intelligence
${topCompetitors ? `- Analysis of competitors: ${topCompetitors}
- Competitive advantages to leverage
- Gaps in competitor content you can fill
- Collaboration vs. competition strategy` : `- General competitive landscape in ${niche} niche
- How to differentiate from competitors`}

## 8. 💰 Monetization Roadmap
- Current monetization readiness (1-10)
- Estimated earnings per sponsored post: $X-$Y range
- Revenue stream recommendations (ranked by potential)
- Brand partnership opportunities
- Product/service launch viability
- Audience's willingness to pay assessment

## 9. 🎨 Content Strategy Blueprint
- Content pillar recommendations (3-5 themes)
- Hook strategies for this audience
- Call-to-action effectiveness tips
- Hashtag strategy (number and type)
- Trending topics to leverage
- Content gaps to fill

## 10. 🚨 Red Flags & Warnings
- Engagement quality concerns
- Fake follower indicators (if any)
- Algorithm penalty risks
- Sustainability concerns

## 11. 💡 Advanced Growth Hacks
- Platform-specific algorithm tips for ${platform || 'growth'}
- Collaboration opportunities
- Cross-promotion strategies
- Community building tactics
- Viral content formulas for this niche

## 12. ✅ 30-Day Action Plan
**Week 1:**
- [Specific immediate action items]

**Week 2:**
- [Content strategy adjustments]

**Week 3:**
- [Engagement and community focus]

**Week 4:**
- [Growth and experimentation]

**Quick Wins (Do Today):**
- [3-5 actions they can take right now]

**Stop Doing:**
- [Things that are hurting growth]

**Double Down On:**
- [What's working that needs more focus]

Format using markdown with clear sections (##). Be extremely specific, data-driven, and actionable. Include specific numbers, percentages, and realistic projections. Make this analysis feel personalized and highly valuable.`;

      const response = await backend.ai_analysis.analyze({
        calculatorType: 'audience-analyzer',
        data: {
          followers: parseInt(followers),
          avgLikes: parseInt(avgLikes),
          avgComments: parseInt(avgComments || '0'),
          avgShares: parseInt(avgShares || '0'),
          niche: niche,
          platform: platform,
          contentType: contentType,
          postingFrequency: postingFrequency,
          topCompetitors: topCompetitors,
          audienceGoals: audienceGoals,
          engagementRate: engagementRate
        }
      });

      setAnalysis(response.summary);
    } catch (error) {
      console.error('Error analyzing audience:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze audience. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <SEOHead
        title="AI Audience Intelligence Analyzer - Deep Social Media Analytics & Insights 2024"
        description="Transform your social media strategy with AI-powered audience analysis. Get expert insights on engagement, demographics, growth potential, and monetization opportunities. Free audience analyzer tool for Instagram, TikTok, and more."
        keywords="audience analyzer, social media analytics, engagement rate calculator, follower analysis, Instagram analytics, TikTok analytics, audience demographics, social media insights, influencer analytics, audience intelligence"
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6 shadow-lg">
              <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide">AI-Powered Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Audience Intelligence <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Analyzer
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto font-light leading-relaxed">
              Unlock deep insights about your followers and discover exactly what your audience wants with cutting-edge AI analytics
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-300" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-300" />
                <span>Expert Insights</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-300" />
                <span>Actionable Strategies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Main Analyzer Card */}
        <Card className="shadow-2xl mb-8 border-2 border-blue-200 dark:border-blue-800 hover:shadow-3xl transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              Enter Your Social Media Metrics
            </CardTitle>
            <CardDescription className="text-base">
              Provide your account statistics for comprehensive AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <Label htmlFor="followers" className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Total Followers *
                </Label>
                <Input
                  id="followers"
                  type="number"
                  placeholder="e.g., 10,000"
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                  className="text-lg h-12 border-2 focus:border-blue-500 transition-all"
                />
                <p className="text-xs text-muted-foreground">Your current follower count</p>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="niche" className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  Niche/Industry *
                </Label>
                <Input
                  id="niche"
                  placeholder="e.g., Fitness, Fashion, Tech, Food"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="text-lg h-12 border-2 focus:border-purple-500 transition-all"
                />
                <p className="text-xs text-muted-foreground">Your content category or industry</p>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="likes" className="text-base font-semibold flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-600" />
                  Average Likes per Post *
                </Label>
                <Input
                  id="likes"
                  type="number"
                  placeholder="e.g., 500"
                  value={avgLikes}
                  onChange={(e) => setAvgLikes(e.target.value)}
                  className="text-lg h-12 border-2 focus:border-pink-500 transition-all"
                />
                <p className="text-xs text-muted-foreground">Average likes across recent posts</p>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="comments" className="text-base font-semibold flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  Average Comments per Post
                </Label>
                <Input
                  id="comments"
                  type="number"
                  placeholder="e.g., 50"
                  value={avgComments}
                  onChange={(e) => setAvgComments(e.target.value)}
                  className="text-lg h-12 border-2 focus:border-green-500 transition-all"
                />
                <p className="text-xs text-muted-foreground">Average comments per post (optional)</p>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="shares" className="text-base font-semibold flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-orange-600" />
                  Average Shares per Post
                </Label>
                <Input
                  id="shares"
                  type="number"
                  placeholder="e.g., 20"
                  value={avgShares}
                  onChange={(e) => setAvgShares(e.target.value)}
                  className="text-lg h-12 border-2 focus:border-orange-500 transition-all"
                />
                <p className="text-xs text-muted-foreground">Average shares/reposts per post (optional)</p>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="platform" className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-600" />
                  Platform
                </Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform" className="text-lg h-12 border-2">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Your primary social media platform</p>
              </div>

              <div className="space-y-2 group md:col-span-2">
                <Label htmlFor="contentType" className="text-base font-semibold flex items-center gap-2">
                  <Layout className="h-4 w-4 text-pink-600" />
                  Primary Content Type
                </Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger id="contentType" className="text-lg h-12 border-2">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short-video">Short-Form Video (Reels/Shorts/TikToks)</SelectItem>
                    <SelectItem value="long-video">Long-Form Video</SelectItem>
                    <SelectItem value="images">Photos/Images</SelectItem>
                    <SelectItem value="carousels">Carousels/Slideshows</SelectItem>
                    <SelectItem value="mixed">Mixed Content</SelectItem>
                    <SelectItem value="text">Text Posts</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">What format do you post most often?</p>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="frequency" className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-600" />
                  Posting Frequency
                </Label>
                <Input
                  id="frequency"
                  placeholder="e.g., 5 times per week, daily"
                  value={postingFrequency}
                  onChange={(e) => setPostingFrequency(e.target.value)}
                  className="text-lg h-12 border-2 focus:border-teal-500 transition-all"
                />
                <p className="text-xs text-muted-foreground">How often do you post? (optional)</p>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="competitors" className="text-base font-semibold flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-cyan-600" />
                  Top Competitors
                </Label>
                <Input
                  id="competitors"
                  placeholder="e.g., @user1, @user2, @user3"
                  value={topCompetitors}
                  onChange={(e) => setTopCompetitors(e.target.value)}
                  className="text-lg h-12 border-2 focus:border-cyan-500 transition-all"
                />
                <p className="text-xs text-muted-foreground">Similar accounts in your niche (optional)</p>
              </div>

              <div className="space-y-2 group md:col-span-2">
                <Label htmlFor="goals" className="text-base font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  Audience Goals
                </Label>
                <Textarea
                  id="goals"
                  placeholder="e.g., Want to monetize through brand deals, grow to 100K followers, increase engagement rate to 5%"
                  value={audienceGoals}
                  onChange={(e) => setAudienceGoals(e.target.value)}
                  className="text-lg border-2 focus:border-yellow-500 transition-all min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">What are your main goals for your audience? (optional)</p>
              </div>
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={loading}
              className="w-full mt-8 h-14 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Your Audience Intelligence...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-5 w-5" />
                  Analyze My Audience with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <Card className="shadow-2xl animate-fade-in border-2 border-green-300 dark:border-green-800 mb-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardTitle className="flex items-center gap-3 text-2xl justify-between flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg animate-pulse">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  Your Audience Intelligence Report
                </div>
                <Button
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([`# Audience Intelligence Report\n\n${analysis}`], { type: 'text/markdown' });
                    element.href = URL.createObjectURL(file);
                    element.download = `audience-analysis-${new Date().toISOString().split('T')[0]}.md`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    toast({ title: 'Downloaded!', description: 'Your analysis has been saved.' });
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </CardTitle>
              <CardDescription className="text-base">
                AI-generated insights and actionable recommendations tailored to your audience
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">{analysis}</div>
              </div>
              
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Your Metrics at a Glance
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <div className="text-sm text-muted-foreground mb-1">Followers</div>
                    <div className="text-2xl font-bold text-blue-600">{parseInt(followers).toLocaleString()}</div>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/20 rounded-xl border-2 border-pink-200 dark:border-pink-800">
                    <div className="text-sm text-muted-foreground mb-1">Avg. Likes</div>
                    <div className="text-2xl font-bold text-pink-600">{parseInt(avgLikes).toLocaleString()}</div>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                    <div className="text-sm text-muted-foreground mb-1">Engagement Rate</div>
                    <div className="text-2xl font-bold text-green-600">
                      {(((parseInt(avgLikes) + parseInt(avgComments || '0')) / parseInt(followers)) * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                    <div className="text-sm text-muted-foreground mb-1">Platform</div>
                    <div className="text-xl font-bold text-purple-600 capitalize">{platform || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Metrics Reference */}
        <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800 overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Award className="h-5 w-5 text-blue-600" />
              Understanding Your Metrics: The Complete Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-foreground text-lg">Engagement Rate</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="text-red-600 font-semibold">Poor:</span>
                    <span className="text-muted-foreground">&lt;1%</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-orange-600 font-semibold">Good:</span>
                    <span className="text-muted-foreground">3-6%</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">Great:</span>
                    <span className="text-muted-foreground">6-10%</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-blue-600 font-semibold">Excellent:</span>
                    <span className="text-muted-foreground">&gt;10%</span>
                  </p>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="h-5 w-5 text-purple-600" />
                  <h3 className="font-bold text-foreground text-lg">Follower Growth</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="text-orange-600 font-semibold">Slow:</span>
                    <span className="text-muted-foreground">&lt;2% monthly</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">Healthy:</span>
                    <span className="text-muted-foreground">2-5% monthly</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-blue-600 font-semibold">Strong:</span>
                    <span className="text-muted-foreground">5-10% monthly</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-purple-600 font-semibold">Viral:</span>
                    <span className="text-muted-foreground">&gt;10% monthly</span>
                  </p>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl border-2 border-pink-200 dark:border-pink-800 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="h-5 w-5 text-pink-600" />
                  <h3 className="font-bold text-foreground text-lg">Audience Quality</h3>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>High engagement + consistent growth</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Active comment interactions</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Regular shares and saves</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Genuine follower interest</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comprehensive Guide Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Why Audience Intelligence Matters */}
          <Card className="border-2 border-indigo-200 dark:border-indigo-800 hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="h-5 w-5 text-indigo-600" />
                Why Audience Intelligence Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  In today's digital landscape, understanding your audience isn't just important—it's essential. With over 4.5 billion social media users worldwide, the competition for attention is fierce.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-foreground">Our AI-powered analyzer</strong> goes beyond basic metrics to provide deep insights into who your followers are, what they want, and how to serve them better. This translates directly into higher engagement, faster growth, and better monetization opportunities.
                </p>
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg border-l-4 border-indigo-500">
                  <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    💡 Pro Tip: Creators who analyze their audience data regularly see 3x higher engagement rates than those who don't.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Benefits */}
          <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="h-5 w-5 text-green-600" />
                Key Benefits of Audience Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {[
                  { icon: TrendingUp, text: 'Boost engagement rates by understanding what resonates', color: 'text-blue-600' },
                  { icon: Target, text: 'Create content tailored to your audience preferences', color: 'text-purple-600' },
                  { icon: DollarSign, text: 'Unlock monetization opportunities with quality insights', color: 'text-green-600' },
                  { icon: Rocket, text: 'Accelerate growth with data-driven strategies', color: 'text-orange-600' },
                  { icon: Award, text: 'Build authentic connections with your community', color: 'text-pink-600' },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors">
                    <benefit.icon className={`h-5 w-5 ${benefit.color} mt-0.5 flex-shrink-0`} />
                    <span className="text-muted-foreground leading-relaxed">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deep Dive: Understanding Each Metric */}
        <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              Deep Dive: Understanding Each Metric
            </CardTitle>
            <CardDescription className="text-base">
              Master the art of audience analytics with our comprehensive metric guide
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Engagement Rate */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-blue-600" />
                  Engagement Rate: Your Audience Connection Score
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Engagement rate is the percentage of your followers who actively interact with your content. It's calculated as: <strong className="text-foreground">(Likes + Comments + Shares) ÷ Followers × 100</strong>
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-600 mb-2">High Engagement Signals:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Authentic, engaged audience</li>
                      <li>• Content resonates with followers</li>
                      <li>• Strong community building</li>
                      <li>• Higher monetization potential</li>
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-600 mb-2">Low Engagement Signals:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Possible bot/inactive followers</li>
                      <li>• Content not aligned with audience</li>
                      <li>• Poor posting timing</li>
                      <li>• Need strategy adjustment</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-950/50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    📊 Industry Benchmark: Micro-influencers (10K-100K) average 3-5%, while mega-influencers (1M+) typically see 1-2% due to larger, less engaged audiences.
                  </p>
                </div>
              </div>

              {/* Follower Count */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Follower Count: Your Reach Potential
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Your follower count represents your potential reach—the maximum number of people who could see your content. However, <strong className="text-foreground">quality always trumps quantity</strong>.
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg">
                    <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Nano-Influencers (1K-10K)</h4>
                      <p className="text-sm text-muted-foreground">Highest engagement rates, strong niche authority, authentic connections</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg">
                    <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Micro-Influencers (10K-100K)</h4>
                      <p className="text-sm text-muted-foreground">Great engagement, monetization ready, brand partnership opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg">
                    <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Macro-Influencers (100K-1M)</h4>
                      <p className="text-sm text-muted-foreground">Wide reach, established authority, premium brand deals</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments and Shares */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 rounded-xl border-2 border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  Comments & Shares: Depth of Engagement
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  While likes are great, <strong className="text-foreground">comments and shares indicate deeper engagement</strong>. They show your audience is willing to invest time and associate their personal brand with yours.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Comments Matter Because:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Algorithm boost (platform prioritizes)</li>
                      <li>• Community building indicator</li>
                      <li>• Valuable audience feedback</li>
                      <li>• Higher than likes in value</li>
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Shares Are Gold Because:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Exponential reach expansion</li>
                      <li>• Strongest engagement signal</li>
                      <li>• Indicates exceptional value</li>
                      <li>• Viral potential marker</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monetization Insights */}
        <Card className="mb-8 border-2 border-yellow-200 dark:border-yellow-800 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <DollarSign className="h-6 w-6 text-yellow-600" />
              Monetization Insights: Turn Followers into Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Understanding your audience metrics is the first step to monetization. Here's what brands and sponsors look for:
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-900/10 rounded-xl border-2 border-green-300 dark:border-green-700">
                  <div className="text-3xl font-bold text-green-600 mb-2">$10-$100</div>
                  <div className="text-sm font-semibold text-foreground mb-1">Nano-Influencers (1K-10K)</div>
                  <div className="text-xs text-muted-foreground">Per sponsored post. Focus on niche authority and high engagement.</div>
                </div>
                
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-900/10 rounded-xl border-2 border-blue-300 dark:border-blue-700">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$100-$500</div>
                  <div className="text-sm font-semibold text-foreground mb-1">Micro-Influencers (10K-100K)</div>
                  <div className="text-xs text-muted-foreground">Per post. Sweet spot for brand partnerships and consistent income.</div>
                </div>
                
                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-900/10 rounded-xl border-2 border-purple-300 dark:border-purple-700">
                  <div className="text-3xl font-bold text-purple-600 mb-2">$500-$10K+</div>
                  <div className="text-sm font-semibold text-foreground mb-1">Macro-Influencers (100K-1M)</div>
                  <div className="text-xs text-muted-foreground">Per campaign. Premium rates for established creators.</div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/30 p-6 rounded-xl border-2 border-yellow-300 dark:border-yellow-700">
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
                  What Brands Look For:
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground"><strong className="text-foreground">Engagement Rate:</strong> Minimum 2-3% for partnerships</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground"><strong className="text-foreground">Audience Authenticity:</strong> Real, active followers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground"><strong className="text-foreground">Niche Alignment:</strong> Relevant audience demographics</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground"><strong className="text-foreground">Content Quality:</strong> Professional, consistent posting</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground"><strong className="text-foreground">Growth Trend:</strong> Steady upward trajectory</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground"><strong className="text-foreground">Professionalism:</strong> Easy to work with, reliable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actionable Growth Strategies */}
        <Card className="mb-8 border-2 border-pink-200 dark:border-pink-800 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Rocket className="h-6 w-6 text-pink-600" />
              Actionable Growth Strategies for Every Stage
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* For Small Accounts */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  For Nano & Micro-Influencers (1K-100K)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      Focus on:
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Niche domination:</strong> Be the go-to expert in your specific area</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Engagement first:</strong> Reply to every comment, build community</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Consistency:</strong> Post 3-5 times per week minimum</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Collaborations:</strong> Partner with similar-sized creators</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      Avoid:
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold mt-0.5">•</span>
                        <span>Buying followers or engagement (kills credibility)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold mt-0.5">•</span>
                        <span>Posting inconsistently or disappearing for weeks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold mt-0.5">•</span>
                        <span>Ignoring your audience's comments and messages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold mt-0.5">•</span>
                        <span>Trying to appeal to everyone (be niche-specific)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* For Medium Accounts */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  For Growing Accounts (100K-500K)
                </h3>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">💼 Monetization Focus</h4>
                    <p className="text-sm text-muted-foreground">Start reaching out to brands, create a media kit, set your rates based on engagement metrics.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">📊 Data-Driven Decisions</h4>
                    <p className="text-sm text-muted-foreground">Use analytics to double down on what works. Track peak posting times, best-performing content types.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">🎯 Diversification</h4>
                    <p className="text-sm text-muted-foreground">Expand to multiple platforms, create digital products, build email lists for owned audience.</p>
                  </div>
                </div>
              </div>

              {/* Universal Tips */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950/20 dark:to-emerald-900/10 rounded-xl border-2 border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  Universal Growth Principles (All Sizes)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: 'Value First', desc: 'Every post should educate, entertain, or inspire. No filler content.' },
                    { title: 'Authenticity Wins', desc: 'Be genuine. Audiences can spot fake from a mile away.' },
                    { title: 'Test & Iterate', desc: 'Try new content formats, analyze results, refine your strategy.' },
                    { title: 'Community Building', desc: 'Treat followers as community members, not just numbers.' },
                    { title: 'Stay Current', desc: 'Jump on trends early, but only if relevant to your niche.' },
                    { title: 'Long-term Mindset', desc: 'Sustainable growth beats viral spikes. Play the long game.' },
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white dark:bg-gray-900 p-4 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="border-2 border-indigo-200 dark:border-indigo-800 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Info className="h-6 w-6 text-indigo-600" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {[
                {
                  q: 'How often should I analyze my audience metrics?',
                  a: 'Ideally, perform a deep analysis monthly, but check your basic metrics (engagement, growth) weekly. This helps you spot trends early and adjust your strategy quickly. Major changes in your niche or content strategy warrant immediate analysis.'
                },
                {
                  q: 'What\'s more important: followers or engagement?',
                  a: 'Engagement wins every time. An account with 10K highly engaged followers is more valuable than 100K inactive ones. High engagement means: 1) Better algorithm performance, 2) Higher monetization potential, 3) Stronger community, 4) More authentic influence.'
                },
                {
                  q: 'Why is my engagement rate dropping?',
                  a: 'Common causes include: Algorithm changes (platforms constantly update), Inactive follower buildup, Content not resonating, Posting at wrong times, Decreased posting frequency, Or the natural effect of growth (larger accounts typically have lower engagement rates).'
                },
                {
                  q: 'How can I improve my engagement rate?',
                  a: 'Try these proven tactics: Ask questions in captions, Use interactive features (polls, quizzes), Reply to every comment within first hour, Post when your audience is most active, Create share-worthy content, Use trending audio/hashtags strategically, Go live regularly, Create series that keep people coming back.'
                },
                {
                  q: 'When am I ready for brand partnerships?',
                  a: 'You\'re ready when you have: 1) Minimum 5,000 engaged followers, 2) Engagement rate of 2%+ consistently, 3) Clear niche and content theme, 4) Professional content quality, 5) Authentic audience (not bought followers). Many nano-influencers (1K-10K) successfully partner with small brands!'
                },
                {
                  q: 'How do I know if my followers are real?',
                  a: 'Check for: Meaningful comments (not just emojis), Profile pictures and bios on commenters, Consistent engagement across posts, Comments related to your content, Reasonable follower-to-following ratios, Geographic distribution that makes sense. Use our analyzer to get AI insights on audience authenticity!'
                },
              ].map((faq, index) => (
                <div key={index} className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-900/10 rounded-xl border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-foreground mb-2 text-lg">{faq.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Unlock Your Audience Intelligence?
          </h2>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of creators who use our AI-powered analyzer to grow faster, engage better, and monetize smarter.
          </p>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-purple-600 hover:bg-blue-50 text-lg px-8 py-6 h-auto font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Analyze My Audience Now - It's Free!
          </Button>
        </div>
      </div>
    </div>
  );
}
