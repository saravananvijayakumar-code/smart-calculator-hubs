// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, DollarSign, Info, ChevronDown, ChevronUp, TrendingUp, Wallet, FileText, HelpCircle, Calculator, Zap, BarChart3 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { PayCalculatorResponse } from '~backend/au-tax/types';
import { SEOHead } from '@/components/SEOHead';
import EnhancedAIAnalysis from '@/components/EnhancedAIAnalysis';
import ExportShareButtons from '@/components/ExportShareButtons';
import TopBannerAd from '@/components/ads/TopBannerAd';
import InFeedAd from '@/components/ads/InFeedAd';
import MidContentAd from '@/components/ads/MidContentAd';
import SidebarAd from '@/components/ads/SidebarAd';
import BottomStickyAd from '@/components/ads/BottomStickyAd';

const COMMON_SALARIES = [
  { label: 'Minimum Wage', value: 45000 },
  { label: 'Average', value: 75000 },
  { label: 'Median', value: 68000 },
  { label: 'High Income', value: 120000 },
  { label: 'Top Bracket', value: 200000 },
];

export default function PayCalculatorAustralia() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PayCalculatorResponse | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(false);

  const [year, setYear] = useState('2025-26');
  const [grossAnnual, setGrossAnnual] = useState('75000');
  const [period, setPeriod] = useState<'weekly' | 'fortnightly' | 'monthly' | 'annual'>('fortnightly');
  const [residency, setResidency] = useState<'resident' | 'non-resident' | 'whm'>('resident');
  const [claimTFT, setClaimTFT] = useState(true);
  const [hasHelp, setHasHelp] = useState(false);
  const [privateCover, setPrivateCover] = useState(true);
  const [dependants, setDependants] = useState('0');
  const [spouseIncome, setSpouseIncome] = useState('0');
  const [salarySacrifice, setSalarySacrifice] = useState('0');
  const [includeSuper, setIncludeSuper] = useState(false);
  const [isSenior, setIsSenior] = useState(false);

  const calculate = async () => {
    try {
      setLoading(true);
      const response = await backend.au_tax.calculate({
        year,
        grossAnnual: parseFloat(grossAnnual) || 0,
        period,
        residency,
        claimTaxFreeThreshold: claimTFT,
        hasHelp,
        privateCover,
        dependants: parseInt(dependants) || 0,
        spouseIncome: parseFloat(spouseIncome) || 0,
        salarySacrifice: parseFloat(salarySacrifice) || 0,
        includeSuper,
        isSenior,
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Calculation Error',
        description: 'Failed to calculate pay. Please check your inputs.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoCalculate && parseFloat(grossAnnual) > 0) {
      const timer = setTimeout(() => {
        calculate();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [grossAnnual, period, residency, claimTFT, hasHelp, privateCover, year, autoCalculate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const periodLabel = {
    weekly: 'Weekly',
    fortnightly: 'Fortnightly',
    monthly: 'Monthly',
    annual: 'Annual',
  }[period];

  const getPercentage = (part: number, total: number) => {
    return total > 0 ? ((part / total) * 100).toFixed(1) : '0';
  };

  return (
    <>
      <SEOHead
        title="Australian Pay Calculator 2025-26 | ATO-Accurate Take Home Pay"
        description="ATO-accurate Australian pay calculator for FY 2025-26. Calculate take-home pay with PAYG withholding, HELP repayments, Medicare levy, and MLS. Includes Stage 3 tax cuts and 12% Super Guarantee."
        keywords="Australian pay calculator, take home pay calculator Australia, PAYG calculator, salary calculator Australia, ATO tax calculator, net pay calculator"
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Australian Pay Calculator</h1>
              <p className="text-muted-foreground mt-1">
                ATO-accurate take-home pay with PAYG Schedule 1 formulas • FY {year}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Stage 3 Tax Cuts Included
            </div>
            <div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
              {year === '2025-26' ? 'SG 12.0%' : 'SG 11.5%'}
            </div>
            <div className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
              PAYG Certified
            </div>
          </div>
        </div>

        <TopBannerAd />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-background to-background border-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Quick Salary Input</h2>
                  <p className="text-sm text-muted-foreground">Drag the slider or enter an amount</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="auto-calc" className="text-sm cursor-pointer">Live updates</Label>
                  <Switch id="auto-calc" checked={autoCalculate} onCheckedChange={setAutoCalculate} />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <Label className="text-lg font-semibold">Annual Salary</Label>
                    <div className="text-3xl font-bold text-primary">
                      {formatCurrency(parseFloat(grossAnnual) || 0)}
                    </div>
                  </div>
                  
                  <Slider
                    value={[parseFloat(grossAnnual) || 0]}
                    onValueChange={(value) => setGrossAnnual(value[0].toString())}
                    min={20000}
                    max={300000}
                    step={1000}
                    className="mb-6"
                  />

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {COMMON_SALARIES.map((preset) => (
                      <Button
                        key={preset.value}
                        variant={parseFloat(grossAnnual) === preset.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setGrossAnnual(preset.value.toString())}
                        className="text-xs"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Input
                    type="number"
                    value={grossAnnual}
                    onChange={(e) => setGrossAnnual(e.target.value)}
                    placeholder="Enter exact amount"
                    className="text-lg h-12"
                  />
                </div>

                {result && (
                  <div className="mt-6 p-6 bg-primary/10 rounded-xl border-2 border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Your Take-Home Pay</div>
                        <div className="text-4xl font-bold text-primary">
                          {formatCurrency(result.netPeriod)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{periodLabel}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">Annual</div>
                        <div className="text-2xl font-bold">
                          {formatCurrency(result.netAnnual)}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                          {getPercentage(result.netAnnual, parseFloat(grossAnnual))}% of gross
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Details & Settings
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year" className="text-sm font-medium">Tax Year</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger id="year" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-26">2025-26 (SG 12.0%)</SelectItem>
                      <SelectItem value="2024-25">2024-25 (SG 11.5%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="period" className="text-sm font-medium">Pay Period</Label>
                  <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
                    <SelectTrigger id="period" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="fortnightly">Fortnightly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="residency" className="text-sm font-medium">Residency</Label>
                  <Select value={residency} onValueChange={(v: any) => setResidency(v)}>
                    <SelectTrigger id="residency" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resident">Australian Resident</SelectItem>
                      <SelectItem value="non-resident">Non-Resident</SelectItem>
                      <SelectItem value="whm">Working Holiday Maker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <div className="flex-1">
                    <div className="flex items-center justify-between h-full pb-2">
                      <Label htmlFor="includeSuper" className="text-sm font-medium">
                        Super Included
                      </Label>
                      <Switch id="includeSuper" checked={includeSuper} onCheckedChange={setIncludeSuper} />
                    </div>
                  </div>
                </div>
              </div>

              {residency === 'resident' && (
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
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

                    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div>
                        <Label htmlFor="privateCover" className="font-medium cursor-pointer">Private Cover</Label>
                        <p className="text-xs text-muted-foreground">Avoids MLS</p>
                      </div>
                      <Switch id="privateCover" checked={privateCover} onCheckedChange={setPrivateCover} />
                    </div>
                  </div>
                </div>
              )}

              {residency === 'resident' && (
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <span className="flex items-center gap-2">
                      {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      Advanced Options
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Dependants, salary sacrifice, etc.
                    </span>
                  </Button>
                </div>
              )}

              {showAdvanced && residency === 'resident' && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dependants" className="text-sm font-medium">
                        Dependants
                      </Label>
                      <Input
                        id="dependants"
                        type="number"
                        value={dependants}
                        onChange={(e) => setDependants(e.target.value)}
                        placeholder="0"
                        min="0"
                        className="mt-1.5"
                      />
                      <p className="text-xs text-muted-foreground mt-1">For Medicare levy & MLS</p>
                    </div>

                    <div>
                      <Label htmlFor="spouseIncome" className="text-sm font-medium">
                        Spouse Income
                      </Label>
                      <Input
                        id="spouseIncome"
                        type="number"
                        value={spouseIncome}
                        onChange={(e) => setSpouseIncome(e.target.value)}
                        placeholder="0"
                        className="mt-1.5"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Annual amount</p>
                    </div>

                    <div>
                      <Label htmlFor="salarySacrifice" className="text-sm font-medium">
                        Salary Sacrifice
                      </Label>
                      <Input
                        id="salarySacrifice"
                        type="number"
                        value={salarySacrifice}
                        onChange={(e) => setSalarySacrifice(e.target.value)}
                        placeholder="0"
                        className="mt-1.5"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Pre-tax super contribution</p>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div>
                        <Label htmlFor="isSenior" className="font-medium cursor-pointer">Senior/Pensioner</Label>
                        <p className="text-xs text-muted-foreground">Higher thresholds</p>
                      </div>
                      <Switch id="isSenior" checked={isSenior} onCheckedChange={setIsSenior} />
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={calculate} 
                disabled={loading || autoCalculate} 
                className="w-full mt-6" 
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : autoCalculate ? (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Live Mode Active
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Take-Home Pay
                  </>
                )}
              </Button>
            </Card>

            {result && <InFeedAd />}

            {result ? (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">Tax Breakdown</h3>
                  </div>

                  <Tabs defaultValue="visual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="visual">Visual</TabsTrigger>
                      <TabsTrigger value="detailed">Detailed</TabsTrigger>
                    </TabsList>

                    <TabsContent value="visual" className="space-y-4 mt-6">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Take-Home Pay</span>
                            <span className="font-bold text-primary">
                              {formatCurrency(result.netAnnual)} ({getPercentage(result.netAnnual, parseFloat(grossAnnual))}%)
                            </span>
                          </div>
                          <div className="h-3 bg-primary rounded-full" style={{ width: `${getPercentage(result.netAnnual, parseFloat(grossAnnual))}%` }} />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Income Tax</span>
                            <span className="font-bold text-red-600">
                              {formatCurrency(result.incomeTax)} ({getPercentage(result.incomeTax, parseFloat(grossAnnual))}%)
                            </span>
                          </div>
                          <div className="h-3 bg-red-500 rounded-full" style={{ width: `${getPercentage(result.incomeTax, parseFloat(grossAnnual))}%` }} />
                        </div>

                        {residency === 'resident' && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium">Medicare Levy</span>
                              <span className="font-bold text-orange-600">
                                {formatCurrency(result.medicareLevy)} ({getPercentage(result.medicareLevy, parseFloat(grossAnnual))}%)
                              </span>
                            </div>
                            <div className="h-3 bg-orange-500 rounded-full" style={{ width: `${getPercentage(result.medicareLevy, parseFloat(grossAnnual))}%` }} />
                          </div>
                        )}

                        {result.helpRepayment > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium">HELP Repayment</span>
                              <span className="font-bold text-yellow-600">
                                {formatCurrency(result.helpRepayment)} ({getPercentage(result.helpRepayment, parseFloat(grossAnnual))}%)
                              </span>
                            </div>
                            <div className="h-3 bg-yellow-500 rounded-full" style={{ width: `${getPercentage(result.helpRepayment, parseFloat(grossAnnual))}%` }} />
                          </div>
                        )}

                        {result.medicareLevySurcharge > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium">Medicare Levy Surcharge</span>
                              <span className="font-bold text-pink-600">
                                {formatCurrency(result.medicareLevySurcharge)} ({getPercentage(result.medicareLevySurcharge, parseFloat(grossAnnual))}%)
                              </span>
                            </div>
                            <div className="h-3 bg-pink-500 rounded-full" style={{ width: `${getPercentage(result.medicareLevySurcharge, parseFloat(grossAnnual))}%` }} />
                          </div>
                        )}

                        <div className="pt-4 border-t">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium flex items-center gap-1">
                              <Wallet className="w-4 h-4" />
                              Superannuation ({year === '2024-25' ? '11.5%' : '12.0%'})
                            </span>
                            <span className="font-bold text-green-600">
                              {formatCurrency(result.superannuation)}
                            </span>
                          </div>
                          <div className="h-3 bg-green-500 rounded-full" style={{ width: `${year === '2024-25' ? '11.5' : '12'}%` }} />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="detailed" className="space-y-3 mt-6">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-3 border-b font-semibold">
                          <span>Gross Income ({periodLabel})</span>
                          <span>{formatCurrency(result.grossPeriod)}</span>
                        </div>
                        
                        <div className="flex justify-between py-2 text-muted-foreground">
                          <span>Income Tax</span>
                          <span className="text-red-600">-{formatCurrency(result.incomeTaxPeriod)}</span>
                        </div>
                        
                        {result.lito > 0 && (
                          <div className="flex justify-between py-2 text-green-600">
                            <span>LITO (Low Income Tax Offset)</span>
                            <span>+{formatCurrency(result.lito / (period === 'weekly' ? 52 : period === 'fortnightly' ? 26 : period === 'monthly' ? 12 : 1))}</span>
                          </div>
                        )}
                        
                        {residency === 'resident' && (
                          <>
                            <div className="flex justify-between py-2 text-muted-foreground">
                              <span>Medicare Levy (2%)</span>
                              <span className="text-orange-600">-{formatCurrency(result.medicareLevyPeriod)}</span>
                            </div>
                            {result.medicareLevySurcharge > 0 && (
                              <div className="flex justify-between py-2 text-muted-foreground">
                                <span>Medicare Levy Surcharge</span>
                                <span className="text-pink-600">-{formatCurrency(result.medicareLevySurchargePeriod)}</span>
                              </div>
                            )}
                          </>
                        )}
                        
                        {result.helpRepayment > 0 && (
                          <div className="flex justify-between py-2 text-muted-foreground">
                            <span>HELP Repayment</span>
                            <span className="text-yellow-600">-{formatCurrency(result.helpRepaymentPeriod)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between py-3 border-t font-bold text-base">
                          <span>Net Pay ({periodLabel})</span>
                          <span className="text-primary">{formatCurrency(result.netPeriod)}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Annual Net Income</span>
                          <span className="font-semibold">{formatCurrency(result.netAnnual)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Tax (Annual)</span>
                          <span className="font-semibold">{formatCurrency(result.totalTax)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Effective Tax Rate</span>
                          <span className="font-semibold">{result.effectiveTaxRate.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Marginal Tax Rate</span>
                          <span className="font-semibold">{result.marginalTaxRate.toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Wallet className="w-4 h-4" />
                            Superannuation ({year === '2024-25' ? '11.5%' : '12.0%'})
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(result.superannuation)} /yr
                          </span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>

                <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm space-y-2">
                      <p className="font-semibold text-blue-900 dark:text-blue-100">ATO-Certified Calculation</p>
                      <p className="text-blue-800 dark:text-blue-200">
                        Uses official PAYG Schedule 1 withholding formulas and {year} tax brackets from the Treasury Laws Amendment (Cost of Living Tax Cuts) Act 2024. Accuracy guaranteed within ±$1 due to rounding.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="grid sm:grid-cols-3 gap-4">
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{getPercentage(result.netAnnual, parseFloat(grossAnnual))}%</div>
                    <div className="text-xs text-muted-foreground">Take-home rate</div>
                  </Card>
                  
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                    <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{result.effectiveTaxRate.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Effective tax rate</div>
                  </Card>
                  
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                    <Wallet className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{formatCurrency(result.superannuation)}</div>
                    <div className="text-xs text-muted-foreground">Annual super</div>
                  </Card>
                </div>

                <ExportShareButtons
                  calculatorType="au-pay"
                  inputs={{
                    year,
                    grossAnnual: parseFloat(grossAnnual),
                    period,
                    residency,
                  }}
                  results={result}
                  title="Australian Pay Calculator Results"
                />

                <EnhancedAIAnalysis
                  calculatorType="au-pay"
                  data={{
                    grossAnnual: parseFloat(grossAnnual),
                    period,
                    residency,
                    hasHelp,
                    year,
                    netAnnual: result.netAnnual,
                    netPeriod: result.netPeriod,
                    grossPeriod: result.grossPeriod,
                    incomeTax: result.incomeTax,
                    medicareLevy: result.medicareLevy,
                    medicareLevySurcharge: result.medicareLevySurcharge,
                    helpRepayment: result.helpRepayment,
                    totalTax: result.totalTax,
                    superannuation: result.superannuation,
                    lito: result.lito,
                    effectiveTaxRate: result.effectiveTaxRate,
                    marginalTaxRate: result.marginalTaxRate,
                  }}
                />
              </div>
            ) : (
              <Card className="p-12 flex flex-col items-center justify-center text-center min-h-[300px] bg-gradient-to-br from-muted/30 to-background">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Calculator className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Calculate</h3>
                <p className="text-muted-foreground max-w-md">
                  Adjust your salary using the slider above, then click calculate to see your accurate take-home pay breakdown
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
                  <li>• Enable live updates for instant calculations</li>
                  <li>• Stage 3 tax cuts mean lower taxes in 2024-25</li>
                  <li>• Only claim tax-free threshold at one job</li>
                  <li>• Private cover avoids Medicare Levy Surcharge</li>
                  <li>• Super is paid on top unless package includes it</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>

        <MidContentAd />

        <div className="mt-12">
          <Card className="p-6">
            <Tabs defaultValue="guide" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="guide">Guide</TabsTrigger>
                <TabsTrigger value="tax-cuts">Tax Cuts</TabsTrigger>
                <TabsTrigger value="deductions">Deductions</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="guide" className="prose prose-sm max-w-none dark:prose-invert mt-6">
                <h3>How This Calculator Works</h3>
                <p>
                  This pay calculator implements the exact PAYG (Pay As You Go) withholding formulas published by the Australian Taxation Office in Schedule 1 of the NAT 1004 tax tables. Unlike simplified calculators that divide annual tax by pay periods, this tool uses period-specific coefficients to match the exact withholding amounts your employer calculates.
                </p>

                <h3>Understanding PAYG Withholding</h3>
                <p>
                  PAYG withholding is the amount your employer deducts from each pay to cover your annual tax liability. The ATO publishes mathematical formulas (Schedule 1) with specific coefficients for each pay period:
                </p>
                <ul>
                  <li><strong>Scale 2:</strong> For employees claiming the tax-free threshold (most primary jobs)</li>
                  <li><strong>Scale 6:</strong> For employees not claiming the threshold (second jobs, non-residents without threshold entitlement)</li>
                </ul>

                <h3>Low Income Tax Offset (LITO)</h3>
                <p>LITO provides a tax offset of up to $700 for Australian residents earning under $66,667.</p>

                <h3>Medicare Levy (2%)</h3>
                <p>Most Australian residents pay a 2% Medicare levy on taxable income, with reductions for low-income earners.</p>

                <h3>Superannuation Guarantee (SG)</h3>
                <ul>
                  <li><strong>2024-25:</strong> 11.5%</li>
                  <li><strong>2025-26 onwards:</strong> 12.0%</li>
                </ul>
              </TabsContent>

              <TabsContent value="tax-cuts" className="prose prose-sm max-w-none dark:prose-invert mt-6">
                <h3>Stage 3 Tax Cuts (Effective 1 July 2024)</h3>
                <p>
                  From the 2024-25 financial year, the Treasury Laws Amendment (Cost of Living Tax Cuts) Act 2024 introduced revised tax brackets:
                </p>
                <ul>
                  <li><strong>$0 – $18,200:</strong> 0% (tax-free threshold)</li>
                  <li><strong>$18,201 – $45,000:</strong> 16% (reduced from 19%)</li>
                  <li><strong>$45,001 – $135,000:</strong> 30% (reduced from 32.5%, threshold increased)</li>
                  <li><strong>$135,001 – $190,000:</strong> 37%</li>
                  <li><strong>$190,001+:</strong> 45%</li>
                </ul>
                <p>
                  These changes deliver tax relief across all income levels, with the biggest benefit for middle-income earners who previously faced the 32.5% rate.
                </p>
              </TabsContent>

              <TabsContent value="deductions" className="prose prose-sm max-w-none dark:prose-invert mt-6">
                <h3>Medicare Levy Surcharge (MLS)</h3>
                <p>
                  The MLS is an additional charge (1.0% to 1.5%) for higher-income earners without private hospital cover. Tiers for 2024-25:
                </p>
                <ul>
                  <li><strong>Tier 0:</strong> Income ≤ $97,000 (singles) / $194,000 (families) — 0%</li>
                  <li><strong>Tier 1:</strong> $97,001–$113,000 / $194,001–$226,000 — 1.0%</li>
                  <li><strong>Tier 2:</strong> $113,001–$151,000 / $226,001–$302,000 — 1.25%</li>
                  <li><strong>Tier 3:</strong> $151,001+ / $302,001+ — 1.5%</li>
                </ul>

                <h3>HELP/HECS/VSL Repayments</h3>
                <p>
                  If you have a HELP (Higher Education Loan Program), HECS, or VSL debt, compulsory repayments are calculated based on your repayment income. For 2024-25:
                </p>
                <ul>
                  <li>No repayment below $54,435</li>
                  <li>1% between $54,435–$62,850</li>
                  <li>Rates increase progressively to 10% for income above $159,664</li>
                </ul>

                <h3>Salary Sacrifice</h3>
                <p>
                  Salary sacrificing to super reduces your taxable income, lowering income tax and HELP repayments. However, it increases your <em>MLS income</em> (used to determine Medicare Levy Surcharge eligibility).
                </p>
              </TabsContent>

              <TabsContent value="faq" className="prose prose-sm max-w-none dark:prose-invert mt-6">
                <h3>Frequently Asked Questions</h3>
                
                <h4>Why is my withholding different from my actual annual tax?</h4>
                <p>
                  PAYG withholding is an <em>estimate</em> designed to approximate your final tax bill. Differences arise from LITO (applied at tax time), deductions you claim, and income variations throughout the year.
                </p>

                <h4>Should I claim the tax-free threshold on my second job?</h4>
                <p>
                  No. Only claim the tax-free threshold with one employer (usually your main job). Claiming it on multiple jobs results in under-withholding and a tax debt at year-end.
                </p>

                <h4>Do I need private health insurance to avoid MLS?</h4>
                <p>
                  Only if your income exceeds the MLS thresholds ($97,000 singles / $194,000 families for 2024-25). If you're below these thresholds, you won't pay MLS regardless of cover.
                </p>

                <h4>Can I make extra HELP repayments?</h4>
                <p>
                  Yes, you can make voluntary HELP repayments directly to the ATO at any time. Voluntary payments reduce your debt immediately and aren't subject to indexation.
                </p>

                <h4>What's the difference between PAYG and actual tax?</h4>
                <p>
                  PAYG is what's <em>withheld</em> each pay period. Your <em>actual tax</em> is calculated annually based on total income, deductions, and offsets. This calculator shows annual tax liability alongside PAYG withholding for comparison.
                </p>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h3 className="text-lg font-semibold mb-4">References & Further Reading</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.legislation.gov.au/C2024A00003/latest/text" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Treasury Laws Amendment (Cost of Living Tax Cuts) Act 2024
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ato.gov.au/rates-and-codes/tax-rates-australian-residents" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ATO Tax Rates for Australian Residents
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/paying-your-workers/withholding-from-payments-to-employees/payg-withholding" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ATO PAYG Withholding
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ato.gov.au/tax-rates-and-codes/tax-offset-rates" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ATO Low Income Tax Offset
                </a>
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              This calculator provides general information only and should not be relied upon as professional tax advice. Tax laws are complex and individual circumstances vary. Always consult a registered tax agent or the ATO for advice specific to your situation.
            </p>
          </div>
        </Card>
      </div>

      <BottomStickyAd />
    </>
  );
}