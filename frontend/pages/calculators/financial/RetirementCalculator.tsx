import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, TrendingUp, Wallet, Target, DollarSign, Calendar, Sparkles, Award, Shield, Lightbulb, AlertCircle, CheckCircle2, Calculator } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { useCalculatorHistory } from '../../../hooks/useCalculatorHistory';
import { useToast } from '@/components/ui/use-toast';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface RetirementResult {
  finalAmount: number;
  totalContributions: number;
  totalEarnings: number;
  monthlyNeeded: number;
  isValid: boolean;
}

export default function RetirementCalculator() {
  const { saveCalculation } = useCalculatorHistory();
  const { toast } = useToast();
  
  const [currentAge, setCurrentAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [retirementGoal, setRetirementGoal] = useState('');
  const [result, setResult] = useState<RetirementResult>({
    finalAmount: 0,
    totalContributions: 0,
    totalEarnings: 0,
    monthlyNeeded: 0,
    isValid: false
  });

  useEffect(() => {
    const currentAgeNum = parseFloat(currentAge);
    const retirementAgeNum = parseFloat(retirementAge);
    const currentSavingsNum = parseFloat(currentSavings) || 0;
    const monthlyContributionNum = parseFloat(monthlyContribution) || 0;
    const expectedReturnNum = parseFloat(expectedReturn);
    const retirementGoalNum = parseFloat(retirementGoal) || 0;

    if (currentAgeNum > 0 && retirementAgeNum > currentAgeNum && expectedReturnNum >= 0) {
      const yearsToRetirement = retirementAgeNum - currentAgeNum;
      const monthsToRetirement = yearsToRetirement * 12;
      const monthlyRate = expectedReturnNum / 100 / 12;

      const futureValueCurrent = currentSavingsNum * Math.pow(1 + monthlyRate, monthsToRetirement);

      let futureValueContributions = 0;
      if (monthlyContributionNum > 0 && monthlyRate > 0) {
        futureValueContributions = monthlyContributionNum * 
          ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);
      } else if (monthlyContributionNum > 0) {
        futureValueContributions = monthlyContributionNum * monthsToRetirement;
      }

      const finalAmount = futureValueCurrent + futureValueContributions;
      const totalContributions = currentSavingsNum + (monthlyContributionNum * monthsToRetirement);
      const totalEarnings = finalAmount - totalContributions;

      let monthlyNeeded = 0;
      if (retirementGoalNum > futureValueCurrent) {
        const needed = retirementGoalNum - futureValueCurrent;
        if (monthlyRate > 0) {
          monthlyNeeded = needed * monthlyRate / (Math.pow(1 + monthlyRate, monthsToRetirement) - 1);
        } else {
          monthlyNeeded = needed / monthsToRetirement;
        }
      }

      setResult({
        finalAmount,
        totalContributions,
        totalEarnings,
        monthlyNeeded,
        isValid: true
      });
    } else {
      setResult({
        finalAmount: 0,
        totalContributions: 0,
        totalEarnings: 0,
        monthlyNeeded: 0,
        isValid: false
      });
    }
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, retirementGoal]);

  const handleSaveCalculation = () => {
    if (!result.isValid) {
      toast({
        title: 'No calculation to save',
        description: 'Please complete the form to generate results first.',
        variant: 'destructive',
      });
      return;
    }

    saveCalculation({
      calculatorType: 'retirement',
      calculatorName: 'Retirement Calculator',
      inputs: {
        currentAge: parseFloat(currentAge),
        retirementAge: parseFloat(retirementAge),
        currentSavings: parseFloat(currentSavings) || 0,
        monthlyContribution: parseFloat(monthlyContribution) || 0,
        expectedReturn: parseFloat(expectedReturn),
        retirementGoal: parseFloat(retirementGoal) || 0,
      },
      results: {
        finalAmount: result.finalAmount,
        totalContributions: result.totalContributions,
        totalEarnings: result.totalEarnings,
        monthlyNeeded: result.monthlyNeeded,
      },
    });

    toast({
      title: 'Calculation saved!',
      description: 'View it in your calculation history.',
    });
  };

  const yearsToRetirement = parseFloat(retirementAge) - parseFloat(currentAge);
  const monthlyIncome = result.finalAmount > 0 ? (result.finalAmount * 0.04) / 12 : 0;
  const goalProgress = parseFloat(retirementGoal) > 0 ? (result.finalAmount / parseFloat(retirementGoal)) * 100 : 0;

  return (
    <CalculatorLayoutWithAds
      title="Retirement Calculator - Plan Your Financial Freedom | 2025"
      description="Free retirement calculator to plan your golden years. Calculate retirement savings, investment growth, and monthly income needed. Expert retirement planning tools for 2025."
      keywords="retirement calculator, retirement planning, pension calculator, 401k calculator, retirement savings calculator, financial freedom calculator, retire early calculator"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 border border-purple-200 dark:border-purple-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg animate-in zoom-in duration-500 delay-100">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3 animate-in slide-in-from-left duration-500 delay-200">
                Retirement Planning Calculator: Design Your Dream Retirement
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed animate-in slide-in-from-left duration-500 delay-300">
                Your journey to financial independence starts here. Calculate exactly how much you need to save, when you can retire, and what your golden years will look like. Let's build your retirement roadmap together! 🚀
              </p>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-2 border-purple-100 dark:border-purple-900/50 animate-in slide-in-from-bottom-4 duration-700 delay-100">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calculator className="w-6 h-6 text-purple-600" />
              Your Retirement Blueprint
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Fill in your details to see your personalized retirement projection. Every dollar counts, every year matters!
            </p>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <Label htmlFor="currentAge" className="flex items-center gap-2 text-base font-semibold">
                  <Calendar className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  Current Age
                </Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  placeholder="e.g., 30"
                  min="18"
                  max="100"
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300 hover:border-purple-300"
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="retirementAge" className="flex items-center gap-2 text-base font-semibold">
                  <Target className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                  Target Retirement Age
                </Label>
                <Input
                  id="retirementAge"
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  placeholder="e.g., 65"
                  min="50"
                  max="100"
                  className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 transition-all duration-300 hover:border-indigo-300"
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="currentSavings" className="flex items-center gap-2 text-base font-semibold">
                  <DollarSign className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                  Current Retirement Savings
                </Label>
                <Input
                  id="currentSavings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  placeholder="e.g., 50000"
                  min="0"
                  step="1000"
                  className="border-green-200 focus:border-green-400 focus:ring-green-400 transition-all duration-300 hover:border-green-300"
                />
                <p className="text-xs text-muted-foreground">Total in 401k, IRA, and other retirement accounts</p>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="monthlyContribution" className="flex items-center gap-2 text-base font-semibold">
                  <TrendingUp className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  Monthly Contribution
                </Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="e.g., 500"
                  min="0"
                  step="50"
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 hover:border-blue-300"
                />
                <p className="text-xs text-muted-foreground">How much you'll save each month</p>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="expectedReturn" className="flex items-center gap-2 text-base font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  Expected Annual Return (%)
                </Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  placeholder="e.g., 7"
                  min="0"
                  step="0.5"
                  className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 transition-all duration-300 hover:border-amber-300"
                />
                <p className="text-xs text-muted-foreground">Historical average: 7-10% for stocks, 4-6% for bonds</p>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="retirementGoal" className="flex items-center gap-2 text-base font-semibold">
                  <Award className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                  Retirement Goal (Optional)
                </Label>
                <Input
                  id="retirementGoal"
                  type="number"
                  value={retirementGoal}
                  onChange={(e) => setRetirementGoal(e.target.value)}
                  placeholder="e.g., 1000000"
                  min="0"
                  step="10000"
                  className="border-rose-200 focus:border-rose-400 focus:ring-rose-400 transition-all duration-300 hover:border-rose-300"
                />
                <p className="text-xs text-muted-foreground">Your target retirement nest egg</p>
              </div>
            </div>

            {result.isValid && (
              <>
                <div className="flex justify-end animate-in fade-in slide-in-from-right duration-500">
                  <Button onClick={handleSaveCalculation} variant="outline" className="gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300">
                    <Save className="w-4 h-4" />
                    Save to History
                  </Button>
                </div>

                <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
                  <div className="p-6 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/30 dark:via-green-950/30 dark:to-teal-950/30 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                        Your Retirement Projection
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Wallet className="w-4 h-4" />
                          Final Balance
                        </p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                          ${result.finalAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          At age {retirementAge}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          Investment Earnings
                        </p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                          ${result.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Compound magic! ✨
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Total Contributions
                        </p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          ${result.totalContributions.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your hard work pays off
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-amber-200 dark:border-amber-800 hover:shadow-md transition-all duration-300 hover:scale-105">
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Monthly Income
                        </p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                          ${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Using 4% rule
                        </p>
                      </div>
                    </div>

                    {parseFloat(retirementGoal) > 0 && (
                      <div className="mt-6 p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-rose-200 dark:border-rose-800">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold flex items-center gap-2">
                            <Target className="w-4 h-4 text-rose-600" />
                            Goal Progress
                          </p>
                          <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
                            {goalProgress.toFixed(1)}%
                          </p>
                        </div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-rose-500 to-pink-600 transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${Math.min(goalProgress, 100)}%` }}
                          />
                        </div>
                        {result.finalAmount < parseFloat(retirementGoal) && (
                          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                              💡 Need ${result.monthlyNeeded.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/month to reach your goal
                            </p>
                            <p className="text-xs text-amber-700 dark:text-amber-400">
                              That's ${(result.monthlyNeeded - parseFloat(monthlyContribution || '0')).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} more than your current contribution
                            </p>
                          </div>
                        )}
                        {result.finalAmount >= parseFloat(retirementGoal) && (
                          <p className="mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Congratulations! You're on track to exceed your goal! 🎉
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <AIAnalysis
                    analysisRequest={{
                      calculatorType: "retirement",
                      data: {
                        currentAge: parseFloat(currentAge) || 30,
                        retirementAge: parseFloat(retirementAge) || 65,
                        currentSavings: parseFloat(currentSavings) || 0,
                        monthlyContribution: parseFloat(monthlyContribution) || 0,
                        expectedReturn: parseFloat(expectedReturn) || 7,
                        retirementGoal: parseFloat(retirementGoal) || result.finalAmount,
                        projectedSavings: result.finalAmount,
                        monthlyIncomeNeeded: result.finalAmount * 0.04 / 12
                      }
                    }}
                    autoRun={true}
                    title="AI Retirement Analysis"
                    description="Get personalized retirement planning strategies and optimization recommendations based on your financial profile."
                  />

                  <ExportShareButtons
                    calculatorType="retirement"
                    inputs={{
                      currentAge: parseFloat(currentAge) || 0,
                      retirementAge: parseFloat(retirementAge) || 0,
                      currentSavings: parseFloat(currentSavings) || 0,
                      monthlyContribution: parseFloat(monthlyContribution) || 0,
                      expectedReturn: parseFloat(expectedReturn) || 0,
                      retirementGoal: parseFloat(retirementGoal) || 0
                    }}
                    results={{
                      finalAmount: result.finalAmount,
                      totalContributions: result.totalContributions,
                      totalEarnings: result.totalEarnings,
                      monthlyNeeded: result.monthlyNeeded
                    }}
                    title="Retirement Calculator Report"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <Card className="border-2 border-blue-100 dark:border-blue-900/50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                Pro Retirement Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {[
                { icon: TrendingUp, text: "Start early - compound interest is your superpower! Even $100/month at age 25 beats $500/month at age 45", color: "text-emerald-600" },
                { icon: Award, text: "Max out employer 401(k) match - it's literally free money. Never leave this on the table!", color: "text-purple-600" },
                { icon: Shield, text: "Diversify across stocks, bonds, and real estate. Don't put all eggs in one basket", color: "text-blue-600" },
                { icon: Target, text: "Aim for 10-12x your annual salary by retirement age for comfortable living", color: "text-amber-600" },
                { icon: Sparkles, text: "Review annually and increase contributions with raises. Pay yourself first!", color: "text-rose-600" }
              ].map((tip, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-transform duration-300">
                  <tip.icon className={`w-5 h-5 mt-0.5 ${tip.color} flex-shrink-0`} />
                  <p className="text-sm leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 dark:border-purple-900/50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                Common Retirement Mistakes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {[
                { icon: "⏰", text: "Delaying retirement savings - time is your biggest ally, don't waste it!", color: "bg-red-100 dark:bg-red-950/30" },
                { icon: "💸", text: "Withdrawing from retirement accounts early - penalties and lost growth hurt!", color: "bg-orange-100 dark:bg-orange-950/30" },
                { icon: "📊", text: "Being too conservative or aggressive - balance risk based on your age", color: "bg-yellow-100 dark:bg-yellow-950/30" },
                { icon: "🏥", text: "Ignoring healthcare costs - they can eat 20-30% of retirement income", color: "bg-blue-100 dark:bg-blue-950/30" },
                { icon: "📈", text: "Forgetting inflation - $1M today ≠ $1M in 30 years. Plan accordingly!", color: "bg-purple-100 dark:bg-purple-950/30" }
              ].map((mistake, idx) => (
                <div key={idx} className={`flex gap-3 p-3 ${mistake.color} rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-transform duration-300`}>
                  <span className="text-xl flex-shrink-0">{mistake.icon}</span>
                  <p className="text-sm leading-relaxed">{mistake.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-indigo-100 dark:border-indigo-900/50 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
            <CardTitle className="text-2xl">🎯 Understanding Retirement Planning: The Complete Guide</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 text-base leading-relaxed">
            <section>
              <h3 className="text-xl font-bold mb-3 text-indigo-600 dark:text-indigo-400">What is Retirement Planning?</h3>
              <p className="mb-4">
                Retirement planning is the art and science of determining how much money you'll need to live comfortably after you stop working, and creating a strategic roadmap to get there. Think of it as building a financial bridge from today to your golden years - you need to know how long the bridge needs to be, how strong it must be, and what materials (investments) you'll use to construct it.
              </p>
              <p className="mb-4">
                The beauty of retirement planning lies in its simplicity once you understand the core principles. It's not about complex formulas or Wall Street wizardry - it's about consistent saving, smart investing, and the magical power of compound interest working in your favor over decades. Every dollar you invest today becomes a small money-making machine, working 24/7 to build your future wealth.
              </p>
              <p>
                Modern retirement planning goes beyond just accumulating money. It encompasses tax optimization, healthcare planning, estate considerations, and lifestyle design. The goal isn't just to have enough money - it's to have the <em>right kind</em> of money in the <em>right places</em> to support the retirement lifestyle you've dreamed about.
              </p>
            </section>

            <section className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">The Power of Compound Interest: Your Money's Superpower</h3>
              <p className="mb-4">
                Albert Einstein allegedly called compound interest "the eighth wonder of the world." Here's why: when you invest $1,000 at 8% annual return, you don't just earn $80 per year forever. In the second year, you earn interest on your interest too! That $1,000 becomes $1,080, then $1,166, then $1,260, and it keeps accelerating.
              </p>
              <p className="mb-4">
                Let's get real with numbers: If you invest $500 per month starting at age 25 with a 7% return, you'll have approximately <strong>$1.1 million</strong> by age 65. Start at age 35 with the same contribution? You'll have only around <strong>$500,000</strong>. That 10-year delay costs you $600,000! Time is literally money when it comes to retirement.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-blue-300 dark:border-blue-700">
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Start at 25 (40 years)</p>
                  <p className="text-2xl font-bold">$1,142,811</p>
                  <p className="text-sm text-muted-foreground">$500/mo @ 7% return</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-blue-300 dark:border-blue-700">
                  <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Start at 35 (30 years)</p>
                  <p className="text-2xl font-bold">$566,764</p>
                  <p className="text-sm text-muted-foreground">$500/mo @ 7% return</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-purple-600 dark:text-purple-400">How Much Do You Really Need to Retire?</h3>
              <p className="mb-4">
                The million-dollar question (sometimes literally!) is: how much is enough? Financial planners traditionally use the <strong>"4% rule"</strong> - you can withdraw 4% of your retirement savings annually with minimal risk of running out. Want $50,000/year in retirement? You'll need about $1.25 million ($50,000 ÷ 0.04).
              </p>
              <p className="mb-4">
                But here's the nuance: your actual needs depend on your lifestyle, location, health, and goals. Planning to travel the world? You might need more. Have a paid-off house and modest needs? You might need less. A better approach is the <strong>replacement ratio</strong> - aim to replace 70-80% of your pre-retirement income. If you earn $100,000 now, target $70,000-$80,000 in retirement.
              </p>
              <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-300 dark:border-purple-700 mt-4">
                <p className="font-semibold mb-2">💡 Quick Retirement Savings Benchmarks:</p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Age 30:</strong> 1x annual salary saved</li>
                  <li>• <strong>Age 40:</strong> 3x annual salary saved</li>
                  <li>• <strong>Age 50:</strong> 6x annual salary saved</li>
                  <li>• <strong>Age 60:</strong> 8x annual salary saved</li>
                  <li>• <strong>Age 67:</strong> 10x annual salary saved</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-rose-600 dark:text-rose-400">Retirement Account Types: Choose Your Weapons Wisely</h3>
              
              <div className="space-y-4 mt-4">
                <div className="p-4 bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30 rounded-lg border border-rose-200 dark:border-rose-800">
                  <h4 className="font-bold text-lg mb-2">🏢 401(k) - The Workplace Powerhouse</h4>
                  <p className="mb-2">Your employer-sponsored retirement plan is often your best starting point. Why? <strong>Employer matching</strong> - typically 3-6% of your salary in free money! Plus, contributions are pre-tax, lowering your current tax bill while your money grows tax-deferred.</p>
                  <p className="text-sm"><strong>2025 Limit:</strong> $23,000 ($30,500 if age 50+)</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-lg mb-2">🎯 Traditional IRA - The Tax Deduction Champion</h4>
                  <p className="mb-2">Individual Retirement Accounts give you more investment control than 401(k)s. Traditional IRAs offer tax deductions today, with taxes due when you withdraw in retirement. Perfect if you expect to be in a lower tax bracket later.</p>
                  <p className="text-sm"><strong>2025 Limit:</strong> $7,000 ($8,000 if age 50+)</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <h4 className="font-bold text-lg mb-2">✨ Roth IRA - The Tax-Free Future</h4>
                  <p className="mb-2">Pay taxes now, enjoy tax-free withdrawals forever! Roth IRAs are magical for young earners in lower tax brackets. Your money grows tax-free, and qualified withdrawals in retirement are 100% tax-free. No required minimum distributions either!</p>
                  <p className="text-sm"><strong>2025 Limit:</strong> $7,000 ($8,000 if age 50+) - Income limits apply</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-bold text-lg mb-2">💼 SEP IRA & Solo 401(k) - The Entrepreneur's Edge</h4>
                  <p className="mb-2">Self-employed or small business owner? These accounts let you contribute way more - up to $69,000 in 2025! SEP IRAs are simpler; Solo 401(k)s offer Roth options and higher contribution flexibility.</p>
                  <p className="text-sm"><strong>Perfect for:</strong> Freelancers, consultants, gig workers, small business owners</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-indigo-600 dark:text-indigo-400">Investment Strategy: Age-Based Asset Allocation</h3>
              <p className="mb-4">
                Your investment mix should evolve as you age. The classic rule of thumb: subtract your age from 110 to get your stock percentage. At age 30, that's 80% stocks, 20% bonds. At age 60, it's 50/50. Why? You have less time to recover from market downturns as retirement approaches.
              </p>
              <p className="mb-4">
                But modern life expectancy and market conditions challenge old rules. Many financial advisors now recommend more aggressive allocations, especially with people retiring at 65 but potentially living to 95+. A <strong>target-date fund</strong> automatically adjusts your mix - set it and (mostly) forget it!
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-emerald-100 dark:bg-emerald-950/30 rounded-lg border border-emerald-300 dark:border-emerald-700">
                  <p className="font-bold text-emerald-700 dark:text-emerald-400 mb-2">Ages 20-40</p>
                  <p className="text-2xl font-bold mb-1">80-90%</p>
                  <p className="text-sm">Stocks (aggressive growth)</p>
                </div>
                <div className="p-4 bg-blue-100 dark:bg-blue-950/30 rounded-lg border border-blue-300 dark:border-blue-700">
                  <p className="font-bold text-blue-700 dark:text-blue-400 mb-2">Ages 40-60</p>
                  <p className="text-2xl font-bold mb-1">60-70%</p>
                  <p className="text-sm">Stocks (balanced)</p>
                </div>
                <div className="p-4 bg-amber-100 dark:bg-amber-950/30 rounded-lg border border-amber-300 dark:border-amber-700">
                  <p className="font-bold text-amber-700 dark:text-amber-400 mb-2">Ages 60+</p>
                  <p className="text-2xl font-bold mb-1">40-50%</p>
                  <p className="text-sm">Stocks (conservative)</p>
                </div>
              </div>
            </section>

            <section className="p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
              <h3 className="text-xl font-bold mb-3 text-purple-600 dark:text-purple-400">Advanced Strategies for Maximum Growth</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-lg mb-2">🚀 The Mega Backdoor Roth Strategy</h4>
                  <p>If your 401(k) allows after-tax contributions and in-plan conversions, you can contribute an additional $46,000 (2025 limit) to a Roth account. This advanced move is perfect for high earners who exceed Roth IRA income limits but want tax-free growth.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">💰 Tax-Loss Harvesting</h4>
                  <p>In taxable accounts, sell losing investments to offset gains and reduce your tax bill by up to $3,000/year. Then immediately buy similar (but not identical) investments to maintain your asset allocation. Free tax savings!</p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">📊 Asset Location Optimization</h4>
                  <p>Not just allocation - location matters! Keep tax-inefficient investments (bonds, REITs) in tax-deferred accounts, and tax-efficient investments (index funds, growth stocks) in taxable accounts. This can add 0.5-1% annual return boost.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">🎯 The Roth Conversion Ladder</h4>
                  <p>Planning early retirement? Convert traditional IRA money to Roth IRA gradually during low-income years. After 5 years, you can access converted amounts penalty-free before age 59½. Perfect for FIRE (Financial Independence, Retire Early) enthusiasts!</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-teal-600 dark:text-teal-400">Healthcare in Retirement: The Hidden Cost Monster</h3>
              <p className="mb-4">
                Here's a sobering fact: the average retired couple needs approximately <strong>$315,000</strong> for healthcare costs in retirement (Fidelity, 2024). That's not including long-term care! Medicare covers a lot, but not everything - there are premiums, deductibles, copays, and gaps.
              </p>
              <p className="mb-4">
                If you retire before 65, you'll need a bridge to Medicare. Options include COBRA (expensive but comprehensive), ACA marketplace plans (income-dependent subsidies available), or spousal coverage. After 65, budget for Medicare Part B ($174.70/mo in 2024), Part D (drug coverage), and Medigap or Medicare Advantage plans.
              </p>
              <p>
                <strong>Pro tip:</strong> Health Savings Accounts (HSAs) are retirement secret weapons! Contribute pre-tax, grow tax-free, withdraw tax-free for medical expenses. After 65, you can use HSA funds for anything (taxed like IRA). It's the only triple-tax-advantaged account!
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-orange-600 dark:text-orange-400">Social Security: When to Claim Makes a Huge Difference</h3>
              <p className="mb-4">
                You can claim Social Security as early as 62, but here's the catch: taking benefits early permanently reduces your monthly amount by up to 30%! Wait until your Full Retirement Age (67 for most people) to get 100%. Delay until 70? Get 124% of your full benefit - an 8% increase per year you wait.
              </p>
              <p className="mb-4">
                The break-even analysis: If you claim at 62 vs 70, you'll collect more total benefits if you live past roughly age 78-80. Given increasing life expectancies, waiting often makes financial sense - especially if you're healthy, married, or have longevity in your family.
              </p>
              <div className="p-4 bg-orange-100 dark:bg-orange-950/30 rounded-lg border border-orange-300 dark:border-orange-700 mt-4">
                <p className="font-semibold mb-2">Social Security Claiming Strategy Example:</p>
                <div className="space-y-2 text-sm">
                  <p>• <strong>Claim at 62:</strong> $1,750/month ($21,000/year)</p>
                  <p>• <strong>Claim at 67:</strong> $2,500/month ($30,000/year)</p>
                  <p>• <strong>Claim at 70:</strong> $3,100/month ($37,200/year)</p>
                  <p className="pt-2 border-t border-orange-300 dark:border-orange-700">
                    <strong>Lifetime difference (age 85):</strong> Waiting to 70 = $150,000+ more!
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-pink-600 dark:text-pink-400">Retirement Withdrawal Strategies: Making Your Money Last</h3>
              <p className="mb-4">
                The 4% rule is a starting point, but dynamic withdrawal strategies can extend your money's lifespan. The <strong>bucket strategy</strong> divides your portfolio into three buckets: cash for 1-2 years (safety), bonds for years 3-10 (stability), and stocks for 10+ years (growth). This lets you ride out market downturns without selling stocks at losses.
              </p>
              <p className="mb-4">
                Another approach: <strong>variable percentage withdrawal</strong>. In good market years, take 5%. In down years, take 3%. This flexibility, combined with minor lifestyle adjustments, can significantly reduce the risk of running out of money. Studies show this can support a 30-year retirement with 90%+ success rates.
              </p>
              <p>
                Don't forget Required Minimum Distributions (RMDs)! Starting at age 73, you must withdraw from traditional IRAs and 401(k)s whether you need the money or not. Plan for the tax impact - large RMDs can push you into higher tax brackets. Roth IRAs have no RMDs during your lifetime, another reason they're powerful!
              </p>
            </section>

            <section className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-xl font-bold mb-3 text-indigo-600 dark:text-indigo-400">Inflation: The Silent Retirement Killer</h3>
              <p className="mb-4">
                At just 3% annual inflation, your purchasing power cuts in half every 24 years. That $50,000/year you need today? It'll need to be $81,000 in 20 years to buy the same lifestyle. This is why keeping 100% in "safe" bonds can be dangerous - you're guaranteed to lose purchasing power.
              </p>
              <p className="mb-4">
                Combat inflation by maintaining stock exposure even in retirement. Dividend-growing stocks from companies like Coca-Cola, Johnson & Johnson, and Procter & Gamble have increased dividends for 50+ consecutive years, outpacing inflation. Treasury Inflation-Protected Securities (TIPS) and I-Bonds also provide direct inflation protection.
              </p>
              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Cost of $50k Today</p>
                  <p className="text-sm">• In 10 years: <strong>$67,195</strong></p>
                  <p className="text-sm">• In 20 years: <strong>$90,306</strong></p>
                  <p className="text-sm">• In 30 years: <strong>$121,363</strong></p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Protection Strategies</p>
                  <p className="text-sm">• Keep 40-60% in stocks</p>
                  <p className="text-sm">• Buy TIPS and I-Bonds</p>
                  <p className="text-sm">• Invest in dividend growers</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-cyan-600 dark:text-cyan-400">The FIRE Movement: Retire Decades Early</h3>
              <p className="mb-4">
                Financial Independence, Retire Early (FIRE) followers save 50-70% of their income to retire in their 30s or 40s. The math: if you save 50% of your income and invest at 7% return, you can retire in about 17 years. Save 70%? Retire in just 8.5 years! It requires aggressive saving and often frugal living, but it's mathematically sound.
              </p>
              <p className="mb-4">
                There are different flavors: <strong>Lean FIRE</strong> (minimal expenses, $40k/year), <strong>Regular FIRE</strong> (comfortable middle-class lifestyle, $60-80k/year), and <strong>Fat FIRE</strong> (luxury retirement, $100k+/year). Calculate your FIRE number: annual expenses × 25. Want to spend $50k/year? You need $1.25 million invested.
              </p>
              <p>
                The key to FIRE isn't just the math - it's optimizing your life for happiness per dollar spent. Many FIRE adherents report greater life satisfaction not from spending less, but from spending intentionally on what truly matters to them. Retirement becomes less about age and more about having options.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-violet-600 dark:text-violet-400">Retirement Lifestyle Design: It's Not Just About Money</h3>
              <p className="mb-4">
                Financial planning is half the battle - the other half is emotional preparation. Many retirees struggle with loss of identity, purpose, and social connections that work provided. The happiest retirees plan not just their finances, but their <em>time</em>.
              </p>
              <p className="mb-4">
                Create a "retirement resume" - list hobbies, volunteer opportunities, travel goals, and learning pursuits. Budget not just money but hours per week for each. Research shows retirees with structured routines, social engagement, and purpose-driven activities report 40% higher life satisfaction than those who "wing it."
              </p>
              <p>
                Consider geographic arbitrage - retiring in lower cost-of-living areas (or countries!) can stretch your dollars 2-3x. $3,000/month goes much further in Portugal, Mexico, or Thailand than in San Francisco. But don't underestimate the value of being near family and friends - money can't buy those connections.
              </p>
            </section>

            <section className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <h3 className="text-xl font-bold mb-3 text-emerald-600 dark:text-emerald-400">Your Action Plan: Start Today, Not Tomorrow</h3>
              <p className="mb-4">
                Retirement planning isn't a one-time event - it's a lifelong journey that starts with a single step. The best time to start was 10 years ago. The second best time is right now, today, this moment.
              </p>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold">Calculate Your Number</p>
                    <p className="text-sm text-muted-foreground">Use this calculator to determine your retirement savings goal and monthly contribution needed</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold">Maximize Free Money</p>
                    <p className="text-sm text-muted-foreground">Contribute at least enough to get full employer 401(k) match - never leave this on the table</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold">Automate Everything</p>
                    <p className="text-sm text-muted-foreground">Set up automatic contributions - if you don't see it, you won't spend it</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">4</div>
                  <div>
                    <p className="font-semibold">Increase Annually</p>
                    <p className="text-sm text-muted-foreground">Boost contributions by 1-2% each year or with every raise - you won't miss it</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">5</div>
                  <div>
                    <p className="font-semibold">Review & Rebalance</p>
                    <p className="text-sm text-muted-foreground">Check your progress every 6-12 months and adjust asset allocation as needed</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">Final Thoughts: Your Future Self Will Thank You</h3>
              <p className="mb-4">
                Every dollar you invest in your retirement is a gift to your future self. It's choosing future freedom over present consumption. Yes, it requires discipline. Yes, it means saying no to some things today. But imagine the peace of mind knowing you're building a life where work becomes optional, not obligatory.
              </p>
              <p className="mb-4">
                The retirement landscape will continue evolving - tax laws change, investment vehicles emerge, life expectancies shift. But the fundamentals remain constant: start early, save consistently, invest wisely, and stay the course. Market crashes will happen. Doubts will creep in. Stay focused on your long-term vision.
              </p>
              <p className="font-semibold text-lg text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent py-4">
                Your retirement isn't something that happens to you - it's something you create, one contribution at a time. Start building your dream retirement today! 🎯✨
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}
