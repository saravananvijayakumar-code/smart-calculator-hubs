import { useState, useEffect } from 'react';
import { EnhancedCalculatorLayout } from '../../../components/EnhancedCalculatorLayout';
import { AppleStyleInput } from '../../../components/AppleStyleInput';
import { AppleStyleButton } from '../../../components/AppleStyleButton';
import { AppleStyleCard, AppleStyleCardHeader } from '../../../components/AppleStyleCard';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import ExportShareButtons from '../../../components/ExportShareButtons';

interface BMIResult {
  bmi: number;
  category: string;
  description: string;
  healthyRange: string;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  idealWeight: { min: number; max: number };
}

export const EnhancedBMICalculator = () => {
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
    let idealWeight: { min: number; max: number };
    
    if (unit === 'metric') {
      const heightInM = heightNum / 100;
      bmi = weightNum / (heightInM * heightInM);
      idealWeight = {
        min: Math.round(18.5 * heightInM * heightInM),
        max: Math.round(24.9 * heightInM * heightInM)
      };
    } else {
      bmi = (weightNum / (heightNum * heightNum)) * 703;
      idealWeight = {
        min: Math.round((18.5 * heightNum * heightNum) / 703),
        max: Math.round((24.9 * heightNum * heightNum) / 703)
      };
    }

    let category: string;
    let description: string;
    let recommendations: string[];
    let riskLevel: 'low' | 'moderate' | 'high';

    if (bmi < 18.5) {
      category = 'Underweight';
      description = 'Below normal weight range';
      riskLevel = 'moderate';
      recommendations = [
        'Consult with a healthcare provider or nutritionist',
        'Focus on nutrient-dense, calorie-rich foods',
        'Consider strength training to build muscle mass',
        'Monitor for underlying health conditions',
        'Track weight gain progress regularly'
      ];
    } else if (bmi < 25) {
      category = 'Normal Weight';
      description = 'Healthy weight range';
      riskLevel = 'low';
      recommendations = [
        'Maintain current healthy lifestyle',
        'Continue regular physical activity',
        'Eat a balanced, nutritious diet',
        'Monitor weight periodically',
        'Focus on overall wellness'
      ];
    } else if (bmi < 30) {
      category = 'Overweight';
      description = 'Above normal weight range';
      riskLevel = 'moderate';
      recommendations = [
        'Aim for gradual weight loss of 1-2 lbs per week',
        'Increase physical activity to 150+ minutes weekly',
        'Focus on portion control and healthy eating',
        'Consider consulting a healthcare provider',
        'Track progress with measurements and photos'
      ];
    } else {
      category = 'Obese';
      description = 'Significantly above normal weight range';
      riskLevel = 'high';
      recommendations = [
        'Consult healthcare provider for comprehensive plan',
        'Consider medically supervised weight loss',
        'Focus on sustainable lifestyle changes',
        'Address underlying health conditions',
        'Join support groups or programs'
      ];
    }

    const healthyRange = `${idealWeight.min} - ${idealWeight.max} ${unit === 'metric' ? 'kg' : 'lbs'}`;

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      description,
      healthyRange,
      recommendations,
      riskLevel,
      idealWeight
    });
  };

  useEffect(() => {
    calculateBMI();
  }, [height, weight, unit]);

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'moderate': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'high': return <XCircle className="w-6 h-6 text-red-500" />;
      default: return null;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'border-green-200 bg-green-50/50';
      case 'moderate': return 'border-yellow-200 bg-yellow-50/50';
      case 'high': return 'border-red-200 bg-red-50/50';
      default: return 'border-gray-200';
    }
  };

  const calculatorForm = (
    <div className="space-y-8">
      {/* Unit Toggle */}
      <div className="flex bg-accent/50 rounded-xl p-1">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
            unit === 'imperial' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setUnit('imperial')}
        >
          Imperial (ft/in, lbs)
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
            unit === 'metric' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setUnit('metric')}
        >
          Metric (cm, kg)
        </button>
      </div>

      {/* Input Fields */}
      <div className="space-y-6">
        <AppleStyleInput
          large
          label={`Height ${unit === 'metric' ? '(cm)' : '(inches)'}`}
          placeholder={unit === 'metric' ? '175' : '70'}
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          type="number"
          helperText={unit === 'imperial' ? "Tip: 5'10\" = 70 inches, 6'0\" = 72 inches" : undefined}
        />

        <AppleStyleInput
          large
          label={`Weight ${unit === 'metric' ? '(kg)' : '(lbs)'}`}
          placeholder={unit === 'metric' ? '70' : '150'}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          type="number"
        />
      </div>

      {/* Quick Tips */}
      <AppleStyleCard padding="md" className="bg-accent/30">
        <h4 className="font-medium mb-3">Quick Tips:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Results are calculated instantly as you type</li>
          <li>• BMI is a screening tool, not a diagnostic test</li>
          <li>• Consider overall health and fitness, not just BMI</li>
          <li>• Consult healthcare providers for personalized advice</li>
        </ul>
      </AppleStyleCard>
    </div>
  );

  const resultsDisplay = result && (
    <div className="space-y-6">
      {/* Export Share Buttons */}
      <ExportShareButtons
        calculatorType="bmi-enhanced"
        inputs={{ height, weight, unit }}
        results={result}
        title="BMI Analysis"
      />

      {/* Main Result */}
      <AppleStyleCard className={`text-center ${getRiskColor(result.riskLevel)}`} padding="lg">
        <div className="space-y-4">
          <div className="text-5xl font-bold text-foreground">{result.bmi}</div>
          <div className="flex items-center justify-center gap-2">
            {getRiskIcon(result.riskLevel)}
            <span className="text-xl font-semibold">{result.category}</span>
          </div>
          <p className="text-muted-foreground">{result.description}</p>
        </div>
      </AppleStyleCard>

      {/* Healthy Range */}
      <AppleStyleCard padding="md">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Healthy weight range for your height</p>
          <p className="text-lg font-semibold">{result.healthyRange}</p>
        </div>
      </AppleStyleCard>

      {/* Recommendations */}
      <AppleStyleCard padding="md">
        <AppleStyleCardHeader title="Recommendations" />
        <ul className="space-y-3">
          {result.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-muted-foreground">{rec}</span>
            </li>
          ))}
        </ul>
      </AppleStyleCard>

      {/* BMI Chart */}
      <AppleStyleCard padding="md">
        <AppleStyleCardHeader title="BMI Categories" />
        <div className="space-y-3">
          {[
            { range: 'Below 18.5', category: 'Underweight', color: 'bg-blue-500' },
            { range: '18.5 - 24.9', category: 'Normal Weight', color: 'bg-green-500' },
            { range: '25.0 - 29.9', category: 'Overweight', color: 'bg-yellow-500' },
            { range: '30.0 and above', category: 'Obese', color: 'bg-red-500' }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded ${item.color}`}></div>
              <span className="text-sm font-medium w-24">{item.range}</span>
              <span className="text-sm text-muted-foreground flex-1">{item.category}</span>
              {result.category === item.category && (
                <TrendingUp className="w-4 h-4 text-primary" />
              )}
            </div>
          ))}
        </div>
      </AppleStyleCard>
    </div>
  );

  const explanation = (
    <div className="space-y-6">
      <p className="text-lg leading-relaxed">
        Body Mass Index (BMI) is a widely used screening tool that estimates body fat based on height and weight. 
        Developed in the 1830s by Belgian mathematician Adolphe Quetelet, BMI provides a quick assessment of weight status 
        and potential health risks associated with being underweight, normal weight, overweight, or obese.
      </p>
      
      <h3 className="text-2xl font-semibold">How BMI Works</h3>
      <p>
        BMI is calculated by dividing your weight by the square of your height. This simple calculation provides a 
        standardized way to assess whether your weight falls within a healthy range for your height. The resulting 
        number is then categorized into one of four main BMI categories.
      </p>

      <h3 className="text-2xl font-semibold">BMI Categories and Health Implications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg text-blue-600">Underweight (BMI &lt; 18.5)</h4>
            <p>May indicate malnutrition, eating disorders, or underlying health conditions. Can lead to weakened immunity, osteoporosis, and irregular menstruation.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-green-600">Normal Weight (BMI 18.5-24.9)</h4>
            <p>Associated with lowest risk of weight-related health problems. Indicates a healthy balance between height and weight.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg text-yellow-600">Overweight (BMI 25.0-29.9)</h4>
            <p>Increased risk of heart disease, type 2 diabetes, high blood pressure, and sleep apnea. Prevention focus is key.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-red-600">Obese (BMI ≥ 30.0)</h4>
            <p>Significantly increased risk of serious health conditions including cardiovascular disease, diabetes, and certain cancers.</p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-semibold">Important Limitations</h3>
      <p>
        While BMI is a useful screening tool, it has several important limitations. BMI doesn't distinguish between 
        muscle and fat, doesn't account for age-related changes in body composition, and may not accurately reflect 
        health risks for all ethnic groups. Athletes and individuals with high muscle mass may have elevated BMIs 
        despite having low body fat percentages.
      </p>

      <h3 className="text-2xl font-semibold">Beyond BMI: Additional Health Indicators</h3>
      <p>
        For a complete health assessment, consider other measurements such as waist circumference, waist-to-hip ratio, 
        body fat percentage, and overall fitness level. These additional metrics can provide a more comprehensive 
        picture of your health status and risk factors.
      </p>
    </div>
  );

  const examples = (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">BMI Calculation Examples</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AppleStyleCard padding="md">
          <h4 className="font-semibold mb-3">Example 1: Metric System</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Height:</strong> 175 cm (1.75 m)</p>
            <p><strong>Weight:</strong> 70 kg</p>
            <p><strong>Calculation:</strong> 70 ÷ (1.75)² = 70 ÷ 3.06 = 22.9</p>
            <p><strong>Result:</strong> BMI 22.9 (Normal Weight)</p>
          </div>
        </AppleStyleCard>

        <AppleStyleCard padding="md">
          <h4 className="font-semibold mb-3">Example 2: Imperial System</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Height:</strong> 70 inches (5'10")</p>
            <p><strong>Weight:</strong> 154 lbs</p>
            <p><strong>Calculation:</strong> (154 ÷ 70²) × 703 = 22.1</p>
            <p><strong>Result:</strong> BMI 22.1 (Normal Weight)</p>
          </div>
        </AppleStyleCard>
      </div>

      <h3 className="text-xl font-semibold mt-8">Weight Management Scenarios</h3>
      
      <div className="space-y-4">
        <AppleStyleCard padding="md" className="bg-green-50/50">
          <h4 className="font-semibold text-green-700 mb-2">Scenario: Maintaining Healthy Weight</h4>
          <p className="text-sm">
            Sarah, 5'6" (168 cm), weighs 140 lbs (64 kg) with a BMI of 22.6. To maintain her healthy weight, 
            she should continue her current routine of regular exercise, balanced nutrition, and periodic monitoring.
          </p>
        </AppleStyleCard>

        <AppleStyleCard padding="md" className="bg-yellow-50/50">
          <h4 className="font-semibold text-yellow-700 mb-2">Scenario: Gradual Weight Loss</h4>
          <p className="text-sm">
            Mike, 6'0" (183 cm), weighs 200 lbs (91 kg) with a BMI of 27.1. To reach a healthy BMI of 24, 
            he would need to lose about 22 lbs through a combination of diet and exercise over 3-6 months.
          </p>
        </AppleStyleCard>

        <AppleStyleCard padding="md" className="bg-blue-50/50">
          <h4 className="font-semibold text-blue-700 mb-2">Scenario: Healthy Weight Gain</h4>
          <p className="text-sm">
            Emma, 5'4" (163 cm), weighs 105 lbs (48 kg) with a BMI of 18.0. To reach a healthy weight range, 
            she should aim to gain 15-20 lbs through increased caloric intake and strength training.
          </p>
        </AppleStyleCard>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "Is BMI accurate for everyone?",
      answer: "BMI is a useful screening tool but has limitations. It may not accurately reflect health status for athletes, elderly individuals, pregnant women, or people with high muscle mass. Consider additional assessments for a complete health picture."
    },
    {
      question: "How often should I check my BMI?",
      answer: "For most adults, checking BMI monthly or quarterly is sufficient unless you're actively working on weight management. Focus more on overall health habits than frequent BMI monitoring."
    },
    {
      question: "Can BMI predict my health future?",
      answer: "BMI indicates increased risk for certain health conditions but doesn't predict individual outcomes. Many factors influence health including genetics, lifestyle, fitness level, and medical history."
    },
    {
      question: "What if I'm at the border between categories?",
      answer: "BMI categories have some flexibility. Focus on overall health trends rather than exact numbers. A BMI of 24.9 vs 25.1 doesn't represent a significant health difference."
    },
    {
      question: "Should children use adult BMI calculations?",
      answer: "No, children and teens need age and gender-specific BMI percentiles. Adult BMI categories don't apply to growing bodies. Consult pediatric growth charts or healthcare providers for youth assessments."
    }
  ];

  return (
    <EnhancedCalculatorLayout
      id="bmi"
      title="BMI Calculator"
      description="Calculate your Body Mass Index (BMI) with our comprehensive calculator. Get personalized health recommendations, understand BMI categories, and learn about healthy weight ranges."
      category="health"
      seoTitle="BMI Calculator - Body Mass Index Calculator with Health Insights | Smart Calculator Hubs"
      seoDescription="Free BMI calculator with instant results. Calculate your Body Mass Index, get personalized health recommendations, and understand healthy weight ranges. Supports both metric and imperial units."
      keywords="BMI calculator, body mass index, weight calculator, health calculator, BMI chart, healthy weight, obesity calculator, metric BMI, imperial BMI"
      children={calculatorForm}
      results={resultsDisplay}
      explanation={explanation}
      examples={examples}
      faqs={faqs}
      formula="BMI = weight (kg) / height (m)² or BMI = (weight (lbs) / height (inches)²) × 703"
    />
  );
};