import { api } from "encore.dev/api";

function addSecurityHeaders(resp: any) {
  // HTTPS enforcement and HSTS
  resp.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Additional security headers
  resp.setHeader('X-Frame-Options', 'SAMEORIGIN');
  resp.setHeader('X-Content-Type-Options', 'nosniff');
  resp.setHeader('X-XSS-Protection', '1; mode=block');
  resp.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

// DEPRECATED: AdSense endpoints - replaced by Ezoic
// Kept for backward compatibility with old verification pages

// Serves AdSense verification HTML page
export const adsenseVerificationHtml = api.raw(
  { 
    method: "GET", 
    path: "/adsense-verification",
    expose: true 
  },
  async (req, resp) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AdSense Verification - Smart Calculator Hubs</title>
    <meta name="google-adsense-account" content="ca-pub-7271075626732183">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7271075626732183"
         crossorigin="anonymous"></script>
</head>
<body>
    <h1>AdSense Verification Page</h1>
    <p>This page contains the Google AdSense verification code for Smart Calculator Hubs.</p>
    <p>Publisher ID: ca-pub-7271075626732183</p>
    
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-7271075626732183",
              enable_page_level_ads: true
         });
    </script>
</body>
</html>`;

    resp.setHeader('Content-Type', 'text/html; charset=utf-8');
    resp.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    addSecurityHeaders(resp);
    resp.statusCode = 200;
    resp.end(htmlContent);
  }
);

// Serves a minimal HTML page with just the AdSense script for verification
export const adsenseScript = api.raw(
  { 
    method: "GET", 
    path: "/ads-verification.html",
    expose: true 
  },
  async (req, resp) => {
    const htmlContent = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7271075626732183" crossorigin="anonymous"></script>`;

    resp.setHeader('Content-Type', 'text/html; charset=utf-8');
    resp.setHeader('Cache-Control', 'public, max-age=86400');
    addSecurityHeaders(resp);
    resp.statusCode = 200;
    resp.end(htmlContent);
  }
);

export const adsPubTxt = api.raw(
  { 
    method: "GET", 
    path: "/ads-ca-pub-7271075626732183.txt",
    expose: true 
  },
  async (req, resp) => {
    const adsContent = `google.com, pub-7271075626732183, DIRECT, f08c47fec0942fa0`;

    resp.setHeader('Content-Type', 'text/plain; charset=utf-8');
    resp.setHeader('Cache-Control', 'public, max-age=86400');
    addSecurityHeaders(resp);
    resp.statusCode = 200;
    resp.end(adsContent);
  }
);

export const adsenseVerificationHtmlAlt = api.raw(
  { 
    method: "GET", 
    path: "/adsense-verification.html",
    expose: true 
  },
  async (req, resp) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AdSense Verification - Smart Calculator Hubs</title>
    <meta name="google-adsense-account" content="ca-pub-7271075626732183">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7271075626732183"
         crossorigin="anonymous"></script>
</head>
<body>
    <h1>AdSense Verification Page</h1>
    <p>This page contains the Google AdSense verification code for Smart Calculator Hubs.</p>
    <p>Publisher ID: ca-pub-7271075626732183</p>
    
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-7271075626732183",
              enable_page_level_ads: true
         });
    </script>
</body>
</html>`;

    resp.setHeader('Content-Type', 'text/html; charset=utf-8');
    resp.setHeader('Cache-Control', 'public, max-age=3600');
    addSecurityHeaders(resp);
    resp.statusCode = 200;
    resp.end(htmlContent);
  }
);
