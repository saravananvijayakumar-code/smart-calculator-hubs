import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Sparkles, Target, Lightbulb, ShieldAlert, ZapIcon, TrendingDown } from 'lucide-react';
import backend from '~backend/client';

interface AnalysisResult {
  summary: string;
  recommendations: Array<{
    type: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    actionItems: string[];
    potentialSavings?: number;
    estimatedImpact?: string;
  }>;
  keyInsights: string[];
  riskFactors: string[];
  nextSteps: string[];
}

interface EnhancedAIAnalysisProps {
  calculatorType: string;
  data: Record<string, any>;
  userContext?: {
    age?: number;
    income?: number;
    location?: string;
    riskTolerance?: "low" | "medium" | "high";
  };
  onAnalysisComplete?: (analysis: AnalysisResult) => void;
  className?: string;
}

export default function EnhancedAIAnalysis({
  calculatorType,
  data,
  userContext,
  onAnalysisComplete,
  className = ""
}: EnhancedAIAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Calling AI analysis with:', { calculatorType, data, userContext });
      const result = await backend.ai_analysis.analyze({
        calculatorType: calculatorType as any,
        data: data as any,
        userContext
      });
      
      console.log('AI Analysis result:', result);
      
      if (!result) {
        console.error('No result received from AI analysis');
        setError('No analysis data received. Please try again.');
        return;
      }
      
      if (!result.summary && (!result.recommendations || result.recommendations.length === 0)) {
        console.error('Empty analysis received:', result);
        setError('Received empty analysis. Please try again.');
        return;
      }
      
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      console.error('AI Analysis error:', err);
      setError(`Failed to generate analysis: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentData = JSON.stringify({ calculatorType, data, userContext });
    
    if (currentData === previousDataRef.current) {
      return;
    }
    
    previousDataRef.current = currentData;
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      handleAnalyze();
    }, 1500);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [calculatorType, JSON.stringify(data), JSON.stringify(userContext)]);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high': 
        return {
          badge: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0',
          card: 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30',
          icon: 'text-red-600 dark:text-red-400'
        };
      case 'medium': 
        return {
          badge: 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0',
          card: 'border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30',
          icon: 'text-orange-600 dark:text-orange-400'
        };
      case 'low': 
        return {
          badge: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0',
          card: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
          icon: 'text-green-600 dark:text-green-400'
        };
      default: 
        return {
          badge: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0',
          card: 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30',
          icon: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'opportunity': return <Target className="h-5 w-5" />;
      case 'risk': return <ShieldAlert className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };



  if (isLoading) {
    return (
      <Card className={`border-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl animate-pulse"></div>
            <Loader2 className="h-16 w-16 animate-spin text-white drop-shadow-lg relative z-10" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-bold text-2xl drop-shadow-md">Generating AI Analysis...</p>
            <p className="text-white/80 text-sm">Analyzing your data with advanced AI models</p>
            
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`border-0 bg-gradient-to-br from-red-500 to-rose-600 text-white ${className}`}>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                <AlertTriangle className="h-12 w-12" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Analysis Failed</h3>
              <p className="text-white/90">{error}</p>
            </div>
            <Button 
              onClick={handleAnalyze}
              className="bg-white text-red-600 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <Brain className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="border-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMCAzdjItMnptLTIgMGgyLTJ6bTAgMGgyLTJ6bS0yIDBoMi0yem0wLTNoMi0yem0yIDB2Mi0yem0wLTN2Mi0yem0tMiAwaDItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Brain className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">AI Analysis Summary</CardTitle>
            <div className="ml-auto">
              <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-white/95 leading-relaxed text-lg">{analysis?.summary}</p>
        </CardContent>
      </Card>

      {analysis?.recommendations && analysis.recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">Personalized Recommendations</h3>
          </div>
          
          {analysis.recommendations.map((rec, index) => {
            const config = getPriorityConfig(rec.priority);
            return (
              <Card 
                key={index} 
                className={`${config.card} border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 bg-white dark:bg-gray-900 rounded-xl shadow-md ${config.icon}`}>
                        {getRecommendationIcon(rec.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xl text-foreground">{rec.title}</h4>
                        {rec.estimatedImpact && (
                          <p className="text-sm text-muted-foreground mt-0.5">{rec.estimatedImpact}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={`${config.badge} text-sm font-semibold px-3 py-1 shadow-md`}>
                      {rec.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-foreground/90 mb-4 leading-relaxed">{rec.description}</p>
                  
                  {rec.potentialSavings && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 mb-4 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          <span className="font-bold text-lg">Potential Savings</span>
                        </div>
                        <span className="text-2xl font-bold">
                          ${rec.potentialSavings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {rec.actionItems.length > 0 && (
                    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-white/60 dark:border-gray-700/60">
                      <h5 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Action Items:
                      </h5>
                      <ul className="space-y-2.5">
                        {rec.actionItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-foreground/90">
                            <div className="mt-0.5 p-1 bg-primary/20 rounded-full">
                              <ArrowRight className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {analysis?.keyInsights && analysis.keyInsights.length > 0 && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 text-white rounded-xl shadow-md">
                <Lightbulb className="h-5 w-5" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Key Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg border border-blue-200 dark:border-blue-800">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90 leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {analysis?.riskFactors && analysis.riskFactors.length > 0 && (
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 text-white rounded-xl shadow-md">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Risk Factors</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.riskFactors.map((risk, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg border border-orange-200 dark:border-orange-800">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90 leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {analysis?.nextSteps && analysis.nextSteps.length > 0 && (
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-md">
                <TrendingUp className="h-5 w-5" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Next Steps</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg border border-emerald-200 dark:border-emerald-800 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-colors">
                  <div className="p-1.5 bg-emerald-500 text-white rounded-full mt-0.5">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-foreground/90 leading-relaxed flex-1">{step}</span>
                  <ArrowRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}