import React, { useState } from 'react';
import EnhancedAIAnalysis from './EnhancedAIAnalysis';
import ExportShareButtons from './ExportShareButtons';

interface CalculatorWrapperProps {
  calculatorType: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  title?: string;
  userContext?: {
    age?: number;
    income?: number;
    location?: string;
    riskTolerance?: "low" | "medium" | "high";
  };
  children: React.ReactNode;
  className?: string;
}

export default function CalculatorWrapper({
  calculatorType,
  inputs,
  results,
  title,
  userContext,
  children,
  className = ""
}: CalculatorWrapperProps) {
  const [analysis, setAnalysis] = useState<any>(null);

  // Only show AI analysis and export/share if we have valid results
  const hasResults = Object.keys(results).length > 0 && Object.values(results).some(v => v !== null && v !== undefined && v !== '');

  return (
    <div className={className}>
      {children}
      
      {hasResults && (
        <div className="space-y-6 mt-8">
          {/* AI Analysis */}
          <EnhancedAIAnalysis
            calculatorType={calculatorType}
            data={results}
            userContext={userContext}
            onAnalysisComplete={setAnalysis}
          />

          {/* Export/Share Buttons */}
          <ExportShareButtons
            calculatorType={calculatorType}
            inputs={inputs}
            results={results}
            analysis={analysis}
            title={title || `${formatCalculatorType(calculatorType)} Report`}
          />
        </div>
      )}
    </div>
  );
}

function formatCalculatorType(type: string): string {
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}