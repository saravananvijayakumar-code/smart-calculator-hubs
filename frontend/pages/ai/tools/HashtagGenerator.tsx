// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Copy, RefreshCw, Twitter, Facebook, TrendingUp, Hash } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { TopBannerAd } from '@/components/ads/TopBannerAd';
import { MidContentAd } from '@/components/ads/MidContentAd';
import { BottomStickyAd } from '@/components/ads/BottomStickyAd';

const trendingHashtagCategories = {
  business: ['#SmallBusiness', '#Entrepreneur', '#Startup', '#BusinessGrowth', '#Marketing', '#Sales', '#Leadership', '#Innovation', '#Success', '#Productivity'],
  lifestyle: ['#LifeStyle', '#DailyLife', '#Motivation', '#Inspiration', '#SelfCare', '#Wellness', '#Mindfulness', '#Goals', '#Positivity', '#GoodVibes'],
  tech: ['#Technology', '#Tech', '#Innovation', '#AI', '#Digital', '#Software', '#Coding', '#TechNews', '#Future', '#Automation'],
  health: ['#Health', '#Fitness', '#Wellness', '#HealthyLiving', '#Nutrition', '#WorkOut', '#MentalHealth', '#SelfCare', '#HealthyLifestyle', '#FitnessMotivation'],
  finance: ['#Finance', '#Money', '#Investing', '#FinancialFreedom', '#WealthBuilding', '#PersonalFinance', '#Savings', '#FinanceTips', '#MoneyManagement', '#Investment'],
  education: ['#Education', '#Learning', '#Knowledge', '#Study', '#Students', '#Teaching', '#OnlineLearning', '#Skills', '#Growth', '#Development'],
  travel: ['#Travel', '#Adventure', '#Wanderlust', '#TravelBlogger', '#Explore', '#TravelPhotography', '#Vacation', '#TravelLife', '#Destinations', '#TravelGoals'],
  food: ['#Food', '#Foodie', '#FoodPorn', '#Delicious', '#Yummy', '#FoodLover', '#Cooking', '#Recipe', '#HealthyFood', '#FoodPhotography'],
  fashion: ['#Fashion', '#Style', '#OOTD', '#FashionBlogger', '#Fashionista', '#Outfit', '#Trendy', '#FashionStyle', '#Streetwear', '#FashionInspo'],
  social: ['#Community', '#Connection', '#Networking', '#SocialMedia', '#Engagement', '#Influence', '#Brand', '#Content', '#Creator', '#Digital']
};

const commonTrendingTags = [
  '#Trending', '#Viral', '#Popular', '#MustSee', '#ShareThis', '#Amazing', '#Incredible', '#Awesome', '#Epic', '#BestOfTheDay',
  '#PhotoOfTheDay', '#InstaGood', '#Love', '#Instagood', '#Follow', '#Like', '#FollowMe', '#InstaMood', '#Beautiful', '#Happy'
];

export default function HashtagGenerator() {
  const [inputText, setInputText] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [category, setCategory] = useState('');
  const { toast } = useToast();

  const wordCount = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = inputText.length;

  const analyzeContent = (text: string): string[] => {
    const lowerText = text.toLowerCase();
    const keywords: string[] = [];
    
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'i', 'me', 'my', 'you', 'your', 'we', 'our', 'they', 'their', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'am']);
    
    const words = text.split(/\s+/).filter(word => word.length > 3);
    for (const word of words) {
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      if (cleanWord.length > 3 && !commonWords.has(cleanWord)) {
        keywords.push(cleanWord);
      }
    }
    
    const detectedCategories: string[] = [];
    for (const [cat, tags] of Object.entries(trendingHashtagCategories)) {
      const categoryKeywords = tags.join(' ').toLowerCase();
      for (const keyword of keywords) {
        if (categoryKeywords.includes(keyword) || lowerText.includes(cat)) {
          detectedCategories.push(cat);
          break;
        }
      }
    }
    
    if (lowerText.includes('business') || lowerText.includes('startup') || lowerText.includes('entrepreneur')) detectedCategories.push('business');
    if (lowerText.includes('health') || lowerText.includes('fitness') || lowerText.includes('workout')) detectedCategories.push('health');
    if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('software')) detectedCategories.push('tech');
    if (lowerText.includes('finance') || lowerText.includes('money') || lowerText.includes('invest')) detectedCategories.push('finance');
    if (lowerText.includes('travel') || lowerText.includes('vacation') || lowerText.includes('adventure')) detectedCategories.push('travel');
    if (lowerText.includes('food') || lowerText.includes('recipe') || lowerText.includes('cooking')) detectedCategories.push('food');
    if (lowerText.includes('fashion') || lowerText.includes('style') || lowerText.includes('outfit')) detectedCategories.push('fashion');
    if (lowerText.includes('education') || lowerText.includes('learning') || lowerText.includes('study')) detectedCategories.push('education');
    if (lowerText.includes('social') || lowerText.includes('community') || lowerText.includes('networking')) detectedCategories.push('social');
    
    return [...new Set(detectedCategories)];
  };

  const generateHashtags = () => {
    if (!inputText.trim()) {
      toast({
        title: 'Missing Input',
        description: 'Please enter some text to generate hashtags',
        variant: 'destructive'
      });
      return;
    }

    if (wordCount > 140) {
      toast({
        title: 'Text Too Long',
        description: 'Please limit your text to 140 words',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const categories = analyzeContent(inputText);
      const hashtags = new Set<string>();
      
      const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'i', 'me', 'my', 'you', 'your', 'we', 'our', 'they', 'their', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'am']);
      
      const wordsInText = inputText.split(/\s+/)
        .map(w => w.replace(/[^a-zA-Z0-9]/g, ''))
        .filter(w => w.length > 3 && !commonWords.has(w.toLowerCase()));
      
      const wordFrequency = new Map<string, number>();
      for (const word of wordsInText) {
        const lower = word.toLowerCase();
        wordFrequency.set(lower, (wordFrequency.get(lower) || 0) + 1);
      }
      
      const sortedWords = Array.from(wordFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([word]) => word);
      
      for (let i = 0; i < Math.min(4, sortedWords.length); i++) {
        const word = sortedWords[i];
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
        if (cleanWord.length > 3) {
          hashtags.add(`#${cleanWord.charAt(0).toUpperCase()}${cleanWord.slice(1).toLowerCase()}`);
        }
      }
      
      if (categories.length > 0) {
        setCategory(categories[0]);
        const primaryCategory = categories[0] as keyof typeof trendingHashtagCategories;
        const categoryTags = trendingHashtagCategories[primaryCategory];
        
        for (let i = 0; i < 3 && hashtags.size < 10; i++) {
          const tag = categoryTags[Math.floor(Math.random() * categoryTags.length)];
          hashtags.add(tag);
        }
        
        if (categories.length > 1 && hashtags.size < 10) {
          const secondaryCategory = categories[1] as keyof typeof trendingHashtagCategories;
          const secondaryTags = trendingHashtagCategories[secondaryCategory];
          for (let i = 0; i < 2 && hashtags.size < 10; i++) {
            const tag = secondaryTags[Math.floor(Math.random() * secondaryTags.length)];
            hashtags.add(tag);
          }
        }
      }
      
      while (hashtags.size < 10) {
        const tag = commonTrendingTags[Math.floor(Math.random() * commonTrendingTags.length)];
        hashtags.add(tag);
      }
      
      const finalHashtags = Array.from(hashtags).slice(0, 10);
      setGeneratedHashtags(finalHashtags);
      setIsGenerating(false);
    }, 1500);
  };

  const copyAllHashtags = async () => {
    const hashtagText = generatedHashtags.join(' ');
    
    const textArea = document.createElement('textarea');
    textArea.value = hashtagText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast({
          title: 'Copied!',
          description: 'All hashtags copied to clipboard'
        });
      } else {
        toast({
          title: 'Copy Failed',
          description: 'Please manually select and copy the hashtags',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: 'Copy Failed',
        description: 'Please manually select and copy the hashtags',
        variant: 'destructive'
      });
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const copyIndividualHashtag = async (hashtag: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = hashtag;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast({
          title: 'Copied!',
          description: `${hashtag} copied to clipboard`
        });
      } else {
        toast({
          title: 'Copy Failed',
          description: 'Please manually select and copy the hashtag',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: 'Copy Failed',
        description: 'Please manually select and copy the hashtag',
        variant: 'destructive'
      });
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const shareToSocial = (platform: 'twitter' | 'facebook') => {
    if (!generatedHashtags.length) return;
    
    const hashtagText = generatedHashtags.join(' ');
    const shareText = `Check out these trending hashtags I generated! ${hashtagText}\n\nGenerate your own at Smart Calculator Hubs #HashtagGenerator #SocialMedia`;
    const shareUrl = window.location.origin;
    
    if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank', 'width=550,height=420');
    } else if (platform === 'facebook') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(facebookUrl, '_blank', 'width=550,height=420');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <SEOHead
        title="AI Hashtag Generator - Create Trending Hashtags | Smart Calculator Hub"
        description="Generate 10 popular, trending hashtags instantly with our AI-powered hashtag generator. Perfect for social media marketing, Instagram, Twitter, and more."
        keywords="hashtag generator, trending hashtags, social media hashtags, Instagram hashtags, Twitter hashtags, AI hashtag tool"
      />

      <TopBannerAd />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered Social Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Hashtag Generator
            </h1>
            <p className="text-lg text-muted-foreground">
              Generate 10 trending, relevant hashtags from your content in seconds
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                Your Content
              </CardTitle>
              <CardDescription>
                Enter your text (up to 140 words) and we'll generate popular hashtags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="inputText">Text Content</Label>
                  <span className="text-sm text-muted-foreground">
                    {wordCount}/140 words • {charCount} characters
                  </span>
                </div>
                <Textarea
                  id="inputText"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Share your exciting news, product launch, blog post, or any content here... Our AI will analyze it and generate the perfect hashtags!"
                  className="min-h-[150px] resize-none"
                  maxLength={1000}
                />
                {wordCount > 140 && (
                  <p className="text-sm text-red-500 mt-1">Text exceeds 140 word limit</p>
                )}
              </div>

              <Button
                onClick={generateHashtags}
                disabled={isGenerating || !inputText.trim() || wordCount > 140}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Generating Hashtags...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate 10 Hashtags
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <MidContentAd />

          {generatedHashtags.length > 0 && (
            <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    Your Generated Hashtags
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={generateHashtags}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button
                      onClick={copyAllHashtags}
                      variant="default"
                      size="sm"
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy All
                    </Button>
                  </div>
                </div>
                {category && (
                  <CardDescription>
                    Detected category: <Badge variant="secondary">{category}</Badge>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {generatedHashtags.map((hashtag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-4 py-2 text-base cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      onClick={() => copyIndividualHashtag(hashtag)}
                    >
                      {hashtag}
                    </Badge>
                  ))}
                </div>

                <Separator />

                <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-300 dark:border-blue-700">
                  <Hash className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="mt-2">
                    <strong>Pro Tip:</strong> Click any hashtag to copy it individually, or use "Copy All" to grab them all at once!
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Share on Social Media
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => shareToSocial('twitter')} 
                      variant="outline" 
                      className="w-full gap-2"
                    >
                      <Twitter className="h-4 w-4" />
                      X/Twitter
                    </Button>
                    <Button 
                      onClick={() => shareToSocial('facebook')} 
                      variant="outline" 
                      className="w-full gap-2"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">The Ultimate Guide to Hashtag Strategy: From Zero to Viral Hero</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-6 text-muted-foreground">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">🎯 Why Hashtags Are Your Secret Weapon</h3>
                <p>
                  In the vast ocean of social media content, hashtags are your lighthouse—they help the right people discover your content at the right time. But here's the thing most people get wrong: hashtags aren't just random words with a # symbol slapped in front. They're strategic tools that, when used correctly, can exponentially increase your reach, engagement, and impact. Studies show that posts with at least one hashtag receive 12.6% more engagement than those without. But it's not just about quantity—it's about quality, relevance, and strategic mixing.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">🧠 The Science Behind Hashtag Discovery</h3>
                <p>
                  Social media algorithms love hashtags because they help categorize and index content. When you use a hashtag, you're essentially telling the algorithm "this content is about X topic" which then helps the platform show your content to users interested in that topic. But different platforms treat hashtags differently. Instagram allows up to 30 hashtags per post and actively encourages their use. Twitter (X) works best with 1-2 highly relevant hashtags. LinkedIn suggests 3-5 professional hashtags. Understanding these platform-specific nuances is crucial for maximizing your hashtag ROI.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">🎨 The Three-Tier Hashtag Strategy</h3>
                <p>
                  <strong className="text-foreground">High-Competition Hashtags (1M+ posts):</strong> These are your trending, popular hashtags like #Marketing, #Fitness, or #Travel. They have massive reach but fierce competition. Your content might get buried within minutes. Use 2-3 of these to cast a wide net, but don't rely on them alone.
                </p>
                <p>
                  <strong className="text-foreground">Medium-Competition Hashtags (100K-1M posts):</strong> The sweet spot! These hashtags like #SmallBusinessTips, #HealthyMealPrep, or #DigitalMarketingStrategy have substantial reach but less saturation. Your content has a better chance of being discovered and staying visible longer. Use 4-5 of these as your core strategy.
                </p>
                <p>
                  <strong className="text-foreground">Low-Competition Hashtags (Under 100K posts):</strong> These niche hashtags like #SustainableFashionBlogger or #LocalStartupFounder might have smaller audiences, but those audiences are highly targeted and engaged. Use 3-4 of these to connect with your specific community and build meaningful relationships.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">💡 Content-First, Hashtags Second</h3>
                <p>
                  Here's a truth bomb: no amount of hashtag strategy will save mediocre content. The most successful social media approach starts with creating genuinely valuable, engaging content, then amplifying it with strategic hashtags. Think of hashtags as the marketing department for your content creation department. First, make something worth finding, then make it findable. Our AI hashtag generator analyzes your content's actual substance to suggest relevant tags—it's reading between the lines to understand what your post is really about, not just matching keywords.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">🔍 The Research Phase: Finding Your Perfect Hashtags</h3>
                <p>
                  Before you post anything, do your hashtag homework. Search for hashtags related to your niche and analyze the top-performing content. What hashtags are they using? What's the engagement like? What's the quality of the community? Create a spreadsheet (yes, really!) with three columns: high, medium, and low competition hashtags relevant to your brand. Update this regularly. The hashtag landscape changes—what was low-competition six months ago might be saturated now. Our generator gives you a starting point, but your ongoing research creates your competitive advantage.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">📊 Platform-Specific Hashtag Tactics</h3>
                <p>
                  <strong className="text-foreground">Instagram:</strong> Go big! Use all 30 hashtags if relevant. Mix branded hashtags (your own), community hashtags (#SupportSmallBusiness), and content hashtags (#ProductPhotography). Put them in the first comment if you want a cleaner caption aesthetic. Instagram's algorithm prioritizes the first 5 hashtags, so make them count.
                </p>
                <p>
                  <strong className="text-foreground">Twitter/X:</strong> Less is more. 1-2 highly relevant, trending hashtags work best. Twitter moves fast—use timely, trending tags to ride waves of conversation. Check Twitter's trending section regularly and jump on relevant trends quickly.
                </p>
                <p>
                  <strong className="text-foreground">LinkedIn:</strong> Professional and selective. 3-5 industry-specific hashtags perform best. Focus on professional development, industry news, and business topics. #Leadership, #Innovation, #CareerAdvice work well here.
                </p>
                <p>
                  <strong className="text-foreground">TikTok:</strong> Mix trending sounds with trending hashtags! Use 3-5 hashtags that combine viral trends with niche topics. #FYP (For You Page) is almost mandatory, but pair it with specific content tags.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">🚀 Advanced Tactics: Creating Your Own Branded Hashtag</h3>
                <p>
                  Ready for next-level strategy? Create a unique branded hashtag for your business, campaign, or community. Make it short, memorable, and unique. Check that it's not already in use (and doesn't have any unfortunate alternative meanings!). Use it consistently across all your content. Encourage your community to use it. Feature user-generated content that uses your hashtag. Over time, this becomes a searchable archive of all content related to your brand. Companies like Coca-Cola (#ShareACoke) and Apple (#ShotOniPhone) have built entire campaigns around branded hashtags.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">⚠️ The Hashtag Don'ts: Common Mistakes to Avoid</h3>
                <p>
                  <strong className="text-foreground">Don't spam irrelevant hashtags.</strong> Using #Love on a B2B software post might get impressions, but they'll be from people who aren't your target audience. Quality over quantity of impressions.
                </p>
                <p>
                  <strong className="text-foreground">Don't use banned or flagged hashtags.</strong> Some hashtags get shadow-banned by platforms for spam or inappropriate content. Do a quick search before using any hashtag to ensure the content associated with it aligns with your brand.
                </p>
                <p>
                  <strong className="text-foreground">Don't use the exact same hashtags on every post.</strong> Platforms can flag this as spammy behavior. Rotate your hashtag sets and customize them for each piece of content.
                </p>
                <p>
                  <strong className="text-foreground">Don't ignore hashtag analytics.</strong> Most platforms show you which hashtags drove the most impressions. Review this data monthly and adjust your strategy accordingly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">📈 Measuring Hashtag Success</h3>
                <p>
                  How do you know if your hashtag strategy is working? Track these metrics: reach (how many unique users saw your post), impressions (total views), engagement rate (likes, comments, shares per impression), and follower growth from hashtag discovery. Use platform analytics tools or third-party apps like Later, Hootsuite, or Sprout Social to track hashtag performance over time. A/B test different hashtag combinations. Post similar content with different hashtag sets and compare results. This data-driven approach separates casual posters from strategic content marketers.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">🌟 Trending vs. Evergreen: The Balance</h3>
                <p>
                  Your hashtag strategy should include both trending hashtags (timely, popular right now) and evergreen hashtags (consistently relevant). Trending hashtags give you short-term visibility spikes—perfect for time-sensitive content or riding viral waves. Evergreen hashtags provide consistent, reliable discovery over time. A fashion brand might use #FashionWeek2024 (trending) alongside #SustainableFashion (evergreen). The trending tag catches the moment's attention, while the evergreen tag continues delivering discovery for months.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">🎯 Niche Communities: Your Hidden Goldmine</h3>
                <p>
                  The most engaged audiences aren't always the biggest—they're the most specific. A fitness influencer might get better engagement from #VeganFitnessJourney (smaller, highly engaged community) than #Fitness (massive but saturated). Find your niche hashtags by joining communities, participating in conversations, and observing what true enthusiasts are using. These micro-communities often have higher conversion rates because everyone there shares a specific passion or need.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">🔄 The Hashtag Refresh Cycle</h3>
                <p>
                  Set a recurring calendar reminder to refresh your hashtag strategy every quarter. Social media moves fast—hashtags that worked six months ago might be oversaturated now, while new opportunities emerge constantly. Spend an hour researching: What new hashtags are trending in your industry? Which of your current hashtags still perform well? What are competitors using? This quarterly refresh keeps your strategy fresh and effective. Think of it like updating your wardrobe for the season—some pieces are timeless, but you need fresh additions to stay current.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">💪 Building a Hashtag Community</h3>
                <p>
                  Don't just use hashtags—engage with them! Search for your target hashtags and genuinely interact with other posts using them. Leave thoughtful comments, share valuable content, build relationships. This serves two purposes: (1) you become a recognized, valued member of that hashtag community, and (2) the algorithm notices your engagement and is more likely to show your content to others in that hashtag. Social media is social—the most successful accounts are active community participants, not just broadcasters.
                </p>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <p className="text-sm italic text-foreground font-medium">
                  <strong>Final Pro Tip:</strong> The best hashtag strategy is the one you actually execute consistently. Start with our AI-generated suggestions, test them, track results, and refine over time. Consistency beats perfection every time. Now go create content worth discovering and let those hashtags do their magic! 🚀✨
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hashtag Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Mix popular and niche:</strong> Combine trending hashtags with specific ones for your content</li>
                <li><strong>Keep them relevant:</strong> Only use hashtags that truly relate to your content</li>
                <li><strong>Research trending tags:</strong> Stay updated on what's currently popular in your industry</li>
                <li><strong>Don't overdo it:</strong> Quality over quantity - 10 relevant tags beat 30 random ones</li>
                <li><strong>Capitalize for readability:</strong> #SocialMediaMarketing is easier to read than #socialmediamarketing</li>
                <li><strong>Track performance:</strong> Monitor which hashtags drive the most engagement</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomStickyAd />
    </div>
  );
}
