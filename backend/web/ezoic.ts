import { api } from "encore.dev/api";

function addSecurityHeaders(resp: any) {
  resp.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  resp.setHeader('X-Frame-Options', 'SAMEORIGIN');
  resp.setHeader('X-Content-Type-Options', 'nosniff');
  resp.setHeader('X-XSS-Protection', '1; mode=block');
  resp.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

// Redirects ads.txt to Ezoic Ads.txt Manager
export const adsTxtRedirect = api.raw(
  { 
    method: "GET", 
    path: "/ads.txt",
    expose: true 
  },
  async (req, resp) => {
    // 301 Permanent Redirect to Ezoic Ads.txt Manager
    resp.setHeader('Location', 'https://srv.adstxtmanager.com/19390/smartcalculatorhubs.com');
    resp.setHeader('Cache-Control', 'public, max-age=86400');
    addSecurityHeaders(resp);
    resp.statusCode = 301;
    resp.end();
  }
);
