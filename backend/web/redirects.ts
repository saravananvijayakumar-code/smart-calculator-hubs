import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const siteURL = secret("SiteURL");

function getCanonicalDomain(): string {
  try {
    const url = new URL(siteURL());
    return url.hostname;
  } catch {
    return "www.smartcalculatorhubs.com"; // fallback canonical domain
  }
}

function addSecurityHeaders(resp: any) {
  // HTTPS enforcement and HSTS
  resp.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Content Security Policy - optimized for calculator site with AdSense
  resp.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googletagmanager.com https://securepubads.g.doubleclick.net; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.google-analytics.com https://securepubads.g.doubleclick.net; " +
    "frame-src https://googleads.g.doubleclick.net https://partner.googleadservices.com https://securepubads.g.doubleclick.net; " +
    "media-src 'self' data:; " +
    "object-src 'none'; " +
    "base-uri 'self';"
  );
  
  // Additional security headers
  resp.setHeader('X-Frame-Options', 'SAMEORIGIN'); // Allow framing for ads
  resp.setHeader('X-Content-Type-Options', 'nosniff');
  resp.setHeader('X-XSS-Protection', '1; mode=block');
  resp.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  resp.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
}

// Handle www to non-www redirect (or vice versa) based on canonical domain
export const canonicalRedirect = api.raw(
  { 
    method: ["GET", "HEAD"], 
    path: "/redirect-check",
    expose: true 
  },
  async (req, resp) => {
    const host = req.headers.host || '';
    const canonicalDomain = getCanonicalDomain();
    
    // Only redirect if not on development and host doesn't match canonical
    if (host && host !== canonicalDomain && !host.includes('.lp.dev') && !host.includes('localhost')) {
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const redirectUrl = `${protocol}://${canonicalDomain}${req.url?.replace('/redirect-check', '') || '/'}`;
      
      resp.statusCode = 301;
      resp.setHeader('Location', redirectUrl);
      resp.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache redirect for 1 year
      addSecurityHeaders(resp);
      resp.end();
      return;
    }
    
    // Add security headers and return OK
    addSecurityHeaders(resp);
    resp.setHeader('Content-Type', 'application/json');
    resp.statusCode = 200;
    resp.end(JSON.stringify({ 
      status: 'ok', 
      canonical: canonicalDomain, 
      current: host 
    }));
  }
);

// Status check for domain canonicalization
export const domainStatus = api.raw(
  { 
    method: "GET", 
    path: "/domain-status",
    expose: true 
  },
  async (req, resp) => {
    const host = req.headers.host || '';
    const canonicalDomain = getCanonicalDomain();
    
    addSecurityHeaders(resp);
    resp.setHeader('Content-Type', 'application/json');
    resp.setHeader('Cache-Control', 'no-cache');
    resp.statusCode = 200;
    resp.end(JSON.stringify({ 
      status: 'ok',
      host: host,
      canonical: canonicalDomain,
      isCanonical: host === canonicalDomain,
      timestamp: new Date().toISOString()
    }));
  }
);

