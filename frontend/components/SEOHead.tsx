import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  type?: 'website' | 'article';
  image?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  children?: React.ReactNode;
}

const DEFAULT_TITLE = 'Smart Calculator Hubs - Free Online Calculators';
const DEFAULT_DESCRIPTION = 'Free online calculators for finance, health, math, and utilities. Calculate mortgages, BMI, percentages, tips, and more with our easy-to-use tools.';
const DEFAULT_KEYWORDS = 'calculator, mortgage calculator, BMI calculator, percentage calculator, financial calculator, online calculator, free calculator';
const SITE_URL = 'https://smartcalculatorhubs.com';

export const SEOHead = ({ 
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  type = 'website',
  image = '/og-image.jpg',
  author,
  publishedTime,
  modifiedTime,
  children
}: SEOHeadProps) => {
  const location = useLocation();
  const currentUrl = `${SITE_URL}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1');
    
    // Google AdSense verification - Multiple verification methods
    updateMetaTag('google-adsense-account', 'ca-pub-7271075626732183');
    updateMetaTag('google-site-verification', 'ca-pub-7271075626732183');
    updateMetaTag('adsbygoogle-site-verification', 'ca-pub-7271075626732183');

    // Google AdSense script
    let adsenseScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
    if (!adsenseScript) {
      adsenseScript = document.createElement('script');
      adsenseScript.setAttribute('async', '');
      adsenseScript.setAttribute('src', 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7271075626732183');
      adsenseScript.setAttribute('crossorigin', 'anonymous');
      document.head.appendChild(adsenseScript);
    }

    // PWA meta tags
    updateMetaTag('theme-color', '#2563eb');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaTag('apple-mobile-web-app-title', 'Calculator Hub');
    updateMetaTag('application-name', 'Calculator Hub');
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('msapplication-TileColor', '#2563eb');
    updateMetaTag('msapplication-tap-highlight', 'no');

    // Add manifest link
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.setAttribute('rel', 'manifest');
      document.head.appendChild(manifestLink);
    }
    manifestLink.setAttribute('href', '/manifest.json');

    // Apple touch icons
    const addAppleTouchIcon = (size: string, href: string) => {
      let link = document.querySelector(`link[rel="apple-touch-icon"][sizes="${size}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'apple-touch-icon');
        link.setAttribute('sizes', size);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    addAppleTouchIcon('152x152', '/icons/icon-152x152.png');
    addAppleTouchIcon('180x180', '/icons/icon-192x192.png');

    // Favicon
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      document.head.appendChild(favicon);
    }
    favicon.setAttribute('href', '/icons/icon-96x96.png');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', `${SITE_URL}${image}`, true);
    updateMetaTag('og:site_name', 'Smart Calculator Hub', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `${SITE_URL}${image}`);

    // Article specific tags
    if (type === 'article') {
      if (author) updateMetaTag('article:author', author, true);
      if (publishedTime) updateMetaTag('article:published_time', publishedTime, true);
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, true);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // JSON-LD structured data
    const generateStructuredData = () => {
      const baseData = {
        "@context": "https://schema.org",
        "@type": type === 'article' ? 'Article' : 'WebSite',
        "name": title,
        "description": description,
        "url": currentUrl,
        "image": `${SITE_URL}${image}`,
        "publisher": {
          "@type": "Organization",
          "name": "Smart Calculator Hub",
          "url": SITE_URL
        }
      };

      if (type === 'website' && location.pathname.includes('/calculator/')) {
        return {
          ...baseData,
          "@type": "SoftwareApplication",
          "applicationCategory": "CalculatorApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "2547"
          }
        };
      }

      if (type === 'article') {
        return {
          ...baseData,
          "author": {
            "@type": "Person",
            "name": author || "Smart Calculator Hub Team"
          },
          "datePublished": publishedTime,
          "dateModified": modifiedTime || publishedTime,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl
          }
        };
      }

      return baseData;
    };

    // Remove existing structured data (only default ones)
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach((script) => {
      const content = script.textContent;
      if (content && !content.includes('"@graph"')) {
        script.remove();
      }
    });

    // Add new structured data (if not using children)
    if (!children) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(generateStructuredData());
      document.head.appendChild(script);
    }

  }, [title, description, keywords, type, image, author, publishedTime, modifiedTime, currentUrl, location.pathname, children]);

  useEffect(() => {
    if (children) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = (children as any).props?.children || '';
      const script = tempDiv.querySelector('script[type="application/ld+json"]');
      if (script) {
        const newScript = document.createElement('script');
        newScript.type = 'application/ld+json';
        newScript.textContent = script.textContent;
        document.head.appendChild(newScript);

        return () => {
          newScript.remove();
        };
      }
    }
  }, [children]);

  return null;
};