import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calculator, Calendar, ArrowLeft, Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { SEOHead } from '../components/SEOHead';

interface SharedResult {
  id: string;
  shareId: string;
  calculatorType: string;
  results: Record<string, any>;
  analysis?: {
    summary: string;
    recommendations: Array<{
      type: string;
      priority: string;
      title: string;
      description: string;
      actionItems: string[];
    }>;
    keyInsights: string[];
    riskFactors: string[];
    nextSteps: string[];
  };
  createdAt: Date;
}

export default function ShareResultPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const [result, setResult] = useState<SharedResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shareId) {
      loadSharedResult(shareId);
    }
  }, [shareId]);

  const loadSharedResult = async (id: string) => {
    try {
      setError('Share results service not implemented');
    } catch (err) {
      console.error('Error loading shared result:', err);
      setError('Failed to load shared calculation. The link may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCalculatorType = (type: string): string => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      if (value > 1000) {
        return value.toLocaleString();
      }
      return value.toString();
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value?.toString() || '';
  };

  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Shared Calculation...</h2>
              <p className="text-gray-600">Please wait while we retrieve the shared results.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <SEOHead 
          title="Shared Calculation Not Found"
          description="The shared calculation you're looking for could not be found."
        />
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-8">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-900 mb-2">Calculation Not Found</h1>
              <p className="text-red-700 mb-6">{error}</p>
              <Button onClick={() => window.location.href = '/'} className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const calculatorName = formatCalculatorType(result.calculatorType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SEOHead 
        title={`Shared ${calculatorName} Calculation`}
        description={`View shared ${calculatorName.toLowerCase()} calculation results and AI analysis from Smart Calculator Hubs.`}
      />
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center mb-2">
              <Calculator className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                Shared {calculatorName} Calculation
              </h1>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Calculated on {new Date(result.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Results */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-gray-900">Calculation Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.results).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">{formatKey(key)}</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatValue(value)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          {result.analysis && (
            <div className="space-y-6">
              {/* Summary */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <div className="flex items-center">
                    <Brain className="h-6 w-6 text-blue-600 mr-2" />
                    <CardTitle className="text-blue-900">AI Analysis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-800 leading-relaxed">{result.analysis.summary}</p>
                </CardContent>
              </Card>

              {/* Recommendations */}
              {result.analysis.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.analysis.recommendations.map((rec, index) => (
                      <div 
                        key={index} 
                        className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            {getRecommendationIcon(rec.type)}
                            <h4 className="font-semibold text-gray-900 ml-2">{rec.title}</h4>
                          </div>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-3">{rec.description}</p>
                        {rec.actionItems.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Action Items:</h5>
                            <ul className="space-y-1">
                              {rec.actionItems.map((item, idx) => (
                                <li key={idx} className="flex items-start text-sm text-gray-700">
                                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Key Insights */}
              {result.analysis.keyInsights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900">Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.analysis.keyInsights.map((insight, index) => (
                        <li key={index} className="flex items-start text-gray-700">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* CTA */}
          <Card className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-bold mb-2">Try Your Own Calculations</h3>
              <p className="mb-6 opacity-90">
                Explore our comprehensive suite of financial, health, and utility calculators
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-white text-blue-600 hover:bg-gray-100"
                size="lg"
              >
                Visit SmartCalculatorHub
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}