import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import backend from '~backend/client';
import type { AnalysisRequest, AnalysisResponse } from '~backend/ai-analysis/types';

interface QuickAIInsightsProps {
  analysisRequest: AnalysisRequest;
  autoAnalyze?: boolean;
  className?: string;
}

export function QuickAIInsights({ analysisRequest, autoAnalyze = false, className }: QuickAIInsightsProps) {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoAnalyze) {
      runAnalysis();
    }
  }, [autoAnalyze, analysisRequest]);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try{
      const response = await backend.ai_analysis.analyze(analysisRequest);
      setAnalysis(response);
    } catch (err) {
      console.error('Quick AI Analysis error:', err);
      setError('Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Brain className="h-4 w-4 animate-pulse" />
            <span>Generating insights...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>{error}</span>
            </div>
            <Button onClick={runAnalysis} size="sm" variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className={className}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Get AI Financial Insights</span>
            </div>
            <Button onClick={runAnalysis} size="sm">
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const highPriorityCount = analysis.recommendations.filter(r => r.priority === 'high').length;
  const totalRecommendations = analysis.recommendations.length;
  const topInsights = analysis.keyInsights.slice(0, 2);
  const topRecommendations = analysis.recommendations
    .filter(r => r.priority === 'high')
    .slice(0, 2);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-primary" />
            <span>AI Financial Insights</span>
          </div>
          <div className="flex items-center space-x-2">
            {highPriorityCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {highPriorityCount} urgent
              </Badge>
            )}
            {totalRecommendations > 0 && (
              <Badge variant="secondary" className="text-xs">
                {totalRecommendations} total
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Summary */}
          <p className="text-sm text-muted-foreground">{analysis.summary}</p>
          
          {/* Top Insights */}
          {topInsights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>Key Insights</span>
              </h4>
              {topInsights.map((insight, index) => (
                <div key={index} className="text-xs bg-blue-50 p-2 rounded border-l-2 border-blue-200">
                  {insight}
                </div>
              ))}
            </div>
          )}

          {/* Top Recommendations */}
          {topRecommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3 text-red-500" />
                <span>Priority Actions</span>
              </h4>
              {topRecommendations.map((rec, index) => (
                <div key={index} className="text-xs bg-red-50 p-2 rounded border-l-2 border-red-200">
                  <div className="font-medium">{rec.title}</div>
                  <div className="text-muted-foreground mt-1">{rec.description}</div>
                  {rec.potentialSavings && (
                    <div className="text-green-600 font-medium mt-1">
                      💰 Potential savings: ${rec.potentialSavings.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Expand/Collapse for more details */}
          {(analysis.recommendations.length > 2 || analysis.keyInsights.length > 2 || 
            analysis.riskFactors.length > 0 || analysis.nextSteps.length > 0) && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="w-full h-8 text-xs"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show More Details
                  </>
                )}
              </Button>

              {expanded && (
                <div className="mt-3 space-y-3 pt-3 border-t">
                  {/* All Recommendations */}
                  {analysis.recommendations.length > 2 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">All Recommendations</h4>
                      {analysis.recommendations.slice(2).map((rec, index) => (
                        <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{rec.title}</span>
                            <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                              {rec.priority}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground">{rec.description}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Risk Factors */}
                  {analysis.riskFactors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        <span>Risk Factors</span>
                      </h4>
                      {analysis.riskFactors.slice(0, 3).map((risk, index) => (
                        <div key={index} className="text-xs bg-orange-50 p-2 rounded border-l-2 border-orange-200">
                          {risk}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Next Steps */}
                  {analysis.nextSteps.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center space-x-1">
                        <Lightbulb className="h-3 w-3 text-green-500" />
                        <span>Next Steps</span>
                      </h4>
                      {analysis.nextSteps.slice(0, 3).map((step, index) => (
                        <div key={index} className="text-xs bg-green-50 p-2 rounded border-l-2 border-green-200">
                          {step}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}