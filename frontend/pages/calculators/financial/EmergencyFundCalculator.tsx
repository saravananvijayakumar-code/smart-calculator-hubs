import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Shield, Info, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { useFormatting } from '../../../utils/formatting';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface EmergencyFundResult {
  recommendedAmount: number;
  currentShortfall: number;
  monthsToGoal: number;
  isValid: boolean;
  monthsOfExpensesCovered: number;
  adequacyLevel: 'insufficient' | 'minimal' | 'adequate' | 'excellent';
}

interface SavingsScenario {
  monthlyAmount: number;
  timeToGoal: number;
  description: string;
}

export default function EmergencyFundCalculator() {
  const { formatCurrency, parseCurrencyInput, getCurrencySymbol } = useFormatting();
  
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [months, setMonths] = useState('6');
  const [jobSecurity, setJobSecurity] = useState('');
  const [dependents, setDependents] = useState('');
  const [result, setResult] = useState<EmergencyFundResult>({
    recommendedAmount: 0,
    currentShortfall: 0,
    monthsToGoal: 0,
    isValid: false,
    monthsOfExpensesCovered: 0,
    adequacyLevel: 'insufficient'
  });
  const [scenarios, setScenarios] = useState<SavingsScenario[]>([]);

  const calculateEmergencyFund = () => {
    const expenses = parseFloat(monthlyExpenses);
    const current = parseFloat(currentSavings) || 0;
    const savings = parseFloat(monthlySavings) || 0;
    const monthsNum = parseFloat(months);

    if (expenses > 0 && monthsNum > 0) {
      const recommendedAmount = expenses * monthsNum;
      const currentShortfall = Math.max(0, recommendedAmount - current);
      const monthsToGoal = savings > 0 ? Math.ceil(currentShortfall / savings) : 0;
      const monthsOfExpensesCovered = current / expenses;
      
      let adequacyLevel: 'insufficient' | 'minimal' | 'adequate' | 'excellent';
      if (monthsOfExpensesCovered < 1) adequacyLevel = 'insufficient';
      else if (monthsOfExpensesCovered < 3) adequacyLevel = 'minimal';
      else if (monthsOfExpensesCovered < 6) adequacyLevel = 'adequate';
      else adequacyLevel = 'excellent';

      setResult({
        recommendedAmount,
        currentShortfall,
        monthsToGoal,
        isValid: true,
        monthsOfExpensesCovered,
        adequacyLevel
      });

      // Calculate different savings scenarios
      if (currentShortfall > 0) {
        const savingsScenarios: SavingsScenario[] = [
          {
            monthlyAmount: currentShortfall / 60, // 5 years
            timeToGoal: 60,
            description: 'Conservative (5 years)'
          },
          {
            monthlyAmount: currentShortfall / 36, // 3 years
            timeToGoal: 36,
            description: 'Moderate (3 years)'
          },
          {
            monthlyAmount: currentShortfall / 24, // 2 years
            timeToGoal: 24,
            description: 'Aggressive (2 years)'
          },
          {
            monthlyAmount: currentShortfall / 12, // 1 year
            timeToGoal: 12,
            description: 'Very Aggressive (1 year)'
          }
        ];
        setScenarios(savingsScenarios);
      } else {
        setScenarios([]);
      }
    } else {
      setResult({
        recommendedAmount: 0,
        currentShortfall: 0,
        monthsToGoal: 0,
        isValid: false,
        monthsOfExpensesCovered: 0,
        adequacyLevel: 'insufficient'
      });
      setScenarios([]);
    }
  };

  useEffect(() => {
    calculateEmergencyFund();
  }, [monthlyExpenses, currentSavings, monthlySavings, months]);

  const getRecommendedMonths = () => {
    let baseMonths = 6; // Default recommendation
    
    // Adjust based on job security
    if (jobSecurity === 'unstable') baseMonths += 3;
    else if (jobSecurity === 'stable') baseMonths -= 1;
    else if (jobSecurity === 'very_stable') baseMonths -= 2;
    
    // Adjust based on dependents
    if (dependents === 'many') baseMonths += 2;
    else if (dependents === 'some') baseMonths += 1;
    
    return Math.max(3, Math.min(12, baseMonths)); // Between 3-12 months
  };

  const tips = [
    "Start with a small emergency fund of $1,000 if you have high-interest debt",
    "Aim for 3-6 months of expenses for most people, more for unstable income",
    "Keep emergency funds in high-yield savings accounts for accessibility",
    "Don't invest emergency funds in stocks or volatile investments",
    "Review and adjust your emergency fund as life circumstances change"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Emergency Fund Calculator | How Much Emergency Savings Do You Need?"
      description="Calculate the ideal emergency fund size based on your expenses, job security, and family situation. Get personalized savings strategies and timelines to build financial security."
      keywords="emergency fund calculator, emergency savings calculator, financial safety net, how much emergency fund, savings goal calculator, financial security planning"
      tips={tips}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Emergency Fund Calculator</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyExpenses">Monthly Expenses ({getCurrencySymbol()})</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  placeholder="4000"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSavings">Current Emergency Savings ({getCurrencySymbol()})</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  placeholder="2000"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlySavings">Monthly Savings Ability ({getCurrencySymbol()})</Label>
                <Input
                  id="monthlySavings"
                  type="number"
                  placeholder="500"
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="months">Target Months of Expenses</Label>
                <Select value={months} onValueChange={setMonths}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months (Recommended)</SelectItem>
                    <SelectItem value="9">9 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobSecurity">Job Security Level</Label>
                <Select value={jobSecurity} onValueChange={setJobSecurity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job security" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very_stable">Very Stable (Government, Tenure)</SelectItem>
                    <SelectItem value="stable">Stable (Corporate, Union)</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="unstable">Unstable (Contract, Seasonal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Select value={dependents} onValueChange={setDependents}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dependents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="some">1-2 Dependents</SelectItem>
                    <SelectItem value="many">3+ Dependents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {jobSecurity && dependents && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Personalized Recommendation:</strong> Based on your job security and dependents, 
                  consider saving for {getRecommendedMonths()} months of expenses.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result.isValid && (
          <div className="space-y-6">
            {/* AI Analysis */}
            <AIAnalysis
              analysisRequest={{
                calculatorType: "emergency-fund",
                data: {
                  monthlyExpenses: parseFloat(monthlyExpenses) || 0,
                  targetMonths: parseFloat(months) || 6,
                  currentSavings: parseFloat(currentSavings) || 0,
                  targetAmount: result.recommendedAmount,
                  shortfall: result.currentShortfall,
                  monthlyContribution: parseFloat(monthlySavings) || 0
                }
              }}
              autoRun={true}
              title="AI Emergency Fund Analysis"
              description="Get personalized strategies to build and optimize your emergency fund based on your situation."
            />

            <ExportShareButtons
              calculatorType="emergency-fund"
              inputs={{
                monthlyExpenses: parseFloat(monthlyExpenses) || 0,
                months: parseFloat(months) || 6,
                currentSavings: parseFloat(currentSavings) || 0,
                monthlySavings: parseFloat(monthlySavings) || 0
              }}
              results={{
                recommendedAmount: result.recommendedAmount,
                currentShortfall: result.currentShortfall,
                monthsToGoal: result.monthsToGoal,
                adequacyLevel: result.adequacyLevel
              }}
              title="Emergency Fund Calculator Report"
            />

            {/* Current Status */}
            <Card className={`border-2 ${
              result.adequacyLevel === 'excellent' ? 'border-green-200 bg-green-50' :
              result.adequacyLevel === 'adequate' ? 'border-blue-200 bg-blue-50' :
              result.adequacyLevel === 'minimal' ? 'border-yellow-200 bg-yellow-50' :
              'border-red-200 bg-red-50'
            }`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg font-bold ${
                  result.adequacyLevel === 'excellent' ? 'text-green-800' :
                  result.adequacyLevel === 'adequate' ? 'text-blue-800' :
                  result.adequacyLevel === 'minimal' ? 'text-yellow-800' :
                  'text-red-800'
                }`}>
                  Emergency Fund Status: {result.adequacyLevel.charAt(0).toUpperCase() + result.adequacyLevel.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(result.recommendedAmount)}
                    </div>
                    <p className="text-sm text-muted-foreground">Target Amount</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(parseFloat(currentSavings) || 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Current Savings</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(result.currentShortfall)}
                    </div>
                    <p className="text-sm text-muted-foreground">Amount Needed</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.monthsOfExpensesCovered.toFixed(1)} months
                    </div>
                    <p className="text-sm text-muted-foreground">Current Coverage</p>
                  </div>
                </div>

                {result.monthsToGoal > 0 && parseFloat(monthlySavings) > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-center text-sm">
                      At {formatCurrency(parseFloat(monthlySavings))}/month, you'll reach your goal in{' '}
                      <strong>{result.monthsToGoal} months</strong>
                      {result.monthsToGoal > 12 && (
                        <span> ({(result.monthsToGoal / 12).toFixed(1)} years)</span>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Savings Scenarios */}
            {scenarios.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Savings Strategy Options</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {scenarios.map((scenario, index) => (
                      <div key={index} className="text-center p-4 border rounded-lg">
                        <h3 className="font-semibold text-sm mb-2">{scenario.description}</h3>
                        <div className="text-xl font-bold text-blue-600">
                          {formatCurrency(scenario.monthlyAmount)}
                        </div>
                        <p className="text-xs text-muted-foreground">per month</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {scenario.timeToGoal} months to goal
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emergency Fund Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Fund Size Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Recommended by Situation:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Single income, stable job:</span>
                        <Badge variant="outline">3-6 months</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Dual income, stable jobs:</span>
                        <Badge variant="outline">3-4 months</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Variable income:</span>
                        <Badge variant="secondary">6-12 months</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Self-employed:</span>
                        <Badge variant="secondary">6-12 months</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>High medical expenses:</span>
                        <Badge variant="secondary">9-12 months</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Building Strategy:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Start with $1,000 minimum fund</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Pay off high-interest debt first</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Build to 1 month of expenses</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Gradually increase to target</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Automate savings contributions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Guide to Emergency Fund Planning</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-6">
                <p>
                  An emergency fund represents one of the most critical components of personal financial security, providing 
                  a financial buffer against unexpected expenses, job loss, medical emergencies, or major life disruptions. 
                  Building and maintaining an adequate emergency fund is essential for financial stability and peace of mind, 
                  preventing the need to rely on high-interest debt during difficult times. This comprehensive guide covers 
                  everything you need to know about emergency fund planning, from determining the right size to optimizing 
                  your savings strategy and choosing appropriate accounts.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Why Emergency Funds Are Essential</h3>
                <p>
                  Emergency funds serve as financial shock absorbers, protecting your long-term financial goals from unexpected 
                  events that could otherwise derail your progress. Without an emergency fund, people often resort to credit 
                  cards, personal loans, or early retirement account withdrawals to handle crises, creating additional financial 
                  stress and long-term consequences. Studies show that households with emergency funds are significantly less 
                  likely to experience financial hardship during economic downturns or personal emergencies, making this the 
                  foundation of sound financial planning.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Determining Your Emergency Fund Size</h3>
                <p>
                  The traditional recommendation of 3-6 months of expenses serves as a starting point, but your ideal emergency 
                  fund size depends on personal circumstances including job security, income stability, health status, and family 
                  responsibilities. Government employees or those with union protection might need less, while freelancers, 
                  commissioned sales professionals, or those in volatile industries should aim for larger reserves. Additionally, 
                  homeowners typically need larger emergency funds than renters due to potential major repair expenses.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Emergency Fund Size Factors:</h4>
                  <ul className="space-y-1">
                    <li>• <strong>Job Security:</strong> Stable employment = 3-4 months, Unstable = 6-12 months</li>
                    <li>• <strong>Income Variability:</strong> Fixed salary = 3-6 months, Variable = 6-12 months</li>
                    <li>• <strong>Health Factors:</strong> Good health = Standard, Chronic conditions = Extra 2-3 months</li>
                    <li>• <strong>Dependents:</strong> Single = 3-6 months, Large family = 6-9 months</li>
                    <li>• <strong>Home Ownership:</strong> Renter = Standard, Homeowner = Add 1-2 months</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Building Your Emergency Fund Strategy</h3>
                <p>
                  Building an emergency fund requires a systematic approach that balances urgency with financial reality. For 
                  those with high-interest debt, financial experts recommend building a small starter emergency fund ($1,000-2,500) 
                  before aggressively paying down debt, then completing the full emergency fund afterward. This approach prevents 
                  the cycle of debt accumulation while addressing immediate emergency needs. Once debt is managed, focus entirely 
                  on building the complete emergency fund before pursuing other financial goals.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Choosing the Right Account for Emergency Funds</h3>
                <p>
                  Emergency funds require a careful balance between accessibility, safety, and growth. High-yield savings accounts 
                  typically offer the best combination of these factors, providing FDIC insurance, easy access, and competitive 
                  interest rates. Money market accounts, certificates of deposit with penalty considerations, and even some government 
                  bond funds may be appropriate for portions of larger emergency funds. The key is avoiding investments with 
                  principal risk or significant liquidity constraints that could compromise the fund's primary purpose.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Automating Emergency Fund Contributions</h3>
                <p>
                  Automation represents the most effective strategy for building emergency funds consistently. Setting up automatic 
                  transfers immediately after payday ensures savings happen before discretionary spending can interfere. Many 
                  successful savers use the "pay yourself first" principle, treating emergency fund contributions like any other 
                  essential bill. Even modest automated contributions of $50-100 per month can build substantial emergency funds 
                  over time, with the psychological benefit of removing the decision-making burden from the savings process.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Emergency Fund vs. Other Financial Priorities</h3>
                <p>
                  Emergency fund building must be balanced against other financial priorities including debt repayment, retirement 
                  savings, and major purchases. While conventional wisdom suggests completing emergency funds before investing, 
                  some financial advisors recommend simultaneous approaches for those with employer 401(k) matches or extremely 
                  stable employment. The key is ensuring adequate liquidity for genuine emergencies while not sacrificing 
                  significant long-term growth opportunities or allowing high-interest debt to compound.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Emergency Fund Strategies and Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Tiered Emergency Fund Approach</h3>
                <p>
                  Sophisticated emergency fund strategies often employ tiered approaches that balance accessibility with returns. 
                  The first tier might include 1-2 months of expenses in immediately accessible checking or savings accounts for 
                  urgent needs. The second tier could hold 2-4 months in high-yield savings accounts that may take 1-2 days to access. 
                  A third tier might include longer-term vehicles like short-term CDs or government bond funds for extended 
                  unemployment scenarios, accepting some liquidity constraints for higher returns.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Credit Lines as Emergency Fund Supplements</h3>
                <p>
                  Home equity lines of credit (HELOCs) and personal credit lines can supplement traditional emergency funds for 
                  homeowners with significant equity and stable income. These credit facilities provide additional liquidity 
                  without requiring large cash reserves, potentially allowing more aggressive investment of excess funds. However, 
                  credit lines should never replace core emergency savings, as they may become unavailable precisely when needed 
                  most during economic downturns or personal financial stress.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Tax-Advantaged Emergency Fund Strategies</h3>
                <p>
                  Roth IRA accounts can serve dual purposes as retirement savings and emergency fund supplements, since contributions 
                  can be withdrawn penalty-free at any time. This strategy works particularly well for young professionals who 
                  struggle to balance emergency fund building with retirement savings. However, this approach requires discipline 
                  to avoid treating retirement accounts as general savings, and withdrawn contributions lose their tax-advantaged 
                  growth potential permanently.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Emergency Fund Optimization Checklist:</h4>
                  <ul className="space-y-1">
                    <li>• Calculate precise monthly expenses including insurance, utilities, and debt payments</li>
                    <li>• Assess job security and income stability realistically</li>
                    <li>• Consider family health history and potential medical expenses</li>
                    <li>• Evaluate homeownership responsibilities and potential major repairs</li>
                    <li>• Choose appropriate account types balancing access and returns</li>
                    <li>• Automate contributions to build the fund systematically</li>
                    <li>• Review and adjust fund size as life circumstances change</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">When and How to Use Emergency Funds</h3>
                <p>
                  Defining what constitutes a genuine emergency helps preserve the fund for its intended purpose. True emergencies 
                  typically involve unexpected expenses that threaten financial stability, such as job loss, major medical expenses, 
                  essential home repairs, or urgent travel for family emergencies. Non-emergencies include predictable expenses 
                  like annual insurance premiums, desired purchases, investment opportunities, or vacation funding. Establishing 
                  clear criteria helps maintain fund integrity and ensures resources remain available for genuine crises.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Replenishing Emergency Funds After Use</h3>
                <p>
                  After using emergency funds, immediate replenishment should become the highest financial priority, temporarily 
                  superseding other goals including additional investments or major purchases. The psychological and financial 
                  security provided by a complete emergency fund is too valuable to leave depleted for extended periods. Consider 
                  temporarily reducing other savings goals or increasing income through side work to rebuild the fund quickly, 
                  restoring full financial security and peace of mind.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Emergency Funds for Different Life Stages</h3>
                <p>
                  Emergency fund needs evolve throughout different life stages, requiring periodic reassessment and adjustment. 
                  Young professionals might start with smaller funds focused on job transition support, while parents need larger 
                  reserves for family medical emergencies and childcare disruptions. Pre-retirees should consider larger emergency 
                  funds to bridge potential early retirement or unexpected healthcare costs. Retirees may need different emergency 
                  fund strategies that account for fixed incomes and potentially higher healthcare expenses.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">International Considerations for Emergency Funds</h3>
                <p>
                  Expatriates and frequent international travelers face unique emergency fund challenges including currency risk, 
                  international transfer delays, and varying healthcare systems. These individuals may benefit from maintaining 
                  emergency funds in multiple currencies or countries, ensuring access regardless of location. Travel insurance, 
                  international health coverage, and emergency evacuation policies can supplement traditional emergency funds for 
                  those with significant international exposure.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Technology and Emergency Fund Management</h3>
                <p>
                  Modern technology offers tools to optimize emergency fund management including automatic savings apps, high-yield 
                  online banks, and financial planning software that can model different emergency scenarios. Mobile banking ensures 
                  access to funds from anywhere, while budget tracking apps help monitor both fund building progress and spending 
                  patterns that inform fund size decisions. However, technology should enhance rather than complicate the fundamental 
                  goal of maintaining accessible, secure emergency reserves.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Should I build an emergency fund or pay off debt first?</h4>
                    <p>Start with a small emergency fund ($1,000-2,500) to avoid creating new debt during emergencies, then focus on high-interest debt payoff. After eliminating high-interest debt, build your full emergency fund before pursuing other goals.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Where should I keep my emergency fund?</h4>
                    <p>High-yield savings accounts typically offer the best balance of accessibility, safety, and returns. Consider online banks offering competitive rates while maintaining FDIC insurance. Avoid investments with principal risk or significant withdrawal penalties.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How much should I save if I'm self-employed?</h4>
                    <p>Self-employed individuals should target 6-12 months of expenses due to irregular income and limited safety nets. Consider higher amounts if your industry is seasonal or cyclical, and ensure the fund covers both personal and business emergency needs.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I use my emergency fund for a good investment opportunity?</h4>
                    <p>No, emergency funds should remain dedicated to genuine emergencies. Investment opportunities, no matter how attractive, don't qualify as emergencies. Protect your financial security by maintaining fund integrity and pursuing investments with separate resources.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Should I count my Roth IRA contributions as part of my emergency fund?</h4>
                    <p>Roth IRA contributions can serve as emergency fund supplements since they're accessible penalty-free, but shouldn't replace dedicated emergency savings. This strategy works for young savers balancing multiple goals, but requires discipline to preserve retirement savings.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How often should I review my emergency fund size?</h4>
                    <p>Review your emergency fund annually or after major life changes like job changes, marriage, divorce, home purchase, or having children. Ensure the fund size still aligns with your current expenses, income stability, and risk factors.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Important Information & Disclaimer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• This calculator provides estimates only and should not be relied upon for final financial planning decisions.</p>
              <p>• Emergency fund needs vary significantly based on personal circumstances and risk tolerance.</p>
              <p>• Consider consulting with a financial advisor for personalized emergency fund strategies.</p>
              <p>• Account interest rates and fees can impact the growth and accessibility of emergency funds.</p>
              <p>• Emergency fund guidelines may need adjustment based on changing life circumstances.</p>
              <p>• This calculator doesn't account for inflation's impact on long-term emergency fund adequacy.</p>
              <p>• Actual emergency scenarios may require different amounts than calculated estimates.</p>
              <p>• Balance emergency fund building with other important financial goals like debt payoff and retirement.</p>
              <p>• Results are estimates only and actual emergency fund needs may vary from calculations shown.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}