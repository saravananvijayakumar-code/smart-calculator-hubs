# Google Indexing API Integration - Setup Guide

## Overview

SmartCalculatorHubs.com now has a production-ready Google indexing automation system that:

1. **Dynamic Sitemap** - Auto-generates XML sitemap from database
2. **robots.txt API** - Serves robots.txt with sitemap reference
3. **Google Indexing API** - Submits URLs for immediate crawling
4. **Google Ping API** - Notifies Google of sitemap updates
5. **Auto-Indexing** - Automatically indexes new blog posts
6. **Admin Panel** - Test and monitor indexing operations

---

## Architecture

### Backend Services

#### 1. Google Service (`/backend/google/`)
- **encore.service.ts** - Service definition
- **types.ts** - TypeScript interfaces
- **indexing.ts** - Google Indexing API integration
- **notify.ts** - Google sitemap ping functionality

#### 2. Web Service (`/backend/web/`)
- **sitemap.ts** - Dynamic XML sitemap generation
- **robots.ts** - robots.txt endpoint

### Frontend

- **IndexingTest.tsx** - Admin panel at `/admin/indexing-test`

---

## API Endpoints

### 1. Dynamic Sitemap
**Endpoint:** `GET /sitemap.xml`

**URL:** https://smartcalculatorhubs.com/sitemap.xml

**Features:**
- Auto-lists all calculators, AI tools, blogs, and hub pages
- Includes `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`
- Dynamically fetches published blog posts from database
- Returns proper XML with correct headers

### 2. robots.txt
**Endpoint:** `GET /robots.txt`

**URL:** https://smartcalculatorhubs.com/robots.txt

**Content:**
```
User-agent: *
Allow: /

User-agent: Mediapartners-Google
Allow: /

User-agent: Adsbot-Google
Allow: /

User-agent: Google-Site-Verification
Allow: /

Allow: /ads.txt
Allow: /ads-ca-pub-7271075626732183.txt
Allow: /adsense-verification.html

Sitemap: https://smartcalculatorhubs.com/sitemap.xml
```

### 3. Index URL (Google Indexing API)
**Endpoint:** `POST /google/index-url`

**Request:**
```json
{
  "url": "https://smartcalculatorhubs.com/blog/my-article",
  "type": "URL_UPDATED"
}
```

**Response:**
```json
{
  "success": true,
  "message": "URL indexed successfully",
  "urlNotificationMetadata": { ... }
}
```

### 4. Remove URL
**Endpoint:** `POST /google/remove-url`

**Request:**
```json
{
  "url": "https://smartcalculatorhubs.com/old-page"
}
```

### 5. Batch Index
**Endpoint:** `POST /google/batch-index`

**Request:**
```json
{
  "urls": [
    "https://smartcalculatorhubs.com/page-1",
    "https://smartcalculatorhubs.com/page-2"
  ],
  "type": "URL_UPDATED"
}
```

### 6. Notify Google (Ping Sitemap)
**Endpoint:** `POST /google/notify`

**URL:** Sends GET to `https://www.google.com/ping?sitemap=https://smartcalculatorhubs.com/sitemap.xml`

**Response:**
```json
{
  "success": true,
  "message": "Successfully notified Google about sitemap update",
  "statusCode": 200
}
```

---

## Google Service Account Setup

### Prerequisites

1. **Google Cloud Project**
   - Go to https://console.cloud.google.com/
   - Create or select a project

2. **Enable Google Indexing API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Web Search Indexing API"
   - Click "Enable"

3. **Create Service Account**
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name: `smartcalculatorhub-indexing`
   - Grant role: **Owner** (or custom role with indexing permissions)
   - Click "Done"

4. **Generate JSON Key**
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Select "JSON"
   - Download the JSON file

5. **Add Service Account to Search Console**
   - Go to https://search.google.com/search-console
   - Select your property
   - Go to "Settings" → "Users and permissions"
   - Click "Add user"
   - Enter the service account email (e.g., `smartcalculatorhub-indexing@project-id.iam.gserviceaccount.com`)
   - Grant "Owner" permission

### Environment Variables

Add to Settings (Encore secrets):

1. **GoogleServiceAccountJSON**
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "smartcalculatorhub-indexing@project-id.iam.gserviceaccount.com",
     "client_id": "...",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "..."
   }
   ```
   
   **IMPORTANT:** Copy the entire JSON file content as a single-line string or formatted JSON.

2. **SiteURL** (already configured)
   ```
   https://smartcalculatorhubs.com
   ```

---

## Auto-Indexing Hooks

### Blog Post Creation
**File:** `/backend/blog/create.ts`

When a new blog post is published:
1. Calls `autoIndexUrl()` to submit URL to Google Indexing API
2. Calls `autoNotifyGoogle()` to ping sitemap
3. Both run asynchronously (non-blocking)

### Auto-Blog Generation
**File:** `/backend/auto-blog/generate_blog.ts`

When auto-blog generates and publishes a post:
1. Calls `autoIndexUrl()` with the new blog URL
2. Calls `autoNotifyGoogle()` to refresh sitemap
3. Logs success/failure to console

---

## Admin Panel Usage

### Access
**URL:** https://smartcalculatorhubs.com/admin/indexing-test

**Authentication:** Requires admin login (same credentials as admin dashboard)

### Features

1. **Index URL**
   - Enter relative path (e.g., `/blog/my-article`) or full URL
   - Submits to Google Indexing API
   - Shows success/error message

2. **Ping Google Sitemap**
   - Notifies Google to re-crawl sitemap
   - Returns HTTP status code

3. **Quick Action: Index & Notify**
   - Indexes URL + pings sitemap in one click
   - Recommended for new content

### Testing

1. Navigate to `/admin/indexing-test`
2. Enter test URL: `/blog/test-post`
3. Click "Index & Notify Google"
4. Verify success messages

---

## Verification

### 1. Check Sitemap
```bash
curl https://smartcalculatorhubs.com/sitemap.xml
```

Should return XML with all pages.

### 2. Check robots.txt
```bash
curl https://smartcalculatorhubs.com/robots.txt
```

Should show sitemap reference.

### 3. Test Indexing API
From admin panel:
- URL: `/calculator/bmi`
- Click "Index URL"
- Should see success message

### 4. Verify in Search Console
- Go to https://search.google.com/search-console
- Click "URL Inspection"
- Enter: `https://smartcalculatorhubs.com/blog/your-post`
- Should show "URL is on Google" (may take 24-48 hours)

---

## Security

1. **Service Account JSON**
   - Store in Encore secrets (never commit to Git)
   - Access restricted to backend only

2. **Admin Routes**
   - Protected with `AdminRoute` component
   - Requires authentication

3. **Rate Limiting**
   - Google Indexing API: 200 requests/minute
   - Ping API: No official limit (use sparingly)

---

## Logging

All operations are logged using the shared logger:

### Success Logs
```
[INFO] URL indexed successfully { url: "/blog/post", type: "URL_UPDATED" }
[INFO] Google ping successful { status: 200, sitemapUrl: "https://..." }
```

### Error Logs
```
[ERROR] Google Indexing API Error { status: 403, error: "Permission denied" }
[ERROR] Failed to auto-index new blog post { postId: 123, slug: "post" }
```

Check logs at: `/admin/logs`

---

## Troubleshooting

### Error: "Failed to get access token"
- Check `GoogleServiceAccountJSON` is valid JSON
- Verify service account has correct permissions
- Ensure private key is properly formatted (includes `\n` for newlines)

### Error: "Permission denied"
- Add service account to Search Console as Owner
- Verify domain ownership in Search Console
- Enable "Web Search Indexing API" in Google Cloud

### Error: "URL not eligible for indexing"
- Google only indexes certain content types
- Check URL is accessible (not blocked by robots.txt)
- Verify sitemap includes the URL

### Sitemap not updating
- Check database connection
- Verify blog posts have `published = true`
- Clear browser cache

---

## API Usage Quotas

| API | Quota | Notes |
|-----|-------|-------|
| Google Indexing API | 200 requests/day | Per project |
| Sitemap Ping | Unlimited | Don't abuse |
| Sitemap Generation | Unlimited | Cached 1 hour |

---

## Next Steps

1. **Set up Google Service Account** (see above)
2. **Add `GoogleServiceAccountJSON` to Encore secrets**
3. **Verify sitemap is accessible**
4. **Test indexing from admin panel**
5. **Monitor logs for errors**
6. **Wait 24-48 hours for Google to index**

---

## Files Modified/Created

### Backend
- ✅ `/backend/google/encore.service.ts`
- ✅ `/backend/google/types.ts`
- ✅ `/backend/google/indexing.ts`
- ✅ `/backend/google/notify.ts`
- ✅ `/backend/web/robots.ts`
- ✅ `/backend/web/sitemap.ts` (already existed, now used)
- ✅ `/backend/blog/create.ts` (added auto-indexing)
- ✅ `/backend/auto-blog/generate_blog.ts` (added auto-indexing)

### Frontend
- ✅ `/frontend/pages/admin/IndexingTest.tsx`
- ✅ `/frontend/App.tsx` (added route)

### Documentation
- ✅ `/GOOGLE_INDEXING_SETUP.md`

---

## Support

For issues or questions:
- Check `/admin/logs` for error details
- Review Google Search Console for indexing status
- Consult [Google Indexing API docs](https://developers.google.com/search/apis/indexing-api/v3/quickstart)

---

**Status:** ✅ Production Ready  
**Last Updated:** 2025-10-11
