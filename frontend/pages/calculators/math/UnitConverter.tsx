import { useState, useEffect } from 'react';
import { ArrowLeftRight, Ruler, Weight, Thermometer, Zap, Sparkles, TrendingUp, Globe, BookOpen, Lightbulb, Target, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface ConversionResult {
  result: number;
  formula: string;
  isValid: boolean;
}

export function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<ConversionResult>({
    result: 0,
    formula: '',
    isValid: false
  });

  const conversions: { [key: string]: { [key: string]: { [key: string]: number | ((value: number) => number) } } } = {
    length: {
      meters: { feet: 3.28084, inches: 39.3701, yards: 1.09361, centimeters: 100, millimeters: 1000, kilometers: 0.001 },
      feet: { meters: 0.3048, inches: 12, yards: 0.333333, centimeters: 30.48, millimeters: 304.8, kilometers: 0.0003048 },
      inches: { meters: 0.0254, feet: 0.0833333, yards: 0.0277778, centimeters: 2.54, millimeters: 25.4, kilometers: 0.0000254 },
      yards: { meters: 0.9144, feet: 3, inches: 36, centimeters: 91.44, millimeters: 914.4, kilometers: 0.0009144 },
      centimeters: { meters: 0.01, feet: 0.0328084, inches: 0.393701, yards: 0.0109361, millimeters: 10, kilometers: 0.00001 },
      millimeters: { meters: 0.001, feet: 0.00328084, inches: 0.0393701, yards: 0.00109361, centimeters: 0.1, kilometers: 0.000001 },
      kilometers: { meters: 1000, feet: 3280.84, inches: 39370.1, yards: 1093.61, centimeters: 100000, millimeters: 1000000 }
    },
    weight: {
      kilograms: { pounds: 2.20462, ounces: 35.274, grams: 1000, tons: 0.001, stones: 0.157473 },
      pounds: { kilograms: 0.453592, ounces: 16, grams: 453.592, tons: 0.000453592, stones: 0.0714286 },
      ounces: { kilograms: 0.0283495, pounds: 0.0625, grams: 28.3495, tons: 0.0000283495, stones: 0.00446429 },
      grams: { kilograms: 0.001, pounds: 0.00220462, ounces: 0.035274, tons: 0.000001, stones: 0.000157473 },
      tons: { kilograms: 1000, pounds: 2204.62, ounces: 35274, grams: 1000000, stones: 157.473 },
      stones: { kilograms: 6.35029, pounds: 14, ounces: 224, grams: 6350.29, tons: 0.00635029 }
    },
    temperature: {
      celsius: { fahrenheit: (c: number) => (c * 9/5) + 32, kelvin: (c: number) => c + 273.15 },
      fahrenheit: { celsius: (f: number) => (f - 32) * 5/9, kelvin: (f: number) => (f - 32) * 5/9 + 273.15 },
      kelvin: { celsius: (k: number) => k - 273.15, fahrenheit: (k: number) => (k - 273.15) * 9/5 + 32 }
    }
  };

  const units: { [key: string]: string[] } = {
    length: ['meters', 'feet', 'inches', 'yards', 'centimeters', 'millimeters', 'kilometers'],
    weight: ['kilograms', 'pounds', 'ounces', 'grams', 'tons', 'stones'],
    temperature: ['celsius', 'fahrenheit', 'kelvin']
  };

  const categoryIcons = {
    length: Ruler,
    weight: Weight,
    temperature: Thermometer
  };

  const categoryColors = {
    length: 'from-blue-500 to-cyan-500',
    weight: 'from-purple-500 to-pink-500',
    temperature: 'from-orange-500 to-red-500'
  };

  useEffect(() => {
    setFromUnit('');
    setToUnit('');
    setInputValue('');
    setResult({ result: 0, formula: '', isValid: false });
  }, [category]);

  useEffect(() => {
    const value = parseFloat(inputValue);
    
    if (!value || !fromUnit || !toUnit || fromUnit === toUnit) {
      setResult({ result: 0, formula: '', isValid: false });
      return;
    }

    let convertedValue: number;
    let formula: string;

    if (category === 'temperature') {
      const tempConversions = conversions[category][fromUnit];
      if (tempConversions && tempConversions[toUnit]) {
        const conversion = tempConversions[toUnit];
        convertedValue = typeof conversion === 'function' ? conversion(value) : value * conversion;
        formula = `${value}° ${fromUnit} = ${convertedValue.toFixed(2)}° ${toUnit}`;
      } else {
        setResult({ result: 0, formula: '', isValid: false });
        return;
      }
    } else {
      const conversionFactor = conversions[category][fromUnit]?.[toUnit];
      if (conversionFactor) {
        if (typeof conversionFactor === 'function') {
          convertedValue = conversionFactor(value);
          formula = `${value} ${fromUnit} = ${convertedValue.toFixed(4)} ${toUnit}`;
        } else {
          convertedValue = value * conversionFactor;
          formula = `${value} ${fromUnit} × ${conversionFactor} = ${convertedValue} ${toUnit}`;
        }
      } else {
        setResult({ result: 0, formula: '', isValid: false });
        return;
      }
    }

    setResult({
      result: convertedValue,
      formula,
      isValid: true
    });
  }, [inputValue, fromUnit, toUnit, category]);

  const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];

  return (
    <CalculatorLayoutWithAds
      title="Unit Converter | Measurement Converter | Smart Calculator Hubs"
      description="Convert between different units of measurement including length, weight, temperature, and more. Free online unit converter."
      keywords="unit converter, measurement converter, length converter, weight converter, temperature converter"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <ArrowLeftRight className="w-10 h-10 text-blue-600 animate-pulse" />
            Universal Unit Converter ⚡
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform measurements instantly across length, weight, and temperature! Your ultimate conversion companion for science, cooking, travel, and everyday life. 🌍📏
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} animate-pulse`}></div>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <CategoryIcon className="h-6 w-6 animate-bounce" />
              <span>Unit Conversion</span>
              <Badge className="ml-auto bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse">
                Instant Results
              </Badge>
            </CardTitle>
            <CardDescription className="text-base">
              Select your measurement category and watch the magic happen! ✨
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  Measurement Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 text-base border-2 hover:border-blue-400 transition-all">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="length" className="text-base">📏 Length (Distance)</SelectItem>
                    <SelectItem value="weight" className="text-base">⚖️ Weight (Mass)</SelectItem>
                    <SelectItem value="temperature" className="text-base">🌡️ Temperature</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <Label htmlFor="fromUnit" className="text-base font-semibold">From Unit</Label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger className="h-12 border-2 hover:border-purple-400 transition-all">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units[category]?.map((unit) => (
                        <SelectItem key={unit} value={unit} className="text-base">
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inputValue" className="text-base font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600 animate-pulse" />
                    Value
                  </Label>
                  <Input
                    id="inputValue"
                    type="number"
                    placeholder="Enter value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="h-12 text-base border-2 hover:border-green-400 focus:border-green-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toUnit" className="text-base font-semibold">To Unit</Label>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger className="h-12 border-2 hover:border-pink-400 transition-all">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units[category]?.map((unit) => (
                        <SelectItem key={unit} value={unit} className="text-base">
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {result.isValid && (
          <div className="space-y-6 animate-fade-in">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 transform hover:scale-105 transition-all">
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse"></div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600 animate-pulse" />
                  Conversion Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 animate-pulse">
                  {category === 'temperature' 
                    ? `${result.result.toFixed(2)}° ${toUnit}`
                    : `${result.result.toFixed(6)} ${toUnit}`
                  }
                </div>
                <p className="text-base text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
                  <span className="font-mono">{result.formula}</span>
                </p>
                <Progress value={100} className="mt-4 h-2 bg-green-200" />
              </CardContent>
            </Card>

            <AIAnalysis
              analysisRequest={{
                calculatorType: "unit-converter",
                data: {
                  fromUnit: fromUnit,
                  toUnit: toUnit,
                  fromValue: parseFloat(inputValue) || 0,
                  toValue: result.result,
                  category: category,
                  conversionFactor: result.result / (parseFloat(inputValue) || 1)
                }
              }}
              autoRun={true}
              title="AI Unit Conversion Analysis"
              description="Get practical insights and real-world applications for your unit conversions."
            />

            <ExportShareButtons
              calculatorType="unit-converter"
              inputs={{
                inputValue: parseFloat(inputValue) || 0,
                fromUnit,
                toUnit,
                category
              }}
              results={{
                result: result.result,
                formula: result.formula
              }}
              title="Unit Converter Report"
            />
          </div>
        )}

        <Card className="shadow-lg border-2 border-blue-100 dark:border-blue-900">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="w-6 h-6 animate-bounce" />
              Quick Reference Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg transform hover:scale-105 transition-all">
                <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2 text-lg">
                  <Ruler className="w-5 h-5 animate-pulse" />
                  Length 📏
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">1m</Badge>
                    <span>= 3.28 feet</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">1"</Badge>
                    <span>= 2.54 cm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">1 mi</Badge>
                    <span>= 1.609 km</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">1 yd</Badge>
                    <span>= 0.914 m</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg transform hover:scale-105 transition-all">
                <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2 text-lg">
                  <Weight className="w-5 h-5 animate-pulse" />
                  Weight ⚖️
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700">1 kg</Badge>
                    <span>= 2.205 lbs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700">1 lb</Badge>
                    <span>= 16 oz</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700">1 st</Badge>
                    <span>= 14 lbs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700">1 ton</Badge>
                    <span>= 1000 kg</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg transform hover:scale-105 transition-all">
                <h4 className="font-bold text-orange-700 dark:text-orange-300 mb-3 flex items-center gap-2 text-lg">
                  <Thermometer className="w-5 h-5 animate-pulse" />
                  Temperature 🌡️
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-orange-100 text-orange-700">0°C</Badge>
                    <span>= 32°F = 273K</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-orange-100 text-orange-700">100°C</Badge>
                    <span>= 212°F</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-orange-100 text-orange-700">°F</Badge>
                    <span>= (°C × 9/5) + 32</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-orange-100 text-orange-700">°C</Badge>
                    <span>= (°F - 32) × 5/9</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lightbulb className="w-6 h-6 animate-bounce" />
              What Are Unit Conversions? 🤔
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg leading-relaxed">
              Unit conversions are the mathematical process of changing a measurement from one unit to another while keeping the actual quantity the same. Think of it like translating between languages—you're expressing the same idea in different words! Whether you're converting kilometers to miles for a road trip, grams to ounces for a recipe, or Celsius to Fahrenheit for the weather forecast, you're performing a unit conversion. 🌍
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                Why Do We Need Different Units?
              </h3>
              <p className="leading-relaxed mb-4">
                Throughout history, different cultures developed their own measurement systems based on what was available and practical. The ancient Egyptians used cubits (the length from elbow to fingertip), while the Romans created the mile (from "mille passus"—a thousand paces). Today, we have two main systems:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Badge className="bg-blue-600 mt-1">🌍 Metric</Badge>
                  <span><strong>The Metric System (SI):</strong> Used by most of the world, based on powers of 10. Super logical and easy to convert—1 kilometer = 1000 meters = 1,000,000 millimeters! It was invented during the French Revolution to standardize measurements.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Badge className="bg-purple-600 mt-1">🇺🇸 Imperial</Badge>
                  <span><strong>The Imperial System:</strong> Primarily used in the United States, Myanmar, and Liberia. It includes feet, pounds, and Fahrenheit. While it seems quirky (12 inches = 1 foot, 3 feet = 1 yard), it evolved from practical everyday objects—a "foot" was literally the length of a human foot!</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600 animate-spin" style={{ animationDuration: '3s' }} />
                Real-World Applications 🎯
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-700 dark:text-green-300">🧑‍🍳 Cooking & Baking</h4>
                  <p>Converting recipes from one country to another! American recipes use cups and Fahrenheit, while European recipes use grams and Celsius. A cup of flour = ~125 grams.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300">✈️ International Travel</h4>
                  <p>Understanding road signs (speed limits in km/h vs mph), weather forecasts (°C vs °F), and distances (kilometers vs miles) when traveling abroad.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300">🔬 Science & Engineering</h4>
                  <p>Scientists worldwide use metric units for consistency. NASA once lost a $125 million Mars orbiter because one team used metric and another used imperial units!</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-700 dark:text-orange-300">💪 Fitness & Health</h4>
                  <p>Converting body weight (kg to lbs), tracking running distances (km to miles), and understanding nutritional labels (grams to ounces).</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Award className="w-6 h-6 animate-bounce" />
              Mastering the Three Main Categories 📊
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 text-gray-700 dark:text-gray-300">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Ruler className="w-6 h-6 animate-pulse" />
                  1. Length (Distance) Conversions 📏
                </h3>
                <p className="mb-4 leading-relaxed">
                  Length measures how far apart two points are. From the microscopic (nanometers in computer chips) to the astronomical (light-years between stars), length conversions help us make sense of our universe!
                </p>
                <div className="space-y-3">
                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-600">🔢 Common Conversions:</h4>
                    <ul className="space-y-2 ml-4">
                      <li><strong>1 inch = 2.54 centimeters</strong> (exactly defined since 1959)</li>
                      <li><strong>1 foot = 12 inches = 30.48 cm</strong></li>
                      <li><strong>1 yard = 3 feet = 36 inches = 91.44 cm</strong></li>
                      <li><strong>1 meter = 100 cm = 3.28 feet = 39.37 inches</strong></li>
                      <li><strong>1 kilometer = 1000 meters = 0.621 miles</strong></li>
                      <li><strong>1 mile = 5,280 feet = 1.609 kilometers</strong></li>
                    </ul>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-cyan-600">🌟 Fun Facts:</h4>
                    <ul className="space-y-2 ml-4">
                      <li>📌 The meter was originally defined as 1/10,000,000 of the distance from the North Pole to the equator through Paris!</li>
                      <li>📌 A "nautical mile" (1.852 km) is used in aviation and maritime travel because it's based on the Earth's circumference—one minute of latitude.</li>
                      <li>📌 The tallest building in the world, Burj Khalifa, is 828 meters (2,717 feet) tall—that's over half a mile straight up!</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Weight className="w-6 h-6 animate-pulse" />
                  2. Weight (Mass) Conversions ⚖️
                </h3>
                <p className="mb-4 leading-relaxed">
                  Weight and mass are often used interchangeably, though technically mass is the amount of matter in an object while weight is the force of gravity on that mass. For everyday purposes on Earth, they're essentially the same!
                </p>
                <div className="space-y-3">
                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-purple-600">🔢 Common Conversions:</h4>
                    <ul className="space-y-2 ml-4">
                      <li><strong>1 gram = 0.035 ounces</strong> (about the weight of a paperclip)</li>
                      <li><strong>1 ounce = 28.35 grams</strong></li>
                      <li><strong>1 pound = 16 ounces = 453.6 grams = 0.454 kg</strong></li>
                      <li><strong>1 kilogram = 1000 grams = 2.205 pounds</strong></li>
                      <li><strong>1 stone = 14 pounds = 6.35 kg</strong> (mainly used in UK/Ireland)</li>
                      <li><strong>1 metric ton = 1000 kg = 2,204.6 pounds</strong></li>
                    </ul>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-pink-600">🌟 Fun Facts:</h4>
                    <ul className="space-y-2 ml-4">
                      <li>📌 The kilogram was redefined in 2019! It's no longer based on a physical object (the International Prototype Kilogram) but on fundamental constants of physics.</li>
                      <li>📌 Gold is measured in "troy ounces" (31.1 grams) which are heavier than regular ounces (28.35 grams)—so you get less gold than you think!</li>
                      <li>📌 The word "pound" comes from the Latin "libra pondo" (a pound by weight), which is why the abbreviation is "lb"!</li>
                      <li>📌 An African elephant weighs about 6,000 kg (13,200 lbs or 6 metric tons)—equivalent to about 85 average adult humans!</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <Thermometer className="w-6 h-6 animate-pulse" />
                  3. Temperature Conversions 🌡️
                </h3>
                <p className="mb-4 leading-relaxed">
                  Temperature is unique because it's not a simple multiplication—it requires addition or subtraction too! That's because the zero points are different in each scale. Temperature measures the average kinetic energy of particles in a substance.
                </p>
                <div className="space-y-3">
                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-orange-600">🔢 The Three Main Scales:</h4>
                    <ul className="space-y-3 ml-4">
                      <li>
                        <strong>Celsius (°C):</strong> Used worldwide. Water freezes at 0°C and boils at 100°C at sea level. Named after Swedish astronomer Anders Celsius.
                      </li>
                      <li>
                        <strong>Fahrenheit (°F):</strong> Used in the US. Water freezes at 32°F and boils at 212°F. Named after German physicist Daniel Gabriel Fahrenheit. The scale was based on three points: 0°F (a brine solution), 32°F (water freezing), and 96°F (human body temperature, though it's actually ~98.6°F).
                      </li>
                      <li>
                        <strong>Kelvin (K):</strong> The scientific standard. It starts at "absolute zero" (−273.15°C or −459.67°F), the coldest possible temperature where all molecular motion stops! Water freezes at 273.15K and boils at 373.15K.
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-red-600">🔢 Conversion Formulas:</h4>
                    <ul className="space-y-2 ml-4 font-mono text-sm">
                      <li>°F = (°C × 9/5) + 32</li>
                      <li>°C = (°F − 32) × 5/9</li>
                      <li>K = °C + 273.15</li>
                      <li>°C = K − 273.15</li>
                    </ul>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-pink-600">🌟 Fun Facts:</h4>
                    <ul className="space-y-2 ml-4">
                      <li>📌 -40°C and -40°F are exactly the same temperature—the only point where the two scales meet!</li>
                      <li>📌 The hottest temperature ever recorded on Earth was 134°F (56.7°C) in Death Valley, California in 1913.</li>
                      <li>📌 The coldest temperature ever recorded was -128.6°F (-89.2°C) at Antarctica's Vostok Station in 1983.</li>
                      <li>📌 The surface of the Sun is about 5,500°C (9,932°F), while its core reaches 15 million°C (27 million°F)!</li>
                      <li>📌 Scientists have created temperatures colder than outer space (which is about -270°C) in laboratories—getting within billionths of a degree from absolute zero!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="w-6 h-6 animate-bounce" />
              Pro Tips for Perfect Conversions 🎯
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 text-gray-700 dark:text-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg transform hover:scale-105 transition-all">
                <h4 className="font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                  <Badge className="bg-green-600">1</Badge>
                  Understand the Conversion Factor
                </h4>
                <p className="text-sm">
                  Every conversion uses a multiplication factor. For example, 1 inch = 2.54 cm, so to convert inches to cm, multiply by 2.54. To go the other way, divide by 2.54!
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg transform hover:scale-105 transition-all">
                <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Badge className="bg-blue-600">2</Badge>
                  Double-Check Your Units
                </h4>
                <p className="text-sm">
                  Always verify you're converting to the right unit. Converting 5 kilometers to meters? That's 5,000 meters. To millimeters? 5,000,000 millimeters!
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg transform hover:scale-105 transition-all">
                <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                  <Badge className="bg-purple-600">3</Badge>
                  Use Dimensional Analysis
                </h4>
                <p className="text-sm">
                  Write out your conversions as fractions so units cancel out. Converting 60 mph to km/h? (60 miles/hour) × (1.609 km/mile) = 96.54 km/h. The "miles" cancel!
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg transform hover:scale-105 transition-all">
                <h4 className="font-bold text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-2">
                  <Badge className="bg-orange-600">4</Badge>
                  Remember Context Matters
                </h4>
                <p className="text-sm">
                  For everyday use, rounding is fine (1 kg ≈ 2.2 lbs). For science and engineering, use precise conversion factors (1 kg = 2.20462262 lbs) to avoid compound errors!
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-lg mt-6">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <Lightbulb className="w-5 h-5 animate-pulse" />
                Quick Mental Math Tricks 🧠
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Badge className="bg-yellow-600 mt-0.5">📌</Badge>
                  <span><strong>Miles to Kilometers:</strong> Multiply by 1.6 (or use the Fibonacci sequence! 5 mi ≈ 8 km, 8 mi ≈ 13 km, 13 mi ≈ 21 km)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="bg-yellow-600 mt-0.5">📌</Badge>
                  <span><strong>Celsius to Fahrenheit (roughly):</strong> Double it and add 30. (20°C × 2 = 40, + 30 = 70°F vs actual 68°F—close enough!)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="bg-yellow-600 mt-0.5">📌</Badge>
                  <span><strong>Kilograms to Pounds:</strong> Double it and add 10%. (10 kg × 2 = 20, + 10% = 22 lbs vs actual 22.05 lbs)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="bg-yellow-600 mt-0.5">📌</Badge>
                  <span><strong>Feet to Meters:</strong> Divide by 3 (roughly). (6 feet ÷ 3 = 2 meters vs actual 1.83 meters—good for estimates!)</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 animate-pulse" />
              Frequently Asked Questions ❓
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 text-gray-700 dark:text-gray-300">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-5 rounded-lg">
                <h4 className="font-bold text-lg mb-2 text-indigo-700 dark:text-indigo-300">
                  Q: Why doesn't the US use the metric system?
                </h4>
                <p className="leading-relaxed">
                  <strong>A:</strong> The US actually officially adopted the metric system in 1975, but it remains optional! The imperial system was already deeply embedded in American infrastructure, industry, and culture. Converting everything—from road signs to tools to recipes—would cost billions of dollars. Interestingly, the US military, scientists, and many industries already use metric internally. Fun fact: US customary units are legally defined in terms of metric units (1 inch = exactly 2.54 cm by law)!
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-5 rounded-lg">
                <h4 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-300">
                  Q: What's the difference between weight and mass?
                </h4>
                <p className="leading-relaxed">
                  <strong>A:</strong> Mass is the amount of matter in an object, measured in kilograms or grams—it never changes regardless of location. Weight is the force of gravity on that mass, measured in newtons (or pounds-force). An astronaut has the same mass on Earth and the Moon, but weighs only 1/6th as much on the Moon due to lower gravity! In everyday language, we use "weight" for both concepts because gravity is constant on Earth.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-lg">
                <h4 className="font-bold text-lg mb-2 text-green-700 dark:text-green-300">
                  Q: Why do temperature conversions use addition/subtraction instead of just multiplication?
                </h4>
                <p className="leading-relaxed">
                  <strong>A:</strong> Because Celsius and Fahrenheit have different zero points! The Celsius scale sets 0° at water's freezing point, while Fahrenheit sets 32° at that same temperature. So you need to offset by 32°, then adjust for the different scale sizes (Celsius degrees are bigger—100° spans the same range as 180° Fahrenheit). That's why the formula is °F = (°C × 9/5) + 32. Kelvin starts at absolute zero, so converting from Celsius is simple: just add 273.15!
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-lg">
                <h4 className="font-bold text-lg mb-2 text-purple-700 dark:text-purple-300">
                  Q: How accurate do my conversions need to be?
                </h4>
                <p className="leading-relaxed">
                  <strong>A:</strong> It depends on the application! For cooking, rounding to the nearest gram or ounce is perfectly fine. For carpentry, accuracy to the nearest millimeter or 1/16th inch matters. For aerospace engineering, you need extreme precision—NASA calculations use 15+ decimal places! A good rule: match the precision of your input. If you measure 5.0 cm, converting to 1.968503937 inches is overkill—2.0 inches is more appropriate.
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-5 rounded-lg">
                <h4 className="font-bold text-lg mb-2 text-orange-700 dark:text-orange-300">
                  Q: What's the most common conversion mistake?
                </h4>
                <p className="leading-relaxed">
                  <strong>A:</strong> Confusing square units and cubic units! Converting area or volume requires squaring or cubing the conversion factor. 1 square meter ≠ 10.76 square feet... it equals 10.76² = 115.8 square feet! Similarly, 1 cubic meter = 35.3 cubic feet (not 3.28). Always think about dimensions: length (1D), area (2D), or volume (3D). Another common error: mixing up the direction—dividing when you should multiply, or vice versa. Always check if your answer makes sense!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Award className="w-6 h-6 animate-bounce" />
              Become a Conversion Master! 🏆
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-gray-700 dark:text-gray-300">
            <p className="text-lg leading-relaxed mb-4">
              Understanding unit conversions opens up a world of possibilities! Whether you're traveling internationally, following a recipe, working on a science project, or just satisfying your curiosity, being able to fluently translate between measurement systems is a superpower. 🦸
            </p>
            <p className="text-lg leading-relaxed mb-6">
              This converter handles all the math for you instantly, but understanding the "why" behind conversions helps you catch errors, estimate in your head, and appreciate the fascinating history of how humans have measured their world throughout the ages. From ancient Egyptian cubits to modern quantum definitions of the kilogram, measurement is the foundation of civilization itself!
            </p>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 p-6 rounded-lg text-center">
              <p className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
                Ready to Convert Like a Pro?
                <Sparkles className="w-6 h-6 text-pink-600 animate-pulse" />
              </p>
              <p className="text-base">
                Start converting above and explore the amazing world of measurements! 🌈📐⚖️🌡️
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}
