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
import { Clock, Sparkles, Share2, AlertTriangle, Heart, TrendingUp, Award, Calendar, Cake, Activity } from 'lucide-react';
import { AIAnalysis } from '@/components/AIAnalysis';
import ExportShareButtons from '@/components/ExportShareButtons';
import { SEOHead } from '@/components/SEOHead';
import { AdsterraSlot } from '@/components/ads/AdsterraSlot';

interface LifeExpectancyResults {
  lifeExpectancy: number;
  yearsRemaining: number;
  estimatedDeathYear: number;
  healthScore: number;
  lifeStage: string;
  healthFactors: {
    category: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  recommendations: string[];
  milestones: {
    age: number;
    description: string;
  }[];
}

export default function LifeExpectancyCalculator() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<string>('');
  const [smokingStatus, setSmokingStatus] = useState<string>('');
  const [exerciseFrequency, setExerciseFrequency] = useState<string>('');
  const [diet, setDiet] = useState<string>('');
  const [familyHistory, setFamilyHistory] = useState<string>('');
  const [stressLevel, setStressLevel] = useState<string>('');
  
  const [results, setResults] = useState<LifeExpectancyResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  
  const { toast } = useToast();

  const handleCalculate = () => {
    const currentAge = parseInt(age);
    
    if (!age || currentAge < 1 || currentAge > 120) {
      setError('Please enter a valid age (1-120)');
      return;
    }

    if (!gender) {
      setError('Please select your gender');
      return;
    }

    if (!smokingStatus) {
      setError('Please select your smoking status');
      return;
    }

    if (!exerciseFrequency) {
      setError('Please select your exercise frequency');
      return;
    }

    if (!diet) {
      setError('Please select your diet quality');
      return;
    }

    if (!familyHistory) {
      setError('Please select your family history');
      return;
    }

    if (!stressLevel) {
      setError('Please select your stress level');
      return;
    }

    setError(null);
    setIsCalculating(true);
    setShowAnimation(false);

    setTimeout(() => {
      let baseLifeExpectancy = gender === 'male' ? 76 : 81;
      
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - currentAge;
      
      const healthFactors: LifeExpectancyResults['healthFactors'] = [];
      let totalAdjustment = 0;

      if (smokingStatus === 'never') {
        totalAdjustment += 5;
        healthFactors.push({
          category: 'Smoking',
          impact: 'positive',
          description: 'Non-smoker: Adds 5 years to life expectancy'
        });
      } else if (smokingStatus === 'former') {
        totalAdjustment += 2;
        healthFactors.push({
          category: 'Smoking',
          impact: 'positive',
          description: 'Former smoker: Adds 2 years (great job quitting!)'
        });
      } else if (smokingStatus === 'current') {
        totalAdjustment -= 10;
        healthFactors.push({
          category: 'Smoking',
          impact: 'negative',
          description: 'Current smoker: Reduces life expectancy by 10 years'
        });
      }

      if (exerciseFrequency === 'daily') {
        totalAdjustment += 7;
        healthFactors.push({
          category: 'Exercise',
          impact: 'positive',
          description: 'Daily exercise: Adds 7 years to life expectancy'
        });
      } else if (exerciseFrequency === 'regular') {
        totalAdjustment += 4;
        healthFactors.push({
          category: 'Exercise',
          impact: 'positive',
          description: 'Regular exercise (3-5x/week): Adds 4 years'
        });
      } else if (exerciseFrequency === 'occasional') {
        totalAdjustment += 1;
        healthFactors.push({
          category: 'Exercise',
          impact: 'positive',
          description: 'Occasional exercise: Adds 1 year'
        });
      } else if (exerciseFrequency === 'sedentary') {
        totalAdjustment -= 3;
        healthFactors.push({
          category: 'Exercise',
          impact: 'negative',
          description: 'Sedentary lifestyle: Reduces life expectancy by 3 years'
        });
      }

      if (diet === 'excellent') {
        totalAdjustment += 6;
        healthFactors.push({
          category: 'Diet',
          impact: 'positive',
          description: 'Excellent diet: Adds 6 years to life expectancy'
        });
      } else if (diet === 'good') {
        totalAdjustment += 3;
        healthFactors.push({
          category: 'Diet',
          impact: 'positive',
          description: 'Good diet: Adds 3 years to life expectancy'
        });
      } else if (diet === 'average') {
        healthFactors.push({
          category: 'Diet',
          impact: 'neutral',
          description: 'Average diet: Neutral impact'
        });
      } else if (diet === 'poor') {
        totalAdjustment -= 4;
        healthFactors.push({
          category: 'Diet',
          impact: 'negative',
          description: 'Poor diet: Reduces life expectancy by 4 years'
        });
      }

      if (familyHistory === 'excellent') {
        totalAdjustment += 5;
        healthFactors.push({
          category: 'Genetics',
          impact: 'positive',
          description: 'Excellent family history: Adds 5 years'
        });
      } else if (familyHistory === 'good') {
        totalAdjustment += 2;
        healthFactors.push({
          category: 'Genetics',
          impact: 'positive',
          description: 'Good family history: Adds 2 years'
        });
      } else if (familyHistory === 'average') {
        healthFactors.push({
          category: 'Genetics',
          impact: 'neutral',
          description: 'Average family history: Neutral impact'
        });
      } else if (familyHistory === 'poor') {
        totalAdjustment -= 3;
        healthFactors.push({
          category: 'Genetics',
          impact: 'negative',
          description: 'Family history concerns: Reduces by 3 years'
        });
      }

      if (stressLevel === 'low') {
        totalAdjustment += 3;
        healthFactors.push({
          category: 'Stress',
          impact: 'positive',
          description: 'Low stress: Adds 3 years to life expectancy'
        });
      } else if (stressLevel === 'moderate') {
        healthFactors.push({
          category: 'Stress',
          impact: 'neutral',
          description: 'Moderate stress: Neutral impact'
        });
      } else if (stressLevel === 'high') {
        totalAdjustment -= 4;
        healthFactors.push({
          category: 'Stress',
          impact: 'negative',
          description: 'High stress: Reduces life expectancy by 4 years'
        });
      }

      const finalLifeExpectancy = Math.round(baseLifeExpectancy + totalAdjustment);
      const yearsRemaining = Math.max(0, finalLifeExpectancy - currentAge);
      const estimatedDeathYear = birthYear + finalLifeExpectancy;
      
      const healthScore = Math.min(100, Math.max(0, Math.round(50 + totalAdjustment * 2)));

      const lifeStage = 
        currentAge < 18 ? 'Youth' :
        currentAge < 30 ? 'Young Adult' :
        currentAge < 50 ? 'Adult' :
        currentAge < 65 ? 'Middle Age' :
        currentAge < 80 ? 'Senior' : 'Elderly';

      const recommendations: string[] = [];
      
      if (smokingStatus === 'current') {
        recommendations.push('🚭 Quit smoking - it\'s the single best thing you can do for longevity');
      }
      
      if (exerciseFrequency === 'sedentary' || exerciseFrequency === 'occasional') {
        recommendations.push('🏃 Increase physical activity to at least 150 minutes per week');
      }
      
      if (diet === 'poor' || diet === 'average') {
        recommendations.push('🥗 Improve diet quality - eat more vegetables, fruits, and whole grains');
      }
      
      if (stressLevel === 'high') {
        recommendations.push('🧘 Practice stress management - meditation, yoga, or therapy can help');
      }
      
      if (familyHistory === 'poor') {
        recommendations.push('🏥 Regular health screenings are especially important given family history');
      }
      
      recommendations.push('💪 Build strong social connections - loneliness impacts longevity');
      recommendations.push('😴 Prioritize 7-9 hours of quality sleep per night');

      const milestones: LifeExpectancyResults['milestones'] = [];
      
      if (currentAge < 50) {
        milestones.push({ age: 50, description: 'Reach half a century - time for comprehensive health screening' });
      }
      if (currentAge < 65) {
        milestones.push({ age: 65, description: 'Retirement age - begin a new chapter of life' });
      }
      if (currentAge < 75) {
        milestones.push({ age: 75, description: '75th birthday - three-quarters of a century!' });
      }
      if (currentAge < 80) {
        milestones.push({ age: 80, description: '80th birthday - octogenarian status achieved' });
      }
      if (currentAge < 90 && finalLifeExpectancy >= 90) {
        milestones.push({ age: 90, description: '90th birthday - nonagenarian milestone' });
      }
      if (currentAge < 100 && finalLifeExpectancy >= 100) {
        milestones.push({ age: 100, description: '100th birthday - join the centenarian club!' });
      }

      const result: LifeExpectancyResults = {
        lifeExpectancy: finalLifeExpectancy,
        yearsRemaining,
        estimatedDeathYear,
        healthScore,
        lifeStage,
        healthFactors,
        recommendations,
        milestones
      };

      setResults(result);
      setIsCalculating(false);
      setShowAnimation(true);
    }, 1500);
  };

  const shareText = results 
    ? `⏰ My estimated life expectancy is ${results.lifeExpectancy} years with ${results.yearsRemaining} years remaining! My health score: ${results.healthScore}/100. Calculate yours!`
    : '';

  return (
    <>
      <SEOHead
        title="Life Expectancy Calculator ⏰ - Estimate Your Lifespan | Longevity Calculator"
        description="Calculate your estimated life expectancy based on lifestyle, health habits, and genetics. Get personalized insights and recommendations to live longer and healthier. Free life expectancy calculator with health score."
        keywords="life expectancy calculator, lifespan calculator, longevity calculator, how long will I live, life expectancy, health calculator, mortality calculator, death calculator"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-7xl">


          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl mb-4 shadow-lg">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-4">
              Life Expectancy Calculator ⏰
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover your estimated life expectancy based on your lifestyle, health habits, and genetics. Get personalized insights to live longer!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Heart className="w-6 h-6 text-blue-600" />
                    Calculate Your Life Expectancy
                  </CardTitle>
                  <CardDescription>
                    Answer these questions honestly for the most accurate estimate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-base font-semibold">Current Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="text-lg h-12"
                        min="1"
                        max="120"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-base font-semibold">Gender</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="text-lg h-12">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smoking" className="text-base font-semibold">Smoking Status</Label>
                    <Select value={smokingStatus} onValueChange={setSmokingStatus}>
                      <SelectTrigger className="text-lg h-12">
                        <SelectValue placeholder="Select smoking status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never smoked</SelectItem>
                        <SelectItem value="former">Former smoker (quit)</SelectItem>
                        <SelectItem value="current">Current smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exercise" className="text-base font-semibold">Exercise Frequency</Label>
                    <Select value={exerciseFrequency} onValueChange={setExerciseFrequency}>
                      <SelectTrigger className="text-lg h-12">
                        <SelectValue placeholder="How often do you exercise?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily (7+ days/week)</SelectItem>
                        <SelectItem value="regular">Regular (3-5 days/week)</SelectItem>
                        <SelectItem value="occasional">Occasional (1-2 days/week)</SelectItem>
                        <SelectItem value="sedentary">Sedentary (rarely)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diet" className="text-base font-semibold">Diet Quality</Label>
                    <Select value={diet} onValueChange={setDiet}>
                      <SelectTrigger className="text-lg h-12">
                        <SelectValue placeholder="How would you rate your diet?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent (mostly whole foods)</SelectItem>
                        <SelectItem value="good">Good (balanced, some treats)</SelectItem>
                        <SelectItem value="average">Average (could be better)</SelectItem>
                        <SelectItem value="poor">Poor (lots of processed foods)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="family" className="text-base font-semibold">Family History</Label>
                    <Select value={familyHistory} onValueChange={setFamilyHistory}>
                      <SelectTrigger className="text-lg h-12">
                        <SelectValue placeholder="Family longevity and health" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent (most lived past 80)</SelectItem>
                        <SelectItem value="good">Good (many lived past 75)</SelectItem>
                        <SelectItem value="average">Average (mixed)</SelectItem>
                        <SelectItem value="poor">Concerning (early deaths/diseases)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stress" className="text-base font-semibold">Stress Level</Label>
                    <Select value={stressLevel} onValueChange={setStressLevel}>
                      <SelectTrigger className="text-lg h-12">
                        <SelectValue placeholder="How stressed are you?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (well-managed)</SelectItem>
                        <SelectItem value="moderate">Moderate (some stress)</SelectItem>
                        <SelectItem value="high">High (often overwhelmed)</SelectItem>
                      </SelectContent>
                    </Select>
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
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                  >
                    {isCalculating ? (
                      <><Sparkles className="mr-2 h-5 w-5 animate-spin" /> Calculating...</>
                    ) : (
                      <><Clock className="mr-2 h-5 w-5" /> Calculate Life Expectancy</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {results && (
                <>
                  <div className={`transform transition-all duration-700 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40">
                      <CardContent className="pt-8 text-center">
                        <div className="mb-6">
                          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">Your Estimated Life Expectancy</p>
                          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-2xl mb-4">
                            <span className="text-5xl font-bold text-white">{results.lifeExpectancy}</span>
                          </div>
                          <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {results.yearsRemaining} years remaining
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            Estimated year: {results.estimatedDeathYear}
                          </p>
                        </div>
                        
                        <div className="mb-6">
                          <p className="font-semibold mb-2">Health Score</p>
                          <div className="flex items-center justify-center gap-3">
                            <Progress value={results.healthScore} className="h-4 flex-1 max-w-md" />
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {results.healthScore}/100
                            </span>
                          </div>
                        </div>

                        <Badge className="text-lg px-4 py-2 bg-cyan-500 text-white mb-6">
                          Life Stage: {results.lifeStage}
                        </Badge>

                        <ExportShareButtons
                          calculatorType="life-expectancy"
                          inputs={{ age, gender, smokingStatus, exerciseFrequency, diet, familyHistory, stressLevel }}
                          results={{ lifeExpectancy: results.lifeExpectancy, yearsRemaining: results.yearsRemaining }}
                          title={shareText}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <AdsterraSlot position="middle" />

                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        Health Factors Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {results.healthFactors.map((factor, idx) => (
                        <div 
                          key={idx} 
                          className={`p-4 rounded-lg ${
                            factor.impact === 'positive' ? 'bg-green-50 dark:bg-green-900/20' :
                            factor.impact === 'negative' ? 'bg-red-50 dark:bg-red-900/20' :
                            'bg-gray-50 dark:bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-3 h-3 rounded-full mt-1 ${
                              factor.impact === 'positive' ? 'bg-green-500' :
                              factor.impact === 'negative' ? 'bg-red-500' :
                              'bg-gray-400'
                            }`}></div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">{factor.category}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{factor.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>



                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Activity className="w-6 h-6 text-green-600" />
                        Personalized Recommendations
                      </CardTitle>
                      <CardDescription>
                        Follow these to increase your life expectancy
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.recommendations.map((rec, idx) => (
                          <div key={idx} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {results.milestones.length > 0 && (
                    <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                          <Cake className="w-6 h-6 text-purple-600" />
                          Upcoming Life Milestones
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {results.milestones.map((milestone, idx) => (
                            <div key={idx} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {milestone.age}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">{milestone.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}


                </>
              )}
            </div>

            <div className="space-y-6">
              <AdsterraSlot position="middle" />
              
              <Card className="shadow-xl border-0 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl">⚠️ Important Disclaimer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                  <div>
                    <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">For Entertainment</h3>
                    <p>This calculator provides estimates based on statistical averages. It cannot predict your actual lifespan, which depends on many unpredictable factors.</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Not Medical Advice</h3>
                    <p>This tool is not a substitute for professional medical advice. Always consult healthcare providers for health concerns and decisions.</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Use Positively</h3>
                    <p>Use results as motivation to adopt healthier habits, not as a source of anxiety. Every healthy choice you make can improve your outcomes!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="shadow-xl border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-3xl">The Science of Longevity: Living Longer and Healthier</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <h2 className="text-2xl font-bold mt-6 mb-4">Understanding Life Expectancy</h2>
              <p>
                Life expectancy is a statistical measure of the average time a person is expected to live based on current 
                age, gender, and various demographic factors. It's important to understand that this is an average—not a 
                prediction for any individual. Some people will live much longer, others shorter, depending on genetics, 
                lifestyle, environment, and pure chance.
              </p>
              <p>
                Global life expectancy has dramatically increased over the past century, rising from about 31 years in 1900 
                to over 72 years today. This improvement comes primarily from reduced infant mortality, better sanitation, 
                vaccines, antibiotics, and improved medical care. However, lifestyle factors now play an increasingly important 
                role in determining how long—and how well—we live.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">The Biggest Factors Affecting Longevity</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">Genetics (20-30%)</h3>
              <p>
                While you can't choose your genes, they play a significant role in longevity. Family history of longevity is 
                one of the strongest predictors of your own lifespan. If your parents and grandparents lived into their 90s, 
                you have a better chance of doing the same. However, genes are not destiny—lifestyle can amplify or diminish 
                genetic advantages.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Lifestyle Choices (70-80%)</h3>
              <p>
                The good news: most factors affecting longevity are within your control. Research shows that lifestyle choices 
                account for 70-80% of how long you live and, importantly, the quality of those years. The main lifestyle factors 
                include smoking, diet, exercise, alcohol consumption, sleep, stress management, and social connections.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Smoking: The Biggest Killer</h3>
              <p>
                Smoking is the single most preventable cause of death, reducing life expectancy by an average of 10 years. 
                Smokers face dramatically increased risks of cancer, heart disease, stroke, and respiratory diseases. However, 
                quitting at any age provides benefits:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Quit before 30: Avoid almost all smoking-related risks</li>
                <li>Quit before 40: Avoid 90% of excess mortality risk</li>
                <li>Quit before 50: Cut excess risk in half</li>
                <li>Quit at any age: Immediate and long-term health benefits</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Exercise: The Longevity Drug</h3>
              <p>
                If exercise were a pill, it would be the most prescribed medication in the world. Regular physical activity 
                can add up to 7 years to your life expectancy. It reduces risk of:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Heart disease by 35%</li>
                <li>Stroke by 30%</li>
                <li>Type 2 diabetes by 50%</li>
                <li>Certain cancers by 20-30%</li>
                <li>Dementia by 30%</li>
                <li>Depression by 30%</li>
              </ul>
              <p>
                The sweet spot is 150-300 minutes of moderate activity or 75-150 minutes of vigorous activity weekly, plus 
                strength training twice weekly. However, even small amounts of activity provide benefits—every minute counts!
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Diet: You Are What You Eat</h3>
              <p>
                Diet quality significantly impacts both lifespan and healthspan. The Mediterranean diet, rich in vegetables, 
                fruits, whole grains, legumes, nuts, fish, and olive oil, is consistently associated with longevity. Key 
                principles include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Eat mostly plants—vegetables, fruits, whole grains, legumes, nuts</li>
                <li>Choose healthy fats—olive oil, avocados, fatty fish</li>
                <li>Limit processed foods, added sugars, and excessive red meat</li>
                <li>Practice portion control and mindful eating</li>
                <li>Stay hydrated with water</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Social Connections: The Hidden Longevity Factor</h3>
              <p>
                Loneliness and social isolation are as harmful to health as smoking 15 cigarettes daily. Strong social 
                connections can increase longevity by 50%. Social relationships:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Reduce stress hormones</li>
                <li>Boost immune function</li>
                <li>Encourage healthier behaviors</li>
                <li>Provide emotional support during challenges</li>
                <li>Give life purpose and meaning</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Sleep: The Foundation of Health</h3>
              <p>
                Consistently sleeping 7-9 hours per night is crucial for longevity. Both too little sleep (under 6 hours) and 
                too much (over 9 hours) are associated with increased mortality. Quality sleep:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Repairs cellular damage</li>
                <li>Consolidates memories</li>
                <li>Regulates hormones</li>
                <li>Supports immune function</li>
                <li>Reduces inflammation</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Stress Management: The Silent Killer</h3>
              <p>
                Chronic stress accelerates aging at the cellular level, literally shortening telomeres (protective caps on 
                chromosomes). Effective stress management through meditation, yoga, time in nature, hobbies, or therapy can 
                add years to your life by reducing stress-related diseases.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Blue Zones: Lessons from the Longest-Living People</h2>
              <p>
                Blue Zones are regions where people consistently live past 100 at much higher rates than average. These include 
                Okinawa (Japan), Sardinia (Italy), Nicoya (Costa Rica), Ikaria (Greece), and Loma Linda (California). Common 
                factors among Blue Zone centenarians:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Move naturally:</strong> Regular low-intensity physical activity integrated into daily life</li>
                <li><strong>Purpose:</strong> A clear sense of why they wake up each morning</li>
                <li><strong>Downshift:</strong> Routines to shed stress (prayer, naps, happy hour)</li>
                <li><strong>80% Rule:</strong> Stop eating when 80% full</li>
                <li><strong>Plant slant:</strong> Diets based on beans, nuts, and vegetables</li>
                <li><strong>Wine at 5:</strong> Moderate alcohol consumption (1-2 glasses daily) with friends</li>
                <li><strong>Belong:</strong> Participation in a faith-based community</li>
                <li><strong>Loved ones first:</strong> Keeping aging parents nearby, commitment to life partner</li>
                <li><strong>Right tribe:</strong> Social circles that support healthy behaviors</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">The Difference Between Lifespan and Healthspan</h2>
              <p>
                While lifespan refers to how long you live, healthspan refers to how many of those years you live in good 
                health. The goal isn't just to add years to your life, but to add life to your years. Many people spend their 
                last 10-20 years with chronic diseases, disability, and reduced quality of life.
              </p>
              <p>
                Focusing on healthspan means:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining physical function and independence</li>
                <li>Preserving cognitive abilities</li>
                <li>Preventing or managing chronic diseases</li>
                <li>Sustaining social engagement and purpose</li>
                <li>Enjoying activities you love</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Cutting-Edge Longevity Research</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">Caloric Restriction</h3>
              <p>
                Eating 20-40% fewer calories while maintaining nutrition has extended lifespan in many organisms. In humans, 
                caloric restriction shows promise for slowing aging markers, though long-term studies are ongoing. A more 
                practical approach might be intermittent fasting, which shows similar benefits.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Senolytic Drugs</h3>
              <p>
                These experimental drugs target and eliminate senescent cells—"zombie cells" that accumulate with age and 
                contribute to aging and age-related diseases. Early results in animals are promising, with human trials underway.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Rapamycin</h3>
              <p>
                Originally an immunosuppressant, rapamycin has extended lifespan in multiple organisms by inhibiting the mTOR 
                pathway involved in aging. Some longevity enthusiasts take it off-label, though long-term effects in healthy 
                humans are unknown.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">NAD+ Boosters</h3>
              <p>
                NAD+ (nicotinamide adenine dinucleotide) declines with age, affecting cellular energy and DNA repair. Supplements 
                like NMN and NR aim to restore NAD+ levels, with early research showing promise for healthspan extension.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Practical Steps to Increase Your Life Expectancy</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">Start Today</h3>
              <p>
                You don't need to overhaul your entire life at once. Small, consistent changes compound over time:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Add one vegetable serving daily</li>
                <li>Walk 10 minutes after meals</li>
                <li>Sleep 30 minutes earlier</li>
                <li>Call a friend weekly</li>
                <li>Practice 5 minutes of meditation</li>
                <li>Replace one processed snack with nuts or fruit</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Regular Health Screenings</h3>
              <p>
                Early detection saves lives. Follow recommended screening schedules for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Blood pressure (annually)</li>
                <li>Cholesterol (every 4-6 years)</li>
                <li>Diabetes (every 3 years if at risk)</li>
                <li>Colonoscopy (starting at 45-50)</li>
                <li>Mammography (annually after 40-50)</li>
                <li>Skin checks (annually if at risk)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Optimize What You Control</h3>
              <p>
                While you can't change your genes or prevent all disease, you can optimize controllable factors:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Don't smoke:</strong> Or quit immediately if you do</li>
                <li><strong>Move daily:</strong> At least 30 minutes of activity</li>
                <li><strong>Eat real food:</strong> Mostly plants, not too much</li>
                <li><strong>Manage stress:</strong> Find what works for you</li>
                <li><strong>Prioritize sleep:</strong> 7-9 hours nightly</li>
                <li><strong>Cultivate relationships:</strong> Invest in social connections</li>
                <li><strong>Find purpose:</strong> Have reasons to get up each morning</li>
                <li><strong>Stay curious:</strong> Keep learning and growing</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Frequently Asked Questions</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">Can you really predict when someone will die?</h3>
              <p>
                No. Life expectancy calculators provide statistical estimates based on population averages and known risk 
                factors. They cannot predict individual outcomes, which depend on countless variables including pure chance. 
                Use these tools for general awareness and motivation, not as definitive predictions.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Is it ever too late to improve my life expectancy?</h3>
              <p>
                Never. Every healthy change provides benefits regardless of age. Quitting smoking at 60 still adds years to 
                your life. Starting exercise at 70 still reduces disease risk. Improving diet at any age supports better health. 
                The best time to start was yesterday; the second-best time is today.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Why do women live longer than men?</h3>
              <p>
                Women outlive men by an average of 5-7 years across nearly all countries. Reasons include biological factors 
                (hormones, genetics), behavioral differences (men take more risks, are less likely to seek medical care), and 
                social factors. However, the gap is narrowing as lifestyle behaviors become more similar.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">What's the maximum human lifespan?</h3>
              <p>
                The verified oldest person lived to 122 years. Most scientists believe the maximum human lifespan is somewhere 
                between 120-150 years, though this could potentially increase with future medical advances. However, very few 
                people currently live past 110, and reaching 100 remains a rare achievement.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion: Focus on Life Quality, Not Just Quantity</h2>
              <p>
                While extending lifespan is valuable, the ultimate goal should be maximizing healthspan—the years you live in 
                good health, with vitality, independence, and joy. The strategies that extend life also improve its quality:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Exercise gives you energy and strength for daily activities</li>
                <li>Good nutrition improves mood and mental clarity</li>
                <li>Social connections provide happiness and support</li>
                <li>Purpose gives meaning beyond mere existence</li>
                <li>Stress management enhances daily wellbeing</li>
                <li>Quality sleep improves everything</li>
              </ul>
              <p>
                Don't become obsessed with the number of years. Instead, focus on making each day count. Invest in your health, 
                nurture relationships, pursue meaningful goals, and enjoy the journey. A life well-lived is measured not just in 
                years, but in moments of joy, love, growth, and contribution.
              </p>
              <p>
                Remember: you have far more control over your longevity than you might think. The choices you make today shape 
                the years ahead. Choose wisely, but also choose joy. After all, what's the point of living longer if you're not 
                truly living?
              </p>
            </CardContent>
          </Card>


        </div>
      </div>
    </>
  );
}
