# 🚀 Ezoic Ads - Quick Start Guide

## ✅ Integration Status: COMPLETE

**All AdSense references removed. Ezoic Ads fully integrated.**

---

## 📋 Post-Deployment Steps (Manual)

### 1. Add Domain to Ezoic
- Go to: https://pubdash.ezoic.com/
- Add domain: `smartcalculatorhubs.com`
- Complete domain verification

### 2. Verify ads.txt Redirect
**Automatic - No manual action needed!**

✅ **Already configured:**
- `/ads.txt` redirects to Ezoic Ads.txt Manager
- Ezoic manages your ads.txt automatically
- URL: `https://srv.adstxtmanager.com/19390/smartcalculatorhubs.com`

**Verify it works:**
1. Visit: `https://smartcalculatorhubs.com/ads.txt`
2. Should redirect to Ezoic's manager
3. Check in Ezoic dashboard: Settings → Ads.txt Management

### 3. Verify Integration
- Visit any calculator page
- Open browser console
- Look for: `✅ Ezoic integrated successfully`
- Check: `window.ezstandalone` should be defined

### 4. Admin Dashboard
- URL: `/admin/ads`
- View all ad placements
- Toggle ads ON/OFF
- Check script loading status

---

## 🎯 Key Files

### Configuration
- `/frontend/config/ezoic.ts` - Main config
- `/frontend/public/_redirects` - ads.txt redirect (Cloudflare)
- `/backend/web/ezoic.ts` - ads.txt redirect endpoint

### Components
- `/frontend/components/EzoicAdSlot.tsx` - Reusable ad slot
- `/frontend/components/EzoicProvider.tsx` - Provider component
- `/frontend/components/CalculatorLayoutWithAds.tsx` - Layout with 8 ads

### Admin
- `/frontend/pages/admin/EzoicAdsManager.tsx` - Management dashboard
- Route: `/admin/ads`

### HTML
- `/frontend/index.html` - Ezoic scripts loaded here

---

## 📊 Ad Placements (8 Total)

1. **ez-slot-1** - Top Banner (above content)
2. **ez-slot-2** - Mid Content 1 (after calculator)
3. **ez-slot-3** - Mid Content 2 (before tips)
4. **ez-slot-4** - Sidebar Top (desktop only)
5. **ez-slot-5** - Sidebar Mid (desktop only)
6. **ez-slot-6** - Bottom Sticky (mobile only)
7. **ez-slot-7** - In-Feed (end of content)
8. **ez-slot-8** - Footer (page bottom)

---

## 🔍 Troubleshooting

### Ads Not Showing?
1. Check `/admin/ads` for script status
2. Verify domain in Ezoic dashboard
3. Update ads.txt file
4. Clear browser cache
5. Check console for errors

### Toggle Ads OFF
1. Go to `/admin/ads`
2. Click "Disable Ads"
3. Page reloads with ads hidden

### Console Logging
```javascript
window.ezstandalone // Should return object
localStorage.getItem('ezoic_ads_disabled') // null = enabled, 'true' = disabled
```

---

## 📚 Full Documentation

See: `/EZOIC_INTEGRATION_COMPLETE.md`

---

## ⚡ Next Action

**Add your domain to Ezoic dashboard and verify ownership.**

The ads.txt redirect is already set up! 🎉
