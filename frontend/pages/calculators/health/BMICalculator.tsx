import { useState, useEffect } from 'react';
import { Calculator, Info, Heart, Activity, TrendingUp, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import { RelatedCalculators } from '../../../components/RelatedCalculators';
import EnhancedAIAnalysis from '../../../components/EnhancedAIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { useCalculatorHistory } from '../../../hooks/useCalculatorHistory';
import { useToast } from '@/components/ui/use-toast';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface BMIResult {
  bmi: number;
  category: string;
  description: string;
  healthyRange: string;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
}

export const BMICalculator = () => {
  const { saveCalculation } = useCalculatorHistory();
  const { toast } = useToast();
  
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('imperial');
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = () => {
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!heightNum || !weightNum || heightNum <= 0 || weightNum <= 0) {
      setResult(null);
      return;
    }

    let bmi: number;
    
    if (unit === 'metric') {
      // height in cm, weight in kg
      const heightInM = heightNum / 100;
      bmi = weightNum / (heightInM * heightInM);
    } else {
      // height in inches, weight in pounds
      bmi = (weightNum / (heightNum * heightNum)) * 703;
    }

    let category: string;
    let description: string;
    let healthyRange: string;
    let recommendations: string[];
    let riskLevel: 'low' | 'moderate' | 'high';

    if (bmi < 16) {
      category = 'Severely Underweight';
      description = 'Significantly below normal weight range';
      riskLevel = 'high';
      recommendations = [
        'Seek immediate medical attention',
        'Work with healthcare team including nutritionist',
        'Address potential eating disorders or medical conditions',
        'Focus on safe, medically supervised weight gain'
      ];
    } else if (bmi < 18.5) {
      category = 'Underweight';
      description = 'Below normal weight range';
      riskLevel = 'moderate';
      recommendations = [
        'Consult with a healthcare provider or nutritionist',
        'Focus on nutrient-dense, calorie-rich foods',
        'Consider strength training to build muscle mass',
        'Monitor for underlying health conditions'
      ];
    } else if (bmi < 25) {
      category = 'Normal Weight';
      description = 'Healthy weight range';
      riskLevel = 'low';
      recommendations = [
        'Maintain current healthy lifestyle',
        'Continue regular physical activity',
        'Eat a balanced, nutritious diet',
        'Monitor weight periodically'
      ];
    } else if (bmi < 30) {
      category = 'Overweight';
      description = 'Above normal weight range';
      riskLevel = 'moderate';
      recommendations = [
        'Aim for gradual weight loss of 1-2 lbs per week',
        'Increase physical activity to 150+ minutes weekly',
        'Focus on portion control and healthy eating',
        'Consider consulting a healthcare provider'
      ];
    } else if (bmi < 35) {
      category = 'Obese Class I';
      description = 'Moderately obese';
      riskLevel = 'high';
      recommendations = [
        'Consult healthcare provider for comprehensive plan',
        'Consider medically supervised weight loss',
        'Focus on sustainable lifestyle changes',
        'Regular monitoring of blood pressure and diabetes risk'
      ];
    } else if (bmi < 40) {
      category = 'Obese Class II';
      description = 'Severely obese';
      riskLevel = 'high';
      recommendations = [
        'Immediate medical consultation required',
        'Consider comprehensive weight management program',
        'Evaluate for bariatric surgery options',
        'Close monitoring of cardiovascular health'
      ];
    } else {
      category = 'Obese Class III';
      description = 'Very severely obese (morbidly obese)';
      riskLevel = 'high';
      recommendations = [
        'Urgent medical intervention recommended',
        'Comprehensive evaluation by obesity specialist',
        'Strong consideration for bariatric surgery',
        'Intensive medical monitoring required'
      ];
    }

    if (unit === 'metric') {
      const heightInM = heightNum / 100;
      const minWeight = Math.round((18.5 * heightInM * heightInM) * 10) / 10;
      const maxWeight = Math.round((24.9 * heightInM * heightInM) * 10) / 10;
      healthyRange = `${minWeight} - ${maxWeight} kg`;
    } else {
      const minWeight = Math.round(((18.5 * heightNum * heightNum) / 703) * 10) / 10;
      const maxWeight = Math.round(((24.9 * heightNum * heightNum) / 703) * 10) / 10;
      healthyRange = `${minWeight} - ${maxWeight} lbs`;
    }

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      description,
      healthyRange,
      recommendations,
      riskLevel
    });
  };

  const handleSaveCalculation = () => {
    if (!result) {
      toast({
        title: 'No calculation to save',
        description: 'Please complete the form to generate results first.',
        variant: 'destructive',
      });
      return;
    }

    saveCalculation({
      calculatorType: 'bmi',
      calculatorName: 'BMI Calculator',
      inputs: {
        height: parseFloat(height),
        weight: parseFloat(weight),
        unit,
      },
      results: {
        bmi: result.bmi,
        category: result.category,
        healthyRange: result.healthyRange,
        riskLevel: result.riskLevel,
      },
    });

    toast({
      title: 'Calculation saved!',
      description: 'View it in your calculation history.',
    });
  };

  // Real-time calculation
  useEffect(() => {
    calculateBMI();
  }, [height, weight, unit]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Underweight': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Normal Weight': return 'text-green-600 bg-green-50 border-green-200';
      case 'Overweight': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Obese': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <CalculatorLayoutWithAds
      title="BMI Calculator - Body Mass Index Calculator with Health Insights"
      description="Calculate your BMI (Body Mass Index) with our comprehensive calculator. Get personalized health recommendations, understand BMI categories, and learn about healthy weight ranges."
      keywords="BMI calculator, body mass index, weight calculator, health calculator, BMI chart, healthy weight, obesity calculator"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Calculator Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              BMI Calculator
            </CardTitle>
            <CardDescription>
              Enter your height and weight to calculate your Body Mass Index and get personalized health recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Unit Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Unit System</Label>
              <RadioGroup value={unit} onValueChange={(value: 'metric' | 'imperial') => setUnit(value)} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="imperial" id="imperial" />
                  <Label htmlFor="imperial">Imperial (ft/in, lbs)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metric" id="metric" />
                  <Label htmlFor="metric">Metric (cm, kg)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="height">
                  Height {unit === 'metric' ? '(cm)' : '(inches)'}
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder={unit === 'metric' ? '175' : '70'}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                {unit === 'imperial' && (
                  <p className="text-xs text-gray-500">
                    Tip: 5'10" = 70 inches, 6'0" = 72 inches
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder={unit === 'metric' ? '70' : '150'}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={handleSaveCalculation} variant="outline" className="gap-2">
                <Save className="w-4 h-4" />
                Save to History
              </Button>
            </div>

            {/* AI Analysis */}
            <AIAnalysis
              analysisRequest={{
                calculatorType: "bmi",
                data: {
                  bmi: result.bmi,
                  category: result.category,
                  height: parseFloat(height) || 0,
                  weight: parseFloat(weight) || 0,
                  unit: unit,
                  riskLevel: result.riskLevel,
                  idealWeightRange: {
                    min: unit === 'metric' ? 
                      Math.round(18.5 * Math.pow(parseFloat(height) / 100, 2)) :
                      Math.round(18.5 * Math.pow(parseFloat(height), 2) / 703),
                    max: unit === 'metric' ? 
                      Math.round(24.9 * Math.pow(parseFloat(height) / 100, 2)) :
                      Math.round(24.9 * Math.pow(parseFloat(height), 2) / 703)
                  }
                }
              }}
              autoRun={true}
              title="AI Health Analysis"
              description="Get personalized health recommendations based on your BMI category and individual profile."
            />

            {/* BMI Result */}
            <Card className={`border-2 ${getCategoryColor(result.category)}`}>
              <CardHeader>
                <CardTitle className="text-center">
                  Your BMI Result
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-6xl font-bold">
                  {result.bmi}
                </div>
                <div className={`text-2xl font-semibold ${getCategoryColor(result.category).split(' ')[0]}`}>
                  {result.category}
                </div>
                <p className="text-gray-600">
                  {result.description}
                </p>
                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-sm font-medium">Healthy weight range for your height:</p>
                  <p className="text-lg font-semibold">{result.healthyRange}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* BMI Chart */}
            <Card>
              <CardHeader>
                <CardTitle>BMI Categories Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { range: 'Below 18.5', category: 'Underweight', color: 'bg-blue-500' },
                    { range: '18.5 - 24.9', category: 'Normal Weight', color: 'bg-green-500' },
                    { range: '25.0 - 29.9', category: 'Overweight', color: 'bg-yellow-500' },
                    { range: '30.0 and above', category: 'Obese', color: 'bg-red-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                      <span className="font-medium w-32">{item.range}</span>
                      <span className="text-gray-600">{item.category}</span>
                      {result.category === item.category && (
                        <span className="text-blue-600 font-medium">← Your Category</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <EnhancedAIAnalysis
              calculatorType="bmi"
              data={{
                bmi: result?.bmi || 0,
                category: result?.category || '',
                height: parseFloat(height) || 0,
                weight: parseFloat(weight) || 0,
                unit: unit,
                riskLevel: result?.riskLevel || 'low',
                idealWeightRange: { min: 0, max: 0 } // Could calculate based on BMI range
              }}
              className="mt-8"
            />

            {/* Export/Share Buttons */}
            <ExportShareButtons
              calculatorType="bmi"
              inputs={{
                height: parseFloat(height) || 0,
                weight: parseFloat(weight) || 0,
                unit
              }}
              results={result || {}}
              title="BMI Calculation"
              className="mt-6"
            />
          </div>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Body Mass Index (BMI)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-700 space-y-4">
                <p>
                  Body Mass Index (BMI) is a widely used screening tool that estimates body fat based on height and weight. 
                  Developed in the 1830s by Belgian mathematician Adolphe Quetelet, BMI provides a quick assessment of weight status 
                  and potential health risks associated with being underweight, normal weight, overweight, or obese.
                </p>
                
                <h4 className="font-semibold text-gray-800 mt-6 mb-3">How BMI is Calculated:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Metric:</strong> BMI = weight (kg) / height (m)²</li>
                  <li><strong>Imperial:</strong> BMI = (weight (lbs) / height (inches)²) × 703</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">BMI Categories and Health Implications:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium">Underweight (BMI &lt; 18.5)</h5>
                    <p className="text-sm">May indicate malnutrition, eating disorders, or underlying health conditions. Can lead to weakened immunity, osteoporosis, and irregular menstruation.</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Normal Weight (BMI 18.5-24.9)</h5>
                    <p className="text-sm">Associated with lowest risk of weight-related health problems. Indicates a healthy balance between height and weight.</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Overweight (BMI 25.0-29.9)</h5>
                    <p className="text-sm">Increased risk of heart disease, type 2 diabetes, high blood pressure, and sleep apnea. Prevention focus is key.</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Obese (BMI ≥ 30.0)</h5>
                    <p className="text-sm">Significantly increased risk of serious health conditions including cardiovascular disease, diabetes, and certain cancers.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitations and Considerations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-700 space-y-4">
                <h4 className="font-semibold text-gray-800 mb-3">Important BMI Limitations:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Muscle vs. Fat:</strong> BMI doesn't distinguish between muscle and fat. Athletes and bodybuilders may have high BMIs despite low body fat.</li>
                  <li><strong>Age and Gender:</strong> BMI doesn't account for age-related muscle loss or gender differences in body composition.</li>
                  <li><strong>Ethnicity:</strong> Health risks may vary among different ethnic groups at the same BMI levels.</li>
                  <li><strong>Body Shape:</strong> BMI doesn't consider where fat is distributed (waist vs. hips), which affects health risks.</li>
                  <li><strong>Overall Health:</strong> BMI doesn't measure fitness level, bone density, or overall health status.</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Additional Health Assessments:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium">Waist Circumference</h5>
                    <p className="text-sm">Measures abdominal fat. High risk: men &gt;40 inches, women &gt;35 inches.</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Waist-to-Hip Ratio</h5>
                    <p className="text-sm">Assesses fat distribution. Higher ratios indicate increased health risks.</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Body Fat Percentage</h5>
                    <p className="text-sm">More accurate than BMI for assessing body composition and health risks.</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Overall Fitness</h5>
                    <p className="text-sm">Cardiovascular fitness, strength, and flexibility are crucial health indicators.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Healthy Weight Management Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">For Weight Loss:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Create moderate calorie deficit (500-750 calories/day)</li>
                      <li>Focus on whole, nutrient-dense foods</li>
                      <li>Increase protein intake to preserve muscle</li>
                      <li>Combine cardio and strength training</li>
                      <li>Aim for 1-2 pounds loss per week</li>
                      <li>Stay hydrated and get adequate sleep</li>
                      <li>Consider professional guidance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">For Weight Gain:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Increase calorie intake with nutritious foods</li>
                      <li>Focus on healthy fats and complex carbs</li>
                      <li>Eat frequent, smaller meals</li>
                      <li>Include strength training to build muscle</li>
                      <li>Consider protein supplements if needed</li>
                      <li>Address any underlying health issues</li>
                      <li>Monitor progress with healthcare provider</li>
                    </ul>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Lifestyle Factors for Healthy Weight:</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <li>• Regular physical activity (150+ minutes/week)</li>
                    <li>• Balanced, portion-controlled diet</li>
                    <li>• Adequate sleep (7-9 hours nightly)</li>
                    <li>• Stress management techniques</li>
                    <li>• Regular health screenings</li>
                    <li>• Strong social support system</li>
                    <li>• Consistent daily routines</li>
                    <li>• Mindful eating practices</li>
                  </ul>
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
                    <h4 className="font-semibold text-gray-800 mb-2">Is BMI accurate for everyone?</h4>
                    <p>BMI is a useful screening tool but has limitations. It may not accurately reflect health status for athletes, elderly individuals, pregnant women, or people with high muscle mass. Consider additional assessments for a complete health picture.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How often should I check my BMI?</h4>
                    <p>For most adults, checking BMI monthly or quarterly is sufficient unless you're actively working on weight management. Focus more on overall health habits than frequent BMI monitoring.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can BMI predict my health future?</h4>
                    <p>BMI indicates increased risk for certain health conditions but doesn't predict individual outcomes. Many factors influence health including genetics, lifestyle, fitness level, and medical history.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What if I'm at the border between categories?</h4>
                    <p>BMI categories have some flexibility. Focus on overall health trends rather than exact numbers. A BMI of 24.9 vs 25.1 doesn't represent a significant health difference.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Should children use adult BMI calculations?</h4>
                    <p>No, children and teens need age and gender-specific BMI percentiles. Adult BMI categories don't apply to growing bodies. Consult pediatric growth charts or healthcare providers for youth assessments.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Important Health Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription className="text-sm space-y-2">
                <p>• This BMI calculator is for educational purposes and general health awareness only.</p>
                <p>• BMI results should not replace professional medical advice, diagnosis, or treatment.</p>
                <p>• Individual health assessment requires consideration of multiple factors beyond BMI.</p>
                <p>• Consult healthcare providers for personalized health and weight management guidance.</p>
                <p>• This calculator is not suitable for pregnant women, children under 18, or professional athletes.</p>
                <p>• If you have health concerns or medical conditions, seek professional medical consultation.</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Related Calculators */}
        <RelatedCalculators currentCalculatorId="bmi" />
      </div>
    </CalculatorLayoutWithAds>
  );
};