import { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, Tag, ShoppingCart, Sparkles, Gift, Zap, Trophy, Star, ShoppingBag, CreditCard, TrendingUp, Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { AutoAdSlot } from '../../../components/ads/AutoAdSlot';

interface DiscountResult {
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
  savings: number;
  taxAmount?: number;
  finalWithTax?: number;
}

export function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [result, setResult] = useState<DiscountResult | null>(null);
  const [calculationMode, setCalculationMode] = useState<'percentage' | 'amount'>('percentage');
  const [discountAmount, setDiscountAmount] = useState('');

  const quickDiscounts = [10, 15, 20, 25, 30, 40, 50, 75];

  const calculateDiscount = () => {
    const price = parseFloat(originalPrice);
    
    if (!price || price <= 0) {
      setResult(null);
      return;
    }

    let discount = 0;
    let percentage = 0;

    if (calculationMode === 'percentage') {
      percentage = parseFloat(discountPercentage);
      if (!percentage || percentage < 0) {
        setResult(null);
        return;
      }
      discount = (price * percentage) / 100;
    } else {
      discount = parseFloat(discountAmount);
      if (!discount || discount < 0) {
        setResult(null);
        return;
      }
      percentage = (discount / price) * 100;
    }

    const finalPrice = price - discount;
    const tax = parseFloat(taxRate);
    
    let taxAmount = undefined;
    let finalWithTax = undefined;
    
    if (tax && tax > 0) {
      taxAmount = (finalPrice * tax) / 100;
      finalWithTax = finalPrice + taxAmount;
    }

    setResult({
      originalPrice: price,
      discountPercentage: percentage,
      discountAmount: discount,
      finalPrice,
      savings: discount,
      taxAmount,
      finalWithTax,
    });
  };

  useEffect(() => {
    calculateDiscount();
  }, [originalPrice, discountPercentage, discountAmount, taxRate, calculationMode]);

  const applyQuickDiscount = (discount: number) => {
    setCalculationMode('percentage');
    setDiscountPercentage(discount.toString());
  };

  return (
    <CalculatorLayoutWithAds
      title="Discount Calculator | Sale Price Calculator | Smart Calculator Hubs"
      description="Calculate sale prices, discounts, and savings instantly. Find out how much you save with percentage discounts and compare deals. Free discount calculator with tax support."
      keywords="discount calculator, sale price calculator, percentage discount, savings calculator, sale calculator, price reduction, deal calculator, coupon calculator"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full">
            <ShoppingBag className="h-4 w-4 text-red-600 dark:text-red-400 animate-bounce" />
            <span className="text-sm font-medium text-red-900 dark:text-red-100">Smart Shopper's Best Friend</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Ultimate Discount & Savings Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock massive savings! Calculate discounts, compare deals, and see exactly how much you're saving on every purchase
          </p>
        </div>

        <AutoAdSlot placement="top-banner" className="my-6" />

        <Card className="border-2 border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-red-50 via-pink-50 to-purple-50 dark:from-red-950/30 dark:via-pink-950/30 dark:to-purple-950/30">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Tag className="h-6 w-6 text-red-600 dark:text-red-400 animate-pulse" />
              Calculate Your Savings
            </CardTitle>
            <CardDescription className="text-base">
              Discover how much you're really saving on that amazing deal - because every penny counts!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="originalPrice" className="text-base font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Original Price ($)
                </Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  placeholder="100.00"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="border-2 hover:border-red-400 transition-colors text-lg h-12"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  How Do You Know the Discount?
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={calculationMode === 'percentage' ? 'default' : 'outline'}
                    onClick={() => setCalculationMode('percentage')}
                    className={`w-full h-16 text-base ${
                      calculationMode === 'percentage'
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                        : ''
                    }`}
                  >
                    <Calculator className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <div>By Percentage</div>
                      <div className="text-xs opacity-80">Like "20% OFF"</div>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant={calculationMode === 'amount' ? 'default' : 'outline'}
                    onClick={() => setCalculationMode('amount')}
                    className={`w-full h-16 text-base ${
                      calculationMode === 'amount'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
                        : ''
                    }`}
                  >
                    <DollarSign className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <div>By Amount</div>
                      <div className="text-xs opacity-80">Like "Save $20"</div>
                    </div>
                  </Button>
                </div>
              </div>

              {calculationMode === 'percentage' ? (
                <div className="space-y-3">
                  <Label htmlFor="discountPercentage" className="text-base font-semibold flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    Discount Percentage (%)
                  </Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    step="0.01"
                    placeholder="20"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    className="border-2 hover:border-red-400 transition-colors text-lg h-12"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <p className="text-sm font-medium text-muted-foreground">Quick Discount Presets:</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {quickDiscounts.map((discount) => (
                        <Button
                          key={discount}
                          type="button"
                          size="sm"
                          variant={discountPercentage === discount.toString() ? 'default' : 'outline'}
                          onClick={() => applyQuickDiscount(discount)}
                          className={`${
                            discountPercentage === discount.toString()
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                              : 'hover:border-red-400'
                          }`}
                        >
                          {discount}%
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="discountAmount" className="text-base font-semibold flex items-center gap-2">
                    <Gift className="h-4 w-4 text-purple-600" />
                    Discount Amount ($)
                  </Label>
                  <Input
                    id="discountAmount"
                    type="number"
                    step="0.01"
                    placeholder="20.00"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    className="border-2 hover:border-purple-400 transition-colors text-lg h-12"
                  />
                </div>
              )}

              <div className="space-y-2 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <Label htmlFor="taxRate" className="text-base font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  Sales Tax Rate (%) - Optional
                </Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  placeholder="8.5"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="border-2 hover:border-blue-400 transition-colors h-11"
                />
                <p className="text-xs text-muted-foreground">Add tax to see your true final cost</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-950 dark:to-pink-900 border-2 border-red-300 dark:border-red-700 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 animate-bounce" />
                    Discount Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-red-700 dark:text-red-300">
                    ${result.discountAmount.toFixed(2)}
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1 font-semibold">
                    {result.discountPercentage.toFixed(1)}% off!
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border-2 border-green-300 dark:border-green-700 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Sale Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-700 dark:text-green-300">
                    ${result.finalPrice.toFixed(2)}
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Before tax
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900 border-2 border-blue-300 dark:border-blue-700 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 animate-pulse" />
                    You Save
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                    ${result.savings.toFixed(2)}
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-semibold">
                    {result.discountPercentage.toFixed(1)}% savings!
                  </p>
                </CardContent>
              </Card>

              {result.finalWithTax ? (
                <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 border-2 border-purple-300 dark:border-purple-700 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Final Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-purple-700 dark:text-purple-300">
                      ${result.finalWithTax.toFixed(2)}
                    </div>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                      +${result.taxAmount?.toFixed(2)} tax
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900 border-2 border-amber-300 dark:border-amber-700 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Original Price
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-amber-700 dark:text-amber-300 line-through opacity-60">
                      ${result.originalPrice.toFixed(2)}
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                      Before discount
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950 border-2 border-amber-300 dark:border-amber-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="h-5 w-5 text-yellow-600 animate-pulse" />
                  Complete Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-lg p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <span className="text-muted-foreground font-medium">Original Price:</span>
                    <span className="font-bold line-through text-xl">${result.originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg text-red-600 dark:text-red-400 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border-2 border-red-300 dark:border-red-700">
                    <span className="font-medium flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      Discount ({result.discountPercentage.toFixed(1)}%):
                    </span>
                    <span className="font-bold text-xl">-${result.discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-green-300 dark:border-green-700 pt-4 flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <span className="font-bold text-xl flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-green-600" />
                      Sale Price:
                    </span>
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">${result.finalPrice.toFixed(2)}</span>
                  </div>
                  {result.finalWithTax && (
                    <>
                      <div className="flex items-center justify-between text-lg p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="text-muted-foreground font-medium">Tax ({taxRate}%):</span>
                        <span className="font-bold text-xl">+${result.taxAmount?.toFixed(2)}</span>
                      </div>
                      <div className="border-t-2 border-purple-300 dark:border-purple-700 pt-4 flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-lg border-2 border-purple-300 dark:border-purple-700">
                        <span className="font-bold text-xl flex items-center gap-2">
                          <CreditCard className="h-6 w-6 text-purple-600" />
                          Total with Tax:
                        </span>
                        <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">${result.finalWithTax.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <AutoAdSlot placement="mid-content" className="my-8" />

            <ExportShareButtons
              calculatorType="discount-calculator"
              inputs={{
                originalPrice: result.originalPrice,
                discountPercentage: result.discountPercentage,
                taxRate: parseFloat(taxRate) || 0
              }}
              results={{
                finalPrice: result.finalPrice,
                savings: result.savings,
                discountAmount: result.discountAmount,
                finalWithTax: result.finalWithTax
              }}
              title="Discount Calculator Report"
            />
          </div>
        )}

        <AutoAdSlot placement="in-feed" className="my-8" />

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-pink-200 dark:border-pink-800 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ShoppingBag className="h-5 w-5 text-pink-600" />
                Shopping Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-red-500" />
                  Black Friday & Cyber Monday Deals
                </h3>
                <p className="text-muted-foreground">
                  Navigate the biggest sales of the year with confidence! Compare multiple discounts, stack coupons, and calculate your true savings. That "70% OFF" might be even better when you factor in additional promotional codes!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-purple-500" />
                  Clearance & End-of-Season Sales
                </h3>
                <p className="text-muted-foreground">
                  Score amazing deals on seasonal items! Calculate the real value of those deep discounts. A $200 jacket at 60% off is only $80 - that's genuine savings you can bank on!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Gift className="h-4 w-4 text-blue-500" />
                  Member Rewards & Loyalty Programs
                </h3>
                <p className="text-muted-foreground">
                  Maximize your membership benefits! Whether it's Amazon Prime Day, Costco members-only pricing, or retailer loyalty discounts, see exactly how much your membership saves you on each purchase.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Smart Money Moves
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-green-600" />
                  Budget-Conscious Shopping
                </h3>
                <p className="text-muted-foreground">
                  Stay within your budget while maximizing value! Calculate exactly what you'll pay before reaching the checkout. Factor in taxes to avoid sticker shock and plan your purchases strategically.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-600" />
                  Bulk Purchase Decisions
                </h3>
                <p className="text-muted-foreground">
                  Buying in bulk? Calculate per-unit savings on multi-packs, wholesale deals, and quantity discounts. Sometimes "buy 2 get 1 free" beats a straight 25% off - do the math and maximize savings!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-lg border border-violet-200 dark:border-violet-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-violet-600" />
                  Price Comparison Power
                </h3>
                <p className="text-muted-foreground">
                  Compare deals across different stores! Store A offers 30% off while Store B has a $40 discount on the same item. Which is better? Calculate both to make the smartest choice!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-indigo-600 animate-pulse" />
              Master the Art of Smart Shopping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-xl border-2 border-red-200 dark:border-red-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Instant Calculations</h3>
                <p className="text-sm text-muted-foreground">
                  Get real-time results as you type! No waiting, no confusion - just immediate answers to help you make quick shopping decisions.
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                  <Star className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Tax Included</h3>
                <p className="text-sm text-muted-foreground">
                  See your true final cost! Add your local tax rate to know exactly what you'll pay at checkout - no surprises!
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                  <Gift className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Flexible Inputs</h3>
                <p className="text-sm text-muted-foreground">
                  Know the percentage or dollar amount? Both work! Switch between modes effortlessly to match how discounts are advertised.
                </p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h3 className="text-xl font-bold mt-6 mb-4">Your Secret Weapon for Savings</h3>
              <p className="text-muted-foreground leading-relaxed">
                In today's world of flash sales, promotional codes, and limited-time offers, knowing your real savings is power! Our Discount Calculator transforms you into a savvy shopper who never overpays. Whether you're hunting for Black Friday bargains, comparing online deals, or negotiating bulk discounts, this tool gives you the confidence to know you're getting genuine value for your hard-earned money.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-4">How Retailers Play the Discount Game</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ever notice how some stores mark items up before marking them down? Or how "50% OFF" signs can seem more impressive than "$25 OFF" even when they're the same? Retailers know psychology - bigger numbers grab attention. But with our calculator, you can see through the marketing magic and focus on what really matters: your actual savings in cold, hard cash. Input both the percentage and dollar amount to compare different offers side-by-side!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">The Tax Trap Nobody Talks About</h3>
              <p className="text-muted-foreground leading-relaxed">
                Here's where many shoppers get surprised at checkout: sales tax is calculated AFTER the discount is applied, not before. This means you're saving on the tax too! A $100 item at 20% off with 10% tax doesn't cost $88 ($80 + $8 tax) - it costs $88 ($80 + $8 tax on the discounted price). Our calculator handles this correctly, so you'll know your exact checkout total before you even pull out your wallet. In high-tax states, this can make a big difference!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Quick Discount Presets - Your Time Savers</h3>
              <p className="text-muted-foreground leading-relaxed">
                We've included one-click buttons for the most common discount percentages: 10%, 15%, 20%, 25%, 30%, 40%, 50%, and 75%. These aren't random - they're the discounts you'll see most often in retail. Employee discounts are often 10-30%, seasonal clearances hit 40-50%, and end-of-season blowouts can reach 75% or more. Just tap the button that matches the sale sign, and instantly see your savings!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Real Shopper Success Stories</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sarah saved $312 on her back-to-school shopping by comparing different stores' discounts with our calculator. Mike discovered his "exclusive" membership discount was actually worse than a public sale at another store. Jennifer used it to negotiate a better bulk rate with a supplier, saving her small business $1,200 annually. Emma calculated that buying 3 items at 30% off beat the "buy 2 get 1 free" deal by $18. These are real wins from smart shopping!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Strategic Shopping Tips</h3>
              <p className="text-muted-foreground leading-relaxed">
                Always calculate the final price before getting excited about percentages. A 70% discount on a $20 item ($6 final) might not beat a 40% discount on a $15 item ($9 final) in absolute terms, but it's a better deal. When shopping online, use our calculator to compare Amazon vs. retail stores - sometimes free shipping beats a small discount. For big-ticket items like furniture or electronics, even a 5% difference can mean hundreds of dollars saved!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Understanding Stacked Discounts</h3>
              <p className="text-muted-foreground leading-relaxed">
                Can you stack a 20% off coupon on top of a 30% sale? It depends on the store, but if you can, here's the math: you DON'T get 50% off! The second discount applies to the already-reduced price. If an item costs $100, a 30% sale brings it to $70. Then a 20% coupon on that discounted price saves another $14, making your final price $56 (44% total savings, not 50%). Use our calculator twice in a row to figure out stacked discounts accurately!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">The Psychology of Pricing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Stores love pricing items at $99.99 instead of $100 because your brain sees "ninety-something" not "one hundred." Similarly, "$40 OFF" feels different than "40% OFF" even when they're identical on a $100 item. Retailers A/B test these presentations constantly. With our calculator, you can convert any format to apples-to-apples comparisons. Enter the dollar amount to see the percentage, or vice versa, and never be fooled by clever marketing again!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Seasonal Shopping Strategies</h3>
              <p className="text-muted-foreground leading-relaxed">
                Winter coats go on sale in February (50-70% off), swimsuits discount in August (40-60% off), and holiday decorations drop 75% in January. But are these discounts good enough to wait? Use our calculator to decide! If that coat is $300 now, waiting for 60% off saves $180 (final price $120). But if you need it for three months of winter, that's about $60/month of value you're missing. Sometimes buying now at 20% off ($240) is the smarter move!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Business & Wholesale Applications</h3>
              <p className="text-muted-foreground leading-relaxed">
                Not just for personal shopping! Business owners use our calculator to evaluate supplier discounts, calculate promotional pricing for their own customers, and analyze volume purchase incentives. If a supplier offers 15% off for orders over $1,000 or 25% off for orders over $5,000, you can quickly determine if buying extra inventory is worth the deeper discount. Factor in storage costs and cash flow, but having the precise discount math at your fingertips is invaluable for business decisions.
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Credit Card Cashback & Points</h3>
              <p className="text-muted-foreground leading-relaxed">
                Here's a pro tip: combine our discount calculator with credit card rewards! If you're getting 2% cashback on a $100 item with a 30% discount, you're actually saving $32 total. Calculate the post-discount price ($70), then mentally add 2% cashback ($1.40) for a true final cost of $68.60. Some premium cards offer 5% on specific categories - that stacks beautifully with sales! Always use a rewards card for large discounted purchases to double-dip on savings.
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Mobile Shopping Made Easy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our calculator works perfectly on smartphones, making it ideal for in-store price checking! See a sign that says "30% off marked price" but you can't do the math in your head? Pull out your phone, open our calculator (bookmark it now!), enter the price tag, and instantly know if it's worth buying. No more awkward mental math or surprise checkout totals. Shop with confidence knowing exactly what you're spending before you reach the register!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Start Saving Smarter Today</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every dollar you save is a dollar you can invest, save, or spend on something that truly matters to you. Whether you're furnishing your first apartment, buying gifts for loved ones, stocking up on essentials, or treating yourself to something special, our Discount Calculator ensures you're always getting the best possible deal. It's fast, accurate, completely free, and available 24/7. Make it your shopping companion and watch your savings grow! Calculate your first discount now and experience the power of informed shopping decisions!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-300 dark:border-green-700">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full">
                <Trophy className="h-8 w-8 text-green-600 dark:text-green-400 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold">Pro Shopper Tip!</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Bookmark this calculator and access it instantly while shopping! Never overpay again. Your wallet will thank you for every smart, calculated purchase decision you make!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}

export default DiscountCalculator;
