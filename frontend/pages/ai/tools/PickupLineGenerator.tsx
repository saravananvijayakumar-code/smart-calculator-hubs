// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { MessageCircle, Sparkles, Share2, Copy, RefreshCw, Twitter, Facebook, MessageCircle as WhatsAppIcon } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { TopBannerAd } from '@/components/ads/TopBannerAd';
import { MidContentAd } from '@/components/ads/MidContentAd';
import { BottomStickyAd } from '@/components/ads/BottomStickyAd';

const pickupLinesByStyle = {
  funny: [
    "Are you a magician? Because whenever I look at you, everyone else disappears.",
    "Do you have a map? I keep getting lost in your eyes.",
    "Is your name Google? Because you have everything I've been searching for.",
    "Are you a parking ticket? Because you've got FINE written all over you."
  ],
  sweet: [
    "I was wondering if you had an extra heart, because mine was just stolen.",
    "Do you believe in love at first sight, or should I walk by again?",
    "Your smile must be a black hole, because it's irresistibly attractive.",
    "If I could rearrange the alphabet, I'd put U and I together."
  ],
  clever: [
    "Are you made of copper and tellurium? Because you're Cu-Te.",
    "If you were a vegetable, you'd be a cute-cumber.",
    "Are you a time traveler? Because I see you in my future.",
    "Do you like Star Wars? Because Yoda one for me!"
  ],
  bold: [
    "I'm not a photographer, but I can picture us together.",
    "Is it hot in here, or is it just our chemistry?",
    "I must be a snowflake, because I've fallen for you.",
    "Are you a camera? Because every time I look at you, I smile."
  ]
};

export default function PickupLineGenerator() {
  const [targetName, setTargetName] = useState('');
  const [interest, setInterest] = useState('');
  const [style, setStyle] = useState<keyof typeof pickupLinesByStyle>('funny');
  const [generatedLine, setGeneratedLine] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!targetName) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a name',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const lines = pickupLinesByStyle[style];
      let line = lines[Math.floor(Math.random() * lines.length)];
      
      if (interest) {
        line += ` I heard you love ${interest} - maybe we could explore that together?`;
      }
      
      setGeneratedLine(line);
      setIsGenerating(false);
    }, 1500);
  };

  const shareToSocial = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    if (!generatedLine) return;
    
    const shareText = `💬 Check out this ${style} pickup line:\n"${generatedLine}"\n\n😄 Generate your own at www.smartcalculatorhubs.com #PickupLines #Dating #Flirting`;
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <SEOHead
        title="AI Pickup Line Generator - Smart Calculator Hubs"
        description="Generate creative, personalized pickup lines using AI. Perfect for breaking the ice with humor and charm."
        keywords="AI pickup lines, pickup line generator, flirting tips, conversation starters"
      />

      <TopBannerAd />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-pink-100 dark:bg-pink-900/30 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-pink-600" />
              <span className="text-sm font-medium text-pink-700 dark:text-pink-300">AI-Powered Charm</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              AI Pickup Line Generator
            </h1>
            <p className="text-lg text-muted-foreground">
              Get creative, personalized pickup lines powered by AI
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-pink-600" />
                Personalize Your Line
              </CardTitle>
              <CardDescription>
                Tell us a bit about the person and the vibe you're going for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="targetName">Their Name</Label>
                <Input
                  id="targetName"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="Enter their name"
                />
              </div>

              <div>
                <Label htmlFor="interest">Their Interest (Optional)</Label>
                <Input
                  id="interest"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  placeholder="E.g., coffee, hiking, books, music..."
                />
              </div>

              <div>
                <Label htmlFor="style">Style</Label>
                <Select value={style} onValueChange={(value: any) => setStyle(value)}>
                  <SelectTrigger id="style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funny">😄 Funny</SelectItem>
                    <SelectItem value="sweet">💕 Sweet</SelectItem>
                    <SelectItem value="clever">🧠 Clever</SelectItem>
                    <SelectItem value="bold">🔥 Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Generate Pickup Line
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <MidContentAd />

          {generatedLine && (
            <Card className="mb-8 border-2 border-pink-200 dark:border-pink-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your AI-Generated Line</span>
                  <Button
                    onClick={handleGenerate}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    New Line
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-300 dark:border-pink-700">
                  <MessageCircle className="h-5 w-5 text-pink-600" />
                  <AlertDescription className="text-lg font-medium mt-2">
                    "{generatedLine}"
                  </AlertDescription>
                </Alert>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">Share Your Line</h4>
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
                      <WhatsAppIcon className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">The Science & Art of Pickup Lines: A Playful Deep Dive</CardTitle>
            </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-6 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🎭 The Psychology Behind the Magic</h3>
                  <p>
                    Ever wondered why some pickup lines make people laugh while others make them cringe? It's all about the delicate dance between confidence, humor, and social intelligence! According to research in social psychology, successful conversation starters share three key ingredients: they create emotional arousal (surprise or amusement), signal positive intent, and demonstrate creativity. When you deliver a well-crafted pickup line, you're essentially performing a micro-comedy routine that says, "Hey, I don't take myself too seriously, and I bet you don't either!"
                  </p>
                  <p>
                    The beauty of pickup lines lies in their self-aware absurdity. Nobody—and we mean <em>nobody</em>—actually expects "Are you a magician? Because whenever I look at you, everyone else disappears" to be taken literally. Instead, these playful openers serve as social lubricants that break the awkward silence and signal approachability. Research from the Journal of Personality and Social Psychology shows that humor is one of the most attractive qualities in initial encounters, ranked even higher than physical attractiveness in long-term compatibility studies!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🧠 The Neuroscience of First Impressions</h3>
                  <p>
                    Here's where it gets fascinating: your brain makes unconscious judgments about someone within the first 100 milliseconds of meeting them. That's faster than you can blink! When you approach someone with a pickup line, you're working with an incredibly tight window to make a positive impression. The key is triggering the right neurochemicals—specifically dopamine (the reward chemical) through surprise and humor, and oxytocin (the bonding hormone) through genuine warmth.
                  </p>
                  <p>
                    The "sweet" style pickup lines we generate tap into what researchers call "affiliative humor"—jokes and witty remarks that bring people together rather than put anyone down. When someone hears a genuinely sweet line like "I was wondering if you had an extra heart, because mine was just stolen," their mirror neurons activate, creating an empathetic response. It's like their brain is saying, "This person is vulnerable, creative, and trying to connect with me. I like that!"
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🎨 The Four Styles Explained (Because Not All Lines Are Created Equal!)</h3>
                  <p>
                    <strong className="text-foreground">Funny Lines:</strong> These are your crowd-pleasers, your ice-shatters, your "I-can't-believe-they-just-said-that" moments. Funny pickup lines work because laughter releases endorphins and creates instant rapport. They're low-pressure because even if the romantic connection doesn't spark, you've at least made someone smile. Pro tip: The key to funny lines is timing and delivery—say them with a twinkle in your eye that shows you know exactly how cheesy they are.
                  </p>
                  <p>
                    <strong className="text-foreground">Sweet Lines:</strong> Ah, the romantics' choice! Sweet lines work by triggering feelings of warmth and appreciation. They're less about getting a laugh and more about creating a moment of genuine connection. These work best when delivered sincerely (but not too seriously—maintain that playful edge!). Studies show that compliments focused on unique qualities rather than just physical appearance are perceived as more genuine and attractive.
                  </p>
                  <p>
                    <strong className="text-foreground">Clever Lines:</strong> For the intellectually playful! Clever lines often involve wordplay, puns, or references that require a moment of mental processing. When someone "gets" a clever line, there's a mini reward in their brain—that "aha!" moment releases dopamine. These lines work especially well with people who value wit and intelligence. The chemistry pun "Are you made of copper and tellurium? Because you're Cu-Te" is a perfect example—it's nerdy, it's playful, and it immediately identifies you as someone who appreciates clever wordplay.
                  </p>
                  <p>
                    <strong className="text-foreground">Bold Lines:</strong> These are for the confident, the brave, the "fortune favors the bold" crowd. Bold lines signal high self-esteem and directness, which can be incredibly attractive—but they require the right delivery. The secret? Own it completely. A bold line said with hesitation falls flat, but the same line delivered with playful confidence can be magnetic. Research in evolutionary psychology suggests that displays of confidence (when genuine, not arrogant) signal social competence and genetic fitness.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🌟 The Personalization Paradox</h3>
                  <p>
                    Here's where our AI gets really clever: we allow you to personalize your line with the person's interests. Why does this matter? Because specificity creates authenticity. When you mention someone's love of hiking or coffee or books, you're demonstrating two critical things: (1) you've paid attention, and (2) you're willing to put in effort. Even though they know you're using a generated line, the personalized addition shows genuine interest.
                  </p>
                  <p>
                    This taps into what psychologists call the "similarity-attraction effect"—we're naturally drawn to people who share our interests and values. By referencing their hobby or passion, you're creating an instant micro-bond. "I heard you love hiking—maybe we could explore that together?" transforms a generic line into a potential shared experience. You're not just asking for their time; you're proposing an adventure aligned with their interests!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">💡 The Delivery Matters More Than You Think</h3>
                  <p>
                    Okay, real talk time: the actual words are only about 30% of communication. The other 70% comes from your tone, body language, facial expressions, and energy. You could deliver the world's best pickup line with a nervous mumble and dead eyes, and it would crash and burn. Conversely, you could say something moderately cheesy with genuine warmth, a playful smile, and relaxed confidence, and it becomes charming.
                  </p>
                  <p>
                    Here's the expert-level secret that dating coaches won't always tell you: the pickup line isn't really about the line at all. It's about giving yourself a structured way to approach someone and start a conversation. It's training wheels for your social courage. The line is just the vehicle; your authentic personality is the destination. When you understand this, the pressure drops dramatically. You're not trying to be perfect—you're just trying to be present, playful, and genuine.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🎯 Context Is King (Or Queen!)</h3>
                  <p>
                    A pickup line that works brilliantly at a casual coffee shop might feel completely out of place at a professional networking event. Reading the room—understanding the social context—is perhaps the most underrated skill in the art of approach. Is the environment loud or quiet? Formal or casual? Are they with friends or alone? Are they wearing headphones (the universal "don't disturb" signal)? All these factors influence which style of line will land best.
                  </p>
                  <p>
                    The best approach artists (yes, it's an art!) are social chameleons who can adapt their style to match the energy of the environment and the person they're approaching. A bold, high-energy line might work great at a party where everyone's already in a social mood. A sweet, low-key line might be better at a bookstore where people are in a more contemplative state. Our AI generates lines across different styles specifically so you can choose the one that fits your context best.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🚀 The Follow-Up: Where Real Connection Happens</h3>
                  <p>
                    Here's something most people get wrong: they think the pickup line IS the conversation. Nope! The pickup line is just the door-opener. What you do in the next 30 seconds determines whether you're having a real conversation or getting politely dismissed. The secret? Transition quickly from the line to genuine curiosity about them. Ask open-ended questions. Listen actively. Show interest in their answers.
                  </p>
                  <p>
                    Research from relationship expert Dr. John Gottman shows that successful relationships are built on a foundation of genuine interest and "turning toward" your partner's bids for connection. This starts from the very first conversation! After delivering your line (and hopefully getting a laugh or smile), ask something like, "So what brings you here today?" or "I'm curious, what are you passionate about?" These questions shift the dynamic from performance to connection.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🎪 The Rejection Reality Check</h3>
                  <p>
                    Let's get real about something important: not every pickup line will work, and that's perfectly okay! In fact, if you're successfully connecting with every person you approach, you're probably not taking enough risks. Rejection is simply data—it tells you either the approach wasn't quite right, the timing was off, or there just wasn't mutual chemistry. None of these things are personal failures.
                  </p>
                  <p>
                    The most successful people in dating (and in life) understand that rejection is a numbers game mixed with skill development. Each approach, whether successful or not, makes you slightly better at reading social cues, adjusting your delivery, and building confidence. Professional comedians don't expect every joke to land. Athletes don't expect to win every game. Why should you expect every approach to result in a connection? Embrace the process, learn from the misses, and celebrate the wins!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🌈 Inclusive Flirting: Because Love Is For Everyone</h3>
                  <p>
                    One beautiful thing about modern pickup lines is that they've evolved beyond the traditionally gendered scripts of decades past. Today's best conversation starters work across all gender identities and sexual orientations because they focus on universal human experiences: humor, connection, shared interests, and playfulness. Whether you're approaching someone at a pride parade, a tech conference, or a farmers market, the principles remain the same: be respectful, be genuine, and be playful.
                  </p>
                  <p>
                    Our AI doesn't assume anything about you or the person you're approaching. The lines we generate are flexible enough to work in any context because they're built on fundamental principles of human attraction: demonstrating confidence, showing interest, creating positive emotions, and opening the door to genuine conversation. Love and connection are universal languages—we're just helping you find your unique accent!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🧪 The Experimental Mindset</h3>
                  <p>
                    Here's a game-changing perspective shift: treat every social interaction as a fun experiment rather than a high-stakes test. Scientists don't get discouraged when a hypothesis doesn't pan out—they gather data and try a new approach! Apply this same mindset to your social life. "Hmm, the funny line got a polite laugh but no real engagement. Let me try a more genuine, sweet approach next time." This removes the ego from the equation and makes the whole process more enjoyable.
                  </p>
                  <p>
                    The experimental mindset also encourages you to try different styles and approaches rather than getting stuck in one pattern. Maybe you think of yourself as the "funny guy" or "sweet girl," but what if trying a clever or bold approach reveals a side of yourself you didn't know existed? Personal growth happens at the edges of our comfort zones. Plus, when you're genuinely experimenting and learning, that curiosity and growth energy becomes attractive in itself!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🎁 The Gift of Making Someone's Day</h3>
                  <p>
                    Even if a pickup line doesn't lead to a date or relationship, you've potentially given someone a gift: you've made them feel noticed, appreciated, and worth approaching. In a world where many people feel invisible or overlooked, a genuine (even if cheesy) attempt at connection can genuinely brighten someone's day. Of course, this only works if you're respectful and can gracefully accept disinterest, but when done right, you're spreading positive energy.
                  </p>
                  <p>
                    Think about it from the other person's perspective: someone thought they were interesting enough, attractive enough, compelling enough to overcome their own nervousness and approach them. That's actually pretty flattering! Even if they're not interested romantically, that acknowledgment can boost their confidence and put a smile on their face. Approach interactions with this abundance mindset—you're not taking something (their time, attention), you're offering something (connection, humor, appreciation).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🔬 The Future of AI-Assisted Romance</h3>
                  <p>
                    We're living in fascinating times where AI can help us become better communicators and more confident approachers. But here's the beautiful paradox: the technology is at its best when it helps us be more authentically human, not less. Our pickup line generator isn't designed to replace your personality—it's designed to give you a starting point that you can infuse with your own energy, delivery, and follow-through.
                  </p>
                  <p>
                    As AI continues to evolve, we're seeing tools that can help with everything from crafting thoughtful messages to suggesting conversation topics based on shared interests. But the magic ingredient—genuine human connection, vulnerability, and chemistry—will always require you to show up fully as yourself. Use the AI as a confidence booster and creativity spark, but remember: the best version of you is already enough. The lines are just training wheels until you're ready to fly solo!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">💫 Your Action Plan for Success</h3>
                  <p>
                    Ready to put this knowledge into action? Here's your expert-level game plan: First, generate a few lines in different styles and practice them out loud (yes, really—hearing yourself say them builds muscle memory). Second, choose 2-3 that feel most authentic to your personality. Third, identify low-pressure situations where you can practice—coffee shops, bookstores, casual social events. Fourth, focus on the follow-up conversation more than the line itself. Fifth, track your progress and celebrate small wins (made someone smile? That's a win!).
                  </p>
                  <p>
                    Remember, the goal isn't perfection—it's progress. Every conversation makes you a slightly better communicator. Every approach builds your confidence a little more. Every genuine connection, whether it lasts five minutes or fifty years, enriches your life. So take that generated line, add your own flavor, deliver it with a smile, and see what happens. The worst case? You get a "no thanks" and move on, slightly braver than before. The best case? You spark a connection that changes your life. Either way, you win by trying!
                  </p>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-lg border-2 border-pink-200 dark:border-pink-800">
                  <p className="text-sm italic text-foreground font-medium">
                    <strong>Final Wisdom:</strong> The most attractive quality isn't the perfect line—it's the courage to put yourself out there, the kindness to make someone feel valued, and the authenticity to be yourself. Use these AI-generated lines as your launchpad, but always land with your own genuine personality. Happy connecting! ✨
                  </p>
                </div>
              </CardContent>
            </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Success</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Be Confident:</strong> Delivery is everything. Say it with a smile!</li>
                <li><strong>Read the Room:</strong> Make sure the timing and setting are appropriate</li>
                <li><strong>Be Genuine:</strong> Follow up with real conversation, not just lines</li>
                <li><strong>Have Fun:</strong> Pickup lines work best when you're having fun with them</li>
                <li><strong>Respect Boundaries:</strong> If they're not interested, gracefully move on</li>
              </ul>
              <p className="text-sm italic pt-3">
                Remember: The best connections come from authentic conversation. Use these as icebreakers, not crutches!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomStickyAd />
    </div>
  );
}
