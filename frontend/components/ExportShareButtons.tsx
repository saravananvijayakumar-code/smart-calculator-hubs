// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { 
  Share2, 
  Download, 
  FileText, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Link, 
  Loader2,
  CheckCircle,
  MessageCircle,
  Mail,
  Copy
} from 'lucide-react';

interface ExportShareButtonsProps {
  calculatorType: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  analysis?: any;
  title?: string;
  className?: string;
}

export default function ExportShareButtons({
  calculatorType,
  inputs,
  results,
  analysis,
  title,
  className = ""
}: ExportShareButtonsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const formatCalculatorType = (type: string): string => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const calculatorTitle = title || formatCalculatorType(calculatorType);

  const getKeyResult = (): string => {
    if (calculatorType.includes('mortgage')) {
      return results.monthlyPayment ? `$${results.monthlyPayment}/month` : '';
    }
    if (calculatorType.includes('loan')) {
      return results.monthlyPayment ? `$${results.monthlyPayment}/month` : '';
    }
    if (calculatorType.includes('investment') || calculatorType.includes('retirement')) {
      return results.finalAmount ? `$${results.finalAmount.toLocaleString()} projected` : '';
    }
    if (calculatorType === 'bmi') {
      return results.bmi ? `BMI: ${results.bmi}` : '';
    }
    if (calculatorType === 'income-tax-australia') {
      const effectiveRate = results.effectiveTaxRate ? `${results.effectiveTaxRate.toFixed(1)}%` : '';
      const netIncome = results.netIncome ? `$${Math.round(results.netIncome).toLocaleString()} net` : '';
      return effectiveRate && netIncome ? `${effectiveRate} effective rate, ${netIncome}` : '';
    }
    if (calculatorType.includes('tax')) {
      return results.totalTax ? `$${Math.round(results.totalTax).toLocaleString()} tax` : '';
    }
    if (calculatorType.includes('superannuation') || calculatorType.includes('super')) {
      return results.finalBalance ? `$${Math.round(results.finalBalance).toLocaleString()} at retirement` : '';
    }
    if (calculatorType.includes('cgt')) {
      return results.cgtLiability ? `$${Math.round(results.cgtLiability).toLocaleString()} CGT` : '';
    }
    return '';
  };

  const getHashtags = (): string[] => {
    const baseHashtags = ['SmartCalculator', 'FinancialPlanning'];
    
    if (calculatorType.includes('tax')) {
      return [...baseHashtags, 'Tax', 'TaxPlanning'];
    }
    if (calculatorType.includes('mortgage') || calculatorType.includes('loan')) {
      return [...baseHashtags, 'Mortgage', 'HomeLoan', 'Finance'];
    }
    if (calculatorType.includes('investment') || calculatorType.includes('retirement')) {
      return [...baseHashtags, 'Investment', 'Retirement', 'WealthBuilding'];
    }
    if (calculatorType.includes('health') || calculatorType.includes('bmi') || calculatorType.includes('bmr')) {
      return ['Health', 'Fitness', 'Wellness', 'HealthCalculator'];
    }
    if (calculatorType.includes('insurance')) {
      return [...baseHashtags, 'Insurance', 'Protection'];
    }
    
    return baseHashtags;
  };

  const generateShareText = (): string => {
    const calculatorName = formatCalculatorType(calculatorType);
    const keyResult = getKeyResult();
    
    return `I just calculated my ${calculatorName.toLowerCase()}${keyResult ? `: ${keyResult}` : ''}. Check out this calculator!`;
  };

  const generateDetailedShareText = (): string => {
    const calculatorName = formatCalculatorType(calculatorType);
    const keyResult = getKeyResult();
    const hashtagString = getHashtags().map(tag => `#${tag}`).join(' ');
    
    return `📊 ${calculatorName}\n\n${keyResult ? `Results: ${keyResult}\n\n` : ''}Try it yourself: ${currentUrl}\n\n${hashtagString}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: calculatorTitle,
          text: generateShareText(),
          url: currentUrl,
        });
        toast({
          title: "Shared Successfully!",
          description: "Thanks for sharing!",
        });
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Native share failed:', error);
        }
      }
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyResultsText = async () => {
    try {
      const resultsText = generateDetailedShareText();
      await navigator.clipboard.writeText(resultsText);
      toast({
        title: "Results Copied!",
        description: "Results have been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy results. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareOnSocial = (platform: 'twitter' | 'linkedin' | 'facebook' | 'whatsapp' | 'telegram' | 'email') => {
    const summary = generateShareText();
    const detailedText = generateDetailedShareText();
    const text = encodeURIComponent(summary);
    const detailedTextEncoded = encodeURIComponent(detailedText);
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(calculatorTitle);
    const hashtags = getHashtags();

    let shareUrlTemplate = '';
    switch (platform) {
      case 'twitter':
        shareUrlTemplate = `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}&hashtags=${hashtags.join(',')}`;
        break;
      case 'linkedin':
        shareUrlTemplate = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrlTemplate = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${text}`;
        break;
      case 'whatsapp':
        shareUrlTemplate = `https://wa.me/?text=${detailedTextEncoded}`;
        break;
      case 'telegram':
        shareUrlTemplate = `https://t.me/share/url?url=${encodedUrl}&text=${text}`;
        break;
      case 'email':
        shareUrlTemplate = `mailto:?subject=${encodedTitle}&body=${detailedTextEncoded}`;
        break;
    }

    window.open(shareUrlTemplate, '_blank', 'width=600,height=400');
    
    toast({
      title: "Opening Share Dialog",
      description: `Sharing your results on ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`,
    });
  };

  const handlePDFExport = async () => {
    setIsGeneratingPDF(true);
    try {
      const resultsText = `${calculatorTitle}\n\n` +
        `Date: ${new Date().toLocaleDateString()}\n\n` +
        `Results:\n${JSON.stringify(results, null, 2)}\n\n` +
        `Inputs:\n${JSON.stringify(inputs, null, 2)}\n\n` +
        (analysis ? `Analysis:\n${JSON.stringify(analysis, null, 2)}\n\n` : '') +
        `URL: ${currentUrl}`;

      const blob = new Blob([resultsText], { type: 'text/plain' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${calculatorType}-results-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Download Complete!",
        description: "Your results have been downloaded.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <Card className={`bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 border-slate-200 dark:border-slate-700 ${className}`}>
      <CardContent className="py-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {canNativeShare && (
            <Button 
              onClick={handleNativeShare}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          )}

          {!canNativeShare && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onSelect={copyShareLink}>
                  <Link className="h-4 w-4 mr-2" />
                  {copied ? 'Link Copied!' : 'Copy Share Link'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={copyResultsText}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Results Text
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => shareOnSocial('twitter')}>
                  <Twitter className="h-4 w-4 mr-2" />
                  Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => shareOnSocial('facebook')}>
                  <Facebook className="h-4 w-4 mr-2" />
                  Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => shareOnSocial('linkedin')}>
                  <Linkedin className="h-4 w-4 mr-2" />
                  Share on LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => shareOnSocial('whatsapp')}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Share on WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => shareOnSocial('telegram')}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Share on Telegram
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => shareOnSocial('email')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Share via Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button 
            onClick={handlePDFExport}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            {isGeneratingPDF ? 'Generating...' : 'Download Report'}
          </Button>
        </div>

        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 text-center">
          Share your calculations with friends or save them for future reference
        </div>
      </CardContent>
    </Card>
  );
}
