// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, Sparkles, TrendingUp, Heart, Brain, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

const moodEmojis = {
  amazing: '😄',
  good: '🙂',
  okay: '😐',
  bad: '😔',
  terrible: '😢'
};

interface MoodAnalysis {
  mood: string;
  insights: string;
  patterns: string[];
  suggestions: string[];
  affirmation: string;
}

export default function MoodJournal() {
  const [mood, setMood] = useState<keyof typeof moodEmojis>('good');
  const [entry, setEntry] = useState('');
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!entry) {
      toast({
        title: 'Missing Entry',
        description: 'Please write something about your day',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const mockAnalysis: MoodAnalysis = {
        mood: mood,
        insights: mood === 'amazing' || mood === 'good'
          ? 'Your entry shows positive energy and gratitude. You\'re experiencing growth and connection, which are key indicators of wellbeing.'
          : mood === 'okay'
          ? 'You\'re experiencing mixed emotions today. This is completely normal - not every day needs to be perfect. Acknowledge your feelings without judgment.'
          : 'Your entry reflects challenging emotions. Remember that difficult days are temporary, and reaching out for support is a sign of strength.',
        patterns: [
          'Social connections appear important to your wellbeing',
          'Physical activity seems to positively impact your mood',
          'You process emotions through reflection'
        ],
        suggestions: [
          'Continue journaling daily to track emotional patterns',
          'Practice 5 minutes of mindful breathing when stressed',
          'Connect with supportive friends or family',
          'Engage in activities that bring you joy',
          'Maintain regular sleep and exercise routines'
        ],
        affirmation: 'You are doing your best, and that is enough. Every day is a new opportunity for growth and healing.'
      };

      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      toast({ title: 'Analysis complete!' });
    }, 2000);
  };

  const shareToSocial = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    if (!analysis) return;
    
    const moodText = mood === 'amazing' || mood === 'good' ? 'positive' : mood === 'okay' ? 'balanced' : 'reflective';
    const shareText = `🧠 Just completed my mood journal analysis! Feeling ${moodText} today.\n\n✨ Track your emotional wellness at www.smartcalculatorhubs.com #MentalHealth #SelfCare #Wellness`;
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-green-900/20 dark:to-teal-900/20">
      <SEOHead
        title="AI Mood Journal - Smart Calculator Hubs"
        description="Track your emotions and get AI-powered insights for better mental wellness. Understand patterns and improve your emotional health."
        keywords="AI mood journal, mental health tracker, wellness journal, emotional intelligence"
      />



      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">AI-Powered Wellness</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              AI Mood Journal
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your emotions and get personalized insights for better mental wellness
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-green-600" />
                Today's Entry
              </CardTitle>
              <CardDescription>
                How are you feeling today? Share your thoughts and emotions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mood">Overall Mood</Label>
                <Select value={mood} onValueChange={(value: any) => setMood(value)}>
                  <SelectTrigger id="mood">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amazing">{moodEmojis.amazing} Amazing</SelectItem>
                    <SelectItem value="good">{moodEmojis.good} Good</SelectItem>
                    <SelectItem value="okay">{moodEmojis.okay} Okay</SelectItem>
                    <SelectItem value="bad">{moodEmojis.bad} Bad</SelectItem>
                    <SelectItem value="terrible">{moodEmojis.terrible} Terrible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="entry">Journal Entry</Label>
                <Textarea
                  id="entry"
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder="Write about your day, your feelings, what's on your mind..."
                  rows={8}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your entries are private and never stored on our servers
                </p>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Your Mood...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    Get AI Insights
                  </>
                )}
              </Button>
            </CardContent>
          </Card>



          {analysis && (
            <>
              <Card className="mb-6 border-2 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-green-600" />
                    Your Daily Affirmation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg italic text-center py-4">{analysis.affirmation}</p>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-green-600" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{analysis.insights}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Observed Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.patterns.map((pattern, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-green-600">•</span>
                          <span>{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-green-600" />
                      Wellness Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-green-600">✓</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-6">
                <Heart className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900 dark:text-blue-100">
                  <strong>Remember:</strong> If you're experiencing persistent feelings of sadness, anxiety, or distress, 
                  please consider reaching out to a mental health professional. This tool is for wellness support, not medical diagnosis.
                </AlertDescription>
              </Alert>

              <Card className="border-2 border-green-200 dark:border-green-800 mb-8">
                <CardContent className="pt-6">
                  <Separator className="mb-4" />
                  <div className="space-y-3">
                    <h4 className="font-semibold">Share Your Wellness Journey</h4>
                    <p className="text-sm text-muted-foreground">Inspire others by sharing your commitment to mental wellness</p>
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

          <Card className="mt-8 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">The Science of Emotional Wellness: Your Journey to Inner Peace</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-6 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🧠 Why Your Feelings Matter (More Than You Think!)</h3>
                  <p>
                    Let's start with a game-changing perspective: emotions aren't just random feelings that happen to you—they're sophisticated data signals from your brain providing valuable information about your needs, values, and environment. Think of emotions as your internal GPS system, constantly recalculating and updating you about whether you're moving toward or away from wellbeing. When you ignore or suppress emotions, you're essentially ignoring critical navigation instructions. When you acknowledge and understand them, you're learning to navigate life with greater skill and intention!
                  </p>
                  <p>
                    Neuroscience research shows that emotional awareness activates the prefrontal cortex—the part of your brain responsible for rational thinking and decision-making. This process, called "affect labeling," has been proven to reduce the intensity of negative emotions by about 50%! Simply naming your feelings ("I'm feeling anxious about this presentation") engages your thinking brain and reduces the power of your emotional brain (the amygdala). It's like having a dimmer switch for overwhelming emotions. Pretty cool, right? This is why journaling isn't just therapeutic fluff—it's a scientifically-backed mental health tool!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">📝 The Transformative Power of Writing</h3>
                  <p>
                    Dr. James Pennebaker, a pioneering researcher in expressive writing, discovered something remarkable: people who wrote about their deepest thoughts and feelings for just 15-20 minutes a day showed significant improvements in mental health, physical health, immune function, and even academic and work performance! The act of converting messy, swirling thoughts into concrete words on a page (or screen) creates what psychologists call "cognitive reorganization"—your brain literally reorganizes information in more coherent, manageable ways.
                  </p>
                  <p>
                    Writing externalizes your inner experience, creating distance between you and your emotions. This doesn't mean disconnecting from your feelings—it means gaining perspective. When emotions are trapped inside your head, they can feel overwhelming and all-consuming. When you write them down, you can observe them more objectively: "I'm experiencing anxiety" rather than "I AM anxiety." This subtle shift is incredibly powerful. You're not your emotions; you're the person experiencing them. That distinction creates space for choice, growth, and healing.
                  </p>
                  <p>
                    The magic of journaling also lies in its privacy. Unlike venting to friends or therapists (both valuable!), journaling requires no social editing. You can be completely honest, messy, irrational, angry, sad, confused—whatever you're genuinely feeling—without worrying about judgment, burdening others, or managing their reactions. This raw honesty with yourself builds authentic self-awareness and emotional intelligence. Our AI provides insights without judgment, creating a safe space for your authentic emotional expression!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🌈 Understanding the Emotional Spectrum</h3>
                  <p>
                    Emotions aren't simply "good" or "bad"—they're informational. Even so-called "negative" emotions serve important purposes. Anxiety warns you about potential threats and helps you prepare. Sadness signals loss and invites reflection. Anger highlights boundary violations and injustices. Guilt indicates misalignment between your actions and values. When you start viewing emotions as messengers rather than enemies, you can receive their messages without being overwhelmed by them.
                  </p>
                  <p>
                    The concept of "emotional granularity"—your ability to identify and differentiate between emotions—is a superpower for mental health. Research by Dr. Lisa Feldman Barrett shows that people with high emotional granularity experience better mental health outcomes and regulate emotions more effectively. Instead of just feeling "bad," can you distinguish between feeling disappointed, frustrated, overwhelmed, lonely, or scared? Each of these emotions suggests different needs and solutions. Our AI helps develop this granularity by analyzing your journal entries and identifying specific emotional patterns you might not notice yourself!
                  </p>
                  <p>
                    Here's something beautiful: you can experience multiple, even contradictory emotions simultaneously. You can feel proud of an accomplishment while also feeling anxious about what comes next. You can love someone while also feeling frustrated with them. You can feel grateful for what you have while still wanting more. This emotional complexity isn't confusion—it's sophisticated human experience. Journaling helps you hold space for this complexity without forcing yourself into simplistic emotional boxes. Life is nuanced, and your emotional experience reflects that beautifully messy reality!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🔄 Patterns, Triggers, and The Path to Self-Mastery</h3>
                  <p>
                    One of the most powerful benefits of consistent mood journaling is pattern recognition. When you journal regularly, you start noticing: "I always feel anxious on Sunday evenings" or "I feel energized after exercising" or "Conflicts with my partner trigger my fear of abandonment." These insights are gold! Patterns reveal triggers (what sparks certain emotions), vulnerabilities (situations where you struggle), and strengths (circumstances where you thrive). With this knowledge, you can make intentional choices to support your wellbeing.
                  </p>
                  <p>
                    Triggers aren't weaknesses—they're information about your nervous system and past experiences. Understanding your triggers doesn't mean avoiding them forever; it means recognizing them early and having strategies ready. If you know public speaking triggers anxiety, you can practice grounding techniques beforehand. If you know loneliness hits hard on weekends, you can proactively schedule social connection. This is emotional intelligence in action: not controlling feelings, but working skillfully with them!
                  </p>
                  <p>
                    Our AI analyzes your journal entries over time to help identify these patterns—spotting connections you might miss. Maybe your mood dips consistently after scrolling social media. Maybe you feel most creative in the mornings. Maybe interactions with a specific person consistently drain your energy. These insights empower you to design a life that supports your emotional wellbeing. You're not at the mercy of random mood swings; you're learning to understand and navigate your unique emotional landscape!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">💪 Building Emotional Resilience (Not Emotional Numbness)</h3>
                  <p>
                    Let's clear up a common misconception: emotional resilience isn't about being tough, unemotional, or "getting over it" quickly. True resilience is the ability to experience difficult emotions without being destroyed by them—to bend without breaking, to feel deeply while maintaining your core stability. It's about emotional flexibility, not emotional rigidity. Resilient people feel the full range of emotions; they've just developed skills to navigate them effectively.
                  </p>
                  <p>
                    Building resilience involves several key practices. First, self-compassion: treating yourself with the same kindness you'd offer a struggling friend. Research by Dr. Kristin Neff shows that self-compassion is more effective than self-esteem for mental health because it doesn't depend on external validation. Second, perspective-taking: recognizing that difficult moments are temporary, not permanent. Third, meaning-making: finding purpose and growth even in painful experiences. Fourth, connection: reaching out for support rather than isolating. Journaling helps develop all these resilience skills!
                  </p>
                  <p>
                    Here's the paradox of emotional resilience: you build it not by avoiding pain but by working through it. Every time you journal through a difficult emotion, you're essentially practicing emotional regulation. You're teaching your brain: "I can handle this feeling. It's uncomfortable but not dangerous. I can sit with this and survive." Over time, this practice creates what psychologists call "stress inoculation"—small doses of manageable stress that build your capacity to handle larger challenges. You're building emotional muscles, and like physical muscles, they strengthen through use!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🧘 Mindfulness Meets Journaling: The Perfect Partnership</h3>
                  <p>
                    Mindfulness—the practice of present-moment awareness without judgment—and journaling are natural partners in emotional wellness. Mindfulness helps you notice your emotions as they arise; journaling helps you process and understand them. Together, they create a powerful feedback loop: mindful awareness provides material for journaling, and journaling deepens mindful self-understanding. Research shows that combining these practices amplifies their individual benefits!
                  </p>
                  <p>
                    When you approach journaling mindfully, you're not just dumping thoughts on a page—you're cultivating curious, compassionate awareness of your inner experience. You might notice physical sensations ("My chest feels tight when I think about tomorrow's meeting"), thought patterns ("I'm telling myself I'm not good enough"), and emotional flavors ("There's sadness underneath my anger"). This rich, detailed awareness gives you more leverage for change because you understand exactly what you're working with.
                  </p>
                  <p>
                    One powerful technique: mindful mood check-ins throughout the day. Set gentle reminders to pause and ask: "What am I feeling right now? Where do I feel it in my body? What do I need?" These micro-check-ins, combined with daily journaling, create comprehensive emotional awareness. You're not waiting for a crisis to pay attention to your emotional state; you're maintaining ongoing awareness like checking the dashboard while driving. This preventive approach to mental health helps you address small issues before they become overwhelming challenges!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🎭 The Relationship Between Thoughts, Feelings, and Behaviors</h3>
                  <p>
                    Cognitive Behavioral Therapy (CBT), one of the most researched therapeutic approaches, is built on a simple but profound insight: thoughts, feelings, and behaviors are interconnected and influence each other. Your thoughts about a situation generate emotional responses, which drive behavioral choices, which reinforce or challenge your original thoughts. Understanding this cycle gives you multiple intervention points for improving your emotional wellbeing!
                  </p>
                  <p>
                    Journaling helps you identify thought distortions—unhelpful thinking patterns like catastrophizing ("This will be a disaster"), black-and-white thinking ("I always fail"), or mind-reading ("They must think I'm incompetent"). When you see these patterns on paper, you can challenge them: "Is this thought factual or interpretive? What evidence supports or contradicts it? What would I tell a friend thinking this way?" This cognitive restructuring doesn't dismiss your feelings; it examines whether your thoughts are accurate and helpful.
                  </p>
                  <p>
                    Our AI provides gentle prompts to help you explore the thought-feeling-behavior connection. When you journal about feeling anxious, we might ask about the thoughts preceding that anxiety or the behaviors it triggered. This helps you map your unique patterns and identify where interventions would be most effective. Sometimes changing thoughts shifts feelings. Sometimes changing behaviors shifts thoughts. Journaling helps you discover which levers work best for you in different situations!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🌱 Self-Compassion: The Antidote to Harsh Self-Criticism</h3>
                  <p>
                    Many people journal with a harsh inner critic narrating: "I'm such an idiot for feeling this way" or "I should be over this by now" or "Everyone else has it together; what's wrong with me?" This self-criticism doesn't motivate improvement—it actually triggers shame, which neuroscience shows shuts down the learning centers of your brain. Self-compassion, conversely, creates psychological safety that enables growth, learning, and healing.
                  </p>
                  <p>
                    Self-compassion has three components: self-kindness (treating yourself gently rather than harshly), common humanity (recognizing that struggle is part of being human, not a personal defect), and mindfulness (acknowledging difficult feelings without over-identifying with them). When you journal with self-compassion, your inner voice sounds like a wise, caring friend: "This is really hard, and it makes sense you're struggling. What would help you feel supported right now?" This shift from self-criticism to self-compassion is transformative!
                  </p>
                  <p>
                    Research consistently shows that self-compassionate people have better mental health, greater life satisfaction, more motivation, and ironically, higher standards for themselves than self-critical people. Why? Because self-compassion provides a secure foundation from which to take risks, make mistakes, and grow. When you know you'll treat yourself kindly regardless of outcomes, you're freer to try challenging things. Our AI responds to your journal entries with validation and gentle encouragement, modeling the self-compassionate voice you're developing internally!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🔬 The Neuroscience of Emotional Regulation</h3>
                  <p>
                    Your brain has remarkable neuroplasticity—the ability to form new neural pathways throughout your life. Every time you practice emotional regulation (through journaling, mindfulness, or other strategies), you're literally rewiring your brain! The pathways between your prefrontal cortex (rational thinking) and amygdala (emotional reactions) strengthen, making emotional regulation easier over time. It's like building a superhighway between these brain regions, allowing smoother communication.
                  </p>
                  <p>
                    Chronic stress and unprocessed emotions keep your nervous system in a heightened state of activation, leading to anxiety, irritability, sleep problems, and physical health issues. Regular emotional processing through journaling helps discharge this built-up emotional energy, allowing your nervous system to return to baseline. Think of it like releasing steam from a pressure cooker—without release, pressure builds dangerously; with healthy release, the system operates smoothly!
                  </p>
                  <p>
                    Neuroscientists have also discovered that positive emotions aren't just the absence of negative ones—they're distinct neurochemical experiences that build resources for resilience. Barbara Fredrickson's "broaden-and-build" theory shows that positive emotions expand your thinking and build lasting personal resources like creativity, social connections, and problem-solving skills. Journaling about gratitude, joy, and accomplishments isn't just feel-good fluff—it's strategically building your psychological resource bank for future challenges!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🎯 Different Journaling Techniques for Different Needs</h3>
                  <p>
                    <strong className="text-foreground">Stream-of-consciousness writing:</strong> Write continuously without editing or censoring for 10-20 minutes. This bypasses your internal filter and accesses deeper thoughts and feelings. Perfect for when you feel overwhelmed but can't pinpoint why.
                  </p>
                  <p>
                    <strong className="text-foreground">Gratitude journaling:</strong> List 3-5 things you're grateful for daily. Research shows this simple practice significantly increases happiness and wellbeing over time. It rewires your brain to notice positive aspects of life more readily.
                  </p>
                  <p>
                    <strong className="text-foreground">Prompted reflection:</strong> Use specific questions to guide exploration: "What drained my energy today? What energized me? What am I avoiding? What do I need right now?" Questions direct your attention to areas you might overlook in freeform writing.
                  </p>
                  <p>
                    <strong className="text-foreground">Dialogue journaling:</strong> Have a written conversation between different parts of yourself—your anxious self and confident self, your inner critic and inner nurturer. This technique, borrowed from Internal Family Systems therapy, helps integrate different aspects of your psyche.
                  </p>
                  <p>
                    <strong className="text-foreground">Future-self journaling:</strong> Write from the perspective of your future self looking back on current challenges. This creates helpful distance and perspective: "Looking back, I'm grateful I went through this because..." Our AI adapts suggestions based on your current emotional state, recommending techniques that match your needs!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🌟 When Journaling Isn't Enough: Knowing When to Seek Additional Support</h3>
                  <p>
                    Journaling is a powerful self-help tool, but it's not a replacement for professional mental health support when needed. If you're experiencing persistent symptoms of depression (lasting sadness, loss of interest, changes in sleep or appetite), severe anxiety that interferes with daily functioning, trauma responses, or thoughts of self-harm, please reach out to a mental health professional. Therapists have specialized training in helping you navigate these deeper challenges safely and effectively.
                  </p>
                  <p>
                    Think of mental health support as a spectrum: journaling and self-care practices at one end, therapy and sometimes medication at the other, with support groups, coaching, and wellness programs in between. Most people benefit from multiple approaches—journaling AND therapy, mindfulness AND social connection, exercise AND professional support. You don't have to choose one; you can build a comprehensive mental wellness toolkit that draws from various resources!
                  </p>
                  <p>
                    Signs that additional support would be helpful: your mood journaling reveals consistent patterns of distress without improvement, you're using journaling to ruminate rather than process, you're struggling to function in daily life, or you simply feel like you need more support than self-help provides. Seeking help isn't weakness—it's wisdom. Just as you'd see a doctor for a physical health concern, mental health professionals exist to support psychological wellbeing. Our AI provides helpful insights, but we're designed to complement, not replace, human connection and professional care!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">💝 The Gift of Emotional Intelligence</h3>
                  <p>
                    Emotional intelligence—the ability to recognize, understand, and manage emotions in yourself and others—is one of the most valuable life skills you can develop. Research shows it predicts success in relationships, careers, and overall life satisfaction more reliably than IQ! The four components of emotional intelligence (self-awareness, self-management, social awareness, and relationship management) all start with understanding your own emotional experience. Journaling is essentially emotional intelligence training!
                  </p>
                  <p>
                    As you develop greater emotional awareness through journaling, you'll notice improvements rippling through your life. You'll handle conflicts more skillfully, make better decisions under stress, communicate needs more clearly, and navigate change more gracefully. You'll also develop greater empathy—understanding your own emotional complexity makes you more patient and compassionate toward others' emotional experiences. Your inner work becomes outer gift!
                  </p>
                  <p>
                    The journey of emotional development is lifelong. You don't "graduate" from needing emotional awareness and regulation—you simply become more skilled at it. Each decade of life brings new emotional challenges and opportunities for growth. The coping skills that worked in your twenties might need evolution in your forties. Journaling creates a continuous practice of emotional attunement that serves you across all life stages. You're not fixing a broken system; you're developing an increasingly sophisticated relationship with your inner life!
                  </p>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <p className="text-sm italic text-foreground font-medium">
                    <strong>Your Wellness Journey:</strong> Remember, there's no "perfect" way to journal. Some days you'll write pages; other days, a few sentences. Some entries will bring clarity; others will feel messy and confused. All of it is valuable. You're showing up for yourself, honoring your emotional experience, and building the self-awareness that supports lasting wellbeing. That's beautiful, brave work. Keep going, be gentle with yourself, and trust the process. Your emotional wellness matters, and you deserve the care and attention you're giving yourself through this practice. 🌱💚
                  </p>
                </div>
              </CardContent>
            </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Benefits of Mood Journaling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <ul className="list-disc pl-6 space-y-2">
                <li>Identify emotional patterns and triggers</li>
                <li>Process complex emotions in a healthy way</li>
                <li>Track progress in your mental wellness journey</li>
                <li>Develop greater self-awareness and emotional intelligence</li>
                <li>Reduce stress through reflective writing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
}
