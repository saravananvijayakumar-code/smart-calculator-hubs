import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import EnhancedAIAnalysis from '../../../components/EnhancedAIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { InFeedAd } from '../../../components/ads/InFeedAd';
import { Divide, Plus, Minus, X, ArrowRight } from 'lucide-react';

interface Fraction {
  numerator: number;
  denominator: number;
}

export default function FractionCalculator() {
  const [fraction1, setFraction1] = useState<Fraction>({ numerator: 1, denominator: 2 });
  const [fraction2, setFraction2] = useState<Fraction>({ numerator: 1, denominator: 3 });
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('add');
  const [result, setResult] = useState<Fraction | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [showAI, setShowAI] = useState(false);

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  const simplifyFraction = (num: number, den: number): Fraction => {
    if (den === 0) return { numerator: NaN, denominator: 1 };
    const divisor = gcd(num, den);
    let simplifiedNum = num / divisor;
    let simplifiedDen = den / divisor;
    
    if (simplifiedDen < 0) {
      simplifiedNum = -simplifiedNum;
      simplifiedDen = -simplifiedDen;
    }
    
    return { numerator: simplifiedNum, denominator: simplifiedDen };
  };

  const fractionToMixed = (frac: Fraction): string => {
    if (isNaN(frac.numerator)) return 'Undefined';
    
    const whole = Math.floor(Math.abs(frac.numerator) / frac.denominator);
    const remainder = Math.abs(frac.numerator) % frac.denominator;
    const sign = frac.numerator < 0 ? '-' : '';
    
    if (whole === 0) {
      return `${sign}${remainder}/${frac.denominator}`;
    } else if (remainder === 0) {
      return `${sign}${whole}`;
    } else {
      return `${sign}${whole} ${remainder}/${frac.denominator}`;
    }
  };

  const fractionToDecimal = (frac: Fraction): string => {
    if (isNaN(frac.numerator) || frac.denominator === 0) return 'Undefined';
    return (frac.numerator / frac.denominator).toFixed(6);
  };

  const calculate = () => {
    const calculationSteps: string[] = [];
    let resultFraction: Fraction;

    calculationSteps.push(`Step 1: Starting with ${fraction1.numerator}/${fraction1.denominator} and ${fraction2.numerator}/${fraction2.denominator}`);

    switch (operation) {
      case 'add':
        const addLcm = lcm(fraction1.denominator, fraction2.denominator);
        const addNum1 = fraction1.numerator * (addLcm / fraction1.denominator);
        const addNum2 = fraction2.numerator * (addLcm / fraction2.denominator);
        
        calculationSteps.push(`Step 2: Find LCD (Least Common Denominator) = ${addLcm}`);
        calculationSteps.push(`Step 3: Convert to equivalent fractions: ${addNum1}/${addLcm} + ${addNum2}/${addLcm}`);
        calculationSteps.push(`Step 4: Add numerators: (${addNum1} + ${addNum2})/${addLcm} = ${addNum1 + addNum2}/${addLcm}`);
        
        resultFraction = simplifyFraction(addNum1 + addNum2, addLcm);
        calculationSteps.push(`Step 5: Simplify: ${resultFraction.numerator}/${resultFraction.denominator}`);
        break;

      case 'subtract':
        const subLcm = lcm(fraction1.denominator, fraction2.denominator);
        const subNum1 = fraction1.numerator * (subLcm / fraction1.denominator);
        const subNum2 = fraction2.numerator * (subLcm / fraction2.denominator);
        
        calculationSteps.push(`Step 2: Find LCD (Least Common Denominator) = ${subLcm}`);
        calculationSteps.push(`Step 3: Convert to equivalent fractions: ${subNum1}/${subLcm} - ${subNum2}/${subLcm}`);
        calculationSteps.push(`Step 4: Subtract numerators: (${subNum1} - ${subNum2})/${subLcm} = ${subNum1 - subNum2}/${subLcm}`);
        
        resultFraction = simplifyFraction(subNum1 - subNum2, subLcm);
        calculationSteps.push(`Step 5: Simplify: ${resultFraction.numerator}/${resultFraction.denominator}`);
        break;

      case 'multiply':
        calculationSteps.push(`Step 2: Multiply numerators: ${fraction1.numerator} × ${fraction2.numerator} = ${fraction1.numerator * fraction2.numerator}`);
        calculationSteps.push(`Step 3: Multiply denominators: ${fraction1.denominator} × ${fraction2.denominator} = ${fraction1.denominator * fraction2.denominator}`);
        calculationSteps.push(`Step 4: Result: ${fraction1.numerator * fraction2.numerator}/${fraction1.denominator * fraction2.denominator}`);
        
        resultFraction = simplifyFraction(
          fraction1.numerator * fraction2.numerator,
          fraction1.denominator * fraction2.denominator
        );
        calculationSteps.push(`Step 5: Simplify: ${resultFraction.numerator}/${resultFraction.denominator}`);
        break;

      case 'divide':
        calculationSteps.push(`Step 2: Flip the second fraction (reciprocal): ${fraction2.numerator}/${fraction2.denominator} becomes ${fraction2.denominator}/${fraction2.numerator}`);
        calculationSteps.push(`Step 3: Multiply: ${fraction1.numerator}/${fraction1.denominator} × ${fraction2.denominator}/${fraction2.numerator}`);
        calculationSteps.push(`Step 4: Multiply numerators and denominators: ${fraction1.numerator * fraction2.denominator}/${fraction1.denominator * fraction2.numerator}`);
        
        resultFraction = simplifyFraction(
          fraction1.numerator * fraction2.denominator,
          fraction1.denominator * fraction2.numerator
        );
        calculationSteps.push(`Step 5: Simplify: ${resultFraction.numerator}/${resultFraction.denominator}`);
        break;
    }

    setResult(resultFraction);
    setSteps(calculationSteps);
    setShowAI(true);
  };

  const getOperationSymbol = () => {
    switch (operation) {
      case 'add': return '+';
      case 'subtract': return '-';
      case 'multiply': return '×';
      case 'divide': return '÷';
    }
  };

  return (
    <CalculatorLayoutWithAds
      title="Fraction Calculator - Add, Subtract, Multiply, Divide Fractions"
      description="Master fractions with our advanced calculator! Simplify, add, subtract, multiply, and divide fractions with step-by-step solutions. Convert between improper fractions, mixed numbers, and decimals. Perfect for students and professionals. 100% accurate with AI-powered insights."
      keywords="fraction calculator, simplify fractions, add fractions, subtract fractions, multiply fractions, divide fractions, mixed numbers, improper fractions, fraction to decimal"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg mb-4">
            <Divide className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Fraction Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Simplify your fraction calculations! Add, subtract, multiply, and divide with crystal-clear 
            step-by-step solutions. Transform fractions into decimals and mixed numbers effortlessly! 🎯
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Divide className="h-6 w-6 text-indigo-600" />
                Fraction Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-700">
                <Label className="text-lg font-bold mb-3 block">First Fraction</Label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Numerator</Label>
                    <Input
                      type="number"
                      value={fraction1.numerator}
                      onChange={(e) => setFraction1({ ...fraction1, numerator: parseInt(e.target.value) || 0 })}
                      className="text-center text-2xl font-bold bg-white dark:bg-gray-900 border-2 border-indigo-300 dark:border-indigo-600"
                    />
                  </div>
                  <div className="text-4xl font-bold text-indigo-600 pb-6">/</div>
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Denominator</Label>
                    <Input
                      type="number"
                      value={fraction1.denominator}
                      onChange={(e) => setFraction1({ ...fraction1, denominator: parseInt(e.target.value) || 1 })}
                      className="text-center text-2xl font-bold bg-white dark:bg-gray-900 border-2 border-indigo-300 dark:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-center flex-wrap">
                <Button
                  onClick={() => setOperation('add')}
                  className={`${operation === 'add' ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gray-500'} text-white font-bold px-6 py-3 text-xl`}
                >
                  <Plus className="h-5 w-5 mr-1" /> Add
                </Button>
                <Button
                  onClick={() => setOperation('subtract')}
                  className={`${operation === 'subtract' ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gray-500'} text-white font-bold px-6 py-3 text-xl`}
                >
                  <Minus className="h-5 w-5 mr-1" /> Subtract
                </Button>
                <Button
                  onClick={() => setOperation('multiply')}
                  className={`${operation === 'multiply' ? 'bg-gradient-to-br from-purple-600 to-purple-700' : 'bg-gray-500'} text-white font-bold px-6 py-3 text-xl`}
                >
                  <X className="h-5 w-5 mr-1" /> Multiply
                </Button>
                <Button
                  onClick={() => setOperation('divide')}
                  className={`${operation === 'divide' ? 'bg-gradient-to-br from-orange-600 to-orange-700' : 'bg-gray-500'} text-white font-bold px-6 py-3 text-xl`}
                >
                  <Divide className="h-5 w-5 mr-1" /> Divide
                </Button>
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-700">
                <Label className="text-lg font-bold mb-3 block">Second Fraction</Label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Numerator</Label>
                    <Input
                      type="number"
                      value={fraction2.numerator}
                      onChange={(e) => setFraction2({ ...fraction2, numerator: parseInt(e.target.value) || 0 })}
                      className="text-center text-2xl font-bold bg-white dark:bg-gray-900 border-2 border-indigo-300 dark:border-indigo-600"
                    />
                  </div>
                  <div className="text-4xl font-bold text-indigo-600 pb-6">/</div>
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Denominator</Label>
                    <Input
                      type="number"
                      value={fraction2.denominator}
                      onChange={(e) => setFraction2({ ...fraction2, denominator: parseInt(e.target.value) || 1 })}
                      className="text-center text-2xl font-bold bg-white dark:bg-gray-900 border-2 border-indigo-300 dark:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={calculate}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 text-xl shadow-lg hover:shadow-xl transition-all"
              >
                Calculate Result
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <ArrowRight className="h-6 w-6 text-purple-600" />
                  Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-300 dark:border-purple-700">
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {fraction1.numerator}/{fraction1.denominator} {getOperationSymbol()} {fraction2.numerator}/{fraction2.denominator} =
                    </div>
                    <div className="text-5xl font-bold text-purple-600 mb-2">
                      {result.numerator}/{result.denominator}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Simplified Fraction</div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {result.numerator}/{result.denominator}
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Mixed Number</div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {fractionToMixed(result)}
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Decimal</div>
                      <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                        {fractionToDecimal(result)}
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Percentage</div>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {((result.numerator / result.denominator) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-300 dark:border-purple-700">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    Step-by-Step Solution
                  </h3>
                  <div className="space-y-2">
                    {steps.map((step, index) => (
                      <div key={index} className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-purple-200 dark:border-purple-700">
                        <p className="text-gray-700 dark:text-gray-300">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <InFeedAd />

        {showAI && result && (
          <>
            <div className="mb-8">
              <EnhancedAIAnalysis
                calculatorType="fraction"
                data={{
                  fraction1,
                  fraction2,
                  operation,
                  result,
                  decimal: fractionToDecimal(result),
                  mixed: fractionToMixed(result)
                }}
              />
            </div>

            <div className="mb-8">
              <ExportShareButtons
                calculatorType="fraction"
                inputs={{ fraction1, fraction2, operation }}
                results={{ result, steps, decimal: fractionToDecimal(result), mixed: fractionToMixed(result) }}
                title="Fraction Calculator Results"
              />
            </div>
          </>
        )}

        <InFeedAd />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">🎯</span>
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Simplification:</strong> Always simplify fractions to their lowest terms by dividing by the GCD</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔄</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Common Denominator:</strong> Find LCD when adding or subtracting fractions</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✖️</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Multiplication:</strong> Multiply straight across - no common denominator needed!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔁</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Division:</strong> Flip the second fraction and multiply (Keep-Change-Flip)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">📚</span>
                Common Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg">
                <strong>1/2 + 1/4 =</strong> 3/4
              </div>
              <div className="p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg">
                <strong>3/4 - 1/2 =</strong> 1/4
              </div>
              <div className="p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg">
                <strong>2/3 × 3/4 =</strong> 1/2
              </div>
              <div className="p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg">
                <strong>1/2 ÷ 1/4 =</strong> 2
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-2 border-orange-200 dark:border-orange-800 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">🎓</span>
              Understanding Fractions - Complete Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-bold mt-4 mb-3">What Are Fractions?</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              A fraction represents a part of a whole. It consists of two numbers: the <strong>numerator</strong> (top number) 
              and the <strong>denominator</strong> (bottom number). The numerator tells you how many parts you have, while the 
              denominator tells you how many equal parts make up the whole. For example, 3/4 means you have 3 parts out of 4 equal parts! 🍕
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Types of Fractions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border-2 border-orange-300 dark:border-orange-700">
                <h4 className="font-bold text-lg mb-2">🔵 Proper Fractions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Numerator is less than denominator
                </p>
                <div className="text-2xl font-bold text-orange-600">1/2, 3/4, 5/8</div>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border-2 border-orange-300 dark:border-orange-700">
                <h4 className="font-bold text-lg mb-2">🟢 Improper Fractions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Numerator is greater than or equal to denominator
                </p>
                <div className="text-2xl font-bold text-orange-600">5/3, 7/4, 9/5</div>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border-2 border-orange-300 dark:border-orange-700">
                <h4 className="font-bold text-lg mb-2">🟡 Mixed Numbers</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Whole number plus a proper fraction
                </p>
                <div className="text-2xl font-bold text-orange-600">1 1/2, 2 3/4</div>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Addition and Subtraction</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              When adding or subtracting fractions, you need a <strong>common denominator</strong>. This is like making sure 
              you're comparing apples to apples! Here's how:
            </p>
            <ol className="space-y-2 text-gray-700 dark:text-gray-300 ml-6">
              <li><strong>Step 1:</strong> Find the Least Common Denominator (LCD) of both fractions</li>
              <li><strong>Step 2:</strong> Convert each fraction to an equivalent fraction with the LCD</li>
              <li><strong>Step 3:</strong> Add or subtract the numerators, keeping the denominator the same</li>
              <li><strong>Step 4:</strong> Simplify the result if possible</li>
            </ol>
            
            <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl border-l-4 border-blue-500">
              <h4 className="font-bold mb-2">Example: 1/4 + 1/6</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                • LCD of 4 and 6 is 12<br />
                • Convert: 1/4 = 3/12 and 1/6 = 2/12<br />
                • Add: 3/12 + 2/12 = 5/12<br />
                • Result: 5/12 (already simplified!)
              </p>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Multiplication</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Multiplying fractions is actually easier than adding them! Just multiply straight across:
            </p>
            <ol className="space-y-2 text-gray-700 dark:text-gray-300 ml-6">
              <li><strong>Step 1:</strong> Multiply the numerators together</li>
              <li><strong>Step 2:</strong> Multiply the denominators together</li>
              <li><strong>Step 3:</strong> Simplify the result</li>
            </ol>

            <div className="mt-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl border-l-4 border-purple-500">
              <h4 className="font-bold mb-2">Example: 2/3 × 3/4</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                • Multiply numerators: 2 × 3 = 6<br />
                • Multiply denominators: 3 × 4 = 12<br />
                • Result: 6/12<br />
                • Simplify: 6/12 = 1/2
              </p>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Division</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Division uses the <strong>"Keep-Change-Flip"</strong> method - one of math's coolest tricks! 🎩✨
            </p>
            <ol className="space-y-2 text-gray-700 dark:text-gray-300 ml-6">
              <li><strong>Keep:</strong> Keep the first fraction as it is</li>
              <li><strong>Change:</strong> Change the division sign to multiplication</li>
              <li><strong>Flip:</strong> Flip the second fraction (reciprocal)</li>
              <li><strong>Multiply:</strong> Now multiply the fractions</li>
            </ol>

            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-xl border-l-4 border-green-500">
              <h4 className="font-bold mb-2">Example: 1/2 ÷ 1/4</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                • Keep: 1/2<br />
                • Change: ÷ becomes ×<br />
                • Flip: 1/4 becomes 4/1<br />
                • Multiply: 1/2 × 4/1 = 4/2 = 2
              </p>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Simplifying Fractions</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Simplifying means reducing a fraction to its lowest terms by dividing both numerator and denominator by their 
              <strong> Greatest Common Divisor (GCD)</strong>. This makes fractions easier to understand and work with!
            </p>

            <div className="mt-4 p-4 bg-orange-100 dark:bg-orange-900/30 rounded-xl border-l-4 border-orange-500">
              <h4 className="font-bold mb-2">Example: Simplify 12/16</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                • Find GCD of 12 and 16 = 4<br />
                • Divide numerator: 12 ÷ 4 = 3<br />
                • Divide denominator: 16 ÷ 4 = 4<br />
                • Result: 3/4
              </p>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Converting Between Forms</h3>
            
            <div className="space-y-4 mt-3">
              <div className="p-4 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                <h4 className="font-bold mb-2">Improper Fraction → Mixed Number</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Divide the numerator by denominator. The quotient is the whole number, 
                  the remainder is the new numerator.
                  <br /><strong>Example:</strong> 11/4 = 2 3/4 (11 ÷ 4 = 2 remainder 3)
                </p>
              </div>

              <div className="p-4 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
                <h4 className="font-bold mb-2">Mixed Number → Improper Fraction</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Multiply whole number by denominator, add numerator, place over original denominator.
                  <br /><strong>Example:</strong> 2 3/4 = (2×4 + 3)/4 = 11/4
                </p>
              </div>

              <div className="p-4 bg-lime-100 dark:bg-lime-900/30 rounded-xl">
                <h4 className="font-bold mb-2">Fraction → Decimal</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Divide numerator by denominator.
                  <br /><strong>Example:</strong> 3/4 = 3 ÷ 4 = 0.75
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Real-World Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h4 className="font-bold text-lg mb-2">🍕 Cooking & Recipes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Adjust ingredients: "If the recipe calls for 2/3 cup but I need to double it..."
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h4 className="font-bold text-lg mb-2">🏗️ Construction</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Measurements: "I need 3 1/2 inches of wood plus 2 3/4 inches..."
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h4 className="font-bold text-lg mb-2">💰 Finance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Splitting costs: "If we split the bill 3 ways..."
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h4 className="font-bold text-lg mb-2">📊 Data Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Proportions: "3/5 of respondents said yes..."
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Pro Tips for Success</h3>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-l-4 border-purple-500 p-4 rounded-r-xl">
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>✓ <strong>Always simplify:</strong> Make your final answer as simple as possible</li>
                <li>✓ <strong>Check your work:</strong> Convert to decimals to verify your answer</li>
                <li>✓ <strong>Draw pictures:</strong> Visual representations help understand fractions better</li>
                <li>✓ <strong>Practice regularly:</strong> The more you work with fractions, the easier they become</li>
                <li>✓ <strong>Use our calculator:</strong> Learn from the step-by-step solutions provided!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}
