// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Brain, TrendingUp, AlertTriangle, Target, CheckCircle } from 'lucide-react';
import backend from '~backend/client';
import type { AnalysisRequest, AnalysisResponse, Recommendation } from '~backend/ai-analysis/types';

interface AIAnalysisProps {
  analysisRequest: AnalysisRequest;
  className?: string;
  autoRun?: boolean;
  title?: string;
  description?: string;
}

const priorityConfig = {
  high: { color: 'destructive', icon: AlertTriangle },
  medium: { color: 'default', icon: Target },
  low: { color: 'secondary', icon: CheckCircle }
} as const;

const typeConfig = {
  optimization: { label: 'Optimization', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  warning: { label: 'Warning', color: 'bg-red-50 text-red-700 border-red-200' },
  opportunity: { label: 'Opportunity', color: 'bg-green-50 text-green-700 border-green-200' },
  strategy: { label: 'Strategy', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  engagement: { label: 'Engagement', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  growth: { label: 'Growth', color: 'bg-green-50 text-green-700 border-green-200' }
} as const;

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const { type, priority, title, description, actionItems, potentialSavings, estimatedImpact } = recommendation;
  const PriorityIcon = priorityConfig[priority].icon;
  const typeStyle = typeConfig[type];

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <PriorityIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Badge variant={priorityConfig[priority].color as any}>
              {priority} priority
            </Badge>
            <Badge variant="outline" className={typeStyle.color}>
              {typeStyle.label}
            </Badge>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Action Items:</h4>
            <ul className="space-y-1">
              {actionItems.map((item, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground p-2 bg-muted rounded">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {(potentialSavings || estimatedImpact) && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              {potentialSavings && (
                <p className="text-sm font-medium text-green-700">
                  💰 Potential Savings: ${potentialSavings.toLocaleString()}
                </p>
              )}
              {estimatedImpact && (
                <p className="text-sm text-green-600 mt-1">
                  📈 {estimatedImpact}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function InsightsList({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm">
              <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function AIAnalysis({ 
  analysisRequest, 
  className, 
  autoRun = false, 
  title = "AI Financial Analysis",
  description = "Get personalized recommendations and insights based on your calculation results."
}: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await backend.ai_analysis.analyze(analysisRequest);
      setAnalysis(response);
    } catch (err) {
      console.error('AI Analysis error:', err);
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (autoRun) {
      runAnalysis();
    }
  }, [autoRun]);

  if (!analysis && !loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span>{title}</span>
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runAnalysis} className="w-full">
            <Brain className="h-4 w-4 mr-2" />
            Generate AI Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Analyzing your results...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="py-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={runAnalysis} variant="outline" className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  const highPriorityRecommendations = analysis.recommendations.filter(r => r.priority === 'high');
  const mediumPriorityRecommendations = analysis.recommendations.filter(r => r.priority === 'medium');
  const lowPriorityRecommendations = analysis.recommendations.filter(r => r.priority === 'low');

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription className="text-base">
          {analysis.summary}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
            <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="mt-6">
            <div className="space-y-6">
              {highPriorityRecommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>High Priority</span>
                  </h3>
                  {highPriorityRecommendations.map((rec, index) => (
                    <RecommendationCard key={`high-${index}`} recommendation={rec} />
                  ))}
                </div>
              )}
              
              {mediumPriorityRecommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                    <Target className="h-5 w-5 text-yellow-500" />
                    <span>Medium Priority</span>
                  </h3>
                  {mediumPriorityRecommendations.map((rec, index) => (
                    <RecommendationCard key={`medium-${index}`} recommendation={rec} />
                  ))}
                </div>
              )}
              
              {lowPriorityRecommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Low Priority</span>
                  </h3>
                  {lowPriorityRecommendations.map((rec, index) => (
                    <RecommendationCard key={`low-${index}`} recommendation={rec} />
                  ))}
                </div>
              )}
              
              {analysis.recommendations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>Great job! No specific recommendations at this time.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            <InsightsList 
              title="Key Insights" 
              items={analysis.keyInsights}
              icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
            />
          </TabsContent>
          
          <TabsContent value="risks" className="mt-6">
            <InsightsList 
              title="Risk Factors" 
              items={analysis.riskFactors}
              icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
            />
          </TabsContent>
          
          <TabsContent value="next-steps" className="mt-6">
            <InsightsList 
              title="Next Steps" 
              items={analysis.nextSteps}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t">
          <Button 
            onClick={runAnalysis} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            Refresh Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}