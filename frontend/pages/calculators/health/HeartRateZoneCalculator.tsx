import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Activity, Zap, Info, TrendingUp, Target } from "lucide-react";
import EnhancedHealthCalculatorLayout from "@/components/EnhancedHealthCalculatorLayout";
import HealthSocialShare from "@/components/health/HealthSocialShare";

interface HeartRateZone {
  name: string;
  percentage: string;
  min: number;
  max: number;
  description: string;
  color: string;
  benefits: string[];
}

export default function HeartRateZoneCalculator() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("");
  const [zones, setZones] = useState<HeartRateZone[] | null>(null);
  const [maxHR, setMaxHR] = useState<number | null>(null);

  const calculateZones = () => {
    if (!age) return;

    const ageNum = parseInt(age);
    const calculatedMaxHR = 220 - ageNum;
    const restingHRNum = restingHR ? parseInt(restingHR) : 60;

    const hrReserve = calculatedMaxHR - restingHRNum;

    const zoneData: HeartRateZone[] = [
      {
        name: "Zone 1: Recovery",
        percentage: "50-60%",
        min: Math.round(restingHRNum + hrReserve * 0.5),
        max: Math.round(restingHRNum + hrReserve * 0.6),
        description: "Very light activity, warm-up and cool-down",
        color: "from-gray-400 to-gray-500",
        benefits: [
          "Active recovery between hard workouts",
          "Improves overall cardiovascular health",
          "Builds aerobic base fitness",
          "Low injury risk",
        ],
      },
      {
        name: "Zone 2: Aerobic",
        percentage: "60-70%",
        min: Math.round(restingHRNum + hrReserve * 0.6),
        max: Math.round(restingHRNum + hrReserve * 0.7),
        description: "Light intensity, comfortable pace",
        color: "from-blue-400 to-blue-600",
        benefits: [
          "Builds aerobic endurance",
          "Improves fat metabolism",
          "Strengthens cardiovascular system",
          "Can maintain for extended periods",
        ],
      },
      {
        name: "Zone 3: Tempo",
        percentage: "70-80%",
        min: Math.round(restingHRNum + hrReserve * 0.7),
        max: Math.round(restingHRNum + hrReserve * 0.8),
        description: "Moderate intensity, controlled breathing",
        color: "from-green-400 to-green-600",
        benefits: [
          "Increases aerobic capacity",
          "Improves efficiency",
          "Boosts lactate threshold",
          "Enhances endurance performance",
        ],
      },
      {
        name: "Zone 4: Threshold",
        percentage: "80-90%",
        min: Math.round(restingHRNum + hrReserve * 0.8),
        max: Math.round(restingHRNum + hrReserve * 0.9),
        description: "Hard intensity, challenging to maintain",
        color: "from-orange-400 to-orange-600",
        benefits: [
          "Increases lactate threshold",
          "Improves speed endurance",
          "Boosts VO2 max",
          "Competition pace training",
        ],
      },
      {
        name: "Zone 5: Maximum",
        percentage: "90-100%",
        min: Math.round(restingHRNum + hrReserve * 0.9),
        max: calculatedMaxHR,
        description: "Maximum effort, short bursts only",
        color: "from-red-500 to-red-700",
        benefits: [
          "Develops maximum power",
          "Improves anaerobic capacity",
          "Increases speed",
          "Short intervals only",
        ],
      },
    ];

    setZones(zoneData);
    setMaxHR(calculatedMaxHR);
  };

  const reset = () => {
    setAge("");
    setRestingHR("");
    setZones(null);
    setMaxHR(null);
  };

  const educationalContent = (
    <div className="space-y-12 mt-12">
      {/* Training Zones Explained */}
      <section className="animate-fade-in">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-600" />
            ❤️ Understanding Heart Rate Training Zones
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Heart rate zones are intensity ranges based on percentages of your maximum heart rate. Training in specific zones targets different physiological adaptations, helping you optimize your workouts for specific goals—whether that's building endurance, burning fat, or improving speed.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">📊 The Five Heart Rate Zones</h3>
            <div className="space-y-4 my-6">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md animate-slide-up">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-300 dark:bg-gray-600 rounded-full p-3">
                    <span className="text-2xl">🚶</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Zone 1: Recovery (50-60% Max HR)</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      This is your warm-up and cool-down zone. Exercise feels easy, you can hold a full conversation, and breathing is relaxed. Perfect for recovery days and building aerobic base.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 italic">Example: Easy walking, gentle cycling, light stretching</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 shadow-md animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-300 dark:bg-blue-600 rounded-full p-3">
                    <span className="text-2xl">🏃</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2 text-blue-800 dark:text-blue-200">Zone 2: Aerobic (60-70% Max HR)</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      The "fat-burning" zone where your body primarily uses fat for fuel. You can talk in full sentences but breathing is slightly elevated. This zone builds cardiovascular endurance.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 italic">Example: Jogging, recreational cycling, swimming at comfortable pace</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 shadow-md animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-start gap-4">
                  <div className="bg-green-300 dark:bg-green-600 rounded-full p-3">
                    <span className="text-2xl">🏃‍♂️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2 text-green-800 dark:text-green-200">Zone 3: Tempo (70-80% Max HR)</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      Moderate to hard intensity. Conversation becomes difficult, speaking in short phrases. This zone improves aerobic capacity and stamina for longer events.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 italic">Example: Tempo runs, moderate-intensity cycling, brisk swimming</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6 shadow-md animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-start gap-4">
                  <div className="bg-orange-300 dark:bg-orange-600 rounded-full p-3">
                    <span className="text-2xl">💪</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2 text-orange-800 dark:text-orange-200">Zone 4: Threshold (80-90% Max HR)</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      Hard intensity, near your lactate threshold. Speaking is very difficult, you can only say single words. Increases your ability to sustain higher speeds.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 italic">Example: Interval training, race-pace efforts, hard cycling intervals</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-xl p-6 shadow-md animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-start gap-4">
                  <div className="bg-red-300 dark:bg-red-600 rounded-full p-3">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2 text-red-800 dark:text-red-200">Zone 5: Maximum (90-100% Max HR)</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      Maximum effort, unsustainable for more than a few minutes. No talking possible. Reserved for short, intense intervals and developing peak power.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 italic">Example: Sprint intervals, hill sprints, maximum effort bursts</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-red-800 dark:text-red-300">
                <Info className="w-5 h-5" />
                How to Use These Zones
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                The key to effective training is spending time in the right zones for your goals:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span><strong>Endurance athletes:</strong> 80% in Zones 1-2, 20% in Zones 3-5</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span><strong>General fitness:</strong> Mix of all zones throughout the week</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span><strong>Weight loss:</strong> Focus on Zones 2-3 for sustainable fat burning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span><strong>Speed/power:</strong> Include Zones 4-5 with adequate recovery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fat-Burning Zone Myth */}
      <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-3">
            <Zap className="w-8 h-8 text-orange-600" />
            🔥 The Fat-Burning Zone Myth
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              One of the biggest misconceptions in fitness is that Zone 2 (60-70% max HR) is the best for fat loss. While it's true that fat provides a higher percentage of fuel at lower intensities, the total story is more complex.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-orange-500">
                <h4 className="font-semibold text-lg mb-3 text-orange-600 dark:text-orange-400">What the "Fat-Burning Zone" Gets Right</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• At lower intensities, fat provides 50-60% of energy</li>
                  <li>• You can sustain this intensity for longer periods</li>
                  <li>• It's accessible for beginners and recovery days</li>
                  <li>• Lower injury risk than high-intensity training</li>
                  <li>• Builds aerobic base and endurance</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-red-500">
                <h4 className="font-semibold text-lg mb-3 text-red-600 dark:text-red-400">What It Gets Wrong</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• Total calories burned matters more than fuel source</li>
                  <li>• Higher intensities burn more total calories per minute</li>
                  <li>• HIIT creates "afterburn" effect (EPOC)</li>
                  <li>• Metabolic rate increases with muscle mass from strength training</li>
                  <li>• Long-term calorie deficit matters most for fat loss</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 text-orange-800 dark:text-orange-300">💡 The Real Math</h4>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-orange-600 dark:text-orange-400 mb-2">Zone 2 (60-70% Max HR) - 30 minutes:</p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Burns ~200 calories total</li>
                    <li>• 60% from fat = 120 fat calories</li>
                    <li>• Can be sustained for extended periods</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-red-600 dark:text-red-400 mb-2">Zone 4 (80-90% Max HR) - 30 minutes:</p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Burns ~400 calories total</li>
                    <li>• 35% from fat = 140 fat calories</li>
                    <li>• Plus 24-48 hours of elevated metabolism (EPOC)</li>
                  </ul>
                </div>
                <div className="bg-amber-200 dark:bg-amber-900/30 rounded-lg p-4">
                  <p className="font-semibold text-amber-800 dark:text-amber-300">
                    Higher intensity burns more fat calories AND more total calories, plus boosts metabolism for days afterward!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-100 dark:bg-amber-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <Target className="w-5 h-5" />
                The Best Approach for Fat Loss
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Instead of obsessing over the "fat-burning zone," focus on:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">1.</span>
                  <span><strong>Calorie deficit through diet:</strong> Nutrition is 70-80% of fat loss</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">2.</span>
                  <span><strong>Mix training intensities:</strong> Include Zone 2 for endurance AND Zones 4-5 for metabolic boost</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">3.</span>
                  <span><strong>Strength training:</strong> Build muscle to increase resting metabolic rate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">4.</span>
                  <span><strong>Consistency:</strong> The best zone is the one you'll stick to long-term</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">5.</span>
                  <span><strong>NEAT:</strong> Increase non-exercise activity (walking, fidgeting, standing)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* VO2 Max Section */}
      <section className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            🫁 VO2 Max: Your Aerobic Ceiling
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              VO2 max is the maximum amount of oxygen your body can utilize during intense exercise. It's considered one of the best indicators of cardiovascular fitness and aerobic endurance.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">🔬 What is VO2 Max?</h3>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-6 my-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                VO2 max is measured in milliliters of oxygen per kilogram of body weight per minute (ml/kg/min). It represents the upper limit of your body's ability to:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Breathe in and transport oxygen to muscles</li>
                <li>• Extract oxygen from blood at the cellular level</li>
                <li>• Use that oxygen to produce energy (ATP)</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">📊 VO2 Max Classifications</h3>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400">Men (ml/kg/min)</h4>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Elite athlete:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">&gt;60</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Excellent:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">52-60</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Good:</span>
                    <span className="font-medium text-teal-600 dark:text-teal-400">46-51</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Average:</span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">35-45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Below average:</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">&lt;35</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-pink-600 dark:text-pink-400">Women (ml/kg/min)</h4>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Elite athlete:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">&gt;55</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Excellent:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">46-54</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Good:</span>
                    <span className="font-medium text-teal-600 dark:text-teal-400">40-45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Average:</span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">30-39</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Below average:</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">&lt;30</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-cyan-800 dark:text-cyan-300">
                <TrendingUp className="w-5 h-5" />
                How to Improve Your VO2 Max
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-medium text-cyan-700 dark:text-cyan-400 mb-3">High-Intensity Interval Training (HIIT)</p>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>• 4-8 intervals of 3-5 minutes at 90-95% max HR</li>
                    <li>• Recovery periods of 2-3 minutes at 60-70% max HR</li>
                    <li>• 2-3 sessions per week</li>
                    <li>• Examples: Hill repeats, track intervals, bike intervals</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-cyan-700 dark:text-cyan-400 mb-3">Tempo Training</p>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>• 20-40 minutes at 75-85% max HR (Zone 3-4)</li>
                    <li>• Sustained "comfortably hard" effort</li>
                    <li>• 1-2 sessions per week</li>
                    <li>• Improves lactate threshold and efficiency</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-4 text-sm">
                <strong>Note:</strong> VO2 max improvements typically range from 15-25% with consistent training. Genetics account for ~50% of baseline VO2 max, but training makes a significant difference in performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Heart Rate Variability */}
      <section className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <Heart className="w-8 h-8 text-purple-600" />
            💓 Heart Rate Variability (HRV)
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Heart Rate Variability (HRV) is the variation in time between consecutive heartbeats. Contrary to what you might think, more variability is actually better—it indicates a healthy, adaptive nervous system.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">🧠 Why HRV Matters</h3>
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-6 my-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                HRV reflects the balance between your sympathetic (fight-or-flight) and parasympathetic (rest-and-digest) nervous systems:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h5 className="font-semibold text-green-600 dark:text-green-400 mb-2">High HRV (Good)</h5>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Better recovery and adaptation</li>
                    <li>• Balanced nervous system</li>
                    <li>• Lower stress levels</li>
                    <li>• Better cardiovascular fitness</li>
                    <li>• Ready to train hard</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h5 className="font-semibold text-red-600 dark:text-red-400 mb-2">Low HRV (Warning Sign)</h5>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Overtraining or stress</li>
                    <li>• Poor recovery</li>
                    <li>• Illness or inflammation</li>
                    <li>• Sleep deprivation</li>
                    <li>• Need for rest or recovery</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">📱 How to Track HRV</h3>
            <div className="grid md:grid-cols-3 gap-6 my-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">⌚</div>
                <h4 className="font-semibold text-lg mb-2 text-purple-600 dark:text-purple-400">Wearables</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Devices like Whoop, Oura Ring, Apple Watch, and Garmin watches track HRV automatically during sleep.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">📱</div>
                <h4 className="font-semibold text-lg mb-2 text-pink-600 dark:text-pink-400">Apps</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  HRV apps like Elite HRV, HRV4Training, and Welltory use your phone camera or chest strap for morning readings.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">📈</div>
                <h4 className="font-semibold text-lg mb-2 text-purple-500 dark:text-purple-300">Consistency</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Measure at the same time daily (ideally upon waking). Track trends over weeks, not daily fluctuations.
                </p>
              </div>
            </div>

            <div className="bg-pink-100 dark:bg-pink-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 text-pink-800 dark:text-pink-300">🎯 Using HRV to Optimize Training</h4>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 text-xl mt-0.5">✓</span>
                  <div>
                    <p className="font-medium">HRV Above Baseline (High):</p>
                    <p className="text-sm">Your body is recovered and adapting well. Go ahead with planned intense training or races.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-600 dark:text-yellow-400 text-xl mt-0.5">⚠</span>
                  <div>
                    <p className="font-medium">HRV Slightly Below Baseline:</p>
                    <p className="text-sm">Moderate your training intensity. Focus on Zone 2 work or technique sessions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-600 dark:text-red-400 text-xl mt-0.5">✗</span>
                  <div>
                    <p className="font-medium">HRV Significantly Below Baseline (Low):</p>
                    <p className="text-sm">Take a rest day or do very light active recovery only. Your body needs time to adapt.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zone-Based Training Programs */}
      <section className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
            <Target className="w-8 h-8 text-green-600" />
            🏆 Zone-Based Training Programs
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Here are sample weekly training plans based on different fitness goals. Adjust intensities and durations based on your fitness level.
            </p>

            <div className="space-y-6 my-8">
              <div className="bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl p-6 shadow-lg">
                <h4 className="font-semibold text-xl mb-4 text-green-700 dark:text-green-300 flex items-center gap-2">
                  <span className="text-2xl">🏃</span> Endurance Building (Base Training)
                </h4>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Monday: Easy Recovery</p>
                      <span className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Zone 1</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">30-45 min at 50-60% max HR - Active recovery from weekend</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Tuesday: Aerobic Development</p>
                      <span className="text-sm px-2 py-1 bg-blue-200 dark:bg-blue-700 rounded">Zone 2</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">60-90 min at 60-70% max HR - Build aerobic base</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Wednesday: Tempo Run</p>
                      <span className="text-sm px-2 py-1 bg-green-200 dark:bg-green-700 rounded">Zone 3</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">40-50 min with 20 min at 70-80% max HR</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Thursday: Easy Aerobic</p>
                      <span className="text-sm px-2 py-1 bg-blue-200 dark:bg-blue-700 rounded">Zone 2</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">45-60 min at 60-70% max HR</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Friday: Rest or Active Recovery</p>
                      <span className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Zone 1</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">30 min easy or complete rest</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Saturday: Long Aerobic Run</p>
                      <span className="text-sm px-2 py-1 bg-blue-200 dark:bg-blue-700 rounded">Zone 2</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">90-120 min at 60-70% max HR</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Sunday: Easy Recovery</p>
                      <span className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Zone 1</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">30-45 min at 50-60% max HR</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl p-6 shadow-lg">
                <h4 className="font-semibold text-xl mb-4 text-orange-700 dark:text-orange-300 flex items-center gap-2">
                  <span className="text-2xl">⚡</span> Speed & Power (Performance Training)
                </h4>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Monday: Active Recovery</p>
                      <span className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Zone 1</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">30 min easy + stretching/mobility</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Tuesday: Interval Training</p>
                      <span className="text-sm px-2 py-1 bg-orange-200 dark:bg-orange-700 rounded">Zone 4-5</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">8x400m at 85-95% max HR, 90 sec recovery jog</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Wednesday: Easy Run</p>
                      <span className="text-sm px-2 py-1 bg-blue-200 dark:bg-blue-700 rounded">Zone 2</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">45 min at 60-70% max HR</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Thursday: Threshold Intervals</p>
                      <span className="text-sm px-2 py-1 bg-orange-200 dark:bg-orange-700 rounded">Zone 4</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">4x1 mile at 80-85% max HR, 2 min recovery</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Friday: Rest Day</p>
                      <span className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Rest</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Complete rest or light stretching only</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Saturday: Tempo Run</p>
                      <span className="text-sm px-2 py-1 bg-green-200 dark:bg-green-700 rounded">Zone 3</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">60 min with 30-40 min at 70-80% max HR</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Sunday: Long Easy Run</p>
                      <span className="text-sm px-2 py-1 bg-blue-200 dark:bg-blue-700 rounded">Zone 2</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">75-90 min at 60-70% max HR</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 shadow-lg">
                <h4 className="font-semibold text-xl mb-4 text-purple-700 dark:text-purple-300 flex items-center gap-2">
                  <span className="text-2xl">🔥</span> Fat Loss & Fitness (Beginner-Intermediate)
                </h4>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Monday: Steady Cardio</p>
                      <span className="text-sm px-2 py-1 bg-blue-200 dark:bg-blue-700 rounded">Zone 2</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">30-45 min at 60-70% max HR + strength training</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Tuesday: HIIT Workout</p>
                      <span className="text-sm px-2 py-1 bg-red-200 dark:bg-red-700 rounded">Zone 4-5</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">30 min: 1 min hard/2 min easy intervals at 80-95% max HR</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Wednesday: Active Recovery</p>
                      <span className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Zone 1</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">30 min walk, yoga, or swimming at 50-60% max HR</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Thursday: Tempo Cardio</p>
                      <span className="text-sm px-2 py-1 bg-green-200 dark:bg-green-700 rounded">Zone 3</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">40 min at 70-80% max HR + strength training</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Friday: HIIT or Circuit</p>
                      <span className="text-sm px-2 py-1 bg-red-200 dark:bg-red-700 rounded">Zone 4-5</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">30 min circuit training or 30 sec on/30 sec off intervals</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Saturday: Long Cardio</p>
                      <span className="text-sm px-2 py-1 bg-blue-200 dark:bg-blue-700 rounded">Zone 2</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">45-60 min at 60-70% max HR (run, bike, hike)</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Sunday: Rest or Light Activity</p>
                      <span className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Zone 1</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rest or 20-30 min easy walk/stretching</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-teal-100 dark:bg-teal-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-teal-800 dark:text-teal-300">
                <Info className="w-5 h-5" />
                Training Principles for All Programs
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                  <span><strong>80/20 Rule:</strong> 80% of training at low-moderate intensity (Zones 1-2), 20% at high intensity (Zones 3-5)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                  <span><strong>Progressive overload:</strong> Gradually increase duration, frequency, or intensity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                  <span><strong>Recovery is crucial:</strong> Hard days should be really hard, easy days really easy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                  <span><strong>Listen to your body:</strong> Adjust based on HRV, fatigue, and overall feeling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                  <span><strong>Include strength training:</strong> 2-3 sessions per week for balanced fitness</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="animate-fade-in" style={{ animationDelay: "1s" }}>
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-700 to-slate-700 dark:from-gray-300 dark:to-slate-300 bg-clip-text text-transparent">
            ❓ Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                How accurate is the 220-minus-age formula?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                The 220-minus-age formula has a standard deviation of ±10-12 bpm, making it a rough estimate. It tends to overestimate max HR for younger people and underestimate for older adults. For more accuracy, consider a graded exercise test or field test (e.g., all-out 2-3 minute effort). However, the formula is sufficient for general training zone guidance. If using heart rate zones seriously, consider getting your actual max HR tested.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                Should I use max HR or heart rate reserve for zones?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Both methods work, but heart rate reserve (HRR, also called Karvonen method) is generally more accurate. HRR accounts for your resting heart rate and tends to align better with metabolic zones. The calculator above uses HRR if you provide your resting heart rate. If you don't know your resting HR, measure it first thing in the morning before getting out of bed for 3-5 days and average the results.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                Why is my heart rate higher than expected during exercise?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Several factors can elevate heart rate beyond expected zones: dehydration (increases HR by 5-10 bpm), heat and humidity, caffeine, stress or anxiety, illness or infection, altitude, poor sleep, or overtraining. Cardiac drift also occurs during long efforts—your heart rate gradually increases even at the same pace due to dehydration and rising core temperature. If consistently high, consult a doctor to rule out underlying conditions.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                Can I do all my training in Zone 2 for fat loss?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                While Zone 2 training is excellent for building aerobic base and fat metabolism, exclusively training in Zone 2 isn't optimal for most goals. Including higher intensity work (Zones 4-5) increases total calorie burn, builds muscle, and creates metabolic adaptations that improve fat burning even at rest. The best approach combines Zone 2 for base endurance with strategic high-intensity intervals. Remember, nutrition creates the calorie deficit for fat loss—exercise optimizes body composition.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                How do I know if I'm overtraining?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Overtraining symptoms include: elevated resting heart rate (5+ bpm above normal), decreased HRV, persistent fatigue, declining performance despite training, increased susceptibility to illness, mood changes (irritability, depression), sleep disturbances, loss of motivation, and prolonged muscle soreness. If experiencing several symptoms, reduce training volume/intensity for 1-2 weeks. Focus on sleep, nutrition, and stress management. Consistent HRV tracking can help catch overtraining early.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                Do I need a heart rate monitor for zone training?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                While heart rate monitors provide objective data, you can train by perceived exertion. Zone 1: very easy, can sing; Zone 2: comfortable, can hold conversation; Zone 3: moderate, speaking in sentences becomes challenging; Zone 4: hard, only short phrases possible; Zone 5: maximum effort, cannot speak. Chest strap monitors are most accurate. Wrist-based monitors work but can be less accurate during intervals. For serious training, invest in a quality chest strap (Polar H10, Garmin HRM-Pro).
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <EnhancedHealthCalculatorLayout
      title="Heart Rate Zone Calculator"
      description="Calculate your personalized heart rate training zones for optimal workout intensity"
      category="Fitness"
      metaTitle="Heart Rate Zone Calculator - Training Zones Based on Max HR"
      metaDescription="Calculate your personalized heart rate training zones for optimal workout intensity. Improve endurance, burn fat, and enhance athletic performance."
      calculatorContent={
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 rounded-xl p-6 shadow-sm animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Heart className="w-4 h-4 text-red-600" />
                  Age (years)
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restingHR" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Activity className="w-4 h-4 text-red-600" />
                  Resting Heart Rate (optional)
                </Label>
                <Input
                  id="restingHR"
                  type="number"
                  value={restingHR}
                  onChange={(e) => setRestingHR(e.target.value)}
                  placeholder="Enter resting HR (bpm)"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Measure first thing in the morning before getting out of bed
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={calculateZones} className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                <Heart className="w-4 h-4 mr-2" />
                Calculate Zones
              </Button>
              <Button onClick={reset} variant="outline" className="flex-1">
                Reset
              </Button>
            </div>
          </div>

          {zones && maxHR && (
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 border-red-200 dark:border-red-800 animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <Heart className="w-5 h-5" />
                  Your Heart Rate Training Zones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Maximum Heart Rate</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{maxHR} bpm</p>
                </div>

                <Alert className="bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700">
                  <Info className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    These zones are estimates. For personalized training, consider getting your max HR tested professionally.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {zones.map((zone, index) => (
                    <div
                      key={index}
                      className={`bg-gradient-to-r ${zone.color} rounded-xl p-4 text-white shadow-md transform hover:scale-105 transition-transform duration-300 animate-slide-up`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">{zone.name}</h4>
                        <span className="text-sm bg-white/20 px-2 py-1 rounded">{zone.percentage}</span>
                      </div>
                      <p className="text-2xl font-bold mb-2">
                        {zone.min} - {zone.max} bpm
                      </p>
                      <p className="text-sm opacity-90 mb-3">{zone.description}</p>
                      <ul className="space-y-1 text-xs opacity-90">
                        {zone.benefits.map((benefit, i) => (
                          <li key={i}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <HealthSocialShare
                  title="Check out my heart rate training zones!"
                  resultText={`My max heart rate is ${maxHR} bpm. Zone 2 training: ${zones[1].min}-${zones[1].max} bpm for fat burning and endurance.`}
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
