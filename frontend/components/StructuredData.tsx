import { useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface StructuredDataProps {
  type?: 'WebApplication' | 'FAQPage' | 'BreadcrumbList';
  name?: string;
  description?: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  faqItems?: FAQItem[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  data?: any;
}

export function StructuredData({
  type = 'WebApplication',
  name,
  description,
  url,
  applicationCategory = 'Productivity',
  operatingSystem = 'Any',
  faqItems,
  breadcrumbs,
  data
}: StructuredDataProps) {
  useEffect(() => {
    const schemaId = `structured-data-${type || 'custom'}`;
    
    let existingScript = document.getElementById(schemaId);
    if (existingScript) {
      existingScript.remove();
    }

    let schemaData: any = data || {};

    if (data) {
      schemaData = data;
    } else if (type === 'WebApplication') {
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: name || 'SmartTimer',
        description: description || 'Professional timing tools for productivity',
        url: url || window.location.href,
        applicationCategory,
        operatingSystem,
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      };
    } else if (type === 'FAQPage' && faqItems && faqItems.length > 0) {
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      };
    } else if (type === 'BreadcrumbList' && breadcrumbs && breadcrumbs.length > 0) {
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url
        }))
      };
    }

    if (Object.keys(schemaData).length > 0) {
      const script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }

    return () => {
      const scriptToRemove = document.getElementById(schemaId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, name, description, url, applicationCategory, operatingSystem, faqItems, breadcrumbs]);

  return null;
}
