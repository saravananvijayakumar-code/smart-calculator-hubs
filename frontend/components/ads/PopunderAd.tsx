import { useEffect } from 'react';

const POPUNDER_SHOWN_KEY = 'popunder_ad_shown';
const POPUNDER_SCRIPT_URL = '//pl27982804.effectivegatecpm.com/f4/82/c7/f482c705da6544ec8ab34df02c905aaa.js';

export function PopunderAd() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasShownPopunder = localStorage.getItem(POPUNDER_SHOWN_KEY);
    
    if (hasShownPopunder === 'true') {
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = POPUNDER_SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      localStorage.setItem(POPUNDER_SHOWN_KEY, 'true');
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
}

export default PopunderAd;
