# AdSense Verification Setup Guide

## ✅ Completed Configuration

Your AdSense setup is now correctly configured with the following components:

### 1. **Verification Meta Tag** ✓
Located in `frontend/index.html` (line 21):
```html
<meta name="google-adsense-account" content="ca-pub-7271075626732183">
```

### 2. **AdSense Script** ✓
Located in `frontend/index.html` (line 4):
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7271075626732183" crossorigin="anonymous"></script>
```

### 3. **ads.txt File** ✓
**Served via two methods for maximum compatibility:**

**Method A: Backend API Endpoint**
- Path: `backend/web/redirects.ts`
- Endpoint: `/ads.txt`
- Content: `google.com, pub-7271075626732183, DIRECT, f08c47fec0942fa0`
- This ensures the file is served correctly even with SPA routing

**Method B: Static File**
- Path: `frontend/public/ads.txt`
- Content: `google.com, pub-7271075626732183, DIRECT, f08c47fec0942fa0`
- Served directly from the public directory

### 4. **Verification Page** ✓
**Served via two methods:**

**Method A: Backend API Endpoint**
- Path: `backend/web/redirects.ts`
- Endpoint: `/adsense-verification.html`

**Method B: Static File**
- Path: `frontend/public/adsense-verification.html`

### 5. **Publisher ID File** ✓
- Path: `frontend/public/ads-ca-pub-7271075626732183.txt`
- Content: `ca-pub-7271075626732183`

## 🔍 Verification Steps

### Test Your Setup:

1. **Check ads.txt**
   ```bash
   curl https://smartcalculatorhubs.com/ads.txt
   ```
   Should return: `google.com, pub-7271075626732183, DIRECT, f08c47fec0942fa0`

2. **Check Verification Page**
   ```bash
   curl https://smartcalculatorhubs.com/adsense-verification.html
   ```
   Should return HTML with the verification meta tag

3. **Check Main Page**
   Visit: `https://smartcalculatorhubs.com`
   View page source and confirm the meta tag is present in `<head>`

### In Google AdSense Dashboard:

1. Navigate to **Sites** in AdSense
2. Click **Add site**
3. Enter: `smartcalculatorhubs.com`
4. AdSense will auto-detect the verification code from your homepage
5. Click **Request review**

## 🚀 Deployment Checklist

- [x] Verification meta tag in `<head>`
- [x] AdSense script loaded
- [x] ads.txt served at root (both methods)
- [x] Verification HTML page available (both methods)
- [x] Publisher ID file present
- [x] Security headers configured (CSP includes AdSense domains)
- [x] Build configuration updated to preserve static files

## 📋 Important Notes

### Why Two Methods?

We're serving `ads.txt` and `adsense-verification.html` via both:
1. **Backend API endpoints** - Guarantees these files bypass SPA routing
2. **Static files** - Standard web hosting practice

This dual approach ensures maximum compatibility regardless of hosting configuration.

### Vite Configuration

The `vite.config.ts` has been updated to:
- Preserve `.txt` and `.html` files without hashing
- Copy public directory contents to build output
- Ensure all static files are properly served

### CSP Headers

Content Security Policy headers in `backend/web/redirects.ts` include all necessary AdSense domains:
- `pagead2.googlesyndication.com`
- `partner.googleadservices.com`
- `googleads.g.doubleclick.net`
- `securepubads.g.doubleclick.net`

## 🔧 Troubleshooting

### If ads.txt returns your SPA instead of text:

The backend endpoint at `/ads.txt` should handle this, but if you need to verify:

```bash
# Should return plain text, not HTML
curl -I https://smartcalculatorhubs.com/ads.txt
# Content-Type should be: text/plain; charset=utf-8
```

### If AdSense can't find the code:

1. Clear your browser cache
2. Wait 24-48 hours (DNS/CDN propagation)
3. Check that the homepage loads without errors
4. Verify the meta tag is in the actual rendered HTML (not just the template)

### Verification Failing:

- Ensure your domain is fully propagated
- Check for HTTPS (AdSense requires HTTPS)
- Verify no robots.txt blocks AdSense crawlers
- Ensure the homepage is accessible and not behind authentication

## 📞 Next Steps

1. **Submit for Review** in AdSense Dashboard
2. **Wait 1-3 days** for Google to verify
3. **Add Ad Units** once approved
4. Use the existing ad components in `frontend/components/ads/`

## 🎯 Ad Integration

Once approved, your existing ad components are ready:
- `AutoAdSlot.tsx` - Auto ads
- `TopBannerAd.tsx` - Header banners
- `SidebarAd.tsx` - Sidebar ads
- `InFeedAd.tsx` - In-feed ads
- `MidContentAd.tsx` - Content ads
- `BottomStickyAd.tsx` - Sticky bottom ads

All components already use your publisher ID: `ca-pub-7271075626732183`
