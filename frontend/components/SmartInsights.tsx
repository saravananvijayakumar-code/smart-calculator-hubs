// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, TrendingUp, History, Target, Brain, ChevronRight } from 'lucide-react';
import { useUserContext } from '../contexts/UserContextProvider';

interface SmartInsightsProps {
  currentCalculation: any;
  calculatorType: string;
  className?: string;
}

export function SmartInsights({ currentCalculation, calculatorType, className }: SmartInsightsProps) {
  const { userProfile, getRecentCalculations, getPersonalizedRecommendations } = useUserContext();
  const [insights, setInsights] = useState<{
    patterns: string[];
    recommendations: string[];
    trends: string[];
    opportunities: string[];
  }>({
    patterns: [],
    recommendations: [],
    trends: [],
    opportunities: []
  });

  useEffect(() => {
    generateSmartInsights();
  }, [currentCalculation, calculatorType, userProfile]);

  const generateSmartInsights = () => {
    const recentCalculations = getRecentCalculations(undefined, 20);
    const sameTypeCalculations = getRecentCalculations(calculatorType, 10);
    const personalizedRecs = getPersonalizedRecommendations(currentCalculation);

    // Pattern analysis
    const patterns: string[] = [];
    if (sameTypeCalculations.length > 3) {
      patterns.push(`You've used this calculator ${sameTypeCalculations.length} times recently`);
    }

    const calculatorCategories = recentCalculations.reduce((acc, calc) => {
      const category = calc.calculatorType.split('-')[0];
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(calculatorCategories).sort(([,a], [,b]) => b - a)[0];
    if (topCategory && topCategory[1] > 3) {
      patterns.push(`High focus on ${topCategory[0]} calculations recently`);
    }

    // Trend analysis
    const trends: string[] = [];
    const last7Days = recentCalculations.filter(calc => 
      Date.now() - calc.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
    );
    
    if (last7Days.length > 5) {
      trends.push('Increased financial planning activity this week');
    }

    const mortgageCalcs = recentCalculations.filter(calc => calc.calculatorType.includes('mortgage'));
    const loanCalcs = recentCalculations.filter(calc => calc.calculatorType.includes('loan'));
    
    if (mortgageCalcs.length > 0 && loanCalcs.length > 0) {
      trends.push('Exploring multiple financing options');
    }

    // Opportunity analysis
    const opportunities: string[] = [];
    
    if (calculatorType.includes('mortgage') && !recentCalculations.some(calc => calc.calculatorType.includes('emergency'))) {
      opportunities.push('Consider calculating emergency fund before major purchases');
    }

    if (calculatorType.includes('investment') && !recentCalculations.some(calc => calc.calculatorType.includes('tax'))) {
      opportunities.push('Explore tax implications of your investment strategy');
    }

    if (userProfile.age && userProfile.age < 40 && !recentCalculations.some(calc => calc.calculatorType.includes('retirement'))) {
      opportunities.push('Time is on your side - explore retirement planning calculators');
    }

    const internationalCalcs = recentCalculations.filter(calc => 
      calc.calculatorType.includes('uk') || 
      calc.calculatorType.includes('india') || 
      calc.calculatorType.includes('australia')
    );

    if (internationalCalcs.length > 0 && !recentCalculations.some(calc => calc.calculatorType.includes('currency'))) {
      opportunities.push('Consider currency conversion for international planning');
    }

    setInsights({
      patterns,
      recommendations: personalizedRecs,
      trends,
      opportunities
    });
  };

  const hasAnyInsights = insights.patterns.length > 0 || 
                       insights.recommendations.length > 0 || 
                       insights.trends.length > 0 || 
                       insights.opportunities.length > 0;

  if (!hasAnyInsights) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>Smart Insights</span>
          <Badge variant="secondary" className="bg-purple-50 text-purple-700">
            AI Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          Personalized insights based on your calculation patterns and profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {insights.patterns.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <History className="h-4 w-4 text-blue-600" />
              <span>Usage Patterns</span>
            </h4>
            <div className="space-y-2">
              {insights.patterns.map((pattern, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm bg-blue-50 p-3 rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{pattern}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {insights.trends.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>Financial Trends</span>
            </h4>
            <div className="space-y-2">
              {insights.trends.map((trend, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm bg-green-50 p-3 rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{trend}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {insights.opportunities.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <Target className="h-4 w-4 text-orange-600" />
              <span>Opportunities</span>
            </h4>
            <div className="space-y-2">
              {insights.opportunities.map((opportunity, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm bg-orange-50 p-3 rounded-lg">
                  <div className="h-2 w-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{opportunity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {insights.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <span>Personalized Recommendations</span>
            </h4>
            <div className="space-y-2">
              {insights.recommendations.map((recommendation, index) => (
                <Alert key={index} className="border-yellow-200 bg-yellow-50">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    {recommendation}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Based on your calculation history and profile</span>
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
              <span>View All Insights</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}