// @ts-nocheck
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Instagram, Type, Users } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { AffiliateBanner } from '@/components/AffiliateBanner';
import { AutoAdSlot } from '@/components/ads/AutoAdSlot';

const socialTools = [
  {
    icon: Sparkles,
    title: 'Hashtag Generator',
    description: 'Generate 10 trending, relevant hashtags from your content using AI. Perfect for Instagram, Twitter, and all social media platforms.',
    path: '/ai/social/hashtag-generator',
    color: 'from-blue-600 to-purple-600',
    bgColor: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
  },
  {
    icon: TrendingUp,
    title: 'Profile Analyzer',
    description: 'Analyze your social media profile and get instant AI-powered growth tips. Works with Instagram, TikTok, LinkedIn & more.',
    path: '/ai/social/profile-analyzer',
    color: 'from-purple-600 to-pink-600',
    bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
  },
  {
    icon: Instagram,
    title: 'Instagram Bio Analyzer',
    description: 'Get instant AI feedback on your Instagram bio. Optimize clarity, CTA, emojis, and engagement potential in seconds.',
    path: '/ai/social/instagram-bio-analyzer',
    color: 'from-pink-600 to-orange-600',
    bgColor: 'from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20'
  },
  {
    icon: Sparkles,
    title: 'TikTok Profile Score',
    description: 'Analyze your TikTok profile with AI. Get feedback on videos, engagement, posting frequency, and personalized growth strategies.',
    path: '/ai/social/tiktok-profile-score',
    color: 'from-cyan-600 to-purple-600',
    bgColor: 'from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20'
  },
  {
    icon: Type,
    title: 'Caption Generator',
    description: 'Create scroll-stopping captions that boost engagement. AI-powered, platform-optimized captions in seconds.',
    path: '/ai/social/caption-generator',
    color: 'from-purple-600 to-pink-600',
    bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
  },
  {
    icon: Users,
    title: 'Audience Analyzer',
    description: 'Deep insights into your followers. Understand demographics, engagement patterns, and monetization potential.',
    path: '/ai/social/audience-analyzer',
    color: 'from-blue-600 to-indigo-600',
    bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
  }
];

export default function SocialPage() {
  return (
    <>
      <SEOHead
        title="AI Social Media Tools - Smart Calculator Hubs | 6 Free Tools"
        description="Master social media with 6 AI-powered tools: caption generator, hashtag finder, profile analyzer, bio analyzer, and more. Boost your reach and engagement today!"
        keywords="AI social media tools, hashtag generator, caption generator, social media marketing, content creation, Instagram tools, TikTok analytics, brand voice, engagement predictor, trend analyzer"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        <AutoAdSlot placement="top-banner" className="mt-4" />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-6 py-3 rounded-full mb-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
                <span className="text-base font-bold text-blue-700 dark:text-blue-300">6 AI-Powered Social Tools</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Social Media AI Command Center
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Your complete AI arsenal for dominating social media. From viral captions to profile analysis—everything you need to grow your audience and skyrocket engagement 🚀
              </p>
            </div>

            <AutoAdSlot placement="in-feed" className="mb-8" />

            <AutoAdSlot placement="mid-content" className="mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialTools.map((tool, index) => (
                <Card 
                  key={tool.path}
                  className={`group hover:shadow-2xl transition-all duration-500 border-2 hover:border-purple-400 dark:hover:border-purple-600 bg-gradient-to-br ${tool.bgColor} hover:scale-105 animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <tool.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-foreground/70 leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={tool.path}>
                      <Button className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-300 font-semibold`}>
                        Try It Free →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <AutoAdSlot placement="in-article" className="mt-8" />

            <AutoAdSlot placement="mid-content" className="mt-8" />
          </div>
        </div>

        <AutoAdSlot placement="in-article" className="mt-8 mx-auto max-w-4xl px-4" />

        <AutoAdSlot placement="bottom-sticky" className="mt-8" />

        <AffiliateBanner type="amazon-ai" className="mt-12 mx-auto max-w-4xl px-4" />

        <AutoAdSlot placement="in-feed" className="mt-8 mx-auto max-w-4xl px-4" />
      </div>
    </>
  );
}
