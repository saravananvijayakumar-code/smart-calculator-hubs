// Ezoic Ads Configuration for Smart Calculator Hubs
// Domain: https://smartcalculatorhubs.com

export const EZOIC_CONFIG = {
  // Ezoic is DISABLED - Using Google AdSense instead
  ENABLED: false,
  
  // Ad placements for optimal revenue and UX
  PLACEMENTS: {
    TOP_BANNER: 'ez-slot-1',
    MID_CONTENT_1: 'ez-slot-2',
    MID_CONTENT_2: 'ez-slot-3',
    SIDEBAR_TOP: 'ez-slot-4',
    SIDEBAR_MID: 'ez-slot-5',
    BOTTOM_STICKY: 'ez-slot-6',
    IN_FEED: 'ez-slot-7',
    FOOTER: 'ez-slot-8',
  },
  
  // Placement rules for better UX
  RULES: {
    MIN_CONTENT_HEIGHT: 400,
    SCROLL_PERCENTAGE: 25,
    DELAY_SECONDS: 1,
  }
};

// Helper function to check if Ezoic ads should be displayed
export const shouldShowEzoicAds = (): boolean => {
  // Ezoic is disabled - using Google AdSense
  return false;
};

// Type declaration for Ezoic
declare global {
  interface Window {
    ezstandalone?: {
      cmd: Array<() => void>;
      define?: (slotId: string, placementId: string) => void;
      display?: (slotId: string) => void;
      refresh?: () => void;
    };
  }
}
