import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Monitor, Smartphone } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { AdsterraSlot } from '@/components/ads/AdsterraSlot';
import DesktopCalorieCalculator from '@/components/DesktopCalorieCalculator';
import MobileCameraMode from '@/components/MobileCameraMode';
import { useCalorieHistoryStore } from '@/stores/calorieHistoryStore';
import { Button } from '@/components/ui/button';


export default function CalorieBurnCalculator() {
  const [isMobile, setIsMobile] = useState(false);
  const [forcedMode, setForcedMode] = useState<'mobile' | 'desktop' | null>(null);
  const { addToHistory } = useCalorieHistoryStore();



  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        (window.innerWidth < 768);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  const showMobileMode = forcedMode === 'mobile' || (forcedMode === null && isMobile);
  const showDesktopMode = forcedMode === 'desktop' || (forcedMode === null && !isMobile);

  return (
    <>
      <SEOHead
        title="AI Calorie Burn Calculator 🔥 - Snap Food Photos & Get Instant Burn Time | MET-Based Exercise Calculator"
        description="Revolutionary AI-powered calorie burn calculator! Mobile: snap food photos for instant AI analysis. Desktop: choose from popular foods. Get personalized exercise time using scientifically accurate MET values. Privacy-first design."
        keywords="AI calorie burn calculator, food photo calorie analysis, MET calculator, exercise time calculator, burn calories, food calories, AI nutrition tracker, camera calorie counter, workout time calculator, MET values"
      >

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": "AI Calorie Burn Calculator",
                "url": "https://smartcalculatorhubs.com/calculators/viral/calorie-burn-calculator",
                "applicationCategory": "HealthApplication",
                "operatingSystem": "Any",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "featureList": [
                  "AI-powered food photo recognition",
                  "MET-based burn time calculations",
                  "Mobile camera mode",
                  "Desktop manual mode",
                  "Personalized results based on weight",
                  "Privacy-first design"
                ],
                "screenshot": "https://smartcalculatorhubs.com/og-calorie-burn.png"
              },
              {
                "@type": "Article",
                "headline": "Understanding MET Values and Calorie Burn Science",
                "author": {
                  "@type": "Organization",
                  "name": "Smart Calculator Hubs"
                },
                "datePublished": new Date().toISOString(),
                "dateModified": new Date().toISOString(),
                "description": "Comprehensive guide to MET values, calorie burn calculations, and using AI technology for nutrition tracking"
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What are MET values?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "MET stands for Metabolic Equivalent of Task, a standardized way to measure the energy cost of physical activities. One MET equals the amount of oxygen consumed while sitting at rest (3.5 ml/kg/min or 1 calorie per kg per hour). An activity rated at 6 METs burns 6 times the calories you'd burn while sitting."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How accurate are calorie burn calculators?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Calorie calculators provide estimates based on average values. Individual variation can be 20-30% above or below these estimates due to genetics, fitness level, movement efficiency, and other factors. Use them as general guides rather than absolute measurements."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How does the AI Camera Mode work?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Our AI Camera Mode uses OpenAI's Vision API to identify food items from photos. Photos are compressed to under 500KB, analyzed for food identification, and calorie data is fetched from the Nutritionix database. The system then calculates burn time using MET-based formulas. Photos are processed securely and never stored on our servers."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Why does weight matter in calorie burn calculations?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Heavier people burn significantly more calories performing the same activity because they're moving more mass. For example, a 200-pound person running burns about 33% more calories than a 150-pound person at the same speed. This is why our calculator requires your weight for personalized accuracy."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What's the formula used to calculate burn time?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Burn Time (minutes) = Calories ÷ (MET × 3.5 × Weight in kg ÷ 200). This scientifically validated formula accounts for the activity's MET value, your body weight, and the calories you want to burn."
                    }
                  }
                ]
              }
            ]
          })}
        </script>
      </SEOHead>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-red-900/20 dark:to-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <AdsterraSlot position="top" className="mb-6" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl mb-4 shadow-lg">
              <Flame className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent mb-4 animate-fade-in">
              Calorie Burn Calculator 🔥
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-up">
              📸 Snap your food & discover instantly! From burgers to donuts, see how long it takes to burn those calories through fun activities!
            </p>
          </div>

          <Card className="shadow-xl border-0 mb-8 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 overflow-hidden animate-scale-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-300">
                  {isMobile ? <Smartphone className="w-5 h-5 animate-bounce" /> : <Monitor className="w-5 h-5 animate-pulse" />}
                  <span className="font-semibold">{forcedMode ? 'Mode:' : `${isMobile ? '📱 Mobile' : '💻 Desktop'} Mode`}</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    variant={showMobileMode ? 'default' : 'outline'}
                    onClick={() => setForcedMode('mobile')}
                    className={`transition-all duration-300 ${showMobileMode ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/50 scale-105' : 'hover:scale-105 hover:border-purple-400'}`}
                  >
                    <Smartphone className="w-4 h-4 mr-1" />
                    📸 AI Camera
                  </Button>
                  <Button
                    size="sm"
                    variant={showDesktopMode ? 'default' : 'outline'}
                    onClick={() => setForcedMode('desktop')}
                    className={`transition-all duration-300 ${showDesktopMode ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/50 scale-105' : 'hover:scale-105 hover:border-blue-400'}`}
                  >
                    <Monitor className="w-4 h-4 mr-1" />
                    ⌨️ Manual
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-6">
              <AdsterraSlot position="middle" className="mb-6" />

              {showMobileMode ? (
                <MobileCameraMode 
                  onSwitchToDesktop={() => setForcedMode('desktop')}
                  onAddToHistory={addToHistory}
                />
              ) : (
                <DesktopCalorieCalculator onAddToHistory={addToHistory} />
              )}
            </div>

            <div className="space-y-6">
              <AdsterraSlot position="middle" className="mb-6" />

              <Card className="shadow-xl border-0 sticky top-4 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20 animate-slide-in-right">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">✨ How AI Camera Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-700 transition-all hover:scale-105">
                    <h3 className="font-bold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">📸 Snap & Analyze</h3>
                    <p>Point your camera at any food and our AI instantly identifies it! Using advanced computer vision, we recognize thousands of foods with amazing accuracy.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-700 transition-all hover:scale-105">
                    <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">🔥 Smart Calculations</h3>
                    <p>Using MET (Metabolic Equivalent) values, we calculate exactly how long you'd need to exercise to burn those calories. Personalized to YOUR weight!</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-xl border-2 border-green-200 dark:border-green-700 transition-all hover:scale-105">
                    <h3 className="font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">🎯 Fun Activities</h3>
                    <p>From running to dancing, see burn times for activities YOU enjoy! No boring gym routines required - find what makes fitness fun for you.</p>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 p-4 rounded-xl border-2 border-yellow-200 dark:border-yellow-700 transition-all hover:scale-105">
                    <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-2">🔒 Privacy First</h3>
                    <p>Your photos are analyzed in real-time and NEVER stored! We respect your privacy - what you eat is your business.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="shadow-xl border-0 mb-8 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 dark:from-orange-900/30 dark:via-pink-900/30 dark:to-purple-900/30">
              <CardTitle className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 dark:from-orange-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent animate-fade-in">🔬 Understanding MET Values and Calorie Burn Science</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 md:p-8 rounded-2xl border-2 border-blue-200 dark:border-blue-700 my-6 transform hover:scale-[1.02] transition-all duration-300 shadow-lg">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3 text-blue-700 dark:text-blue-300">
                  💡 What Are MET Values?
                </h2>
                <p className="text-base md:text-lg leading-relaxed mb-4">
                  MET stands for <span className="font-bold text-blue-600 dark:text-blue-400">Metabolic Equivalent of Task</span>, and it's a standardized way to measure the energy 
                  cost of physical activities. One MET is defined as the amount of oxygen consumed while sitting at 
                  rest, which equals approximately <span className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded font-mono">3.5 ml/kg/min</span> of oxygen per kilogram of body weight per minute, 
                  or about <span className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded font-mono">1 calorie per kg per hour</span>.
                </p>
                <p className="text-base md:text-lg leading-relaxed">
                  When you see an activity rated at <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">6 METs</span>, it means you're burning <span className="font-bold">6 times</span> the calories you would 
                  burn while sitting quietly. This system allows us to compare the intensity of different activities 
                  on a standardized scale, regardless of your body weight! 📊
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 md:p-8 rounded-2xl border-2 border-purple-200 dark:border-purple-700 my-6 transform hover:scale-[1.02] transition-all duration-300 shadow-lg">
                <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3 text-purple-700 dark:text-purple-300">
                  🧮 The MET Formula Explained
                </h3>
                <p className="text-base md:text-lg leading-relaxed mb-4">
                  Our calculator uses the scientifically validated MET formula to calculate burn time:
                </p>
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 p-6 rounded-xl my-4 font-mono text-sm md:text-base border-2 border-indigo-300 dark:border-indigo-600 shadow-inner transform hover:scale-105 transition-all">
                  <div className="text-center font-bold text-purple-700 dark:text-purple-300">
                    Burn Time (minutes) = Calories ÷ (MET × 3.5 × Weight in kg ÷ 200)
                  </div>
                </div>
                <p className="font-semibold text-purple-700 dark:text-purple-300 mb-3">Where:</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg transform hover:translate-x-2 transition-all">
                    <span className="text-2xl">🍔</span>
                    <div><strong className="text-orange-600 dark:text-orange-400">Calories</strong>: The food calories you want to burn</div>
                  </div>
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg transform hover:translate-x-2 transition-all">
                    <span className="text-2xl">🏃</span>
                    <div><strong className="text-blue-600 dark:text-blue-400">MET</strong>: The metabolic equivalent of the activity (e.g., 9.8 for running, 3.8 for brisk walking)</div>
                  </div>
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg transform hover:translate-x-2 transition-all">
                    <span className="text-2xl">⚖️</span>
                    <div><strong className="text-green-600 dark:text-green-400">Weight in kg</strong>: Your body weight in kilograms (lbs ÷ 2.2)</div>
                  </div>
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg transform hover:translate-x-2 transition-all">
                    <span className="text-2xl">🔬</span>
                    <div><strong className="text-cyan-600 dark:text-cyan-400">3.5</strong>: The oxygen consumption constant in ml/kg/min</div>
                  </div>
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg transform hover:translate-x-2 transition-all">
                    <span className="text-2xl">🔢</span>
                    <div><strong className="text-pink-600 dark:text-pink-400">200</strong>: Conversion factor to get calories per minute</div>
                  </div>
                </div>
              </div>

              <div className="my-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                  🏃‍♂️ MET Values for Common Activities
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  Here's a comprehensive breakdown of MET values we use in our calculator:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-2xl border-2 border-red-200 dark:border-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                    <h4 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-red-700 dark:text-red-300">
                      🔥 High-Intensity (8.0+ METs)
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="font-bold text-orange-600 dark:text-orange-400">Jump Rope (11.0)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Most efficient calorie burner! 🏆</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="font-bold text-orange-600 dark:text-orange-400">Running 8 mph (9.8)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Fast-paced sustainable running 🏃</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="font-bold text-orange-600 dark:text-orange-400">Soccer (9.0)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Constant movement & sprinting ⚽</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="font-bold text-orange-600 dark:text-orange-400">Basketball (8.0)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Full-court sprints & jumps 🏀</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-2xl border-2 border-yellow-200 dark:border-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                    <h4 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                      ⚡ Moderate (5.0-7.9 METs)
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="font-bold text-amber-600 dark:text-amber-400">Cycling Moderate (7.5)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Biking at 12-14 mph 🚴</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="font-bold text-amber-600 dark:text-amber-400">Tennis (7.0)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Singles with consistent rallies 🎾</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="font-bold text-amber-600 dark:text-amber-400">Swimming (6.0)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Moderate freestyle 🏊</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="font-bold text-amber-600 dark:text-amber-400">Dancing (6.0)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Zumba & aerobic dance 💃</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="font-bold text-amber-600 dark:text-amber-400">Weight Lifting (5.0)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Resistance training 🏋️</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border-2 border-green-200 dark:border-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                    <h4 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-green-700 dark:text-green-300">
                      🌱 Low-Intensity (2.5-4.9 METs)
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="font-bold text-green-600 dark:text-green-400">Brisk Walking (3.8)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Walking at 3.5-4 mph 🚶</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="font-bold text-green-600 dark:text-green-400">Yoga (3.0)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Hatha or general practice 🧘</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="font-bold text-green-600 dark:text-green-400">Walking Slow (2.5)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Casual strolling 🚶‍♀️</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 md:p-8 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 my-8 transform hover:scale-[1.02] transition-all duration-300 shadow-lg">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
                  ⚖️ Why Weight Matters in Calorie Burn
                </h2>
                
                <p className="text-base md:text-lg leading-relaxed mb-4">
                  One of the most important factors in calorie expenditure is <span className="font-bold text-indigo-600 dark:text-indigo-400">body weight</span>. A heavier person burns 
                  significantly more calories performing the same activity because they're moving more mass against 
                  gravity and generating more force with each movement. 💪
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md transform hover:scale-105 transition-all">
                    <div className="text-center mb-3">
                      <span className="text-4xl">👤</span>
                      <div className="font-bold text-blue-600 dark:text-blue-400 text-lg">150-pound person</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 p-4 rounded-lg font-mono text-sm border-2 border-blue-300 dark:border-blue-600">
                      <div className="text-center">
                        9.8 × 3.5 × (150 ÷ 2.2) ÷ 200
                      </div>
                      <div className="text-center font-bold text-xl mt-2 text-blue-700 dark:text-blue-300">
                        = 11.7 cal/min
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md transform hover:scale-105 transition-all">
                    <div className="text-center mb-3">
                      <span className="text-4xl">👥</span>
                      <div className="font-bold text-purple-600 dark:text-purple-400 text-lg">200-pound person</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 p-4 rounded-lg font-mono text-sm border-2 border-purple-300 dark:border-purple-600">
                      <div className="text-center">
                        9.8 × 3.5 × (200 ÷ 2.2) ÷ 200
                      </div>
                      <div className="text-center font-bold text-xl mt-2 text-purple-700 dark:text-purple-300">
                        = 15.6 cal/min
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-5 rounded-xl border-2 border-orange-300 dark:border-orange-600 text-center transform hover:scale-105 transition-all">
                  <p className="text-xl md:text-2xl font-bold text-orange-700 dark:text-orange-300">
                    That's a <span className="text-3xl text-red-600 dark:text-red-400">33% difference!</span> 🚀
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    This is why our calculator requires your weight—personalized calculations are far more accurate than generic estimates.
                  </p>
                </div>
              </div>


              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-6 md:p-8 rounded-2xl border-2 border-pink-200 dark:border-pink-700 my-8 transform hover:scale-[1.02] transition-all duration-300 shadow-lg">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 text-pink-700 dark:text-pink-300">
                  🔋 Understanding Calories and Energy Balance
                </h2>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">💡</span>
                      <div>
                        <p className="text-base md:text-lg leading-relaxed">
                          A <span className="font-bold text-pink-600 dark:text-pink-400">calorie</span> is a unit of energy. Specifically, it's the amount of energy needed to raise the temperature of 
                          one gram of water by one degree Celsius. When we talk about "calories" in food, we're actually referring to 
                          <span className="bg-pink-200 dark:bg-pink-800 px-2 py-1 rounded font-mono mx-1">kilocalories (1000 calories = 1 kcal)</span>, but the term "calorie" has become standard in nutrition.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">⚡</span>
                      <div>
                        <p className="text-base md:text-lg leading-relaxed">
                          Your body needs energy for <span className="font-bold">everything</span>: breathing, thinking, moving, digesting food, and maintaining body 
                          temperature. The calories you consume from food provide this energy.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-xl border-2 border-green-300 dark:border-green-600 transform hover:scale-105 transition-all">
                      <div className="text-center">
                        <div className="text-3xl mb-2">📈</div>
                        <div className="font-bold text-green-700 dark:text-green-300">Calorie Surplus</div>
                        <div className="text-sm mt-2">Consume MORE than you burn = stored as fat</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-xl border-2 border-blue-300 dark:border-blue-600 transform hover:scale-105 transition-all">
                      <div className="text-center">
                        <div className="text-3xl mb-2">📉</div>
                        <div className="font-bold text-blue-700 dark:text-blue-300">Calorie Deficit</div>
                        <div className="text-sm mt-2">Burn MORE than you consume = uses stored fat</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">How Many Calories Do You Burn Daily?</h2>
              <p>
                Your total daily energy expenditure (TDEE) consists of three main components:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Basal Metabolic Rate (BMR):</strong> 60-75% of total calories burned. This is the energy your body 
                  uses for basic functions while at rest—heart beating, breathing, cell production, and nutrient processing.
                </li>
                <li>
                  <strong>Thermic Effect of Food (TEF):</strong> 10% of total calories. This is the energy required to digest, 
                  absorb, and process nutrients from food.
                </li>
                <li>
                  <strong>Activity Energy Expenditure:</strong> 15-30% of total calories. This includes both structured exercise 
                  and non-exercise activity thermogenesis (NEAT)—all the movement you do throughout the day.
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Factors Affecting Calorie Burn</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">Body Weight and Composition</h3>
              <p>
                Heavier people burn more calories doing the same activity because they're moving more mass. A 200-pound person 
                will burn significantly more calories running a mile than a 130-pound person. Additionally, muscle tissue burns 
                more calories at rest than fat tissue, so people with higher muscle mass have higher metabolic rates.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Age</h3>
              <p>
                Metabolism gradually slows with age, primarily due to muscle loss and hormonal changes. On average, metabolic 
                rate decreases by 1-2% per decade after age 30. However, staying active and maintaining muscle mass can 
                significantly offset this decline.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Gender</h3>
              <p>
                Men typically have higher metabolic rates than women because they generally have more muscle mass and less body 
                fat. Hormonal differences also play a role. However, this is a general trend with significant individual variation.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Exercise Intensity</h3>
              <p>
                Higher intensity activities burn more calories per minute. Running burns more than walking, swimming laps burns 
                more than leisurely floating. The relationship isn't always linear though—extremely high intensity can't be 
                sustained as long as moderate intensity.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Genetics</h3>
              <p>
                Some people are genetically predisposed to faster or slower metabolisms. While you can't change your genes, 
                understanding this helps set realistic expectations and focus on what you can control.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Popular Foods and Their Calorie Content</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">Fast Food</h3>
              <p>
                Fast food is notoriously calorie-dense due to high fat and sugar content:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Big Mac: 563 calories</li>
                <li>Medium McDonald's Fries: 365 calories</li>
                <li>Large Pizza Slice: 285 calories</li>
                <li>Chipotle Burrito: 500-1,000+ calories (depending on fillings)</li>
                <li>KFC Chicken Breast (Original): 320 calories</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Snacks and Treats</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Standard Chocolate Bar: 235 calories</li>
                <li>Bag of Chips (1 oz): 150 calories</li>
                <li>Glazed Donut: 250 calories</li>
                <li>Cookies (3 medium): 150 calories</li>
                <li>Candy Bar (Snickers): 250 calories</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Beverages</h3>
              <p>
                Liquid calories are often forgotten but add up quickly:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Can of Soda (12 oz): 140 calories</li>
                <li>Starbucks Grande Frappuccino: 420 calories</li>
                <li>Orange Juice (12 oz): 165 calories</li>
                <li>Beer (12 oz): 150 calories</li>
                <li>Glass of Wine (5 oz): 125 calories</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Calories Burned by Different Activities</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">High-Intensity Activities (10+ cal/min)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Running (8 mph): 12-15 cal/min</li>
                <li>Jump Rope: 11-14 cal/min</li>
                <li>Swimming (vigorous): 10-13 cal/min</li>
                <li>Burpees: 10-12 cal/min</li>
                <li>Boxing: 10-12 cal/min</li>
                <li>Rowing (vigorous): 10-11 cal/min</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Moderate-Intensity Activities (5-10 cal/min)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cycling (moderate): 7-9 cal/min</li>
                <li>Basketball: 8-10 cal/min</li>
                <li>Soccer: 9-11 cal/min</li>
                <li>Tennis: 7-9 cal/min</li>
                <li>Dancing: 6-8 cal/min</li>
                <li>Hiking: 6-8 cal/min</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Low-Intensity Activities (3-5 cal/min)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Walking (brisk): 4-5 cal/min</li>
                <li>Weight Lifting: 4-6 cal/min</li>
                <li>Yoga: 3-4 cal/min</li>
                <li>Golf (walking): 4-5 cal/min</li>
                <li>Gardening: 3-5 cal/min</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">The Afterburn Effect (EPOC)</h2>
              <p>
                Excess Post-Exercise Oxygen Consumption (EPOC), commonly called the "afterburn effect," refers to the elevated 
                oxygen consumption and calorie burning that continues after exercise ends. High-intensity workouts, especially 
                interval training and heavy resistance training, create a significant afterburn effect that can last 24-48 hours.
              </p>
              <p>
                While the extra calories burned are often modest (50-200 calories), this effect means your workout continues 
                working for you long after you've hit the shower. This is one reason why intense, shorter workouts can be as 
                effective as longer, moderate-intensity sessions.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Practical Strategies for Burning More Calories</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">Increase Daily Movement (NEAT)</h3>
              <p>
                Non-exercise activity thermogenesis can account for hundreds of calories daily:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Take stairs instead of elevators</li>
                <li>Park farther away from destinations</li>
                <li>Stand or walk during phone calls</li>
                <li>Use a standing desk</li>
                <li>Do household chores actively</li>
                <li>Walk or bike for short errands instead of driving</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Build Muscle Through Strength Training</h3>
              <p>
                Every pound of muscle burns about 6-7 calories per day at rest, compared to 2-3 calories for fat. While this 
                might seem small, it adds up. Ten pounds of additional muscle burns an extra 40-50 calories daily—that's 
                14,600-18,250 calories per year, equivalent to 4-5 pounds of fat.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Try High-Intensity Interval Training (HIIT)</h3>
              <p>
                HIIT alternates short bursts of intense activity with recovery periods. This approach:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Burns more calories in less time</li>
                <li>Creates a significant afterburn effect</li>
                <li>Improves cardiovascular fitness efficiently</li>
                <li>Can be adapted to any fitness level</li>
                <li>Prevents workout boredom</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Stay Consistent</h3>
              <p>
                The best exercise for burning calories is the one you'll actually do consistently. A moderate workout you do 
                regularly beats an intense workout you rarely complete. Find activities you enjoy and make them habits.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">The Reality of "Burning Off" Foods</h2>
              <AdsterraSlot position="middle" className="my-6" />
              
              <p>
                While our calculator shows how long you'd need to exercise to burn specific foods, the reality is more complex. 
                Your body doesn't work in a vacuum—calories consumed and burned interact in sophisticated ways throughout the day.
              </p>
              <p>
                More importantly, focusing solely on "earning" food through exercise or "burning off" indulgences can create an 
                unhealthy relationship with food and fitness. Exercise should be about health, strength, mood, and longevity—not 
                punishment for eating.
              </p>
              <p>
                That said, understanding the energy content of foods and the effort required to burn those calories can help with 
                mindful eating decisions. It's eye-opening to realize a 420-calorie Frappuccino requires 40+ minutes of running 
                to burn off!
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">The Role of Diet vs. Exercise in Weight Management</h2>
              <p>
                There's a saying in fitness: "You can't out-exercise a bad diet." Research supports this—weight loss is typically 
                about 75% diet and 25% exercise. Why?
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>It's much easier to consume calories than burn them</li>
                <li>A Big Mac (563 calories) takes 5 minutes to eat but 55+ minutes of running to burn</li>
                <li>Exercise increases appetite, potentially leading to compensatory eating</li>
                <li>People often overestimate calories burned and underestimate calories consumed</li>
              </ul>
              <p>
                The most effective approach combines mindful eating with regular physical activity. Use exercise for health, 
                fitness, and mental wellbeing, while using nutrition for weight management.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Common Myths About Burning Calories</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">Myth: Spot Reduction Works</h3>
              <p>
                You cannot target fat loss in specific body areas through exercise. Doing crunches won't specifically burn belly 
                fat—your body decides where to lose fat based on genetics, hormones, and overall body composition. Focus on 
                overall fat loss through diet and full-body exercise.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Myth: Cardio Burns More Fat Than Strength Training</h3>
              <p>
                While cardio burns more calories during the workout, strength training builds muscle that increases your 
                metabolic rate 24/7. The best approach includes both cardio and resistance training for optimal body composition 
                and calorie burning.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Myth: You Must Exercise Fasted to Burn More Fat</h3>
              <p>
                While fasted exercise does burn a higher percentage of calories from fat, total calorie burn matters more for 
                weight loss. Many people perform better and burn more total calories when properly fueled. Do what works best 
                for your body and schedule.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Myth: More Sweat = More Calories Burned</h3>
              <p>
                Sweat indicates body temperature regulation, not calorie burn. You might sweat heavily in a hot yoga class but 
                burn fewer calories than a cool-weather run. Don't equate perspiration with effectiveness.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Creating a Sustainable Approach</h2>
              <p>
                The goal isn't to meticulously track every calorie in and out—that's exhausting and often counterproductive. 
                Instead, use this knowledge to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Make informed food choices</li>
                <li>Understand the energy cost of different activities</li>
                <li>Find enjoyable ways to stay active</li>
                <li>Develop a healthy relationship with food and exercise</li>
                <li>Focus on overall health rather than just numbers</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Frequently Asked Questions</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">How accurate are calorie burn calculators?</h3>
              <p>
                Calorie calculators provide estimates based on average values. Individual variation can be 20-30% above or below 
                these estimates due to genetics, fitness level, efficiency of movement, and other factors. Use them as general 
                guides, not absolute measurements.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Can I eat anything if I exercise enough?</h3>
              <p>
                While increasing exercise allows for more caloric intake, food quality matters for health beyond just calories. 
                Nutrient-dense foods provide vitamins, minerals, and other compounds essential for health that empty calories 
                don't offer. Balance treats with nutritious foods.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Why does the scale go up when I start exercising?</h3>
              <p>
                New exercise, especially strength training, causes temporary water retention for muscle repair. Your muscles also 
                store more glycogen (and associated water) when you exercise regularly. Don't panic—this is normal and temporary. 
                Focus on how you feel and how clothes fit rather than just scale weight.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">How long should I exercise daily?</h3>
              <p>
                Health guidelines recommend 150 minutes of moderate activity or 75 minutes of vigorous activity weekly, plus 
                strength training twice weekly. However, any movement is better than none. Start where you are and gradually 
                increase duration and intensity.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">How does the AI Camera Mode work?</h3>
              <p>
                Our mobile AI Camera Mode uses advanced computer vision technology to identify food items from photos. When you 
                take or upload a photo, it's compressed to under 500KB and sent to OpenAI's Vision API, which analyzes the image 
                and identifies the food with high accuracy. We then use the Nutritionix nutrition database to fetch precise calorie 
                information for that food item, which feeds into our MET-based burn time calculator. Your photos are processed 
                securely and never stored on our servers—privacy is our priority.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">What's the difference between desktop and mobile modes?</h3>
              <p>
                Desktop mode offers a traditional calculator experience with a dropdown menu of popular foods where you can manually 
                select items and see detailed burn time breakdowns. Mobile mode features our innovative AI Camera Mode, which lets 
                you simply snap a photo of your food for instant calorie and burn time analysis. Both modes use the same scientifically 
                accurate MET formula, but mobile mode provides a faster, more convenient experience when you're on the go.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Real-World Examples Using MET Calculations</h2>
              <p>
                Let's walk through some practical examples to show how MET values work in real scenarios:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Example 1: Burning Off a Big Mac (563 calories)</h3>
              <p>
                Sarah weighs 140 pounds and just enjoyed a Big Mac. Let's calculate how long she needs to run at 8 mph (9.8 METs) 
                to burn it off:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 space-y-2">
                <p className="font-mono text-sm">Weight in kg: 140 ÷ 2.2 = 63.6 kg</p>
                <p className="font-mono text-sm">Calories per minute: 9.8 × 3.5 × 63.6 ÷ 200 = 10.9 cal/min</p>
                <p className="font-mono text-sm">Burn time: 563 ÷ 10.9 = 51.7 minutes</p>
              </div>
              <p>
                Sarah needs to run for approximately 52 minutes. If she prefers brisk walking (3.8 METs), it would take 134 minutes 
                or about 2.2 hours.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Example 2: A Lighter Snack (Donut, 250 calories)</h3>
              <p>
                Mike weighs 180 pounds and had a donut. He wants to cycle it off at moderate intensity (7.5 METs):
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 space-y-2">
                <p className="font-mono text-sm">Weight in kg: 180 ÷ 2.2 = 81.8 kg</p>
                <p className="font-mono text-sm">Calories per minute: 7.5 × 3.5 × 81.8 ÷ 200 = 10.7 cal/min</p>
                <p className="font-mono text-sm">Burn time: 250 ÷ 10.7 = 23.4 minutes</p>
              </div>
              <p>
                Mike needs about 23 minutes of moderate cycling. Because he's heavier than Sarah, he burns more calories per minute 
                during the same activity.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Optimizing Your Calorie Burn Strategy</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">Interval Training for Maximum Efficiency</h3>
              <p>
                High-Intensity Interval Training (HIIT) combines short bursts of high-MET activities (10-12 METs) with recovery 
                periods. This approach can burn calories more efficiently than steady-state exercise and creates a significant 
                afterburn effect. A 20-minute HIIT session might be as effective as 45 minutes of moderate cardio.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Compound Movements Burn More</h3>
              <p>
                Activities that engage multiple muscle groups simultaneously have higher MET values. Burpees, rowing, swimming, 
                and running engage your entire body, resulting in higher calorie burn compared to isolated exercises like bicep curls.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Build Muscle to Increase Resting Metabolism</h3>
              <p>
                While strength training has a moderate MET value (5.0), it builds muscle that burns more calories 24/7. Each pound 
                of muscle burns about 6 calories per day at rest, compared to 2 calories for fat. Over time, increased muscle mass 
                significantly boosts your total daily energy expenditure.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Mobile AI Technology: The Future of Calorie Tracking</h2>
              <p>
                Traditional calorie tracking requires manual database searches and portion estimation, which can be time-consuming 
                and inaccurate. Our AI Camera Mode represents the future of nutrition tracking—simply point your camera and get 
                instant, personalized results.
              </p>
              <p>
                The technology combines computer vision (identifying what food you're eating), nutrition databases (finding accurate 
                calorie data), and exercise science (calculating burn times using MET values). This integration makes calorie awareness 
                more accessible and practical for everyday use.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Privacy and Security</h2>
              <p>
                We understand that food photos can be personal. That's why our AI Camera Mode processes images in real-time and 
                never stores them. Your photos are compressed, analyzed, and immediately discarded. We only save your calculated 
                results locally in your browser's cache (last 5 searches) for your convenience—no server-side storage of personal 
                data.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
              <p>
                Understanding calorie burn helps create awareness about energy balance, but shouldn't become an obsession. The 
                best approach to health combines enjoyable physical activity with nutritious eating, adequate sleep, stress 
                management, and self-compassion.
              </p>
              <p>
                Use tools like this calculator for fun, education, and occasional reality checks—not as a rigid system for 
                controlling every calorie. Your body is remarkably intelligent at regulating energy when you listen to hunger 
                cues, eat mindfully, and move regularly.
              </p>
              <p>
                Remember: fitness is a journey, not a destination. Focus on building sustainable habits that enhance your life 
                rather than restrict it. Enjoy your favorite foods in moderation, find activities you love, and celebrate what 
                your amazing body can do!
              </p>
            </CardContent>
          </Card>


        </div>
      </div>
    </>
  );
}
