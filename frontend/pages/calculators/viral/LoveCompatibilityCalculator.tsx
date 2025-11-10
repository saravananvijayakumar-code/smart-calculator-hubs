import React, { useState } from 'react';
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
import { Heart, Sparkles, Share2, Download, AlertTriangle, CheckCircle2, Twitter, Facebook, MessageCircle } from 'lucide-react';
import backend from '~backend/client';
import type { LoveCompatibilityAnalysisData } from '~backend/ai-analysis/types';
import { AIAnalysis } from '@/components/AIAnalysis';
import ExportShareButtons from '@/components/ExportShareButtons';
import { SEOHead } from '@/components/SEOHead';
import { AdsterraSlot } from '@/components/ads/AdsterraSlot';

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

interface CompatibilityResults {
  compatibilityPercentage: number;
  overallMatch: string;
  traitBreakdown: Array<{
    trait: string;
    score: number;
    description: string;
  }>;
  funFact: string;
  strengths: string[];
  challenges: string[];
  zodiacCompatibility: number;
  numerologyScore: number;
  birthdayHarmony: number;
}

export default function LoveCompatibilityCalculator() {
  const [partner1Name, setPartner1Name] = useState('');
  const [partner1Birthday, setPartner1Birthday] = useState('');
  const [partner1StarSign, setPartner1StarSign] = useState('');
  
  const [partner2Name, setPartner2Name] = useState('');
  const [partner2Birthday, setPartner2Birthday] = useState('');
  const [partner2StarSign, setPartner2StarSign] = useState('');
  
  const [results, setResults] = useState<CompatibilityResults | null>(null);
  const [analysisData, setAnalysisData] = useState<LoveCompatibilityAnalysisData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const { toast } = useToast();

  const validateInputs = (): string | null => {
    if (!partner1Name.trim()) return 'Please enter Partner 1 name';
    if (!partner1Birthday) return 'Please enter Partner 1 birthday';
    if (!partner1StarSign) return 'Please select Partner 1 star sign';
    
    if (!partner2Name.trim()) return 'Please enter Partner 2 name';
    if (!partner2Birthday) return 'Please enter Partner 2 birthday';
    if (!partner2StarSign) return 'Please select Partner 2 star sign';
    
    const date1 = new Date(partner1Birthday);
    const date2 = new Date(partner2Birthday);
    const now = new Date();
    
    if (date1 > now) return 'Partner 1 birthday cannot be in the future';
    if (date2 > now) return 'Partner 2 birthday cannot be in the future';
    
    return null;
  };

  const handleCalculate = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsCalculating(true);

    try {
      const response = await backend.compatibility.calculate({
        partner1: {
          name: partner1Name,
          birthday: partner1Birthday,
          starSign: partner1StarSign
        },
        partner2: {
          name: partner2Name,
          birthday: partner2Birthday,
          starSign: partner2StarSign
        }
      });

      setResults(response);

      const emotionalScore = response.traitBreakdown.find(t => t.trait === 'Emotional Connection')?.score || 70;
      const communicationScore = response.traitBreakdown.find(t => t.trait === 'Communication')?.score || 70;
      const lifeGoalsScore = response.traitBreakdown.find(t => t.trait === 'Life Goals Alignment')?.score || 70;

      const analysisPayload: LoveCompatibilityAnalysisData = {
        partner1Name,
        partner1Birthday,
        partner1StarSign,
        partner2Name,
        partner2Birthday,
        partner2StarSign,
        compatibilityPercentage: response.compatibilityPercentage,
        overallMatch: response.overallMatch,
        zodiacCompatibility: response.zodiacCompatibility,
        numerologyScore: response.numerologyScore,
        birthdayHarmony: response.birthdayHarmony,
        emotionalScore,
        communicationScore,
        lifeGoalsScore
      };

      setAnalysisData(analysisPayload);
    } catch (error) {
      setError('An error occurred during calculation. Please try again.');
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const getCompatibilityColor = (percentage: number): string => {
    if (percentage >= 85) return 'text-pink-600';
    if (percentage >= 75) return 'text-purple-600';
    if (percentage >= 65) return 'text-blue-600';
    if (percentage >= 55) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getCompatibilityGradient = (percentage: number): string => {
    if (percentage >= 85) return 'from-pink-500 to-rose-500';
    if (percentage >= 75) return 'from-purple-500 to-pink-500';
    if (percentage >= 65) return 'from-blue-500 to-purple-500';
    if (percentage >= 55) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  const shareToSocial = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    if (!results) return;
    
    const shareText = `💕 ${partner1Name} & ${partner2Name} are ${results.compatibilityPercentage}% compatible! ${results.overallMatch}\n\n✨ Calculate your love compatibility at www.smartcalculatorhubs.com #LoveCalculator #Compatibility`;
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard!",
        description: "Share your compatibility results",
      });
    } catch (error) {
      console.error('Clipboard error:', error);
      toast({
        title: "Copy failed",
        description: "Please manually copy your results",
        variant: "destructive"
      });
    }
  };

  const downloadAsValentineCard = () => {
    if (!results) return;
    
    const cardContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━
💕 LOVE COMPATIBILITY CARD 💕
━━━━━━━━━━━━━━━━━━━━━━━━━━━

${partner1Name} (${partner1StarSign})
        ❤️ + ❤️
${partner2Name} (${partner2StarSign})

━━━━━━━━━━━━━━━━━━━━━━━━━━━
${results.compatibilityPercentage}% COMPATIBLE!
${results.overallMatch}
━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ ${results.funFact}

💪 YOUR STRENGTHS:
${results.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

💡 AREAS TO WORK ON:
${results.challenges.map((c, i) => `${i + 1}. ${c}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created with ❤️ at
Smart Calculator Hubs
━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    const blob = new Blob([cardContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${partner1Name}-${partner2Name}-compatibility-card.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Valentine's Card Downloaded!",
      description: "Share your love compatibility card with the world 💕",
    });
  };

  return (
    <>
      <SEOHead
        title="Love & Compatibility Calculator - Test Your Relationship Match"
        description="Calculate your love compatibility based on names, birthdays, and zodiac signs. Get personalized insights, relationship tips, and share as Valentine's card. Free viral love calculator!"
        keywords="love calculator, compatibility calculator, relationship calculator, zodiac compatibility, love match, valentine calculator, couple calculator"
      />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AdsterraSlot position="top" className="mb-8" />
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent px-4">
            ❤️ Love & Compatibility Calculator
          </h1>
          <p className="text-center text-base sm:text-lg text-muted-foreground mb-8 px-4">
            Discover your romantic compatibility through astrology, numerology, and cosmic alignment ✨
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            
            <div className="lg:col-span-2 space-y-8">
              <AdsterraSlot position="middle" className="mb-6" />
              
              <Card className="border-pink-200 dark:border-pink-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-pink-600" />
                    Enter Partner Details
                  </CardTitle>
                  <CardDescription>
                    Fill in both partners' information to calculate your cosmic compatibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                      <h3 className="font-semibold text-pink-700 dark:text-pink-400">Partner 1</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="partner1Name">Name</Label>
                        <Input
                          id="partner1Name"
                          type="text"
                          placeholder="Enter name"
                          value={partner1Name}
                          onChange={(e) => setPartner1Name(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partner1Birthday">Birthday</Label>
                        <Input
                          id="partner1Birthday"
                          type="date"
                          value={partner1Birthday}
                          onChange={(e) => setPartner1Birthday(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partner1StarSign">Star Sign</Label>
                        <Select value={partner1StarSign} onValueChange={setPartner1StarSign}>
                          <SelectTrigger id="partner1StarSign">
                            <SelectValue placeholder="Select zodiac sign" />
                          </SelectTrigger>
                          <SelectContent>
                            {zodiacSigns.map((sign) => (
                              <SelectItem key={sign} value={sign}>{sign}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <h3 className="font-semibold text-blue-700 dark:text-blue-400">Partner 2</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="partner2Name">Name</Label>
                        <Input
                          id="partner2Name"
                          type="text"
                          placeholder="Enter name"
                          value={partner2Name}
                          onChange={(e) => setPartner2Name(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partner2Birthday">Birthday</Label>
                        <Input
                          id="partner2Birthday"
                          type="date"
                          value={partner2Birthday}
                          onChange={(e) => setPartner2Birthday(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partner2StarSign">Star Sign</Label>
                        <Select value={partner2StarSign} onValueChange={setPartner2StarSign}>
                          <SelectTrigger id="partner2StarSign">
                            <SelectValue placeholder="Select zodiac sign" />
                          </SelectTrigger>
                          <SelectContent>
                            {zodiacSigns.map((sign) => (
                              <SelectItem key={sign} value={sign}>{sign}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    onClick={handleCalculate} 
                    disabled={isCalculating}
                    className={`w-full bg-gradient-to-r ${getCompatibilityGradient(75)} hover:opacity-90 transition-opacity text-white`}
                    size="lg"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    {isCalculating ? 'Calculating Cosmic Compatibility...' : 'Calculate Our Compatibility ❤️'}
                  </Button>
                </CardContent>
              </Card>

              {results && (
                <>
                  <Card className="border-pink-200 dark:border-pink-900 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${getCompatibilityGradient(results.compatibilityPercentage)}`} />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-6 w-6 text-pink-600" fill="currentColor" />
                        Your Compatibility Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      <div className="text-center p-8 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-xl">
                        <div className={`text-6xl font-bold mb-2 ${getCompatibilityColor(results.compatibilityPercentage)}`}>
                          {results.compatibilityPercentage}%
                        </div>
                        <div className="text-xl font-semibold mb-4">{results.overallMatch}</div>
                        <Progress value={results.compatibilityPercentage} className="h-3" />
                        <p className="mt-4 text-muted-foreground italic">✨ {results.funFact}</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Compatibility Breakdown</h4>
                        {results.traitBreakdown.map((trait, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{trait.trait}</span>
                              <Badge variant="outline" className={getCompatibilityColor(trait.score)}>
                                {trait.score}%
                              </Badge>
                            </div>
                            <Progress value={trait.score} className="h-2" />
                            <p className="text-sm text-muted-foreground">{trait.description}</p>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Your Strengths
                          </h4>
                          <ul className="space-y-2">
                            {results.strengths.map((strength, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">💪</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            Areas to Work On
                          </h4>
                          <ul className="space-y-2">
                            {results.challenges.map((challenge, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="text-orange-600 mt-0.5">💡</span>
                                <span>{challenge}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-semibold">Detailed Scores</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{results.zodiacCompatibility}%</div>
                            <div className="text-xs text-muted-foreground">Zodiac Match</div>
                          </div>
                          <div className="p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-pink-600">{results.numerologyScore}%</div>
                            <div className="text-xs text-muted-foreground">Numerology</div>
                          </div>
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{results.birthdayHarmony}%</div>
                            <div className="text-xs text-muted-foreground">Birthday Harmony</div>
                          </div>
                        </div>
                      </div>

                      <Separator />
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold">Share Your Results 💕</h4>
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
                          <Button 
                            onClick={downloadAsValentineCard} 
                            variant="outline"
                            className="w-full sm:col-span-3"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Valentine's Card
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {analysisData && (
                    <>
                      <AIAnalysis
                        analysisRequest={{
                          calculatorType: "love-compatibility",
                          data: analysisData
                        }}
                        autoRun={true}
                        title="AI-Powered Relationship Insights"
                        description="Get personalized tips and recommendations for your relationship"
                      />

                      <ExportShareButtons
                        calculatorType="love-compatibility"
                        inputs={{
                          person1Name: partner1Name,
                          person2Name: partner2Name,
                          person1Birthday: partner1Birthday || '',
                          person2Birthday: partner2Birthday || '',
                          person1Zodiac: partner1StarSign,
                          person2Zodiac: partner2StarSign
                        }}
                        results={{
                          compatibilityPercentage: results?.compatibilityPercentage || 0,
                          overallMatch: results?.overallMatch || '',
                          zodiacCompatibility: results?.zodiacCompatibility || 0,
                          numerologyScore: results?.numerologyScore || 0
                        }}
                        title="Love Compatibility Calculator Report"
                        className="mt-6"
                      />
                    </>
                  )}
                </>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Complete Guide to Love Compatibility</CardTitle>
                  <CardDescription>
                    Understanding the science and art of romantic compatibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <div className="space-y-6 text-sm">
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">What is Love Compatibility?</h3>
                      <p>
                        Love compatibility is the measure of how well two people match in terms of personality, values, communication styles, and life goals. While there's no perfect formula for love, compatibility calculators like ours combine ancient wisdom from astrology and numerology with modern relationship psychology to give you insights into your romantic potential.
                      </p>
                      <p className="mt-2">
                        Our Love & Compatibility Calculator analyzes multiple dimensions of your relationship: zodiac sign compatibility based on elemental energies, numerological harmony derived from your names, and birthday alignment that reveals cosmic timing. Together, these create a comprehensive picture of your romantic compatibility, giving you both strengths to celebrate and areas to work on.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">How Our Calculator Works</h3>
                      
                      <h4 className="font-semibold mt-4 mb-2">Zodiac Sign Compatibility</h4>
                      <p>
                        Each zodiac sign belongs to one of four elements: Fire (Aries, Leo, Sagittarius), Earth (Taurus, Virgo, Capricorn), Air (Gemini, Libra, Aquarius), and Water (Cancer, Scorpio, Pisces). Signs of the same element naturally understand each other, while certain elements complement each other beautifully—Fire with Air creates excitement, while Earth with Water creates stability.
                      </p>

                      <h4 className="font-semibold mt-4 mb-2">Numerology Analysis</h4>
                      <p>
                        Your name carries a unique vibrational energy in numerology. By converting the letters of both partners' names into numbers and analyzing their relationship, we reveal hidden patterns of compatibility. When two names vibrate at complementary frequencies, communication flows naturally and understanding deepens effortlessly.
                      </p>

                      <h4 className="font-semibold mt-4 mb-2">Birthday Harmony</h4>
                      <p>
                        The cosmic alignment of your birthdays reveals timing and rhythm in your relationship. Couples born in the same month often share similar life experiences and seasonal energies. Those born on similar days of the month may find natural synchronicity in their daily rhythms and decision-making styles.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Understanding Your Results</h3>
                      
                      <h4 className="font-semibold mt-4 mb-2">85-100%: Exceptional Match</h4>
                      <p>
                        You've found something truly special! This level of compatibility is rare and indicates natural harmony across multiple dimensions. Your energies align, communication flows easily, and you likely share similar values and life goals. However, don't take this for granted—even the most compatible couples need to nurture their relationship through communication, appreciation, and quality time together.
                      </p>

                      <h4 className="font-semibold mt-4 mb-2">70-84%: Strong Potential</h4>
                      <p>
                        You have a solid foundation for a beautiful relationship! While you may have some differences, your core compatibility is strong enough to build something lasting. Focus on your strengths as a couple, communicate openly about your differences, and be willing to grow together. Many of the world's happiest couples fall into this range.
                      </p>

                      <h4 className="font-semibold mt-4 mb-2">55-69%: Moderate Match</h4>
                      <p>
                        Your relationship will require more conscious effort and communication, but that doesn't mean it can't work! Many successful couples in this range report that working through their differences made them stronger. You'll need to be intentional about understanding each other's perspectives, finding common ground, and appreciating what makes each of you unique.
                      </p>

                      <h4 className="font-semibold mt-4 mb-2">Below 55%: Growth Required</h4>
                      <p>
                        This match suggests significant differences in your natural energies, communication styles, or life approaches. While challenging, these relationships can work with exceptional commitment, professional guidance, and a willingness to grow. Sometimes our greatest teachers come disguised as difficult partners. If you choose to continue, be honest about the work required and ensure both partners are equally committed.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">The Five Compatibility Dimensions</h3>
                      
                      <h4 className="font-semibold mt-4 mb-2">Emotional Connection</h4>
                      <p>
                        This measures how well you understand and respond to each other's feelings. High emotional compatibility means you intuitively "get" each other, can comfort each other effectively, and feel safe being vulnerable. Low scores here suggest you may need to work harder to validate each other's emotions and create emotional safety.
                      </p>

                      <h4 className="font-semibold mt-4 mb-2">Communication Style</h4>
                      <p>
                        Communication is the foundation of every successful relationship. This dimension reveals whether your natural communication styles complement or clash. Do you both process feelings verbally, or does one need time alone? Does one person prefer direct conversation while the other hints indirectly? Understanding these patterns helps you communicate more effectively.
                      </p>

                      <h4 className="font-semibold mt-4 mb-2">Life Goals Alignment</h4>
                      <p>
                        You might have incredible chemistry, but if you want fundamentally different futures, the relationship will struggle. This measures whether your visions for life—career ambitions, family plans, lifestyle preferences, and core values—align or conflict. Couples with high scores here find it easier to make joint decisions and build a shared future.
                      </p>

                      <h4 className="font-semibold mt-4 mb-2">Energy & Vibe</h4>
                      <p>
                        Do you energize or exhaust each other? This dimension looks at your natural energy levels, social needs, and activity preferences. Introverts and extroverts can absolutely make it work, but they need to understand and respect each other's needs. High scores mean your natural rhythms sync beautifully.
                      </p>

                      <h4 className="font-semibold mt-4 mb-2">Long-term Potential</h4>
                      <p>
                        This synthesizes all factors to predict long-term success. It considers whether your relationship has the foundation to weather life's inevitable storms. High scores suggest resilience and adaptability as a couple. Lower scores don't mean failure—they mean you'll need to be more intentional about relationship maintenance.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Making Your Relationship Work</h3>
                      
                      <h4 className="font-semibold mt-4 mb-2">Play to Your Strengths</h4>
                      <p>
                        Every couple has areas where they naturally excel. Maybe you communicate effortlessly, or perhaps you share the same vision for the future. Identify these strengths and lean into them, especially during difficult times. Your strengths are your relationship's foundation—build on them deliberately.
                      </p>

                      <h4 className="font-semibold mt-4 mb-2">Address Challenges Early</h4>
                      <p>
                        Don't ignore red flags or areas of incompatibility. The earlier you address potential issues, the easier they are to resolve. If you scored low in communication, take a couples communication workshop. If your life goals don't align, have honest conversations about compromise and priorities. Small problems become relationship-enders when left unaddressed.
                      </p>

                      <h4 className="font-semibold mt-4 mb-2">Keep Dating Each Other</h4>
                      <p>
                        Compatibility isn't static—it requires maintenance. Continue doing the things that brought you together. Schedule regular date nights, try new experiences together, surprise each other with thoughtful gestures, and never stop flirting. Complacency is a compatibility killer.
                      </p>

                      <h4 className="font-semibold mt-4 mb-2">Grow Together</h4>
                      <p>
                        People change over time, and your compatibility can evolve with you. The key is growing together rather than apart. Share your personal growth journeys, support each other's development, and regularly check in about your relationship's health. Couples who grow together report increasing compatibility over time.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Beyond the Numbers</h3>
                      <p>
                        While our calculator provides valuable insights, remember that love is ultimately about choice, commitment, and action. The most "compatible" couple on paper can fail without effort, while seemingly mismatched partners can build beautiful relationships through dedication and understanding.
                      </p>
                      <p className="mt-2">
                        Use these results as a starting point for deeper conversations about your relationship. They're meant to illuminate patterns and provide guidance, not to dictate your romantic destiny. Trust your heart, communicate openly, and be willing to work for what you want. Real love is built through daily choices to understand, appreciate, and cherish your partner—compatibility just makes it a bit easier.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
                      
                      <details className="mt-3">
                        <summary className="font-semibold cursor-pointer">How accurate are love compatibility calculators?</summary>
                        <p className="mt-2 ml-4">
                          Compatibility calculators provide insights based on astrological and numerological principles, but they're not definitive predictors of relationship success. Use them as conversation starters and tools for self-reflection, not as absolute truth. Real relationships succeed through communication, effort, and mutual respect—not just cosmic alignment.
                        </p>
                      </details>

                      <details className="mt-3">
                        <summary className="font-semibold cursor-pointer">Can low compatibility scores work out?</summary>
                        <p className="mt-2 ml-4">
                          Absolutely! Many successful long-term relationships have lower compatibility scores. These relationships require more conscious effort, better communication skills, and greater willingness to understand differences. Sometimes our most challenging partners teach us the most valuable lessons about love, patience, and growth.
                        </p>
                      </details>

                      <details className="mt-3">
                        <summary className="font-semibold cursor-pointer">What if our zodiac signs are incompatible?</summary>
                        <p className="mt-2 ml-4">
                          Zodiac incompatibility isn't a relationship death sentence. It simply means you'll need to work harder to understand each other's natural tendencies and communication styles. Many "incompatible" zodiac pairings thrive because their differences create balance and growth opportunities. Focus on emotional connection and shared values over astrological matching.
                        </p>
                      </details>

                      <details className="mt-3">
                        <summary className="font-semibold cursor-pointer">Should I break up if we have low compatibility?</summary>
                        <p className="mt-2 ml-4">
                          No! A calculator should never dictate major life decisions. Low compatibility scores simply highlight areas that need attention and work. If you love your partner and they treat you well, use these insights to strengthen your relationship rather than end it. However, if the results confirm concerns you already had, they might provide clarity for difficult decisions.
                        </p>
                      </details>

                      <details className="mt-3">
                        <summary className="font-semibold cursor-pointer">Can compatibility change over time?</summary>
                        <p className="mt-2 ml-4">
                          Yes! While your zodiac signs and numerology remain constant, your actual compatibility can absolutely improve or decline over time. Couples who work on their relationship, grow together, and maintain open communication often find their compatibility increasing. Conversely, neglecting relationship maintenance can decrease compatibility even for naturally matched pairs.
                        </p>
                      </details>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Important Disclaimer</h3>
                      <p className="text-xs text-muted-foreground">
                        This Love & Compatibility Calculator is designed for entertainment and self-reflection purposes. While based on traditional astrological and numerological principles, it should not be used as the sole basis for making important relationship decisions. Every relationship is unique, and real compatibility depends on countless factors including communication, shared values, mutual respect, and individual growth. If you're experiencing relationship difficulties, please consider speaking with a licensed therapist or relationship counselor.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <AdsterraSlot position="middle" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
