// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingDown, Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import backend from '~backend/client';
import type { StudentLoanProjectionResponse } from '~backend/au-tax/types';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import ExportShareButtons from '@/components/ExportShareButtons';
import { formatCurrency } from '@/utils/formatting';

export default function StudentLoanCalculatorAustralia() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudentLoanProjectionResponse | null>(null);

  const [year, setYear] = useState('2024-25');
  const [currentBalance, setCurrentBalance] = useState('30000');
  const [annualIncome, setAnnualIncome] = useState('75000');
  const [incomeGrowthRate, setIncomeGrowthRate] = useState('3');
  const [indexationRate, setIndexationRate] = useState('4');
  const [voluntaryRepayment, setVoluntaryRepayment] = useState('0');

  const calculate = async () => {
    try {
      setLoading(true);
      const response = await backend.au_tax.studentLoanProjection({
        year,
        currentBalance: parseFloat(currentBalance) || 0,
        annualIncome: parseFloat(annualIncome) || 0,
        incomeGrowthRate: parseFloat(incomeGrowthRate) / 100 || 0,
        indexationRate: parseFloat(indexationRate) / 100 || 0,
        voluntaryRepayment: parseFloat(voluntaryRepayment) || 0,
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Calculation Error',
        description: 'Failed to calculate loan projection.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData = result?.projections.map(p => ({
    year: `Year ${p.year}`,
    balance: p.endingBalance,
  })) || [];

  return (
    <CalculatorLayoutWithAds
      title="HELP Loan Projection Calculator"
      description="Project your HELP/HECS/VSL loan payoff timeline with compulsory & voluntary repayments"
      keywords="HELP calculator, HECS calculator, student loan calculator Australia, HELP repayment calculator, student debt payoff calculator"
    >
      <div className="max-w-7xl mx-auto">


        <div className="grid lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Loan Details
              </CardTitle>
              <CardDescription>Enter your current loan and income information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="year" className="text-sm font-medium">Tax Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2025-26">2025-26 (Marginal Method)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="currentBalance" className="text-sm font-medium">
                  Current HELP Balance
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="currentBalance"
                    type="number"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(e.target.value)}
                    placeholder="30000"
                    className="pl-7"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Check myGov for your accurate HELP balance
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualIncome" className="text-sm font-medium">
                  Current Annual Income
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="annualIncome"
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    placeholder="75000"
                    className="pl-7"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="incomeGrowthRate" className="text-sm font-medium">
                  Annual Income Growth
                </Label>
                <div className="relative">
                  <Input
                    id="incomeGrowthRate"
                    type="number"
                    value={incomeGrowthRate}
                    onChange={(e) => setIncomeGrowthRate(e.target.value)}
                    placeholder="3"
                    step="0.1"
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Expected annual salary increase (typical: 2-4%)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="indexationRate" className="text-sm font-medium">
                  HELP Indexation Rate
                </Label>
                <div className="relative">
                  <Input
                    id="indexationRate"
                    type="number"
                    value={indexationRate}
                    onChange={(e) => setIndexationRate(e.target.value)}
                    placeholder="4"
                    step="0.1"
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Applied June 1 annually (2024: 4.8%, historical avg: 2-3%)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voluntaryRepayment" className="text-sm font-medium">
                  Voluntary Repayment (Annual)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="voluntaryRepayment"
                    type="number"
                    value={voluntaryRepayment}
                    onChange={(e) => setVoluntaryRepayment(e.target.value)}
                    placeholder="0"
                    className="pl-7"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Optional additional payments (not subject to indexation)
                </p>
              </div>

              <Button onClick={calculate} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Calculate Payoff Timeline
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            {result ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Payoff Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.payoffYear ? (
                        <>
                          <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-500 mb-1">
                            {result.payoffYear}
                          </div>
                          <div className="text-muted-foreground">
                            {result.payoffYear === 1 ? 'Year' : 'Years'} until debt-free
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-orange-600 dark:text-orange-500 mb-1">
                            50+ Years
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Debt not projected to pay off within 50 years
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Total Paid
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold mb-1">
                        {formatCurrency(result.totalPaid)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="destructive" className="text-xs">
                          +{formatCurrency(result.totalInterest)} indexation
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-emerald-600" />
                      Balance Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.length > 0 && (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="year" className="text-xs" />
                          <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                          <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="balance" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            fill="url(#balanceGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      Year-by-Year Breakdown
                    </CardTitle>
                    <CardDescription>Detailed projection of income, repayments, and balance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-auto max-h-[400px] rounded-md border">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">Year</th>
                            <th className="text-right p-3 font-medium">Income</th>
                            <th className="text-right p-3 font-medium">Compulsory</th>
                            <th className="text-right p-3 font-medium">Voluntary</th>
                            <th className="text-right p-3 font-medium">Indexation</th>
                            <th className="text-right p-3 font-medium">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.projections.map((p, idx) => (
                            <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="p-3">
                                <Badge variant="outline">{p.year}</Badge>
                              </td>
                              <td className="text-right p-3 font-medium">{formatCurrency(p.income)}</td>
                              <td className="text-right p-3 text-emerald-600 dark:text-emerald-500">
                                -{formatCurrency(p.compulsoryRepayment)}
                              </td>
                              <td className="text-right p-3 text-emerald-600 dark:text-emerald-500">
                                {p.voluntaryRepayment > 0 ? `-${formatCurrency(p.voluntaryRepayment)}` : '—'}
                              </td>
                              <td className="text-right p-3 text-red-600 dark:text-red-500">
                                {p.indexation > 0 ? `+${formatCurrency(p.indexation)}` : '—'}
                              </td>
                              <td className="text-right p-3 font-semibold">{formatCurrency(p.endingBalance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm space-y-2">
                        <p className="font-medium text-blue-900 dark:text-blue-100">Planning Tip</p>
                        <p className="text-blue-800 dark:text-blue-200">
                          Make voluntary repayments before June 1 to reduce your balance before annual indexation is applied. 
                          This can significantly reduce the total amount paid over time.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <ExportShareButtons
                  calculatorType="au-student-loan"
                  inputs={{
                    year,
                    currentBalance: parseFloat(currentBalance),
                    annualIncome: parseFloat(annualIncome),
                  }}
                  results={result}
                  title="HELP Loan Projection Results"
                />
              </div>
            ) : (
              <Card className="h-full min-h-[500px] flex items-center justify-center">
                <CardContent className="text-center">
                  <div className="p-4 bg-muted rounded-full w-fit mx-auto mb-4">
                    <TrendingDown className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Project</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Enter your loan details to see your payoff timeline and plan your repayment strategy
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">HELP Loan Projection Calculator: Complete Guide</h2>
          
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">Understanding HELP Debt</h3>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            HELP (Higher Education Loan Program) is Australia's student loan system. It includes:
          </p>
          <ul className="space-y-2 text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6 ml-6">
            <li><strong className="text-gray-900 dark:text-gray-100">HECS-HELP:</strong> For Commonwealth supported places</li>
            <li><strong className="text-gray-900 dark:text-gray-100">FEE-HELP:</strong> For full-fee paying students</li>
            <li><strong className="text-gray-900 dark:text-gray-100">OS-HELP:</strong> For overseas study components</li>
            <li><strong className="text-gray-900 dark:text-gray-100">VET Student Loans:</strong> For vocational education</li>
          </ul>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
            All operate under similar repayment rules, with compulsory repayments based on income and annual indexation on June 1.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">Compulsory Repayments</h3>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            Compulsory HELP repayments are calculated as a percentage of your repayment income (taxable income plus certain other amounts).
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 dark:border-blue-500 p-4 rounded-lg my-6">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-lg">2024-25 Repayment Rates</p>
            <table className="w-full border border-gray-300 dark:border-gray-600 my-3 text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-gray-900 dark:text-gray-100">Income Range</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-gray-900 dark:text-gray-100">Repayment Rate</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">Below $54,435</td><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">Nil</td></tr>
                <tr><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">$54,435 – $62,850</td><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">1%</td></tr>
                <tr><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">$62,851 – $66,620</td><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">2%</td></tr>
                <tr><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">...</td><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">Increases progressively</td></tr>
                <tr><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">$159,664+</td><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">10%</td></tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 dark:border-amber-500 p-4 rounded-lg my-6">
            <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1 text-base">⚠️ 2025-26 Change</p>
            <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
              The ATO will introduce a marginal repayment method, calculating repayments on income within each band rather than applying a single rate to total income. This eliminates the "cliff effect" where crossing a threshold sharply increases repayments.
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">Indexation</h3>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            HELP debts are indexed annually on June 1 to maintain real value. The indexation rate equals the Consumer Price Index (CPI) for the preceding 12 months to March:
          </p>
          
          <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-lg my-6">
            <p className="font-semibold text-red-900 dark:text-red-100 mb-2 text-base">Recent Indexation Rates</p>
            <ul className="space-y-1 text-red-800 dark:text-red-200 text-sm">
              <li><strong>2024:</strong> 4.8% (highest in decades due to inflation)</li>
              <li><strong>2023:</strong> 7.1% (record high, subsequently reduced to 3.2% retroactively)</li>
              <li><strong>Historical average:</strong> 2-3%</li>
            </ul>
          </div>
          
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
            Indexation applies to your outstanding balance on June 1, <em>after</em> any voluntary repayments made before this date but <em>before</em> compulsory repayments are credited (which occur throughout the year via PAYG withholding).
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">Voluntary Repayments</h3>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            You can make voluntary HELP repayments at any time through myGov or BPAY. Benefits:
          </p>
          <ul className="space-y-2 text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4 ml-6">
            <li><strong className="text-gray-900 dark:text-gray-100">Avoid indexation:</strong> Payments before June 1 reduce the balance subject to indexation</li>
            <li><strong className="text-gray-900 dark:text-gray-100">Accelerate payoff:</strong> Extra payments directly reduce principal</li>
            <li><strong className="text-gray-900 dark:text-gray-100">No bonus:</strong> Unlike the past, there's no longer a 5% or 10% bonus for voluntary payments</li>
          </ul>
          
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-400 dark:border-emerald-500 p-4 rounded-lg my-6">
            <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1 text-base">💡 Strategic Timing</p>
            <p className="text-emerald-800 dark:text-emerald-200 text-sm leading-relaxed">
              Make voluntary payments in May to maximize the reduction in balance before June 1 indexation.
            </p>
          </div>

          <details className="my-6 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <summary className="cursor-pointer font-semibold text-lg text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Should I Pay Extra?
            </summary>
            <div className="p-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 space-y-3">
              <p>Consider these factors:</p>
              <ul className="space-y-2 ml-6">
                <li><strong className="text-gray-900 dark:text-gray-100">Indexation vs investment returns:</strong> If CPI is 4% but you can earn 6% after-tax investing, investing may be better</li>
                <li><strong className="text-gray-900 dark:text-gray-100">Peace of mind:</strong> Being debt-free has psychological value beyond math</li>
                <li><strong className="text-gray-900 dark:text-gray-100">Income trajectory:</strong> If your income will rise significantly, compulsory repayments will accelerate anyway</li>
                <li><strong className="text-gray-900 dark:text-gray-100">Overseas plans:</strong> HELP debt remains if you move overseas (and accrues indexation), so paying it off before emigrating may be wise</li>
              </ul>
            </div>
          </details>

          <details className="my-6 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <summary className="cursor-pointer font-semibold text-lg text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Indexation vs Interest
            </summary>
            <div className="p-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 space-y-3">
              <p>HELP debts don't charge "interest" in the traditional sense—they're indexed to inflation. Key differences:</p>
              <ul className="space-y-2 ml-6">
                <li>Indexation preserves the real value of the debt; you're not "profiting" by delaying repayment in real terms</li>
                <li>Indexation can't compound—it's applied once per year on a fixed date</li>
                <li>Traditional loans charge interest regardless of inflation; HELP only adjusts for CPI</li>
              </ul>
            </div>
          </details>

          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">Using This Calculator</h3>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            This tool projects your HELP balance year-by-year based on:
          </p>
          <ul className="space-y-2 text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4 ml-6">
            <li><strong className="text-gray-900 dark:text-gray-100">Current balance:</strong> Check myGov for your accurate balance</li>
            <li><strong className="text-gray-900 dark:text-gray-100">Income growth:</strong> Conservative estimates: 2-3%; career progression: 4-6%</li>
            <li><strong className="text-gray-900 dark:text-gray-100">Indexation rate:</strong> Use historical average (2.5%) or recent figures (4-5%)</li>
            <li><strong className="text-gray-900 dark:text-gray-100">Voluntary repayments:</strong> Consistent annual extra payments</li>
          </ul>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
            The projection assumes constant voluntary payments and steady income growth. Real-life income varies, so treat this as a planning tool, not a guarantee.
          </p>

          <details className="my-6 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <summary className="cursor-pointer font-semibold text-lg text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Example Scenarios
            </summary>
            <div className="p-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 space-y-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Scenario 1: No Extra Payments</h4>
                <ul className="space-y-1 ml-6">
                  <li>Balance: $30,000</li>
                  <li>Income: $75,000 (3% growth/year)</li>
                  <li>Indexation: 3%</li>
                  <li>Compulsory repayment: ~$3,000/year initially</li>
                  <li><strong className="text-gray-900 dark:text-gray-100">Payoff:</strong> ~14 years</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Scenario 2: $2,000/Year Voluntary</h4>
                <ul className="space-y-1 ml-6">
                  <li>Same as above + $2,000 voluntary</li>
                  <li><strong className="text-gray-900 dark:text-gray-100">Payoff:</strong> ~8 years</li>
                  <li><strong className="text-gray-900 dark:text-gray-100">Savings:</strong> ~$4,000 in indexation</li>
                </ul>
              </div>
            </div>
          </details>

          <details className="my-6 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <summary className="cursor-pointer font-semibold text-lg text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Frequently Asked Questions
            </summary>
            <div className="p-4 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Can I check my HELP balance?</h4>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Yes, log in to myGov and link to the ATO. Your HELP balance is displayed under "Debt account."
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">What happens if I move overseas?</h4>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  You must register with the ATO and continue making repayments if your worldwide income exceeds the threshold. Failure to do so incurs penalties. Your debt continues to index annually.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Does HELP debt affect my credit score?</h4>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  HELP debt doesn't appear on credit reports, but lenders may ask about it when assessing borrowing capacity for mortgages, as it reduces disposable income.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Can I defer HELP repayments?</h4>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  No. If your income is below the threshold, you don't pay. If above, repayment is compulsory. There are no hardship deferrals as with commercial loans.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">What if I never earn above the threshold?</h4>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Your debt remains but you make no compulsory repayments. It continues to index annually. The debt is not forgiven and persists indefinitely (except in case of death or permanent disability).
                </p>
              </div>
            </div>
          </details>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-3">References</h3>
          <ul className="space-y-2 text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6 ml-6">
            <li><a href="https://www.ato.gov.au/individuals-and-families/education-and-training/help-hecs-and-other-study-loans/help-repayment" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">ATO HELP Repayment</a></li>
            <li><a href="https://www.studyassist.gov.au/paying-back-your-loan/loan-repayment" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">StudyAssist Loan Repayment Guide</a></li>
            <li><a href="https://www.ato.gov.au/Rates/HELP,-VSL-and-TSL-repayment-thresholds-and-rates/" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">ATO HELP Repayment Thresholds</a></li>
          </ul>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 rounded-lg my-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Disclaimer</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              This calculator provides estimates based on ATO HELP repayment schedules and your input assumptions. Actual outcomes depend on income variations, indexation rates, and policy changes. This is not financial advice—consult a financial planner for personalized strategies.
            </p>
          </div>
        </div>
      </div>
    </CalculatorLayoutWithAds>
  );
}