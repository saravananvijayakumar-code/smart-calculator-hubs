import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Copy, Target, TrendingUp, Award } from 'lucide-react';
import EnhancedHealthCalculatorLayout from '@/components/EnhancedHealthCalculatorLayout';
import { SexInput, UnitToggle } from '@/components/health/SharedInputs';
import { calculateIdealWeight } from '@/lib/health/idealWeight';
import { formatNumber, UnitSystem, Sex, cmToInches, inchesToCm } from '@/lib/health/utils';
import { useToast } from '@/components/ui/use-toast';
import HealthSocialShare from '@/components/health/HealthSocialShare';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function IdealWeightCalculator() {
  const [sex, setSex] = useState<Sex>('male');
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [height, setHeight] = useState<number>(175);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    calculate();
  }, [sex, unit, height]);

  const calculate = () => {
    setError('');
    try {
      const heightInches = unit === 'metric' ? cmToInches(height) : height;
      const res = calculateIdealWeight({ sex, heightInches });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Calculation error');
      setResult(null);
    }
  };

  const copyResults = () => {
    if (!result) return;
    const text = `Ideal Weight Range: ${formatNumber(result.range.min)}-${formatNumber(result.range.max)} kg`;
    navigator.clipboard.writeText(text);
    toast({ title: '✅ Copied to clipboard!' });
  };

  return (
    <EnhancedHealthCalculatorLayout
      title="Ideal Weight Calculator 🎯"
      description="Calculate your ideal body weight using 4 scientifically validated formulas. 100% accurate to medical standards with instant results!"
      icon={<Target className="w-8 h-8" />}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <Alert className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 border-2 border-green-200 dark:border-green-700 animate-fade-in">
          <Info className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-base">
            <strong className="text-green-700 dark:text-green-300">🔬 Medical-Grade Accuracy:</strong> Results computed with 100% mathematical precision using 4 validated formulas (Devine, Hamwi, Robinson, Miller). Real-world physiology varies—consult healthcare professionals for personalized guidance.
          </AlertDescription>
        </Alert>

        <Card className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl border-2 border-blue-200 dark:border-blue-700 animate-slide-up">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            <Target className="w-6 h-6 text-blue-600 animate-bounce-slow" />
            Your Information
          </h3>
          <div className="space-y-6">
            <UnitToggle value={unit} onChange={setUnit} />
            <SexInput value={sex} onChange={setSex} />
            <div className="space-y-2">
              <Label htmlFor="height" className="text-base font-semibold">Height ({unit === 'metric' ? 'cm' : 'inches'})</Label>
              <Input
                id="height"
                type="number"
                value={height || ''}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                min={unit === 'metric' ? 152 : 60}
                step="0.1"
                className="text-lg p-6 border-2 border-blue-300 dark:border-blue-700 focus:ring-4 focus:ring-blue-500/50"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡 Minimum height: {unit === 'metric' ? '152 cm (5 feet)' : '60 inches'}
              </p>
            </div>
          </div>
        </Card>

        {error && (
          <Alert variant="destructive" className="animate-shake">
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Card className="p-8 bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl border-2 border-green-300 dark:border-green-700 animate-slide-up">
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
              <Award className="w-8 h-8 text-green-600 animate-bounce-slow" />
              Your Ideal Weight Range
            </h3>
            
            <div className="text-center p-8 bg-white dark:bg-gray-700 rounded-2xl mb-6 shadow-lg border-4 border-green-200 dark:border-green-700 animate-pulse-slow">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">🎯 Your Healthy Weight Range</p>
              <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-2">
                {formatNumber(result.range.min)} - {formatNumber(result.range.max)} kg
              </p>
              <p className="text-base text-gray-500">Based on 4 Scientific Formulas</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md border-2 border-blue-200 dark:border-blue-700 hover:scale-105 transition-transform">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">📐 Devine Formula (1974)</p>
                <p className="text-3xl font-bold text-blue-600">{formatNumber(result.devine)} kg</p>
                <p className="text-xs text-gray-500 mt-1">Most conservative estimate</p>
              </div>
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md border-2 border-purple-200 dark:border-purple-700 hover:scale-105 transition-transform">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">⚖️ Hamwi Formula (1964)</p>
                <p className="text-3xl font-bold text-purple-600">{formatNumber(result.hamwi)} kg</p>
                <p className="text-xs text-gray-500 mt-1">Widely used in healthcare</p>
              </div>
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md border-2 border-pink-200 dark:border-pink-700 hover:scale-105 transition-transform">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">📊 Robinson Formula (1983)</p>
                <p className="text-3xl font-bold text-pink-600">{formatNumber(result.robinson)} kg</p>
                <p className="text-xs text-gray-500 mt-1">Modern population-based</p>
              </div>
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md border-2 border-teal-200 dark:border-teal-700 hover:scale-105 transition-transform">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">🔬 Miller Formula (1983)</p>
                <p className="text-3xl font-bold text-teal-600">{formatNumber(result.miller)} kg</p>
                <p className="text-xs text-gray-500 mt-1">Most recent clinical data</p>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <Button onClick={copyResults} variant="outline" size="lg" className="flex-1 text-base">
                <Copy className="w-5 h-5 mr-2" /> Copy Results
              </Button>
            </div>

            <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 border-2 border-green-200 dark:border-green-700">
              <HealthSocialShare
                title="Ideal Weight Calculator"
                resultText={`My ideal weight range is ${formatNumber(result.range.min)}-${formatNumber(result.range.max)} kg based on 4 validated formulas! 🎯 Calculated using Devine, Hamwi, Robinson, and Miller methods. #idealweight #health #fitness`}
                hashtags={['idealweight', 'fitness', 'health', 'bodygoals', 'wellness']}
                category="health"
              />
            </Card>
          </Card>
        )}

        <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-700">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Understanding Ideal Body Weight (IBW)
          </h2>
          
          <div className="prose prose-lg max-w-none dark:prose-invert space-y-6">
            <section>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">🎯 What is Ideal Body Weight?</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Ideal Body Weight (IBW) is a theoretical weight range that medical professionals use as a reference point for optimal health. Unlike BMI, which only considers height and weight, IBW formulas were developed specifically for calculating medication dosages and assessing nutritional needs in clinical settings.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="text-blue-600">Why four formulas?</strong> Each formula was developed from different population studies across different decades. Using all four provides a comprehensive range that accounts for natural variation in body composition and frame size.
              </p>
            </section>

            <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-700">
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">📐 The Four Scientific Formulas</h3>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <h4 className="font-bold text-lg text-blue-600 mb-2">1️⃣ Devine Formula (1974)</h4>
                  <code className="block bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm mb-2">
                    Male: IBW = 50 kg + 2.3 kg × (height in inches - 60)<br/>
                    Female: IBW = 45.5 kg + 2.3 kg × (height in inches - 60)
                  </code>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    📚 <strong>History:</strong> Developed by Dr. Ben Devine for drug dosage calculations. Most widely cited in medical literature.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <h4 className="font-bold text-lg text-purple-600 mb-2">2️⃣ Hamwi Formula (1964)</h4>
                  <code className="block bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm mb-2">
                    Male: IBW = 48 kg + 2.7 kg × (height in inches - 60)<br/>
                    Female: IBW = 45.5 kg + 2.2 kg × (height in inches - 60)
                  </code>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    📚 <strong>History:</strong> Created by Dr. G.J. Hamwi for diabetes management. Tends to produce slightly higher weights than Devine.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <h4 className="font-bold text-lg text-pink-600 mb-2">3️⃣ Robinson Formula (1983)</h4>
                  <code className="block bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm mb-2">
                    Male: IBW = 52 kg + 1.9 kg × (height in inches - 60)<br/>
                    Female: IBW = 49 kg + 1.7 kg × (height in inches - 60)
                  </code>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    📚 <strong>History:</strong> Based on more recent population data. Produces results between Devine and Hamwi.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <h4 className="font-bold text-lg text-teal-600 mb-2">4️⃣ Miller Formula (1983)</h4>
                  <code className="block bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm mb-2">
                    Male: IBW = 56.2 kg + 1.41 kg × (height in inches - 60)<br/>
                    Female: IBW = 53.1 kg + 1.36 kg × (height in inches - 60)
                  </code>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    📚 <strong>History:</strong> Most recent formula with conservative height adjustment. Useful for nutrition assessment.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="text-yellow-700 dark:text-yellow-300">⚠️ Important Note:</strong> All formulas assume height ≥ 60 inches (152 cm). For heights below this, calculations become less accurate.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">🎯 How to Use Your Results</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900 p-5 rounded-xl border-2 border-green-200 dark:border-green-700">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <span className="text-2xl">✅</span> The Range is Your Target
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Your ideal weight isn't a single number—it's a range! Most people's healthy weight falls somewhere between the minimum and maximum values.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900 p-5 rounded-xl border-2 border-blue-200 dark:border-blue-700">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <span className="text-2xl">💪</span> Body Composition Matters
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Muscle weighs more than fat. Athletes and highly active individuals may healthily exceed these ranges while maintaining low body fat percentages.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900 p-5 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <span className="text-2xl">🔬</span> Medical Applications
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Healthcare providers use IBW to calculate medication dosages, assess nutritional status, and determine appropriate ventilator settings in critical care.
                  </p>
                </div>

                <div className="bg-pink-50 dark:bg-pink-900 p-5 rounded-xl border-2 border-pink-200 dark:border-pink-700">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <span className="text-2xl">⚖️</span> Frame Size Adjustment
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Small-framed individuals may target the lower end of the range, while large-framed people may be healthier at the higher end. Wrist circumference can help determine frame size.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 p-6 rounded-xl border-2 border-yellow-300 dark:border-yellow-700">
              <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">⚠️ Important Limitations</h3>
              
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🚫</span>
                  <div>
                    <h4 className="font-bold">Not for Children or Adolescents</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      These formulas were developed for adults. Use pediatric growth charts for individuals under 18.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🏋️</span>
                  <div>
                    <h4 className="font-bold">Athletes May Exceed These Values</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Bodybuilders, powerlifters, and athletes with high muscle mass will naturally exceed IBW while maintaining excellent health. Use body fat percentage instead.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🤰</span>
                  <div>
                    <h4 className="font-bold">Pregnancy Requires Different Standards</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Pregnant women should consult their healthcare provider for appropriate weight gain targets based on pre-pregnancy BMI.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🧓</span>
                  <div>
                    <h4 className="font-bold">Age Considerations</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Older adults may benefit from slightly higher weights to maintain muscle mass and bone density. These formulas don't adjust for age.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">❓ Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <details className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-2 border-blue-200 dark:border-blue-700 cursor-pointer hover:shadow-lg transition-shadow">
                  <summary className="font-bold text-lg text-blue-600 cursor-pointer">
                    Q: Why do the four formulas give different results?
                  </summary>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Each formula was developed from different population studies at different times (1964-1983). They use different base weights and height adjustments. The variation between them represents natural diversity in human body composition. Using all four gives you a comprehensive range rather than a single rigid target.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-2 border-purple-200 dark:border-purple-700 cursor-pointer hover:shadow-lg transition-shadow">
                  <summary className="font-bold text-lg text-purple-600 cursor-pointer">
                    Q: Should I aim for the middle of the range?
                  </summary>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Not necessarily! Your optimal weight within the range depends on your frame size, muscle mass, and individual physiology. Small-framed individuals may be healthiest at the lower end, while large-framed or muscular individuals may thrive at the higher end. Focus on body composition (muscle vs. fat) rather than the scale number.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-2 border-green-200 dark:border-green-700 cursor-pointer hover:shadow-lg transition-shadow">
                  <summary className="font-bold text-lg text-green-600 cursor-pointer">
                    Q: I'm very muscular—why is my IBW lower than my actual weight?
                  </summary>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    These formulas were developed for average body composition, not athletes or bodybuilders. Muscle tissue is denser than fat, so highly muscular individuals will naturally exceed their IBW while maintaining low body fat percentages. Consider using body fat percentage measurements or waist-to-hip ratio as better health indicators.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-2 border-pink-200 dark:border-pink-700 cursor-pointer hover:shadow-lg transition-shadow">
                  <summary className="font-bold text-lg text-pink-600 cursor-pointer">
                    Q: How do I determine my frame size?
                  </summary>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    <strong>Wrist measurement method:</strong> Wrap your thumb and middle finger around your opposite wrist. If they overlap significantly = small frame. If they just touch = medium frame. If they don't meet = large frame. <strong>Alternative:</strong> Measure wrist circumference and compare to height using standardized charts.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-2 border-teal-200 dark:border-teal-700 cursor-pointer hover:shadow-lg transition-shadow">
                  <summary className="font-bold text-lg text-teal-600 cursor-pointer">
                    Q: Is IBW better than BMI?
                  </summary>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Both have strengths and limitations. BMI is quick and correlates with health risks at population levels but doesn't account for muscle mass. IBW provides a range rather than a single number and was designed for clinical applications. Use both as reference tools alongside body composition measurements, waist circumference, and overall health markers.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-2 border-orange-200 dark:border-orange-700 cursor-pointer hover:shadow-lg transition-shadow">
                  <summary className="font-bold text-lg text-orange-600 cursor-pointer">
                    Q: Can I use this calculator if I'm under 5 feet tall?
                  </summary>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    The formulas become less accurate below 60 inches (152 cm / 5 feet) because they were validated on taller populations. For individuals with short stature, consult a healthcare provider who can use specialized assessment methods and consider your complete health profile.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-2 border-red-200 dark:border-red-700 cursor-pointer hover:shadow-lg transition-shadow">
                  <summary className="font-bold text-lg text-red-600 cursor-pointer">
                    Q: What if my current weight is far from the calculated range?
                  </summary>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    First, don't panic! IBW is a reference point, not a strict rule. If you're significantly above or below the range, consider: (1) Your body composition—muscle weighs more than fat, (2) Your overall health markers—blood pressure, cholesterol, blood sugar, (3) Your energy levels and quality of life. Consult a healthcare provider before making major changes. Gradual, sustainable changes are more effective than drastic measures.
                  </p>
                </details>
              </div>
            </section>

            <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-6 rounded-xl border-2 border-blue-300 dark:border-blue-700">
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">💡 Tips for Healthy Weight Management</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <span className="text-2xl">🍎</span>
                    <div>
                      <h4 className="font-bold">Focus on Nutrition Quality</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Prioritize whole foods, vegetables, lean proteins, and healthy fats over processed foods—regardless of calorie count.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="text-2xl">🏃</span>
                    <div>
                      <h4 className="font-bold">Strength Training Matters</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Building muscle increases metabolism and improves body composition. Don't focus solely on cardio.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="text-2xl">😴</span>
                    <div>
                      <h4 className="font-bold">Sleep is Crucial</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Poor sleep disrupts hunger hormones (ghrelin and leptin) and makes weight management significantly harder.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <span className="text-2xl">💧</span>
                    <div>
                      <h4 className="font-bold">Stay Hydrated</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Adequate water intake supports metabolism and helps distinguish between hunger and thirst signals.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h4 className="font-bold">Track Body Composition</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Use measurements like waist circumference, body fat percentage, and how your clothes fit—not just the scale.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="text-2xl">🧘</span>
                    <div>
                      <h4 className="font-bold">Manage Stress</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Chronic stress elevates cortisol, which promotes fat storage, especially around the abdomen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 p-6 rounded-xl border-2 border-green-300 dark:border-green-700">
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3">🎯 The Bottom Line</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Ideal Body Weight formulas provide a useful reference range based on decades of medical research. However, they're just one tool in assessing health—not the definitive answer. Your optimal weight depends on your unique body composition, frame size, muscle mass, health goals, and overall wellness markers.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                  <strong className="text-green-600 dark:text-green-400">Remember:</strong> Health is multidimensional. A person at their "ideal" weight who eats poorly, doesn't exercise, and has high stress may be less healthy than someone outside the range who prioritizes nutrition, fitness, sleep, and mental wellbeing.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3 font-semibold">
                  💚 Focus on sustainable habits that make you feel energized, strong, and confident—the numbers will follow naturally!
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-600 p-6 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            <strong>⚠️ Medical Disclaimer:</strong> This calculator is for educational purposes only. Always consult qualified healthcare professionals for personalized medical advice, diagnosis, or treatment planning. IBW formulas do not account for individual variations in body composition, bone density, or health conditions.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s infinite; }
        .animate-shake { animation: shake 0.5s ease-out; }
      `}</style>
    </EnhancedHealthCalculatorLayout>
  );
}
