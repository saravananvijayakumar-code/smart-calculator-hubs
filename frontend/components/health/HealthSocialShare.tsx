import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Twitter, Link2, MessageCircle, Mail, Download, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface HealthSocialShareProps {
  title: string;
  resultText: string;
  hashtags?: string[];
  category?: string;
}

export default function HealthSocialShare({ 
  title, 
  resultText, 
  hashtags = ['health', 'fitness', 'wellness'],
  category = 'health'
}: HealthSocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const { toast } = useToast();
  const url = typeof window !== 'undefined' ? window.location.href : '';
  
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(resultText);
  const encodedTitle = encodeURIComponent(title);
  const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
  const encodedHashtags = encodeURIComponent(hashtagString);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      const shareData = { title, text: resultText, url };
      if ('canShare' in navigator && typeof navigator.canShare === 'function') {
        setCanShare(navigator.canShare(shareData));
      } else {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setCanShare(isMobile);
      }
    }
  }, [title, resultText, url]);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${hashtags.join(',')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: resultText,
          url: url,
        });
        toast({ 
          title: '✅ Shared successfully!',
          description: 'Thanks for spreading health knowledge!'
        });
      } catch (error: any) {
        if (error.name === 'AbortError') {
          return;
        }
        
        if (error.name === 'NotAllowedError') {
          console.error('Share not allowed:', error);
          toast({ 
            title: '⚠️ Sharing not available',
            description: 'Use the "Copy Link" button below to share manually.',
            variant: 'destructive'
          });
          return;
        }
        
        console.error('Error sharing:', error);
        toast({ 
          title: '⚠️ Share failed',
          description: 'Please try copying the link instead.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ 
        title: '✅ Link copied!',
        description: 'Share it anywhere you like!'
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  const handleDownloadResults = () => {
    const blob = new Blob([`${title}\n\n${resultText}\n\nCalculated at: ${url}\nDate: ${new Date().toLocaleDateString()}`], 
      { type: 'text/plain' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-results.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
    toast({ 
      title: '📥 Results downloaded!',
      description: 'Saved to your downloads folder'
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-lg flex items-center gap-2">
        <Share2 className="w-5 h-5 text-blue-600" />
        Share Your Results
      </h4>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Help others achieve their health goals by sharing this calculator! 💪
      </p>

      {/* Native Share (Mobile) */}
      {canShare && (
        <Button 
          onClick={handleNativeShare}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Results
        </Button>
      )}

      {/* Social Media Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          onClick={() => window.open(shareLinks.twitter, '_blank')}
          className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
          size="sm"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </Button>
        
        <Button
          onClick={() => window.open(shareLinks.facebook, '_blank')}
          className="bg-[#1877F2] hover:bg-[#166fe5] text-white"
          size="sm"
        >
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </Button>
        
        <Button
          onClick={() => window.open(shareLinks.whatsapp, '_blank')}
          className="bg-[#25D366] hover:bg-[#20bd5a] text-white"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
        
        <Button
          onClick={() => window.open(shareLinks.telegram, '_blank')}
          className="bg-[#0088cc] hover:bg-[#0077b5] text-white"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Telegram
        </Button>
        
        <Button
          onClick={() => window.open(shareLinks.linkedin, '_blank')}
          className="bg-[#0A66C2] hover:bg-[#095196] text-white"
          size="sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          LinkedIn
        </Button>
        
        <Button
          onClick={() => window.open(shareLinks.reddit, '_blank')}
          className="bg-[#FF4500] hover:bg-[#e63e00] text-white"
          size="sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Reddit
        </Button>
        
        <Button
          onClick={() => window.open(shareLinks.pinterest, '_blank')}
          className="bg-[#E60023] hover:bg-[#cc001f] text-white"
          size="sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Pinterest
        </Button>
        
        <Button
          onClick={() => window.open(shareLinks.email, '_blank')}
          className="bg-gray-600 hover:bg-gray-700 text-white"
          size="sm"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Button>
      </div>

      {/* Copy Link & Download */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleCopyLink}
          variant="outline"
          className={`${copied ? 'bg-green-50 border-green-500 text-green-700' : ''}`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 mr-2" />
              Copy Link
            </>
          )}
        </Button>
        
        <Button
          onClick={handleDownloadResults}
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Shareable Quote Box */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          📢 Your Shareable Message:
        </p>
        <p className="text-sm italic text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border-l-4 border-blue-600">
          "{resultText}"
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {hashtagString}
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-600 p-4 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-200">
          <strong>💡 Pro Tip:</strong> Sharing health calculators helps friends and family make informed decisions about their wellness. Your share could inspire someone to start their fitness journey!
        </p>
      </div>
    </div>
  );
}
