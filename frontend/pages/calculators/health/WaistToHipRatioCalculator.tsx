import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Heart, 
  Target,
  ShieldAlert,
  Info,
  Sparkles,
  Brain
} from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import ExportShareButtons from '@/components/ExportShareButtons';
import EnhancedAIAnalysis from '@/components/EnhancedAIAnalysis';
import TopBannerAd from '@/components/ads/TopBannerAd';
import InFeedAd from '@/components/ads/InFeedAd';
import MidContentAd from '@/components/ads/MidContentAd';
import SidebarAd from '@/components/ads/SidebarAd';
import BottomStickyAd from '@/components/ads/BottomStickyAd';
import AutoAdSlot from '@/components/ads/AutoAdSlot';

type Gender = 'male' | 'female';
type Unit = 'metric' | 'imperial';
type HealthRisk = 'low' | 'moderate' | 'high' | 'very-high';

interface WHRResult {
  waistToHipRatio: number;
  riskLevel: HealthRisk;
  bodyShape: string;
  recommendations: string[];
  healthImplications: string[];
  idealRatio: { min: number; max: number };
}

export default function WaistToHipRatioCalculator() {
  const [waist, setWaist] = useState('32');
  const [hip, setHip] = useState('40');
  const [gender, setGender] = useState<Gender>('female');
  const [unit, setUnit] = useState<Unit>('imperial');
  const [result, setResult] = useState<WHRResult | null>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  const calculateWHR = () => {
    const waistValue = parseFloat(waist);
    const hipValue = parseFloat(hip);

    if (!waistValue || !hipValue || waistValue <= 0 || hipValue <= 0) {
      return;
    }

    const ratio = waistValue / hipValue;
    
    let riskLevel: HealthRisk = 'low';
    let bodyShape = '';
    
    if (gender === 'female') {
      if (ratio < 0.80) {
        riskLevel = 'low';
        bodyShape = 'Pear Shape';
      } else if (ratio >= 0.80 && ratio < 0.85) {
        riskLevel = 'moderate';
        bodyShape = 'Transitional Shape';
      } else if (ratio >= 0.85 && ratio < 0.90) {
        riskLevel = 'high';
        bodyShape = 'Apple Shape';
      } else {
        riskLevel = 'very-high';
        bodyShape = 'High-Risk Apple Shape';
      }
    } else {
      if (ratio < 0.90) {
        riskLevel = 'low';
        bodyShape = 'V-Shape';
      } else if (ratio >= 0.90 && ratio < 0.95) {
        riskLevel = 'moderate';
        bodyShape = 'Transitional Shape';
      } else if (ratio >= 0.95 && ratio < 1.00) {
        riskLevel = 'high';
        bodyShape = 'Apple Shape';
      } else {
        riskLevel = 'very-high';
        bodyShape = 'High-Risk Apple Shape';
      }
    }

    const recommendations = getRecommendations(riskLevel, gender);
    const healthImplications = getHealthImplications(riskLevel);
    const idealRatio = gender === 'female' 
      ? { min: 0.70, max: 0.80 } 
      : { min: 0.85, max: 0.90 };

    const resultData: WHRResult = {
      waistToHipRatio: ratio,
      riskLevel,
      bodyShape,
      recommendations,
      healthImplications,
      idealRatio,
    };

    setResult(resultData);
    setShowAIAnalysis(true);
  };

  const getRecommendations = (risk: HealthRisk, gender: Gender): string[] => {
    const baseRecommendations = [
      'Engage in regular cardiovascular exercise (150+ minutes/week)',
      'Include strength training 2-3 times per week',
      'Focus on core exercises to strengthen abdominal muscles',
      'Maintain a balanced diet rich in whole foods',
      'Reduce processed foods and added sugars',
    ];

    if (risk === 'high' || risk === 'very-high') {
      return [
        ...baseRecommendations,
        'Consult with a healthcare provider for personalized advice',
        'Consider working with a registered dietitian',
        'Monitor blood pressure and cholesterol regularly',
        'Reduce alcohol consumption',
        'Manage stress through mindfulness or meditation',
      ];
    } else if (risk === 'moderate') {
      return [
        ...baseRecommendations,
        'Increase daily physical activity',
        'Monitor your waist circumference monthly',
        'Stay hydrated and get adequate sleep',
      ];
    } else {
      return [
        'Maintain your current healthy lifestyle',
        'Continue regular physical activity',
        'Monitor measurements periodically',
        'Keep eating a balanced, nutritious diet',
      ];
    }
  };

  const getHealthImplications = (risk: HealthRisk): string[] => {
    switch (risk) {
      case 'very-high':
        return [
          'Significantly elevated risk of cardiovascular disease',
          'Higher risk of type 2 diabetes',
          'Increased risk of metabolic syndrome',
          'Greater likelihood of hypertension',
          'Elevated risk of certain cancers',
          'Potential increased risk of stroke',
        ];
      case 'high':
        return [
          'Elevated risk of heart disease',
          'Increased risk of type 2 diabetes',
          'Higher chance of developing metabolic issues',
          'Moderate risk of hypertension',
        ];
      case 'moderate':
        return [
          'Slightly elevated cardiovascular risk',
          'Moderate risk of metabolic issues if left unaddressed',
          'Should monitor health markers regularly',
        ];
      default:
        return [
          'Healthy waist-to-hip ratio',
          'Lower risk of obesity-related diseases',
          'Good metabolic health indicators',
        ];
    }
  };

  const getRiskConfig = (risk: HealthRisk) => {
    switch (risk) {
      case 'low':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950/30',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: <CheckCircle className="w-12 h-12 text-green-600" />,
          label: 'Low Risk',
          badgeClass: 'bg-green-500',
        };
      case 'moderate':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          icon: <Info className="w-12 h-12 text-yellow-600" />,
          label: 'Moderate Risk',
          badgeClass: 'bg-yellow-500',
        };
      case 'high':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 dark:bg-orange-950/30',
          borderColor: 'border-orange-200 dark:border-orange-800',
          icon: <AlertTriangle className="w-12 h-12 text-orange-600" />,
          label: 'High Risk',
          badgeClass: 'bg-orange-500',
        };
      case 'very-high':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-950/30',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: <ShieldAlert className="w-12 h-12 text-red-600" />,
          label: 'Very High Risk',
          badgeClass: 'bg-red-500',
        };
    }
  };

  const formatMeasurement = (value: number) => {
    return unit === 'metric' ? `${value.toFixed(1)} cm` : `${value.toFixed(1)} inches`;
  };

  return (
    <>
      <SEOHead
        title="Waist to Hip Ratio Calculator (WHR) | Health Risk Assessment Tool"
        description="Calculate your waist-to-hip ratio (WHR) and assess your health risk. Based on WHO standards for cardiovascular disease, diabetes, and metabolic syndrome risk evaluation."
        keywords="waist to hip ratio, WHR calculator, body shape calculator, health risk assessment, cardiovascular risk, metabolic health, obesity risk"
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Waist to Hip Ratio Calculator
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Discover your body shape and assess your health risk with WHO-approved standards ✨
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 shadow-md">
              <Heart className="w-3.5 h-3.5 mr-1" />
              WHO Standards
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-md">
              <Activity className="w-3.5 h-3.5 mr-1" />
              Health Risk Assessment
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-md">
              <Target className="w-3.5 h-3.5 mr-1" />
              Body Shape Analysis
            </Badge>
          </div>
        </div>

        <TopBannerAd className="mb-8" />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-2 shadow-xl bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 dark:from-gray-900 dark:via-pink-950/10 dark:to-purple-950/10">
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-primary" />
                      Body Measurements
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Measure at the narrowest point of waist & widest point of hips
                    </p>
                  </div>
                  <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium flex items-center gap-2">
                      Gender
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </Label>
                    <Select value={gender} onValueChange={(v: Gender) => setGender(v)}>
                      <SelectTrigger id="gender" className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit" className="text-sm font-medium flex items-center gap-2">
                      Units
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </Label>
                    <Select value={unit} onValueChange={(v: Unit) => setUnit(v)}>
                      <SelectTrigger id="unit" className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imperial">Inches</SelectItem>
                        <SelectItem value="metric">Centimeters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>How to measure:</strong> Waist = narrowest point (usually above belly button). 
                      Hips = widest point around buttocks. Stand relaxed, don't hold your breath!
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="waist" className="text-base font-semibold flex items-center gap-2">
                      <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                        <Activity className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                      </div>
                      Waist Circumference
                    </Label>
                    <div className="relative">
                      <Input
                        id="waist"
                        type="number"
                        step="0.1"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        placeholder={unit === 'metric' ? '80' : '32'}
                        className="h-12 text-lg pr-20"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                        {unit === 'metric' ? 'cm' : 'inches'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hip" className="text-base font-semibold flex items-center gap-2">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      Hip Circumference
                    </Label>
                    <div className="relative">
                      <Input
                        id="hip"
                        type="number"
                        step="0.1"
                        value={hip}
                        onChange={(e) => setHip(e.target.value)}
                        placeholder={unit === 'metric' ? '100' : '40'}
                        className="h-12 text-lg pr-20"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                        {unit === 'metric' ? 'cm' : 'inches'}
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={calculateWHR} 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate My WHR
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {result && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <Card className={`border-3 ${getRiskConfig(result.riskLevel).borderColor} ${getRiskConfig(result.riskLevel).bgColor} shadow-2xl`}>
                  <CardContent className="pt-8 pb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="text-center sm:text-left">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getRiskConfig(result.riskLevel).badgeClass} text-white text-sm px-3 py-1`}>
                            {getRiskConfig(result.riskLevel).label}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">Your Waist-to-Hip Ratio</div>
                        <div className={`text-6xl font-bold ${getRiskConfig(result.riskLevel).color} mb-2`}>
                          {result.waistToHipRatio.toFixed(3)}
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                          {result.bodyShape}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getRiskConfig(result.riskLevel).icon}
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border">
                      <div className="text-sm font-medium mb-2">Ideal Range for {gender === 'female' ? 'Women' : 'Men'}:</div>
                      <div className="text-2xl font-bold text-primary">
                        {result.idealRatio.min.toFixed(2)} - {result.idealRatio.max.toFixed(2)}
                      </div>
                      <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full ${getRiskConfig(result.riskLevel).badgeClass} transition-all duration-1000 ease-out rounded-full`}
                          style={{ width: `${Math.min((result.waistToHipRatio / (gender === 'female' ? 1.0 : 1.1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <AutoAdSlot placement="mid-content" />

                <Card className="border-2 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Heart className="w-6 h-6 text-red-500" />
                      Health Implications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.healthImplications.map((implication, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          {result.riskLevel === 'low' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className={`w-5 h-5 ${getRiskConfig(result.riskLevel).color} flex-shrink-0 mt-0.5`} />
                          )}
                          <span className="text-foreground">{implication}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Target className="w-6 h-6 text-purple-600" />
                      Personalized Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="p-1.5 bg-purple-600 text-white rounded-full text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-foreground flex-1">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <InFeedAd />

                {showAIAnalysis && (
                  <EnhancedAIAnalysis
                    calculatorType="waist-to-hip-ratio"
                    data={{
                      waist: parseFloat(waist),
                      hip: parseFloat(hip),
                      ratio: result.waistToHipRatio,
                      riskLevel: result.riskLevel,
                      bodyShape: result.bodyShape,
                      unit,
                    }}
                    userContext={{
                      riskTolerance: result.riskLevel === 'low' ? 'low' : result.riskLevel === 'moderate' ? 'medium' : 'high',
                    }}
                  />
                )}

                <ExportShareButtons
                  calculatorType="waist-to-hip-ratio"
                  inputs={{
                    waist: parseFloat(waist),
                    hip: parseFloat(hip),
                    gender,
                    unit,
                  }}
                  results={result}
                  title="Waist-to-Hip Ratio Calculator Results"
                />
              </div>
            )}

            {!result && (
              <Card className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-muted/30 via-pink-50/20 to-purple-50/20 border-2 border-dashed">
                <div className="p-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6 animate-pulse">
                  <Activity className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Ready to Calculate Your WHR?</h3>
                <p className="text-muted-foreground max-w-md text-lg">
                  Enter your measurements above to discover your body shape and assess your health risk profile! 🎯
                </p>
              </Card>
            )}

            <MidContentAd />
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              <SidebarAd />
              
              <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-lg">Quick Facts</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>WHR is a better predictor of cardiovascular risk than BMI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Apple shapes have more visceral (organ) fat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Pear shapes store more subcutaneous fat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>You can improve your WHR with targeted exercise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Diet changes can reduce waist circumference</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-bold text-lg">Ideal Ranges</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Women</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      &lt; 0.80
                    </div>
                    <div className="text-xs text-muted-foreground">Low health risk</div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-sm font-medium mb-1">Men</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      &lt; 0.90
                    </div>
                    <div className="text-xs text-muted-foreground">Low health risk</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Card className="mt-12 p-8 border-2">
          <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="guide">Complete Guide</TabsTrigger>
              <TabsTrigger value="science">The Science</TabsTrigger>
              <TabsTrigger value="improve">How to Improve</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="guide" className="prose prose-sm max-w-none dark:prose-invert">
              <h2 className="text-3xl font-bold mb-6">Complete Guide to Waist-to-Hip Ratio</h2>
              
              <h3 className="text-2xl font-semibold mt-8 mb-4">What is Waist-to-Hip Ratio (WHR)?</h3>
              <p className="text-lg leading-relaxed">
                Your waist-to-hip ratio (WHR) is a simple yet powerful measurement that compares the circumference of your waist to the circumference of your hips. Unlike BMI which only considers height and weight, WHR reveals how your body fat is distributed—a crucial factor in determining your risk for various health conditions.
              </p>
              
              <p className="text-lg leading-relaxed">
                Think of it as your body's way of telling a story. Are you more of an "apple" shape (weight concentrated around the middle) or a "pear" shape (weight distributed around the hips)? This distinction matters tremendously for your long-term health outcomes!
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Why WHR Matters More Than You Think</h3>
              <p className="text-lg leading-relaxed">
                Research consistently shows that people who carry excess weight around their midsection (high WHR) face significantly elevated risks for:
              </p>
              <ul className="space-y-2 text-base">
                <li><strong>Cardiovascular Disease:</strong> Up to 2x higher risk with elevated WHR</li>
                <li><strong>Type 2 Diabetes:</strong> Visceral fat interferes with insulin sensitivity</li>
                <li><strong>Metabolic Syndrome:</strong> Cluster of conditions including high blood pressure and cholesterol</li>
                <li><strong>Certain Cancers:</strong> Including colorectal, breast, and pancreatic cancers</li>
                <li><strong>Stroke:</strong> Increased inflammation and arterial plaque buildup</li>
              </ul>

              <h3 className="text-2xl font-semibold mt-8 mb-4">How to Measure Accurately</h3>
              <p className="text-lg leading-relaxed">
                Accuracy is everything! Follow these steps for the most reliable measurements:
              </p>
              
              <h4 className="text-xl font-semibold mt-6 mb-3">Measuring Your Waist:</h4>
              <ol className="space-y-2 text-base">
                <li>Stand up straight and breathe out naturally (don't hold your breath or suck in!)</li>
                <li>Find the natural crease of your waist—usually the narrowest point between your ribcage and hip bones</li>
                <li>Wrap a measuring tape around your waist at this point, parallel to the floor</li>
                <li>The tape should be snug but not compressing your skin</li>
                <li>Record the measurement to the nearest 0.1 inch or 0.5 cm</li>
              </ol>

              <h4 className="text-xl font-semibold mt-6 mb-3">Measuring Your Hips:</h4>
              <ol className="space-y-2 text-base">
                <li>Stand with your feet together</li>
                <li>Find the widest part of your hips/buttocks—this is usually around 7-9 inches below your waist</li>
                <li>Wrap the measuring tape around your hips at this widest point</li>
                <li>Keep the tape parallel to the floor and snug but not tight</li>
                <li>Record this measurement as well</li>
              </ol>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Understanding Your Results</h3>
              <div className="bg-muted/50 p-6 rounded-lg my-6">
                <h4 className="text-xl font-semibold mb-4">For Women:</h4>
                <ul className="space-y-2">
                  <li><strong>Less than 0.80:</strong> ✅ Low health risk (Excellent!)</li>
                  <li><strong>0.80 - 0.84:</strong> ⚠️ Moderate health risk</li>
                  <li><strong>0.85 - 0.89:</strong> 🚨 High health risk</li>
                  <li><strong>0.90 or higher:</strong> 🔴 Very high health risk</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg my-6">
                <h4 className="text-xl font-semibold mb-4">For Men:</h4>
                <ul className="space-y-2">
                  <li><strong>Less than 0.90:</strong> ✅ Low health risk (Excellent!)</li>
                  <li><strong>0.90 - 0.94:</strong> ⚠️ Moderate health risk</li>
                  <li><strong>0.95 - 0.99:</strong> 🚨 High health risk</li>
                  <li><strong>1.00 or higher:</strong> 🔴 Very high health risk</li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Body Shape Categories</h3>
              <p className="text-lg leading-relaxed">
                Your WHR determines your body shape category, which has important health implications:
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">🍐 Pear Shape (Gynoid)</h4>
              <p className="leading-relaxed">
                Lower WHR, with more weight distributed in the hips and thighs. This shape is generally associated with lower health risks because the fat stored in these areas is mostly subcutaneous (under the skin) rather than visceral (around organs). Pear shapes are more common in women due to hormonal factors.
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">🍎 Apple Shape (Android)</h4>
              <p className="leading-relaxed">
                Higher WHR, with more weight concentrated around the abdomen. This shape carries greater health risks because abdominal fat is more likely to be visceral fat, which wraps around internal organs and releases inflammatory substances. Apple shapes are more common in men and post-menopausal women.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">The Visceral Fat Connection</h3>
              <p className="text-lg leading-relaxed">
                Not all fat is created equal! Visceral fat—the type that accumulates around your abdominal organs—is metabolically active and produces hormones and inflammatory substances that interfere with normal metabolic function. This is why a high WHR is such a strong predictor of health problems, even in people who aren't technically "overweight" by BMI standards.
              </p>

              <p className="text-lg leading-relaxed">
                Subcutaneous fat (under the skin on your hips and thighs) is much less harmful and may even have some protective effects. This explains why pear-shaped individuals often have better metabolic health markers than apple-shaped individuals, even at the same total body weight.
              </p>
            </TabsContent>

            <TabsContent value="science" className="prose prose-sm max-w-none dark:prose-invert">
              <h2 className="text-3xl font-bold mb-6">The Science Behind WHR</h2>
              
              <h3 className="text-2xl font-semibold mt-6 mb-4">Why WHO Recommends WHR</h3>
              <p className="text-lg leading-relaxed">
                The World Health Organization (WHO) has extensively studied body composition and health outcomes. Their research demonstrates that WHR is one of the most reliable predictors of cardiovascular disease risk, often outperforming BMI in accuracy. This is because WHR directly reflects the distribution of body fat, not just total body mass.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Hormonal Influences on Body Fat Distribution</h3>
              <p className="text-lg leading-relaxed">
                Sex hormones play a crucial role in determining where your body stores fat:
              </p>
              
              <h4 className="text-xl font-semibold mt-6 mb-3">Estrogen and Female Fat Distribution</h4>
              <p className="leading-relaxed">
                Estrogen promotes gluteofemoral fat storage (hips and thighs), creating the typical pear shape in pre-menopausal women. This pattern evolved as an energy reserve for pregnancy and breastfeeding. After menopause, declining estrogen levels often lead to a shift toward abdominal fat storage, increasing WHR and cardiovascular risk.
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">Testosterone and Male Fat Distribution</h4>
              <p className="leading-relaxed">
                Testosterone promotes abdominal fat storage, contributing to the apple shape more common in men. While testosterone is often considered protective, when it declines with age, it paradoxically leads to even more abdominal fat accumulation and increased WHR.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Cortisol and Stress-Related Weight Gain</h3>
              <p className="text-lg leading-relaxed">
                Chronic stress elevates cortisol levels, which preferentially deposits fat around the abdomen. This is why stress management is crucial for maintaining a healthy WHR, especially for those genetically predisposed to apple-shaped weight distribution.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Genetic Factors</h3>
              <p className="text-lg leading-relaxed">
                Research suggests that 40-60% of the variation in body fat distribution is genetic. However, lifestyle factors still play a dominant role—you can significantly improve your WHR through diet, exercise, and stress management, regardless of your genetic predisposition.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">The Metabolic Syndrome Connection</h3>
              <p className="text-lg leading-relaxed">
                Metabolic syndrome is diagnosed when you have at least three of the following:
              </p>
              <ul className="space-y-2">
                <li>Large waist circumference (high WHR)</li>
                <li>Elevated triglycerides</li>
                <li>Low HDL ("good") cholesterol</li>
                <li>High blood pressure</li>
                <li>Elevated fasting blood sugar</li>
              </ul>
              <p className="text-lg leading-relaxed">
                Notice that waist circumference is the first criterion! A high WHR is often the earliest warning sign of metabolic dysfunction, appearing years before other symptoms develop.
              </p>
            </TabsContent>

            <TabsContent value="improve" className="prose prose-sm max-w-none dark:prose-invert">
              <h2 className="text-3xl font-bold mb-6">How to Improve Your WHR</h2>
              
              <h3 className="text-2xl font-semibold mt-6 mb-4">🏃‍♀️ Exercise Strategies That Work</h3>
              
              <h4 className="text-xl font-semibold mt-6 mb-3">Cardiovascular Exercise</h4>
              <p className="text-lg leading-relaxed">
                Aerobic exercise is your best weapon against visceral fat. Aim for:
              </p>
              <ul className="space-y-2">
                <li><strong>150-300 minutes of moderate-intensity cardio weekly</strong> (brisk walking, cycling, swimming)</li>
                <li><strong>75-150 minutes of vigorous-intensity cardio</strong> (running, HIIT, spinning)</li>
                <li><strong>Or a combination of both</strong></li>
              </ul>
              <p className="leading-relaxed">
                Studies show that cardio preferentially targets visceral fat, making it especially effective for reducing WHR.
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">Strength Training</h4>
              <p className="text-lg leading-relaxed">
                Don't skip the weights! Resistance training:
              </p>
              <ul className="space-y-2">
                <li>Builds lean muscle mass, which increases metabolic rate</li>
                <li>Improves insulin sensitivity</li>
                <li>Helps reshape body composition even without weight loss</li>
                <li>Should be performed 2-3 times per week, targeting all major muscle groups</li>
              </ul>

              <h4 className="text-xl font-semibold mt-6 mb-3">Core Strengthening</h4>
              <p className="text-lg leading-relaxed">
                While spot reduction is a myth, strengthening your core muscles:
              </p>
              <ul className="space-y-2">
                <li>Improves posture, making your waist appear smaller</li>
                <li>Provides structural support, preventing age-related waist expansion</li>
                <li>Enhances functional fitness and reduces injury risk</li>
              </ul>
              <p className="leading-relaxed">
                <strong>Effective exercises:</strong> Planks, side planks, bird dogs, dead bugs, Pallof presses, and rotational movements.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">🥗 Nutritional Strategies</h3>
              
              <h4 className="text-xl font-semibold mt-6 mb-3">Reduce Refined Carbohydrates</h4>
              <p className="text-lg leading-relaxed">
                Refined carbs and added sugars are strongly linked to visceral fat accumulation. Minimize:
              </p>
              <ul className="space-y-2">
                <li>White bread, pasta, and rice</li>
                <li>Sugary drinks and fruit juices</li>
                <li>Pastries, cookies, and candy</li>
                <li>Processed snack foods</li>
              </ul>

              <h4 className="text-xl font-semibold mt-6 mb-3">Increase Protein Intake</h4>
              <p className="text-lg leading-relaxed">
                Higher protein intake (25-30% of calories) is associated with:
              </p>
              <ul className="space-y-2">
                <li>Greater satiety and reduced overall calorie intake</li>
                <li>Preservation of lean muscle mass during weight loss</li>
                <li>Increased thermogenesis (calorie burning from digestion)</li>
                <li>Better blood sugar control</li>
              </ul>

              <h4 className="text-xl font-semibold mt-6 mb-3">Prioritize Healthy Fats</h4>
              <p className="text-lg leading-relaxed">
                Not all fats are equal. Focus on:
              </p>
              <ul className="space-y-2">
                <li><strong>Monounsaturated fats:</strong> Olive oil, avocados, nuts</li>
                <li><strong>Omega-3 fatty acids:</strong> Fatty fish, flaxseeds, walnuts</li>
                <li><strong>Limit saturated fats</strong> from red meat and full-fat dairy</li>
                <li><strong>Avoid trans fats</strong> completely (partially hydrogenated oils)</li>
              </ul>

              <h4 className="text-xl font-semibold mt-6 mb-3">Increase Fiber Consumption</h4>
              <p className="text-lg leading-relaxed">
                Soluble fiber, in particular, helps reduce visceral fat by:
              </p>
              <ul className="space-y-2">
                <li>Slowing digestion and improving satiety</li>
                <li>Reducing insulin spikes</li>
                <li>Feeding beneficial gut bacteria</li>
              </ul>
              <p className="leading-relaxed">
                <strong>Best sources:</strong> Oats, beans, apples, citrus fruits, carrots, barley, and psyllium husk.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">😴 Sleep and Stress Management</h3>
              
              <h4 className="text-xl font-semibold mt-6 mb-3">Prioritize Quality Sleep</h4>
              <p className="text-lg leading-relaxed">
                Poor sleep (less than 7 hours nightly) is independently associated with increased visceral fat. Sleep deprivation:
              </p>
              <ul className="space-y-2">
                <li>Increases cortisol and hunger hormones (ghrelin)</li>
                <li>Decreases satiety hormones (leptin)</li>
                <li>Impairs insulin sensitivity</li>
                <li>Reduces willpower and decision-making capacity</li>
              </ul>

              <h4 className="text-xl font-semibold mt-6 mb-3">Manage Chronic Stress</h4>
              <p className="text-lg leading-relaxed">
                Elevated cortisol from chronic stress directly promotes abdominal fat storage. Evidence-based stress reduction techniques include:
              </p>
              <ul className="space-y-2">
                <li><strong>Mindfulness meditation:</strong> Even 10 minutes daily shows benefits</li>
                <li><strong>Yoga:</strong> Combines physical activity with stress reduction</li>
                <li><strong>Deep breathing exercises:</strong> Activates the parasympathetic nervous system</li>
                <li><strong>Regular social connection:</strong> Strong social ties buffer against stress</li>
                <li><strong>Time in nature:</strong> Proven to reduce cortisol levels</li>
              </ul>

              <h3 className="text-2xl font-semibold mt-8 mb-4">⏱️ Timeline for Results</h3>
              <p className="text-lg leading-relaxed">
                Be patient! Meaningful improvements in WHR typically take:
              </p>
              <ul className="space-y-2">
                <li><strong>4-6 weeks:</strong> Noticeable changes in waist circumference</li>
                <li><strong>8-12 weeks:</strong> Measurable reduction in WHR (0.01-0.03 decrease)</li>
                <li><strong>3-6 months:</strong> Significant improvements and new habits solidified</li>
                <li><strong>1 year+:</strong> Sustainable lifestyle changes and optimal results</li>
              </ul>
              <p className="text-lg leading-relaxed font-semibold">
                Remember: Small, consistent changes compound over time. A 5-10% reduction in body weight can significantly improve your WHR and health markers!
              </p>
            </TabsContent>

            <TabsContent value="faq" className="prose prose-sm max-w-none dark:prose-invert">
              <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              
              <h4 className="text-xl font-semibold mt-6 mb-3">Is WHR more accurate than BMI?</h4>
              <p className="text-lg leading-relaxed">
                For predicting cardiovascular disease and metabolic health risks, yes! WHR provides information about fat distribution that BMI cannot. However, both measurements have value—WHR for metabolic risk, BMI for overall weight status. Using both together gives the most complete picture.
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">Can I be healthy with a high WHR?</h4>
              <p className="text-lg leading-relaxed">
                While a high WHR increases your statistical risk, it's just one factor. Some people with elevated WHR maintain excellent metabolic health through diet, exercise, and genetics. However, you can always improve your long-term health outlook by reducing your WHR through lifestyle changes.
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">Does age affect WHR?</h4>
              <p className="text-lg leading-relaxed">
                Yes, significantly. Both men and women tend to develop higher WHRs with age due to hormonal changes (decreased estrogen in women, decreased testosterone in men), reduced muscle mass, and often decreased physical activity. This is why maintaining healthy habits becomes increasingly important as we age.
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">How often should I measure my WHR?</h4>
              <p className="text-lg leading-relaxed">
                Monthly measurements are ideal for tracking progress without obsessing over daily fluctuations (which are normal due to water retention, digestion, etc.). Always measure at the same time of day, preferably in the morning before eating, for consistency.
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">Can exercise alone improve my WHR?</h4>
              <p className="text-lg leading-relaxed">
                Exercise can improve WHR even without weight loss by reducing visceral fat and building muscle. However, the combination of exercise AND dietary improvements produces the best and fastest results. Neither approach alone is as effective as both together.
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">Does genetics determine my WHR?</h4>
              <p className="text-lg leading-relaxed">
                Genetics influence your natural body shape and where you tend to store fat, but lifestyle factors still have a dominant impact. Even with genetic predisposition to apple-shaped weight distribution, you can significantly improve your WHR through diet, exercise, and stress management.
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">What's the difference between subcutaneous and visceral fat?</h4>
              <p className="text-lg leading-relaxed">
                Subcutaneous fat is located directly under the skin (you can pinch it). Visceral fat surrounds internal organs in the abdominal cavity. Visceral fat is metabolically active and produces inflammatory substances, making it far more dangerous to health. High WHR indicates higher visceral fat levels.
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">Can stress really increase my waist size?</h4>
              <p className="text-lg leading-relaxed">
                Absolutely! Chronic stress elevates cortisol, which directly promotes fat storage around the abdomen. This is why stress management techniques like meditation, yoga, and adequate sleep are essential components of any WHR reduction strategy.
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">Should I be concerned if I'm in the "moderate risk" category?</h4>
              <p className="text-lg leading-relaxed">
                Moderate risk is a wake-up call, not a crisis. It's the perfect time to make lifestyle changes before problems develop. Small improvements in diet and activity level can quickly move you from moderate to low risk. Think of it as preventive medicine!
              </p>

              <h4 className="text-xl font-semibold mt-6 mb-3">Can medication affect my WHR?</h4>
              <p className="text-lg leading-relaxed">
                Yes, several medications can influence fat distribution, including corticosteroids, certain antidepressants, antipsychotics, and some diabetes medications. If you're on medication and struggling with WHR, discuss alternatives with your doctor—but never stop medications without medical supervision.
              </p>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Important Disclaimer
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This calculator provides estimates based on World Health Organization (WHO) standards for waist-to-hip ratio assessment. WHR is a screening tool, not a diagnostic tool. Individual health risks depend on many factors including age, genetics, lifestyle, family history, and existing health conditions.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>This is not medical advice.</strong> If you have concerns about your health, cardiovascular risk, or weight management, please consult with a qualified healthcare provider, registered dietitian, or certified fitness professional. They can provide personalized guidance based on your complete health profile.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>References:</strong> World Health Organization (WHO), American Heart Association, National Institutes of Health (NIH), Centers for Disease Control and Prevention (CDC).
            </p>
          </div>
        </Card>
      </div>

      <BottomStickyAd />
    </>
  );
}
