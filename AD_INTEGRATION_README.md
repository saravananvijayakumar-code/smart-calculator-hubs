# Ad Integration Setup Guide

## Overview
The calculator application now includes a comprehensive ad integration system with Google AdSense support. This system provides both manual ad placements and automatic ad optimization.

## Issue Resolution
✅ **Missing Calculator Routes Fixed**: Added missing routes for:
- `/tools/currency-converter` - Currency conversion with real-time exchange rates
- `/tools/forex-calculator` - Professional forex trading calculator  
- `/tools/international-mortgage` - Multi-currency mortgage calculator

## Ad Placement System

### Manual Ad Slots (3 per calculator page)

1. **Top Banner Ad** - Placed after the page title, before the calculator widget
   - Desktop: 728x90 (Leaderboard)
   - Mobile: 320x50 (Mobile Banner)
   - Location: `frontend/components/ads/TopBannerAd.tsx`

2. **Inline Ad** - Shown after the "Calculate" button, before showing results
   - Size: 300x250 (Medium Rectangle)
   - Location: `frontend/components/ads/InlineAd.tsx`

3. **Mid-Content Ad** - Placed in explanation text (after 2nd FAQ item)
   - Desktop: 336x280 (Large Rectangle)  
   - Mobile: 300x250 (Medium Rectangle)
   - Location: `frontend/components/ads/MidContentAd.tsx`

### Additional Ad Placements

4. **Desktop Sidebar Ad** - 300x600 responsive skyscraper, hidden on mobile
   - Location: `frontend/components/ads/SidebarAd.tsx`
   - Sticky positioning for better visibility

5. **Mobile Sticky Bottom Ad** - Anchor ad for maximum mobile visibility
   - Size: 320x50 (Mobile Banner)
   - Location: `frontend/components/ads/StickyBottomAd.tsx`
   - Dismissible with close button

### Google Auto Ads
✅ **Global Auto Ads Enabled** with support for:
- Sidebar ads (desktop)
- Anchor/sticky ads (mobile) 
- In-article ads
- Matched content recommendations

## Configuration

### Ad Settings (frontend/config/ads.ts)
```typescript
export const ADS_CONFIG = {
  CLIENT_ID: 'ca-pub-XXXXXXXXXXXXXXXXX', // TODO: Replace with your AdSense client ID
  AD_SLOTS: {
    TOP_BANNER: '1234567890',      // TODO: Replace with actual ad slot IDs
    INLINE: '2345678901',
    MID_CONTENT: '3456789012', 
    SIDEBAR: '4567890123',
    STICKY_BOTTOM: '5678901234',
  }
};
```

## Setup Instructions

### 1. Get Google AdSense Approval
- Apply for Google AdSense account
- Get your publisher ID (ca-pub-XXXXXXXXXXXXXXXXX)
- Create ad units for each placement type

### 2. Update Configuration
Edit `frontend/config/ads.ts`:
```typescript
// Replace placeholder values
CLIENT_ID: 'ca-pub-YOUR_ACTUAL_PUBLISHER_ID',
AD_SLOTS: {
  TOP_BANNER: 'YOUR_TOP_BANNER_SLOT_ID',
  INLINE: 'YOUR_INLINE_SLOT_ID', 
  MID_CONTENT: 'YOUR_MID_CONTENT_SLOT_ID',
  SIDEBAR: 'YOUR_SIDEBAR_SLOT_ID',
  STICKY_BOTTOM: 'YOUR_STICKY_BOTTOM_SLOT_ID',
}
```

### 3. Create AdSense Ad Units
In your Google AdSense dashboard, create ad units for:
- Display ads (responsive) for top banner, inline, and mid-content
- Fixed size 300x600 for sidebar
- Mobile banner 320x50 for sticky bottom

### 4. Enable Auto Ads (Optional)
Auto Ads are enabled by default. To customize:
```typescript
AUTO_ADS: {
  ENABLED: true,           // Enable/disable auto ads
  ANCHOR_ADS: true,        // Mobile sticky ads
  SIDEBAR_ADS: true,       // Desktop sidebar ads  
  IN_ARTICLE: true,        // In-content ads
  MATCHED_CONTENT: true,   // Related content
}
```

## Implementation Details

### New Layout Component
Created `CalculatorLayoutWithAds.tsx` that:
- Automatically includes all ad placements
- Responsive grid layout with sidebar
- Proper ad positioning and spacing
- SEO-optimized structure

### Example Implementation
Updated `MortgageCalculatorAU.tsx` to demonstrate:
- Top banner ad after title
- Inline ad after calculator results
- Mid-content ad in FAQ section
- Desktop sidebar ad
- Mobile sticky bottom ad

### Mobile Optimization
- Sticky bottom ad only shows on mobile (<768px)
- Sidebar ad hidden on mobile
- Responsive ad sizes for different screen sizes
- Dismissible mobile ads with close button

## Revenue Optimization Features

### Strategic Ad Placement
- **High-visibility areas**: After user interaction (calculation)
- **Non-intrusive**: Properly spaced to avoid user experience issues
- **Mobile-first**: Optimized for mobile traffic with sticky ads

### Auto Ads Integration
- **Smart placement**: Google's AI determines optimal ad positions
- **Anchor ads**: High-performing mobile bottom sticky ads
- **In-article ads**: Naturally integrated within content

### Performance Features
- **Lazy loading**: Ads load only when needed
- **Error handling**: Graceful fallback if AdSense fails
- **Conditional rendering**: Easy to disable ads if needed

## Testing

### Local Testing
- Ads will show placeholder areas in development
- Replace configuration with test/sandbox AdSense IDs for testing

### Production Checklist
- [ ] Update `ADS_CONFIG.CLIENT_ID` with real publisher ID
- [ ] Update all ad slot IDs in `ADS_CONFIG.AD_SLOTS`
- [ ] Test responsive behavior on different screen sizes
- [ ] Verify ad placement doesn't break calculator functionality
- [ ] Check AdSense policy compliance

## File Structure
```
frontend/
├── components/
│   └── ads/
│       ├── AdSlot.tsx           # Base ad component
│       ├── TopBannerAd.tsx      # Header banner ad
│       ├── InlineAd.tsx         # Post-calculation ad
│       ├── MidContentAd.tsx     # FAQ section ad  
│       ├── SidebarAd.tsx        # Desktop sidebar ad
│       └── StickyBottomAd.tsx   # Mobile sticky ad
├── config/
│   └── ads.ts                   # Ad configuration
└── components/
    └── CalculatorLayoutWithAds.tsx # Enhanced layout with ads
```

## Notes
- All ad components use the centralized configuration
- Easy to enable/disable individual ad types
- Responsive design maintains user experience
- AdSense policy compliant implementation
- Ready for production with minimal configuration changes