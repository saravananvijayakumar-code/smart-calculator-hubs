import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const siteURL = secret("SiteURL");

function getBaseURL(): string {
  try {
    const url = siteURL();
    if (url.includes('www.smartcalculatorhubs.com')) {
      return url.replace('www.smartcalculatorhubs.com', 'smartcalculatorhubs.com');
    }
    return url;
  } catch {
    return "https://smartcalculatorhubs.com";
  }
}

export const robots = api.raw(
  { 
    method: "GET", 
    path: "/robots.txt",
    expose: true 
  },
  async (req, resp) => {
    const baseURL = getBaseURL();
    
    const robotsTxt = `User-agent: *
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

Sitemap: ${baseURL}/sitemap.xml`;

    resp.setHeader('Content-Type', 'text/plain; charset=utf-8');
    resp.setHeader('Cache-Control', 'public, max-age=86400');
    resp.statusCode = 200;
    resp.end(robotsTxt);
  }
);
