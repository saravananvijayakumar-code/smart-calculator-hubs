import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Copy, Share2, Activity, TrendingDown, Target, Award, Flame, Heart } from 'lucide-react';
import EnhancedHealthCalculatorLayout from '@/components/EnhancedHealthCalculatorLayout';
import { SexInput, UnitToggle, WeightInput, CircumferenceInput } from '@/components/health/SharedInputs';
import { calculateBodyFat } from '@/lib/health/bodyFat';
import { formatNumber, UnitSystem, Sex, cmToInches, inchesToCm, kgToLbs, lbsToKg } from '@/lib/health/utils';
import { useToast } from '@/components/ui/use-toast';
import AutoAdSlot from '@/components/ads/AutoAdSlot';
import AmazonAffiliate from '@/components/ads/AmazonAffiliate';
import HealthSocialShare from '@/components/health/HealthSocialShare';

export default function BodyFatCalculator() {
  const [sex, setSex] = useState<Sex>('male');
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [neck, setNeck] = useState<number>(38);
  const [waist, setWaist] = useState<number>(85);
  const [hip, setHip] = useState<number>(95);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    calculate();
  }, [sex, unit, weight, height, neck, waist, hip]);

  const calculate = () => {
    setError('');
    try {
      const weightKg = unit === 'metric' ? weight : lbsToKg(weight);
      const heightCm = unit === 'metric' ? height : inchesToCm(height);
      const neckCm = unit === 'metric' ? neck : inchesToCm(neck);
      const waistCm = unit === 'metric' ? waist : inchesToCm(waist);
      const hipCm = unit === 'metric' ? hip : inchesToCm(hip);

      const res = calculateBodyFat({
        sex,
        heightCm,
        neckCm,
        waistCm,
        hipCm: sex === 'female' ? hipCm : undefined,
        weightKg,
      });

      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Calculation error');
      setResult(null);
    }
  };

  const copyResults = () => {
    if (!result) return;
    const text = `Body Fat: ${formatNumber(result.bodyFatPercentage)}%\nFat Mass: ${formatNumber(result.fatMassKg)} kg\nLean Mass: ${formatNumber(result.leanMassKg)} kg`;
    navigator.clipboard.writeText(text);
    toast({ title: '✅ Copied to clipboard!' });
  };

  const shareResults = async () => {
    if (!result) return;
    const text = `My body fat percentage is ${formatNumber(result.bodyFatPercentage)}% (US Navy Method) 💪`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: '✅ Copied to clipboard!' });
    }
  };

  const getBodyFatCategory = (bf: number, sex: Sex) => {
    if (sex === 'male') {
      if (bf < 6) return { name: '🏆 Essential Fat', color: 'text-red-600', bg: 'bg-red-100' };
      if (bf < 14) return { name: '⭐ Athletes', color: 'text-blue-600', bg: 'bg-blue-100' };
      if (bf < 18) return { name: '💪 Fitness', color: 'text-green-600', bg: 'bg-green-100' };
      if (bf < 25) return { name: '✅ Average', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      return { name: '⚠️ Obese', color: 'text-orange-600', bg: 'bg-orange-100' };
    } else {
      if (bf < 14) return { name: '🏆 Essential Fat', color: 'text-red-600', bg: 'bg-red-100' };
      if (bf < 21) return { name: '⭐ Athletes', color: 'text-blue-600', bg: 'bg-blue-100' };
      if (bf < 25) return { name: '💪 Fitness', color: 'text-green-600', bg: 'bg-green-100' };
      if (bf < 32) return { name: '✅ Average', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      return { name: '⚠️ Obese', color: 'text-orange-600', bg: 'bg-orange-100' };
    }
  };

  const category = result ? getBodyFatCategory(result.bodyFatPercentage, sex) : null;

  return (
    <EnhancedHealthCalculatorLayout
      title="🎯 Body Fat Percentage Calculator"
      description="Calculate your body fat percentage using the scientifically validated US Navy circumference method. 100% accurate to the formula with instant results!"
      icon={<Activity className="w-16 h-16 text-blue-600" />}
    >
      <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-sm">
          <strong>⚡ Lightning-fast & 100% Accurate:</strong> Results are computed with perfect mathematical precision using the US Navy formula. Measurements are more accurate when taken in the morning. Real-world physiology varies; consult a healthcare professional for personalized advice.
        </AlertDescription>
      </Alert>

      <Card className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 border-blue-200 dark:border-blue-800 animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Enter Your Measurements
        </h2>
        <div className="space-y-4">
          <UnitToggle value={unit} onChange={setUnit} />
          <SexInput value={sex} onChange={setSex} />
          <WeightInput value={weight} onChange={setWeight} unit={unit} />
          <CircumferenceInput
            label="📏 Neck Circumference"
            id="neck"
            value={neck}
            onChange={setNeck}
            unit={unit}
          />
          <CircumferenceInput
            label="📏 Waist Circumference"
            id="waist"
            value={waist}
            onChange={setWaist}
            unit={unit}
          />
          {sex === 'female' && (
            <CircumferenceInput
              label="📏 Hip Circumference"
              id="hip"
              value={hip}
              onChange={setHip}
              unit={unit}
            />
          )}
        </div>
      </Card>

      {error && (
        <Alert variant="destructive" className="animate-shake">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="p-6 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 border-green-200 dark:border-green-800 animate-slide-up">
          <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <Award className="w-8 h-8 text-green-600" />
            Your Results
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Body Fat %</p>
              <p className="text-5xl font-bold text-blue-600 mb-2">{formatNumber(result.bodyFatPercentage)}%</p>
              {category && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${category.bg} ${category.color}`}>
                  {category.name}
                </span>
              )}
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Fat Mass 🔥</p>
              <p className="text-5xl font-bold text-orange-600">{formatNumber(result.fatMassKg)}</p>
              <p className="text-sm text-gray-500 mt-1">kg</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Lean Mass 💪</p>
              <p className="text-5xl font-bold text-green-600">{formatNumber(result.leanMassKg)}</p>
              <p className="text-sm text-gray-500 mt-1">kg</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <Button onClick={copyResults} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Copy className="w-4 h-4 mr-2" /> Copy Results
            </Button>
          </div>

          {/* Social Share Section */}
          <Card className="p-6 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700">
            <HealthSocialShare
              title="Body Fat Percentage Calculator"
              resultText={`My body fat percentage is ${formatNumber(result.bodyFatPercentage)}% (${category?.name}) 💪 Fat Mass: ${formatNumber(result.fatMassKg)}kg | Lean Mass: ${formatNumber(result.leanMassKg)}kg`}
              hashtags={['bodyfat', 'fitness', 'health', 'wellness', 'fitnessgoals']}
              category="health"
            />
          </Card>
        </Card>
      )}

      <AutoAdSlot placement="top-banner" />

      {/* Educational Content Section */}
      <div className="mt-8 space-y-6">
        
        <Card className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-xl">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            🎓 Understanding Body Fat Percentage: The Complete Expert Guide
          </h2>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Body fat percentage is one of the most critical metrics for assessing health, fitness, and physique. Unlike BMI (Body Mass Index), which only considers height and weight, body fat percentage reveals the actual composition of your body—specifically, what portion is fat versus lean tissue (muscle, bone, organs, and water).
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-600" />
              Why Body Fat Percentage Matters More Than Weight
            </h3>
            
            <p className="leading-relaxed">
              Two people can weigh exactly the same but look dramatically different. Why? Body composition. A muscular athlete weighing 180 lbs at 12% body fat will look lean and defined, while someone else at 180 lbs with 30% body fat will appear much heavier due to excess adipose tissue. This is why body fat percentage is the gold standard for:
            </p>

            <ul className="space-y-2 my-4">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Health Risk Assessment:</strong> Excess body fat, particularly visceral fat around organs, increases risk of heart disease, diabetes, hypertension, and metabolic syndrome.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Fitness Progress Tracking:</strong> Weight alone can mislead—you might lose fat and gain muscle simultaneously, seeing no scale change despite dramatic physique improvements.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Athletic Performance:</strong> Optimal body fat ranges vary by sport. Endurance athletes typically perform best at lower body fat (6-13% for men, 14-20% for women), while strength athletes may function optimally slightly higher.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Aesthetic Goals:</strong> Visible abs, muscle definition, and vascularity all correlate directly with body fat percentage, not weight.</span>
              </li>
            </ul>

            <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              The US Navy Method: Science-Backed Accuracy
            </h3>

            <p className="leading-relaxed">
              Developed by the U.S. Department of Defense, the Navy method estimates body fat using simple circumference measurements. It was validated against hydrostatic (underwater) weighing—long considered the "gold standard"—and found to be accurate within ±3-4% for most individuals. Here's what makes it special:
            </p>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg my-6 border-l-4 border-blue-600">
              <h4 className="font-bold text-xl mb-3">📐 The Mathematical Foundation</h4>
              <p className="mb-4">The formula uses logarithmic relationships between circumferences and body density:</p>
              
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md font-mono text-sm mb-4">
                <strong>Men:</strong><br/>
                Body Fat % = 495 / (1.0324 - 0.19077×log₁₀(waist - neck) + 0.15456×log₁₀(height)) - 450
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md font-mono text-sm">
                <strong>Women:</strong><br/>
                Body Fat % = 495 / (1.29579 - 0.35004×log₁₀(waist + hip - neck) + 0.22100×log₁₀(height)) - 450
              </div>
            </div>

            <p className="leading-relaxed">
              The logarithmic nature accounts for the non-linear relationship between circumferences and actual body composition. Larger waists disproportionately indicate higher body fat, which this formula captures beautifully.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">🎯 Body Fat Categories: Where Do You Stand?</h3>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Men</th>
                    <th className="p-3 text-left">Women</th>
                    <th className="p-3 text-left">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="hover:bg-red-50 dark:hover:bg-red-900">
                    <td className="p-3 font-semibold">🏆 Essential Fat</td>
                    <td className="p-3">2-5%</td>
                    <td className="p-3">10-13%</td>
                    <td className="p-3 text-sm">Minimum for survival. Athletes only temporarily reach this for competition. Dangerous long-term.</td>
                  </tr>
                  <tr className="hover:bg-blue-50 dark:hover:bg-blue-900">
                    <td className="p-3 font-semibold">⭐ Athletes</td>
                    <td className="p-3">6-13%</td>
                    <td className="p-3">14-20%</td>
                    <td className="p-3 text-sm">Typical for competitive athletes. Visible abs, low subcutaneous fat, high vascularity.</td>
                  </tr>
                  <tr className="hover:bg-green-50 dark:hover:bg-green-900">
                    <td className="p-3 font-semibold">💪 Fitness</td>
                    <td className="p-3">14-17%</td>
                    <td className="p-3">21-24%</td>
                    <td className="p-3 text-sm">Fit, healthy appearance. Some muscle definition visible. Sustainable year-round for most.</td>
                  </tr>
                  <tr className="hover:bg-yellow-50 dark:hover:bg-yellow-900">
                    <td className="p-3 font-semibold">✅ Average</td>
                    <td className="p-3">18-24%</td>
                    <td className="p-3">25-31%</td>
                    <td className="p-3 text-sm">Normal, healthy range for general population. No significant health risks if stable.</td>
                  </tr>
                  <tr className="hover:bg-orange-50 dark:hover:bg-orange-900">
                    <td className="p-3 font-semibold">⚠️ Obese</td>
                    <td className="p-3">25%+</td>
                    <td className="p-3">32%+</td>
                    <td className="p-3 text-sm">Increased health risks including cardiovascular disease, diabetes, and metabolic disorders.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-600 p-6 my-6 rounded-lg">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" />
                💡 Pro Tip: Essential Fat is Essential for a Reason
              </h4>
              <p className="text-sm">
                Women naturally have higher essential fat (10-13% vs. men's 2-5%) due to childbearing functions and hormonal regulation. Dropping below essential fat ranges can cause hormonal imbalances, amenorrhea (loss of menstrual cycle), weakened immunity, and organ damage. Never aim for essential fat percentages as a long-term goal!
              </p>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">📏 Measurement Technique: Accuracy is Everything</h3>

            <p className="leading-relaxed mb-4">
              The Navy method's accuracy depends entirely on measurement precision. Here's the exact protocol:
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Neck Measurement
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Measure at smallest circumference</li>
                  <li>• Position tape below Adam's apple (larynx)</li>
                  <li>• Keep tape horizontal and level</li>
                  <li>• Don't compress skin—snug but not tight</li>
                  <li>• Look straight ahead, neutral posture</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Waist Measurement (Men)
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Measure at navel level (belly button)</li>
                  <li>• Stand relaxed, don't suck in stomach</li>
                  <li>• Measure at end of normal exhale</li>
                  <li>• Keep tape horizontal all around</li>
                  <li>• Take 3 measurements, use average</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Waist Measurement (Women)
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Measure at narrowest point (typically above navel)</li>
                  <li>• Usually 1-2 inches above belly button</li>
                  <li>• Same relaxed, exhaled protocol as men</li>
                  <li>• For pregnant women, use pre-pregnancy waist or skip this method</li>
                </ul>
              </div>

              <div className="bg-pink-50 dark:bg-pink-900 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-pink-600" />
                  Hip Measurement (Women Only)
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Measure at widest part of buttocks</li>
                  <li>• Stand with feet together</li>
                  <li>• Keep tape horizontal and level</li>
                  <li>• Don't compress tissue</li>
                  <li>• This is typically the largest circumference</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">⚖️ Comparing Measurement Methods</h3>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg text-sm">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Method</th>
                    <th className="p-3 text-left">Accuracy</th>
                    <th className="p-3 text-left">Cost</th>
                    <th className="p-3 text-left">Accessibility</th>
                    <th className="p-3 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-semibold">DEXA Scan</td>
                    <td className="p-3">±1-2%</td>
                    <td className="p-3">$100-200</td>
                    <td className="p-3">⭐⭐</td>
                    <td className="p-3">Gold standard. Medical imaging. Shows regional fat distribution.</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-semibold">Hydrostatic</td>
                    <td className="p-3">±2-3%</td>
                    <td className="p-3">$50-75</td>
                    <td className="p-3">⭐⭐</td>
                    <td className="p-3">Underwater weighing. Requires specialized equipment and technician.</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-semibold">Navy Method</td>
                    <td className="p-3">±3-4%</td>
                    <td className="p-3">Free</td>
                    <td className="p-3">⭐⭐⭐⭐⭐</td>
                    <td className="p-3">Only needs measuring tape. Great for tracking trends over time.</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-semibold">Bioelectrical Impedance</td>
                    <td className="p-3">±4-6%</td>
                    <td className="p-3">$30-3000</td>
                    <td className="p-3">⭐⭐⭐⭐</td>
                    <td className="p-3">Scales/handheld devices. Affected by hydration status. Wide variance.</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-semibold">Skinfold Calipers</td>
                    <td className="p-3">±3-5%</td>
                    <td className="p-3">$5-50</td>
                    <td className="p-3">⭐⭐⭐</td>
                    <td className="p-3">Requires practice and consistency. Operator-dependent accuracy.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">🚀 Using This Calculator to Track Fat Loss Progress</h3>

            <p className="leading-relaxed mb-4">
              Consistency is key when tracking body composition changes. Follow these expert protocols:
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-6 rounded-lg my-6">
              <h4 className="font-bold text-lg mb-4">📅 Measurement Schedule</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🌅</span>
                  <div>
                    <strong>Time of Day:</strong> Always measure first thing in the morning, after using the bathroom, before eating or drinking. Body water fluctuates 2-4 lbs throughout the day, affecting circumferences.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📆</span>
                  <div>
                    <strong>Frequency:</strong> Measure weekly or bi-weekly. Daily measurements add noise without signal. Body fat changes slowly—expect 0.5-1% loss per month during successful cutting phases.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <strong>Track Trends:</strong> Don't obsess over single measurements. Plot data over 4-6 weeks. The overall trend matters more than day-to-day fluctuations.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📸</span>
                  <div>
                    <strong>Progress Photos:</strong> Take front, side, and back photos in consistent lighting every 2 weeks. Visual changes often precede measurable changes.
                  </div>
                </li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">💡 Common Myths & Misconceptions Debunked</h3>

            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-600 p-4 rounded-lg">
                <h4 className="font-bold mb-2">❌ Myth: "I need to get below 10% body fat to have visible abs"</h4>
                <p className="text-sm"><strong>Truth:</strong> Abs become visible around 12-15% for men, 18-22% for women. Genetics determine fat distribution patterns—some people show abs at higher body fat percentages, others require lower levels. Core development also matters!</p>
              </div>

              <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-600 p-4 rounded-lg">
                <h4 className="font-bold mb-2">❌ Myth: "Lower body fat is always healthier"</h4>
                <p className="text-sm"><strong>Truth:</strong> Excessively low body fat impairs hormone production, immune function, and can damage organs. The "fitness" range (14-17% men, 21-24% women) is optimal for most people balancing health and aesthetics.</p>
              </div>

              <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-600 p-4 rounded-lg">
                <h4 className="font-bold mb-2">❌ Myth: "This calculator won't work for muscular people"</h4>
                <p className="text-sm"><strong>Truth:</strong> The Navy method can slightly overestimate body fat in very muscular individuals (because muscle increases circumferences). However, it's still useful for tracking relative changes. If you're a competitive bodybuilder, consider DEXA scans for absolute accuracy.</p>
              </div>

              <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-600 p-4 rounded-lg">
                <h4 className="font-bold mb-2">❌ Myth: "Women should aim for the same body fat % as men"</h4>
                <p className="text-sm"><strong>Truth:</strong> Women's essential fat (10-13%) is higher than men's (2-5%) due to biological functions including childbearing and hormonal regulation. A woman at 20% body fat can look as lean as a man at 12%.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">🎯 Setting Realistic Body Fat Goals</h3>

            <p className="leading-relaxed mb-4">
              Your ideal body fat percentage depends on multiple factors:
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-3">🏃 For Athletes</h4>
                <p className="text-sm mb-3">Performance often peaks in the "athletes" range:</p>
                <ul className="text-sm space-y-2">
                  <li>• Endurance: 6-12% (M), 14-18% (W)</li>
                  <li>• Strength: 8-15% (M), 16-22% (W)</li>
                  <li>• Aesthetics (bodybuilding): 5-8% (M), 10-15% (W) during competition only</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-3">💪 For General Fitness</h4>
                <p className="text-sm mb-3">Sustainable year-round ranges:</p>
                <ul className="text-sm space-y-2">
                  <li>• Men: 12-18% (healthy, athletic look)</li>
                  <li>• Women: 20-26% (fit, feminine physique)</li>
                  <li>• Allows social flexibility, hormonal health, and performance</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 border-2 border-green-400 p-6 rounded-lg my-6">
              <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                <Heart className="w-6 h-6 text-green-600" />
                🏥 When to Consult a Healthcare Professional
              </h4>
              <p className="mb-3">Seek professional guidance if:</p>
              <ul className="space-y-2 text-sm">
                <li>• Your body fat % is below essential ranges (men &lt;5%, women &lt;13%)</li>
                <li>• You're experiencing symptoms like amenorrhea, extreme fatigue, or hormonal imbalances</li>
                <li>• You have obesity-related health conditions (diabetes, hypertension, sleep apnea)</li>
                <li>• You're planning extreme body composition changes (contest prep, significant weight loss)</li>
                <li>• Results seem inconsistent with your appearance or other metrics</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">📚 Scientific References & Further Reading</h3>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-sm">
              <ul className="space-y-2">
                <li>• Hodgdon JA, Beckett MB. "Prediction of percent body fat for U.S. Navy men from body circumferences and height." Naval Health Research Center, 1984.</li>
                <li>• American Council on Exercise. "ACE Body Fat Percentage Categories." 2021.</li>
                <li>• Gallagher D, et al. "Healthy percentage body fat ranges: an approach for developing guidelines based on body mass index." American Journal of Clinical Nutrition, 2000.</li>
                <li>• Wang Z, et al. "The five-level model: a new approach to organizing body-composition research." Journal of Clinical Nutrition, 1992.</li>
              </ul>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border-2 border-yellow-400 rounded-lg">
              <h4 className="font-bold text-xl mb-3">⚡ Quick Action Steps</h4>
              <ol className="space-y-2 text-sm">
                <li>1️⃣ Measure yourself first thing tomorrow morning using the techniques above</li>
                <li>2️⃣ Calculate your body fat % and record it in a spreadsheet or app</li>
                <li>3️⃣ Take progress photos in consistent lighting (front, side, back)</li>
                <li>4️⃣ Set a realistic body fat goal based on your lifestyle and objectives</li>
                <li>5️⃣ Re-measure weekly or bi-weekly to track progress</li>
                <li>6️⃣ Adjust nutrition and training based on trends over 4-6 weeks</li>
                <li>7️⃣ Celebrate small wins—1% body fat loss per month is excellent progress!</li>
              </ol>
            </div>

          </div>
        </Card>

        <AutoAdSlot placement="mid-content" />

        <AmazonAffiliate calculatorTitle="Fitness Equipment" placement="content" />

        <AutoAdSlot placement="in-feed" />
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </EnhancedHealthCalculatorLayout>
  );
}
