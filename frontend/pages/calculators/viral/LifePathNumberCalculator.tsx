import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Share2, AlertTriangle, Star, Infinity, Brain, Heart, Briefcase, Users } from 'lucide-react';
import EnhancedAIAnalysis from '@/components/EnhancedAIAnalysis';
import ExportShareButtons from '@/components/ExportShareButtons';
import { SEOHead } from '@/components/SEOHead';
import { AutoAdSlot } from '@/components/ads/AutoAdSlot';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import AmazonAffiliate from '@/components/ads/AmazonAffiliate';

interface LifePathResults {
  lifePathNumber: number;
  personalityTraits: string[];
  strengths: string[];
  challenges: string[];
  careerPaths: string[];
  compatibleNumbers: number[];
  famousPeople: string[];
  luckyColors: string[];
  luckyDays: string[];
}

const lifePathData: Record<number, LifePathResults> = {
  1: {
    lifePathNumber: 1,
    personalityTraits: ['Natural leader', 'Independent', 'Ambitious', 'Pioneering', 'Confident'],
    strengths: ['Innovation', 'Determination', 'Self-reliance', 'Courage', 'Original thinking'],
    challenges: ['Can be domineering', 'Impatient', 'Stubborn', 'Self-centered tendencies'],
    careerPaths: ['Entrepreneur', 'CEO', 'Inventor', 'Pioneer', 'Director', 'Manager'],
    compatibleNumbers: [1, 5, 7],
    famousPeople: ['Tom Cruise', 'Hulk Hogan', 'Jack Nicholson', 'Martin Luther King Jr.'],
    luckyColors: ['Red', 'Orange', 'Yellow'],
    luckyDays: ['Sunday', 'Monday']
  },
  2: {
    lifePathNumber: 2,
    personalityTraits: ['Diplomatic', 'Cooperative', 'Sensitive', 'Peacemaker', 'Intuitive'],
    strengths: ['Collaboration', 'Empathy', 'Patience', 'Musical talent', 'Mediation'],
    challenges: ['Overly sensitive', 'Indecisive', 'Timid', 'Self-conscious'],
    careerPaths: ['Counselor', 'Diplomat', 'Therapist', 'Musician', 'Teacher', 'Mediator'],
    compatibleNumbers: [2, 4, 8],
    famousPeople: ['Barack Obama', 'Madonna', 'Jennifer Aniston', 'Bill Clinton'],
    luckyColors: ['White', 'Cream', 'Silver'],
    luckyDays: ['Monday', 'Friday']
  },
  3: {
    lifePathNumber: 3,
    personalityTraits: ['Creative', 'Expressive', 'Optimistic', 'Artistic', 'Social'],
    strengths: ['Communication', 'Creativity', 'Enthusiasm', 'Imagination', 'Joy'],
    challenges: ['Scattered energy', 'Superficial', 'Mood swings', 'Extravagant'],
    careerPaths: ['Artist', 'Writer', 'Designer', 'Performer', 'Motivational Speaker'],
    compatibleNumbers: [3, 6, 9],
    famousPeople: ['Hilary Clinton', 'Snoop Dogg', 'Jackie Chan', 'Christina Aguilera'],
    luckyColors: ['Yellow', 'Purple', 'Pink'],
    luckyDays: ['Thursday', 'Friday']
  },
  4: {
    lifePathNumber: 4,
    personalityTraits: ['Practical', 'Disciplined', 'Organized', 'Reliable', 'Builder'],
    strengths: ['Hard work', 'Loyalty', 'Honesty', 'Traditional values', 'Patience'],
    challenges: ['Rigid', 'Too serious', 'Workaholic', 'Lacks spontaneity'],
    careerPaths: ['Accountant', 'Engineer', 'Architect', 'Manager', 'Analyst', 'Administrator'],
    compatibleNumbers: [2, 4, 8],
    famousPeople: ['Bill Gates', 'Oprah Winfrey', 'Clint Eastwood', 'Brad Pitt'],
    luckyColors: ['Blue', 'Grey', 'Brown'],
    luckyDays: ['Sunday', 'Saturday']
  },
  5: {
    lifePathNumber: 5,
    personalityTraits: ['Adventurous', 'Freedom-loving', 'Versatile', 'Progressive', 'Dynamic'],
    strengths: ['Adaptability', 'Curiosity', 'Resourcefulness', 'Quick thinking', 'Charisma'],
    challenges: ['Restless', 'Impulsive', 'Irresponsible', 'Inconsistent'],
    careerPaths: ['Travel Agent', 'Sales', 'Journalist', 'Advertising', 'Public Relations'],
    compatibleNumbers: [1, 5, 7],
    famousPeople: ['Beyoncé', 'Steven Spielberg', 'Mick Jagger', 'Abraham Lincoln'],
    luckyColors: ['Green', 'Turquoise', 'Light colors'],
    luckyDays: ['Wednesday', 'Friday']
  },
  6: {
    lifePathNumber: 6,
    personalityTraits: ['Nurturing', 'Responsible', 'Caring', 'Protective', 'Harmonious'],
    strengths: ['Compassion', 'Teaching', 'Healing', 'Family focus', 'Service'],
    challenges: ['Worry too much', 'Self-righteous', 'Interfering', 'Perfectionist'],
    careerPaths: ['Teacher', 'Nurse', 'Social Worker', 'Interior Designer', 'Chef', 'Counselor'],
    compatibleNumbers: [3, 6, 9],
    famousPeople: ['Michael Jackson', 'Albert Einstein', 'Sylvester Stallone', 'Galileo'],
    luckyColors: ['Blue', 'Rose', 'Pink'],
    luckyDays: ['Friday', 'Wednesday']
  },
  7: {
    lifePathNumber: 7,
    personalityTraits: ['Analytical', 'Spiritual', 'Introspective', 'Wise', 'Mysterious'],
    strengths: ['Research', 'Analysis', 'Philosophy', 'Technical skills', 'Intuition'],
    challenges: ['Isolated', 'Secretive', 'Skeptical', 'Cold or distant'],
    careerPaths: ['Scientist', 'Researcher', 'Philosopher', 'Analyst', 'Professor', 'Programmer'],
    compatibleNumbers: [1, 5, 7],
    famousPeople: ['Leonardo DiCaprio', 'Marilyn Monroe', 'Princess Diana', 'Julia Roberts'],
    luckyColors: ['Purple', 'Violet', 'Sea green'],
    luckyDays: ['Monday', 'Sunday']
  },
  8: {
    lifePathNumber: 8,
    personalityTraits: ['Ambitious', 'Authoritative', 'Powerful', 'Material success', 'Executive'],
    strengths: ['Business acumen', 'Financial management', 'Organization', 'Efficiency', 'Vision'],
    challenges: ['Materialistic', 'Workaholic', 'Controlling', 'Status-conscious'],
    careerPaths: ['Business Executive', 'Financial Advisor', 'Banker', 'Real Estate', 'Politician'],
    compatibleNumbers: [2, 4, 8],
    famousPeople: ['Pablo Picasso', 'Michelangelo', '50 Cent', 'Elizabeth Taylor'],
    luckyColors: ['Black', 'Dark blue', 'Purple'],
    luckyDays: ['Saturday', 'Tuesday']
  },
  9: {
    lifePathNumber: 9,
    personalityTraits: ['Humanitarian', 'Compassionate', 'Idealistic', 'Artistic', 'Selfless'],
    strengths: ['Generosity', 'Tolerance', 'Compassion', 'Artistic expression', 'Universal love'],
    challenges: ['Scattered focus', 'Impractical', 'Moody', 'Financially careless'],
    careerPaths: ['Humanitarian', 'Artist', 'Healer', 'Teacher', 'Philanthropist', 'Counselor'],
    compatibleNumbers: [3, 6, 9],
    famousPeople: ['Jim Carrey', 'Morgan Freeman', 'Elvis Presley', 'Gandhi'],
    luckyColors: ['Red', 'Crimson', 'Pink'],
    luckyDays: ['Tuesday', 'Thursday']
  },
  11: {
    lifePathNumber: 11,
    personalityTraits: ['Intuitive', 'Visionary', 'Spiritual leader', 'Inspirational', 'Idealistic'],
    strengths: ['Psychic abilities', 'Inspiration', 'Healing', 'Teaching', 'Enlightenment'],
    challenges: ['Nervous energy', 'Impractical', 'Overly sensitive', 'Self-sabotage'],
    careerPaths: ['Spiritual Teacher', 'Motivational Speaker', 'Healer', 'Psychologist', 'Artist'],
    compatibleNumbers: [2, 11, 22],
    famousPeople: ['Bill Clinton', 'Michelle Obama', 'Prince William', 'Tony Blair'],
    luckyColors: ['Silver', 'White', 'Crimson'],
    luckyDays: ['Monday', 'Thursday']
  },
  22: {
    lifePathNumber: 22,
    personalityTraits: ['Master builder', 'Visionary', 'Practical idealist', 'Disciplined', 'Powerful'],
    strengths: ['Turn dreams to reality', 'Large-scale projects', 'Leadership', 'Organization'],
    challenges: ['Overwhelming pressure', 'Self-doubt', 'Scattered energy', 'Burnout'],
    careerPaths: ['Architect', 'Urban Planner', 'CEO', 'International Diplomat', 'Visionary Leader'],
    compatibleNumbers: [4, 11, 22],
    famousPeople: ['Paul McCartney', 'Tina Turner', 'Richard Branson', 'Dean Martin'],
    luckyColors: ['Gold', 'Coral', 'Cream'],
    luckyDays: ['Sunday', 'Wednesday']
  },
  33: {
    lifePathNumber: 33,
    personalityTraits: ['Master teacher', 'Compassionate', 'Nurturing', 'Selfless', 'Healing'],
    strengths: ['Teaching', 'Healing humanity', 'Unconditional love', 'Service', 'Guidance'],
    challenges: ['Martyrdom', 'Emotional overwhelm', 'High expectations', 'Escapism'],
    careerPaths: ['Master Teacher', 'Spiritual Guide', 'Humanitarian Leader', 'Healer', 'Counselor'],
    compatibleNumbers: [6, 11, 33],
    famousPeople: ['Albert Einstein', 'Thomas Edison', 'Francis Ford Coppola', 'Stephen King'],
    luckyColors: ['All colors', 'Especially sea foam'],
    luckyDays: ['All days', 'Friday especially']
  }
};

export default function LifePathNumberCalculator() {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [results, setResults] = useState<LifePathResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  
  const { toast } = useToast();

  const calculateLifePathNumber = (date: string): number => {
    const dateParts = date.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    const reduceToSingleDigit = (num: string): number => {
      let sum = num.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
      
      if (sum === 11 || sum === 22 || sum === 33) {
        return sum;
      }
      
      while (sum > 9) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        if (sum === 11 || sum === 22 || sum === 33) {
          return sum;
        }
      }
      
      return sum;
    };

    const monthNum = reduceToSingleDigit(month);
    const dayNum = reduceToSingleDigit(day);
    const yearNum = reduceToSingleDigit(year);

    let total = monthNum + dayNum + yearNum;
    
    if (total === 11 || total === 22 || total === 33) {
      return total;
    }
    
    while (total > 9) {
      total = total.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
      if (total === 11 || total === 22 || total === 33) {
        return total;
      }
    }
    
    return total;
  };

  const handleCalculate = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!birthdate) {
      setError('Please enter your birthdate');
      return;
    }

    const selectedDate = new Date(birthdate);
    const now = new Date();
    
    if (selectedDate > now) {
      setError('Birthdate cannot be in the future');
      return;
    }

    setError(null);
    setIsCalculating(true);
    setShowAnimation(false);

    setTimeout(() => {
      const lifePathNum = calculateLifePathNumber(birthdate);
      const result = lifePathData[lifePathNum];
      setResults(result);
      setIsCalculating(false);
      setShowAnimation(true);
    }, 1500);
  };

  const shareText = results 
    ? `🔮 My Life Path Number is ${results.lifePathNumber}! ${results.personalityTraits[0]}, ${results.personalityTraits[1]}, and ${results.personalityTraits[2]}. Calculate yours now!`
    : '';

  return (
    <CalculatorLayoutWithAds
      title="Life Path Number Calculator 🔮"
      description="Calculate your Life Path Number and unlock the secrets of numerology! Discover your personality traits, strengths, ideal career paths, and compatible numbers based on your birthdate. Free numerology calculator with AI insights."
    >
      <SEOHead
        title="Life Path Number Calculator 🔮 - Discover Your Numerology Destiny | Free Numerology Calculator"
        description="Calculate your Life Path Number and unlock the secrets of numerology! Discover your personality traits, strengths, ideal career paths, and compatible numbers based on your birthdate. Free numerology calculator with AI insights."
        keywords="life path number, numerology calculator, life path calculator, numerology reading, destiny number, numerology compatibility, birthdate numerology, personality number, free numerology"
      />

      <div className="space-y-8">
        <div className="max-w-7xl mx-auto"  >

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-4 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
              Life Path Number Calculator 🔮
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Unlock the secrets of numerology! Discover your Life Path Number and what it reveals about your personality, destiny, and life purpose.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Star className="w-6 h-6 text-purple-600" />
                    Calculate Your Life Path Number
                  </CardTitle>
                  <CardDescription>
                    Enter your details below to discover your numerology destiny
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-semibold">Your Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-lg h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthdate" className="text-base font-semibold">Your Birthdate</Label>
                    <Input
                      id="birthdate"
                      type="date"
                      value={birthdate}
                      onChange={(e) => setBirthdate(e.target.value)}
                      className="text-lg h-12"
                      max={new Date().toISOString().split('T')[0]}
                    />
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
                    className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  >
                    {isCalculating ? (
                      <><Sparkles className="mr-2 h-5 w-5 animate-spin" /> Calculating Your Destiny...</>
                    ) : (
                      <><Sparkles className="mr-2 h-5 w-5" /> Reveal My Life Path Number</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {results && (
                <>
                  <div className={`transform transition-all duration-700 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <Card className="shadow-2xl border-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40">
                      <CardContent className="pt-8 text-center">
                        <div className="mb-6">
                          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">Your Life Path Number is</p>
                          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl mb-4">
                            <span className="text-6xl font-bold text-white">{results.lifePathNumber}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                          {results.personalityTraits.map((trait, idx) => (
                            <Badge key={idx} variant="secondary" className="text-base px-4 py-2 bg-purple-200 dark:bg-purple-800">
                              {trait}
                            </Badge>
                          ))}
                        </div>

                        <ExportShareButtons
                          calculatorType="life-path-number"
                          inputs={{ name, birthdate }}
                          results={{ lifePathNumber: results.lifePathNumber }}
                          title={shareText}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <AutoAdSlot placement="in-feed" className="my-8" />

                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Brain className="w-6 h-6 text-purple-600" />
                        Your Core Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {results.strengths.map((strength, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                        Life Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.challenges.map((challenge, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <AutoAdSlot placement="mid-content" className="my-8" />

                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                        Ideal Career Paths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {results.careerPaths.map((career, idx) => (
                          <div key={idx} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center font-medium">
                            {career}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Heart className="w-6 h-6 text-pink-600" />
                        Compatible Life Path Numbers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 justify-center">
                        {results.compatibleNumbers.map((num, idx) => (
                          <div key={idx} className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-bold text-white">{num}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Star className="w-6 h-6 text-yellow-600" />
                        Lucky Colors & Days
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Lucky Colors:</p>
                        <div className="flex flex-wrap gap-3">
                          {results.luckyColors.map((color, idx) => (
                            <Badge key={idx} variant="outline" className="text-base px-4 py-2">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Lucky Days:</p>
                        <div className="flex flex-wrap gap-3">
                          {results.luckyDays.map((day, idx) => (
                            <Badge key={idx} variant="outline" className="text-base px-4 py-2">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Users className="w-6 h-6 text-indigo-600" />
                        Famous People with Life Path {results.lifePathNumber}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {results.famousPeople.map((person, idx) => (
                          <div key={idx} className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center font-medium shadow">
                            ⭐ {person}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Analysis */}
                  <EnhancedAIAnalysis
                    calculatorType="life-path-number"
                    data={{
                      lifePathNumber: results.lifePathNumber,
                      name,
                      birthdate,
                      personalityTraits: results.personalityTraits,
                      strengths: results.strengths,
                      challenges: results.challenges,
                      careerPaths: results.careerPaths
                    }}
                  />

                  <AutoAdSlot placement="in-feed" className="my-8" />
                </>
              )}
            </div>

            <div className="space-y-6">
              <AutoAdSlot placement="sidebar" className="sticky top-4" />
              
              <Card className="shadow-xl border-0 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl">📚 Understanding Life Path Numbers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                  <div>
                    <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2">What is a Life Path Number?</h3>
                    <p>Your Life Path Number is the most important number in numerology. It's calculated from your birth date and reveals your life's purpose, natural talents, and the lessons you're here to learn.</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Master Numbers (11, 22, 33)</h3>
                    <p>These powerful numbers are not reduced further. They indicate high spiritual potential and significant life missions, but also come with greater challenges.</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2">How to Use This Knowledge</h3>
                    <p>Understanding your Life Path Number helps you make better career choices, improve relationships, and align with your true purpose. Use it as a guide, not a limitation.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="shadow-xl border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-3xl">The Complete Guide to Life Path Numbers and Numerology</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h2 className="text-2xl font-bold mt-6 mb-4">What is Numerology?</h2>
              <p>
                Numerology is an ancient metaphysical science that studies the mystical relationship between numbers and life events. 
                Dating back thousands of years to ancient civilizations including Babylon, China, Egypt, and Greece, numerology has 
                been used to gain insight into personality, predict future trends, and understand life's deeper meaning.
              </p>
              <p>
                The Greek mathematician Pythagoras is often credited with developing modern Western numerology around 500 BCE. 
                He believed that everything in the universe could be explained through numbers, and that numbers were the building 
                blocks of reality itself.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Understanding Your Life Path Number</h2>
              <p>
                Your Life Path Number is the most significant number in your numerology chart. It's calculated by reducing your 
                birth date to a single digit (or master number), and it reveals:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Your life purpose:</strong> The overall direction and meaning of your life journey</li>
                <li><strong>Natural talents:</strong> Innate abilities and skills you possess</li>
                <li><strong>Personality traits:</strong> Core characteristics that define who you are</li>
                <li><strong>Life lessons:</strong> Challenges you'll face and overcome</li>
                <li><strong>Career path:</strong> Professional directions that align with your soul</li>
                <li><strong>Relationship compatibility:</strong> How you interact with others</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">How to Calculate Your Life Path Number</h2>
              <p>
                The calculation is straightforward but requires attention to detail. Here's the process:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>Write out your full birth date</strong> in numbers (MM-DD-YYYY format)
                  <br />
                  Example: March 15, 1990 = 03-15-1990
                </li>
                <li>
                  <strong>Reduce each component</strong> (month, day, year) to a single digit or master number:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Month: 03 = 3</li>
                    <li>Day: 15 = 1 + 5 = 6</li>
                    <li>Year: 1990 = 1 + 9 + 9 + 0 = 19 = 1 + 9 = 10 = 1 + 0 = 1</li>
                  </ul>
                </li>
                <li>
                  <strong>Add the reduced numbers</strong>: 3 + 6 + 1 = 10
                </li>
                <li>
                  <strong>Reduce to single digit</strong>: 10 = 1 + 0 = 1
                  <br />
                  Life Path Number = 1
                </li>
              </ol>
              <p className="mt-4">
                <strong>Important:</strong> If you encounter 11, 22, or 33 at any stage, do NOT reduce them further. 
                These are Master Numbers with special significance.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Life Path Numbers in Detail</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Life Path 1: The Leader</h3>
              <p>
                Independent, innovative, and ambitious, Life Path 1s are natural-born leaders. They're pioneers who aren't 
                afraid to blaze new trails and stand out from the crowd. With strong determination and original thinking, 
                they excel in entrepreneurship, management, and any role requiring initiative and courage. However, they 
                must watch for tendencies toward dominance, impatience, and stubbornness.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Life Path 2: The Peacemaker</h3>
              <p>
                Diplomatic, sensitive, and cooperative, Life Path 2s are the ultimate team players. They possess incredible 
                intuition and excel at bringing people together. Natural mediators and counselors, they thrive in roles 
                requiring empathy, patience, and collaboration. Their challenges include overcoming indecisiveness, 
                hypersensitivity, and the tendency to put others' needs before their own.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Life Path 3: The Creative Communicator</h3>
              <p>
                Expressive, optimistic, and artistic, Life Path 3s are blessed with incredible creative gifts. They're natural 
                performers and communicators who bring joy wherever they go. Whether through art, writing, speaking, or design, 
                they excel at self-expression. They must guard against scattered energy, superficiality, and mood swings that 
                can derail their considerable talents.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Life Path 4: The Builder</h3>
              <p>
                Practical, disciplined, and reliable, Life Path 4s are the foundation builders of society. They excel at 
                creating stable structures, whether in business, relationships, or physical construction. Their methodical 
                approach and strong work ethic make them excellent managers, accountants, and engineers. The challenge for 
                4s is avoiding rigidity, excessive seriousness, and resistance to change.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Life Path 5: The Freedom Seeker</h3>
              <p>
                Adventurous, versatile, and dynamic, Life Path 5s crave freedom and change. They're quick thinkers who adapt 
                easily to new situations and thrive on variety. Natural salespeople, travelers, and communicators, they bring 
                energy and excitement to everything they do. They must learn to balance their need for freedom with 
                responsibility and avoid impulsiveness and restlessness.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Life Path 6: The Nurturer</h3>
              <p>
                Responsible, caring, and harmonious, Life Path 6s are natural caregivers and teachers. They have a strong 
                sense of duty and excel at creating beautiful, harmonious environments. Whether as parents, counselors, nurses, 
                or designers, they're driven to help and heal others. Their challenges include worry, perfectionism, and the 
                tendency to interfere or become self-righteous.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Life Path 7: The Seeker</h3>
              <p>
                Analytical, spiritual, and introspective, Life Path 7s are deep thinkers and truth seekers. They possess sharp 
                minds and strong intuition, making them excellent researchers, analysts, and philosophers. Their quest for 
                knowledge and understanding sets them apart, though they must guard against isolation, skepticism, and appearing 
                cold or distant to others.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Life Path 8: The Powerhouse</h3>
              <p>
                Ambitious, authoritative, and business-minded, Life Path 8s are destined for material success and positions of 
                power. They have exceptional organizational skills and a natural understanding of money and business. As executives, 
                entrepreneurs, and financial advisors, they build empires. The key challenge is balancing material pursuits with 
                spiritual growth and avoiding workaholic tendencies.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Life Path 9: The Humanitarian</h3>
              <p>
                Compassionate, idealistic, and artistic, Life Path 9s are old souls with a global perspective. They're driven 
                to make the world a better place through humanitarian work, art, teaching, or healing. With tolerance and 
                understanding beyond their years, they inspire others to be better. Their challenges include impracticality, 
                scattered focus, and difficulty with financial matters.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Master Number 11: The Illuminator</h3>
              <p>
                Intuitive, inspirational, and spiritually aware, Master Number 11s are here to bring light and enlightenment 
                to others. They possess psychic abilities and deep spiritual insights that can inspire and heal. As teachers, 
                healers, and visionaries, they operate on a higher frequency. The intensity of this path can lead to nervous 
                energy, self-doubt, and feeling overwhelmed by their mission.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Master Number 22: The Master Builder</h3>
              <p>
                Visionary, powerful, and practical, Master Number 22s can turn the biggest dreams into reality. They combine 
                the intuition of 11 with the practicality of 4, making them capable of manifesting large-scale projects that 
                benefit humanity. As architects, CEOs, and diplomats, they build lasting legacies. The pressure of this path 
                can lead to self-doubt, burnout, and scattered energy if not properly channeled.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Master Number 33: The Master Teacher</h3>
              <p>
                The rarest Life Path, Master Number 33s are here to teach and heal on a grand scale. They possess unconditional 
                love and selfless devotion to humanity's betterment. As master teachers, spiritual guides, and humanitarian 
                leaders, they embody the highest form of compassionate service. The challenge is avoiding martyrdom, emotional 
                overwhelm, and unrealistic expectations of themselves and others.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Numerology Compatibility</h2>
              <p>
                Understanding Life Path Number compatibility can provide valuable insights into relationships:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>1, 5, 7:</strong> Independent souls who give each other space</li>
                <li><strong>2, 4, 8:</strong> Complementary energies seeking stability</li>
                <li><strong>3, 6, 9:</strong> Creative and nurturing combinations</li>
                <li><strong>11, 22, 33:</strong> Spiritual connections with shared missions</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Beyond Life Path Numbers</h2>
              <p>
                While Life Path Numbers are the foundation of numerology, a complete reading includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Expression Number:</strong> Derived from your full birth name, revealing your natural talents</li>
                <li><strong>Soul Urge Number:</strong> Your inner desires and motivations</li>
                <li><strong>Personality Number:</strong> How others perceive you</li>
                <li><strong>Birthday Number:</strong> A special gift or talent you possess</li>
                <li><strong>Maturity Number:</strong> Your ultimate life goal and purpose</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Practical Applications of Numerology</h2>
              <p>
                Numerology isn't just about self-discovery; it has practical applications in daily life:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Career Planning:</strong> Choose professions aligned with your Life Path</li>
                <li><strong>Relationship Insights:</strong> Understand compatibility and relationship dynamics</li>
                <li><strong>Timing Decisions:</strong> Use personal year numbers to time major life changes</li>
                <li><strong>Personal Growth:</strong> Recognize and work on life challenges</li>
                <li><strong>Parenting:</strong> Understand your children's innate nature and needs</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Frequently Asked Questions</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Can my Life Path Number change?</h3>
              <p>
                No, your Life Path Number is fixed and based on your birth date. However, you can evolve and grow within 
                the energy of your number, expressing its highest qualities as you mature.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">What if I don't relate to my Life Path Number?</h3>
              <p>
                You might be expressing the shadow or lower vibration of your number. Also, other numbers in your chart 
                (Expression, Soul Urge) significantly influence your personality. A complete numerology reading provides 
                a fuller picture.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Are Master Numbers better than regular numbers?</h3>
              <p>
                Master Numbers aren't "better" – they're more intense. They come with greater spiritual potential but also 
                greater challenges. Many Master Numbers operate on the lower vibration of their reduced number (11=2, 22=4) 
                until they're ready to step into their full power.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">How accurate is numerology?</h3>
              <p>
                Numerology is a tool for self-understanding, not fortune-telling. Its value lies in providing insights into 
                your natural tendencies, potential, and life lessons. Use it as a guide for personal growth and self-awareness.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
              <p>
                Your Life Path Number is a powerful tool for self-discovery and personal growth. It reveals your natural 
                talents, life purpose, and the lessons you're here to learn. By understanding and working with your number's 
                energy, you can make choices that align with your authentic self and fulfill your soul's mission.
              </p>
              <p>
                Remember, numerology is a guide, not a limitation. Your free will and choices ultimately determine your path. 
                Use this ancient wisdom to gain insight, make empowered decisions, and live a life true to your deepest nature.
              </p>
            </CardContent>
          </Card>

          <AutoAdSlot placement="in-feed" className="my-8" />
        </div>
      </div>
    </CalculatorLayoutWithAds>
  );
}
