import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { EZOIC_CONFIG } from '../../config/ezoic';

export default function EzoicAdsManager() {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [ezoicLoaded, setEzoicLoaded] = useState(false);

  useEffect(() => {
    // Check if ads are disabled in localStorage
    const disabled = localStorage.getItem('ezoic_ads_disabled') === 'true';
    setAdsEnabled(!disabled);

    // Check if Ezoic script is loaded
    if (typeof window !== 'undefined' && window.ezstandalone) {
      setEzoicLoaded(true);
    } else {
      // Check again after delay
      const timer = setTimeout(() => {
        if (window.ezstandalone) {
          setEzoicLoaded(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleAds = () => {
    const newState = !adsEnabled;
    setAdsEnabled(newState);
    
    if (newState) {
      localStorage.removeItem('ezoic_ads_disabled');
      console.log('✅ Ezoic ads enabled');
    } else {
      localStorage.setItem('ezoic_ads_disabled', 'true');
      console.log('🚫 Ezoic ads disabled');
    }
    
    // Reload page to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const adPlacements = [
    { id: EZOIC_CONFIG.PLACEMENTS.TOP_BANNER, name: 'Top Banner', location: 'Above content' },
    { id: EZOIC_CONFIG.PLACEMENTS.MID_CONTENT_1, name: 'Mid Content 1', location: 'After main content' },
    { id: EZOIC_CONFIG.PLACEMENTS.MID_CONTENT_2, name: 'Mid Content 2', location: 'Before tips section' },
    { id: EZOIC_CONFIG.PLACEMENTS.SIDEBAR_TOP, name: 'Sidebar Top', location: 'Desktop sidebar top' },
    { id: EZOIC_CONFIG.PLACEMENTS.SIDEBAR_MID, name: 'Sidebar Mid', location: 'Desktop sidebar middle' },
    { id: EZOIC_CONFIG.PLACEMENTS.BOTTOM_STICKY, name: 'Bottom Sticky', location: 'Mobile bottom (fixed)' },
    { id: EZOIC_CONFIG.PLACEMENTS.IN_FEED, name: 'In-Feed', location: 'End of content' },
    { id: EZOIC_CONFIG.PLACEMENTS.FOOTER, name: 'Footer', location: 'Page footer' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ezoic Ads Manager</h1>
        <p className="text-muted-foreground">
          Manage Ezoic advertising integration for Smart Calculator Hubs
        </p>
      </div>

      {/* Status Card */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Ezoic Integration Status</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {ezoicLoaded ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-600">Script Loaded</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-600">Script Not Detected</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {adsEnabled ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-600">Ads Enabled</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-orange-600">Ads Disabled</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <Button
            onClick={toggleAds}
            variant={adsEnabled ? "destructive" : "default"}
            className="min-w-[140px]"
          >
            {adsEnabled ? (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Disable Ads
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Enable Ads
              </>
            )}
          </Button>
        </div>

        {!ezoicLoaded && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-semibold mb-1">Ezoic Script Not Detected</p>
              <p>
                Make sure the Ezoic scripts are properly loaded in index.html. 
                Check the browser console for any script loading errors.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Ad Placements */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Ad Placements ({adPlacements.length} slots)</h2>
        <div className="space-y-3">
          {adPlacements.map((placement) => (
            <div 
              key={placement.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono text-xs">
                    {placement.id}
                  </Badge>
                  <span className="font-semibold">{placement.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{placement.location}</p>
              </div>
              <Badge variant={adsEnabled ? "default" : "secondary"}>
                {adsEnabled ? 'Active' : 'Disabled'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Setup Instructions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Ezoic Setup Checklist</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-semibold">1. Scripts Added to index.html</p>
              <p className="text-sm text-muted-foreground">
                Ezoic privacy and ad scripts are loaded in the HTML head
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-semibold">2. Ad Slots Configured</p>
              <p className="text-sm text-muted-foreground">
                8 responsive ad placements across calculator pages
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <p className="font-semibold">3. Update ads.txt File</p>
              <p className="text-sm text-muted-foreground">
                Get your Ezoic Publisher ID from the Ezoic dashboard and update /public/ads.txt
              </p>
              <a 
                href="https://pubdash.ezoic.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-1 inline-block"
              >
                Open Ezoic Dashboard →
              </a>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <p className="font-semibold">4. Verify Domain in Ezoic</p>
              <p className="text-sm text-muted-foreground">
                Add smartcalculatorhubs.com to your Ezoic account and complete domain verification
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Console Output */}
      <div className="mt-8 p-4 bg-gray-900 rounded-lg text-white font-mono text-sm">
        <div className="text-green-400 mb-2">
          {ezoicLoaded ? '✅ Ezoic integrated successfully' : '⚠️ Waiting for Ezoic script...'}
        </div>
        <div className="text-gray-400">
          window.ezstandalone: {ezoicLoaded ? 'detected' : 'undefined'}
        </div>
        <div className="text-gray-400">
          Ads status: {adsEnabled ? 'enabled' : 'disabled'}
        </div>
      </div>
    </div>
  );
}
