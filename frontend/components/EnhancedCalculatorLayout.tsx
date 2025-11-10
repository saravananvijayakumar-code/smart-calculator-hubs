import { ReactNode } from 'react';
import { ArrowLeft, Share2 as Share, BookOpen, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from './SEOHead';
import { Breadcrumbs } from './Breadcrumbs';
import { RelatedCalculators } from './RelatedCalculators';
import { AppleStyleCard, AppleStyleCardHeader } from './AppleStyleCard';
import { AppleStyleButton } from './AppleStyleButton';
import { AdsterraSlot } from './ads/AdsterraSlot';

interface EnhancedCalculatorLayoutProps {
  id: string;
  title: string;
  description: string;
  category: string;
  region?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
  children: ReactNode;
  results?: ReactNode;
  explanation?: ReactNode;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  formula?: string;
  examples?: ReactNode;
}

export function EnhancedCalculatorLayout({
  id,
  title,
  description,
  category,
  region,
  seoTitle,
  seoDescription,
  keywords,
  children,
  results,
  explanation,
  faqs,
  formula,
  examples
}: EnhancedCalculatorLayoutProps) {
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: seoTitle || title,
          text: seoDescription || description,
          url: window.location.href,
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const faqStructuredData = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const calculatorStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "description": seoDescription || description,
    "url": window.location.href,
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
    },
    "publisher": {
      "@type": "Organization",
      "name": "Smart Calculator Hubs",
      "url": "https://www.smartcalculatorhubs.com"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle || `${title} | Smart Calculator Hub`}
        description={seoDescription || description}
        keywords={keywords || `${title.toLowerCase()}, calculator, ${category}, ${region || 'global'}`}
        type="website"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(calculatorStructuredData)
        }}
      />
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData)
          }}
        />
      )}

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Breadcrumbs />
          </div>
          <AppleStyleButton
            variant="outline"
            size="sm"
            onClick={handleShare}
            icon={<Share className="w-4 h-4" />}
          >
            Share
          </AppleStyleButton>
        </div>

        <div className="mb-6">
          <AdsterraSlot />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <AppleStyleCard variant="elevated" padding="lg">
              <AppleStyleCardHeader 
                title="Calculator" 
                subtitle="Enter your details below to get instant results"
              />
              {children}
            </AppleStyleCard>
          </div>

          <div className="space-y-6">
            {results && (
              <AppleStyleCard variant="elevated" padding="lg">
                <AppleStyleCardHeader title="Results" />
                {results}
              </AppleStyleCard>
            )}

            <AppleStyleCard padding="lg">
              <AppleStyleCardHeader title="About This Calculator" />
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-4 h-4 mt-0.5 text-primary" />
                  <p>Free and easy to use calculator designed for accuracy and reliability.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <HelpCircle className="w-4 h-4 mt-0.5 text-primary" />
                  <p>No registration required. Your data is processed locally for privacy.</p>
                </div>
              </div>
            </AppleStyleCard>
          </div>
        </div>

        {explanation && (
          <AppleStyleCard className="mb-12" padding="lg">
            <AppleStyleCardHeader 
              title="How It Works" 
              subtitle="Understanding the calculations and methodology"
            />
            <div className="prose max-w-none dark:prose-invert">
              {explanation}
            </div>
          </AppleStyleCard>
        )}

        <div className="mb-12">
          <AdsterraSlot />
        </div>

        {formula && (
          <AppleStyleCard className="mb-12" padding="lg">
            <AppleStyleCardHeader 
              title="Formula Used" 
              subtitle="Mathematical formula behind the calculations"
            />
            <div className="bg-accent/50 rounded-xl p-6 font-mono text-sm">
              {formula}
            </div>
          </AppleStyleCard>
        )}

        {examples && (
          <AppleStyleCard className="mb-12" padding="lg">
            <AppleStyleCardHeader 
              title="Examples" 
              subtitle="Real-world examples to help you understand"
            />
            <div className="prose max-w-none dark:prose-invert">
              {examples}
            </div>
          </AppleStyleCard>
        )}

        {faqs && faqs.length > 0 && (
          <AppleStyleCard className="mb-12" padding="lg">
            <AppleStyleCardHeader 
              title="Frequently Asked Questions" 
              subtitle="Common questions and helpful answers"
            />
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-border last:border-0 pb-6 last:pb-0">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <div className="text-muted-foreground prose prose-sm max-w-none dark:prose-invert">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </AppleStyleCard>
        )}

        <div className="mb-12">
          <AdsterraSlot />
        </div>

        <RelatedCalculators currentCalculatorId={id} limit={4} />
      </div>
    </div>
  );
}
