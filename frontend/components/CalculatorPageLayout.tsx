import { ReactNode } from 'react';
import { SEOHead } from './SEOHead';
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
      </div>
    </div>
  );
}