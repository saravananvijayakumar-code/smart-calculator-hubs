// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Copy, Sparkles, RefreshCw, Type, Zap, Target, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { SEOHead } from '@/components/SEOHead';
import backend from '~backend/client';

export default function CaptionGenerator() {
  const [imageDescription, setImageDescription] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('casual');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!imageDescription.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please describe your image or video.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setCaption('');
    try {
      const response = await backend.caption_gen.generate({
        description: imageDescription,
        platform: platform,
        tone: tone
      });

      setCaption(response.caption);
    } catch (error) {
      console.error('Error generating caption:', error);
      toast({
        title: 'Generation Failed',
        description: 'Unable to generate caption. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(caption);
        toast({
          title: 'Copied!',
          description: 'Caption copied to clipboard.',
        });
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = caption;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          toast({
            title: 'Copied!',
            description: 'Caption copied to clipboard.',
          });
        } catch (err) {
          console.error('Fallback copy failed:', err);
          toast({
            title: 'Copy Failed',
            description: 'Please manually select and copy the text.',
            variant: 'destructive',
          });
        }
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: 'Copy Failed',
        description: 'Please manually select and copy the text.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <SEOHead
        title="AI Caption Generator - Free Social Media Caption Writer | Smart Calculator Hubs"
        description="Generate viral social media captions with AI. Perfect for Instagram, TikTok, Twitter, LinkedIn. Create scroll-stopping captions in seconds. Free caption generator tool."
        keywords="caption generator, AI caption writer, Instagram captions, TikTok captions, social media captions, viral captions, free caption tool"
      />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-6 py-3 rounded-full mb-6 shadow-lg">
            <Type className="h-6 w-6 text-purple-600 animate-pulse" />
            <span className="text-base font-bold text-purple-700 dark:text-purple-300">AI Caption Wizard</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent leading-tight">
            AI Caption Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform boring descriptions into scroll-stopping captions that get likes, comments, and shares 🚀
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border-2 hover:border-purple-300 animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Sparkles className="h-6 w-6 text-purple-600" />
                Generate Your Caption
              </CardTitle>
              <CardDescription className="text-base">Describe your content and let AI work its magic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold">What's your post about?</Label>
                <Textarea
                  id="description"
                  placeholder="E.g., A sunset photo at the beach with palm trees, vibrant orange and purple sky, peaceful and inspiring mood..."
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  rows={5}
                  className="resize-none text-base border-2 focus:border-purple-400 transition-colors"
                />
                <p className="text-sm text-muted-foreground">💡 Tip: The more details, the better the caption!</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="platform" className="text-base font-semibold">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="platform" className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">📸 Instagram</SelectItem>
                      <SelectItem value="tiktok">🎵 TikTok</SelectItem>
                      <SelectItem value="twitter">🐦 Twitter/X</SelectItem>
                      <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                      <SelectItem value="facebook">👍 Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tone" className="text-base font-semibold">Tone & Vibe</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone" className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">😊 Casual & Friendly</SelectItem>
                      <SelectItem value="professional">👔 Professional</SelectItem>
                      <SelectItem value="funny">😂 Funny & Witty</SelectItem>
                      <SelectItem value="inspirational">✨ Inspirational</SelectItem>
                      <SelectItem value="educational">📚 Educational</SelectItem>
                      <SelectItem value="promotional">🎯 Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={loading}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Crafting Your Perfect Caption...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-6 w-6" />
                    Generate Caption Magic ✨
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-2xl bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 border-2 border-purple-200 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Type className="h-6 w-6 text-pink-600" />
                Your Viral Caption
              </CardTitle>
              <CardDescription className="text-base">Ready to copy & paste</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {caption ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800 min-h-[280px] shadow-inner">
                    <p className="text-foreground whitespace-pre-wrap text-lg leading-relaxed">{caption}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleCopy} className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-base shadow-lg">
                      <Copy className="mr-2 h-5 w-5" />
                      Copy Caption
                    </Button>
                    <Button onClick={handleGenerate} variant="outline" disabled={loading} className="h-12 px-6 border-2">
                      <RefreshCw className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                  <div className="text-center space-y-4">
                    <Type className="h-20 w-20 mx-auto opacity-20" />
                    <p className="text-lg">Your AI-generated caption will appear here</p>
                    <p className="text-sm">Fill in the details and click generate!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Educational Content Section */}
        <div className="space-y-8">
          <Card className="border-2 border-purple-300 dark:border-purple-700 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white">
              <CardTitle className="text-3xl flex items-center gap-3">
                <Zap className="h-8 w-8" />
                The Science of Viral Captions: Your Complete Masterclass
              </CardTitle>
              <p className="text-purple-100 text-base mt-2">⏱️ 12-min read | 🎯 Expert Level | 💎 Game-Changing Insights</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert p-8 space-y-8">
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-8 rounded-2xl border-2 border-orange-300">
                <h2 className="text-3xl font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-3">
                  <Target className="h-8 w-8" />
                  Why Your Captions Fail (And How to Fix Them)
                </h2>
                <p className="text-lg leading-relaxed text-foreground">
                  Here's a brutal truth: <strong>90% of social media captions are forgettable trash</strong>. They're generic, boring, and scroll-past-worthy. But you're here because you're ready to join the elite 10% who actually get engagement.
                </p>
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-xl border-2 border-red-300">
                    <h3 className="font-bold text-red-700 dark:text-red-400 mb-3 text-xl">❌ Caption Fails</h3>
                    <ul className="space-y-2 text-sm text-foreground">
                      <li>• "Great day! #blessed #happy"</li>
                      <li>• "Check out my new post!"</li>
                      <li>• "No caption needed 🔥"</li>
                      <li>• Generic motivational quotes</li>
                      <li>• Hashtag vomit with no context</li>
                    </ul>
                    <p className="mt-4 text-xs text-red-600 font-bold">Result: 0.5% engagement rate 😴</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-xl border-2 border-green-300">
                    <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 text-xl">✅ Caption Wins</h3>
                    <ul className="space-y-2 text-sm text-foreground">
                      <li>• Strong hook in first 7 words</li>
                      <li>• Tells a micro-story</li>
                      <li>• Asks engaging questions</li>
                      <li>• Strategic emoji placement</li>
                      <li>• Clear, compelling CTA</li>
                    </ul>
                    <p className="mt-4 text-xs text-green-600 font-bold">Result: 8-15% engagement rate 🚀</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-purple-600 mb-6 flex items-center gap-3">
                  <Award className="h-8 w-8" />
                  The 7-Second Rule: Hook or Die
                </h2>
                <p className="text-lg mb-4">
                  Instagram users spend an average of <strong className="text-purple-600">7 seconds</strong> deciding whether to engage with a post. Your caption's first line is EVERYTHING.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-600 my-6">
                  <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-4 text-xl">🎣 The Hook Formula That Never Fails:</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                      <p className="font-bold text-foreground mb-2">1. Question Hook</p>
                      <p className="text-sm text-muted-foreground italic">"Ever wonder why some people gain 10k followers in a month while you're stuck at 500?"</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                      <p className="font-bold text-foreground mb-2">2. Shocking Statement</p>
                      <p className="text-sm text-muted-foreground italic">"I lost $50,000 because I ignored this one social media rule."</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                      <p className="font-bold text-foreground mb-2">3. Promise Hook</p>
                      <p className="text-sm text-muted-foreground italic">"This 3-step formula tripled my engagement in 14 days (and it'll work for you too)"</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                      <p className="font-bold text-foreground mb-2">4. Curiosity Gap</p>
                      <p className="text-sm text-muted-foreground italic">"Nobody talks about this Instagram feature, but it's the secret to viral posts..."</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-xl">
                  <h3 className="font-bold text-purple-700 dark:text-purple-400 mb-3 text-xl">📊 Data-Backed Hook Performance:</h3>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li><strong>Question hooks:</strong> 2.8x more comments than statements</li>
                    <li><strong>Numbered lists:</strong> "5 ways to..." get 73% more saves</li>
                    <li><strong>Personal stories:</strong> 3.2x higher engagement than generic posts</li>
                    <li><strong>Controversial takes:</strong> 4.1x more shares (use carefully!)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-pink-600 mb-6 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8" />
                  Platform-Specific Caption Strategies
                </h2>
                <p className="text-lg mb-6">
                  One caption does NOT fit all. Here's how to optimize for each platform's unique algorithm and audience:
                </p>

                <div className="space-y-6">
                  <div className="border-2 border-purple-300 rounded-xl p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <h3 className="text-2xl font-bold text-purple-600 mb-4">📸 Instagram: The Storytelling Platform</h3>
                    <div className="space-y-3 text-foreground">
                      <p><strong>Optimal Length:</strong> 138-150 characters (2 lines before "more") for feed + longer story in continuation</p>
                      <p><strong>Hashtag Sweet Spot:</strong> 5-9 hashtags (30 max, but don't use all)</p>
                      <p><strong>Best Practices:</strong></p>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Use line breaks for readability (3-5 lines max per paragraph)</li>
                        <li>Front-load value in first 2 lines before "...more"</li>
                        <li>Include 3-5 emojis max (more = spam)</li>
                        <li>End with clear CTA: "Double tap if you agree" or "Tag someone who needs this"</li>
                        <li>Hide hashtags: Drop 3-5 line breaks, then add hashtags</li>
                      </ul>
                      <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                        <p className="text-xs text-purple-600 font-bold mb-2">WINNING FORMULA:</p>
                        <p className="text-sm font-mono">Hook (7-10 words) + Story/Value (100-200 words) + CTA (1 line) + Hashtags (hidden)</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-cyan-300 rounded-xl p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                    <h3 className="text-2xl font-bold text-cyan-600 mb-4">🎵 TikTok: The Viral Velocity Engine</h3>
                    <div className="space-y-3 text-foreground">
                      <p><strong>Optimal Length:</strong> Under 150 characters (keep it PUNCHY)</p>
                      <p><strong>Hashtag Strategy:</strong> 3-5 hashtags max (trending + niche)</p>
                      <p><strong>Best Practices:</strong></p>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Make it conversation-starter worthy</li>
                        <li>Use trending phrases/slang relevant to your niche</li>
                        <li>Pose questions that beg comments</li>
                        <li>Include POV/storytime hooks when relevant</li>
                        <li>Don't explain the video—enhance it with context</li>
                      </ul>
                      <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                        <p className="text-xs text-cyan-600 font-bold mb-2">VIRAL CAPTION HACKS:</p>
                        <p className="text-sm">• "Wait for it..." (completion rate ↑)</p>
                        <p className="text-sm">• "Part 1/3" (series engagement ↑)</p>
                        <p className="text-sm">• "Controversial opinion:" (comment storm ↑)</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-blue-300 rounded-xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">🐦 Twitter/X: The Thought Leadership Arena</h3>
                    <div className="space-y-3 text-foreground">
                      <p><strong>Optimal Length:</strong> 71-100 characters (short & punchy wins)</p>
                      <p><strong>Hashtag Strategy:</strong> 1-2 hashtags max (more = amateur hour)</p>
                      <p><strong>Best Practices:</strong></p>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Lead with bold claims or hot takes</li>
                        <li>Use thread format for longer insights (1/7, 2/7, etc.)</li>
                        <li>Engage with trending topics strategically</li>
                        <li>Quote retweet with added value, not just emoji reactions</li>
                        <li>End with question to drive replies</li>
                      </ul>
                      <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                        <p className="text-xs text-blue-600 font-bold mb-2">HIGH-ENGAGEMENT FORMATS:</p>
                        <p className="text-sm">• "Unpopular opinion:" (debate starter)</p>
                        <p className="text-sm">• "Here's what nobody tells you about [topic]"</p>
                        <p className="text-sm">• "Thread: How I [achieved result] in [timeframe]"</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-indigo-300 rounded-xl p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <h3 className="text-2xl font-bold text-indigo-600 mb-4">💼 LinkedIn: The Authority Builder</h3>
                    <div className="space-y-3 text-foreground">
                      <p><strong>Optimal Length:</strong> 150-300 characters first paragraph, longer insight below</p>
                      <p><strong>Hashtag Strategy:</strong> 3-5 industry-specific hashtags</p>
                      <p><strong>Best Practices:</strong></p>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Professional ≠ boring (inject personality!)</li>
                        <li>Share lessons, failures, and insights</li>
                        <li>Use single-line paragraphs for mobile readability</li>
                        <li>End with "What's your experience?" type questions</li>
                        <li>Avoid excessive self-promotion (70% value, 30% promotion)</li>
                      </ul>
                      <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                        <p className="text-xs text-indigo-600 font-bold mb-2">ENGAGEMENT GOLD:</p>
                        <p className="text-sm">• "3 years ago I was [struggle]. Today [success]. Here's what changed:"</p>
                        <p className="text-sm">• "The biggest mistake I see in [industry]..."</p>
                        <p className="text-sm">• "Here's what 10 years in [field] taught me:"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-2xl border-2 border-green-300">
                <h2 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-6 flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8" />
                  The Caption Conversion Formula
                </h2>
                <p className="text-lg mb-6 text-foreground">
                  Every caption should follow this proven structure for maximum engagement:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">HOOK (First 7-10 Words)</h3>
                      <p className="text-sm text-muted-foreground">Grab attention immediately. No warmup fluff.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">VALUE/STORY (Middle Section)</h3>
                      <p className="text-sm text-muted-foreground">Deliver the goods. Educate, entertain, or inspire.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">ENGAGEMENT TRIGGER</h3>
                      <p className="text-sm text-muted-foreground">Pose a question, spark debate, or request action.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">CTA (Call-to-Action)</h3>
                      <p className="text-sm text-muted-foreground">Tell them exactly what to do next. Be specific!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">5</div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">HASHTAGS (Strategic Placement)</h3>
                      <p className="text-sm text-muted-foreground">Mix trending, niche, and branded tags. Hide on Instagram.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-orange-600 mb-6">🚀 Advanced Caption Hacks The Pros Use</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border-2 border-orange-300">
                    <h3 className="font-bold text-orange-700 dark:text-orange-400 mb-3 text-lg">💡 The Pattern Interrupt</h3>
                    <p className="text-sm text-foreground mb-2">Start with something unexpected to break scroll mode:</p>
                    <p className="text-xs italic text-muted-foreground">"Delete this app right now. No seriously, hear me out..."</p>
                  </div>
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-300">
                    <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-3 text-lg">🎯 The Specificity Principle</h3>
                    <p className="text-sm text-foreground mb-2">Specific numbers and details = credibility:</p>
                    <p className="text-xs italic text-muted-foreground">"I gained 847 followers in 12 days using this exact method"</p>
                  </div>
                  <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-300">
                    <h3 className="font-bold text-purple-700 dark:text-purple-400 mb-3 text-lg">⚡ The Controversy Catalyst</h3>
                    <p className="text-sm text-foreground mb-2">Politely challenge common beliefs:</p>
                    <p className="text-xs italic text-muted-foreground">"Everyone says 'post daily' but that's terrible advice. Here's why..."</p>
                  </div>
                  <div className="p-6 bg-pink-50 dark:bg-pink-900/20 rounded-xl border-2 border-pink-300">
                    <h3 className="font-bold text-pink-700 dark:text-pink-400 mb-3 text-lg">🔮 The Future Pacing</h3>
                    <p className="text-sm text-foreground mb-2">Help them visualize the outcome:</p>
                    <p className="text-xs italic text-muted-foreground">"Imagine waking up to 100+ notifications. Here's how to make it happen..."</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-8 rounded-2xl border-2 border-red-300">
                <h2 className="text-3xl font-bold text-red-700 dark:text-red-400 mb-6">⚠️ Caption Killers to Avoid</h2>
                <div className="space-y-4 text-foreground">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <p className="font-bold">Asking for engagement directly</p>
                      <p className="text-sm text-muted-foreground">"Please like and share!" = algorithm red flag</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <p className="font-bold">Hashtag stuffing</p>
                      <p className="text-sm text-muted-foreground">30 random hashtags = desperate spam energy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <p className="font-bold">Zero formatting</p>
                      <p className="text-sm text-muted-foreground">Wall of text = instant scroll past</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <p className="font-bold">Generic questions</p>
                      <p className="text-sm text-muted-foreground">"What do you think?" = low-effort garbage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <p className="font-bold">Ignoring your niche</p>
                      <p className="text-sm text-muted-foreground">Random content = confused audience</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white p-10 rounded-2xl text-center shadow-2xl">
                <h2 className="text-4xl font-extrabold mb-4">🎯 Your Caption Mastery Action Plan</h2>
                <p className="text-xl mb-8 text-purple-100">Ready to write captions that convert? Here's your 7-day challenge:</p>
                <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                    <p className="font-bold mb-2">Days 1-2: Research</p>
                    <p className="text-sm text-purple-100">Study top 10 posts in your niche. What captions work?</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                    <p className="font-bold mb-2">Days 3-5: Practice</p>
                    <p className="text-sm text-purple-100">Write 15 captions using this guide. A/B test 3 formats.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                    <p className="font-bold mb-2">Days 6-7: Optimize</p>
                    <p className="text-sm text-purple-100">Analyze what worked. Double down. Refine your formula.</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">📈 Expected Result: 200-400% engagement increase</p>
                <p className="text-sm text-purple-200 mt-4">The difference between 500 and 50,000 followers? Better captions.</p>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
