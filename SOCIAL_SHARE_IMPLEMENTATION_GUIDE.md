# Social Share Implementation Guide for Calculators

This guide provides a standardized approach to add social sharing functionality (Twitter, Facebook, WhatsApp, Instagram) to all calculators in the Smart Calculator Hubs.

## Quick Reference Keyword
**Keyword to trigger this implementation: `add social share` or `implement social sharing`**

---

## Implementation Steps

### **Step 1: Import Required Icons and Hooks**
```typescript
import { Twitter, Facebook, MessageCircle, Instagram, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
```

### **Step 2: Initialize Toast Hook**
```typescript
const { toast } = useToast();
```

### **Step 3: Add Share Function**
```typescript
const shareToSocial = (platform: 'twitter' | 'instagram' | 'facebook' | 'whatsapp') => {
  if (!results) return;
  
  // Customize this shareText based on your calculator
  const shareText = `[Emoji] [Result Summary]\n\n✨ Calculate yours at www.smartcalculatorhubs.com #YourHashtag`;
  const shareUrl = 'https://www.smartcalculatorhubs.com';
  
  if (platform === 'twitter') {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank');
  } else if (platform === 'facebook') {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
  } else if (platform === 'whatsapp') {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  } else {
    toast({
      title: "Instagram Sharing",
      description: "Copy your results and share them as a story!",
    });
    copyToClipboard(shareText);
  }
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Share your results",
    });
  } catch (error) {
    console.error('Clipboard error:', error);
    toast({
      title: "Copy failed",
      description: "Please manually copy your results",
      variant: "destructive"
    });
  }
};
```

### **Step 4: Add UI Buttons in Results Section**
Place this after the main results display, typically before AI Analysis or educational content:

```tsx
<Separator />

<div className="space-y-3">
  <h4 className="font-semibold">Share Your Results</h4>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    <Button 
      onClick={() => shareToSocial('twitter')} 
      variant="outline"
      className="w-full"
    >
      <Twitter className="h-4 w-4 mr-2" />
      X
    </Button>
    <Button 
      onClick={() => shareToSocial('facebook')} 
      variant="outline"
      className="w-full"
    >
      <Facebook className="h-4 w-4 mr-2" />
      Facebook
    </Button>
    <Button 
      onClick={() => shareToSocial('whatsapp')} 
      variant="outline"
      className="w-full"
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      WhatsApp
    </Button>
    <Button 
      onClick={() => shareToSocial('instagram')} 
      variant="outline"
      className="w-full"
    >
      <Instagram className="h-4 w-4 mr-2" />
      Instagram
    </Button>
  </div>
</div>
```

---

## Share Text Examples by Calculator Type

### **Health Calculators**

**BMI Calculator:**
```typescript
const shareText = `💪 My BMI is ${bmi.toFixed(1)} (${category})\n\n✨ Calculate yours at www.smartcalculatorhubs.com #BMI #Health`;
```

**Calorie Calculator:**
```typescript
const shareText = `🔥 My daily calorie needs: ${calories} kcal\n\n✨ Calculate yours at www.smartcalculatorhubs.com #Calories #Fitness`;
```

**Weight Loss Calculator:**
```typescript
const shareText = `🎯 Goal: ${goalWeight} kg in ${weeks} weeks!\n\n✨ Plan your journey at www.smartcalculatorhubs.com #WeightLoss #Fitness`;
```

### **Financial Calculators**

**Mortgage Calculator:**
```typescript
const shareText = `🏠 Monthly Payment: $${monthlyPayment.toLocaleString()}\nTotal Interest: $${totalInterest.toLocaleString()}\n\n✨ Calculate your mortgage at www.smartcalculatorhubs.com #Mortgage #HomeLoan`;
```

**Loan Calculator:**
```typescript
const shareText = `💰 Monthly Payment: $${monthlyPayment.toLocaleString()}\nLoan Amount: $${principal.toLocaleString()}\n\n✨ Calculate yours at www.smartcalculatorhubs.com #Loan #Finance`;
```

**Retirement Calculator:**
```typescript
const shareText = `💰 I need $${totalNeeded.toLocaleString()} for retirement!\n\n✨ Plan your future at www.smartcalculatorhubs.com #Retirement #Finance`;
```

**Investment Calculator:**
```typescript
const shareText = `📈 Future Value: $${futureValue.toLocaleString()}\nTotal Return: ${returnPercentage}%\n\n✨ Calculate your investments at www.smartcalculatorhubs.com #Investment #Finance`;
```

**Emergency Fund Calculator:**
```typescript
const shareText = `🛡️ Emergency Fund Goal: $${emergencyFund.toLocaleString()}\n\n✨ Calculate yours at www.smartcalculatorhubs.com #EmergencyFund #Finance`;
```

### **Tax Calculators**

**Income Tax Calculator (India):**
```typescript
const shareText = `💼 Tax Liability: ₹${totalTax.toLocaleString()}\nTake Home: ₹${takeHome.toLocaleString()}\n\n✨ Calculate yours at www.smartcalculatorhubs.com #IncomeTax #India`;
```

**GST Calculator (India):**
```typescript
const shareText = `📊 GST Amount: ₹${gstAmount.toLocaleString()}\nTotal: ₹${total.toLocaleString()}\n\n✨ Calculate yours at www.smartcalculatorhubs.com #GST #India`;
```

**Federal Tax Calculator (US):**
```typescript
const shareText = `💵 Federal Tax: $${federalTax.toLocaleString()}\nEffective Rate: ${effectiveRate}%\n\n✨ Calculate yours at www.smartcalculatorhubs.com #FederalTax #USA`;
```

### **Insurance Calculators**

**Life Insurance Calculator:**
```typescript
const shareText = `🛡️ Recommended Coverage: $${coverage.toLocaleString()}\n\n✨ Calculate yours at www.smartcalculatorhubs.com #LifeInsurance #Finance`;
```

**Car Insurance Calculator:**
```typescript
const shareText = `🚗 Estimated Premium: $${premium.toLocaleString()}/year\n\n✨ Calculate yours at www.smartcalculatorhubs.com #CarInsurance`;
```

### **Utility Calculators**

**Tip Calculator:**
```typescript
const shareText = `💵 Tip: $${tip.toFixed(2)}\nTotal: $${total.toFixed(2)}\n\n✨ Calculate yours at www.smartcalculatorhubs.com #TipCalculator`;
```

**Currency Converter:**
```typescript
const shareText = `💱 ${amount} ${fromCurrency} = ${converted.toFixed(2)} ${toCurrency}\n\n✨ Convert currency at www.smartcalculatorhubs.com #Currency`;
```

**Age Calculator:**
```typescript
const shareText = `🎂 I am ${years} years, ${months} months, ${days} days old!\n\n✨ Calculate yours at www.smartcalculatorhubs.com #Age`;
```

### **Australia-Specific Calculators**

**Superannuation Calculator:**
```typescript
const shareText = `🇦🇺 Super Balance at retirement: $${balance.toLocaleString()}\n\n✨ Calculate yours at www.smartcalculatorhubs.com #Superannuation #Australia`;
```

**CGT Calculator:**
```typescript
const shareText = `🇦🇺 Capital Gains Tax: $${cgt.toLocaleString()}\n\n✨ Calculate yours at www.smartcalculatorhubs.com #CGT #Australia`;
```

### **UK-Specific Calculators**

**Pension Calculator:**
```typescript
const shareText = `🇬🇧 Pension Pot at retirement: £${pensionPot.toLocaleString()}\n\n✨ Calculate yours at www.smartcalculatorhubs.com #Pension #UK`;
```

**Stamp Duty Calculator:**
```typescript
const shareText = `🇬🇧 Stamp Duty: £${stampDuty.toLocaleString()}\n\n✨ Calculate yours at www.smartcalculatorhubs.com #StampDuty #UK`;
```

### **Viral Calculators**

**Love Compatibility Calculator:**
```typescript
const shareText = `💕 ${partner1Name} & ${partner2Name} are ${compatibilityPercentage}% compatible! ${overallMatch}\n\n✨ Calculate your love compatibility at www.smartcalculatorhubs.com #LoveCalculator #Compatibility`;
```

---

## Design Guidelines

1. **Placement**: Add share buttons after main results, before AI analysis
2. **Grid Layout**: Use `grid-cols-2 sm:grid-cols-3` for responsive design
3. **Button Style**: Use `variant="outline"` for consistency
4. **Icons**: Always include platform icon with `h-4 w-4 mr-2`
5. **Heading**: Use "Share Your Results" or calculator-specific variant

---

## Platform-Specific Notes

### Twitter (X)
- Character limit: 280 characters
- Use concise, engaging text
- Include 1-2 relevant hashtags

### Facebook
- Longer text allowed
- URL preview will be generated automatically
- Use descriptive text

### WhatsApp
- Great for personal sharing
- Text + URL combined
- Works on mobile and desktop

### Instagram
- Copy to clipboard only (no direct API)
- User manually pastes in Instagram story/post
- Show toast notification on copy

---

## Common Hashtags by Category

- **Health**: #Health #Fitness #Wellness #BMI #Calories
- **Finance**: #Finance #Money #Investment #Retirement
- **Tax**: #Tax #IncomeTax #GST #FederalTax
- **Mortgage/Loan**: #Mortgage #HomeLoan #RealEstate
- **Insurance**: #Insurance #LifeInsurance #CarInsurance
- **India**: #India #IncomeTaxIndia #GST
- **Australia**: #Australia #Superannuation #CGT
- **UK**: #UK #Pension #StampDuty
- **US**: #USA #FederalTax #401k

---

## Testing Checklist

- [ ] All 4 platforms (Twitter, Facebook, WhatsApp, Instagram) working
- [ ] Share text is calculator-specific and engaging
- [ ] URL is set to `www.smartcalculatorhubs.com`
- [ ] Toast notifications appear for Instagram copy
- [ ] Mobile responsive (buttons stack properly)
- [ ] Icons display correctly
- [ ] encodeURIComponent used for all URLs
- [ ] Results state check (`if (!results) return;`)

---

## Reference Implementation
See `frontend/pages/calculators/viral/LoveCompatibilityCalculator.tsx` lines 152-174 for the complete working example.
