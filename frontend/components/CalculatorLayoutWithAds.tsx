import { ReactNode, useEffect } from 'react';
import { SEOHead } from './SEOHead';
import AmazonAffiliate from './ads/AmazonAffiliate';
import NativeBanner from './ads/NativeBanner';
import EnhancedAIAnalysis from './EnhancedAIAnalysis';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface CalculatorLayoutWithAdsProps {
  title: string;
  description: string;
  keywords?: string;
  tips?: string[];
  children: ReactNode;
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
  useEffect(() => {
    console.log('📊 Google Auto Ads enabled for:', title);
  }, [title]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <SEOHead
          title={title}
          description={description}
          keywords={keywords || ''}
        />
        
        {/* Native Banner 1 - Top */}
        {showAd && (
          <div className="mb-6">
            <NativeBanner position="top" />
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Page Title */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
                <p className="text-lg text-muted-foreground">{description}</p>
              </div>

              {/* Calculator Content */}
              <div className="space-y-8">
                {children}
              </div>

              {/* AI Analysis Section */}
              {showAIAnalysis && aiAnalysisRequest && (
                <div className="mt-8">
                  <EnhancedAIAnalysis
                    calculatorType={aiAnalysisRequest.calculatorType}
                    data={aiAnalysisRequest.data}
                    userContext={aiAnalysisRequest.userContext}
                  />
                </div>
              )}

              {/* Native Banner 2 - Middle */}
              {showAd && (
                <div className="my-8">
                  <NativeBanner position="middle" />
                </div>
              )}

              {/* Tips section */}
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

              {/* Amazon Affiliate Ad */}
              {showAd && (
                <div className="my-8">
                  <AmazonAffiliate calculatorTitle={title} placement="content" />
                </div>
              )}

              {/* Native Banner 3 - Bottom */}
              {showAd && (
                <div className="mt-8">
                  <NativeBanner position="bottom" />
                </div>
              )}
            </div>

            {/* Sidebar with Ads */}
            <div className="lg:col-span-1">
              {showAd && (
                <div className="space-y-8 sticky top-20">
                  {/* Amazon Affiliate Sidebar */}
                  <div className="mt-8">
                    <AmazonAffiliate calculatorTitle={title} placement="sidebar" />
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
