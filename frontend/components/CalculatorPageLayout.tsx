import { ReactNode } from 'react';
import { SEOHead } from './SEOHead';
import { TopBannerAd } from './ads/TopBannerAd';
import { MidContentAd } from './ads/MidContentAd';
import { SidebarAd } from './ads/SidebarAd';

interface CalculatorPageLayoutProps {
  title: string;
  description: string;
  keywords?: string;
  children: ReactNode;
  showSidebarAd?: boolean;
}

export function CalculatorPageLayout({ 
  title, 
  description, 
  keywords, 
  children, 
  showSidebarAd = true 
}: CalculatorPageLayoutProps) {
  return (
    <div>
      <SEOHead
        title={title}
        description={description}
        keywords={keywords}
      />
      
      {/* Top Banner Ad */}
      <TopBannerAd className="bg-gray-50 border-b" />
      
      <div className="container mx-auto px-4 py-8">
        <div className={`${showSidebarAd ? 'lg:grid lg:grid-cols-4 lg:gap-8' : ''}`}>
          <div className={showSidebarAd ? 'lg:col-span-3' : ''}>
            {children}
          </div>
          
          {showSidebarAd && (
            <div className="hidden lg:block">
              <div className="sticky top-8">
                <SidebarAd />
              </div>
            </div>
          )}
        </div>
        
        {/* Mid Content Ad - shown between content sections */}
        <MidContentAd className="py-8 mt-8 border-t" />
      </div>
    </div>
  );
}