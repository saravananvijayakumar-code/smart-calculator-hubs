import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Activity, Heart, Info, Zap } from "lucide-react";
import EnhancedHealthCalculatorLayout from "@/components/EnhancedHealthCalculatorLayout";
import HealthSocialShare from "@/components/health/HealthSocialShare";

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [climate, setClimate] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  const calculateWaterIntake = () => {
    if (!weight || !activityLevel || !climate) return;

    let weightInKg = parseFloat(weight);
    if (weightUnit === "lbs") {
      weightInKg = weightInKg * 0.453592;
    }

    // Base calculation: 30-35ml per kg body weight
    let waterIntake = weightInKg * 33;

    // Activity level adjustments
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.0,
      light: 1.1,
      moderate: 1.3,
      active: 1.5,
      veryActive: 1.7,
    };

    waterIntake *= activityMultipliers[activityLevel] || 1.0;

    // Climate adjustments
    const climateAdjustments: { [key: string]: number } = {
      cold: 0,
      temperate: 250,
      warm: 500,
      hot: 750,
    };

    waterIntake += climateAdjustments[climate] || 0;

    setResult(Math.round(waterIntake));
  };

  const reset = () => {
    setWeight("");
    setWeightUnit("kg");
    setActivityLevel("");
    setClimate("");
    setResult(null);
  };

  const educationalContent = (
    <div className="space-y-12 mt-12">
      {/* Hydration Science Section */}
      <section className="animate-fade-in">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-600" />
            💧 The Science of Hydration
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Water makes up approximately 60% of your body weight and is essential for virtually every bodily function. Understanding your hydration needs is crucial for maintaining optimal health, energy levels, and physical performance.
            </p>
            
            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">🔬 Why Water Matters</h3>
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-blue-500 animate-slide-up">
                <h4 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400">Cellular Function</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Water transports nutrients to cells, removes waste products, and maintains the structure and function of every cell in your body. Without adequate hydration, cellular processes slow down dramatically.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-cyan-500 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <h4 className="font-semibold text-lg mb-3 text-cyan-600 dark:text-cyan-400">Temperature Regulation</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Through sweating and respiration, water helps maintain your core body temperature. This is especially critical during exercise or in hot climates.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-teal-500 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <h4 className="font-semibold text-lg mb-3 text-teal-600 dark:text-teal-400">Joint Lubrication</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Water is a key component of synovial fluid, which lubricates joints and allows smooth movement. Dehydration can lead to joint pain and stiffness.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-blue-400 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <h4 className="font-semibold text-lg mb-3 text-blue-500 dark:text-blue-300">Cognitive Performance</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Even mild dehydration (1-2% body weight loss) can impair concentration, mood, and cognitive function. Your brain is 75% water!
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-gray-100">💎 Understanding Water Balance</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your body loses water continuously through breathing, sweating, urination, and bowel movements. On average, adults lose about 2-3 liters of water daily, though this can increase significantly with exercise, heat, or illness. This lost fluid must be replaced to maintain proper hydration.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              The kidneys play a crucial role in maintaining water balance by adjusting urine output based on your hydration status. When you're well-hydrated, urine is pale yellow and plentiful. When dehydrated, the kidneys conserve water, producing concentrated, dark yellow urine.
            </p>
          </div>
        </div>
      </section>

      {/* Electrolyte Balance Section */}
      <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-600" />
            ⚡ Electrolytes & Hydration
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Hydration isn't just about water—it's about maintaining the right balance of electrolytes. These minerals carry electrical charges and are essential for nerve signaling, muscle contraction, and fluid balance.
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">🧂</div>
                <h4 className="font-semibold text-lg mb-2 text-purple-600 dark:text-purple-400">Sodium</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Critical for fluid balance and nerve function. Lost through sweat during exercise. Most people get adequate sodium from diet.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">🍌</div>
                <h4 className="font-semibold text-lg mb-2 text-pink-600 dark:text-pink-400">Potassium</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Essential for heart function and muscle contraction. Found in fruits, vegetables, and dairy products.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">🥛</div>
                <h4 className="font-semibold text-lg mb-2 text-purple-500 dark:text-purple-300">Calcium</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Important for bone health and muscle function. Helps regulate fluid movement across cell membranes.
                </p>
              </div>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-purple-800 dark:text-purple-300">
                <Info className="w-5 h-5" />
                When to Consider Electrolyte Drinks
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>During or after intense exercise lasting more than 60 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>In hot, humid conditions when sweating heavily</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>During illness with vomiting or diarrhea</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>For endurance athletes training for multiple hours</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Dehydration Symptoms Section */}
      <section className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-orange-600" />
            ⚠️ Recognizing Dehydration
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Dehydration occurs when you lose more fluid than you take in. Recognizing the signs early can prevent serious health complications.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
                <h4 className="font-semibold text-lg mb-4 text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                  <span className="text-2xl">😓</span> Mild Dehydration (1-2%)
                </h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Increased thirst</li>
                  <li>• Dry mouth and lips</li>
                  <li>• Slightly decreased urine output</li>
                  <li>• Dark yellow urine</li>
                  <li>• Mild fatigue</li>
                  <li>• Headache</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-orange-500">
                <h4 className="font-semibold text-lg mb-4 text-orange-600 dark:text-orange-400 flex items-center gap-2">
                  <span className="text-2xl">🥵</span> Moderate Dehydration (3-5%)
                </h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Very dry mouth</li>
                  <li>• Significantly reduced urine</li>
                  <li>• Dizziness when standing</li>
                  <li>• Rapid heartbeat</li>
                  <li>• Decreased skin elasticity</li>
                  <li>• Muscle cramps</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-6 my-6 border-l-4 border-red-500">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-red-800 dark:text-red-300">
                <AlertCircle className="w-5 h-5" />
                🚨 Severe Dehydration - Seek Medical Help
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Severe dehydration ({'>'}6% body weight loss) is a medical emergency. Symptoms include:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Extreme thirst</li>
                <li>• Little to no urination</li>
                <li>• Sunken eyes</li>
                <li>• Rapid breathing and heartbeat</li>
                <li>• Confusion or irritability</li>
                <li>• Fainting or loss of consciousness</li>
              </ul>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-6 mt-6">
              <h4 className="font-semibold text-lg mb-3 text-blue-800 dark:text-blue-300">💡 The Urine Color Test</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                One of the easiest ways to check your hydration status is to monitor urine color:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl mb-2">💧</div>
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">Pale Yellow</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">Well Hydrated</p>
                </div>
                <div className="text-center p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <div className="text-2xl mb-2">💛</div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Light Yellow</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">Normal</p>
                </div>
                <div className="text-center p-3 bg-orange-200 dark:bg-orange-900/30 rounded-lg">
                  <div className="text-2xl mb-2">🟠</div>
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-200">Dark Yellow</p>
                  <p className="text-xs text-orange-700 dark:text-orange-400">Mild Dehydration</p>
                </div>
                <div className="text-center p-3 bg-red-200 dark:bg-red-900/30 rounded-lg">
                  <div className="text-2xl mb-2">🔴</div>
                  <p className="text-sm font-medium text-red-900 dark:text-red-200">Amber/Brown</p>
                  <p className="text-xs text-red-700 dark:text-red-400">Dehydrated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity-Based Hydration Section */}
      <section className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-600" />
            🏃 Hydration for Different Activities
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Your hydration needs vary significantly based on your activity level. Here's how to optimize your water intake for different scenarios.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <h4 className="font-semibold text-lg mb-3 text-green-600 dark:text-green-400 flex items-center gap-2">
                  <span className="text-2xl">🏋️</span> Strength Training
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Moderate fluid loss through sweating. Hydration strategy:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• 2-3 cups (500-750ml) 2-3 hours before workout</li>
                  <li>• 1 cup (250ml) 15 minutes before starting</li>
                  <li>• Sip 150-250ml every 15-20 minutes during workout</li>
                  <li>• 2-3 cups (500-750ml) for every pound lost after workout</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <h4 className="font-semibold text-lg mb-3 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <span className="text-2xl">🏃‍♀️</span> Endurance Training
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  High fluid loss, electrolyte replacement needed:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• 3-4 cups (750ml-1L) 2-3 hours before</li>
                  <li>• 1-2 cups (250-500ml) 15-30 minutes before</li>
                  <li>• 150-250ml every 15-20 minutes during activity</li>
                  <li>• Include electrolyte drinks after 60+ minutes</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <h4 className="font-semibold text-lg mb-3 text-teal-600 dark:text-teal-400 flex items-center gap-2">
                  <span className="text-2xl">🧘</span> Yoga/Pilates
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Moderate hydration needs, steady intake:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• 1-2 cups (250-500ml) 1-2 hours before</li>
                  <li>• Sip small amounts during practice</li>
                  <li>• 1-2 cups (250-500ml) after session</li>
                  <li>• Hot yoga requires increased intake</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <h4 className="font-semibold text-lg mb-3 text-green-500 dark:text-green-300 flex items-center gap-2">
                  <span className="text-2xl">🏊</span> Swimming
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Often overlooked - you still sweat in water!
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• 2 cups (500ml) 1-2 hours before swim</li>
                  <li>• Drink between sets/laps</li>
                  <li>• 250ml every 20 minutes for longer sessions</li>
                  <li>• 2-3 cups (500-750ml) post-swim</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-800 dark:text-green-300">
                <Zap className="w-5 h-5" />
                Hot Weather & High Altitude Adjustments
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                <div>
                  <p className="font-medium mb-2">🌡️ Hot/Humid Conditions:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Add 500-750ml to base intake</li>
                    <li>• Increase frequency of hydration</li>
                    <li>• Consider electrolyte replacement</li>
                    <li>• Monitor sweat rate closely</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">⛰️ High Altitude ({'>'}8,000 ft):</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Add 1-1.5L to daily intake</li>
                    <li>• Increased respiratory water loss</li>
                    <li>• Altitude sickness prevention</li>
                    <li>• Monitor urine color frequently</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hydration Myths Section */}
      <section className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Info className="w-8 h-8 text-indigo-600" />
            🔍 Hydration Myths Debunked
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-red-500">
                <h4 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">❌ Myth: Everyone needs 8 glasses per day</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-green-600 dark:text-green-400">✅ Truth:</strong> Water needs are highly individual and depend on body size, activity level, climate, and overall health. Some people need more, others less.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-red-500">
                <h4 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">❌ Myth: Coffee and tea dehydrate you</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-green-600 dark:text-green-400">✅ Truth:</strong> While caffeine has a mild diuretic effect, the water in coffee and tea contributes to your daily fluid intake. You'd need to consume very high amounts for dehydration to occur.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-red-500">
                <h4 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">❌ Myth: Clear urine means perfect hydration</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-green-600 dark:text-green-400">✅ Truth:</strong> Completely clear urine may indicate overhydration. Pale yellow is the ideal color. Overhydration can dilute electrolytes and cause hyponatremia.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-red-500">
                <h4 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">❌ Myth: You can't drink too much water</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-green-600 dark:text-green-400">✅ Truth:</strong> Hyponatremia (water intoxication) can occur when you drink excessive amounts, diluting sodium levels. This is rare but can be dangerous, especially during endurance events.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-red-500">
                <h4 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">❌ Myth: Thirst is the best hydration indicator</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-green-600 dark:text-green-400">✅ Truth:</strong> Thirst signals you're already mildly dehydrated (1-2%). By the time you feel thirsty, you've already lost significant fluid. Drink regularly, not just when thirsty.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-red-500">
                <h4 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">❌ Myth: Only water counts for hydration</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-green-600 dark:text-green-400">✅ Truth:</strong> All beverages contribute to hydration, and food provides about 20% of daily water intake. Fruits and vegetables with high water content (watermelon, cucumber, lettuce) are excellent sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Water Tracking Tips Section */}
      <section className="animate-fade-in" style={{ animationDelay: "1s" }}>
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
            <Heart className="w-8 h-8 text-cyan-600" />
            💪 Practical Hydration Tips
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h4 className="font-semibold text-lg mb-3 text-cyan-700 dark:text-cyan-300">📱 Use Technology</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Set phone reminders every hour</li>
                  <li>• Use water tracking apps</li>
                  <li>• Smart water bottles with tracking</li>
                  <li>• Calendar notifications</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h4 className="font-semibold text-lg mb-3 text-blue-700 dark:text-blue-300">🍽️ Link to Routines</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Glass before each meal</li>
                  <li>• Water with every snack</li>
                  <li>• Drink after bathroom breaks</li>
                  <li>• Hydrate when waking/sleeping</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h4 className="font-semibold text-lg mb-3 text-purple-700 dark:text-purple-300">🎯 Visual Cues</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Keep bottle in sight always</li>
                  <li>• Rubber bands on bottle to track</li>
                  <li>• Motivational water bottle marks</li>
                  <li>• Colorful attractive bottles</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h4 className="font-semibold text-lg mb-3 text-green-700 dark:text-green-300">🌟 Make It Enjoyable</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Add fruit/herb infusions</li>
                  <li>• Try different temperatures</li>
                  <li>• Sparkling water variations</li>
                  <li>• Ice cubes with fruit inside</li>
                </ul>
              </div>
            </div>

            <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 text-cyan-800 dark:text-cyan-300">🏆 The Gallon Challenge Approach</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                While not suitable for everyone, the gallon-a-day method can work well for larger individuals or very active people:
              </p>
              <div className="grid md:grid-cols-4 gap-3 mt-4">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="font-bold text-cyan-600 dark:text-cyan-400 text-2xl">25%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">By 10 AM</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="font-bold text-cyan-600 dark:text-cyan-400 text-2xl">50%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">By 2 PM</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="font-bold text-cyan-600 dark:text-cyan-400 text-2xl">75%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">By 6 PM</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="font-bold text-cyan-600 dark:text-cyan-400 text-2xl">100%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">By bedtime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="animate-fade-in" style={{ animationDelay: "1.2s" }}>
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-700 to-slate-700 dark:from-gray-300 dark:to-slate-300 bg-clip-text text-transparent">
            ❓ Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                Can you drink too much water?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Yes, overhydration (hyponatremia) occurs when you drink excessive amounts of water, diluting sodium levels in your blood. This is rare but can be serious. Symptoms include nausea, headache, confusion, and in severe cases, seizures. It's most common during endurance events when athletes drink large amounts without replacing electrolytes. Generally, drinking when thirsty and maintaining pale yellow urine is safe.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                Does drinking water help with weight loss?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Water can support weight loss in several ways: it increases satiety (feeling full), especially when consumed before meals; it has zero calories while replacing sugary drinks; it supports metabolic processes; and it helps with exercise performance. Studies show drinking 500ml before meals can reduce calorie intake by 13%. However, water alone won't cause weight loss—it's one component of a healthy lifestyle including proper diet and exercise.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                Is it better to sip water throughout the day or drink larger amounts at once?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Sipping water throughout the day is generally better for maintaining consistent hydration. Your body can only absorb about 200-300ml per 15 minutes, so drinking large amounts at once can lead to more frequent urination without better hydration. Consistent sipping helps maintain fluid balance, supports ongoing bodily functions, and prevents the peaks and valleys of hydration levels. However, drinking larger amounts before, during, and after exercise is appropriate for those specific needs.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                How does water intake affect skin health?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Proper hydration supports skin health by maintaining elasticity, delivering nutrients to skin cells, and flushing out toxins. Dehydrated skin can appear dull, flaky, and show fine lines more prominently. However, drinking extra water won't necessarily improve already-healthy skin or cure skin conditions. Skin hydration is also affected by humidity, skin care products, diet, and genetics. Maintain adequate hydration for overall health, which includes skin health, but don't expect water alone to transform your skin.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                What's the best temperature for drinking water?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Room temperature or cool water is generally best for optimal absorption and comfort. Very cold water can cause temporary vasoconstriction and may slow digestion if consumed with meals. However, cold water is fine during exercise as it helps lower body temperature. Warm water can aid digestion and is soothing, especially in the morning or before bed. The best temperature is ultimately what encourages you to drink more water consistently.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                Should pregnant women drink more water?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Yes, pregnant women need about 8-12 cups (2-3 liters) of fluids daily, or roughly 300ml more than non-pregnant women. Adequate hydration supports increased blood volume, amniotic fluid production, and helps prevent common pregnancy issues like constipation, urinary tract infections, and hemorrhoids. It's especially important during breastfeeding, when fluid needs increase by about 700-1000ml daily. Pregnant women should drink to thirst and monitor urine color, consulting their healthcare provider about specific needs.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <EnhancedHealthCalculatorLayout
      title="Water Intake Calculator"
      description="Calculate your personalized daily water intake based on weight, activity level, and climate"
      category="Hydration"
      metaTitle="Water Intake Calculator - Personalized Daily Hydration Needs"
      metaDescription="Calculate your optimal daily water intake based on body weight, activity level, and climate. Get personalized hydration recommendations for better health and performance."
      calculatorContent={
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-xl p-6 shadow-sm animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Body Weight
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter weight"
                    className="flex-1"
                  />
                  <Select value={weightUnit} onValueChange={(value: "kg" | "lbs") => setWeightUnit(value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Activity Level
                </Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger id="activity">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                    <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                    <SelectItem value="veryActive">Very Active (2x per day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="climate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Climate
                </Label>
                <Select value={climate} onValueChange={setClimate}>
                  <SelectTrigger id="climate">
                    <SelectValue placeholder="Select climate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cold">Cold (Below 10°C/50°F)</SelectItem>
                    <SelectItem value="temperate">Temperate (10-25°C/50-77°F)</SelectItem>
                    <SelectItem value="warm">Warm (25-35°C/77-95°F)</SelectItem>
                    <SelectItem value="hot">Hot (Above 35°C/95°F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={calculateWaterIntake} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Zap className="w-4 h-4 mr-2" />
                Calculate Intake
              </Button>
              <Button onClick={reset} variant="outline" className="flex-1">
                Reset
              </Button>
            </div>
          </div>

          {result !== null && (
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800 animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Zap className="w-5 h-5" />
                  Your Daily Water Intake
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2 animate-pulse-slow">
                    {result} ml
                  </div>
                  <div className="text-xl text-gray-600 dark:text-gray-400">
                    ({(result / 1000).toFixed(2)} liters / {(result / 236.588).toFixed(1)} cups)
                  </div>
                </div>

                <Alert className="bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    This is your recommended daily water intake. Adjust based on thirst, urine color, and individual needs. Consult a healthcare provider for personalized advice.
                  </AlertDescription>
                </Alert>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                  <h4 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">💧 Quick Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(result / 8)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">ml per hour</div>
                    </div>
                    <div className="bg-cyan-50 dark:bg-cyan-950/30 rounded-lg p-3">
                      <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{Math.round(result / 250)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">glasses/day</div>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-950/30 rounded-lg p-3">
                      <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{Math.round(result / 500)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">bottles/day</div>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{Math.round(result / 4)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">ml every 15min</div>
                    </div>
                  </div>
                </div>

                <HealthSocialShare
                  title="Check out my daily water intake recommendation!"
                  resultText={`I should drink ${result}ml (${(result / 1000).toFixed(2)}L) of water per day based on my activity level and climate.`}
                />
              </CardContent>
            </Card>
          )}
        </div>
      }
      educationalContent={educationalContent}
    />
  );
}
