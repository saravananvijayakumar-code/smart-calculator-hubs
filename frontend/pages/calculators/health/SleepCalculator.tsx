import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Brain, Clock, Sparkles, Info, Heart, Zap } from "lucide-react";
import EnhancedHealthCalculatorLayout from "@/components/EnhancedHealthCalculatorLayout";
import HealthSocialShare from "@/components/health/HealthSocialShare";

export default function SleepCalculator() {
  const [calculationType, setCalculationType] = useState<"bedtime" | "waketime">("bedtime");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">("PM");
  const [results, setResults] = useState<string[] | null>(null);

  const calculateSleepTimes = () => {
    if (!hour || !minute) return;

    const sleepCycleMinutes = 90;
    const fallAsleepMinutes = 14;
    
    let targetHour = parseInt(hour);
    let targetMinute = parseInt(minute);
    
    if (period === "PM" && targetHour !== 12) {
      targetHour += 12;
    } else if (period === "AM" && targetHour === 12) {
      targetHour = 0;
    }

    const targetTime = new Date();
    targetTime.setHours(targetHour, targetMinute, 0, 0);

    const times: string[] = [];
    const cycles = calculationType === "bedtime" ? [6, 5, 4, 3] : [4, 5, 6, 7];

    cycles.forEach((numCycles) => {
      const sleepTime = new Date(targetTime);
      const totalMinutes = (numCycles * sleepCycleMinutes) + fallAsleepMinutes;
      
      if (calculationType === "bedtime") {
        sleepTime.setMinutes(sleepTime.getMinutes() - totalMinutes);
      } else {
        sleepTime.setMinutes(sleepTime.getMinutes() + totalMinutes);
      }

      const hours = sleepTime.getHours();
      const mins = sleepTime.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHour = hours % 12 || 12;
      const displayMinute = mins.toString().padStart(2, "0");
      
      times.push(`${displayHour}:${displayMinute} ${ampm}`);
    });

    setResults(times);
  };

  const reset = () => {
    setHour("");
    setMinute("");
    setPeriod("PM");
    setResults(null);
  };

  const educationalContent = (
    <div className="space-y-12 mt-12">
      {/* Sleep Cycles Section */}
      <section className="animate-fade-in">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Clock className="w-8 h-8 text-indigo-600" />
            🌙 Understanding Sleep Cycles
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Sleep isn't just "being unconscious"—it's a complex, cyclical process that your brain orchestrates throughout the night. Each sleep cycle lasts approximately 90 minutes and consists of distinct stages that serve different vital functions for your physical and mental health.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">🔄 The Four Stages of Sleep</h3>
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-indigo-500 animate-slide-up">
                <h4 className="font-semibold text-lg mb-3 text-indigo-600 dark:text-indigo-400">Stage 1: Light Sleep (N1)</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">Duration: 1-5 minutes</p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• Transition from wakefulness to sleep</li>
                  <li>• Easy to wake up from</li>
                  <li>• Muscle activity slows down</li>
                  <li>• You may experience hypnic jerks (sudden muscle twitches)</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-purple-500 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <h4 className="font-semibold text-lg mb-3 text-purple-600 dark:text-purple-400">Stage 2: Light Sleep (N2)</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">Duration: 10-25 minutes (first cycle)</p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• Body temperature drops</li>
                  <li>• Heart rate slows</li>
                  <li>• Brain produces sleep spindles</li>
                  <li>• Makes up ~50% of total sleep</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-blue-500 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <h4 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400">Stage 3: Deep Sleep (N3)</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">Duration: 20-40 minutes (first cycle)</p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• Deepest, most restorative sleep</li>
                  <li>• Difficult to wake from</li>
                  <li>• Physical restoration occurs</li>
                  <li>• Growth hormone released</li>
                  <li>• Immune system strengthens</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-pink-500 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <h4 className="font-semibold text-lg mb-3 text-pink-600 dark:text-pink-400">REM Sleep (Rapid Eye Movement)</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">Duration: 10 minutes (first cycle) to 60 minutes (later)</p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• Brain activity increases</li>
                  <li>• Vivid dreams occur</li>
                  <li>• Memory consolidation</li>
                  <li>• Emotional processing</li>
                  <li>• Muscles temporarily paralyzed</li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-indigo-800 dark:text-indigo-300">
                <Clock className="w-5 h-5" />
                Why 90-Minute Cycles Matter
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Waking up in the middle of a sleep cycle, especially during deep sleep, can leave you feeling groggy and disoriented—a phenomenon called "sleep inertia." By timing your sleep in 90-minute increments, you're more likely to wake up at the end of a cycle during lighter sleep, feeling refreshed and alert.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Most adults need 4-6 complete cycles (6-9 hours) per night. The first half of the night contains more deep sleep, while the second half has longer REM periods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REM vs NREM Section */}
      <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            🧠 REM vs NREM: Two Types of Sleep
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Your sleep is divided into two fundamentally different types: NREM (Non-Rapid Eye Movement) and REM sleep. Each serves distinct and crucial functions for your health and wellbeing.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 shadow-lg">
                <h4 className="font-semibold text-xl mb-4 text-purple-700 dark:text-purple-300 flex items-center gap-2">
                  <span className="text-3xl">💤</span> NREM Sleep
                </h4>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="font-medium text-purple-600 dark:text-purple-400 mb-1">Physical Restoration:</p>
                    <p className="text-sm">Tissue growth and repair, bone and muscle development, immune system strengthening</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-600 dark:text-purple-400 mb-1">Energy Conservation:</p>
                    <p className="text-sm">Body temperature drops, metabolism slows, energy reserves replenished</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-600 dark:text-purple-400 mb-1">Hormone Release:</p>
                    <p className="text-sm">Growth hormone secretion, regulation of appetite hormones (leptin and ghrelin)</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-600 dark:text-purple-400 mb-1">Brain Maintenance:</p>
                    <p className="text-sm">Clearance of metabolic waste products from the brain (glymphatic system)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-xl p-6 shadow-lg">
                <h4 className="font-semibold text-xl mb-4 text-pink-700 dark:text-pink-300 flex items-center gap-2">
                  <span className="text-3xl">✨</span> REM Sleep
                </h4>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="font-medium text-pink-600 dark:text-pink-400 mb-1">Memory Consolidation:</p>
                    <p className="text-sm">Transfer of information from short-term to long-term memory, learning reinforcement</p>
                  </div>
                  <div>
                    <p className="font-medium text-pink-600 dark:text-pink-400 mb-1">Emotional Processing:</p>
                    <p className="text-sm">Processing emotions and experiences, mood regulation, stress management</p>
                  </div>
                  <div>
                    <p className="font-medium text-pink-600 dark:text-pink-400 mb-1">Creativity & Problem-Solving:</p>
                    <p className="text-sm">Formation of creative connections, insight development, complex problem solving</p>
                  </div>
                  <div>
                    <p className="font-medium text-pink-600 dark:text-pink-400 mb-1">Brain Development:</p>
                    <p className="text-sm">Critical for brain maturation in infants and children, neural pathway formation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 text-purple-800 dark:text-purple-300">🔬 Sleep Architecture Throughout the Night</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The proportion of REM and deep NREM sleep changes as the night progresses:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-purple-600 dark:text-purple-400 mb-2">🌃 First Half of Night (Early Cycles)</p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• More deep NREM sleep (Stage 3)</li>
                    <li>• Shorter REM periods (10-15 minutes)</li>
                    <li>• Physical restoration prioritized</li>
                    <li>• Growth hormone release peaks</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-pink-600 dark:text-pink-400 mb-2">🌅 Second Half of Night (Later Cycles)</p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Less deep sleep, more light sleep</li>
                    <li>• Longer REM periods (up to 60 minutes)</li>
                    <li>• Mental restoration prioritized</li>
                    <li>• Vivid, memorable dreams more common</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Circadian Rhythm Section */}
      <section className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-600" />
            ⏰ Your Circadian Rhythm: The Body's Master Clock
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Your circadian rhythm is an internal 24-hour clock that regulates sleep-wake cycles, hormone release, body temperature, and other vital functions. Understanding and working with your natural rhythm is key to optimal sleep quality.
            </p>

            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-4 text-blue-800 dark:text-blue-300">🌍 How Your Body Clock Works</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 dark:bg-blue-800 rounded-full p-2 mt-1">
                    <Zap className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-400">Light is the Primary Cue</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Special cells in your eyes detect light and send signals to the suprachiasmatic nucleus (SCN) in your brain—your body's master clock.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-cyan-200 dark:bg-cyan-800 rounded-full p-2 mt-1">
                    <Clock className="w-4 h-4 text-cyan-700 dark:text-cyan-300" />
                  </div>
                  <div>
                    <p className="font-medium text-cyan-700 dark:text-cyan-400">Darkness Triggers Melatonin</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">When it gets dark, the SCN signals the pineal gland to release melatonin, making you feel sleepy.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-300 dark:bg-blue-700 rounded-full p-2 mt-1">
                    <Clock className="w-4 h-4 text-blue-800 dark:text-blue-200" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-400">Consistent Timing Matters</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Your circadian rhythm thrives on consistency. Irregular sleep schedules can disrupt it, leading to poor sleep quality.</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">🕐 Typical Circadian Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">6:00 AM - Cortisol Rise</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Cortisol levels increase sharply, promoting wakefulness</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400 mb-2">7:00 AM - Melatonin Stops</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Melatonin secretion halts, body temperature rises</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <p className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-2">10:00 AM - Peak Alertness</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Highest alertness and optimal cognitive performance</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <p className="text-sm font-medium text-blue-500 dark:text-blue-300 mb-2">2:30 PM - Afternoon Dip</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Natural energy dip, ideal time for a short nap</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">9:00 PM - Melatonin Release</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Melatonin secretion begins, preparing for sleep</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">10:30 PM - Bowel Suppressed</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Digestive system slows, body prepares for rest</p>
              </div>
            </div>

            <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-cyan-800 dark:text-cyan-300">
                <Sparkles className="w-5 h-5" />
                Optimizing Your Circadian Rhythm
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 dark:text-cyan-400 mt-1">☀️</span>
                  <span><strong>Morning light exposure:</strong> Get 10-30 minutes of bright light within an hour of waking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 dark:text-cyan-400 mt-1">🌙</span>
                  <span><strong>Dim evening lights:</strong> Reduce bright lights 2-3 hours before bed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 dark:text-cyan-400 mt-1">📱</span>
                  <span><strong>Limit blue light:</strong> Use blue light filters on devices or avoid screens before bed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 dark:text-cyan-400 mt-1">🕐</span>
                  <span><strong>Consistent schedule:</strong> Go to bed and wake up at the same time daily, even weekends</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 dark:text-cyan-400 mt-1">🍽️</span>
                  <span><strong>Time your meals:</strong> Eat at consistent times; avoid large meals close to bedtime</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sleep Hygiene Section */}
      <section className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-green-600" />
            ✨ Sleep Hygiene: Creating the Perfect Sleep Environment
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Sleep hygiene refers to the habits and environmental factors that contribute to quality sleep. Small changes can make a dramatic difference in how well you sleep.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">🛏️ The Ideal Sleep Environment</h3>
            <div className="grid md:grid-cols-3 gap-6 my-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">🌡️</div>
                <h4 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">Temperature</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  <strong>Ideal: 60-67°F (15-19°C)</strong>
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Your body temperature naturally drops during sleep. A cool room facilitates this process and promotes deeper sleep.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">🌑</div>
                <h4 className="font-semibold text-lg mb-2 text-teal-600 dark:text-teal-400">Darkness</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  <strong>Pitch black is best</strong>
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Even small amounts of light can disrupt melatonin production. Use blackout curtains and cover LED lights.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">🔇</div>
                <h4 className="font-semibold text-lg mb-2 text-green-500 dark:text-green-300">Silence</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  <strong>Quiet or white noise</strong>
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Use earplugs or a white noise machine to mask disruptive sounds and create consistent audio.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">📋 Pre-Sleep Routine Checklist</h3>
            <div className="bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl p-6 my-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">✅ Do These:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Set a consistent bedtime routine (60-90 min before bed)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Take a warm bath or shower 60-90 min before bed</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Read a physical book or listen to calming music</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Practice meditation or deep breathing exercises</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Journal or make a to-do list for tomorrow</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Gentle stretching or yoga</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3">❌ Avoid These:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 mt-0.5">✗</span>
                      <span className="text-gray-700 dark:text-gray-300">Screens (TV, phone, computer) 1-2 hours before bed</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 mt-0.5">✗</span>
                      <span className="text-gray-700 dark:text-gray-300">Caffeine after 2 PM (6-8 hour half-life)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 mt-0.5">✗</span>
                      <span className="text-gray-700 dark:text-gray-300">Heavy meals within 3 hours of bedtime</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 mt-0.5">✗</span>
                      <span className="text-gray-700 dark:text-gray-300">Alcohol (disrupts sleep architecture and REM)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 mt-0.5">✗</span>
                      <span className="text-gray-700 dark:text-gray-300">Intense exercise within 3 hours of bed</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 mt-0.5">✗</span>
                      <span className="text-gray-700 dark:text-gray-300">Napping after 3 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-teal-100 dark:bg-teal-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-teal-800 dark:text-teal-300">
                <Heart className="w-5 h-5" />
                The 10-3-2-1-0 Sleep Formula
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">10</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">hours before: No more caffeine</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">3</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">hours before: No more food or alcohol</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">2</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">hours before: No more work</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">1</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">hour before: No more screens</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">0</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">times hitting snooze in the morning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sleep Deprivation Section */}
      <section className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            ⚠️ The Impact of Sleep Deprivation
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Sleep deprivation has far-reaching consequences beyond just feeling tired. Understanding these effects can motivate better sleep habits.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">🧠 Short-Term Effects (1-7 Days)</h3>
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-orange-500">
                <h4 className="font-semibold text-lg mb-3 text-orange-600 dark:text-orange-400">Cognitive Impairment</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• Reduced attention span and focus</li>
                  <li>• Impaired decision-making abilities</li>
                  <li>• Slower reaction times (similar to alcohol intoxication)</li>
                  <li>• Memory formation problems</li>
                  <li>• Decreased problem-solving skills</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-red-500">
                <h4 className="font-semibold text-lg mb-3 text-red-600 dark:text-red-400">Physical Effects</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• Weakened immune system</li>
                  <li>• Increased inflammation</li>
                  <li>• Higher stress hormone (cortisol) levels</li>
                  <li>• Decreased athletic performance</li>
                  <li>• Slower recovery from exercise</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
                <h4 className="font-semibold text-lg mb-3 text-yellow-600 dark:text-yellow-400">Emotional Impact</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• Increased irritability and mood swings</li>
                  <li>• Heightened emotional reactivity</li>
                  <li>• Reduced stress tolerance</li>
                  <li>• Increased anxiety levels</li>
                  <li>• Difficulty regulating emotions</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-amber-500">
                <h4 className="font-semibold text-lg mb-3 text-amber-600 dark:text-amber-400">Metabolic Changes</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• Increased hunger (elevated ghrelin)</li>
                  <li>• Decreased satiety (reduced leptin)</li>
                  <li>• Insulin resistance increases</li>
                  <li>• Cravings for high-calorie foods</li>
                  <li>• Disrupted glucose metabolism</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-gray-100">⏰ Long-Term Effects (Chronic Sleep Deprivation)</h3>
            <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-6 my-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Consistently getting less than 7 hours of sleep per night is associated with serious health risks:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2">Cardiovascular Disease</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Increased risk of hypertension, heart attack, and stroke</p>
                </div>
                <div>
                  <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2">Type 2 Diabetes</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chronic insulin resistance and impaired glucose tolerance</p>
                </div>
                <div>
                  <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2">Obesity</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hormonal imbalances promoting weight gain</p>
                </div>
                <div>
                  <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2">Mental Health</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Depression, anxiety disorders, and other psychiatric conditions</p>
                </div>
                <div>
                  <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2">Cognitive Decline</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Accelerated aging, increased dementia and Alzheimer's risk</p>
                </div>
                <div>
                  <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2">Weakened Immunity</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reduced ability to fight infections and illness</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-6 my-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-orange-800 dark:text-orange-300">
                <Info className="w-5 h-5" />
                You Can't "Catch Up" on Sleep
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                While you might feel better after sleeping in on weekends, you can't fully compensate for chronic sleep deprivation. Sleep debt accumulates and has lasting effects on health and performance.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                A 2016 study found that even one night of sleep loss can have effects lasting up to 7 days. The best approach is consistent, adequate sleep every night.
              </p>
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
                How much sleep do I really need?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Sleep needs vary by age and individual factors. Adults (18-64) typically need 7-9 hours, while teenagers need 8-10 hours and older adults (65+) need 7-8 hours. However, some people function well on slightly less or need slightly more. The key is feeling refreshed and alert during the day. If you rely on an alarm clock, struggle to wake up, or feel tired during the day, you likely need more sleep.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                Are naps beneficial or harmful?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Naps can be beneficial when done correctly. A 10-20 minute "power nap" can boost alertness and performance without causing sleep inertia (grogginess). Avoid napping after 3 PM as it can interfere with nighttime sleep. If you need frequent naps or nap for more than 30 minutes, it may indicate insufficient nighttime sleep or a sleep disorder. For shift workers or those with irregular schedules, strategic napping can be essential for maintaining alertness and safety.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                What should I do if I can't fall asleep?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                If you can't fall asleep within 20 minutes, get out of bed and do a quiet, relaxing activity in low light until you feel sleepy. Avoid screens, bright lights, and stimulating activities. This "stimulus control" technique prevents your brain from associating your bed with wakefulness. Also avoid clock-watching, which increases anxiety. Practice relaxation techniques like deep breathing, progressive muscle relaxation, or visualization. If insomnia persists for more than a few weeks, consult a healthcare provider or sleep specialist.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                Is it better to sleep in a cold or warm room?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                A cooler room is better for sleep. The ideal temperature is 60-67°F (15-19°C). Your body's core temperature naturally drops during sleep, and a cool environment facilitates this process. Being too warm can prevent you from entering deep sleep and increase nighttime awakenings. However, personal preference matters—use breathable bedding and adjust layers to find your comfort zone. Cold extremities can also disrupt sleep, so warm socks may help if your feet tend to get cold.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                How does alcohol affect sleep?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                While alcohol may help you fall asleep faster, it significantly disrupts sleep quality. Alcohol suppresses REM sleep in the first half of the night, then causes REM rebound in the second half, leading to vivid dreams and frequent awakenings. It also relaxes throat muscles, increasing snoring and sleep apnea risk. Alcohol is metabolized within a few hours, often causing middle-of-the-night wakefulness. For better sleep, avoid alcohol within 3-4 hours of bedtime. One drink can affect sleep for up to 6 hours.
              </p>
            </details>

            <details className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-gray-100 list-none flex items-center justify-between">
                When should I see a doctor about sleep problems?
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Consult a doctor if you experience: chronic insomnia (difficulty falling or staying asleep) lasting more than 3 weeks; excessive daytime sleepiness despite adequate sleep time; loud snoring with breathing pauses (possible sleep apnea); frequent leg movements or uncomfortable sensations in legs at night (restless leg syndrome); acting out dreams or unusual sleep behaviors; or if sleep problems significantly impact your daily functioning, mood, or relationships. Sleep disorders are treatable, and early intervention can prevent serious health complications.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <EnhancedHealthCalculatorLayout
      title="Sleep Calculator"
      description="Calculate optimal bedtime or wake time based on 90-minute sleep cycles"
      category="Sleep"
      metaTitle="Sleep Calculator - Optimal Bedtime & Wake Time Based on Sleep Cycles"
      metaDescription="Calculate the best time to sleep or wake up based on 90-minute sleep cycles. Wake up feeling refreshed by timing your sleep cycles correctly."
      calculatorContent={
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl p-6 shadow-sm animate-fade-in">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => setCalculationType("bedtime")}
                  variant={calculationType === "bedtime" ? "default" : "outline"}
                  className="flex-1"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Calculate Bedtime
                </Button>
                <Button
                  onClick={() => setCalculationType("waketime")}
                  variant={calculationType === "waketime" ? "default" : "outline"}
                  className="flex-1"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Calculate Wake Time
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  {calculationType === "bedtime" ? "When do you need to wake up?" : "When will you go to bed?"}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select value={hour} onValueChange={setHour}>
                    <SelectTrigger>
                      <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <SelectItem key={h} value={h.toString()}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={minute} onValueChange={setMinute}>
                    <SelectTrigger>
                      <SelectValue placeholder="Minute" />
                    </SelectTrigger>
                    <SelectContent>
                      {["00", "15", "30", "45"].map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={period} onValueChange={(v: "AM" | "PM") => setPeriod(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={calculateSleepTimes} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Clock className="w-4 h-4 mr-2" />
                Calculate
              </Button>
              <Button onClick={reset} variant="outline" className="flex-1">
                Reset
              </Button>
            </div>
          </div>

          {results && (
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-200 dark:border-indigo-800 animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  {calculationType === "bedtime" ? <Clock className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  {calculationType === "bedtime" ? "Recommended Bedtimes" : "Recommended Wake Times"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700">
                  <AlertCircle className="h-4 w-4 text-indigo-600" />
                  <AlertDescription className="text-indigo-800 dark:text-indigo-200">
                    Times are calculated based on 90-minute sleep cycles. It takes the average person 14 minutes to fall asleep.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {results.map((time, index) => {
                    const cycles = calculationType === "bedtime" ? [6, 5, 4, 3] : [4, 5, 6, 7];
                    const hours = cycles[index] * 1.5;
                    return (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md text-center transform hover:scale-105 transition-transform duration-300 animate-bounce-slow"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">{time}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {cycles[index]} cycles ({hours} hrs)
                        </div>
                      </div>
                    );
                  })}
                </div>

                <HealthSocialShare
                  title="Check out my optimal sleep schedule!"
                  resultText={`Based on sleep cycles, I should ${calculationType === "bedtime" ? "go to bed" : "wake up"} at ${results[1]} for optimal rest.`}
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
