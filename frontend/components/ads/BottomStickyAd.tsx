import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AutoAdSlot from './AutoAdSlot';
import { ADS_CONFIG } from '../../config/ads';

export default function BottomStickyAd() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      
      setScrollPercentage(scrolled);
      
      // Show ad after scrolling past threshold and delay
      if (scrolled > ADS_CONFIG.PLACEMENT_RULES.SCROLL_PERCENTAGE) {
        setTimeout(() => {
          setIsVisible(true);
        }, ADS_CONFIG.PLACEMENT_RULES.DELAY_SECONDS * 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg transition-all duration-300 ${
        isMinimized ? 'h-12' : 'h-24'
      } lg:hidden`}
    >
      <div className="flex items-center justify-between h-full px-4">
        {!isMinimized && (
          <div className="flex-1 flex justify-center">
            <AutoAdSlot
              placement="bottom-sticky"
              className="max-w-sm"
              style={{ height: '50px' }}
            />
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleMinimize}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={isMinimized ? "Expand ad" : "Minimize ad"}
          >
            <div className={`w-4 h-0.5 bg-current transition-transform ${
              isMinimized ? 'rotate-90' : 'rotate-0'
            }`} />
          </button>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export { BottomStickyAd };