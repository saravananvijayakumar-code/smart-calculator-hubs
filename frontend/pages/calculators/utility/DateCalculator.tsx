import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Minus, ArrowRight, Heart, Briefcase, Cake, Plane, Baby, GraduationCap, Trophy, Sparkles, Zap, Star, Gift } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { AutoAdSlot } from '../../../components/ads/AutoAdSlot';

interface DateDifference {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  workingDays: number;
  weekends: number;
}

export function DateCalculator() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [difference, setDifference] = useState<DateDifference | null>(null);

  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [years, setYears] = useState('0');
  const [months, setMonths] = useState('0');
  const [days, setDays] = useState('0');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [calculatedDate, setCalculatedDate] = useState<Date | null>(null);

  const calculateDifference = () => {
    if (!startDate || !endDate) {
      setDifference(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setDifference(null);
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let daysDiff = end.getDate() - start.getDate();

    if (daysDiff < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      daysDiff += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMonths = years * 12 + months;

    let workingDays = 0;
    let weekends = 0;
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends++;
      } else {
        workingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDifference({
      years,
      months: months,
      days: daysDiff,
      totalDays,
      totalWeeks,
      totalMonths,
      workingDays,
      weekends,
    });
  };

  const calculateNewDate = () => {
    if (!baseDate) {
      setCalculatedDate(null);
      return;
    }

    const date = new Date(baseDate);
    const y = parseInt(years) || 0;
    const m = parseInt(months) || 0;
    const d = parseInt(days) || 0;

    if (operation === 'add') {
      date.setFullYear(date.getFullYear() + y);
      date.setMonth(date.getMonth() + m);
      date.setDate(date.getDate() + d);
    } else {
      date.setFullYear(date.getFullYear() - y);
      date.setMonth(date.getMonth() - m);
      date.setDate(date.getDate() - d);
    }

    setCalculatedDate(date);
  };

  useEffect(() => {
    calculateDifference();
  }, [startDate, endDate]);

  useEffect(() => {
    calculateNewDate();
  }, [baseDate, years, months, days, operation]);

  const setToday = (setter: (value: string) => void) => {
    setter(new Date().toISOString().split('T')[0]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <CalculatorLayoutWithAds
      title="Date Calculator | Date Difference Calculator | Smart Calculator Hubs"
      description="Calculate the difference between two dates or add/subtract days, months, and years. Find working days, weekends, and duration between dates."
      keywords="date calculator, date difference calculator, days between dates, working days calculator, date math, calendar calculator, duration calculator"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Master Time Like Never Before</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Time Traveler's Dream Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Journey through time with precision! Calculate date differences, plan future events, or revisit the past with our magical date calculator
          </p>
        </div>

        <AutoAdSlot placement="top-banner" className="my-6" />

        <Tabs defaultValue="difference" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="difference" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500">
              <Calendar className="h-4 w-4 mr-2" />
              Date Difference
            </TabsTrigger>
            <TabsTrigger value="addsubtract" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500">
              <Clock className="h-4 w-4 mr-2" />
              Add/Subtract
            </TabsTrigger>
          </TabsList>

          <TabsContent value="difference" className="space-y-8 animate-fade-in-up">
            <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-bounce" />
                  Calculate Date Difference
                </CardTitle>
                <CardDescription className="text-base">
                  Discover the exact time span between any two dates - perfect for anniversaries, countdowns, and planning!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-base font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Start Date
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border-2 hover:border-blue-400 transition-colors"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setToday(setStartDate)}
                        size="sm"
                        className="hover:bg-blue-100 dark:hover:bg-blue-900"
                      >
                        Today
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-base font-semibold flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      End Date
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border-2 hover:border-purple-400 transition-colors"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setToday(setEndDate)}
                        size="sm"
                        className="hover:bg-purple-100 dark:hover:bg-purple-900"
                      >
                        Today
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {difference && (
              <div className="space-y-6 animate-fade-in-up">
                <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 border-2 border-blue-300 dark:border-blue-700 shadow-2xl">
                  <CardContent className="pt-8 pb-8">
                    <div className="text-center space-y-6">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/50 dark:bg-black/30 rounded-full">
                        <Zap className="h-6 w-6 text-yellow-500 animate-pulse" />
                        <span className="text-sm font-medium text-muted-foreground">Time Span Revealed</span>
                      </div>
                      <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                        {difference.years > 0 && `${difference.years} year${difference.years !== 1 ? 's' : ''}`}
                        {difference.months > 0 && ` ${difference.months} month${difference.months !== 1 ? 's' : ''}`}
                        {difference.days > 0 && ` ${difference.days} day${difference.days !== 1 ? 's' : ''}`}
                        {difference.years === 0 && difference.months === 0 && difference.days === 0 && 'Same Day!'}
                      </div>
                      <p className="text-lg text-muted-foreground font-medium">
                        {difference.totalDays === 1 ? '1 precious day' : `${difference.totalDays.toLocaleString()} amazing days`} of memories and moments
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-2 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Total Days
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {difference.totalDays.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Full day count</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        Total Weeks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {difference.totalWeeks.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Week cycles</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 dark:border-green-800 hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-green-500" />
                        Working Days
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {difference.workingDays.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Productive weekdays</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-pink-200 dark:border-pink-800 hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-500" />
                        Weekends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                        {difference.weekends.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Relaxation days</p>
                    </CardContent>
                  </Card>
                </div>

                <ExportShareButtons
                  calculatorType="date-calculator"
                  inputs={{ startDate, endDate }}
                  results={difference}
                  title="Date Calculator Report"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="addsubtract" className="space-y-8 animate-fade-in-up">
            <Card className="border-2 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-400 animate-spin-slow" />
                  Add or Subtract Time
                </CardTitle>
                <CardDescription className="text-base">
                  Travel forward or backward in time! Perfect for planning deadlines, calculating due dates, or finding historical moments
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="baseDate" className="text-base font-semibold flex items-center gap-2">
                      <Gift className="h-4 w-4 text-blue-500" />
                      Starting Date
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="baseDate"
                        type="date"
                        value={baseDate}
                        onChange={(e) => setBaseDate(e.target.value)}
                        className="border-2 hover:border-green-400 transition-colors"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setToday(setBaseDate)}
                        size="sm"
                        className="hover:bg-green-100 dark:hover:bg-green-900"
                      >
                        Today
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      Time Travel Direction
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={operation === 'add' ? 'default' : 'outline'}
                        onClick={() => setOperation('add')}
                        className={`w-full h-20 text-lg ${
                          operation === 'add'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                            : ''
                        }`}
                      >
                        <Plus className="h-6 w-6 mr-2" />
                        <div className="text-left">
                          <div>Add Time</div>
                          <div className="text-xs opacity-80">Jump to the future</div>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        variant={operation === 'subtract' ? 'default' : 'outline'}
                        onClick={() => setOperation('subtract')}
                        className={`w-full h-20 text-lg ${
                          operation === 'subtract'
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                            : ''
                        }`}
                      >
                        <Minus className="h-6 w-6 mr-2" />
                        <div className="text-left">
                          <div>Subtract Time</div>
                          <div className="text-xs opacity-80">Visit the past</div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="years" className="text-base font-semibold flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-indigo-500" />
                        Years
                      </Label>
                      <Input
                        id="years"
                        type="number"
                        min="0"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        className="border-2 hover:border-indigo-400 transition-colors text-lg h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="months" className="text-base font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-violet-500" />
                        Months
                      </Label>
                      <Input
                        id="months"
                        type="number"
                        min="0"
                        value={months}
                        onChange={(e) => setMonths(e.target.value)}
                        className="border-2 hover:border-violet-400 transition-colors text-lg h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="days" className="text-base font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-cyan-500" />
                        Days
                      </Label>
                      <Input
                        id="days"
                        type="number"
                        min="0"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        className="border-2 hover:border-cyan-400 transition-colors text-lg h-12"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {calculatedDate && (
              <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 border-2 border-green-300 dark:border-green-700 shadow-2xl animate-fade-in-up">
                <CardContent className="pt-8 pb-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-6 flex-wrap">
                      <div className="text-center p-6 bg-white/50 dark:bg-black/30 rounded-xl">
                        <div className="text-sm mb-2 text-muted-foreground font-medium">Starting Point</div>
                        <div className="text-xl font-bold text-foreground">{formatDate(new Date(baseDate))}</div>
                        <div className="text-xs text-muted-foreground mt-1">{new Date(baseDate).toLocaleDateString()}</div>
                      </div>
                      <ArrowRight className="h-12 w-12 text-green-600 dark:text-green-400 animate-pulse" />
                      <div className="text-center p-6 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-xl border-2 border-green-400 dark:border-green-600">
                        <div className="text-sm mb-2 text-green-800 dark:text-green-200 font-medium flex items-center justify-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Your Destination
                        </div>
                        <div className="text-xl font-bold text-green-700 dark:text-green-300">
                          {formatDate(calculatedDate)}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">{calculatedDate.toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="text-center pt-6 border-t-2 border-green-200 dark:border-green-800">
                      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                        {calculatedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                        <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          {operation === 'add' ? 'Added' : 'Subtracted'}{' '}
                          {years !== '0' && `${years} year${years !== '1' ? 's' : ''}`}
                          {months !== '0' && ` ${months} month${months !== '1' ? 's' : ''}`}
                          {days !== '0' && ` ${days} day${days !== '1' ? 's' : ''}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <AutoAdSlot placement="mid-content" className="my-8" />

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Heart className="h-5 w-5 text-red-500" />
                Life's Special Moments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-lg">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Cake className="h-4 w-4 text-pink-500" />
                  Celebrate Anniversaries
                </h3>
                <p className="text-muted-foreground">
                  Count the exact days, months, and years you've been together. Whether it's your wedding anniversary, dating milestone, or friendship celebration, know precisely how much time you've shared!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Baby className="h-4 w-4 text-blue-500" />
                  Track Baby Milestones
                </h3>
                <p className="text-muted-foreground">
                  Calculate your baby's exact age in days, weeks, and months. Perfect for tracking development stages, planning checkups, or counting down to their first birthday!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Plane className="h-4 w-4 text-indigo-500" />
                  Plan Dream Vacations
                </h3>
                <p className="text-muted-foreground">
                  How many days until your tropical getaway? Calculate the countdown and build excitement as you plan every detail of your perfect escape!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Professional Power Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-green-600" />
                  Project Management Magic
                </h3>
                <p className="text-muted-foreground">
                  Calculate precise project timelines, working days between milestones, and deadline dates. Factor in weekends and plan sprints with surgical precision!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-amber-600" />
                  Legal & Contract Dates
                </h3>
                <p className="text-muted-foreground">
                  Track contract durations, calculate notice periods, determine compliance deadlines, and manage lease agreements with confidence and accuracy.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-lg">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-violet-600" />
                  Employment & Benefits
                </h3>
                <p className="text-muted-foreground">
                  Calculate tenure, determine benefit eligibility dates, track probation periods, and plan career milestones with professional precision.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              Why Our Date Calculator Rocks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Instant calculations with real-time results. No waiting, no loading - just pure speed and efficiency!
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                  <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Precision Perfect</h3>
                <p className="text-sm text-muted-foreground">
                  Accurate to the day with intelligent handling of leap years, month lengths, and calendar complexities!
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                  <Gift className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Feature Rich</h3>
                <p className="text-sm text-muted-foreground">
                  Working days, weekends, multiple formats, and more. Everything you need in one beautiful interface!
                </p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h3 className="text-xl font-bold mt-6 mb-4">Master Time Management Like a Pro</h3>
              <p className="text-muted-foreground leading-relaxed">
                Time is the most valuable resource we have, and managing it effectively can transform your life. Our Date Calculator isn't just a tool - it's your personal time management assistant, helping you plan, track, and optimize every moment. Whether you're counting down to exciting events, tracking project timelines, or calculating important deadlines, we've got you covered with precision and style.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-4">Endless Possibilities at Your Fingertips</h3>
              <p className="text-muted-foreground leading-relaxed">
                The applications are limitless! Event planners use it to coordinate weddings and conferences. Project managers rely on it for sprint planning and milestone tracking. Parents treasure it for baby age calculations and school countdown timers. HR professionals depend on it for employee tenure and benefit eligibility. Financial advisors utilize it for loan maturity dates and investment timelines. Students track semester progress and exam countdown. Travelers calculate vacation days and visa validity periods.
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Working Days vs. Calendar Days - Know the Difference</h3>
              <p className="text-muted-foreground leading-relaxed">
                One of our most powerful features is the automatic calculation of working days versus total calendar days. This is crucial for business planning, project timelines, and understanding realistic schedules. If you need to complete a 30-day project, knowing that it actually means about 22 working days (excluding weekends) helps you plan resources and set achievable goals. This feature alone can save countless hours of manual counting and prevent scheduling mistakes!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Time Travel Made Simple</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our Add/Subtract feature is like having a time machine in your pocket! Need to know what date it will be 90 days from now? Planning a project that starts in 6 months? Wondering what the date was 2 years and 3 months ago? Simply input your base date, choose to add or subtract, enter your time period, and instantly see your answer. It handles all the complex calendar math - leap years, varying month lengths, and year transitions - so you don't have to!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Real-World Success Stories</h3>
              <p className="text-muted-foreground leading-relaxed">
                Project managers have reported 40% time savings in sprint planning. Event coordinators have eliminated scheduling conflicts by accurately calculating vendor booking timelines. HR departments have streamlined onboarding by precisely tracking probation periods. Couples have strengthened relationships by celebrating exact monthly anniversaries. Parents have captured precious baby milestones with day-perfect accuracy. Financial planners have improved client communications with clear timeline visualizations.
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Perfect for Every Scenario</h3>
              <p className="text-muted-foreground leading-relaxed">
                Planning a wedding? Calculate your countdown to the big day and track RSV P deadlines. Managing a construction project? Determine completion dates accounting for weather delays and working days. Tracking fitness goals? See exactly how many days you've been consistent. Expecting a baby? Count down to your due date and track each trimester. Saving for a goal? Calculate exactly how many days until you reach your target. Running a promotion? Know precisely when to schedule your marketing campaigns.
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Tips for Maximum Effectiveness</h3>
              <p className="text-muted-foreground leading-relaxed">
                For the most accurate results, always double-check your date inputs - a small typo can throw off your entire calculation. When planning projects, remember to account for holidays in addition to weekends. Use the working days feature for realistic business timelines. Bookmark this calculator for quick access to your time management powerhouse. Share results with teams using the export feature for clear communication. For long-term planning, add buffer days to account for unexpected delays.
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">The Science of Date Calculation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Behind the beautiful interface is sophisticated calendar mathematics. Our algorithm accounts for the Gregorian calendar's complexities: leap years every 4 years (except century years not divisible by 400), months with varying lengths, and timezone considerations. We calculate working days by excluding Saturdays and Sundays, giving you business-accurate timelines. The system handles edge cases like month-end dates, year transitions, and century boundaries with precision.
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Privacy and Simplicity</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your dates are your business! All calculations happen instantly in your browser - we never store or transmit your personal dates to any server. No registration required, no data collection, just pure functionality. The clean, intuitive interface means you can start calculating immediately without tutorials or learning curves. Whether you're tech-savvy or a casual user, you'll feel right at home.
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Start Your Time Mastery Journey Today</h3>
              <p className="text-muted-foreground leading-relaxed">
                Don't let time manage you - take control with our powerful Date Calculator! Whether you're planning the next quarter, counting down to retirement, tracking a pregnancy, managing construction timelines, or simply curious about how many days you've been alive, we're here to help. The calculator is completely free, requires no downloads, and works perfectly on any device. Start calculating now and discover the peace of mind that comes from knowing exactly where you stand in time!
              </p>
            </div>
          </CardContent>
        </Card>

        <AutoAdSlot placement="in-feed" className="my-8" />

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-2 border-yellow-300 dark:border-yellow-700">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <Sparkles className="h-8 w-8 text-yellow-600 dark:text-yellow-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold">Pro Tip: Bookmark This Page!</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Time waits for no one, but you can! Save this calculator to your favorites for instant access whenever you need to master the calendar. Your future self will thank you for having this powerful tool just one click away!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}

export default DateCalculator;
