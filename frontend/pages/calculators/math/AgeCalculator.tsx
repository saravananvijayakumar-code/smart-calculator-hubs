import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Cake, PartyPopper, Sparkles, Heart, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours?: number;
  totalMinutes?: number;
  nextBirthday: string;
  daysUntilBirthday: number;
  weeksUntilBirthday?: number;
  birthDayOfWeek?: string;
  birthdaysPassed?: number;
  isValid: boolean;
}

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (!targetDate) {
      const today = new Date().toISOString().split('T')[0];
      setTargetDate(today);
    }
  }, []);

  useEffect(() => {
    if (!birthDate || !targetDate) {
      setResult(null);
      setShowAnimation(false);
      return;
    }

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (birth > target) {
      setResult(null);
      setShowAnimation(false);
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= target) {
      nextBirthday.setFullYear(target.getFullYear() + 1);
    }
    
    const daysUntilBirthday = Math.floor((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      nextBirthday: nextBirthday.toLocaleDateString(),
      daysUntilBirthday,
      isValid: true
    });
    
    setShowAnimation(true);
  }, [birthDate, targetDate]);

  const tips = [
    "Use this calculator to find your exact age for official documents",
    "Calculate age differences between family members",
    "Find out exactly how many days you've been alive",
    "Useful for planning milestone birthdays and anniversaries",
    "Can calculate age for any date in the past or future"
  ];

  const getAgeStage = (years: number) => {
    if (years < 1) return { stage: 'Infant', emoji: '👶', color: 'text-pink-600' };
    if (years < 4) return { stage: 'Toddler', emoji: '🧸', color: 'text-orange-600' };
    if (years < 12) return { stage: 'Child', emoji: '🎈', color: 'text-yellow-600' };
    if (years < 18) return { stage: 'Teenager', emoji: '🎮', color: 'text-green-600' };
    if (years < 30) return { stage: 'Young Adult', emoji: '🚀', color: 'text-blue-600' };
    if (years < 60) return { stage: 'Adult', emoji: '💼', color: 'text-purple-600' };
    return { stage: 'Senior', emoji: '🎖️', color: 'text-indigo-600' };
  };

  return (
    <CalculatorLayoutWithAds
      title="Age Calculator 🎂 - Calculate Your Exact Age in Years, Months & Days"
      description="Calculate your precise age in years, months, days, weeks, hours, and more! Find out when your next birthday is, how many days you've lived, and discover fun milestones."
      keywords="age calculator, calculate age, birthday calculator, days until birthday, age in days, exact age calculator, how old am I"
      tips={tips}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3 animate-fade-in">
            <Cake className="w-10 h-10 text-pink-600 animate-bounce" />
            Age Calculator 🎂
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover your exact age down to the second! Calculate milestones, countdown to birthdays, and explore fun facts about your time on Earth.
          </p>
        </div>

        <Card className="shadow-xl border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <Calendar className="h-6 w-6" />
              <span>Enter Your Dates</span>
            </CardTitle>
            <CardDescription className="text-blue-100">
              Enter your birth date and optionally a target date to calculate age
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-lg font-semibold">🎂 Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="h-12 text-lg border-2 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetDate" className="text-lg font-semibold">📅 Target Date (default: today)</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="h-12 text-lg border-2 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {result && result.isValid && (
          <div className={`space-y-6 transition-all duration-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <AIAnalysis
              analysisRequest={{
                calculatorType: "age-calculator",
                data: {
                  birthDate: new Date(birthDate),
                  currentAge: { years: result.years, months: result.months, days: result.days },
                  nextBirthday: new Date(result.nextBirthday || birthDate),
                  daysUntilBirthday: result.daysUntilBirthday,
                  lifeMilestones: [
                    `Lived ${result.totalDays.toLocaleString()} days`,
                    `Next birthday in ${result.daysUntilBirthday} days`,
                    `Total weeks: ${result.totalWeeks.toLocaleString()}`,
                    `Total months: ${result.totalMonths.toLocaleString()}`
                  ]
                }
              }}
              autoRun={true}
              title="AI Age Analysis 🤖"
              description="Get insights about your age milestones, life phases, and interesting facts about your time on Earth."
            />

            <ExportShareButtons
              calculatorType="age-calculator"
              inputs={{
                birthDate,
                targetDate
              }}
              results={{
                years: result.years,
                months: result.months,
                days: result.days,
                totalDays: result.totalDays,
                daysUntilBirthday: result.daysUntilBirthday
              }}
              title="Age Calculator Report"
            />
            
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="text-6xl animate-bounce">{getAgeStage(result.years).emoji}</span>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">You are a</p>
                      <Badge className={`text-2xl px-6 py-2 ${getAgeStage(result.years).color} bg-white dark:bg-gray-800`}>
                        {getAgeStage(result.years).stage}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-pulse">
                    {result.years} years, {result.months} months, {result.days} days
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    As of {new Date(targetDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="relative overflow-hidden p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-400 opacity-10 rounded-full -mr-10 -mt-10"></div>
                    <Zap className="w-8 h-8 text-pink-600 mb-2" />
                    <p className="text-3xl font-bold text-pink-600">{result.years}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Years Old</p>
                  </div>

                  <div className="relative overflow-hidden p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-10 rounded-full -mr-10 -mt-10"></div>
                    <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-3xl font-bold text-blue-600">{result.totalMonths}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Months</p>
                  </div>

                  <div className="relative overflow-hidden p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-400 opacity-10 rounded-full -mr-10 -mt-10"></div>
                    <Clock className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="text-3xl font-bold text-purple-600">{result.totalWeeks.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Weeks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="transform hover:scale-105 transition-all hover:shadow-xl">
                <CardHeader className="pb-3 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-t-lg">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Days Lived
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-3xl font-bold text-green-600">
                    {result.totalDays.toLocaleString()}
                  </div>
                  <Progress value={(result.totalDays % 365) / 365 * 100} className="mt-2 h-2" />
                  <p className="text-xs text-gray-500 mt-2">That's a lot of sunrises! 🌅</p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all hover:shadow-xl">
                <CardHeader className="pb-3 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-t-lg">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Heartbeats
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(result.totalDays * 24 * 60 * 70).toLocaleString()}
                  </div>
                  <Progress value={70} className="mt-2 h-2" />
                  <p className="text-xs text-gray-500 mt-2">Your heart is amazing! 💓</p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all hover:shadow-xl">
                <CardHeader className="pb-3 bg-gradient-to-br from-purple-400 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <PartyPopper className="w-4 h-4" />
                    Next Birthday
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {result.daysUntilBirthday} days
                  </div>
                  <Progress value={(365 - result.daysUntilBirthday) / 365 * 100} className="mt-2 h-2" />
                  <p className="text-xs text-gray-500 mt-2">{result.nextBirthday}</p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all hover:shadow-xl">
                <CardHeader className="pb-3 bg-gradient-to-br from-blue-400 to-cyan-500 text-white rounded-t-lg">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Life Stage
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {getAgeStage(result.years).stage}
                  </div>
                  <div className="text-4xl mt-2">{getAgeStage(result.years).emoji}</div>
                  <p className="text-xs text-gray-500 mt-2">Embrace every moment! ✨</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Fun Age Facts & Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      Time You've Experienced:
                    </h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <span>⏰ Hours:</span>
                        <strong>{Math.round(result.totalDays * 24).toLocaleString()}</strong>
                      </li>
                      <li className="flex justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <span>⏱️ Minutes:</span>
                        <strong>{Math.round(result.totalDays * 24 * 60).toLocaleString()}</strong>
                      </li>
                      <li className="flex justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <span>🥱 Breaths (approx):</span>
                        <strong>{Math.round(result.totalDays * 24 * 60 * 16).toLocaleString()}</strong>
                      </li>
                      <li className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <span>😴 Hours of sleep (if 8h/day):</span>
                        <strong>{Math.round(result.totalDays * 8).toLocaleString()}</strong>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-green-600" />
                      Milestone Achievements:
                    </h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2 p-2 bg-pink-50 dark:bg-pink-900/20 rounded">
                        <span>{result.totalDays >= 10000 ? '✅' : '⏳'}</span>
                        <span>10,000 days old {result.totalDays < 10000 ? `(in ${10000 - result.totalDays} days)` : '🎉'}</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <span>{result.totalWeeks >= 1000 ? '✅' : '⏳'}</span>
                        <span>1,000 weeks old {result.totalWeeks < 1000 ? `(in ${1000 - result.totalWeeks} weeks)` : '🎊'}</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                        <span>{result.totalMonths >= 500 ? '✅' : '⏳'}</span>
                        <span>500 months old {result.totalMonths < 500 ? `(in ${500 - result.totalMonths} months)` : '🥳'}</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded">
                        <span>{result.years >= 100 ? '✅' : '⏳'}</span>
                        <span>Century club {result.years < 100 ? `(${100 - result.years} years to go!)` : '🏆'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">📖 The Complete Guide to Age Calculation & Life Milestones</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none dark:prose-invert p-8">
            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  What is Age and Why Calculate It?
                </h2>
                <p className="text-lg leading-relaxed">
                  Age is more than just a number—it's a celebration of every sunrise you've witnessed, every challenge you've overcome, and every moment you've experienced. From the day you were born, time has been your constant companion, marking your journey through life's incredible adventure. But have you ever stopped to think about the fascinating mathematics behind age calculation?
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  Our Age Calculator doesn't just tell you how old you are; it unveils the incredible story of your life in numbers. Whether you're counting down to a milestone birthday, calculating age differences for legal documents, or simply curious about how many heartbeats you've experienced, understanding your precise age opens up a world of interesting insights and perspective on your life's journey.
                </p>
              </section>

              <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Clock className="w-8 h-8 text-purple-600" />
                  The Science Behind Age Calculation
                </h2>
                <p className="text-lg leading-relaxed">
                  Calculating age might seem straightforward—just subtract your birth year from the current year, right? Not quite! Accurate age calculation is actually a fascinating dance with time that accounts for months, days, and even leap years. Our calculator uses sophisticated algorithms to give you precision down to the day, accounting for all those tricky calendar quirks that make time measurement so interesting.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  The Gregorian calendar, which most of the world uses today, has some interesting mathematical properties. Years divisible by 4 are leap years (except those divisible by 100, unless they're also divisible by 400). This means that 2000 was a leap year, but 1900 wasn't! Our calculator handles all these complexities automatically, ensuring you get the most accurate age calculation possible. It's like having a mini time-travel mathematician in your pocket!
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🎂 Understanding Different Life Stages</h2>
                <p className="text-lg leading-relaxed mb-6">
                  As we journey through life, we pass through distinct stages, each with its own joys, challenges, and developmental milestones. Understanding these stages helps us appreciate where we are and where we're headed:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-xl border-l-4 border-pink-500">
                    <h3 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-3 flex items-center gap-2">
                      <span className="text-3xl">👶</span>
                      Infant (0-1 year)
                    </h3>
                    <p>The most rapid growth period of your entire life! Infants triple their birth weight and develop at an astonishing pace. Every day brings new discoveries—from first smiles to first words. This is when the foundation of all future development is laid.</p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border-l-4 border-orange-500">
                    <h3 className="text-xl font-bold text-orange-700 dark:text-orange-300 mb-3 flex items-center gap-2">
                      <span className="text-3xl">🧸</span>
                      Toddler (1-4 years)
                    </h3>
                    <p>The age of exploration and "why?" questions! Toddlers develop language, motor skills, and independence at lightning speed. Their curiosity is endless, and their energy seems infinite. This is when personality really starts to shine through.</p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border-l-4 border-yellow-500">
                    <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-300 mb-3 flex items-center gap-2">
                      <span className="text-3xl">🎈</span>
                      Child (4-12 years)
                    </h3>
                    <p>The golden age of learning and play! Children absorb knowledge like sponges, develop friendships, and discover their interests. From learning to read to mastering multiplication tables, these years build the intellectual foundation for life.</p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border-l-4 border-green-500">
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                      <span className="text-3xl">🎮</span>
                      Teenager (12-18 years)
                    </h3>
                    <p>The transformation years! Teens navigate physical, emotional, and social changes while developing their identity. It's a time of self-discovery, independence-seeking, and preparation for adulthood. Friendships deepen, and life goals start to take shape.</p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500">
                    <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                      <span className="text-3xl">🚀</span>
                      Young Adult (18-30 years)
                    </h3>
                    <p>The launch pad years! Young adults explore careers, relationships, and life paths. It's a time of freedom, experimentation, and establishing independence. Many make major life decisions—education, career, partnerships—that shape their future trajectory.</p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border-l-4 border-purple-500">
                    <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
                      <span className="text-3xl">💼</span>
                      Adult (30-60 years)
                    </h3>
                    <p>The peak performance years! Adults typically hit their stride in careers, raise families, and build wealth and stability. Wisdom from experience combines with energy and capability. It's often the most productive and influential period of life.</p>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border-l-4 border-indigo-500">
                    <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
                      <span className="text-3xl">🎖️</span>
                      Senior (60+ years)
                    </h3>
                    <p>The wisdom years! Seniors often report the highest life satisfaction, freed from many earlier pressures. It's a time for reflection, legacy-building, and often renewed creativity. Modern 60+ adults are more active and engaged than any previous generation!</p>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🌟 Fascinating Age Milestones</h2>
                <p className="text-lg leading-relaxed mb-4">
                  Life is full of meaningful milestones that mark our journey. Here are some fascinating age markers and what they represent:
                </p>

                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-lg text-green-600 mb-2">🎯 10,000 Days (27.4 years)</h4>
                    <p>You've lived through ten thousand sunrises and sunsets! This milestone represents over a decade of adulthood and countless experiences. Many people celebrate this unique "10K day" as a reminder to appreciate life's journey.</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-lg text-blue-600 mb-2">⏰ 1,000 Weeks (19.2 years)</h4>
                    <p>A thousand weeks of life experiences! Visualizing your life in weeks puts everything in perspective. With an average lifespan of about 4,000 weeks, each one becomes more precious when you see the bigger picture.</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-lg text-purple-600 mb-2">🎊 1,000,000 Minutes (1.9 years)</h4>
                    <p>Your first million minutes! It happens faster than you'd think—before age 2. It's a reminder that time is our most valuable currency, and we're constantly spending it, minute by minute.</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-lg text-orange-600 mb-2">💝 Your Golden Birthday</h4>
                    <p>The day when your age matches the day you were born (e.g., turning 15 on the 15th). It only happens once in a lifetime, making it extra special. Some cultures consider this particularly lucky!</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-lg text-pink-600 mb-2">🏆 Century Mark (100 years)</h4>
                    <p>Reaching 100 is an extraordinary achievement! Centenarians have witnessed over a century of human history, technological revolutions, and countless global changes. They're living history books!</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">💓 Your Body's Amazing Timeline</h2>
                <p className="text-lg leading-relaxed mb-4">
                  While you're counting years, your body is performing millions of incredible processes every single day. Let's put your age into perspective with some mind-blowing biological facts:
                </p>

                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl mb-4">
                  <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-3">❤️ Your Heart's Journey</h3>
                  <p className="mb-2">Your heart beats approximately 100,000 times per day. That means:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>At 1 year old: Your heart has beaten about 36.5 million times</li>
                    <li>At 20 years old: Over 730 million heartbeats</li>
                    <li>At 50 years old: Nearly 2 billion heartbeats!</li>
                    <li>At 80 years old: An astounding 3+ billion heartbeats</li>
                  </ul>
                  <p className="mt-3 italic">Your heart is incredibly hardworking, never taking a vacation, pumping about 2,000 gallons of blood daily!</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-4">
                  <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-3">🫁 Breathing Life</h3>
                  <p className="mb-2">You take approximately 20,000 breaths per day. Over your lifetime:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>By age 10: About 73 million breaths</li>
                    <li>By age 30: Over 219 million breaths</li>
                    <li>By age 70: Nearly 511 million breaths!</li>
                  </ul>
                  <p className="mt-3 italic">Each breath is a gift, bringing fresh oxygen to every cell in your body!</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">🧠 Brain Power</h3>
                  <p className="mb-2">Your brain processes thousands of thoughts daily and never stops learning:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>By age 7: Your brain has reached 95% of adult size</li>
                    <li>By age 25: Your prefrontal cortex is fully developed</li>
                    <li>Throughout life: Your brain can form new neural connections (neuroplasticity)</li>
                    <li>Older adults: Can have vocabulary and wisdom that younger people can't match</li>
                  </ul>
                  <p className="mt-3 italic">Age brings wisdom—literally! Your brain accumulates knowledge and pattern recognition with every passing year.</p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🎉 Celebrating Birthdays Around the World</h2>
                <p className="text-lg leading-relaxed mb-4">
                  Different cultures celebrate birthdays in fascinating ways. Your age and birthday aren't just numbers—they're opportunities for celebration, reflection, and cultural traditions:
                </p>

                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-orange-600">🎂 Western Traditions</h4>
                    <p>Birthday cakes with candles (one for each year plus one for good luck), birthday songs, and parties with friends and family. Sweet 16, 21st, 30th, 40th, and 50th birthdays are often celebrated with special significance.</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-red-600">🏮 Chinese Traditions</h4>
                    <p>Eating longevity noodles (the longer, the better—never cut them!), red eggs for babies' first month, and big celebrations for 60th and 80th birthdays. Age 60 marks the completion of one zodiac cycle, making it extra special.</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-green-600">🌺 Hawaiian Traditions</h4>
                    <p>Lei giving and makahiki celebrations. The first birthday (baby's luau) is particularly special, with traditional foods and family gatherings celebrating the child's first year of life.</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-600">🇲🇽 Mexican Traditions</h4>
                    <p>Quinceañera at 15 marks a girl's transition to womanhood. Piñatas, mariachi music, and pan dulce (sweet bread) make celebrations festive. Las mañanitas birthday song is sung with great joy.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🤔 Frequently Asked Questions About Age</h2>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Why does age matter for official documents?</h3>
                    <p>Age determines legal rights and responsibilities—voting age, driving age, drinking age, retirement age, and eligibility for various programs. Accurate age calculation ensures compliance with legal requirements and access to age-appropriate services and benefits.</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Does everyone age at the same rate biologically?</h3>
                    <p>No! While chronological age (time since birth) is universal, biological age varies based on genetics, lifestyle, stress, diet, exercise, and environmental factors. Some 60-year-olds have the biological markers of 40-year-olds, while some 40-year-olds show markers of 60-year-olds. Healthy habits can slow biological aging!</p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Why do we feel like time speeds up as we age?</h3>
                    <p>This is a real psychological phenomenon! When you're 5, one year is 20% of your life. When you're 50, one year is only 2% of your life. Additionally, novel experiences make time feel slower, and as we age, we have fewer "firsts." Trying new things can help slow down perceived time!</p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">What's the oldest verified human age?</h3>
                    <p>Jeanne Calment of France lived to 122 years and 164 days (1875-1997), the longest verified human lifespan ever recorded. She witnessed the Eiffel Tower's construction, both World Wars, the invention of television, computers, and the moon landing. What an incredible journey through history!</p>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-4 py-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Do leap year babies age differently?</h3>
                    <p>People born on February 29th (leap day) age just like everyone else biologically! They typically celebrate birthdays on February 28th or March 1st in non-leap years. Technically, they only have an actual birthday every 4 years, which some find fun to joke about—imagine being "8 years old" when you're really 32!</p>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-6 rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">💪 Making the Most of Every Age</h2>
                <p className="text-lg leading-relaxed mb-4">
                  Every age is a gift with its own unique opportunities. Here's how to embrace and maximize each stage:
                </p>

                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-pink-600 mb-2">🌟 Stay Curious</h4>
                    <p>Never stop learning! Whether you're 8 or 80, curiosity keeps your mind sharp and life interesting. Try new hobbies, learn new skills, ask questions, and explore the world around you.</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-600 mb-2">❤️ Nurture Relationships</h4>
                    <p>Strong relationships are the best predictor of happiness at every age. Invest time in family and friends, make new connections, and maintain meaningful bonds throughout your life.</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-green-600 mb-2">🏃 Stay Active</h4>
                    <p>Physical activity isn't just for the young! Movement keeps your body strong, mind sharp, and mood elevated at any age. Find activities you enjoy and make them part of your routine.</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-600 mb-2">🎯 Set Goals</h4>
                    <p>It's never too early or too late to dream big! Having goals gives life direction and purpose. Whether it's learning a language, running a marathon, or writing a book, pursue what excites you.</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-orange-600 mb-2">🙏 Practice Gratitude</h4>
                    <p>Each day, each birthday, each milestone is a gift. Taking time to appreciate what you have and how far you've come increases happiness and life satisfaction at every age.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                  Final Thoughts: Celebrate Every Moment
                </h2>
                <p className="text-lg leading-relaxed">
                  Age is more than a mathematical calculation—it's a testament to your resilience, growth, and the countless moments that make up your unique story. Whether you're 7 or 77, every single day adds to the rich tapestry of your life experience. Your age represents every laugh you've shared, every challenge you've overcome, every person you've touched, and every dream you've pursued.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  So use this calculator not just to count your years, but to celebrate them! Whether you're planning a milestone birthday, calculating age for official documents, or simply curious about your time on this beautiful planet, remember that every single day you've lived is special. Here's to making the most of every moment, at every age! 🎉✨
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}

import { Trophy } from 'lucide-react';
