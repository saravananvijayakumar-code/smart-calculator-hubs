// @ts-nocheck
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, TrendingUp, DollarSign, Calculator, Info, FileText, HelpCircle, Award, Wallet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { BonusWithholdingResponse } from '~backend/au-tax/types';
import { SEOHead } from '@/components/SEOHead';
import ExportShareButtons from '@/components/ExportShareButtons';
import TopBannerAd from '@/components/ads/TopBannerAd';
import InFeedAd from '@/components/ads/InFeedAd';
import MidContentAd from '@/components/ads/MidContentAd';
import SidebarAd from '@/components/ads/SidebarAd';
import BottomStickyAd from '@/components/ads/BottomStickyAd';

export default function BonusTaxCalculatorAustralia() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BonusWithholdingResponse | null>(null);

  const [year, setYear] = useState('2024-25');
  const [regularGross, setRegularGross] = useState('3000');
  const [payPeriod, setPayPeriod] = useState<'weekly' | 'fortnightly' | 'monthly' | 'annual'>('fortnightly');
  const [bonusAmount, setBonusAmount] = useState('5000');
  const [residency, setResidency] = useState<'resident' | 'non-resident' | 'whm'>('resident');
  const [claimTFT, setClaimTFT] = useState(true);
  const [hasHelp, setHasHelp] = useState(false);
  const [method, setMethod] = useState<'A' | 'B'>('B');

  const calculate = async () => {
    try {
      setLoading(true);
      const response = await backend.au_tax.bonusWithholding({
        year,
        regularGross: parseFloat(regularGross) || 0,
        payPeriod,
        bonusAmount: parseFloat(bonusAmount) || 0,
        residency,
        claimTaxFreeThreshold: claimTFT,
        hasHelp,
        method,
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Calculation Error',
        description: 'Failed to calculate bonus withholding.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <SEOHead
        title="Bonus Tax Calculator Australia | ATO Schedule 5 Withholding"
        description="Calculate PAYG withholding on bonuses, commissions, and back-pay using ATO Schedule 5 methods. Accurate bonus tax calculator for Australian residents and non-residents."
        keywords="bonus tax calculator Australia, commission tax calculator, back pay tax, ATO Schedule 5, bonus withholding calculator"
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Bonus Tax Calculator</h1>
              <p className="text-muted-foreground mt-1">
                ATO Schedule 5 withholding for bonuses, commissions & back-pay • FY {year}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Schedule 5 Certified
            </div>
            <div className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
              Method A & B Supported
            </div>
          </div>
        </div>

        <TopBannerAd />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-background to-background border-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Bonus & Payment Details</h2>
                  <p className="text-sm text-muted-foreground">Enter your bonus and regular pay information</p>
                </div>
                <Award className="w-8 h-8 text-primary opacity-50" />
              </div>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bonusAmount" className="text-sm font-medium">Bonus / Commission Amount</Label>
                    <div className="relative mt-1.5">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="bonusAmount"
                        type="number"
                        value={bonusAmount}
                        onChange={(e) => setBonusAmount(e.target.value)}
                        placeholder="5000"
                        className="pl-9 h-11 text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="regularGross" className="text-sm font-medium">Regular Gross Pay (per period)</Label>
                    <div className="relative mt-1.5">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="regularGross"
                        type="number"
                        value={regularGross}
                        onChange={(e) => setRegularGross(e.target.value)}
                        placeholder="3000"
                        className="pl-9 h-11 text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="year" className="text-sm font-medium">Tax Year</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger id="year" className="mt-1.5 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="payPeriod" className="text-sm font-medium">Pay Period</Label>
                    <Select value={payPeriod} onValueChange={(v: any) => setPayPeriod(v)}>
                      <SelectTrigger id="payPeriod" className="mt-1.5 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="fortnightly">Fortnightly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="residency" className="text-sm font-medium">Residency</Label>
                    <Select value={residency} onValueChange={(v: any) => setResidency(v)}>
                      <SelectTrigger id="residency" className="mt-1.5 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resident">Resident</SelectItem>
                        <SelectItem value="non-resident">Non-Resident</SelectItem>
                        <SelectItem value="whm">WHM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {residency === 'resident' && (
                  <div className="pt-4 border-t space-y-4">
                    <div>
                      <Label htmlFor="method" className="text-sm font-medium">Withholding Method</Label>
                      <Select value={method} onValueChange={(v: any) => setMethod(v)}>
                        <SelectTrigger id="method" className="mt-1.5 h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B">Method B - Annualised (Recommended)</SelectItem>
                          <SelectItem value="A">Method A - Flat 47%</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-2 flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span>Method B calculates more accurate withholding based on your regular income</span>
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <div>
                          <Label htmlFor="claimTFT" className="font-medium cursor-pointer">Tax-Free Threshold</Label>
                          <p className="text-xs text-muted-foreground">PAYG Scale 2</p>
                        </div>
                        <Switch id="claimTFT" checked={claimTFT} onCheckedChange={setClaimTFT} />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <div>
                          <Label htmlFor="hasHelp" className="font-medium cursor-pointer">HELP/HECS Debt</Label>
                          <p className="text-xs text-muted-foreground">Student loan</p>
                        </div>
                        <Switch id="hasHelp" checked={hasHelp} onCheckedChange={setHasHelp} />
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={calculate} disabled={loading} className="w-full mt-6" size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Bonus Withholding
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {result ? (
              <div className="space-y-6">
                <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-2 border-green-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm text-green-700 dark:text-green-400 font-medium mb-1">Your Net Bonus</div>
                      <div className="text-5xl font-bold text-green-600 dark:text-green-500 mb-2">
                        {formatCurrency(result.netBonus)}
                      </div>
                      <div className="text-sm text-green-600/80 dark:text-green-400/80">After tax withholding</div>
                    </div>
                    <div className="p-3 bg-green-600/10 rounded-full">
                      <Wallet className="w-8 h-8 text-green-600 dark:text-green-500" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">Withholding Breakdown</h3>
                  </div>

                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-4 mt-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-3 border-b">
                          <span className="font-medium">Gross Bonus</span>
                          <span className="text-xl font-bold">{formatCurrency(result.bonusAmount)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <Calculator className="w-4 h-4" />
                            Tax Withheld ({result.withholdingRate.toFixed(1)}%)
                          </span>
                          <span className="font-semibold text-red-600">-{formatCurrency(result.withholdingAmount)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-3 border-t-2 font-semibold text-lg">
                          <span>Net Bonus</span>
                          <span className="text-green-600">{formatCurrency(result.netBonus)}</span>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                        <div className="text-sm font-medium mb-2">Withholding Rate</div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-3xl font-bold text-primary">{result.withholdingRate.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">of gross bonus</div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4 mt-6">
                      <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Method {result.method} Used</h4>
                            <p className="text-sm text-blue-800 dark:text-blue-200">{result.explanation}</p>
                          </div>
                        </div>
                      </Card>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Regular Pay ({payPeriod})</span>
                          <span className="font-semibold">{formatCurrency(parseFloat(regularGross))}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Bonus Payment</span>
                          <span className="font-semibold">{formatCurrency(result.bonusAmount)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-t">
                          <span className="text-muted-foreground">Residency Status</span>
                          <span className="font-semibold">{residency === 'resident' ? 'Australian Resident' : residency === 'non-resident' ? 'Non-Resident' : 'Working Holiday Maker'}</span>
                        </div>
                        {residency === 'resident' && (
                          <>
                            <div className="flex justify-between py-2">
                              <span className="text-muted-foreground">Tax-Free Threshold</span>
                              <span className="font-semibold">{claimTFT ? 'Claimed' : 'Not Claimed'}</span>
                            </div>
                            {hasHelp && (
                              <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">HELP Debt</span>
                                <span className="font-semibold">Yes</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>

                <div className="grid sm:grid-cols-3 gap-4">
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{formatCurrency(result.netBonus)}</div>
                    <div className="text-xs text-muted-foreground mt-1">Take-home amount</div>
                  </Card>
                  
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                    <Calculator className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{result.withholdingRate.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground mt-1">Withholding rate</div>
                  </Card>
                  
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{((result.netBonus / result.bonusAmount) * 100).toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground mt-1">Net to gross</div>
                  </Card>
                </div>

                <ExportShareButtons
                  calculatorType="au-bonus-tax"
                  inputs={{
                    year,
                    bonusAmount: parseFloat(bonusAmount),
                    regularGross: parseFloat(regularGross),
                    payPeriod,
                  }}
                  results={result}
                  title="Bonus Tax Calculator Results"
                />
              </div>
            ) : (
              <Card className="p-12 flex flex-col items-center justify-center text-center min-h-[400px] bg-gradient-to-br from-muted/30 to-background">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Award className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Calculate</h3>
                <p className="text-muted-foreground max-w-md">
                  Enter your bonus and regular pay details above to calculate your take-home amount after tax withholding
                </p>
              </Card>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              <SidebarAd />
              
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-2 mb-3">
                  <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <h3 className="font-semibold text-sm">Quick Tips</h3>
                </div>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>• Method B provides more accurate withholding than Method A</li>
                  <li>• Method A withholds at the top rate (47%)</li>
                  <li>• Bonuses are added to total income at tax time</li>
                  <li>• Over-withholding results in a refund when you file</li>
                  <li>• HELP repayments increase with bonus income</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>

        {result && <InFeedAd />}
        <MidContentAd />

        <Card className="mt-12 p-8">
          <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="guide">Guide</TabsTrigger>
              <TabsTrigger value="methods">Methods</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="guide" className="prose prose-sm max-w-none dark:prose-invert">
          <h2 className="text-2xl font-bold mb-4">Bonus & Commission Tax Calculator: Complete Guide</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">How Bonus Withholding Works</h3>
          <p className="text-muted-foreground">
            When you receive a bonus, commission, or back-payment, your employer must withhold PAYG tax according to ATO Schedule 5. Unlike regular pay, bonuses are irregular payments that can push you into a higher tax bracket for that pay period, so special withholding methods apply.
          </p>
            </TabsContent>

            <TabsContent value="methods" className="prose prose-sm max-w-none dark:prose-invert">
          <h3 className="text-xl font-semibold mb-4">ATO Schedule 5 Methods</h3>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Method A: Flat Top Rate (47%)</h4>
          <p className="text-muted-foreground">
            The simplest method applies the top marginal tax rate (45% + 2% Medicare levy = 47%) to the entire bonus. This ensures sufficient tax is withheld but often results in over-withholding, which you'll reclaim as a refund at tax time.
          </p>
          <p className="text-sm"><strong>When to use:</strong> Quick calculations, one-off large bonuses, or when regular income data isn't available.</p>

          <h4 className="text-lg font-semibold mt-6 mb-2">Method B: Annualised Income (Recommended)</h4>
          <p className="text-muted-foreground">
            Method B calculates withholding by comparing annualised income with and without the bonus:
          </p>
          <ol className="space-y-1">
            <li>Calculate annual PAYG withholding based on regular pay</li>
            <li>Calculate annual PAYG withholding on regular pay + bonus</li>
            <li>The difference is withheld from the bonus</li>
          </ol>
          <p className="text-muted-foreground">
            This method is more accurate because it accounts for your actual marginal tax rate, avoiding excessive over-withholding. Most employers use Method B for regular bonuses and commissions.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Non-Residents and Working Holiday Makers</h3>
          <p className="text-muted-foreground">
            For non-residents and WHMs, bonus withholding uses flat rates:
          </p>
          <ul className="space-y-1">
            <li><strong>Non-residents:</strong> 30% withholding on bonuses</li>
            <li><strong>Working Holiday Makers:</strong> 15% withholding (aligned with their first-tier rate)</li>
          </ul>
          <p className="text-sm text-muted-foreground">No Method A/B choice—flat rates always apply per ATO Schedule 5.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Common Bonus Types</h3>
          <ul className="space-y-2">
            <li><strong>Annual Performance Bonus:</strong> Lump sum based on individual or company performance</li>
            <li><strong>Sales Commission:</strong> Variable pay based on sales targets</li>
            <li><strong>Sign-On Bonus:</strong> One-time payment for joining a company</li>
            <li><strong>Back-Pay:</strong> Arrears from salary increases or award adjustments</li>
            <li><strong>Retention Bonus:</strong> Incentive to stay with employer for a specified period</li>
          </ul>
          <p className="text-sm text-muted-foreground">All are treated the same under Schedule 5 withholding rules.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">HELP Debt Considerations</h3>
          <p className="text-muted-foreground">
            If you have a HELP/HECS debt, bonuses increase your repayment income, potentially triggering or increasing your compulsory repayment. PAYG withholding on bonuses includes an additional component for HELP repayments when applicable.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Tax Time Adjustments</h3>
          <p className="text-muted-foreground">
            Bonus withholding is an <em>estimate</em>. At tax time, your bonus is simply added to your total assessable income and taxed at your marginal rate with all deductions and offsets applied. If too much was withheld (common with Method A), you'll receive a refund. If too little (rare), you'll owe the ATO.
          </p>
            </TabsContent>

            <TabsContent value="examples" className="prose prose-sm max-w-none dark:prose-invert">
          <h3 className="text-xl font-semibold mb-4">Example Scenarios</h3>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Example 1: $10,000 Bonus (Resident, Method B)</h4>
          <div className="bg-muted/50 p-4 rounded-lg">
            <ul className="space-y-1">
              <li>Regular fortnightly pay: $3,000 ($78,000/year)</li>
              <li>Bonus: $10,000</li>
              <li>Annual income without bonus: $78,000 → PAYG ~$14,500</li>
              <li>Annual income with bonus: $88,000 → PAYG ~$18,200</li>
              <li className="font-semibold text-primary">Bonus withholding: $18,200 - $14,500 = $3,700 (37%)</li>
              <li className="font-semibold text-green-600">Net bonus: $10,000 - $3,700 = $6,300</li>
            </ul>
          </div>

          <h4 className="text-lg font-semibold mt-6 mb-2">Example 2: Same Bonus, Method A</h4>
          <div className="bg-muted/50 p-4 rounded-lg">
            <ul className="space-y-1">
              <li>Withholding: $10,000 × 47% = $4,700</li>
              <li className="font-semibold text-green-600">Net bonus: $5,300</li>
              <li className="font-semibold text-blue-600">Likely refund at tax time: ~$1,000</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Employer Obligations</h3>
          <p className="text-muted-foreground">Employers must:</p>
          <ul className="space-y-1">
            <li>Apply Schedule 5 withholding rules to all bonuses and commissions</li>
            <li>Report bonus payments on employee payslips and PAYG summaries</li>
            <li>Remit withheld amounts to the ATO</li>
            <li>Use either Method A or B consistently for similar payment types</li>
          </ul>
            </TabsContent>

            <TabsContent value="faq" className="prose prose-sm max-w-none dark:prose-invert">
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Which method will my employer use?</h4>
          <p className="text-muted-foreground">
            Most employers use Method B for accuracy, but some payroll systems default to Method A for simplicity. Check your payslip or ask your payroll team.
          </p>

          <h4 className="text-lg font-semibold mt-4 mb-2">Can I choose the withholding method?</h4>
          <p className="text-muted-foreground">
            No—the employer decides, though you can request they use Method B if they currently use A. The ATO allows both methods.
          </p>

          <h4 className="text-lg font-semibold mt-4 mb-2">Why is my bonus taxed so heavily?</h4>
          <p className="text-muted-foreground">
            It's not "taxed more"—it's <em>withheld</em> at a higher rate because it's treated as additional income on top of your regular pay. The withholding rate approximates your marginal rate. Final tax is calculated normally at year-end.
          </p>

          <h4 className="text-lg font-semibold mt-4 mb-2">Can I salary sacrifice my bonus to super?</h4>
          <p className="text-muted-foreground">
            Yes, if your employer agrees. Salary sacrificing part or all of your bonus to super reduces taxable income and PAYG withholding, though you'll pay 15% contributions tax in your super fund instead.
          </p>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="mt-8 p-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h3 className="text-lg font-semibold mb-4">References & Further Reading</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/paying-your-workers/withholding-from-payments-to-employees/payg-withholding/schedule-5-tax-table-for-back-payments-commissions-bonuses-and-similar-payments" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ATO Schedule 5: Tax Table for Bonuses & Commissions
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/paying-your-workers/withholding-from-payments-to-employees/payg-withholding" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ATO PAYG Withholding Guide
                </a>
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              This calculator provides estimates based on ATO Schedule 5 formulas. Actual withholding may vary based on your employer's payroll system and specific circumstances. This is not tax advice—consult a registered tax agent for advice specific to your situation.
            </p>
          </div>
        </Card>
      </div>

      <BottomStickyAd />
    </>
  );
}