// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, DollarSign, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { UnusedLeaveWithholdingResponse } from '~backend/au-tax/types';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import ExportShareButtons from '@/components/ExportShareButtons';
import { formatCurrency } from '@/utils/formatting';

export default function UnusedLeaveCalculatorAustralia() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UnusedLeaveWithholdingResponse | null>(null);

  const [year, setYear] = useState('2024-25');
  const [unusedLeaveAmount, setUnusedLeaveAmount] = useState('15000');
  const [ytdGross, setYtdGross] = useState('60000');
  const [residency, setResidency] = useState<'resident' | 'non-resident' | 'whm'>('resident');
  const [claimTFT, setClaimTFT] = useState(true);
  const [hasHelp, setHasHelp] = useState(false);

  const calculate = async () => {
    try {
      setLoading(true);
      const response = await backend.au_tax.leaveWithholding({
        year,
        unusedLeaveAmount: parseFloat(unusedLeaveAmount) || 0,
        ytdGross: parseFloat(ytdGross) || 0,
        residency,
        claimTaxFreeThreshold: claimTFT,
        hasHelp,
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Calculation Error',
        description: 'Failed to calculate leave withholding.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CalculatorLayoutWithAds
      title="Unused Leave Tax Calculator"
      description="Calculate PAYG withholding on unused annual leave & termination payments (ATO Schedule 7)"
      keywords="unused leave tax calculator, termination payment tax, annual leave payout tax, ATO Schedule 7, leave loading tax calculator Australia"
    >
      <div className="max-w-7xl mx-auto">


        <div className="grid lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Leave Payment Details
              </CardTitle>
              <CardDescription>Enter your termination payment information</CardDescription>
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
                    <SelectItem value="2025-26">2025-26</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="unusedLeaveAmount" className="text-sm font-medium">
                  Unused Leave Payment
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="unusedLeaveAmount"
                    type="number"
                    value={unusedLeaveAmount}
                    onChange={(e) => setUnusedLeaveAmount(e.target.value)}
                    placeholder="15000"
                    className="pl-7"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Total unused annual leave payout (including leave loading if applicable)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ytdGross" className="text-sm font-medium">
                  Year-to-Date Gross Earnings
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="ytdGross"
                    type="number"
                    value={ytdGross}
                    onChange={(e) => setYtdGross(e.target.value)}
                    placeholder="60000"
                    className="pl-7"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Total gross income earned this financial year before the leave payment
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="residency" className="text-sm font-medium">Residency Status</Label>
                <Select value={residency} onValueChange={(v: any) => setResidency(v)}>
                  <SelectTrigger id="residency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resident">Australian Resident</SelectItem>
                    <SelectItem value="non-resident">Non-Resident</SelectItem>
                    <SelectItem value="whm">Working Holiday Maker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {residency === 'resident' && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="claimTFT" className="text-sm font-medium">
                        Claim Tax-Free Threshold
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        First $18,200 of income is tax-free
                      </p>
                    </div>
                    <Switch id="claimTFT" checked={claimTFT} onCheckedChange={setClaimTFT} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="hasHelp" className="text-sm font-medium">
                        HELP/HECS/VSL Debt
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Student loan repayment required
                      </p>
                    </div>
                    <Switch id="hasHelp" checked={hasHelp} onCheckedChange={setHasHelp} />
                  </div>
                </div>
              )}

              <Button onClick={calculate} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Calculate Leave Tax
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            {result ? (
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-500" />
                      Net Leave Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold text-purple-600 dark:text-purple-500 mb-1">
                      {formatCurrency(result.netLeave)}
                    </div>
                    <div className="text-muted-foreground">After tax withholding</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      Withholding Breakdown
                    </CardTitle>
                    <CardDescription>Detailed tax calculation for your leave payment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b">
                        <span className="font-medium">Gross Leave Payment</span>
                        <span className="text-xl font-semibold">{formatCurrency(result.leaveAmount)}</span>
                      </div>
                      
                      <div className="space-y-3 py-2">
                        <div className="flex justify-between items-center text-muted-foreground">
                          <div>
                            <div className="text-sm">Tax Withheld</div>
                            <div className="text-xs">
                              Effective rate: <Badge variant="secondary" className="text-xs ml-1">
                                {result.withholdingRate.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                          <span className="text-red-600 dark:text-red-500 font-medium">
                            -{formatCurrency(result.withholdingAmount)}
                          </span>
                        </div>
                      </div>

                      <Separator />
                      
                      <div className="flex justify-between items-center py-3 bg-purple-50 dark:bg-purple-950/20 px-4 rounded-lg -mx-2">
                        <span className="font-semibold text-lg">Net Leave Payment</span>
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-500">
                          {formatCurrency(result.netLeave)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                      ATO Schedule 7 Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{result.explanation}</p>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Payment Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Leave Payment</span>
                        <span className="font-medium">{formatCurrency(result.leaveAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">YTD Gross</span>
                        <span className="font-medium">{formatCurrency(parseFloat(ytdGross))}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total Income</span>
                        <span>{formatCurrency(result.leaveAmount + parseFloat(ytdGross))}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="pt-6">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm space-y-1">
                          <p className="font-medium text-amber-900 dark:text-amber-100">Tax Time</p>
                          <p className="text-amber-800 dark:text-amber-200 text-xs">
                            This withholding is an estimate. Your final tax liability will be calculated when you lodge your return.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <ExportShareButtons
                  calculatorType="au-unused-leave"
                  inputs={{
                    year,
                    unusedLeaveAmount: parseFloat(unusedLeaveAmount),
                    ytdGross: parseFloat(ytdGross),
                  }}
                  results={result}
                  title="Unused Leave Tax Calculator Results"
                />
              </div>
            ) : (
              <Card className="h-full min-h-[500px] flex items-center justify-center">
                <CardContent className="text-center">
                  <div className="p-4 bg-muted rounded-full w-fit mx-auto mb-4">
                    <FileText className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Calculate</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Enter your leave payment details to calculate tax withholding using ATO Schedule 7
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Unused Leave Tax Calculator: Complete Guide</h2>
          
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">What is Unused Leave?</h3>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            Unused annual leave (also called annual leave on termination) is the payout you receive for accrued but untaken annual leave when you cease employment. This can include:
          </p>
          <ul className="space-y-2 text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6 ml-6">
            <li><strong className="text-gray-900 dark:text-gray-100">Unused annual leave:</strong> Standard leave accrual</li>
            <li><strong className="text-gray-900 dark:text-gray-100">Leave loading:</strong> Additional 17.5% payment (if applicable under your award/agreement)</li>
            <li><strong className="text-gray-900 dark:text-gray-100">Long service leave:</strong> Treated differently—not covered by Schedule 7 in all cases</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">How Schedule 7 Withholding Works</h3>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            The ATO requires employers to use the <strong className="text-gray-900 dark:text-gray-100">annualised income method</strong> when calculating PAYG withholding on unused leave payments:
          </p>
          
          <div className="bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-400 dark:border-purple-500 p-4 rounded-lg my-6">
            <p className="font-semibold text-purple-900 dark:text-purple-100 mb-3 text-lg">📋 Step-by-Step Method</p>
            <ol className="space-y-2 text-purple-800 dark:text-purple-200 text-sm ml-6 list-decimal">
              <li>Add the leave payment to your year-to-date (YTD) gross earnings</li>
              <li>Calculate the annualised PAYG withholding on the total</li>
              <li>Subtract the PAYG already withheld on YTD earnings</li>
              <li>The difference is withheld from the leave payment</li>
            </ol>
            <p className="text-purple-800 dark:text-purple-200 text-sm mt-3">
              This method ensures withholding reflects your actual marginal tax rate based on total annual income.
            </p>
          </div>

          <details className="my-6 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <summary className="cursor-pointer font-semibold text-lg text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Non-Residents and Working Holiday Makers
            </summary>
            <div className="p-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 space-y-3">
              <p>For non-residents and Working Holiday Makers, unused leave withholding uses flat rates per ATO Schedule 7:</p>
              <table className="w-full border border-gray-300 dark:border-gray-600 my-3 text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-gray-900 dark:text-gray-100">Residency Status</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-gray-900 dark:text-gray-100">Withholding Rate</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">Non-residents</td><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">32%</td></tr>
                  <tr><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">Working Holiday Makers</td><td className="border border-gray-300 dark:border-gray-600 px-3 py-2">15%</td></tr>
                </tbody>
              </table>
            </div>
          </details>

          <details className="my-6 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <summary className="cursor-pointer font-semibold text-lg text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Leave Loading
            </summary>
            <div className="p-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 space-y-3">
              <p>Many awards and enterprise agreements provide a 17.5% leave loading on annual leave. When paid on termination:</p>
              <ul className="space-y-2 ml-6">
                <li>The entire amount (base leave + loading) is subject to PAYG withholding</li>
                <li>Leave loading is <em>not</em> taxed differently—it's treated as ordinary income</li>
                <li>Include the loading in your "unused leave amount" input</li>
              </ul>
            </div>
          </details>

          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 dark:border-blue-500 p-4 rounded-lg my-6">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-base">💡 Genuine Redundancy vs Regular Termination</p>
            <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
              Unused annual leave is always taxed the same way regardless of termination reason. However, <em>other</em> termination payments may qualify for concessional tax treatment under genuine redundancy rules (not covered by this calculator). Consult a tax professional for complex redundancy scenarios.
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">Example Calculation</h3>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-5 rounded-lg my-6">
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-base">Scenario: You resign in March with $60,000 YTD earnings and $15,000 unused leave.</p>
            <ol className="space-y-2 text-gray-700 dark:text-gray-300 text-sm ml-6 list-decimal">
              <li>YTD earnings: <strong className="text-gray-900 dark:text-gray-100">$60,000</strong></li>
              <li>Unused leave: <strong className="text-gray-900 dark:text-gray-100">$15,000</strong></li>
              <li>Total income: <strong className="text-gray-900 dark:text-gray-100">$75,000</strong></li>
              <li>Annualised PAYG on $75,000: ~$13,200 (resident, claiming TFT)</li>
              <li>Annualised PAYG on $60,000: ~$9,500</li>
              <li>Withholding on leave: $13,200 - $9,500 = <strong className="text-emerald-600 dark:text-emerald-400">$3,700</strong></li>
              <li>Net leave payment: $15,000 - $3,700 = <strong className="text-emerald-600 dark:text-emerald-400">$11,300</strong></li>
            </ol>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">Tax Time Treatment</h3>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
            At tax time, unused leave is added to your assessable income and taxed at your marginal rate like any other employment income. PAYG withheld on the leave payment counts toward your total withholding credits. If too much was withheld, you'll receive a refund; if too little, you'll owe the difference.
          </p>

          <details className="my-6 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <summary className="cursor-pointer font-semibold text-lg text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Common Scenarios
            </summary>
            <div className="p-4 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Mid-Year Resignation</h4>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  If you resign mid-year and don't work again that year, the withholding rate on your leave may be higher than your final tax liability because it assumes full-year employment. You'll likely receive a refund when you lodge your return.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Immediate New Job</h4>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  If you start a new job immediately, your total annual income will be higher than your previous employer estimated, potentially resulting in under-withholding. Ensure your new employer withholds correctly to avoid a tax bill.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Multiple Jobs in One Year</h4>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  If you've had multiple jobs, sum all YTD earnings across all employers. The ATO calculates your final tax on total income, so accurate YTD figures ensure correct withholding estimates.
                </p>
              </div>
            </div>
          </details>

          <details className="my-6 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <summary className="cursor-pointer font-semibold text-lg text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Employer Obligations
            </summary>
            <div className="p-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 space-y-3">
              <p>Employers must:</p>
              <ul className="space-y-2 ml-6">
                <li>Apply Schedule 7 withholding to all unused leave payments on termination</li>
                <li>Report leave payments separately on the employee's PAYG payment summary</li>
                <li>Use the annualised method based on YTD earnings + leave payment</li>
                <li>Remit withheld tax to the ATO as per normal PAYG schedules</li>
              </ul>
            </div>
          </details>

          <details className="my-6 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <summary className="cursor-pointer font-semibold text-lg text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Frequently Asked Questions
            </summary>
            <div className="p-4 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Is unused leave taxed more than regular pay?</h4>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  No. It's taxed at your marginal rate. The withholding <em>rate</em> may appear high because it's calculated based on your total annual income, but the final tax is the same as if you'd taken the leave during employment.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Can I split my leave payment across financial years?</h4>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Generally no. Leave is paid when employment ceases, which determines the financial year. However, if termination occurs near year-end, timing may affect which year it's assessable—consult your employer or tax agent.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">What if I had no other income this year?</h4>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Enter $0 for YTD gross earnings. Withholding will be calculated based solely on the leave payment, likely resulting in lower withholding due to access to the full tax-free threshold (if resident and claiming TFT).
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Does leave loading affect my tax?</h4>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Leave loading increases your total assessable income, so yes—it increases your tax liability proportionally. But it's not taxed at a special rate; it's simply added to your total income.
                </p>
              </div>
            </div>
          </details>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-3">References</h3>
          <ul className="space-y-2 text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6 ml-6">
            <li><a href="https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/paying-your-workers/withholding-from-payments-to-employees/payg-withholding/schedule-7-statement-of-formulas-for-calculating-amounts-to-be-withheld" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">ATO Schedule 7: Formulas for Unused Leave Withholding</a></li>
            <li><a href="https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/paying-your-workers/withholding-from-payments-to-employees/payg-withholding" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">ATO PAYG Withholding Guide</a></li>
          </ul>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 rounded-lg my-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Disclaimer</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              This calculator provides estimates based on ATO Schedule 7 formulas. Actual withholding depends on your specific circumstances and employer's payroll system. This is not tax advice—consult a registered tax agent for personalized guidance.
            </p>
          </div>
        </div>
      </div>
    </CalculatorLayoutWithAds>
  );
}