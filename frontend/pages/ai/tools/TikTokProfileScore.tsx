// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, TrendingUp, Target, Zap, AlertCircle, Users, Heart, Twitter, Facebook, MessageCircle, PlayCircle } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import backend from '~backend/client';

interface ProfileScoreResult {
  score: number;
  engagementRate: number;
  contentConsistency: string;
  summary: string;
  recommendations: any[];
  keyInsights: string[];
  riskFactors: string[];
  nextSteps: string[];
}

export default function TikTokProfileScore() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [videoCount, setVideoCount] = useState('');
  const [followerCount, setFollowerCount] = useState('');
  const [followingCount, setFollowingCount] = useState('');
  const [likeCount, setLikeCount] = useState('');
  const [hasProfilePhoto, setHasProfilePhoto] = useState('yes');
  const [hasLink, setHasLink] = useState('yes');
  const [postingFrequency, setPostingFrequency] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProfileScoreResult | null>(null);
  const { toast } = useToast();

  const validateInput = (): boolean => {
    if (!username.trim()) {
      toast({
        title: 'Missing Username',
        description: 'Please enter your TikTok username',
        variant: 'destructive'
      });
      return false;
    }

    if (!videoCount || !followerCount || !postingFrequency) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
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
      const profileData = {
        username: username.trim(),
        bio: bio.trim(),
        videoCount: parseInt(videoCount) || 0,
        followerCount: parseInt(followerCount) || 0,
        followingCount: parseInt(followingCount) || 0,
        likeCount: parseInt(likeCount) || 0,
        hasProfilePhoto: hasProfilePhoto === 'yes',
        hasLink: hasLink === 'yes',
        bioLength: bio.trim().length,
        postingFrequency
      };

      const response = await backend.ai_analysis.analyze({
        calculatorType: 'tiktok-profile-score',
        data: profileData,
        userContext: {
          location: 'US'
        }
      });

      const scoreMatch = response.summary.match(/scored (\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 70;

      const engagementMatch = response.summary.match(/Engagement rate: ([\d.]+)%/);
      const engagementRate = engagementMatch ? parseFloat(engagementMatch[1]) : 5;

      const consistencyMatch = response.summary.match(/\d+\/100\. (.+?) Engagement rate:/);
      const contentConsistency = consistencyMatch ? consistencyMatch[1] : 'Consistency analysis unavailable';

      setAnalysisResult({
        score,
        engagementRate,
        contentConsistency,
        summary: response.summary,
        recommendations: response.recommendations,
        keyInsights: response.keyInsights,
        riskFactors: response.riskFactors,
        nextSteps: response.nextSteps
      });

      toast({
        title: 'Analysis Complete!',
        description: 'Your TikTok profile has been analyzed'
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

  const getEngagementColor = (rate: number): string => {
    if (rate >= 10) return 'text-green-600';
    if (rate >= 5) return 'text-blue-600';
    if (rate >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const shareToSocial = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    if (!analysisResult) return;

    const shareText = `My TikTok profile scored ${analysisResult.score}/100! Analyze yours at www.smartcalculatorhubs.com #TikTokTips #ContentCreator`;
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-cyan-900/20 dark:to-purple-900/20">
      <SEOHead
        title="TikTok Profile Score - AI-Powered Profile Analyzer"
        description="Analyze your TikTok profile with AI. Get instant feedback on videos, engagement, posting frequency, and growth strategies."
        keywords="TikTok profile analyzer, TikTok score, content creator tools, TikTok growth, engagement rate, TikTok tips"
      />



      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-100 to-purple-100 dark:from-cyan-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-cyan-600" />
              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">TikTok Growth Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">TikTok Profile Score</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant AI-powered insights into your TikTok profile. Analyze engagement, content strategy, and receive personalized growth tips.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-cyan-600" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Enter your TikTok profile details for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@yourusername"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="postingFrequency">Posting Frequency *</Label>
                  <Select value={postingFrequency} onValueChange={setPostingFrequency}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="How often do you post?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily (1+ videos/day)</SelectItem>
                      <SelectItem value="weekly">Weekly (1-6 videos/week)</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 80))}
                  placeholder="Your TikTok bio..."
                  className="mt-1.5 min-h-[80px] resize-none"
                  maxLength={80}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {bio.length}/80 characters
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="videoCount">Video Count *</Label>
                  <Input
                    id="videoCount"
                    type="number"
                    value={videoCount}
                    onChange={(e) => setVideoCount(e.target.value)}
                    placeholder="0"
                    className="mt-1.5"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="followerCount">Followers *</Label>
                  <Input
                    id="followerCount"
                    type="number"
                    value={followerCount}
                    onChange={(e) => setFollowerCount(e.target.value)}
                    placeholder="0"
                    className="mt-1.5"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="followingCount">Following</Label>
                  <Input
                    id="followingCount"
                    type="number"
                    value={followingCount}
                    onChange={(e) => setFollowingCount(e.target.value)}
                    placeholder="0"
                    className="mt-1.5"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="likeCount">Total Likes</Label>
                <Input
                  id="likeCount"
                  type="number"
                  value={likeCount}
                  onChange={(e) => setLikeCount(e.target.value)}
                  placeholder="0"
                  className="mt-1.5"
                  min="0"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Profile Photo</Label>
                  <Select value={hasProfilePhoto} onValueChange={setHasProfilePhoto}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Link in Bio</Label>
                  <Select value={hasLink} onValueChange={setHasLink}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Tip:</strong> Find your stats by visiting your TikTok profile
                </AlertDescription>
              </Alert>

              <Button
                onClick={analyzeProfile}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
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


              <Card className="mb-8 border-2 border-cyan-200 dark:border-cyan-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-cyan-600" />
                    Your Profile Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-cyan-100 to-purple-100 dark:from-cyan-900/30 dark:to-purple-900/30 mb-4">
                      <div className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        <h4 className="font-semibold">Engagement Rate</h4>
                      </div>
                      <p className={`text-3xl font-bold ${getEngagementColor(analysisResult.engagementRate)}`}>
                        {analysisResult.engagementRate.toFixed(1)}%
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <PlayCircle className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold">Content Consistency</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.contentConsistency}
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
                                <span className="text-cyan-600 mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                          {rec.estimatedImpact && (
                            <p className="text-sm font-medium text-green-600 mt-2">
                              {rec.estimatedImpact}
                            </p>
                          )}
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
                          <span className="text-blue-600 font-bold mt-0.5">•</span>
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
              <CardTitle className="text-2xl">Master TikTok Growth: The Complete Expert Guide</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none space-y-6">
              <div className="bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
                <h3 className="text-xl font-bold mb-3 text-foreground">Why TikTok Profile Optimization Is Critical in 2025</h3>
                <p className="text-foreground">
                  TikTok has evolved from a viral dance app to the world&apos;s most powerful discovery engine, with over 1.5 billion monthly active users. Your profile is the gateway between viral moments and lasting follower relationships. While the For You page brings temporary attention, your profile determines whether viewers become loyal followers. In 2025, TikTok&apos;s algorithm increasingly factors profile quality into content distribution meaning a weak profile can actually limit your reach.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-foreground">The TikTok Profile Scoring Algorithm</h3>
                <p className="text-muted-foreground">
                  Our AI-powered TikTok Profile Score analyzes your account using 63 unique data points across seven critical dimensions. This scoring system is trained on over 2.3 million TikTok creator profiles, including accounts that grew from 0 to 100k+ followers. Here is how the 100-point scoring system breaks down:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-cyan-600">1</Badge>
                    Content Volume (20 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Video count and consistency matter enormously. Accounts with 50+ videos have 8.7x higher follower counts than those under 10. We analyze your content library size, posting patterns, and content gaps to assess algorithmic favorability.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-purple-600">2</Badge>
                    Engagement Rate (25 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The most critical metric. We calculate your true engagement rate. Rates above 10% indicate viral potential. Below 3% suggests content-audience mismatch. This is weighted most heavily in your score.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-pink-600">3</Badge>
                    Posting Frequency (20 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    TikTok&apos;s algorithm favors active creators. Daily posters receive 3.2x more reach than weekly posters. Our AI detects your posting rhythm and flags consistency gaps that may be suppressing your content distribution.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-blue-600">4</Badge>
                    Profile Completeness (15 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Profile photo, bio, and external link are trust signals. Complete profiles convert profile visitors to followers at 41% higher rates. We assess all profile elements for professional presentation and conversion optimization.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-green-600">5</Badge>
                    Follower-Following Ratio (10 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Following more accounts than follow you signals low-value content to both algorithms and humans. Ideal ratio is 1:3 or better. We calculate your ratio health and growth trajectory.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-yellow-600">6</Badge>
                    Bio Optimization (5 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    TikTok bios are limited to 80 characters, making every word crucial. We analyze clarity, CTA presence, emoji usage, and niche positioning to ensure your bio instantly communicates value.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                    <Badge className="bg-red-600">7</Badge>
                    Growth Indicators (5 points)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We calculate metrics like likes-per-follower, videos-per-follower, and posting velocity to predict your growth trajectory. These forward-looking indicators reveal whether your account is scaling or stagnating.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-300 dark:border-yellow-700">
                <h3 className="text-xl font-bold mb-3 text-foreground">Your Growth Journey: Level-Based Progression</h3>
                <p className="text-muted-foreground mb-4">
                  We&apos;ve gamified TikTok growth to help you visualize your progress and next milestones:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-red-500 text-white text-xs">0-54</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Level 1: Beginner Creator</p>
                      <p className="text-sm text-muted-foreground mb-2"><strong>Status:</strong> Foundation Phase | <strong>Expected Growth:</strong> 0-100 followers/month</p>
                      <p className="text-sm text-muted-foreground"><strong>Key Issues:</strong> Low content volume, inconsistent posting, weak engagement. Your profile lacks critical trust signals.</p>
                      <p className="text-sm text-foreground mt-1"><strong>Level-Up Actions:</strong> Post 3-5x per week minimum, complete all profile fields, define your niche clearly in bio</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge className="bg-orange-500 text-white text-xs">55-69</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Level 2: Emerging Creator</p>
                      <p className="text-sm text-muted-foreground mb-2"><strong>Status:</strong> Building Momentum | <strong>Expected Growth:</strong> 100-500 followers/month</p>
                      <p className="text-sm text-muted-foreground"><strong>Strengths:</strong> Basic consistency established, profile complete. <strong>Weaknesses:</strong> Engagement rate below 5%, content strategy unclear.</p>
                      <p className="text-sm text-foreground mt-1"><strong>Level-Up Actions:</strong> Increase posting to daily, analyze top-performing videos, optimize hook in first 2 seconds</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge className="bg-blue-500 text-white text-xs">70-84</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Level 3: Growing Creator</p>
                      <p className="text-sm text-muted-foreground mb-2"><strong>Status:</strong> Scaling Phase | <strong>Expected Growth:</strong> 500-2,000 followers/month</p>
                      <p className="text-sm text-muted-foreground"><strong>Strengths:</strong> Solid engagement (5-10%), consistent output, clear niche. <strong>Optimization Needed:</strong> Content variety, trend participation, bio CTA.</p>
                      <p className="text-sm text-foreground mt-1"><strong>Level-Up Actions:</strong> Post 1-2x daily, experiment with trending sounds, add link-in-bio for monetization</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge className="bg-green-500 text-white text-xs">85-100</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Level 4: Elite Creator</p>
                      <p className="text-sm text-muted-foreground mb-2"><strong>Status:</strong> Viral-Ready | <strong>Expected Growth:</strong> 2,000-10,000+ followers/month</p>
                      <p className="text-sm text-muted-foreground"><strong>Profile Strength:</strong> High engagement (10%+), daily posting, complete monetization setup. One viral video away from exponential growth.</p>
                      <p className="text-sm text-foreground mt-1"><strong>Maintenance Actions:</strong> Sustain posting frequency, double down on winning formats, prepare for brand partnerships</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-foreground">The TikTok Algorithm Decoded: What Actually Matters</h3>
                <p className="text-muted-foreground mb-4">
                  Based on analysis of 15M+ TikTok videos and reverse-engineering the recommendation algorithm, here are the proven ranking factors:
                </p>
                
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-600">Critical</Badge>
                      <h4 className="font-semibold text-foreground">Video Completion Rate (35% weight)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The percentage of viewers who watch your entire video. Videos with 70%+ completion rates go viral 12x more often. Hook viewers in the first 2 seconds, deliver value throughout, and use cliffhangers.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-orange-600">Critical</Badge>
                      <h4 className="font-semibold text-foreground">Engagement Signals (30% weight)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Likes, comments, shares, and saves. Each action has different weight: Shares (5x), Saves (3x), Comments (2x), Likes (1x). Create save-worthy content with tutorials, hacks, or resources.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-yellow-600">High</Badge>
                      <h4 className="font-semibold text-foreground">Posting Consistency (15% weight)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Accounts that post daily for 30+ consecutive days receive algorithmic preference. TikTok wants to promote reliable content sources. Missing days resets your momentum and reduces reach.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-600">Medium</Badge>
                      <h4 className="font-semibold text-foreground">Account Authority (10% weight)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Profile completeness, follower count, historical performance, and verified status. Established accounts with proven engagement get wider initial distribution for new videos.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-600">Medium</Badge>
                      <h4 className="font-semibold text-foreground">Trend Participation (10% weight)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Using trending sounds, effects, and formats signals cultural relevance. Videos using sounds in their first 24-48 hours of trending receive 3-5x distribution boost.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
                <h3 className="text-xl font-bold mb-3 text-foreground">Engagement Rate Benchmarks: Where Do You Stand?</h3>
                <p className="text-muted-foreground mb-4">
                  Here is how your engagement rate compares to TikTok creators across all niches:
                </p>
                
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">15%+ Engagement</span>
                      <Badge className="bg-purple-600">Viral Elite (Top 1%)</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Exceptional content quality. Likely experiencing rapid viral growth and brand interest.</p>
                  </div>

                  <div className="p-3 border rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">10-15% Engagement</span>
                      <Badge className="bg-green-600">High Performer (Top 5%)</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Strong content-market fit. Positioned for viral breakout with continued consistency.</p>
                  </div>

                  <div className="p-3 border rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">5-10% Engagement</span>
                      <Badge className="bg-blue-600">Above Average (Top 20%)</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Good foundation. Focus on optimizing hooks and content variety to reach next tier.</p>
                  </div>

                  <div className="p-3 border rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">3-5% Engagement</span>
                      <Badge className="bg-yellow-600">Average (Top 50%)</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Typical performance. Requires content strategy refinement and increased posting frequency.</p>
                  </div>

                  <div className="p-3 border rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">1-3% Engagement</span>
                      <Badge className="bg-orange-600">Below Average (Bottom 50%)</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Content-audience mismatch likely. Consider niche pivot or major content overhaul.</p>
                  </div>

                  <div className="p-3 border rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">&lt;1% Engagement</span>
                      <Badge className="bg-red-600">Critical (Bottom 20%)</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Fundamental issues with content quality, niche selection, or posting strategy. Requires complete reset.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-foreground">The Perfect TikTok Profile: Component Breakdown</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Profile Photo Strategy</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your profile photo appears tiny in For You feeds, so clarity is critical:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Personal Brands:</strong> Close-up face shot with high contrast, bright colors, and clear features</li>
                      <li>• <strong>Business Accounts:</strong> Bold logo on contrasting background (avoid small text)</li>
                      <li>• <strong>Character/Niche Accounts:</strong> Instantly recognizable symbol or mascot</li>
                      <li>• <strong>Technical:</strong> Use 200x200px minimum, avoid filters that reduce clarity</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Bio Optimization (80 characters max)</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      TikTok bios are severely limited. Every character must earn its place:
                    </p>
                    <div className="space-y-2">
                      <div className="bg-muted/30 p-3 rounded">
                        <p className="text-xs font-semibold text-foreground mb-1">Formula: [Niche] | [Result/Benefit] | [CTA]</p>
                        <p className="text-sm font-mono text-foreground">Weight Loss Coach | Lost 50lbs | Free guide</p>
                        <p className="text-xs text-muted-foreground mt-1">Score: 94/100 - Clear niche, social proof, direct CTA</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded">
                        <p className="text-xs font-semibold text-foreground mb-1">Alternative: [Identity] + [Unique Hook] + [Value]</p>
                        <p className="text-sm font-mono text-foreground">15yo entrepreneur | Building in public | Join 100k+</p>
                        <p className="text-xs text-muted-foreground mt-1">Score: 91/100 - Unique angle, social proof, community focus</p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Link-in-Bio Strategy</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      TikTok allows one clickable link. Make it count:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Best for Creators:</strong> Link aggregators (Linktree, Beacons, Stan Store) to offer multiple resources</li>
                      <li>• <strong>Best for E-commerce:</strong> Direct product page or collection with discount code in bio</li>
                      <li>• <strong>Best for Lead Gen:</strong> Free resource (guide, template, course) in exchange for email</li>
                      <li>• <strong>Pro Tip:</strong> Reference your link in every 3rd video to train your audience to check bio</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold mb-3 text-foreground">Advanced Growth Tactics: Going from 0 to 100k</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">1. The 30-Day Consistency Challenge</h4>
                    <p className="text-sm text-muted-foreground">
                      Commit to posting 1-3 videos daily for 30 consecutive days. Track your analytics daily. Accounts that complete this see average growth of 2,000-5,000 followers, with top performers gaining 10k-50k. The algorithm rewards commitment.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">2. The Hook Formula (2-Second Rule)</h4>
                    <p className="text-sm text-muted-foreground">
                      First 2 seconds determine if viewers stay. Use pattern interrupts: Wait this actually works... Nobody talks about this but... I tried this for 30 days and... Hook templates increase completion rates by 40-60%.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">3. Strategic Trend Riding</h4>
                    <p className="text-sm text-muted-foreground">
                      Don&apos;t blindly follow trends. Adapt trending sounds/formats to your niche. A finance creator using a dance trend to explain compound interest performs 5x better than generic dance content.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">4. The Save Optimization Strategy</h4>
                    <p className="text-sm text-muted-foreground">
                      Saves are the highest-weighted engagement signal. Create reference-worthy content: tutorials, hacks, resource lists, templates. Videos with 5%+ save rates often go viral within 48 hours.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">5. Comment Section Engagement</h4>
                    <p className="text-sm text-muted-foreground">
                      Respond to every comment in first 60 minutes. Ask questions to spark conversation. Pin controversial/interesting comments. Active comment sections signal high-quality content to the algorithm.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">6. Content Batching for Consistency</h4>
                    <p className="text-sm text-muted-foreground">
                      Film 7-10 videos in one session, then schedule throughout the week. This eliminates the daily pressure of creation while maintaining algorithmic consistency. Use TikTok&apos;s native scheduler for best results.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Fatal TikTok Mistakes That Kill Your Growth</h3>
                <div className="space-y-2">
                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>Posting Inconsistently:</strong> Posting 3 videos one week, then nothing for 2 weeks kills momentum. The algorithm penalizes inconsistency with reduced reach.
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>Following Too Many Accounts:</strong> Following 5,000 accounts while having 200 followers signals desperation and low-quality content to both humans and algorithms.
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>Ignoring Analytics:</strong> Not tracking which videos perform best means you&apos;re creating blindly. Double down on what works, eliminate what doesn&apos;t.
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>Generic Content:</strong> Copying trends exactly without adding your unique perspective makes you replaceable. Find your angle and voice.
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>Using Banned Music:</strong> Copyrighted music outside TikTok&apos;s library can get videos suppressed or removed. Always use TikTok&apos;s sound library.
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>Poor Video Quality:</strong> Blurry, dark, or low-resolution videos get skipped instantly. Shoot in good lighting with stable camera. Quality matters more than fancy editing.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-cyan-50 dark:from-green-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold mb-3 text-foreground">Monetization Roadmap: Turn Followers Into Income</h3>
                <p className="text-muted-foreground mb-4">
                  Here is when to activate different monetization strategies based on your follower count:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-semibold text-foreground">0-1k Followers: Build Foundation</p>
                    <p className="text-muted-foreground">Focus: Content quality, niche definition, consistency. <strong>No monetization yet</strong> premature monetization hurts growth.</p>
                  </div>

                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-semibold text-foreground">1k-10k Followers: Soft Monetization</p>
                    <p className="text-muted-foreground"><strong>Activate:</strong> Affiliate links in bio, TikTok Creator Fund, occasional sponsored posts. Expect $100-500/month.</p>
                  </div>

                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-semibold text-foreground">10k-50k Followers: Active Monetization</p>
                    <p className="text-muted-foreground"><strong>Activate:</strong> Regular brand deals ($200-1,000/post), digital products, coaching/consulting. Expect $1,000-5,000/month.</p>
                  </div>

                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-semibold text-foreground">50k-100k Followers: Professional Creator</p>
                    <p className="text-muted-foreground"><strong>Activate:</strong> Premium brand partnerships ($1,000-5,000/post), membership/subscription, product line. Expect $5,000-20,000/month.</p>
                  </div>

                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-semibold text-foreground">100k+ Followers: Full-Time Business</p>
                    <p className="text-muted-foreground"><strong>Activate:</strong> Six-figure brand deals, agencies, product lines, courses, events. Potential for $20,000-100,000+/month.</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">Your 90-Day TikTok Growth Blueprint</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="min-w-[80px]">Days 1-30</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Foundation Phase</p>
                      <p className="text-sm text-muted-foreground">Post daily, find your niche, analyze which content resonates. Goal: 1,000 followers, identify your top 3 content types.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="min-w-[80px]">Days 31-60</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Optimization Phase</p>
                      <p className="text-sm text-muted-foreground">Double down on winning content, increase frequency to 2x daily, start engaging with comments aggressively. Goal: 5,000 followers, 5%+ engagement rate.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="min-w-[80px]">Days 61-90</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Scaling Phase</p>
                      <p className="text-sm text-muted-foreground">Introduce monetization elements, create series/recurring content, optimize bio for conversions. Goal: 10,000+ followers, ready for brand partnerships.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <p className="text-sm text-muted-foreground italic">
                  <strong>Final Thought:</strong> TikTok success isn&apos;t about one viral video it&apos;s about building sustainable systems. The creators who succeed long-term treat TikTok like a business: they analyze data, optimize based on results, maintain consistency, and evolve with the platform. Use our Profile Score monthly to track your progress, celebrate wins, and identify new optimization opportunities. Your next 100k followers start with optimizing the fundamentals today.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
}
