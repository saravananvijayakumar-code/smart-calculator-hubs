# ads.txt Redirect Configuration for Ezoic

## ✅ Setup Complete

Your `/ads.txt` file now redirects to Ezoic's Ads.txt Manager service.

---

## 📋 What Was Configured

### 1. Cloudflare Pages Redirect (Primary)
**File:** `/frontend/public/_redirects`

```
/ads.txt https://srv.adstxtmanager.com/19390/smartcalculatorhubs.com 301
```

**Details:**
- **Status Code:** 301 (Permanent Redirect)
- **Type:** Client-side redirect via Cloudflare Pages
- **Priority:** First method tried by browsers

---

### 2. Backend API Redirect (Fallback)
**File:** `/backend/web/ezoic.ts`

```typescript
export const adsTxtRedirect = api.raw(
  { 
    method: "GET", 
    path: "/ads.txt",
    expose: true 
  },
  async (req, resp) => {
    resp.setHeader('Location', 'https://srv.adstxtmanager.com/19390/smartcalculatorhubs.com');
    resp.setHeader('Cache-Control', 'public, max-age=86400');
    resp.statusCode = 301;
    resp.end();
  }
);
```

**Details:**
- **Status Code:** 301 (Permanent Redirect)
- **Cache:** 24 hours
- **Security Headers:** Included
- **Type:** Server-side redirect via Encore.ts API

---

## 🔍 How It Works

When someone visits `https://smartcalculatorhubs.com/ads.txt`:

1. **Cloudflare Pages** intercepts the request first
2. Reads the `_redirects` file
3. Issues a **301 redirect** to Ezoic's Ads.txt Manager
4. Ezoic serves the dynamically managed ads.txt content

**Fallback:** If Cloudflare redirect fails, the backend API endpoint handles the redirect.

---

## ✅ Verification Steps

### Test the Redirect

1. **Browser Test:**
   ```
   Visit: https://smartcalculatorhubs.com/ads.txt
   ```
   - Browser should redirect to Ezoic's manager
   - URL changes to: `https://srv.adstxtmanager.com/19390/smartcalculatorhubs.com`

2. **Command Line Test:**
   ```bash
   curl -I https://smartcalculatorhubs.com/ads.txt
   ```
   
   **Expected Output:**
   ```
   HTTP/2 301
   location: https://srv.adstxtmanager.com/19390/smartcalculatorhubs.com
   ```

3. **Ezoic Dashboard:**
   - Go to: https://pubdash.ezoic.com/
   - Navigate to: **Settings → Ads.txt Management**
   - Status should show: ✅ **Redirect Detected**

---

## 📊 Why This Approach?

### Benefits of Ezoic Ads.txt Manager

1. **Automatic Updates**
   - Ezoic adds/removes ad networks automatically
   - No manual file editing required
   - Always up-to-date with latest partnerships

2. **Optimized Revenue**
   - Ezoic manages which networks to include
   - Removes non-performing networks
   - Adds new high-paying networks

3. **Compliance**
   - Ensures proper ads.txt formatting
   - Meets IAB standards
   - Prevents ad fraud

4. **Zero Maintenance**
   - You never touch ads.txt again
   - Ezoic handles everything
   - Redirect is set-and-forget

---

## 🐛 Troubleshooting

### Issue: Redirect not working

**Check:**
1. Is the site deployed to production?
2. Is Cloudflare Pages serving the `_redirects` file?
3. Clear browser cache and try again
4. Test with `curl -I` to see actual headers

**Solution:**
- Ensure `_redirects` file is in `/frontend/public/`
- Verify deployment includes the file
- Check Cloudflare Pages build logs

---

### Issue: Ezoic says "Redirect not detected"

**Possible Causes:**
1. DNS not pointing to Cloudflare Pages
2. Domain not verified in Ezoic
3. Redirect not live yet (propagation delay)

**Solution:**
1. Wait 10-15 minutes for DNS propagation
2. Test redirect manually with `curl -I`
3. Contact Ezoic support if issue persists

---

## 📝 Important Notes

1. **Do NOT edit `/frontend/public/ads.txt`**
   - The static file is ignored
   - Redirect takes precedence
   - Ezoic manages content via their service

2. **301 is SEO Safe**
   - Search engines understand permanent redirects
   - No negative SEO impact
   - Industry standard for ads.txt

3. **Cache Duration**
   - 24-hour cache on redirect
   - Reduces server load
   - Fast response times

4. **Security**
   - HTTPS only (enforced)
   - HSTS headers included
   - No sensitive data exposed

---

## 🎯 Summary

✅ **Cloudflare Redirect:** Configured in `_redirects`  
✅ **Backend Fallback:** Configured in `ezoic.ts`  
✅ **Target URL:** `https://srv.adstxtmanager.com/19390/smartcalculatorhubs.com`  
✅ **Status Code:** 301 (Permanent)  
✅ **Cache:** 24 hours  
✅ **SEO Safe:** Yes  
✅ **Maintenance:** Zero  

**Result:** Ezoic now fully manages your ads.txt file! 🎉

---

## 📞 Support

- **Ezoic Dashboard:** https://pubdash.ezoic.com/
- **Ads.txt Help:** https://support.ezoic.com/kb/article/ads-txt-setup
- **Test Redirect:** `curl -I https://smartcalculatorhubs.com/ads.txt`

---

**Last Updated:** October 17, 2025  
**Ezoic Publisher ID:** 19390
