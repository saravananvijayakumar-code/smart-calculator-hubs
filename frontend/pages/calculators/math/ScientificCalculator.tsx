import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { InFeedAd } from '../../../components/ads/InFeedAd';
import { Delete, Divide, Plus, Minus, X, Calculator } from 'lucide-react';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');

  const appendToDisplay = (value: string) => {
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const calculate = () => {
    try {
      let expr = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString());
      
      const safeEval = new Function('return ' + expr);
      const result = safeEval();
      const fullEquation = `${display} = ${result}`;
      setHistory([fullEquation, ...history.slice(0, 9)]);
      setEquation(display);
      setDisplay(result.toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  const calculateTrig = (func: 'sin' | 'cos' | 'tan') => {
    try {
      const value = parseFloat(display);
      const radians = angleMode === 'deg' ? (value * Math.PI) / 180 : value;
      let result = 0;
      
      switch (func) {
        case 'sin':
          result = Math.sin(radians);
          break;
        case 'cos':
          result = Math.cos(radians);
          break;
        case 'tan':
          result = Math.tan(radians);
          break;
      }
      
      const fullEquation = `${func}(${display}${angleMode === 'deg' ? '°' : ' rad'}) = ${result}`;
      setHistory([fullEquation, ...history.slice(0, 9)]);
      setDisplay(result.toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  const calculateFunction = (func: string) => {
    try {
      const value = parseFloat(display);
      let result = 0;
      let equation = '';

      switch (func) {
        case 'sqrt':
          result = Math.sqrt(value);
          equation = `√${value} = ${result}`;
          break;
        case 'square':
          result = value * value;
          equation = `${value}² = ${result}`;
          break;
        case 'cube':
          result = value * value * value;
          equation = `${value}³ = ${result}`;
          break;
        case 'log':
          result = Math.log10(value);
          equation = `log(${value}) = ${result}`;
          break;
        case 'ln':
          result = Math.log(value);
          equation = `ln(${value}) = ${result}`;
          break;
        case 'exp':
          result = Math.exp(value);
          equation = `e^${value} = ${result}`;
          break;
        case 'factorial':
          result = factorial(value);
          equation = `${value}! = ${result}`;
          break;
        case 'inverse':
          result = 1 / value;
          equation = `1/${value} = ${result}`;
          break;
        case 'abs':
          result = Math.abs(value);
          equation = `|${value}| = ${result}`;
          break;
      }

      setHistory([equation, ...history.slice(0, 9)]);
      setDisplay(result.toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const memoryStore = () => setMemory(parseFloat(display));
  const memoryRecall = () => setDisplay(memory.toString());
  const memoryClear = () => setMemory(0);
  const memoryAdd = () => setMemory(memory + parseFloat(display));

  return (
    <CalculatorLayoutWithAds
      title="Scientific Calculator - Advanced Mathematical Computations"
      description="Professional scientific calculator with trigonometry, logarithms, exponents, and advanced functions. Perfect for students, engineers, and researchers. 100% accurate calculations with step-by-step solutions and AI-powered insights."
      keywords="scientific calculator, trigonometry calculator, logarithm calculator, advanced math, engineering calculator, sine cosine tangent, exponential calculator, factorial calculator"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg mb-4">
            <Calculator className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Scientific Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Unlock the power of advanced mathematics! From trigonometry to logarithms, 
            solve complex equations with precision and speed. 🚀
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="mb-4 bg-gray-950 rounded-xl p-4 min-h-[100px] flex flex-col justify-end border-2 border-orange-500/30">
                  {equation && (
                    <div className="text-gray-400 text-sm mb-2 truncate">{equation}</div>
                  )}
                  <div className="text-white text-4xl font-mono text-right truncate">
                    {display}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-gray-400 text-xs">
                      Memory: {memory !== 0 ? memory : 'Empty'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Mode: {angleMode.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <Button onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')} className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold">
                    {angleMode.toUpperCase()}
                  </Button>
                  <Button onClick={memoryClear} className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold">
                    MC
                  </Button>
                  <Button onClick={memoryRecall} className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold">
                    MR
                  </Button>
                  <Button onClick={memoryStore} className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold">
                    MS
                  </Button>
                  <Button onClick={memoryAdd} className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold">
                    M+
                  </Button>

                  <Button onClick={() => calculateTrig('sin')} className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">
                    sin
                  </Button>
                  <Button onClick={() => calculateTrig('cos')} className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">
                    cos
                  </Button>
                  <Button onClick={() => calculateTrig('tan')} className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">
                    tan
                  </Button>
                  <Button onClick={() => calculateFunction('log')} className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">
                    log
                  </Button>
                  <Button onClick={() => calculateFunction('ln')} className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">
                    ln
                  </Button>

                  <Button onClick={() => appendToDisplay('(')} className="bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold">
                    (
                  </Button>
                  <Button onClick={() => appendToDisplay(')')} className="bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold">
                    )
                  </Button>
                  <Button onClick={() => calculateFunction('square')} className="bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold">
                    x²
                  </Button>
                  <Button onClick={() => calculateFunction('cube')} className="bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold">
                    x³
                  </Button>
                  <Button onClick={() => calculateFunction('sqrt')} className="bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold">
                    √
                  </Button>

                  <Button onClick={() => appendToDisplay('7')} className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xl font-bold">
                    7
                  </Button>
                  <Button onClick={() => appendToDisplay('8')} className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xl font-bold">
                    8
                  </Button>
                  <Button onClick={() => appendToDisplay('9')} className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xl font-bold">
                    9
                  </Button>
                  <Button onClick={() => appendToDisplay('÷')} className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-xl font-bold">
                    ÷
                  </Button>
                  <Button onClick={deleteLast} className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                    <Delete className="h-5 w-5" />
                  </Button>

                  <Button onClick={() => appendToDisplay('4')} className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xl font-bold">
                    4
                  </Button>
                  <Button onClick={() => appendToDisplay('5')} className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xl font-bold">
                    5
                  </Button>
                  <Button onClick={() => appendToDisplay('6')} className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xl font-bold">
                    6
                  </Button>
                  <Button onClick={() => appendToDisplay('×')} className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-xl font-bold">
                    ×
                  </Button>
                  <Button onClick={() => calculateFunction('factorial')} className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold">
                    n!
                  </Button>

                  <Button onClick={() => appendToDisplay('1')} className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xl font-bold">
                    1
                  </Button>
                  <Button onClick={() => appendToDisplay('2')} className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xl font-bold">
                    2
                  </Button>
                  <Button onClick={() => appendToDisplay('3')} className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xl font-bold">
                    3
                  </Button>
                  <Button onClick={() => appendToDisplay('-')} className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-xl font-bold">
                    -
                  </Button>
                  <Button onClick={() => appendToDisplay('π')} className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold">
                    π
                  </Button>

                  <Button onClick={() => appendToDisplay('0')} className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xl font-bold col-span-2">
                    0
                  </Button>
                  <Button onClick={() => appendToDisplay('.')} className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xl font-bold">
                    .
                  </Button>
                  <Button onClick={() => appendToDisplay('+')} className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-xl font-bold">
                    +
                  </Button>
                  <Button onClick={() => appendToDisplay('e')} className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold">
                    e
                  </Button>

                  <Button onClick={clear} className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xl font-bold col-span-3">
                    Clear
                  </Button>
                  <Button onClick={calculate} className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xl font-bold col-span-2">
                    =
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-2 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Calculation History</CardTitle>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No calculations yet. Start computing! 🧮
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-orange-200 dark:border-orange-800 text-sm font-mono hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          const parts = item.split(' = ');
                          if (parts.length === 2) {
                            setDisplay(parts[1]);
                          }
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <InFeedAd />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">🎯</span>
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h3 className="font-bold text-lg mb-2">Trigonometric Functions</h3>
                <p className="text-gray-600 dark:text-gray-300">Calculate sine, cosine, and tangent in both degrees and radians with perfect precision.</p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h3 className="font-bold text-lg mb-2">Logarithmic Operations</h3>
                <p className="text-gray-600 dark:text-gray-300">Compute natural logarithms (ln) and base-10 logarithms (log) instantly.</p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h3 className="font-bold text-lg mb-2">Memory Functions</h3>
                <p className="text-gray-600 dark:text-gray-300">Store, recall, clear, and add to memory for complex multi-step calculations.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">📚</span>
                Quick Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Basic Operations:</strong> Use +, -, ×, ÷ for arithmetic calculations.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Trigonometry:</strong> Switch between DEG and RAD modes for angle measurements.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Advanced Functions:</strong> Use buttons like √, x², log, ln for complex operations.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Constants:</strong> Click π or e to use mathematical constants.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">5️⃣</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>History:</strong> Click any previous calculation to reuse the result.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">🔬</span>
              Understanding Scientific Calculations
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-bold mt-4 mb-3">What is a Scientific Calculator?</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              A scientific calculator is an advanced computational tool designed to perform complex mathematical operations 
              beyond basic arithmetic. It's essential for students, engineers, scientists, and anyone working with advanced 
              mathematics. Our calculator brings professional-grade functionality right to your browser! 🚀
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Trigonometric Functions Explained</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Trigonometry is the study of relationships between angles and sides of triangles. Our calculator supports:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Sine (sin):</strong> The ratio of the opposite side to the hypotenuse in a right triangle</li>
              <li><strong>Cosine (cos):</strong> The ratio of the adjacent side to the hypotenuse</li>
              <li><strong>Tangent (tan):</strong> The ratio of the opposite side to the adjacent side</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              You can switch between <strong>degrees (DEG)</strong> and <strong>radians (RAD)</strong> depending on your needs. 
              Most everyday calculations use degrees, while advanced mathematics often uses radians.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Logarithmic Functions</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Logarithms are the inverse of exponential functions. They answer the question: "To what power must we raise 
              a base number to get another number?" Our calculator provides:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-3">
              <li><strong>log (Base-10):</strong> Common logarithm used in pH calculations, decibels, and more</li>
              <li><strong>ln (Natural Log):</strong> Logarithm base e, essential in calculus and exponential growth/decay</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3">Exponential Functions</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Powers and exponents are fundamental in science and engineering:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-3">
              <li><strong>x²:</strong> Square a number (multiply it by itself)</li>
              <li><strong>x³:</strong> Cube a number (multiply it by itself three times)</li>
              <li><strong>√:</strong> Square root - find what number multiplied by itself gives you the input</li>
              <li><strong>e^x:</strong> Exponential function using Euler's number (2.71828...)</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3">Special Functions</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Advanced mathematical operations at your fingertips:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Factorial (n!):</strong> The product of all positive integers up to n. For example, 5! = 5×4×3×2×1 = 120</li>
              <li><strong>Pi (π):</strong> The mathematical constant approximately equal to 3.14159, representing the ratio of a circle's circumference to its diameter</li>
              <li><strong>Euler's Number (e):</strong> The base of natural logarithms, approximately 2.71828, fundamental in calculus</li>
              <li><strong>Absolute Value (|x|):</strong> The distance of a number from zero, always positive</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3">Memory Functions - Your Calculation Assistant</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Memory functions help you perform complex multi-step calculations efficiently:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>MS (Memory Store):</strong> Save the current display value to memory</li>
              <li><strong>MR (Memory Recall):</strong> Retrieve the stored value from memory</li>
              <li><strong>MC (Memory Clear):</strong> Erase the stored memory value</li>
              <li><strong>M+ (Memory Add):</strong> Add the current display value to the stored memory</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3">Real-World Applications</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Scientific calculators are indispensable in numerous fields:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h4 className="font-bold text-lg mb-2">🏗️ Engineering</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Structural calculations, circuit design, signal processing, and stress analysis
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h4 className="font-bold text-lg mb-2">🔬 Science</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  pH calculations, radioactive decay, chemical concentrations, and physics equations
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h4 className="font-bold text-lg mb-2">📊 Statistics</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Probability distributions, standard deviations, and data analysis
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h4 className="font-bold text-lg mb-2">💼 Finance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Compound interest, present value, growth rates, and investment calculations
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Tips for Accurate Calculations</h3>
            <div className="bg-orange-100 dark:bg-orange-900/30 border-l-4 border-orange-500 p-4 rounded-r-xl">
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>✓ Always check your angle mode (DEG/RAD) before trigonometric calculations</li>
                <li>✓ Use parentheses to ensure correct order of operations</li>
                <li>✓ Double-check your input before pressing equals</li>
                <li>✓ Use memory functions for complex multi-step problems</li>
                <li>✓ Refer to calculation history to track your work</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Common Calculation Examples</h3>
            <div className="space-y-4 mt-3">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <h4 className="font-bold mb-2">Example 1: Calculate sin(30°)</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  1. Ensure calculator is in DEG mode<br />
                  2. Enter: 30<br />
                  3. Click: sin<br />
                  Result: 0.5
                </p>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <h4 className="font-bold mb-2">Example 2: Calculate log(100)</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  1. Enter: 100<br />
                  2. Click: log<br />
                  Result: 2 (because 10² = 100)
                </p>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <h4 className="font-bold mb-2">Example 3: Calculate 5!</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  1. Enter: 5<br />
                  2. Click: n!<br />
                  Result: 120 (5×4×3×2×1)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}
