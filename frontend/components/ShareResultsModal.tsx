// @ts-nocheck
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  Share2, 
  Copy, 
  Twitter, 
  Facebook, 
  MessageCircle, 
  Instagram,
  Check,
  Target,
  Activity,
  Flame,
  MapPin
} from 'lucide-react';

interface ShareData {
  stepsPerDay: number;
  distancePerDay: number;
  caloriesPerDay: number;
  targetWeightLoss: string;
  timeframe: string;
  timeframeUnit: string;
  weightUnit: string;
  currentBMI: number;
  targetBMI: number;
  weeklyWeightLoss: number;
}

interface ShareResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: ShareData;
}

const ShareResultsModal: React.FC<ShareResultsModalProps> = ({ isOpen, onClose, shareData }) => {
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const { toast } = useToast();

  const getBaseUrl = () => {
    return typeof window !== 'undefined' ? window.location.origin : '';
  };

  const formatNumber = (num: number) => num.toLocaleString();

  const isWebShareSupported = () => {
    return typeof navigator !== 'undefined' && 'share' in navigator;
  };

  const shareFormats = {
    twitter: {
      icon: Twitter,
      name: 'Twitter',
      color: 'bg-blue-500 hover:bg-blue-600',
      content: `🎯 My Weight Loss Plan:
${formatNumber(shareData.stepsPerDay)} steps/day
🚶 ${shareData.distancePerDay.toFixed(1)} km daily
🔥 ${shareData.caloriesPerDay} calories burned
📊 Goal: ${shareData.targetWeightLoss} ${shareData.weightUnit} in ${shareData.timeframe} ${shareData.timeframeUnit}

Calculated with Smart Calculator Hubs
${getBaseUrl()}/calculators/health/weight-loss-step`,
      action: () => {
        const text = encodeURIComponent(shareFormats.twitter.content);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
      }
    },
    
    facebook: {
      icon: Facebook,
      name: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700',
      content: `🎯 My Personalized Weight Loss Walking Plan!

📈 Daily Targets:
• ${formatNumber(shareData.stepsPerDay)} steps per day
• ${shareData.distancePerDay.toFixed(1)} km distance
• ${shareData.caloriesPerDay} calories burned

🏆 My Goal: Lose ${shareData.targetWeightLoss} ${shareData.weightUnit} in ${shareData.timeframe} ${shareData.timeframeUnit}

💪 Health Progress:
• Current BMI: ${shareData.currentBMI.toFixed(1)}
• Target BMI: ${shareData.targetBMI.toFixed(1)}
• Weekly Loss Rate: ${shareData.weeklyWeightLoss.toFixed(1)} ${shareData.weightUnit}/week

Ready to start my fitness journey! 🚀

Try the calculator: ${getBaseUrl()}/calculators/health/weight-loss-step`,
      action: () => {
        const url = encodeURIComponent(`${getBaseUrl()}/calculators/health/weight-loss-step`);
        const quote = encodeURIComponent(shareFormats.facebook.content);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank');
      }
    },

    whatsapp: {
      icon: MessageCircle,
      name: 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      content: `🎯 *My Weight Loss Walking Plan*

📊 *Daily Targets:*
• ${formatNumber(shareData.stepsPerDay)} steps
• ${shareData.distancePerDay.toFixed(1)} km distance  
• ${shareData.caloriesPerDay} calories burned

🏆 *Goal:* ${shareData.targetWeightLoss} ${shareData.weightUnit} in ${shareData.timeframe} ${shareData.timeframeUnit}

💪 *Health Metrics:*
• Current BMI: ${shareData.currentBMI.toFixed(1)}
• Target BMI: ${shareData.targetBMI.toFixed(1)}
• Weekly Loss: ${shareData.weeklyWeightLoss.toFixed(1)} ${shareData.weightUnit}

Let's get fit together! 🚶‍♀️🚶‍♂️

Calculator: ${getBaseUrl()}/calculators/health/weight-loss-step`,
      action: () => {
        const text = encodeURIComponent(shareFormats.whatsapp.content);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    },

    instagram: {
      icon: Instagram,
      name: 'Instagram',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      content: `🎯 MY WEIGHT LOSS WALKING PLAN 🎯

📈 DAILY TARGETS:
👟 ${formatNumber(shareData.stepsPerDay)} steps
🗺️ ${shareData.distancePerDay.toFixed(1)} km walk
🔥 ${shareData.caloriesPerDay} calories

🏆 GOAL: ${shareData.targetWeightLoss} ${shareData.weightUnit} in ${shareData.timeframe} ${shareData.timeframeUnit}

💪 HEALTH JOURNEY:
📊 Current BMI: ${shareData.currentBMI.toFixed(1)}
🎯 Target BMI: ${shareData.targetBMI.toFixed(1)}
📉 Weekly: ${shareData.weeklyWeightLoss.toFixed(1)} ${shareData.weightUnit}/week

Ready to transform! 🚀💪

#weightloss #walking #fitness #health #goals #transformation #weightlossjourney #healthylifestyle #fitnessgoals #walkingplan

Get your plan: ${getBaseUrl()}/calculators/health/weight-loss-step`,
      action: () => {
        // Instagram doesn't have direct sharing API, so copy to clipboard
        copyToClipboard('instagram', shareFormats.instagram.content);
      }
    }
  };

  const copyToClipboard = async (platform: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPlatform(platform);
      toast({
        title: "Copied to clipboard!",
        description: `${shareFormats[platform as keyof typeof shareFormats].name} post copied. Paste it on ${shareFormats[platform as keyof typeof shareFormats].name}!`,
      });
      
      setTimeout(() => setCopiedPlatform(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: "Copy failed",
        description: "Please manually copy the text",
        variant: "destructive"
      });
    }
  };

  const shareNatively = async () => {
    const shareDataObj = {
      title: 'My Weight Loss Step Calculator Results',
      text: shareFormats.twitter.content,
      url: `${getBaseUrl()}/calculators/health/weight-loss-step`
    };

    if (isWebShareSupported() && navigator.share) {
      try {
        await navigator.share(shareDataObj);
        toast({
          title: "Shared successfully!",
          description: "Your results have been shared",
        });
      } catch (error) {
        console.error('Native share failed:', error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Results
          </DialogTitle>
          <DialogDescription>
            Share your weight loss walking plan on social media to inspire others and stay accountable!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <Target className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-blue-700">{formatNumber(shareData.stepsPerDay)}</div>
              <div className="text-xs text-muted-foreground">steps/day</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <MapPin className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-700">{shareData.distancePerDay.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">km/day</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <Flame className="h-4 w-4 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-orange-700">{shareData.caloriesPerDay}</div>
              <div className="text-xs text-muted-foreground">calories</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <Activity className="h-4 w-4 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-purple-700">{shareData.targetWeightLoss}</div>
              <div className="text-xs text-muted-foreground">{shareData.weightUnit} goal</div>
            </div>
          </div>

          <Separator />

          {/* Native Share Button (if supported) */}
          {isWebShareSupported() && (
            <>
              <Button onClick={shareNatively} className="w-full" size="lg">
                <Share2 className="h-4 w-4 mr-2" />
                Share via Device
              </Button>
              <Separator />
            </>
          )}

          {/* Platform-specific sharing */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Share on Social Media</h3>
            
            <div className="grid gap-4">
              {Object.entries(shareFormats).map(([platform, format]) => {
                const IconComponent = format.icon;
                const isCopied = copiedPlatform === platform;
                
                return (
                  <div key={platform} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{format.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(platform, format.content)}
                          variant="outline"
                          size="sm"
                        >
                          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {isCopied ? 'Copied!' : 'Copy'}
                        </Button>
                        {platform !== 'instagram' && (
                          <Button
                            onClick={format.action}
                            className={format.color}
                            size="sm"
                          >
                            Share
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded p-3 text-sm font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {format.content}
                    </div>
                    
                    {platform === 'instagram' && (
                      <div className="text-xs text-muted-foreground">
                        💡 Instagram doesn't support direct sharing. Copy the text and paste it manually on Instagram.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips for sharing */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Sharing Tips</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Add your own personal touch to make it more engaging</li>
              <li>• Tag friends who might be interested in joining your journey</li>
              <li>• Share progress updates as you work toward your goal</li>
              <li>• Use relevant hashtags to reach a wider audience</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareResultsModal;