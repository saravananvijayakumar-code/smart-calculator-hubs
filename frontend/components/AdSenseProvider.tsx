import { useEffect } from 'react';
import { ADS_CONFIG } from '../config/ads';

declare global {
  interface Window {
    adsbygoogle: any[];
    adSensePageLevelEnabled?: boolean;
  }
}

export function AdSenseProvider() {
  useEffect(() => {
    // Only load script and enable page level ads once
    if (typeof window !== 'undefined') {
      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src*="${ADS_CONFIG.CLIENT_ID}"]`);
      
      if (!existingScript) {
        // Create and load AdSense script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.CLIENT_ID}`;
        script.crossOrigin = 'anonymous';
        
        // Add data-ad-client for verification
        script.setAttribute('data-ad-client', ADS_CONFIG.CLIENT_ID);
        
        // Enable auto ads if configured
        if (ADS_CONFIG.AUTO_ADS.ENABLED) {
          script.setAttribute('data-ad-frequency-hint', '30s');
          script.setAttribute('data-adbreak-test', 'on');
        }
        
        // Silently handle AdSense script loading failures
        script.onerror = () => {
          console.debug('AdSense script failed to load (expected in dev/testing environments)');
        };
        
        document.head.appendChild(script);
      }
      
      // Initialize adsbygoogle array
      window.adsbygoogle = window.adsbygoogle || [];
      
      // Enable auto ads only once per session
      if (ADS_CONFIG.AUTO_ADS.ENABLED && !window.adSensePageLevelEnabled) {
        window.adSensePageLevelEnabled = true;
        window.adsbygoogle.push({
          google_ad_client: ADS_CONFIG.CLIENT_ID,
          enable_page_level_ads: true,
          overlays: {bottom: ADS_CONFIG.AUTO_ADS.ANCHOR_ADS},
          auto_ad_client: ADS_CONFIG.CLIENT_ID
        });
      }
    }
  }, []);

  return null; // This component doesn't render anything
}