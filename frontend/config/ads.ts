// Google AdSense Configuration - Strategic placement for optimal revenue
export const ADS_CONFIG = {
  // Your Google AdSense client ID (starts with 'ca-pub-')
  CLIENT_ID: 'ca-pub-7271075626732183',
  
  // Strategic ad slots for different placement positions
  AD_SLOTS: {
    // Top banner - high visibility
    TOP_BANNER: '1234567890',
    
    // Mid-content - high engagement 
    MID_CONTENT: '2345678901',
    
    // Sidebar - desktop users
    SIDEBAR: '3456789012',
    
    // Bottom sticky - mobile friendly
    BOTTOM_STICKY: '4567890123',
    
    // In-feed - blog and list pages
    IN_FEED: '5678901234',
    
    // Rectangle - multipurpose
    RECTANGLE: '6789012345',
  },
  
  // Auto Ads settings - Disabled
  AUTO_ADS: {
    ENABLED: false,           // Disable auto ads
    ANCHOR_ADS: false,        // Disable anchor ads
    SIDEBAR_ADS: false,       // Disable sidebar auto ads
    IN_ARTICLE: false,        // Disable in-article auto ads
    MATCHED_CONTENT: false,   // Disable for blog pages
  },
  
  // Placement rules for better user experience
  PLACEMENT_RULES: {
    MIN_CONTENT_HEIGHT: 400,  // Minimum content height before showing ads
    SCROLL_PERCENTAGE: 25,    // Show sticky ads after 25% scroll
    DELAY_SECONDS: 2,         // Delay for bottom sticky ads
  }
};

// Helper function to check if ads should be displayed
export const shouldShowAds = (): boolean => {
  // Add any conditions here (e.g., user preferences, subscription status)
  return true;
};