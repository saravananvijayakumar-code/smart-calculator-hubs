import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Info, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import type { AnalysisRequest } from '~backend/ai-analysis/types';
import { RelatedCalculators } from '../../../components/RelatedCalculators';

interface PercentageResult {
  result: number;
  calculation: string;
  formatted: string;
}

export function PercentageCalculator() {
  // What is X% of Y?
  const [percentage1, setPercentage1] = useState('');
  const [number1, setNumber1] = useState('');
  const [result1, setResult1] = useState<PercentageResult | null>(null);

  // X is what % of Y?
  const [value2, setValue2] = useState('');
  const [total2, setTotal2] = useState('');
  const [result2, setResult2] = useState<PercentageResult | null>(null);

  // What is the % change from X to Y?
  const [oldValue, setOldValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [result3, setResult3] = useState<PercentageResult | null>(null);

  // Percentage increase/decrease
  const [baseValue, setBaseValue] = useState('');
  const [percentChange, setPercentChange] = useState('');
  const [result4, setResult4] = useState<PercentageResult | null>(null);

  const calculatePercentageOf = () => {
    const perc = parseFloat(percentage1);
    const num = parseFloat(number1);

    if (isNaN(perc) || isNaN(num) || percentage1 === '' || number1 === '') {
      setResult1(null);
      return;
    }

    const result = (perc / 100) * num;
    // Use higher precision for small numbers
    const precision = Math.abs(result) < 1 ? 4 : 2;
    setResult1({
      result,
      calculation: `${perc}% of ${num} = ${result.toFixed(precision)}`,
      formatted: result.toLocaleString(undefined, { maximumFractionDigits: precision })
    });
  };

  const calculateWhatPercent = () => {
    const val = parseFloat(value2);
    const total = parseFloat(total2);

    if (isNaN(val) || isNaN(total) || value2 === '' || total2 === '' || total === 0) {
      setResult2(null);
      return;
    }

    const result = (val / total) * 100;
    // Use higher precision for small percentages
    const precision = Math.abs(result) < 1 ? 4 : 2;
    setResult2({
      result,
      calculation: `${val} is ${result.toFixed(precision)}% of ${total}`,
      formatted: `${result.toFixed(precision)}%`
    });
  };

  const calculatePercentChange = () => {
    const oldVal = parseFloat(oldValue);
    const newVal = parseFloat(newValue);

    if (isNaN(oldVal) || isNaN(newVal) || oldValue === '' || newValue === '' || oldVal === 0) {
      setResult3(null);
      return;
    }

    const result = ((newVal - oldVal) / Math.abs(oldVal)) * 100;
    const changeType = result >= 0 ? 'increase' : 'decrease';
    // Use higher precision for small changes
    const precision = Math.abs(result) < 1 ? 4 : 2;
    setResult3({
      result,
      calculation: `${Math.abs(result).toFixed(precision)}% ${changeType} from ${oldVal} to ${newVal}`,
      formatted: `${result > 0 ? '+' : ''}${result.toFixed(precision)}%`
    });
  };

  const calculatePercentIncrease = () => {
    const base = parseFloat(baseValue);
    const percent = parseFloat(percentChange);

    if (!base || !percent || isNaN(base) || isNaN(percent)) {
      setResult4(null);
      return;
    }

    const result = base + (base * (percent / 100));
    setResult4({
      result,
      calculation: `${base} ${percent >= 0 ? '+' : ''} ${percent}% = ${result.toFixed(2)}`,
      formatted: result.toLocaleString()
    });
  };

  useEffect(() => calculatePercentageOf(), [percentage1, number1]);
  useEffect(() => calculateWhatPercent(), [value2, total2]);
  useEffect(() => calculatePercentChange(), [oldValue, newValue]);
  useEffect(() => calculatePercentIncrease(), [baseValue, percentChange]);

  return (
    <CalculatorLayoutWithAds
      title="Percentage Calculator - All-in-One Percent Calculator with Examples"
      description="Complete percentage calculator for all types of percent calculations. Calculate percentages, percentage change, percentage increase/decrease, and more with step-by-step examples."
      keywords="percentage calculator, percent calculator, percentage change, percent increase, percent decrease, math calculator, percentage formula"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Percentage Calculator</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate any type of percentage with our comprehensive calculator. From basic percentages to percentage changes, 
            increases, and decreases - all with step-by-step explanations and real-world examples.
          </p>
        </div>

        {/* Calculator Tabs */}
        <Tabs defaultValue="percentage-of" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="percentage-of">% of Number</TabsTrigger>
            <TabsTrigger value="what-percent">What %</TabsTrigger>
            <TabsTrigger value="percent-change">% Change</TabsTrigger>
            <TabsTrigger value="increase-decrease">+/- %</TabsTrigger>
          </TabsList>

          {/* What is X% of Y? */}
          <TabsContent value="percentage-of" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  What is X% of Y?
                </CardTitle>
                <CardDescription>
                  Calculate a percentage of a number (e.g., 20% of 150 = 30)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="percentage1">Percentage (%)</Label>
                    <Input
                      id="percentage1"
                      type="number"
                      placeholder="20"
                      value={percentage1}
                      onChange={(e) => setPercentage1(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="number1">Number</Label>
                    <Input
                      id="number1"
                      type="number"
                      placeholder="150"
                      value={number1}
                      onChange={(e) => setNumber1(e.target.value)}
                    />
                  </div>
                </div>
                
                {result1 && (
                  <div className="mt-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Result:</h3>
                      <p className="text-2xl font-bold text-blue-700">{result1.formatted}</p>
                      <p className="text-sm text-blue-600 mt-1">{result1.calculation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Common Examples:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium">Shopping & Discounts:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 25% off $80 = $20 discount</li>
                    <li>• 15% tip on $50 bill = $7.50</li>
                    <li>• 8.5% sales tax on $100 = $8.50</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Finance & Business:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 5% interest on $1000 = $50</li>
                    <li>• 10% commission on $5000 = $500</li>
                    <li>• 20% down payment on $300k = $60k</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* X is what % of Y? */}
          <TabsContent value="what-percent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  X is what % of Y?
                </CardTitle>
                <CardDescription>
                  Find what percentage one number is of another (e.g., 30 is what % of 150 = 20%)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value2">Value (X)</Label>
                    <Input
                      id="value2"
                      type="number"
                      placeholder="30"
                      value={value2}
                      onChange={(e) => setValue2(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="total2">Total (Y)</Label>
                    <Input
                      id="total2"
                      type="number"
                      placeholder="150"
                      value={total2}
                      onChange={(e) => setTotal2(e.target.value)}
                    />
                  </div>
                </div>
                
                {result2 && (
                  <div className="mt-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-2">Result:</h3>
                      <p className="text-2xl font-bold text-green-700">{result2.formatted}</p>
                      <p className="text-sm text-green-600 mt-1">{result2.calculation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Real-World Applications:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium">Academic & Testing:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 85 out of 100 points = 85%</li>
                    <li>• 340 out of 400 SAT = 85%</li>
                    <li>• 18 out of 20 correct = 90%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Business & Statistics:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 250 of 1000 customers = 25%</li>
                    <li>• $50k of $200k budget = 25%</li>
                    <li>• 75 of 300 responses = 25%</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Percentage Change */}
          <TabsContent value="percent-change" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Percentage Change
                </CardTitle>
                <CardDescription>
                  Calculate percentage increase or decrease between two values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="oldValue">Original Value</Label>
                    <Input
                      id="oldValue"
                      type="number"
                      placeholder="100"
                      value={oldValue}
                      onChange={(e) => setOldValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newValue">New Value</Label>
                    <Input
                      id="newValue"
                      type="number"
                      placeholder="120"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                  </div>
                </div>
                
                {result3 && (
                  <div className="mt-6">
                    <div className={`rounded-lg p-4 ${result3.result >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                      <h3 className={`font-semibold mb-2 ${result3.result >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                        Result:
                      </h3>
                      <p className={`text-2xl font-bold ${result3.result >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {result3.formatted}
                      </p>
                      <p className={`text-sm mt-1 ${result3.result >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result3.calculation}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Common Use Cases:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium">Investment & Finance:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Stock price changes</li>
                    <li>• Portfolio performance</li>
                    <li>• Revenue growth</li>
                    <li>• Profit margins</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Business Metrics:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Sales growth</li>
                    <li>• Customer acquisition</li>
                    <li>• Cost reductions</li>
                    <li>• Market share</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Personal & Health:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Weight changes</li>
                    <li>• Salary increases</li>
                    <li>• Expense tracking</li>
                    <li>• Performance metrics</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Percentage Increase/Decrease */}
          <TabsContent value="increase-decrease" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Increase/Decrease by Percentage
                </CardTitle>
                <CardDescription>
                  Add or subtract a percentage from a number
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="baseValue">Base Value</Label>
                    <Input
                      id="baseValue"
                      type="number"
                      placeholder="100"
                      value={baseValue}
                      onChange={(e) => setBaseValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="percentChange">Percentage Change (%)</Label>
                    <Input
                      id="percentChange"
                      type="number"
                      placeholder="20"
                      value={percentChange}
                      onChange={(e) => setPercentChange(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use positive for increase, negative for decrease
                    </p>
                  </div>
                </div>
                
                {result4 && (
                  <div className="mt-6">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="font-semibold text-purple-900 mb-2">Result:</h3>
                      <p className="text-2xl font-bold text-purple-700">{result4.formatted}</p>
                      <p className="text-sm text-purple-600 mt-1">{result4.calculation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Insights for all calculations */}
            {(result1 || result2 || result3 || result4) && (
              <>
                <AIAnalysis
                  analysisRequest={{
                    calculatorType: "percentage",
                    data: {
                      type: result1 ? "percentage_of" : result2 ? "what_percent" : result3 ? "percent_change" : "increase_decrease",
                      result1: result1?.result,
                      result2: result2?.result,
                      result3: result3?.result,
                      result4: result4?.result,
                      inputs: {
                        percentage1: parseFloat(percentage1) || 0,
                        number1: parseFloat(number1) || 0,
                        value2: parseFloat(value2) || 0,
                        total2: parseFloat(total2) || 0,
                        oldValue: parseFloat(oldValue) || 0,
                        newValue: parseFloat(newValue) || 0,
                        baseValue: parseFloat(baseValue) || 0,
                        percentChange: parseFloat(percentChange) || 0
                      }
                    }
                  }}
                  autoRun={true}
                  title="AI Percentage Analysis"
                  description="Get insights on percentage calculations and their practical applications in finance, statistics, and everyday scenarios."
                />

                <ExportShareButtons
                  calculatorType="percentage"
                  inputs={{
                    percentage1: parseFloat(percentage1) || 0,
                    number1: parseFloat(number1) || 0,
                    value2: parseFloat(value2) || 0,
                    total2: parseFloat(total2) || 0,
                    oldValue: parseFloat(oldValue) || 0,
                    newValue: parseFloat(newValue) || 0,
                    baseValue: parseFloat(baseValue) || 0,
                    percentChange: parseFloat(percentChange) || 0
                  }}
                  results={{
                    result1: result1?.result || 0,
                    result2: result2?.result || 0,
                    result3: result3?.result || 0,
                    result4: result4?.result || 0
                  }}
                  title="Percentage Calculator Report"
                />
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Understanding Percentages: Complete Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-700 space-y-4">
                <p>
                  Percentages are one of the most useful mathematical concepts in daily life. From calculating tips and discounts 
                  to understanding financial growth and business metrics, percentages help us express proportions and changes in 
                  an easily understandable way. The word "percent" literally means "per hundred" (from Latin "per centum").
                </p>
                
                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Essential Percentage Formulas:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium">Basic Percentage</h5>
                    <p className="text-sm">Percentage of Number = (Percent ÷ 100) × Number</p>
                    <p className="text-xs text-gray-600">Example: 25% of 200 = (25 ÷ 100) × 200 = 50</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-medium">Finding Percentage</h5>
                    <p className="text-sm">Percentage = (Part ÷ Whole) × 100</p>
                    <p className="text-xs text-gray-600">Example: 40 is what % of 160? = (40 ÷ 160) × 100 = 25%</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-medium">Percentage Change</h5>
                    <p className="text-sm">% Change = ((New - Old) ÷ Old) × 100</p>
                    <p className="text-xs text-gray-600">Example: From 50 to 75 = ((75-50) ÷ 50) × 100 = 50%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-medium">Finding the Whole</h5>
                    <p className="text-sm">Whole = Part ÷ (Percent ÷ 100)</p>
                    <p className="text-xs text-gray-600">Example: 30 is 25% of what? = 30 ÷ (25 ÷ 100) = 120</p>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Percentage vs. Percentage Points:</h4>
                <p>
                  Understanding the difference between percentage and percentage points is crucial for interpreting data correctly. 
                  If interest rates increase from 5% to 6%, that's a 1 percentage point increase but a 20% relative increase 
                  ((6-5)/5 × 100 = 20%). Always clarify which measurement is being used in financial and statistical contexts.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-World Applications & Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Shopping & Consumer:</h4>
                    <ul className="space-y-2">
                      <li><strong>Sales Tax:</strong> Calculate total cost with tax</li>
                      <li><strong>Discounts:</strong> Find sale prices and savings</li>
                      <li><strong>Tips:</strong> Calculate appropriate gratuities</li>
                      <li><strong>Interest:</strong> Compare loan and savings rates</li>
                      <li><strong>Price Changes:</strong> Track inflation and deflation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Business & Finance:</h4>
                    <ul className="space-y-2">
                      <li><strong>Growth Rates:</strong> Measure business performance</li>
                      <li><strong>Profit Margins:</strong> Calculate profitability</li>
                      <li><strong>Market Share:</strong> Analyze competitive position</li>
                      <li><strong>ROI:</strong> Evaluate investment returns</li>
                      <li><strong>Budget Allocation:</strong> Distribute resources</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Academic & Personal:</h4>
                    <ul className="space-y-2">
                      <li><strong>Grades:</strong> Convert scores to percentages</li>
                      <li><strong>Statistics:</strong> Express survey results</li>
                      <li><strong>Health Metrics:</strong> Track fitness progress</li>
                      <li><strong>Probability:</strong> Express likelihood</li>
                      <li><strong>Data Analysis:</strong> Compare and contrast values</li>
                    </ul>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Step-by-Step Example Walkthrough:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Scenario: Restaurant Bill Calculation</h5>
                  <div className="space-y-2 text-sm">
                    <p><strong>Bill amount:</strong> $85.00</p>
                    <p><strong>Sales tax (8.5%):</strong> $85.00 × 0.085 = $7.23</p>
                    <p><strong>Subtotal:</strong> $85.00 + $7.23 = $92.23</p>
                    <p><strong>Tip (18% of pre-tax):</strong> $85.00 × 0.18 = $15.30</p>
                    <p><strong>Total amount:</strong> $92.23 + $15.30 = $107.53</p>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Common Percentage Mistakes to Avoid:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Base Confusion:</strong> Always identify what the percentage is "of" (the base value)</li>
                  <li><strong>Direction Errors:</strong> Be clear about increases vs. decreases</li>
                  <li><strong>Rounding Too Early:</strong> Keep precision through calculations, round at the end</li>
                  <li><strong>Percentage vs. Decimal:</strong> Remember 25% = 0.25 in calculations</li>
                  <li><strong>Compounding:</strong> Multiple percentage changes don't simply add together</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Percentage Concepts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-700 space-y-4">
                <h4 className="font-semibold text-gray-800 mb-3">Compound Percentage Changes:</h4>
                <p>
                  When percentages are applied sequentially, they compound rather than add. For example, if a price increases 
                  by 10% and then decreases by 10%, the final price is not the original price. Starting with $100: 
                  $100 → $110 (up 10%) → $99 (down 10%). The net effect is a 1% decrease, not zero change.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Compound Percentage Formula:</h5>
                  <p className="text-sm">Final Value = Initial × (1 + r₁) × (1 + r₂) × ... × (1 + rₙ)</p>
                  <p className="text-xs text-gray-600">Where r₁, r₂, etc. are percentage changes as decimals</p>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Percentage in Statistics:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Percentiles:</strong> Position within a distribution (e.g., 90th percentile)</li>
                  <li><strong>Confidence Intervals:</strong> Statistical certainty levels (e.g., 95% confidence)</li>
                  <li><strong>Error Rates:</strong> Accuracy and precision measurements</li>
                  <li><strong>Population Samples:</strong> Representative subset analysis</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Financial Applications:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium">Investment Returns:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Annual percentage yield (APY)</li>
                      <li>• Return on investment (ROI)</li>
                      <li>• Portfolio allocation percentages</li>
                      <li>• Risk assessment percentages</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium">Loan Calculations:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Annual percentage rate (APR)</li>
                      <li>• Down payment percentages</li>
                      <li>• Debt-to-income ratios</li>
                      <li>• Loan-to-value ratios</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-700 space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What's the difference between 50% more and 50% of?</h4>
                    <p>"50% more" means adding 50% to the original value (100 + 50% = 150), while "50% of" means taking half the value (50% of 100 = 50). The words "more," "of," "less," and "off" are crucial for understanding the operation.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How do I convert between percentages, decimals, and fractions?</h4>
                    <p>To convert: Percentage to decimal (divide by 100), Decimal to percentage (multiply by 100), Percentage to fraction (put over 100 and simplify). For example: 25% = 0.25 = 1/4.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Why doesn't a 50% increase followed by a 50% decrease return to the original value?</h4>
                    <p>Because the base changes after the first operation. Starting with 100: 100 + 50% = 150, then 150 - 50% = 75. The 50% decrease is calculated from 150, not 100. To return to the original value after a 50% increase, you need a 33.33% decrease.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How accurate should my percentage calculations be?</h4>
                    <p>It depends on the context. For financial calculations, 2-4 decimal places are common. For general purposes, 1-2 decimal places are usually sufficient. Always consider the precision of your input data and round appropriately for your use case.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can percentages exceed 100%?</h4>
                    <p>Yes! Percentages can exceed 100% when representing increases, multiples, or ratios. For example, "200% increase" means tripling the original value, and "150% of the original" means 1.5 times the original value.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Calculator Notes & Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription className="text-sm space-y-2">
                <p>• This calculator provides precise percentage calculations for educational and general use.</p>
                <p>• For financial decisions, always verify calculations with appropriate financial tools and professionals.</p>
                <p>• Round results appropriately based on your specific use case and required precision.</p>
                <p>• Remember that percentage changes compound when applied sequentially.</p>
                <p>• Use negative values for percentage decreases in the increase/decrease calculator.</p>
                <p>• All calculations are performed in real-time as you type for immediate results.</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Related Calculators */}
        <RelatedCalculators currentCalculatorId="percentage" />
      </div>
    </CalculatorLayoutWithAds>
  );
}