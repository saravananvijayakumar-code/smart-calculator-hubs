import { ReactNode } from 'react';
import { SEOHead } from './SEOHead';
import { AdsterraSlot } from './ads/AdsterraSlot';
import EnhancedAIAnalysis from './EnhancedAIAnalysis';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface CalculatorLayoutWithAdsProps {
  title: string;
  description: string;
  keywords?: string;
  tips?: string[];
  children?: ReactNode;
  showAd?: boolean;
  aiAnalysisRequest?: AnalysisRequest;
  showAIAnalysis?: boolean;
}

function CalculatorLayoutWithAds({ 
  title, 
  description, 
  keywords, 
  tips,
  children,
  showAd = true,
  aiAnalysisRequest,
  showAIAnalysis = false
}: CalculatorLayoutWithAdsProps) {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <SEOHead
          title={title}
          description={description}
          keywords={keywords || ''}
        />
        
        {showAd && (
          <div className="mb-6">
            <AdsterraSlot />
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
                <p className="text-lg text-muted-foreground">{description}</p>
              </div>

              <div className="space-y-8">
                {children}
              </div>

              {showAIAnalysis && aiAnalysisRequest && (
                <div className="mt-8">
                  <EnhancedAIAnalysis
                    calculatorType={aiAnalysisRequest.calculatorType}
                    data={aiAnalysisRequest.data}
                    userContext={aiAnalysisRequest.userContext}
                  />
                </div>
              )}

              {showAd && (
                <div className="my-8">
                  <AdsterraSlot />
                </div>
              )}

              {tips && tips.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100">Tips & Information</h3>
                  <ul className="space-y-2">
                    {tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
                        <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showAd && (
                <div className="mt-8">
                  <AdsterraSlot />
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {showAd && (
                <div className="space-y-8 sticky top-20">
                  <div className="text-sm text-muted-foreground text-center">
                    Advertisement
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CalculatorLayoutWithAds;
export { CalculatorLayoutWithAds };
