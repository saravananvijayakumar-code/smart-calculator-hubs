import { useState, useEffect } from 'react';
import { DollarSign, Users, Calculator, Heart, Star, Sparkles, Utensils, Coffee, Award, ThumbsUp, Smile, TrendingUp, Zap, Gift, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { AutoAdSlot } from '../../../components/ads/AutoAdSlot';

interface TipResult {
  tipAmount: number;
  totalAmount: number;
  perPersonTotal: number;
  perPersonTip: number;
  tipPercentage: number;
}

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercentage, setTipPercentage] = useState([18]);
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [result, setResult] = useState<TipResult | null>(null);

  const calculateTip = () => {
    const bill = parseFloat(billAmount);
    const tip = tipPercentage[0];
    const people = parseInt(numberOfPeople);

    if (!bill || bill <= 0 || !people || people <= 0) {
      setResult(null);
      return;
    }

    const tipAmount = (bill * tip) / 100;
    const totalAmount = bill + tipAmount;
    const perPersonTotal = totalAmount / people;
    const perPersonTip = tipAmount / people;

    setResult({
      tipAmount,
      totalAmount,
      perPersonTotal,
      perPersonTip,
      tipPercentage: tip
    });
  };

  useEffect(() => {
    calculateTip();
  }, [billAmount, tipPercentage, numberOfPeople]);

  const tipPresets = [
    { value: 10, label: 'Fair', emoji: '👍', color: 'from-blue-500 to-cyan-500' },
    { value: 15, label: 'Good', emoji: '😊', color: 'from-green-500 to-emerald-500' },
    { value: 18, label: 'Great', emoji: '⭐', color: 'from-yellow-500 to-amber-500' },
    { value: 20, label: 'Amazing', emoji: '🌟', color: 'from-orange-500 to-red-500' },
    { value: 25, label: 'Excellent', emoji: '🎉', color: 'from-pink-500 to-purple-500' },
  ];

  return (
    <CalculatorLayoutWithAds
      title="Tip Calculator | Restaurant Tip Calculator | Smart Calculator Hubs"
      description="Professional tip calculator with AI-powered insights. Calculate accurate tips, split bills fairly, and learn proper tipping etiquette for any situation. Free comprehensive guide to gratuity calculations."
      keywords="tip calculator, restaurant tip calculator, bill splitter, gratuity calculator, tip percentage, tipping etiquette, dining tips, service gratuity, AI tip analysis, bill splitting calculator"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full">
            <Utensils className="h-4 w-4 text-green-600 dark:text-green-400 animate-bounce" />
            <span className="text-sm font-medium text-green-900 dark:text-green-100">Tipping Made Effortless</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Smart Tip & Bill Split Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Never stress about restaurant math again! Calculate perfect tips, split bills fairly, and show appreciation the right way
          </p>
        </div>

        <AutoAdSlot placement="top-banner" className="my-6" />

        <Card className="border-2 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400 animate-pulse" />
              Enter Bill Details
            </CardTitle>
            <CardDescription className="text-base">
              Quick, easy, and accurate - calculate your perfect tip in seconds!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="billAmount" className="text-base font-semibold flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-blue-600" />
                  Bill Amount ($)
                </Label>
                <Input
                  id="billAmount"
                  type="number"
                  step="0.01"
                  placeholder="50.00"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="border-2 hover:border-green-400 transition-colors text-lg h-12"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    Tip Percentage
                  </Label>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-full">
                    <span className="text-2xl font-bold text-green-700 dark:text-green-300">{tipPercentage[0]}%</span>
                  </div>
                </div>
                <Slider
                  value={tipPercentage}
                  onValueChange={setTipPercentage}
                  max={30}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="grid grid-cols-5 gap-2">
                  {tipPresets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setTipPercentage([preset.value])}
                      className={`p-3 rounded-xl text-center transition-all duration-300 ${
                        tipPercentage[0] === preset.value
                          ? `bg-gradient-to-r ${preset.color} text-white shadow-lg scale-105 border-2 border-white`
                          : 'bg-accent hover:bg-accent/80 text-foreground border-2 border-border hover:scale-105'
                      }`}
                    >
                      <div className="text-2xl mb-1">{preset.emoji}</div>
                      <div className="font-bold text-sm">{preset.value}%</div>
                      <div className="text-xs opacity-80">{preset.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                <Label htmlFor="numberOfPeople" className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  Number of People
                </Label>
                <Input
                  id="numberOfPeople"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                  className="border-2 hover:border-purple-400 transition-colors h-11"
                />
                <p className="text-xs text-muted-foreground">Split the bill fairly among your group</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border-2 border-green-300 dark:border-green-700 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
                    <Heart className="h-4 w-4 animate-pulse" />
                    Tip Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-700 dark:text-green-300">
                    ${result.tipAmount.toFixed(2)}
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1 font-semibold">
                    {result.tipPercentage}% gratuity
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900 border-2 border-blue-300 dark:border-blue-700 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Total Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                    ${result.totalAmount.toFixed(2)}
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Bill + tip
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 border-2 border-purple-300 dark:border-purple-700 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Per Person
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-700 dark:text-purple-300">
                    ${result.perPersonTotal.toFixed(2)}
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                    Each pays
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900 border-2 border-orange-300 dark:border-orange-700 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100 flex items-center gap-2">
                    <Gift className="h-4 w-4 animate-pulse" />
                    Per Person Tip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-orange-700 dark:text-orange-300">
                    ${result.perPersonTip.toFixed(2)}
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                    Individual tip
                  </p>
                </CardContent>
              </Card>
            </div>

            <AutoAdSlot placement="mid-content" className="my-8" />

            <AIAnalysis
              analysisRequest={{
                calculatorType: "tip-calculator",
                data: {
                  billAmount: parseFloat(billAmount) || 0,
                  tipPercentage: result.tipPercentage,
                  tipAmount: result.tipAmount,
                  totalAmount: result.totalAmount,
                  peopleCount: parseInt(numberOfPeople) || 1,
                  amountPerPerson: result.perPersonTotal
                }
              }}
              autoRun={true}
              title="AI Tip Analysis"
              description="Get insights on tipping etiquette and budgeting recommendations."
            />

            <ExportShareButtons
              calculatorType="tip-calculator"
              inputs={{
                billAmount: parseFloat(billAmount) || 0,
                tipPercentage: result.tipPercentage,
                numberOfPeople: parseInt(numberOfPeople) || 1
              }}
              results={{
                tipAmount: result.tipAmount,
                totalAmount: result.totalAmount,
                perPersonTotal: result.perPersonTotal,
                perPersonTip: result.perPersonTip
              }}
              title="Tip Calculator Report"
            />
          </div>
        )}

        <AutoAdSlot placement="in-feed" className="my-8" />

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Utensils className="h-5 w-5 text-blue-600" />
                Dining Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-red-500" />
                  Fine Dining Excellence
                </h3>
                <p className="text-muted-foreground">
                  Celebrating a special occasion at an upscale restaurant? Fine dining servers provide exceptional service, expert wine recommendations, and attentive care throughout your meal. Show appreciation with 20-25% tips for their professionalism and expertise!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-green-500" />
                  Casual Dining Favorites
                </h3>
                <p className="text-muted-foreground">
                  Your neighborhood restaurant where everybody knows your name! Casual dining servers juggle multiple tables with efficiency and warmth. Standard 18-20% tips keep your favorite spots thriving and servers smiling!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Smile className="h-4 w-4 text-purple-500" />
                  Quick Service Spots
                </h3>
                <p className="text-muted-foreground">
                  Coffee shops, fast-casual eateries, and counter service restaurants deserve love too! While tips are smaller, that $1-2 per order or 10-15% adds up and brightens someone's day. Every bit helps hardworking baristas and counter staff!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="h-5 w-5 text-purple-600" />
                Service Quality Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-600" />
                  Exceptional Service (25%+)
                </h3>
                <p className="text-muted-foreground">
                  Your server went above and beyond! They remembered your preferences, accommodated special requests perfectly, provided expert recommendations, and created a memorable dining experience. Reward exceptional effort generously!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                  Great Service (18-20%)
                </h3>
                <p className="text-muted-foreground">
                  Friendly, attentive, and professional - everything you hope for in dining service! Your server checked in at perfect intervals, kept drinks filled, and ensured your meal went smoothly. The standard for good service deserves standard tips!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-blue-600" />
                  Adequate Service (15%)
                </h3>
                <p className="text-muted-foreground">
                  Service was good but not remarkable - your needs were met without extra flair. Remember, busy shifts and kitchen delays aren't always the server's fault. Fair tips support hardworking staff even on challenging days!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-indigo-600 animate-pulse" />
              The Complete Guide to Smart Tipping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Calculate tips in seconds with real-time updates. No awkward math at the table - just instant, accurate results!
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Fair Splitting</h3>
                <p className="text-sm text-muted-foreground">
                  Split bills evenly among any number of people. No arguments, no confusion - just fair shares for everyone!
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                  <Star className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">AI Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized recommendations based on your bill, location, and dining scenario with AI-powered analysis!
                </p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h3 className="text-xl font-bold mt-6 mb-4">Why Tipping Matters More Than You Think</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tipping isn't just about math - it's about recognizing the hard work, skill, and dedication of service professionals who make your dining experience special! In many countries, especially the United States, tips constitute a major portion of server income. These hardworking individuals often earn base wages well below standard minimum wage with the understanding that tips will supplement their income. Your generosity doesn't just say "thank you" - it helps pay rent, buy groceries, and support families. Every time you tip fairly, you're contributing to someone's livelihood and showing respect for the vital work service professionals do every day!
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-4">The Real Math Behind Restaurant Service</h3>
              <p className="text-muted-foreground leading-relaxed">
                Here's what most diners don't realize: when you sit down at a restaurant, your server isn't just taking your order. They're managing multiple tables simultaneously, coordinating with kitchen staff, ensuring food quality, handling special requests, and creating a pleasant atmosphere - all while staying friendly and professional! Many servers work demanding shifts on their feet for hours, dealing with everything from dietary restrictions to difficult customers. They're trained in menu knowledge, wine pairings, and customer service skills. Some establishments require servers to share tips with busers, bartenders, and hosts. When you calculate 15-20%, you're not just tipping for order-taking - you're compensating for genuine hospitality expertise and hard work!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Global Tipping: A World of Differences</h3>
              <p className="text-muted-foreground leading-relaxed">
                Traveling internationally? Tipping customs vary wildly across countries! In Japan, tipping can actually be considered rude or confusing, as exceptional service is simply expected as standard practice. European countries often include service charges in the bill automatically, though leaving small additional amounts for outstanding service is appreciated. Australia and New Zealand don't require tips but welcome them for exceptional experiences, typically around 10%. In Southeast Asia, tipping is becoming more common in tourist areas but isn't traditionally expected. Middle Eastern countries have mixed practices - high-end restaurants expect tips while local eateries may not. Always research local customs before traveling to show cultural awareness and respect!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Bill Splitting Made Simple</h3>
              <p className="text-muted-foreground leading-relaxed">
                Group dining can turn into awkward math chaos without the right tools! Our calculator eliminates the guesswork and potential disputes. Whether you're dining with two friends or hosting a party of ten, splitting bills fairly ensures everyone pays their share without complicated mental arithmetic. Pro tip: designate one person as the "bill manager" to avoid multiple people doing different calculations and reaching different totals! Some groups prefer splitting equally regardless of what each person ordered, while others want to pay based on individual meals. Whatever your preference, calculate the tip on the TOTAL bill first, then divide - this ensures your server receives appropriate compensation for serving the entire group. Don't forget that larger groups often receive automatic gratuity (usually 18-20% for parties of 6+), so always check your bill to avoid accidentally double-tipping!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Special Situations and How to Handle Them</h3>
              <p className="text-muted-foreground leading-relaxed">
                What about complicated scenarios? If you have a coupon or discount, calculate your tip on the PRE-DISCOUNT amount - your server did the same work regardless of your promotional deal! For alcohol, include it in your tip calculation unless you had sommelier service on very expensive wines, in which case a flat per-bottle tip might be more appropriate. Poor service deserves consideration: was your server genuinely rude or inattentive, or were they overwhelmed by understaffing and kitchen problems? If issues arose beyond server control, maintain normal tipping and provide feedback to management instead. For genuinely bad service due to server attitude, it's acceptable to tip less, but going below 10% should be rare and reserved for truly terrible experiences. Remember: service workers are human and even great servers can have off days!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">The Digital Tipping Revolution</h3>
              <p className="text-muted-foreground leading-relaxed">
                Technology has transformed how we tip! Modern point-of-sale systems now prompt for tips at checkout, with suggested percentages (often 18%, 20%, and 25%) displayed prominently. These systems sometimes calculate on post-tax totals, which inflates tip amounts slightly compared to traditional pre-tax calculation. Mobile payment apps like Venmo and PayPal make splitting bills and sending tip shares effortless - no more scrambling for cash! Food delivery apps introduced pre-tipping, where you tip before service completion. This creates pressure to tip generously upfront, though many apps allow post-delivery adjustments. For delivery, remember your tip impacts driver willingness to accept your order during busy periods. Delivery drivers face vehicle costs, weather challenges, and navigation headaches, so 15-20% (minimum $3-5) is appropriate, more for large orders or bad weather!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Beyond Restaurants: Complete Tipping Guide</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tipping extends far beyond dining! Hair stylists earn 15-20% for cuts and 20% for complex color services. Massage therapists, nail technicians, and estheticians all appreciate 15-20%. Taxi and rideshare drivers typically receive 10-15%, more for helping with luggage or navigating difficult conditions. Hotel housekeeping deserves $2-5 per night (left daily, as staff rotates). Valet parking earns $2-5 when retrieving your car. Furniture delivery and assembly teams appreciate $5-20 per person depending on job complexity. Holiday tipping for regular service providers (doormen, nannies, housekeepers) often equals one week to one month of normal service fees. Pet groomers, car wash attendants, and moving crews all benefit from $5-20 depending on service level. When in doubt, ask friends, check online forums for your area, or err on the side of generosity!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Cash vs. Card: The Eternal Debate</h3>
              <p className="text-muted-foreground leading-relaxed">
                Should you tip in cash or on your card? Each has advantages! Cash tips go directly to servers immediately without credit card processing fees (which can take 2-4% of tip amounts) or waiting for payroll processing. Servers can access cash tips the same day, which matters for those living paycheck to paycheck. However, card tips create paper trails for tax purposes and don't require carrying cash. Many servers actually prefer card tips despite fees because tracking is easier and there's no risk of losing cash. Some establishments pool tips and distribute them evenly or by point systems, in which case cash vs. card makes little difference. A thoughtful approach: tip on your card for convenience and add a few dollars cash for exceptional service, giving your server an immediate bonus!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Budget-Friendly Tipping Strategies</h3>
              <p className="text-muted-foreground leading-relaxed">
                On a tight budget? You can still dine out AND tip appropriately! Choose less expensive restaurants where 20% of a $30 bill ($6) is more manageable than 20% of a $100 bill ($20). Lunch specials often provide similar food to dinner at lower prices, making fair tipping easier. Opt for water instead of expensive beverages - this cuts costs significantly while maintaining proper tip amounts on food. Consider dining out less frequently but tipping generously when you do, rather than eating out often with inadequate tips. Remember: if you can't afford to tip, you can't afford to eat out - it's part of the dining cost. Coffee shops and counter service spots offer great compromises with lower bills and smaller expected tips (10-15% or $1-2). Cooking at home and saving dining out for special occasions lets you enjoy restaurant experiences while tipping servers fairly for their hard work!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Teaching Kids About Tipping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tipping offers valuable lessons for children about gratitude, service work, and financial literacy! Start by explaining that servers rely on tips as significant income - this teaches economic realities and empathy. Let kids use our calculator to practice math skills while learning percentages in real-world contexts. Discuss service quality and how tip amounts can reflect appreciation without being judgmental. Encourage children to notice server effort: bringing extra napkins, explaining menu items, checking back on meals. When kids earn allowances or job money, include tipping in their budgets - treating them to restaurant meals where they calculate and leave tips themselves teaches responsibility. Explain that tipping fairly, even when they could "save money" by tipping less, builds character and treats service workers with dignity. These lessons create thoughtful, generous adults who understand the value of service work and treat everyone with respect!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">The Future of Tipping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tipping culture is evolving! Some restaurants experiment with "no-tipping" policies, instead paying higher wages and raising menu prices accordingly. This provides servers stable, predictable income and removes tip anxiety for customers, though many servers actually prefer traditional tipping because they can earn more during busy periods. Some establishments implement service charges (18-20% automatically added to bills), particularly for large groups. Technology enables dynamic tipping with QR codes, apps, and digital payment systems making the process faster and more integrated. The pandemic accelerated contactless tipping and increased awareness of service worker challenges, with many customers tipping more generously. Future trends may include real-time service feedback systems where tip amounts auto-adjust based on customer satisfaction ratings, though this raises concerns about fairness and bias. Whatever changes come, the core principle remains: compensating service workers fairly for their labor and expertise!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Common Tipping Mistakes to Avoid</h3>
              <p className="text-muted-foreground leading-relaxed">
                Don't fall into these tipping traps! Mistake #1: Tipping on the post-tax total without realizing it - this inflates your tip by the tax percentage, though some consider this acceptable. Mistake #2: Forgetting to tip on takeout orders, even though someone packaged everything carefully (10% is thoughtful). Mistake #3: Assuming automatic gratuity means no additional tip - check your bill and understand what's included. Mistake #4: Tipping the same dollar amount regardless of service quality - percentage-based tips scale appropriately with bill size. Mistake #5: Not tipping hotel housekeeping because you don't see them - leave cash daily with a thank-you note. Mistake #6: Undertipping on discounted or comped meals - base tips on original value. Mistake #7: Splitting tips unevenly in groups, leaving servers shortchanged because someone didn't pay their share. Mistake #8: Tipping poorly due to kitchen errors beyond server control - separate food quality from service quality. Avoid these errors and you'll be a tipping pro!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Start Tipping Smarter Today!</h3>
              <p className="text-muted-foreground leading-relaxed">
                You now have all the knowledge and tools to become a confident, generous tipper who supports service workers fairly while managing your budget responsibly! Our calculator eliminates math anxiety, our guide provides cultural context, and our AI analysis offers personalized insights. Whether you're dining at your neighborhood diner or celebrating at a Michelin-starred restaurant, split bills with friends or treating yourself solo, calculate perfect tips in seconds. Bookmark this page for instant access whenever you need it - your servers (and dining companions!) will thank you. Remember: good tipping isn't just about percentages and math. It's about recognizing human effort, showing appreciation, and contributing to a more equitable service industry. Calculate your first tip now and experience the confidence that comes from knowing you're doing right by the people who serve you!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-2 border-amber-300 dark:border-amber-700">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full">
                <Heart className="h-8 w-8 text-amber-600 dark:text-amber-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold">Spread the Generosity!</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Bookmark this calculator and share it with friends! Together we can create a culture of fair tipping that supports service workers and makes dining out better for everyone. Your generosity makes a difference!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}

export default TipCalculator;
