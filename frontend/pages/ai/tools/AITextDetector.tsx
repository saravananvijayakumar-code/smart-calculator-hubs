// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Bot, Sparkles, Zap, Brain, TrendingUp, AlertCircle, FileText, Gauge } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import { TopBannerAd } from '@/components/ads/TopBannerAd';
import { AutoAdSlot } from '@/components/ads/AutoAdSlot';
import { BottomStickyAd } from '@/components/ads/BottomStickyAd';
import backend from '~backend/client';

interface DetectionResult {
  aiProbability: number;
  confidence: number;
  burstiness: number;
  perplexity: number;
  verdict: string;
  details: {
    sentenceCount: number;
    averageLength: number;
    vocabularyRichness: number;
    patternScore: number;
  };
}

export default function AITextDetector() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const { toast } = useToast();

  const analyzeText = async () => {
    if (!text.trim() || text.trim().length < 50) {
      toast({
        title: 'Text Too Short',
        description: 'Please enter at least 50 characters for analysis',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await backend.ai_text_detector.detect({ text: text.trim() });
      
      setResult(response);

      toast({
        title: 'Analysis Complete!',
        description: 'Your text has been analyzed for AI patterns'
      });
    } catch (error) {
      console.error('Text analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze text. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getProbabilityColor = (prob: number): string => {
    if (prob >= 70) return 'from-red-500 to-orange-500';
    if (prob >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-blue-500';
  };

  const getVerdictBadgeColor = (verdict: string): string => {
    if (verdict.includes('AI-written')) return 'bg-red-500';
    if (verdict.includes('Mixed')) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const faqItems = [
    {
      question: "How does AI text detection work?",
      answer: "AI text detectors analyze patterns in writing including sentence structure, word choice, vocabulary richness, and linguistic patterns that are common in AI-generated content."
    },
    {
      question: "What is perplexity in AI detection?",
      answer: "Perplexity measures how predictable text is. AI-generated text tends to have lower perplexity (more predictable), while human writing often has higher perplexity (more varied and unpredictable)."
    },
    {
      question: "What is burstiness in text analysis?",
      answer: "Burstiness measures variation in sentence length. Human writing typically has high burstiness with varied sentence lengths, while AI text often has more uniform sentence structures."
    },
    {
      question: "How accurate are AI text detectors?",
      answer: "AI text detectors typically range from 60-85% accuracy. They work best on longer texts and should be used as one of multiple verification methods, not as the sole determiner."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <SEOHead
        title="AI Text Detector – Free AI-Generated Content Detector Tool"
        description="Detect AI-generated text with our advanced AI detector. Analyze perplexity, burstiness, and patterns to identify ChatGPT, GPT-4, and other AI-written content. Free & accurate."
        keywords="AI text detector, AI content detector, ChatGPT detector, AI writing detector, detect AI text, AI vs human text, perplexity checker, burstiness analyzer"
      />

      <StructuredData 
        type="WebApplication"
        name="AI Text Detector"
        description="Detect whether text is AI-generated or human-written using advanced analysis"
        url="https://www.smartcalculatorhubs.com/ai/ai-text-detector"
        applicationCategory="UtilityApplication"
      />
      <StructuredData 
        type="FAQPage"
        faqItems={faqItems}
      />

      <TopBannerAd />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full mb-4">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Detection Tool</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Text Detector</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Detect whether text is AI-generated or human-written. Analyze perplexity, burstiness, and linguistic patterns to identify ChatGPT, GPT-4, and other AI-written content.
            </p>
          </div>

          <div>
            <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Text Analysis
                </CardTitle>
                <CardDescription>
                  Paste the text you want to analyze (minimum 50 characters, up to 10,000)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="text">Text to Analyze</Label>
                    <span className={`text-sm ${text.length > 10000 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {text.length.toLocaleString()}/10,000
                    </span>
                  </div>
                  <Textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, 10000))}
                    placeholder="Paste your text here for AI detection analysis...&#10;&#10;Example: In the rapidly evolving landscape of artificial intelligence, machine learning algorithms have demonstrated remarkable capabilities in natural language processing tasks..."
                    className="min-h-[300px] resize-none font-mono text-sm"
                    maxLength={10000}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    For best results, use at least 200 characters. Longer texts provide more accurate analysis.
                  </p>
                </div>

                <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Privacy Note:</strong> Your text is analyzed securely and is not stored or shared
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={analyzeText}
                  disabled={isAnalyzing || !text.trim() || text.trim().length < 50}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Text...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Analyze Text
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {result && (
            <div>
              <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-purple-600" />
                    Detection Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div 
                      className="inline-flex items-center justify-center w-40 h-40 rounded-full mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${result.aiProbability >= 70 ? '#ef4444 0%, #f97316 100%' : result.aiProbability >= 40 ? '#eab308 0%, #f97316 100%' : '#10b981 0%, #3b82f6 100%'})`
                      }}
                    >
                      <div className="w-36 h-36 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                        <div>
                          <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {result.aiProbability}
                          </div>
                          <div className="text-sm text-muted-foreground">% AI</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Badge className={`${getVerdictBadgeColor(result.verdict)} text-white text-lg px-4 py-2`}>
                        {result.verdict}
                      </Badge>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium">AI Probability</span>
                          <span className="text-muted-foreground">{result.aiProbability}%</span>
                        </div>
                        <Progress value={result.aiProbability} className="h-3" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Gauge className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-foreground">Confidence</h3>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">{result.confidence}%</div>
                      <Progress value={result.confidence} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        How certain we are about this result
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-foreground">Burstiness</h3>
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">{result.burstiness}</div>
                      <Progress value={result.burstiness} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Sentence length variation (higher = more human-like)
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-900/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="h-5 w-5 text-pink-600" />
                        <h3 className="font-semibold text-foreground">Perplexity</h3>
                      </div>
                      <div className="text-3xl font-bold text-pink-600 mb-2">{result.perplexity}</div>
                      <Progress value={result.perplexity} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Text unpredictability (higher = more varied)
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-foreground">Pattern Score</h3>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">{result.details.patternScore}</div>
                      <Progress value={result.details.patternScore} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Common AI writing patterns detected
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Text Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-foreground">{result.details.sentenceCount}</div>
                        <div className="text-xs text-muted-foreground">Sentences</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-foreground">{result.details.averageLength}</div>
                        <div className="text-xs text-muted-foreground">Avg Length</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-foreground">{result.details.vocabularyRichness}%</div>
                        <div className="text-xs text-muted-foreground">Vocab Richness</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-foreground">{text.length}</div>
                        <div className="text-xs text-muted-foreground">Characters</div>
                      </div>
                    </div>
                  </div>

                  <Alert className={result.aiProbability >= 70 ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"}>
                    <AlertCircle className={`h-4 w-4 ${result.aiProbability >= 70 ? 'text-red-600' : 'text-green-600'}`} />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>Analysis Summary:</strong> This text shows {result.aiProbability >= 70 ? 'strong indicators of AI generation' : result.aiProbability >= 40 ? 'mixed characteristics that could be either AI or human-written' : 'characteristics typical of human writing'}. 
                      {result.aiProbability >= 70 && ' Common AI patterns, uniform sentence structure, and predictable word choice were detected.'}
                      {result.aiProbability < 40 && ' High variation in sentence structure and rich vocabulary usage suggest human authorship.'}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <AutoAdSlot placement="mid-content" />
            </div>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl">Understanding AI Text Detection: The Complete Guide</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-2xl font-bold mb-3 text-foreground">What Is AI Text Detection?</h3>
                <p className="text-foreground leading-relaxed">
                  AI text detection is the process of analyzing written content to determine whether it was created by artificial intelligence (like ChatGPT, GPT-4, Claude, or Gemini) or by a human writer. As AI language models become increasingly sophisticated, the ability to distinguish between AI-generated and human-written content has become crucial for educators, employers, content moderators, and anyone concerned about content authenticity.
                </p>
                <p className="text-foreground leading-relaxed mt-3">
                  The rise of powerful AI writing tools has revolutionized content creation, but it has also raised important questions about academic integrity, content originality, and information authenticity. AI detectors serve as a critical tool in maintaining standards and verifying the source of written work.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">How AI Text Detectors Work: The Science Behind Detection</h3>
                <p className="text-muted-foreground mb-4">
                  AI text detectors use multiple analytical approaches to identify patterns characteristic of AI-generated content. Our detector analyzes several key metrics:
                </p>
                
                <div className="space-y-4">
                  <div className="p-5 border rounded-lg bg-muted/30">
                    <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                      <Badge className="bg-blue-600">1</Badge>
                      Perplexity Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Perplexity measures how "surprised" a language model is by a piece of text. AI-generated text tends to have low perplexity because the model generates words it finds most predictable. Human writing typically has higher perplexity because humans make less predictable, more creative word choices. A low perplexity score (predictable text) often indicates AI generation, while high perplexity (unpredictable choices) suggests human authorship.
                    </p>
                  </div>

                  <div className="p-5 border rounded-lg bg-muted/30">
                    <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                      <Badge className="bg-purple-600">2</Badge>
                      Burstiness Measurement
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Burstiness refers to the variation in sentence and paragraph length throughout a text. Human writers naturally vary their sentence structures—mixing short, punchy sentences with longer, complex ones for rhythm and emphasis. AI-generated text often exhibits uniform sentence lengths with less variation. High burstiness indicates human writing patterns, while low burstiness suggests AI generation. This is one of the most reliable indicators of AI content.
                    </p>
                  </div>

                  <div className="p-5 border rounded-lg bg-muted/30">
                    <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                      <Badge className="bg-pink-600">3</Badge>
                      Vocabulary Richness
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This metric measures the diversity of word usage by calculating the ratio of unique words to total words. Human writers often use synonyms, varied expressions, and unique phrasings. AI models, despite their vast training data, tend to rely on more common word patterns and may exhibit less lexical diversity in certain contexts. A vocabulary richness score below 40% often indicates repetitive AI patterns.
                    </p>
                  </div>

                  <div className="p-5 border rounded-lg bg-muted/30">
                    <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                      <Badge className="bg-green-600">4</Badge>
                      Pattern Recognition
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      AI models tend to use certain phrases, transitions, and structural patterns more frequently than human writers. Common AI patterns include overuse of words like "furthermore," "moreover," "delve," "leverage," "optimize," and "facilitate." Phrases like "it is important to note" or "one might argue" appear with higher frequency in AI text. Our detector scans for these telltale linguistic fingerprints that reveal AI authorship.
                    </p>
                  </div>

                  <div className="p-5 border rounded-lg bg-muted/30">
                    <h4 className="font-bold mb-2 text-foreground flex items-center gap-2">
                      <Badge className="bg-orange-600">5</Badge>
                      Sentence Structure Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Average sentence length provides insights into writing style. AI-generated text often maintains a consistent sentence length (typically 15-25 words), creating a predictable rhythm. Human writers naturally fluctuate between short impactful statements and longer explanatory sentences. The detector analyzes whether sentence lengths fall within typical AI ranges or show human-like variation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-300 dark:border-yellow-700">
                <h3 className="text-2xl font-bold mb-3 text-foreground">Understanding Your Detection Results</h3>
                <p className="text-muted-foreground mb-4">
                  Our AI detector provides a comprehensive analysis with several scores to help you understand the likelihood of AI generation:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-red-500 text-white">70-100%</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Likely AI-Written</p>
                      <p className="text-sm text-muted-foreground">The text shows strong indicators of AI generation including common AI patterns, uniform structure, and predictable word choices. High confidence that this content was created by an AI language model.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge className="bg-yellow-500 text-white">40-69%</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Mixed / Uncertain</p>
                      <p className="text-sm text-muted-foreground">The text contains characteristics of both AI and human writing. It may be AI-generated content that was heavily edited, human writing influenced by AI tools, or collaborative human-AI authorship. Additional verification recommended.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge className="bg-green-500 text-white">0-39%</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Likely Human-Written</p>
                      <p className="text-sm text-muted-foreground">The text exhibits characteristics typical of human writing including varied sentence structure, high burstiness, rich vocabulary, and natural linguistic patterns. Low probability of AI generation.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Why Perplexity Matters in AI Detection</h3>
                <p className="text-muted-foreground mb-4">
                  Perplexity is a fundamental concept in natural language processing and one of the most powerful indicators of AI-generated text. Here's why it's so important:
                </p>
                
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-5 rounded-lg border border-pink-200 dark:border-pink-800">
                  <h4 className="font-semibold text-foreground mb-2">The Perplexity Paradox</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    When AI generates text, it calculates probabilities for the next word based on the context. It typically chooses high-probability words that "make sense" statistically. This results in text that is coherent but predictable—hence low perplexity. Human writers, however, make choices based on creativity, emotion, personal style, and context that goes beyond statistical likelihood. They use unexpected metaphors, informal expressions, and unique phrasings that increase perplexity.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Example:</strong> An AI might write "The weather was beautiful" (low perplexity, high probability). A human might write "The sky was a canvas of impossible blues" (higher perplexity, less statistically predictable but more creative and personal).
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Understanding Burstiness: The Human Writing Fingerprint</h3>
                <p className="text-muted-foreground mb-4">
                  Burstiness is arguably the most distinctive feature separating human from AI writing. Here's what you need to know:
                </p>

                <div className="space-y-3">
                  <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-foreground">
                      <strong>High Burstiness = Human:</strong> Humans naturally vary sentence length for rhythm, emphasis, and readability. You'll see short sentences for impact. Then longer, more complex sentences that explore ideas in greater depth with multiple clauses and additional context. This creates a "bursty" pattern.
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                    <AlertDescription className="text-sm text-foreground">
                      <strong>Low Burstiness = AI:</strong> AI-generated text tends toward uniformity. Sentences cluster around a similar length (typically 15-25 words). The rhythm feels mechanical and predictable. There's less variation between shortest and longest sentences. This consistency is a hallmark of AI generation.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-semibold text-foreground mb-2">Real Example Comparison:</p>
                  <div className="space-y-3">
                    <div>
                      <Badge className="mb-2 bg-green-600">Human Writing</Badge>
                      <p className="text-xs font-mono bg-white dark:bg-gray-800 p-3 rounded border text-foreground">
                        The storm arrived. Without warning, without mercy, it tore through the coastal town with winds that screamed like wounded animals and rain that fell in sheets so thick you couldn't see your hand in front of your face. Buildings shook. Power lines snapped and sparked in the darkness, casting brief, terrifying shadows across flooded streets where abandoned cars sat half-submerged like forgotten toys.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Sentence lengths: 3, 31, 2, 24 words — High burstiness (varied)</p>
                    </div>

                    <div>
                      <Badge className="mb-2 bg-red-600">AI Writing</Badge>
                      <p className="text-xs font-mono bg-white dark:bg-gray-800 p-3 rounded border text-foreground">
                        The storm arrived at the coastal town with significant intensity. Strong winds and heavy rainfall characterized the weather event. Infrastructure experienced damage from the severe conditions. Power outages affected many residents throughout the impacted area. Emergency services responded to numerous calls for assistance.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Sentence lengths: 10, 9, 8, 9, 9 words — Low burstiness (uniform)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-2xl font-bold mb-3 text-foreground">Accuracy and Limitations of AI Detectors</h3>
                <p className="text-muted-foreground mb-4">
                  It's crucial to understand both the capabilities and limitations of AI detection technology:
                </p>

                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">✅ When AI Detectors Work Best:</h4>
                    <ul className="space-y-1 text-muted-foreground ml-4">
                      <li>• Longer texts (200+ words) provide more data points for analysis</li>
                      <li>• Unedited AI output shows the clearest patterns</li>
                      <li>• Academic or formal writing where AI patterns are most distinct</li>
                      <li>• Content from popular AI models (ChatGPT, GPT-4, Claude)</li>
                      <li>• Text generated in a single session without human intervention</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">⚠️ Limitations and Challenges:</h4>
                    <ul className="space-y-1 text-muted-foreground ml-4">
                      <li>• <strong>Edited AI content:</strong> Heavy human editing can mask AI patterns</li>
                      <li>• <strong>Collaborative writing:</strong> Human-AI partnerships create mixed signals</li>
                      <li>• <strong>Short texts:</strong> Brief passages lack sufficient data for confident detection</li>
                      <li>• <strong>Evolving AI models:</strong> Newer models produce increasingly human-like text</li>
                      <li>• <strong>Highly structured content:</strong> Technical writing may appear AI-generated even when human-written</li>
                      <li>• <strong>Non-native speakers:</strong> May write in patterns that resemble AI output</li>
                      <li>• <strong>False positives:</strong> 10-20% of human writing may be flagged as AI</li>
                      <li>• <strong>False negatives:</strong> 15-25% of AI text may pass as human</li>
                    </ul>
                  </div>
                </div>

                <Alert className="mt-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-sm text-foreground">
                    <strong>Important:</strong> AI detectors should never be used as the sole basis for important decisions like academic penalties, job rejections, or content removal. Always use them as one tool among many, and verify results through multiple methods including direct conversation, follow-up questions, and contextual evidence.
                  </AlertDescription>
                </Alert>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Common Use Cases for AI Text Detection</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-bold mb-2 text-foreground">🎓 Education</h4>
                    <p className="text-sm text-muted-foreground">
                      Teachers and professors use AI detectors to verify student work authenticity, uphold academic integrity, and identify when students may need additional guidance on proper AI tool usage.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-bold mb-2 text-foreground">💼 Content Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Publishers, editors, and content managers ensure originality of submitted work, verify freelancer deliverables, and maintain content quality standards across their platforms.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-bold mb-2 text-foreground">🔍 SEO and Marketing</h4>
                    <p className="text-sm text-muted-foreground">
                      Digital marketers verify that published content isn't purely AI-generated, which can negatively impact search rankings and brand authenticity in Google's evaluation algorithms.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-bold mb-2 text-foreground">👨‍💼 Hiring and Recruitment</h4>
                    <p className="text-sm text-muted-foreground">
                      HR professionals check cover letters and writing samples to ensure candidates demonstrate genuine communication skills rather than relying on AI-generated applications.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-bold mb-2 text-foreground">📰 Journalism</h4>
                    <p className="text-sm text-muted-foreground">
                      News organizations verify the authenticity of contributed articles and maintain journalistic standards by ensuring human authorship and original reporting.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-bold mb-2 text-foreground">⚖️ Legal and Compliance</h4>
                    <p className="text-sm text-muted-foreground">
                      Legal professionals verify authenticity of documents, contracts, and correspondence, particularly in cases where AI-generated content could raise ethical or legal concerns.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-2xl font-bold mb-3 text-foreground">Best Practices for Using AI Detectors</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">1. Use Multiple Detection Methods</h4>
                    <p className="text-sm text-muted-foreground">
                      Don't rely on a single AI detector. Test the same text with multiple tools (like GPTZero, Originality.ai, and our detector) to cross-verify results and build confidence in your assessment.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">2. Consider Context</h4>
                    <p className="text-sm text-muted-foreground">
                      Evaluate the detection results alongside other factors: Does this align with the writer's previous work? Is the content area one where AI is commonly used? Are there other red flags or supporting evidence?
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">3. Longer Samples = Better Results</h4>
                    <p className="text-sm text-muted-foreground">
                      Analyze at least 200-500 words when possible. Short snippets don't provide enough data for reliable detection. The more text you can analyze, the more accurate the results.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">4. Engage in Direct Conversation</h4>
                    <p className="text-sm text-muted-foreground">
                      For academic or professional contexts, follow up with questions about the content. Ask the author to explain their reasoning, discuss specific points, or elaborate on ideas. AI users often struggle with these follow-ups.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">5. Check for Consistency</h4>
                    <p className="text-sm text-muted-foreground">
                      Compare the suspected AI text with the person's other verified writing. Significant differences in style, vocabulary, complexity, or tone can indicate AI usage.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">6. Be Transparent About AI Usage Policies</h4>
                    <p className="text-sm text-muted-foreground">
                      In educational or professional settings, clearly communicate policies around AI tool usage. When expectations are clear, you reduce misunderstandings and encourage honest disclosure.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">The Future of AI Detection</h3>
                <p className="text-muted-foreground mb-4">
                  As AI writing technology evolves, detection methods must advance in parallel. Here's what's on the horizon:
                </p>

                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-foreground mb-2">Advanced Machine Learning Models</h4>
                    <p className="text-sm text-muted-foreground">
                      Next-generation detectors will use transformer-based models trained on millions of AI and human text samples, achieving 90%+ accuracy by learning subtle patterns invisible to current heuristic methods.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-foreground mb-2">Watermarking and Provenance Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      AI companies are developing invisible watermarks embedded in AI-generated text that can be detected by specialized tools, providing definitive proof of AI authorship without affecting human readability.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-foreground mb-2">Behavioral Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Future tools may analyze not just the final text, but the writing process itself—keystroke patterns, revision history, time spent, and editing behaviors that distinguish human composition from AI generation.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-foreground mb-2">Ethical AI Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Rather than just detecting AI use, future tools will help verify proper AI usage—distinguishing between appropriate AI assistance (editing, research) and inappropriate use (wholesale content generation), fostering responsible AI integration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-2xl font-bold mb-3 text-foreground">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Q: Can AI detectors identify specific AI models (ChatGPT vs Claude vs Gemini)?</h4>
                    <p className="text-sm text-muted-foreground">
                      A: Most detectors can identify AI-generated content in general but cannot reliably distinguish between specific AI models. Different models share similar underlying architectures and training approaches, making them difficult to differentiate based solely on output text.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Q: Will paraphrasing AI text fool the detector?</h4>
                    <p className="text-sm text-muted-foreground">
                      A: Simple paraphrasing or using AI to rewrite AI content usually won't fool modern detectors, as the underlying patterns persist. However, substantial human editing that changes sentence structures, adds personal examples, and introduces natural variation can make AI text harder to detect.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Q: Are there any texts that are undetectable?</h4>
                    <p className="text-sm text-muted-foreground">
                      A: Yes. Very short texts, heavily edited AI content, human-AI collaborative work, and content from cutting-edge AI models specifically designed to avoid detection can be challenging or impossible to accurately classify. The arms race between AI generation and detection continues to evolve.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Q: Is it possible to make human text appear AI-generated?</h4>
                    <p className="text-sm text-muted-foreground">
                      A: Yes. Formal, technical writing with consistent sentence structure and common transitions can sometimes be flagged as AI-generated, even when written by humans. This is why detectors should never be the sole basis for important decisions.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Q: How often should I update my testing approach?</h4>
                    <p className="text-sm text-muted-foreground">
                      A: As AI models improve every few months, detection approaches should be reviewed quarterly. Stay informed about new AI releases, updated detection tools, and evolving best practices in your specific field (education, publishing, etc.).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-2xl font-bold mb-3 text-foreground">Final Thoughts: Using AI Detection Responsibly</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  AI detection is a powerful tool, but it's not infallible. The technology continues to improve, but so do AI writing models. The key is to use AI detectors as part of a comprehensive approach to maintaining content authenticity and academic integrity, not as a definitive judgment mechanism.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Remember that AI writing tools aren't inherently bad—they can be valuable assistants for brainstorming, editing, and research. The concern arises when AI is used to replace human thought, originality, and effort. Detection tools help us strike the right balance.
                </p>
                <p className="text-muted-foreground leading-relaxed italic">
                  Use our AI Text Detector regularly to stay informed about the content you're evaluating, but always pair technological analysis with human judgment, contextual understanding, and clear communication about expectations and standards.
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
