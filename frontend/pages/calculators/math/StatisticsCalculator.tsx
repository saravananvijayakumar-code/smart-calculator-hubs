import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import EnhancedAIAnalysis from '../../../components/EnhancedAIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { InFeedAd } from '../../../components/ads/InFeedAd';
import { ChartBar, TrendingUp, BarChart3 } from 'lucide-react';

interface StatisticsResults {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  range: number;
  variance: number;
  standardDeviation: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  sortedData: number[];
}

export default function StatisticsCalculator() {
  const [input, setInput] = useState('10, 20, 30, 40, 50, 60, 70, 80, 90, 100');
  const [showAI, setShowAI] = useState(false);

  const results = useMemo<StatisticsResults | null>(() => {
    try {
      const numbers = input
        .split(/[\s,;]+/)
        .map(n => parseFloat(n.trim()))
        .filter(n => !isNaN(n));

      if (numbers.length === 0) return null;

      const sortedData = [...numbers].sort((a, b) => a - b);
      const count = numbers.length;
      const sum = numbers.reduce((acc, val) => acc + val, 0);
      const mean = sum / count;

      const median = count % 2 === 0
        ? (sortedData[count / 2 - 1] + sortedData[count / 2]) / 2
        : sortedData[Math.floor(count / 2)];

      const frequencyMap = new Map<number, number>();
      numbers.forEach(num => {
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
      });
      const maxFreq = Math.max(...Array.from(frequencyMap.values()));
      const mode = Array.from(frequencyMap.entries())
        .filter(([_, freq]) => freq === maxFreq && maxFreq > 1)
        .map(([num]) => num);

      const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
      const standardDeviation = Math.sqrt(variance);

      const q1Index = Math.floor(count / 4);
      const q3Index = Math.floor((3 * count) / 4);
      const q1 = sortedData[q1Index];
      const q3 = sortedData[q3Index];
      const iqr = q3 - q1;

      return {
        count,
        sum,
        mean,
        median,
        mode,
        range: sortedData[count - 1] - sortedData[0],
        variance,
        standardDeviation,
        min: sortedData[0],
        max: sortedData[count - 1],
        q1,
        q3,
        iqr,
        sortedData
      };
    } catch (error) {
      return null;
    }
  }, [input]);

  const handleCalculate = () => {
    if (results) {
      setShowAI(true);
    }
  };

  return (
    <CalculatorLayoutWithAds
      title="Statistics Calculator - Mean, Median, Mode, Standard Deviation"
      description="Professional statistics calculator for data analysis. Calculate mean, median, mode, range, variance, standard deviation, quartiles, and more. Perfect for students, researchers, and data analysts. Get instant results with comprehensive statistical insights and AI-powered analysis."
      keywords="statistics calculator, mean median mode calculator, standard deviation calculator, variance calculator, quartiles, data analysis, descriptive statistics, statistical analysis"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl shadow-lg mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
            <ChartBar className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Statistics Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform raw data into actionable insights! Calculate mean, median, mode, standard deviation, 
            and advanced statistical measures with professional precision. Perfect for data analysis! 📊✨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-950/30 border-2 border-teal-200 dark:border-teal-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-teal-600" />
                  Enter Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-lg font-bold mb-3 block">
                    Data Values
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Separate with commas, spaces, or new lines)
                    </span>
                  </Label>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter numbers separated by commas, spaces, or new lines&#10;Example: 10, 20, 30, 40, 50"
                    className="min-h-[200px] text-lg font-mono bg-white dark:bg-gray-900 border-2 border-teal-300 dark:border-teal-600 focus:border-teal-500 dark:focus:border-teal-400"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    💡 <strong>Quick tip:</strong> Paste data from Excel, copy from a list, or type manually!
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    onClick={() => setInput('10, 20, 30, 40, 50, 60, 70, 80, 90, 100')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm"
                  >
                    Sample Data 1
                  </Button>
                  <Button
                    onClick={() => setInput('5, 10, 15, 20, 25, 30, 35')}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm"
                  >
                    Sample Data 2
                  </Button>
                  <Button
                    onClick={() => setInput('100, 200, 150, 175, 225, 250, 300')}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-sm"
                  >
                    Sample Data 3
                  </Button>
                  <Button
                    onClick={() => setInput('')}
                    variant="outline"
                    className="border-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm"
                  >
                    Clear
                  </Button>
                </div>

                <Button
                  onClick={handleCalculate}
                  disabled={!results}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-4 text-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChartBar className="h-5 w-5 mr-2" />
                  Analyze Data
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-2 border-cyan-200 dark:border-cyan-800 shadow-lg sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg">
                  <div className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-1">Data Points</div>
                  <div className="text-2xl font-bold text-teal-600">{results?.count || 0}</div>
                </div>
                <div className="p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg">
                  <div className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-1">Sum Total</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {results?.sum.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0'}
                  </div>
                </div>
                <div className="p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg">
                  <div className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-1">Range</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {results?.min || 0} - {results?.max || 0}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {results && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-sm font-semibold mb-2 opacity-90">Mean (Average)</div>
                  <div className="text-4xl font-bold">{results.mean.toFixed(2)}</div>
                  <p className="text-xs mt-2 opacity-80">Sum of all values ÷ count</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-sm font-semibold mb-2 opacity-90">Median</div>
                  <div className="text-4xl font-bold">{results.median.toFixed(2)}</div>
                  <p className="text-xs mt-2 opacity-80">Middle value when sorted</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-sm font-semibold mb-2 opacity-90">Mode</div>
                  <div className="text-4xl font-bold">
                    {results.mode.length > 0 ? results.mode.join(', ') : 'None'}
                  </div>
                  <p className="text-xs mt-2 opacity-80">Most frequent value(s)</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-sm font-semibold mb-2 opacity-90">Range</div>
                  <div className="text-4xl font-bold">{results.range.toFixed(2)}</div>
                  <p className="text-xs mt-2 opacity-80">Max - Min</p>
                </CardContent>
              </Card>
            </div>

            <InFeedAd />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    Dispersion Measures
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-700 dark:text-gray-300">Variance</span>
                      <span className="text-2xl font-bold text-green-600">{results.variance.toFixed(4)}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Average of squared deviations from mean</p>
                  </div>

                  <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-700 dark:text-gray-300">Standard Deviation</span>
                      <span className="text-2xl font-bold text-green-600">{results.standardDeviation.toFixed(4)}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Square root of variance - spread of data</p>
                  </div>

                  <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-700 dark:text-gray-300">Coefficient of Variation</span>
                      <span className="text-2xl font-bold text-green-600">
                        {((results.standardDeviation / results.mean) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Relative measure of variability</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-200 dark:border-indigo-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                    Quartiles & Outliers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Q1</div>
                        <div className="text-xl font-bold text-indigo-600">{results.q1.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Q2 (Median)</div>
                        <div className="text-xl font-bold text-indigo-600">{results.median.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Q3</div>
                        <div className="text-xl font-bold text-indigo-600">{results.q3.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-700 dark:text-gray-300">IQR (Interquartile Range)</span>
                      <span className="text-2xl font-bold text-indigo-600">{results.iqr.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Q3 - Q1: Middle 50% spread</p>
                  </div>

                  <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                    <div className="font-bold text-gray-700 dark:text-gray-300 mb-2">Outlier Boundaries</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Lower:</span>
                        <span className="ml-2 font-bold text-indigo-600">
                          {(results.q1 - 1.5 * results.iqr).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Upper:</span>
                        <span className="ml-2 font-bold text-indigo-600">
                          {(results.q3 + 1.5 * results.iqr).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 border-2 border-gray-200 dark:border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Sorted Data & Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-600 font-mono text-sm overflow-x-auto">
                  {results.sortedData.join(', ')}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Minimum</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{results.min}</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Q1 (25%)</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{results.q1.toFixed(2)}</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Q3 (75%)</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{results.q3.toFixed(2)}</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Maximum</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{results.max}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <InFeedAd />

            {showAI && (
              <>
                <div className="mb-8">
                  <EnhancedAIAnalysis
                    calculatorType="statistics"
                    data={{
                      count: results.count,
                      mean: results.mean,
                      median: results.median,
                      mode: results.mode,
                      standardDeviation: results.standardDeviation,
                      range: results.range,
                      variance: results.variance
                    }}
                  />
                </div>

                <div className="mb-8">
                  <ExportShareButtons
                    calculatorType="statistics"
                    inputs={{ dataValues: input }}
                    results={results}
                    title="Statistics Calculator Results"
                  />
                </div>
              </>
            )}
          </>
        )}

        <InFeedAd />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">📊</span>
                Key Concepts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h3 className="font-bold text-lg mb-2">Mean (Average)</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Sum of all values divided by the count. Represents the central tendency of your data.
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h3 className="font-bold text-lg mb-2">Median</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  The middle value when data is sorted. Less affected by outliers than the mean.
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h3 className="font-bold text-lg mb-2">Mode</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  The most frequently occurring value(s) in your dataset.
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h3 className="font-bold text-lg mb-2">Standard Deviation</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Measures how spread out values are from the mean. Low = clustered, High = dispersed.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">💡</span>
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Data Quality:</strong> Remove invalid entries before analysis</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Outliers:</strong> Check if extreme values are errors or meaningful</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Sample Size:</strong> Larger datasets give more reliable statistics</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Context Matters:</strong> Numbers alone don't tell the whole story</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">5️⃣</span>
                <p className="text-gray-600 dark:text-gray-300"><strong>Compare Measures:</strong> Use multiple statistics for complete understanding</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-2 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">📚</span>
              Complete Statistics Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-bold mt-4 mb-3">What is Statistics?</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Statistics is the science of collecting, organizing, analyzing, and interpreting data. It helps us make sense 
              of numbers, identify patterns, and make informed decisions. Whether you're analyzing test scores, sales data, 
              or scientific measurements, statistics provides the tools you need! 📊
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Measures of Central Tendency</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              These statistics tell you where the "center" of your data lies:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl border-l-4 border-blue-500">
                <h4 className="font-bold mb-2">Mean (Arithmetic Average)</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Formula:</strong> (Sum of all values) ÷ (Number of values)
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Example:</strong> For data {'{10, 20, 30, 40, 50}'}:
                  <br />Mean = (10 + 20 + 30 + 40 + 50) ÷ 5 = 150 ÷ 5 = 30
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>When to use:</strong> For normally distributed data without extreme outliers
                </p>
              </div>

              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl border-l-4 border-purple-500">
                <h4 className="font-bold mb-2">Median (Middle Value)</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>How to find:</strong> Sort the data and find the middle value
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Example:</strong>
                  <br />• Odd count: {'{10, 20, 30, 40, 50}'} → Median = 30
                  <br />• Even count: {'{10, 20, 30, 40}'} → Median = (20 + 30) ÷ 2 = 25
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>When to use:</strong> When data has outliers or is skewed
                </p>
              </div>

              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl border-l-4 border-green-500">
                <h4 className="font-bold mb-2">Mode (Most Frequent)</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Definition:</strong> The value(s) that appear most often
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Example:</strong> {'{10, 20, 20, 30, 30, 30, 40}'} → Mode = 30
                  <br />Multiple modes: {'{10, 10, 20, 20, 30}'} → Modes = 10 and 20
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>When to use:</strong> For categorical data or finding the most common value
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Measures of Dispersion</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              These statistics tell you how spread out your data is:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-xl border-l-4 border-orange-500">
                <h4 className="font-bold mb-2">Range</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Formula:</strong> Maximum value - Minimum value
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Example:</strong> {'{10, 25, 30, 45, 50}'} → Range = 50 - 10 = 40
                </p>
              </div>

              <div className="p-4 bg-pink-100 dark:bg-pink-900/30 rounded-xl border-l-4 border-pink-500">
                <h4 className="font-bold mb-2">Variance</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Formula:</strong> Average of squared differences from the mean
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Interpretation:</strong> Higher variance = more spread out data
                </p>
              </div>

              <div className="p-4 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl border-l-4 border-cyan-500">
                <h4 className="font-bold mb-2">Standard Deviation</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Formula:</strong> Square root of variance
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>68-95-99.7 Rule:</strong> In normal distribution:
                  <br />• 68% of data within 1 standard deviation
                  <br />• 95% within 2 standard deviations
                  <br />• 99.7% within 3 standard deviations
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Quartiles and Box Plots</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Quartiles divide your data into four equal parts:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-6">
              <li><strong>Q1 (First Quartile):</strong> 25% of data falls below this value</li>
              <li><strong>Q2 (Second Quartile):</strong> Same as the median - 50% below</li>
              <li><strong>Q3 (Third Quartile):</strong> 75% of data falls below this value</li>
              <li><strong>IQR (Interquartile Range):</strong> Q3 - Q1, represents the middle 50% of data</li>
            </ul>

            <div className="mt-4 p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl border-l-4 border-indigo-500">
              <h4 className="font-bold mb-2">Detecting Outliers</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Values are considered outliers if they fall outside:
                <br />• <strong>Lower boundary:</strong> Q1 - (1.5 × IQR)
                <br />• <strong>Upper boundary:</strong> Q3 + (1.5 × IQR)
              </p>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Real-World Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h4 className="font-bold text-lg mb-2">📈 Business Analytics</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Sales trends, customer behavior, inventory management, performance metrics
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h4 className="font-bold text-lg mb-2">🎓 Education</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Test score analysis, grade distributions, student performance tracking
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h4 className="font-bold text-lg mb-2">🏥 Healthcare</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Patient data analysis, treatment effectiveness, epidemic tracking
                </p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
                <h4 className="font-bold text-lg mb-2">🔬 Research</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Experimental results, hypothesis testing, data validation
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Choosing the Right Statistic</h3>
            <div className="bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 border-l-4 border-teal-500 p-4 rounded-r-xl">
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>✓ <strong>Mean:</strong> Best for symmetric data without outliers</li>
                <li>✓ <strong>Median:</strong> Better for skewed data or when outliers exist</li>
                <li>✓ <strong>Mode:</strong> Ideal for categorical data or finding popularity</li>
                <li>✓ <strong>Standard Deviation:</strong> Shows data consistency and reliability</li>
                <li>✓ <strong>IQR:</strong> Robust measure of spread, not affected by outliers</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Pro Tips for Data Analysis</h3>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-l-4 border-purple-500 p-4 rounded-r-xl">
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>📊 <strong>Visualize first:</strong> Create graphs to spot patterns before calculating</li>
                <li>🔍 <strong>Check for outliers:</strong> They can drastically affect your results</li>
                <li>📏 <strong>Use multiple measures:</strong> Don't rely on just one statistic</li>
                <li>🎯 <strong>Consider context:</strong> Numbers need interpretation based on the situation</li>
                <li>✅ <strong>Verify calculations:</strong> Double-check important results</li>
                <li>📝 <strong>Document your process:</strong> Keep track of how you analyzed the data</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}
