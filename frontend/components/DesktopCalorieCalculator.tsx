// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Pizza, Sparkles, AlertTriangle, Activity, Zap } from 'lucide-react';
import { getBurnTimeForAllActivities, BurnTimeResult } from '@/lib/calculateBurnTime';
import ExportShareButtons from '@/components/ExportShareButtons';
import { InFeedAd } from '@/components/ads/InFeedAd';
import { MidContentAd } from '@/components/ads/MidContentAd';

interface FoodItem {
  name: string;
  calories: number;
  emoji: string;
  category: string;
}

const popularFoods: FoodItem[] = [
  { name: 'Big Mac', calories: 563, emoji: '🍔', category: 'Fast Food' },
  { name: 'Large Pizza Slice', calories: 285, emoji: '🍕', category: 'Fast Food' },
  { name: 'Chocolate Bar', calories: 235, emoji: '🍫', category: 'Snacks' },
  { name: 'Can of Soda', calories: 140, emoji: '🥤', category: 'Drinks' },
  { name: 'French Fries (Medium)', calories: 365, emoji: '🍟', category: 'Fast Food' },
  { name: 'Donut', calories: 250, emoji: '🍩', category: 'Snacks' },
  { name: 'Ice Cream Cone', calories: 207, emoji: '🍦', category: 'Desserts' },
  { name: 'Starbucks Frappuccino', calories: 420, emoji: '☕', category: 'Drinks' },
  { name: 'Bagel with Cream Cheese', calories: 359, emoji: '🥯', category: 'Breakfast' },
  { name: 'Burrito', calories: 510, emoji: '🌯', category: 'Fast Food' },
  { name: 'KFC Chicken Breast', calories: 320, emoji: '🍗', category: 'Fast Food' },
  { name: 'Cheeseburger', calories: 300, emoji: '🍔', category: 'Fast Food' },
  { name: 'Hot Dog', calories: 290, emoji: '🌭', category: 'Fast Food' },
  { name: 'Subway 6" Turkey Sub', calories: 280, emoji: '🥪', category: 'Fast Food' },
  { name: 'Taco Bell Burrito Supreme', calories: 400, emoji: '🌮', category: 'Fast Food' },
  { name: 'Croissant', calories: 231, emoji: '🥐', category: 'Breakfast' },
  { name: 'Pancakes (3)', calories: 350, emoji: '🥞', category: 'Breakfast' },
  { name: 'Waffles (2)', calories: 400, emoji: '🧇', category: 'Breakfast' },
  { name: 'Bacon (3 strips)', calories: 130, emoji: '🥓', category: 'Breakfast' },
  { name: 'Scrambled Eggs (2)', calories: 200, emoji: '🍳', category: 'Breakfast' },
  { name: 'Avocado Toast', calories: 250, emoji: '🥑', category: 'Breakfast' },
  { name: 'Cookies (3)', calories: 150, emoji: '🍪', category: 'Snacks' },
  { name: 'Chips (1 oz)', calories: 150, emoji: '🥔', category: 'Snacks' },
  { name: 'Popcorn (Medium)', calories: 400, emoji: '🍿', category: 'Snacks' },
  { name: 'Candy Bar (Snickers)', calories: 250, emoji: '🍬', category: 'Snacks' },
  { name: 'Granola Bar', calories: 120, emoji: '🥜', category: 'Snacks' },
  { name: 'Protein Bar', calories: 200, emoji: '💪', category: 'Snacks' },
  { name: 'Apple', calories: 95, emoji: '🍎', category: 'Fruits' },
  { name: 'Banana', calories: 105, emoji: '🍌', category: 'Fruits' },
  { name: 'Orange', calories: 62, emoji: '🍊', category: 'Fruits' },
  { name: 'Grapes (1 cup)', calories: 104, emoji: '🍇', category: 'Fruits' },
  { name: 'Strawberries (1 cup)', calories: 49, emoji: '🍓', category: 'Fruits' },
  { name: 'Cake Slice', calories: 350, emoji: '🍰', category: 'Desserts' },
  { name: 'Cupcake', calories: 305, emoji: '🧁', category: 'Desserts' },
  { name: 'Brownie', calories: 243, emoji: '🍫', category: 'Desserts' },
  { name: 'Pie Slice', calories: 300, emoji: '🥧', category: 'Desserts' },
  { name: 'Milkshake', calories: 500, emoji: '🥤', category: 'Desserts' },
  { name: 'Orange Juice (12 oz)', calories: 165, emoji: '🧃', category: 'Drinks' },
  { name: 'Beer (12 oz)', calories: 150, emoji: '🍺', category: 'Drinks' },
  { name: 'Wine (5 oz)', calories: 125, emoji: '🍷', category: 'Drinks' },
  { name: 'Latte (Grande)', calories: 190, emoji: '☕', category: 'Drinks' },
  { name: 'Energy Drink', calories: 110, emoji: '🥤', category: 'Drinks' },
  { name: 'Smoothie', calories: 250, emoji: '🥤', category: 'Drinks' },
  { name: 'Sushi Roll (8 pieces)', calories: 300, emoji: '🍣', category: 'Meals' },
  { name: 'Pasta Plate', calories: 400, emoji: '🍝', category: 'Meals' },
  { name: 'Ramen Bowl', calories: 450, emoji: '🍜', category: 'Meals' },
  { name: 'Fried Rice', calories: 370, emoji: '🍚', category: 'Meals' },
  { name: 'Caesar Salad', calories: 350, emoji: '🥗', category: 'Meals' },
  { name: 'Chicken Wings (6)', calories: 430, emoji: '🍗', category: 'Meals' },
];

interface DesktopCalorieCalculatorProps {
  onAddToHistory?: (item: any) => void;
}

export default function DesktopCalorieCalculator({ onAddToHistory }: DesktopCalorieCalculatorProps) {
  const [selectedFood, setSelectedFood] = useState<string>('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [results, setResults] = useState<BurnTimeResult[] | null>(null);
  const [selectedFoodData, setSelectedFoodData] = useState<FoodItem | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleCalculate = () => {
    if (!selectedFood) {
      setError('Please select a food item');
      return;
    }

    const weightValue = parseFloat(weight);
    const minWeight = weightUnit === 'lbs' ? 20 : 9;
    const maxWeight = weightUnit === 'lbs' ? 500 : 227;
    
    if (!weight || weightValue < minWeight || weightValue > maxWeight) {
      setError(`Please enter a valid weight (${minWeight}-${maxWeight} ${weightUnit})`);
      return;
    }

    setError(null);
    setIsCalculating(true);
    setShowAnimation(false);

    setTimeout(() => {
      const food = popularFoods.find(f => f.name === selectedFood);
      if (!food) return;

      const weightValue = parseFloat(weight);
      const weightInPounds = weightUnit === 'kg' ? weightValue * 2.20462 : weightValue;
      const burnResults = getBurnTimeForAllActivities(food.calories, weightInPounds);

      setResults(burnResults);
      setSelectedFoodData(food);
      setIsCalculating(false);
      setShowAnimation(true);

      if (onAddToHistory) {
        onAddToHistory({
          food: food.name,
          calories: food.calories,
          weight: weightInPounds,
          weightUnit,
          timestamp: new Date().toISOString(),
        });
      }
    }, 800);
  };

  const shareText = results && selectedFoodData
    ? `🔥 It takes ${results[0].minutes} minutes of ${results[0].activity.name} to burn off ${selectedFoodData.name}! How long would it take you?`
    : '';

  const intensityColor = (intensity: string) => {
    switch (intensity) {
      case 'High': return 'text-red-600 dark:text-red-400';
      case 'Medium': return 'text-orange-600 dark:text-orange-400';
      case 'Low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const intensityBg = (intensity: string) => {
    switch (intensity) {
      case 'High': return 'bg-red-50 dark:bg-red-900/20';
      case 'Medium': return 'bg-orange-50 dark:bg-orange-900/20';
      case 'Low': return 'bg-green-50 dark:bg-green-900/20';
      default: return 'bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Pizza className="w-6 h-6 text-orange-600" />
            Calculate Calorie Burn Time
          </CardTitle>
          <CardDescription>
            Choose your food and we'll show you how long you need to exercise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="food" className="text-base font-semibold">Select Food Item</Label>
            <Select value={selectedFood} onValueChange={setSelectedFood}>
              <SelectTrigger className="text-lg h-12">
                <SelectValue placeholder="Choose a food item..." />
              </SelectTrigger>
              <SelectContent>
                {popularFoods.map((food) => (
                  <SelectItem key={food.name} value={food.name}>
                    <span className="flex items-center gap-2">
                      <span>{food.emoji}</span>
                      <span>{food.name}</span>
                      <span className="text-sm text-gray-500">({food.calories} cal)</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-base font-semibold">Your Weight</Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                placeholder="Enter your weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-lg h-12 flex-1"
                min={weightUnit === 'lbs' ? '20' : '9'}
                max={weightUnit === 'lbs' ? '500' : '227'}
              />
              <Select value={weightUnit} onValueChange={(value: 'lbs' | 'kg') => setWeightUnit(value)}>
                <SelectTrigger className="w-24 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">lbs</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-500">Heavier people burn more calories during exercise</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full h-14 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
          >
            {isCalculating ? (
              <><Sparkles className="mr-2 h-5 w-5 animate-spin" /> Calculating...</>
            ) : (
              <>Calculate Burn Time</>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && selectedFoodData && (
        <>
          <div className={`transform transition-all duration-700 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40">
              <CardContent className="pt-8 text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4">{selectedFoodData.emoji}</div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedFoodData.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge className="text-lg px-4 py-2 bg-orange-500 text-white">
                      {selectedFoodData.calories} Calories
                    </Badge>
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    Here's how long you need to exercise to burn it off:
                  </p>
                </div>

                <ExportShareButtons
                  calculatorType="calorie-burn"
                  inputs={{ selectedFood, weight }}
                  results={{ food: selectedFoodData.name, calories: selectedFoodData.calories }}
                  title={shareText}
                />
              </CardContent>
            </Card>
          </div>

          <InFeedAd key="desktop-calorie-infeed" />

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Activity className="w-6 h-6 text-red-600" />
                Exercise Time Needed
              </CardTitle>
              <CardDescription>
                Times are calculated based on your weight of {weight} {weightUnit}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.map((result, idx) => (
                <div key={idx} className={`p-4 ${intensityBg(result.activity.intensity)} rounded-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{result.activity.emoji}</span>
                      <div>
                        <p className="font-bold text-lg">{result.activity.name}</p>
                        <Badge variant="outline" className={intensityColor(result.activity.intensity)}>
                          {result.activity.intensity} Intensity
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {result.minutes} min
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ({result.hours} hours)
                      </p>
                    </div>
                  </div>
                  <Progress value={Math.min((result.minutes / 180) * 100, 100)} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <MidContentAd key="desktop-calorie-midcontent" />

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Zap className="w-6 h-6 text-yellow-600" />
                Quick Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="font-bold text-green-700 dark:text-green-300 mb-2">Fastest Way</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{results[0].activity.emoji}</span>
                    <div>
                      <p className="font-semibold">{results[0].activity.name}</p>
                      <p className="text-sm">{results[0].minutes} minutes</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-bold text-blue-700 dark:text-blue-300 mb-2">Easiest Way</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{results[results.length - 1].activity.emoji}</span>
                    <div>
                      <p className="font-semibold">{results[results.length - 1].activity.name}</p>
                      <p className="text-sm">{results[results.length - 1].minutes} minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
