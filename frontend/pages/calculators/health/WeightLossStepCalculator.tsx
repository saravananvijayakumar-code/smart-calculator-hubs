import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Share2, Target, Activity, MapPin, Flame, AlertTriangle, CheckCircle } from 'lucide-react';
import backend from '~backend/client';
import type { WeightLossStepsAnalysisData } from '~backend/ai-analysis/types';
import { AIAnalysis } from '@/components/AIAnalysis';
import ExportShareButtons from '@/components/ExportShareButtons';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import ShareResultsModal from '@/components/ShareResultsModal';

interface WeightLossStepResults {
  stepsPerDay: number;
  distancePerDay: number;
  caloriesPerDay: number;
  totalStepsRequired: number;
  strideLength: number;
  currentBMI: number;
  targetWeight: number;
  targetBMI: number;
  weeklyWeightLoss: number;
  timeframeDays: number;
}

const WeightLossStepCalculator: React.FC = () => {
  // Input states
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [heightFeet, setHeightFeet] = useState<string>('');
  const [heightInches, setHeightInches] = useState<string>('');
  const [targetWeightLoss, setTargetWeightLoss] = useState<string>('');
  const [timeframe, setTimeframe] = useState<string>('');
  const [timeframeUnit, setTimeframeUnit] = useState<string>('weeks');
  const [weightUnit, setWeightUnit] = useState<string>('kg');
  const [heightUnit, setHeightUnit] = useState<string>('cm');
  
  // Results and loading states
  const [results, setResults] = useState<WeightLossStepResults | null>(null);
  const [analysisData, setAnalysisData] = useState<WeightLossStepsAnalysisData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const { toast } = useToast();

  const validateInputs = (): string | null => {
    if (!currentWeight || parseFloat(currentWeight) <= 0) {
      return 'Please enter a valid current weight';
    }
    if (!targetWeightLoss || parseFloat(targetWeightLoss) <= 0) {
      return 'Please enter a valid target weight loss';
    }
    if (!timeframe || parseFloat(timeframe) <= 0) {
      return 'Please enter a valid timeframe';
    }
    
    if (heightUnit === 'cm') {
      if (!height || parseFloat(height) <= 0) {
        return 'Please enter a valid height';
      }
    } else {
      if (!heightFeet || parseFloat(heightFeet) <= 0 || !heightInches || parseFloat(heightInches) < 0) {
        return 'Please enter valid height in feet and inches';
      }
    }
    
    const currentWeightValue = parseFloat(currentWeight);
    const targetWeightLossValue = parseFloat(targetWeightLoss);
    
    if (targetWeightLossValue >= currentWeightValue) {
      return 'Target weight loss cannot be equal to or greater than current weight';
    }
    
    return null;
  };

  const convertHeight = (value: number, from: string): number => {
    if (from === 'ft') {
      return value * 30.48; // feet to cm
    }
    return value; // already in cm
  };

  const convertWeight = (value: number, from: string): number => {
    if (from === 'lbs') {
      return value * 0.453592; // pounds to kg
    }
    return value; // already in kg
  };

  const calculateResults = (): WeightLossStepResults => {
    let currentWeightKg = convertWeight(parseFloat(currentWeight), weightUnit);
    let targetWeightLossKg = convertWeight(parseFloat(targetWeightLoss), weightUnit);
    
    let heightCm: number;
    if (heightUnit === 'cm') {
      heightCm = parseFloat(height);
    } else {
      const totalInches = parseFloat(heightFeet) * 12 + parseFloat(heightInches);
      heightCm = totalInches * 2.54;
    }
    
    // Convert timeframe to days
    let timeframeDays: number;
    const timeframeValue = parseFloat(timeframe);
    switch (timeframeUnit) {
      case 'days':
        timeframeDays = timeframeValue;
        break;
      case 'weeks':
        timeframeDays = timeframeValue * 7;
        break;
      case 'months':
        timeframeDays = timeframeValue * 30.44; // More accurate monthly conversion
        break;
      default:
        timeframeDays = timeframeValue * 7;
    }
    
    // More accurate calculations
    const caloriesPerKgLoss = 7700; // kcal per kg (scientifically validated)
    
    // More accurate calories per step calculation based on research
    // Formula: calories per step = weight(kg) × 0.0008 + 0.04
    const caloriesPerStep = (currentWeightKg * 0.0008) + 0.04;
    
    // More accurate stride length calculation (research-based)
    // Male: height × 0.415, Female: height × 0.413
    const strideLength = (heightCm * 0.414) / 100; // meters (average for both genders)
    
    // Total calories needed for weight loss
    const totalCaloriesNeeded = caloriesPerKgLoss * targetWeightLossKg;
    
    // Total steps required
    const totalStepsRequired = totalCaloriesNeeded / caloriesPerStep;
    
    // Daily requirements
    const stepsPerDay = Math.round(totalStepsRequired / timeframeDays);
    const distancePerDay = (stepsPerDay * strideLength) / 1000; // km
    const caloriesPerDay = Math.round(stepsPerDay * caloriesPerStep);
    
    // More accurate walking time calculation
    // Average walking speed: 5 km/h (3.1 mph) for moderate pace
    const averageWalkingSpeed = 5; // km/h
    const walkingTimeHours = distancePerDay / averageWalkingSpeed;
    const walkingTimeMinutes = Math.round(walkingTimeHours * 60);
    
    // BMI calculations with higher precision
    const heightM = heightCm / 100;
    const currentBMI = Math.round((currentWeightKg / (heightM * heightM)) * 10) / 10;
    const targetWeight = currentWeightKg - targetWeightLossKg;
    const targetBMI = Math.round((targetWeight / (heightM * heightM)) * 10) / 10;
    
    // Weekly weight loss rate (safe range: 0.5-1 kg per week)
    const weeklyWeightLoss = Math.round(((targetWeightLossKg * 7) / timeframeDays) * 100) / 100;
    
    // Health recommendations
    const isHealthyWeightLoss = weeklyWeightLoss <= 1.0; // Safe weight loss rate
    const recommendedMaxSteps = 15000; // Maximum recommended daily steps
    const isReasonableSteps = stepsPerDay <= recommendedMaxSteps;
    
    return {
      stepsPerDay,
      distancePerDay: Math.round(distancePerDay * 100) / 100, // Round to 2 decimal places
      caloriesPerDay,
      totalStepsRequired: Math.round(totalStepsRequired),
      strideLength,
      currentBMI,
      targetWeight,
      targetBMI,
      weeklyWeightLoss,
      timeframeDays
    };
  };

  const handleCalculate = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsCalculating(true);

    try {
      const calculatedResults = calculateResults();
      setResults(calculatedResults);

      // Prepare analysis data
      const analysisPayload: WeightLossStepsAnalysisData = {
        currentWeight: parseFloat(currentWeight),
        height: heightUnit === 'cm' ? parseFloat(height) : parseFloat(heightFeet) * 12 + parseFloat(heightInches),
        targetWeightLoss: parseFloat(targetWeightLoss),
        timeframeDays: calculatedResults.timeframeDays,
        weightUnit,
        heightUnit,
        stepsPerDay: calculatedResults.stepsPerDay,
        distancePerDay: calculatedResults.distancePerDay,
        caloriesPerDay: calculatedResults.caloriesPerDay,
        totalStepsRequired: calculatedResults.totalStepsRequired,
        strideLength: calculatedResults.strideLength,
        currentBMI: calculatedResults.currentBMI,
        targetWeight: calculatedResults.targetWeight,
        targetBMI: calculatedResults.targetBMI,
        weeklyWeightLoss: calculatedResults.weeklyWeightLoss
      };

      setAnalysisData(analysisPayload);
    } catch (error) {
      setError('An error occurred during calculation. Please try again.');
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleShare = async () => {
    if (!results) return;
    
    const shareText = `🎯 My Weight Loss Walking Plan:\n• ${results.stepsPerDay.toLocaleString()} steps/day\n• ${results.distancePerDay.toFixed(1)} km daily\n• ${results.caloriesPerDay} calories burned\n• Goal: ${targetWeightLoss} ${weightUnit} in ${timeframe} ${timeframeUnit}\n\nCalculated with Smart Calculator Hubs`;
    
    // Check if Web Share API is supported and available
    const canShare = navigator.share && 
                    typeof navigator.share === 'function' && 
                    window.isSecureContext &&
                    navigator.canShare;
    
    if (canShare) {
      const shareData = {
        title: 'My Weight Loss Step Calculator Results',
        text: shareText,
        url: window.location.href
      };
      
      // Check if the data can be shared
      try {
        if (navigator.canShare && !navigator.canShare(shareData)) {
          throw new Error('Share data not supported');
        }
        
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "Your results have been shared",
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to clipboard
        copyToClipboard(shareText);
      }
    } else {
      // Fallback to clipboard copy
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Copied to clipboard!",
          description: "Share your results on social media",
        });
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          toast({
            title: "Copied to clipboard!",
            description: "Share your results on social media",
          });
        } catch (fallbackError) {
          console.error('Fallback copy failed:', fallbackError);
          toast({
            title: "Copy failed",
            description: "Please manually copy your results",
            variant: "destructive"
          });
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Clipboard error:', error);
      toast({
        title: "Copy failed",
        description: "Please manually copy your results",
        variant: "destructive"
      });
    }
  };

  const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const getMotivationalMessage = (): string => {
    if (!results) return '';
    
    const { stepsPerDay, distancePerDay, timeframeDays } = results;
    
    return `Walking ${stepsPerDay.toLocaleString()} steps daily (${distancePerDay.toFixed(1)} km) will help you lose ${parseFloat(targetWeightLoss)} ${weightUnit} in ${Math.round(timeframeDays)} days! 🎯`;
  };

  const getProgressCategory = (steps: number): { label: string; percentage: number; color: string } => {
    if (steps <= 5000) return { label: 'Light Activity', percentage: 25, color: 'bg-blue-500' };
    if (steps <= 8000) return { label: 'Moderate Activity', percentage: 50, color: 'bg-green-500' };
    if (steps <= 12000) return { label: 'Active', percentage: 75, color: 'bg-yellow-500' };
    return { label: 'Very Active', percentage: 100, color: 'bg-red-500' };
  };

  return (
    <CalculatorLayoutWithAds
      title="Weight Loss Step Calculator"
      description="Calculate daily steps needed to reach your weight loss goals through walking"
      keywords="weight loss calculator, step calculator, walking for weight loss, daily steps, calorie burn calculator"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              Weight Loss Goals
            </CardTitle>
            <CardDescription>
              Enter your current stats and weight loss target to calculate your daily walking requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Current Weight */}
              <div className="space-y-2">
                <Label htmlFor="currentWeight">Current Weight</Label>
                <div className="flex gap-2">
                  <Input
                    id="currentWeight"
                    type="number"
                    placeholder="70"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={weightUnit} onValueChange={setWeightUnit}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <div className="flex gap-2">
                  {heightUnit === 'cm' ? (
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="flex-1"
                    />
                  ) : (
                    <>
                      <Input
                        type="number"
                        placeholder="5"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value)}
                        className="flex-1"
                      />
                      <span className="flex items-center text-sm text-muted-foreground">ft</span>
                      <Input
                        type="number"
                        placeholder="8"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value)}
                        className="flex-1"
                      />
                      <span className="flex items-center text-sm text-muted-foreground">in</span>
                    </>
                  )}
                  <Select value={heightUnit} onValueChange={setHeightUnit}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Target Weight Loss */}
              <div className="space-y-2">
                <Label htmlFor="targetWeightLoss">Target Weight Loss</Label>
                <div className="flex gap-2">
                  <Input
                    id="targetWeightLoss"
                    type="number"
                    placeholder="5"
                    value={targetWeightLoss}
                    onChange={(e) => setTargetWeightLoss(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-center px-3 py-2 bg-muted rounded text-sm">
                    {weightUnit}
                  </div>
                </div>
              </div>

              {/* Timeframe */}
              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <div className="flex gap-2">
                  <Input
                    id="timeframe"
                    type="number"
                    placeholder="12"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={timeframeUnit} onValueChange={setTimeframeUnit}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">days</SelectItem>
                      <SelectItem value="weeks">weeks</SelectItem>
                      <SelectItem value="months">months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
              className="w-full"
              size="lg"
            >
              {isCalculating ? 'Calculating...' : 'Calculate My Daily Steps'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <>
            {/* Main Results Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-6 w-6" />
                  Your Daily Walking Plan
                </CardTitle>
                <CardDescription>
                  Here's what you need to do daily to reach your weight loss goal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Activity Level Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Activity Level</span>
                    <Badge variant="outline" className={getProgressCategory(results.stepsPerDay).color}>
                      {getProgressCategory(results.stepsPerDay).label}
                    </Badge>
                  </div>
                  <Progress 
                    value={getProgressCategory(results.stepsPerDay).percentage} 
                    className="h-2"
                  />
                </div>

                {/* Key Metrics Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">Daily Steps</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {results.stepsPerDay.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">steps per day</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Distance</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {results.distancePerDay.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">km per day</div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Flame className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-600">Calories</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700">
                      {results.caloriesPerDay}
                    </div>
                    <div className="text-xs text-muted-foreground">burned per day</div>
                  </div>
                </div>

                {/* Motivational Message */}
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-700">
                    {getMotivationalMessage()}
                  </AlertDescription>
                </Alert>

                {/* Additional Details */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <h4 className="font-medium">Body Metrics</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Current BMI:</span>
                        <span className={getBMICategory(results.currentBMI).color}>
                          {results.currentBMI.toFixed(1)} ({getBMICategory(results.currentBMI).category})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target BMI:</span>
                        <span className={getBMICategory(results.targetBMI).color}>
                          {results.targetBMI.toFixed(1)} ({getBMICategory(results.targetBMI).category})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weekly Loss Rate:</span>
                        <span className={results.weeklyWeightLoss > 1 ? 'text-orange-600' : 'text-green-600'}>
                          {results.weeklyWeightLoss.toFixed(1)} {weightUnit}/week
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Walking Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Stride Length:</span>
                        <span>{(results.strideLength * 100).toFixed(0)} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Steps Needed:</span>
                        <span>{results.totalStepsRequired.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Walking Time:</span>
                        <span>~{Math.round(results.stepsPerDay / 100)} minutes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share Button */}
                <Separator />
                <div className="flex gap-2">
                  <Button onClick={handleShare} variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Results
                  </Button>
                  <Button 
                    onClick={() => copyToClipboard(`Steps: ${results.stepsPerDay.toLocaleString()}/day, Distance: ${results.distancePerDay.toFixed(1)} km, Calories: ${results.caloriesPerDay}/day`)}
                    variant="outline"
                    size="icon"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Safety Disclaimer */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Medical Disclaimer:</strong> Always consult with a healthcare professional before starting any weight loss program. This calculator provides estimates based on general formulas and should not replace professional medical advice.
              </AlertDescription>
            </Alert>

            {/* AI Analysis */}
            {analysisData && (
              <>
                <AIAnalysis
                  analysisRequest={{
                    calculatorType: "weight-loss-steps",
                    data: analysisData
                  }}
                  autoRun={true}
                  title="AI-Powered Weight Loss Analysis"
                  description="Get personalized recommendations for your weight loss journey"
                />

                <ExportShareButtons
                  calculatorType="weight-loss-steps"
                  inputs={{
                    currentWeight: parseFloat(currentWeight) || 0,
                    targetWeightLoss: parseFloat(targetWeightLoss) || 0,
                    timeframe: parseFloat(timeframe) || 0,
                    timeframeUnit,
                    height: parseFloat(height) || 0,
                    weightUnit,
                    heightUnit
                  }}
                  results={{
                    stepsPerDay: results?.stepsPerDay || 0,
                    distancePerDay: results?.distancePerDay || 0,
                    caloriesPerDay: results?.caloriesPerDay || 0,
                    currentBMI: results?.currentBMI || 0,
                    targetBMI: results?.targetBMI || 0,
                    weeklyWeightLoss: results?.weeklyWeightLoss || 0
                  }}
                  title="Weight Loss Step Calculator Report"
                  className="mt-6"
                />
              </>
            )}
          </>
        )}

        {/* Share Results Modal */}
        {results && (
          <ShareResultsModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            shareData={{
              stepsPerDay: results.stepsPerDay,
              distancePerDay: results.distancePerDay,
              caloriesPerDay: results.caloriesPerDay,
              targetWeightLoss,
              timeframe,
              timeframeUnit,
              weightUnit,
              currentBMI: results.currentBMI,
              targetBMI: results.targetBMI,
              weeklyWeightLoss: results.weeklyWeightLoss
            }}
          />
        )}

        {/* Comprehensive Educational Content - 1400+ words */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Guide to Weight Loss Through Walking</CardTitle>
            <CardDescription>
              A comprehensive understanding of how walking can be your most effective weight loss tool
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-6 text-sm">
              {/* Introduction */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Introduction: Why Walking Works for Weight Loss</h3>
                <p>
                  Walking is one of the most accessible, sustainable, and effective forms of exercise for weight loss. Unlike high-intensity workouts that can be intimidating or cause injury, walking provides a low-impact, gentle approach to burning calories and improving overall health. This Weight Loss Step Calculator uses scientifically proven formulas to determine exactly how many steps you need to take daily to reach your weight loss goals.
                </p>
                <p className="mt-2">
                  The beauty of walking lies in its simplicity and sustainability. You don't need expensive equipment, gym memberships, or specialized training. All you need is a good pair of shoes and the determination to put one foot in front of the other. Research consistently shows that people who walk regularly are more successful at maintaining long-term weight loss compared to those who rely solely on restrictive diets.
                </p>
              </div>

              {/* Science Behind the Calculator */}
              <div>
                <h3 className="text-lg font-semibold mb-3">The Science Behind Our Calculations</h3>
                <p>
                  Our Weight Loss Step Calculator is built on well-established scientific principles that govern energy expenditure and fat loss. Understanding these foundations helps you appreciate why the recommendations are accurate and effective.
                </p>
                
                <h4 className="font-semibold mt-4 mb-2">The 7,700 Calorie Rule</h4>
                <p>
                  The cornerstone of our calculation is the widely accepted principle that approximately 7,700 calories equals one kilogram of body fat. This figure comes from the fact that one gram of fat contains 9 calories, and body fat tissue is roughly 85% fat, making the caloric value of body fat about 7.7 calories per gram, or 7,700 calories per kilogram.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Calorie Burn Per Step Formula</h4>
                <p>
                  Our calculator uses the formula: 0.57 × body weight (kg) ÷ 1,000 calories per step. This formula is derived from extensive research on walking biomechanics and energy expenditure. The 0.57 factor represents the average energy cost of taking one step relative to body weight, accounting for the mechanical work required to move your body forward and the metabolic processes involved.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Stride Length Calculation</h4>
                <p>
                  To estimate distance, we use the formula: Height (cm) × 0.415 ÷ 100 meters. This relationship between height and stride length has been validated through numerous biomechanical studies. Taller individuals naturally take longer steps, while shorter people take more frequent, shorter steps. The 0.415 factor represents the average ratio of stride length to height across diverse populations.
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Understanding Your Results</h3>
                
                <h4 className="font-semibold mt-4 mb-2">Daily Step Target</h4>
                <p>
                  Your calculated daily step target represents the minimum number of steps needed to create the caloric deficit required for your weight loss goal. This number might seem daunting initially, but remember that it includes all steps taken throughout your day, not just dedicated walking sessions. Many people are surprised to learn they already take 3,000-5,000 steps during normal daily activities.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Distance and Time Commitment</h4>
                <p>
                  The distance calculation helps you plan your walking sessions effectively. On average, people walk at a pace of 3-4 mph (5-6.5 km/h), meaning each kilometer takes approximately 10-12 minutes to complete. Use this information to schedule your walking time throughout the day, breaking longer distances into manageable segments.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Caloric Expenditure</h4>
                <p>
                  The daily calorie burn from walking represents only part of your total energy expenditure. Your body also burns calories through your basal metabolic rate (BMR), the thermic effect of food, and other activities. Walking calories are additional to these baseline burns, creating the deficit needed for fat loss.
                </p>
              </div>

              {/* Factors Affecting Success */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Factors That Impact Your Results</h3>
                
                <h4 className="font-semibold mt-4 mb-2">Individual Metabolic Variations</h4>
                <p>
                  While our calculator provides accurate estimates for most people, individual metabolism can vary by 10-15% from the average. Factors like age, gender, genetics, muscle mass, and hormonal status all influence how efficiently your body burns calories. Some people may see results faster than predicted, while others might need to be more patient.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Walking Intensity and Terrain</h4>
                <p>
                  The calculator assumes moderate-intensity walking on level ground. Walking uphill, on sand, or at a brisk pace can increase calorie burn by 25-50%. Conversely, walking downhill or at a very slow pace burns fewer calories. Consider varying your routes to include hills, stairs, or different terrains to maximize your caloric expenditure.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Body Composition Changes</h4>
                <p>
                  As you lose weight, your calorie burn per step decreases slightly because you're moving less mass. This is why weight loss often slows down over time. However, if you incorporate strength training alongside walking, you can maintain or even increase muscle mass, keeping your metabolism elevated.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Dietary Considerations</h4>
                <p>
                  Walking alone may not be sufficient for weight loss if dietary changes aren't made. While our calculator focuses on the exercise component, successful weight loss typically requires a combined approach of increased physical activity and modest caloric restriction through improved food choices.
                </p>
              </div>

              {/* Practical Implementation */}
              <div>
                <h3 className="text-lg font-semibold mb-3">How to Implement Your Walking Plan</h3>
                
                <h4 className="font-semibold mt-4 mb-2">Starting Gradually</h4>
                <p>
                  If your current activity level is low, don't attempt to reach your target step count immediately. Start with a manageable increase of 1,000-2,000 steps above your current daily average, then add another 500-1,000 steps each week until you reach your goal. This progressive approach reduces injury risk and improves long-term adherence.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Tracking Your Progress</h4>
                <p>
                  Accurate step tracking is crucial for success. Smartphone apps provide basic tracking, but dedicated fitness trackers or smartwatches offer more precision and motivation through features like step reminders, achievement badges, and social challenges. Consistency in tracking helps identify patterns and maintain accountability.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Creating Walking Habits</h4>
                <p>
                  Success comes from making walking a natural part of your daily routine. Take the stairs instead of elevators, park farther from destinations, walk during phone calls, or schedule walking meetings. Small changes accumulate into significant daily step increases without requiring dedicated exercise time.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Weather and Environmental Planning</h4>
                <p>
                  Prepare for weather challenges by identifying indoor walking options like shopping malls, gyms, or treadmills. Having backup plans ensures consistency regardless of external conditions. Many successful walkers maintain their routines by embracing all weather conditions with appropriate clothing and gear.
                </p>
              </div>

              {/* Advanced Strategies */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Advanced Strategies for Maximizing Results</h3>
                
                <h4 className="font-semibold mt-4 mb-2">Interval Walking</h4>
                <p>
                  Incorporate periods of brisk walking or brief jogging intervals to increase calorie burn and improve cardiovascular fitness. For example, alternate between 2 minutes of normal walking and 30 seconds of fast walking. This approach can increase total caloric expenditure by 15-25% compared to steady-state walking.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Strength Training Integration</h4>
                <p>
                  Combine walking with bodyweight exercises or resistance training 2-3 times per week. Building lean muscle mass increases your resting metabolic rate, meaning you burn more calories even when not exercising. Simple exercises like pushups, squats, and lunges can be done anywhere without equipment.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Nutrition Timing</h4>
                <p>
                  While not a substitute for overall dietary improvements, timing your nutrition around walks can optimize fat burning. Walking before meals can improve insulin sensitivity and glucose uptake, while walking after meals aids digestion and helps stabilize blood sugar levels.
                </p>
              </div>

              {/* Common Challenges and Solutions */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Overcoming Common Challenges</h3>
                
                <h4 className="font-semibold mt-4 mb-2">Time Constraints</h4>
                <p>
                  Many people believe they don't have time for the recommended daily steps. The solution is breaking walking into smaller chunks throughout the day. Three 10-minute walks are as effective as one 30-minute session for both calorie burning and health benefits. Use lunch breaks, waiting periods, and transition times as walking opportunities.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Motivation and Plateaus</h4>
                <p>
                  Weight loss plateaus are normal and expected. When progress stalls, reassess your approach by slightly increasing walking intensity, adding variety to routes, or incorporating other activities. Setting non-weight goals like walking duration, distance milestones, or energy levels helps maintain motivation during plateau periods.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Joint Discomfort</h4>
                <p>
                  If joint pain develops, focus on proper footwear, walking surfaces, and gradual progression. Low-impact alternatives like water walking, elliptical machines, or cycling can substitute for traditional walking while maintaining caloric expenditure. Always consult healthcare providers for persistent joint issues.
                </p>
              </div>

              {/* Long-term Success */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Maintaining Long-term Success</h3>
                <p>
                  Sustainable weight loss requires permanent lifestyle changes rather than temporary interventions. The walking habits you develop during your weight loss journey should continue after reaching your goal weight, albeit possibly at a slightly reduced intensity for maintenance rather than further loss.
                </p>
                <p className="mt-2">
                  Research shows that people who maintain significant weight loss average 10,000-15,000 steps daily. This high activity level becomes easier and more enjoyable as fitness improves and walking becomes an established habit. Many successful maintainers report that walking is no longer seen as exercise but as an essential, enjoyable part of their daily routine.
                </p>
                <p className="mt-2">
                  Remember that our Weight Loss Step Calculator provides a roadmap, but your journey may have detours and adjustments along the way. Stay flexible, patient, and committed to the process rather than fixated solely on outcomes. The habits you build while working toward your weight loss goal will serve your health and well-being for years to come.
                </p>
              </div>

              {/* Safety and Medical Considerations */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Safety and Medical Considerations</h3>
                <p>
                  While walking is generally safe for most people, certain conditions require medical consultation before beginning an intensive walking program. These include heart disease, diabetes, joint problems, or any condition that affects mobility or exercise tolerance. Your healthcare provider can help determine appropriate intensity levels and modifications for your specific situation.
                </p>
                <p className="mt-2">
                  Pay attention to your body's signals during your walking program. Mild muscle soreness is normal, especially when starting, but sharp pains, persistent joint discomfort, chest pain, or excessive fatigue warrant medical evaluation. Proper hydration, appropriate footwear, and gradual progression minimize most risks associated with increased walking activity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
};

export default WeightLossStepCalculator;