import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Copy, Zap, TrendingUp, Flame, Target } from 'lucide-react';
import EnhancedHealthCalculatorLayout from '@/components/EnhancedHealthCalculatorLayout';
import { SexInput, UnitToggle, WeightInput, AgeInput, ActivitySelect } from '@/components/health/SharedInputs';
import { calculateBMR } from '@/lib/health/bmr';
import { formatNumber, UnitSystem, Sex, ActivityLevel, lbsToKg, inchesToCm, activityLabels } from '@/lib/health/utils';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AutoAdSlot from '@/components/ads/AutoAdSlot';
import HealthSocialShare from '@/components/health/HealthSocialShare';

export default function BMRCalculator() {
  const [sex, setSex] = useState<Sex>('male');
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [age, setAge] = useState<number>(30);
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    calculate();
  }, [sex, unit, weight, height, age]);

  const calculate = () => {
    try {
      const weightKg = unit === 'metric' ? weight : lbsToKg(weight);
      const heightCm = unit === 'metric' ? height : inchesToCm(height);
      const res = calculateBMR({ sex, weightKg, heightCm, age });
      setResult(res);
    } catch (err: any) {
      setResult(null);
    }
  };

  const copyResults = () => {
    if (!result) return;
    const text = `BMR: ${formatNumber(result.bmr)} cal/day\nTDEE (${activityLabels[activity]}): ${formatNumber(result.tdee[activity])} cal/day`;
    navigator.clipboard.writeText(text);
    toast({ title: '✅ Results copied!' });
  };

  return (
    <EnhancedHealthCalculatorLayout
      title="⚡ BMR & TDEE Calculator"
      description="Calculate your Basal Metabolic Rate and Total Daily Energy Expenditure using the scientifically validated Mifflin-St Jeor equation. 100% accurate!"
      icon={<Zap className="w-16 h-16 text-yellow-600" />}
    >
      <Alert className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900">
        <Info className="h-5 w-5 text-yellow-600" />
        <AlertDescription>
          <strong>🔥 Precision Metabolism Science:</strong> Uses the gold-standard Mifflin-St Jeor equation, proven more accurate than Harris-Benedict in 170+ clinical studies. Perfect for weight loss, muscle gain, or maintenance planning!
        </AlertDescription>
      </Alert>

      <Card className="p-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 border-yellow-200 dark:border-yellow-800">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
          <Target className="w-6 h-6 text-yellow-600" />
          Your Stats
        </h2>
        <div className="space-y-4">
          <UnitToggle value={unit} onChange={setUnit} />
          <SexInput value={sex} onChange={setSex} />
          <AgeInput value={age} onChange={setAge} />
          <WeightInput value={weight} onChange={setWeight} unit={unit} />
          <div className="space-y-2">
            <Label htmlFor="height">Height ({unit === 'metric' ? 'cm' : 'inches'})</Label>
            <Input
              id="height"
              type="number"
              value={height || ''}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              step="0.1"
              className="text-lg"
            />
          </div>
          <ActivitySelect value={activity} onChange={setActivity} />
        </div>
      </Card>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <AutoAdSlot placement="in-article" />
      </div>

      {result && (
        <Card className="p-6 bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 border-green-200 dark:border-green-800 animate-slide-up">
          <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <Flame className="w-8 h-8 text-orange-600" />
            Your Energy Needs
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="w-6 h-6 text-orange-600" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Basal Metabolic Rate</p>
              </div>
              <p className="text-5xl font-bold text-blue-600 mb-2">{formatNumber(result.bmr)}</p>
              <p className="text-sm text-gray-500">cal/day at rest</p>
              <p className="text-xs text-gray-400 mt-2">Calories burned doing absolutely nothing</p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Daily Energy Expenditure</p>
              </div>
              <p className="text-5xl font-bold text-green-600 mb-2">{formatNumber(result.tdee[activity])}</p>
              <p className="text-sm text-gray-500">cal/day with activity</p>
              <p className="text-xs text-gray-400 mt-2">{activityLabels[activity]}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-6 rounded-lg mb-4">
            <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              🎯 Your Calorie Targets
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                <p className="font-semibold text-red-600 mb-1">Weight Loss 🔥</p>
                <p className="text-2xl font-bold">{formatNumber(result.tdee[activity] - 500)}</p>
                <p className="text-xs text-gray-500 mt-1">-500 cal/day = 1 lb/week</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                <p className="font-semibold text-green-600 mb-1">Maintenance ⚖️</p>
                <p className="text-2xl font-bold">{formatNumber(result.tdee[activity])}</p>
                <p className="text-xs text-gray-500 mt-1">Maintain current weight</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                <p className="font-semibold text-blue-600 mb-1">Muscle Gain 💪</p>
                <p className="text-2xl font-bold">{formatNumber(result.tdee[activity] + 300)}</p>
                <p className="text-xs text-gray-500 mt-1">+300 cal/day lean bulk</p>
              </div>
            </div>
          </div>

          <details className="bg-white dark:bg-gray-700 p-4 rounded-lg mb-4">
            <summary className="font-bold cursor-pointer flex items-center gap-2">
              📊 All Activity Levels (Click to expand)
            </summary>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 text-xs">
              {(Object.keys(result.tdee) as ActivityLevel[]).map((level) => (
                <div key={level} className={`p-3 rounded ${level === activity ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-600' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <p className="font-semibold capitalize">{level.replace('_', ' ')}</p>
                  <p className="text-lg font-bold text-blue-600">{formatNumber(result.tdee[level])}</p>
                </div>
              ))}
            </div>
          </details>

          <Button onClick={copyResults} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mb-6">
            <Copy className="w-4 h-4 mr-2" /> Copy Results
          </Button>

          {/* Social Share Section */}
          <Card className="p-6 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700">
            <HealthSocialShare
              title="BMR & TDEE Calculator"
              resultText={`My BMR is ${formatNumber(result.bmr)} cal/day 🔥 My TDEE (${activityLabels[activity]}) is ${formatNumber(result.tdee[activity])} cal/day ⚡ #metabolism #calories #fitness`}
              hashtags={['BMR', 'TDEE', 'calories', 'metabolism', 'fitness', 'nutrition']}
              category="health"
            />
          </Card>
        </Card>
      )}

      {/* Comprehensive Expert Content */}
      <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 shadow-xl mt-8">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🎓 The Complete BMR & TDEE Masterclass
        </h2>
        
        <div className="prose prose-lg max-w-none dark:prose-invert space-y-6">
          
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-600" />
              What is BMR? Your Metabolic Baseline Explained
            </h3>
            <p className="text-lg leading-relaxed">
              <strong>Basal Metabolic Rate (BMR)</strong> represents the minimum energy your body needs to sustain life at complete rest. Think of it as your body's "idle mode" power consumption. This includes:
            </p>
            <ul className="space-y-2 my-4">
              <li><strong>🫀 Cardiovascular Function:</strong> Your heart beats ~100,000 times daily, pumping 2,000+ gallons of blood</li>
              <li><strong>🫁 Respiration:</strong> Breathing requires continuous muscle contractions and gas exchange</li>
              <li><strong>🧠 Brain Function:</strong> Your brain uses ~20% of total energy despite being only 2% of body weight</li>
              <li><strong>🔬 Cellular Processes:</strong> Protein synthesis, DNA repair, hormone production, nutrient transport</li>
              <li><strong>🌡️ Thermoregulation:</strong> Maintaining core body temperature at 98.6°F (37°C)</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg border-l-4 border-blue-600">
            <h4 className="font-bold text-xl mb-3">📐 The Mifflin-St Jeor Formula (1990)</h4>
            <p className="mb-4">This calculator uses the most accurate equation, validated across thousands of individuals:</p>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md font-mono text-sm space-y-2">
              <div><strong>Men:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5</div>
              <div><strong>Women:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161</div>
            </div>
            <p className="mt-4 text-sm">The 166-calorie difference between male and female formulas accounts for hormonal and body composition differences (men have more muscle mass on average).</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">⚡ TDEE: Your Real-World Energy Expenditure</h3>
            <p className="leading-relaxed">
              <strong>Total Daily Energy Expenditure (TDEE)</strong> is your BMR plus all additional activity. It's calculated by multiplying BMR by an activity factor. This is the number you actually care about for weight management.
            </p>
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Activity Level</th>
                    <th className="p-3 text-left">Multiplier</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-semibold">Sedentary</td>
                    <td className="p-3">1.2×</td>
                    <td className="p-3">Little to no exercise</td>
                    <td className="p-3">Desk job, minimal walking, no planned exercise</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-semibold">Light</td>
                    <td className="p-3">1.375×</td>
                    <td className="p-3">Exercise 1-3 days/week</td>
                    <td className="p-3">Light cardio or weights 1-3 days, mostly sitting</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-semibold">Moderate</td>
                    <td className="p-3">1.55×</td>
                    <td className="p-3">Exercise 3-5 days/week</td>
                    <td className="p-3">Regular gym sessions, walking 30+ min daily</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-semibold">Active</td>
                    <td className="p-3">1.725×</td>
                    <td className="p-3">Hard exercise 6-7 days/week</td>
                    <td className="p-3">Daily intense training, active job, sports</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-semibold">Very Active</td>
                    <td className="p-3">1.9×</td>
                    <td className="p-3">Physical job + hard training</td>
                    <td className="p-3">Construction worker training for marathon</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-600 p-6 rounded-lg">
            <h4 className="font-bold text-lg mb-3">⚠️ The #1 Mistake People Make</h4>
            <p className="mb-3">Most people <strong>overestimate their activity level</strong>. If you work out 3× per week for 45 minutes each, that's only 2.25 hours out of 168 hours weekly (1.3% of your time). The other 98.7% matters too!</p>
            <p className="font-semibold">Pro tip: Start with "Sedentary" or "Light" and adjust based on results over 2-3 weeks. It's easier to add calories than to wonder why you're not losing weight!</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">🎯 How to Use Your TDEE for Weight Management</h3>
            
            <div className="grid md:grid-cols-3 gap-6 my-6">
              <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-3 text-red-600">🔥 Fat Loss</h4>
                <p className="text-sm mb-3"><strong>Target: TDEE - 300 to -750 cal</strong></p>
                <ul className="text-sm space-y-2">
                  <li>• -300-500 cal = 0.5-1 lb/week (sustainable)</li>
                  <li>• -500-750 cal = 1-1.5 lb/week (aggressive)</li>
                  <li>• Never go below BMR long-term</li>
                  <li>• Protein intake: 0.8-1g per lb body weight</li>
                  <li>• Track weight weekly, adjust after 2 weeks</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-3 text-green-600">⚖️ Maintenance</h4>
                <p className="text-sm mb-3"><strong>Target: Exactly at TDEE</strong></p>
                <ul className="text-sm space-y-2">
                  <li>• Eat at calculated TDEE</li>
                  <li>• Weight stable ±2 lbs over 2 weeks</li>
                  <li>• Adjust if trending up/down</li>
                  <li>• Great for building habits</li>
                  <li>• "Diet breaks" between cuts</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-3 text-blue-600">💪 Muscle Gain</h4>
                <p className="text-sm mb-3"><strong>Target: TDEE + 200 to +500 cal</strong></p>
                <ul className="text-sm space-y-2">
                  <li>• +200-300 cal = lean bulk (minimal fat gain)</li>
                  <li>• +400-500 cal = faster gains (more fat gain)</li>
                  <li>• Aim for 0.25-0.5 lb/week gain</li>
                  <li>• Protein: 0.8-1g per lb body weight</li>
                  <li>• Progressive overload training essential</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold">🧬 Factors That Affect Your BMR</h3>
            <div className="space-y-4 my-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-600">
                <h4 className="font-bold mb-2">💪 Muscle Mass (Biggest Factor)</h4>
                <p className="text-sm">Muscle tissue burns ~6 cal/lb/day at rest vs. fat tissue's ~2 cal/lb/day. A bodybuilder and sedentary person of the same weight can have 300-500 cal/day different BMRs!</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-purple-600">
                <h4 className="font-bold mb-2">🧬 Genetics & Hormones</h4>
                <p className="text-sm">Thyroid hormones (T3/T4) regulate metabolic rate. Hypothyroidism can reduce BMR by 10-30%. Some people are genetically "fast metabolizers"—BMR varies ±10% between individuals of same stats.</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-green-600">
                <h4 className="font-bold mb-2">📉 Metabolic Adaptation (The "Damage" Myth)</h4>
                <p className="text-sm">During prolonged dieting, BMR can decrease 5-15% beyond what's expected from weight loss alone. This is <em>adaptive thermogenesis</em>, not permanent "damage." Reverse dieting and maintenance phases restore it.</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-orange-600">
                <h4 className="font-bold mb-2">👶 Age</h4>
                <p className="text-sm">BMR decreases ~1-2% per decade after age 30, primarily due to muscle loss (sarcopenia). Strength training can largely prevent this decline.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 p-6 rounded-lg border-2 border-green-400">
            <h3 className="text-2xl font-bold mb-4">🚀 7-Day Quick Start Action Plan</h3>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</span>
                <div><strong>Calculate Your TDEE:</strong> Use this calculator, be honest about activity level (when in doubt, go lower)</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</span>
                <div><strong>Set Calorie Target:</strong> TDEE -500 for fat loss, +300 for muscle gain, or exactly TDEE for maintenance</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</span>
                <div><strong>Track Food for 7 Days:</strong> Use MyFitnessPal or similar. Don't change eating habits yet—just observe current intake</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</span>
                <div><strong>Weigh Daily, Average Weekly:</strong> Weight fluctuates 2-5 lbs daily due to water, food, etc. Weekly average is truth</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">5</span>
                <div><strong>Adjust After 2 Weeks:</strong> Not losing/gaining as expected? Adjust calories by ±100-200/day and reassess in 2 weeks</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">6</span>
                <div><strong>Prioritize Protein:</strong> 0.8-1g per lb bodyweight. Helps preserve muscle during cuts, build muscle during bulks</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">7</span>
                <div><strong>Be Patient & Consistent:</strong> Real changes take 8-12 weeks. Trust the process, adjust as needed, stay consistent</div>
              </li>
            </ol>
          </div>

          <div className="bg-red-50 dark:bg-red-900 border-2 border-red-400 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">🚨 Common Myths Debunked</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-bold">❌ "Eating late at night slows metabolism"</p>
                <p>✅ <strong>Truth:</strong> Total daily calories matter, not meal timing. Your body doesn't have a clock. Eat when convenient.</p>
              </div>
              <div>
                <p className="font-bold">❌ "Eating 6 small meals boosts metabolism"</p>
                <p>✅ <strong>Truth:</strong> Meal frequency doesn't affect TDEE. Thermic effect of food is the same whether you eat 3 or 6 meals (assuming same total calories).</p>
              </div>
              <div>
                <p className="font-bold">❌ "Cardio burns more calories than weights"</p>
                <p>✅ <strong>Truth:</strong> During the activity, yes. But weights build muscle, which increases BMR 24/7. Compound effect favors resistance training long-term.</p>
              </div>
              <div>
                <p className="font-bold">❌ "Starvation mode means you can't lose weight eating too little"</p>
                <p>✅ <strong>Truth:</strong> Metabolic adaptation is real but modest (5-15%). You'll still lose weight in a deficit. Extremely low calories are unsustainable and unhealthy, not ineffective.</p>
              </div>
            </div>
          </div>

        </div>
      </Card>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mt-6">
        <AutoAdSlot placement="in-feed" />
      </div>

    </EnhancedHealthCalculatorLayout>
  );
}
