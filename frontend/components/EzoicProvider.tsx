import { useEffect } from 'react';
import { EZOIC_CONFIG } from '../config/ezoic';

export function EzoicProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined' && EZOIC_CONFIG.ENABLED) {
      // Ezoic scripts are loaded via index.html
      // This component just logs successful initialization
      
      const checkEzoicLoaded = () => {
        if (window.ezstandalone) {
          console.log('✅ Ezoic Ads Provider initialized successfully');
          return true;
        }
        return false;
      };

      // Check immediately
      if (!checkEzoicLoaded()) {
        // If not loaded, check again after a delay
        const timer = setTimeout(() => {
          if (checkEzoicLoaded()) {
            console.log('✅ Ezoic Ads loaded after delay');
          } else {
            console.warn('⚠️ Ezoic Ads script not detected. Please verify integration.');
          }
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return null;
}
