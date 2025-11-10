import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Copy, Baby, Calendar, Heart, Sparkles, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import HealthSocialShare from '@/components/health/HealthSocialShare';
import CalculatorLayoutWithAds from '@/components/CalculatorLayoutWithAds';
import { calculatePregnancyDueDate } from '@/lib/health/pregnancyDueDate';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InFeedAd from '@/components/ads/InFeedAd';

export default function PregnancyDueDateCalculator() {
  const [lmpDate, setLmpDate] = useState<string>('2025-01-01');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const calculate = () => {
    setError('');
    try {
      const lmp = new Date(lmpDate);
      const res = calculatePregnancyDueDate({ lmpDate: lmp, cycleLength });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Calculation error');
      setResult(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const copyResults = () => {
    if (!result) return;
    const text = `Due Date: ${formatDate(result.edd)}\nGestational Age: ${result.gestationalWeeks}w ${result.gestationalDays}d\nTrimester: ${result.trimester}`;
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <CalculatorLayoutWithAds
      title="Pregnancy Due Date Calculator (Naegele's Rule)"
      description="Calculate your estimated due date using last menstrual period with cycle adjustment. Medically accurate."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert className="animate-in slide-in-from-top duration-500">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Assumptions & Accuracy:</strong> Uses Naegele's rule (LMP + 280 days) adjusted for cycle length. Ultrasound dating is more accurate. Consult your healthcare provider.
          </AlertDescription>
        </Alert>

        <Card className="p-6 bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 shadow-lg border-2 border-violet-200 dark:border-violet-800 animate-in fade-in duration-700">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-violet-600 animate-pulse" />
              <h3 className="text-xl font-bold text-violet-900 dark:text-violet-300">Enter Your Information</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lmp" className="text-base font-semibold">First Day of Last Menstrual Period (LMP)</Label>
              <Input 
                id="lmp" 
                type="date" 
                value={lmpDate} 
                onChange={(e) => setLmpDate(e.target.value)}
                className="border-2 border-violet-300 focus:border-violet-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycle" className="text-base font-semibold">Average Cycle Length (days)</Label>
              <Input
                id="cycle"
                type="number"
                value={cycleLength}
                onChange={(e) => setCycleLength(parseInt(e.target.value) || 28)}
                min={21}
                max={35}
                className="border-2 border-sky-300 focus:border-sky-500 transition-all duration-300"
              />
            </div>
            <Button onClick={calculate} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Sparkles className="w-5 h-5 mr-2" />
              Calculate My Due Date
            </Button>
          </div>
        </Card>

        {error && (
          <Alert variant="destructive" className="animate-in slide-in-from-left duration-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Card className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 border-emerald-300 dark:border-emerald-700 animate-in zoom-in duration-500">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Baby className="text-violet-600 w-8 h-8 animate-bounce" />
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Your Pregnancy Results</span>
            </h3>
            <div className="text-center p-8 bg-white dark:bg-gray-700 rounded-xl mb-4 shadow-lg border-2 border-violet-200 transform hover:scale-105 transition-all duration-300">
              <p className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Estimated Due Date (EDD)</p>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                {formatDate(result.edd)}
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-red-500 animate-pulse" />
                <span className="text-sm text-gray-500">Mark your calendar!</span>
                <Heart className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gray-700 rounded-xl shadow-md border-2 border-blue-300 hover:shadow-lg transition-all duration-300">
                <p className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Gestational Age</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {result.gestationalWeeks}w {result.gestationalDays}d
                </p>
                <TrendingUp className="w-5 h-5 text-blue-400 mt-2 animate-pulse" />
              </div>
              <div className="p-5 bg-gradient-to-br from-purple-50 to-violet-100 dark:bg-gray-700 rounded-xl shadow-md border-2 border-purple-300 hover:shadow-lg transition-all duration-300">
                <p className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Current Trimester</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">Trimester {result.trimester}</p>
                <Sparkles className="w-5 h-5 text-purple-400 mt-2 animate-pulse" />
              </div>
            </div>
            <div className="mt-4 p-5 bg-gradient-to-r from-orange-50 via-yellow-50 to-amber-50 dark:bg-gray-700 rounded-xl shadow-md border-2 border-orange-300">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-6 h-6 text-orange-600" />
                <p className="font-bold text-lg text-orange-900 dark:text-orange-300">Key Pregnancy Milestones</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="font-bold text-orange-600">12 weeks:</span>
                  <span className="text-gray-700 dark:text-gray-300">{formatDate(result.milestones.week12)} - End of 1st trimester</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="font-bold text-green-600">20 weeks:</span>
                  <span className="text-gray-700 dark:text-gray-300">{formatDate(result.milestones.week20)} - Anatomy scan</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="font-bold text-blue-600">28 weeks:</span>
                  <span className="text-gray-700 dark:text-gray-300">{formatDate(result.milestones.week28)} - 3rd trimester begins</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="font-bold text-purple-600">36 weeks:</span>
                  <span className="text-gray-700 dark:text-gray-300">{formatDate(result.milestones.week36)} - Full term approaching</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 mb-4">
              <Button onClick={copyResults} variant="outline" size="sm" className="hover:bg-violet-100 transition-colors duration-300">
                <Copy className="w-4 h-4 mr-2" /> Copy Results
              </Button>
            </div>
            <Card className="p-6 bg-white dark:bg-gray-800 border-2 border-violet-300 dark:border-violet-700 shadow-lg">
              <HealthSocialShare
                title="Pregnancy Due Date Calculator"
                resultText={`Expecting a baby! 👶 Due date: ${formatDate(result.edd)} | Currently ${result.gestationalWeeks}w ${result.gestationalDays}d (Trimester ${result.trimester}) #pregnancy #baby #expecting`}
                hashtags={['pregnancy', 'baby', 'expecting', 'momtobe', 'parenthood']}
                category="health"
              />
            </Card>
          </Card>
        )}

        <InFeedAd className="my-8" />

        <div className="prose prose-lg max-w-none space-y-8 mt-12">
          <section className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-violet-200">
            <div className="flex items-center gap-3 mb-4">
              <Baby className="w-10 h-10 text-violet-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent m-0">Understanding Your Pregnancy Due Date</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to one of the most exciting journeys of your life! 🎉 Calculating your pregnancy due date isn't just about circling a calendar day—it's about understanding the incredible 40-week adventure your body is embarking on. Whether you're a first-time parent feeling all the feels or a seasoned pro adding to your family, knowing your estimated due date (EDD) helps you plan, prepare, and celebrate each milestone along the way.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              Our pregnancy due date calculator uses the tried-and-true <strong>Naegele's Rule</strong>, the same method your healthcare provider likely uses during your first prenatal visit. It's been helping expectant parents since 1812 (yes, it's that reliable!), and while medical science has evolved, this formula remains the gold standard for initial pregnancy dating.
            </p>
          </section>

          <section className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-10 h-10 text-blue-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent m-0">What Is Naegele's Rule?</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Named after German obstetrician Franz Karl Naegele, this calculation method is beautifully simple yet remarkably accurate. Here's the science: <strong>EDD = Last Menstrual Period (LMP) + 280 days</strong>. But wait—there's a twist! 🌀
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              This formula assumes a standard 28-day menstrual cycle with ovulation occurring on day 14. Since not everyone has a textbook cycle (and that's totally normal!), our calculator adjusts for your unique cycle length. If your cycles are 30 days? We add 2 extra days. If they're 26 days? We subtract 2. This personalization makes your due date estimate significantly more accurate than one-size-fits-all calculators.
            </p>
            <div className="mt-6 p-6 bg-white dark:bg-gray-700 rounded-xl border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">🧮 The Math Behind the Magic</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Standard Formula:</strong> LMP + 280 days = Due Date
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Adjusted Formula:</strong> LMP + 280 days + (Your Cycle Length - 28 days) = Personalized Due Date
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Example: If your cycle is 32 days, we add 4 extra days to account for later ovulation!
              </p>
            </div>
          </section>

          <section className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-10 h-10 text-emerald-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent m-0">Why Your LMP Matters So Much</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              You might be wondering: "Why do we calculate pregnancy from my last period when I wasn't even pregnant yet?" 🤔 Excellent question! Here's the fascinating biology behind it:
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              The first day of your last menstrual period is the most reliable, easy-to-remember date for most people. While conception typically occurs about 2 weeks after LMP (during ovulation), that exact moment is nearly impossible to pinpoint without intensive monitoring. By using LMP as our starting point, we create a consistent, universal reference point that healthcare providers worldwide can use.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              This is why when you're "4 weeks pregnant," your baby has actually only existed for about 2 weeks. Mind-blowing, right? This is called <strong>gestational age</strong> (calculated from LMP) versus <strong>fetal age</strong> (calculated from conception). Medical professionals always use gestational age because it's more standardized and reliable.
            </p>
          </section>



          <section className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-10 h-10 text-orange-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent m-0">The Three Trimesters: Your Pregnancy Roadmap</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Pregnancy is divided into three distinct trimesters, each with its own magic, challenges, and milestones. Let's break down what to expect in each phase of your journey! ✨
            </p>

            <div className="mt-6 space-y-6">
              <div className="p-6 bg-gradient-to-r from-violet-100 to-purple-100 dark:bg-gray-700 rounded-xl border-l-4 border-violet-600">
                <h3 className="text-2xl font-bold text-violet-900 dark:text-violet-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  First Trimester (Weeks 0-13)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>What's Happening:</strong> This is the foundation-building phase! From a tiny cluster of cells, your baby develops all major organs, a beating heart (around week 6!), arms, legs, and even tiny fingers and toes. By week 12, your baby is fully formed—just needs to grow bigger!
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>What You Might Feel:</strong> Fatigue, morning sickness (which can strike any time of day!), breast tenderness, frequent urination, and emotional rollercoasters. Hormones are working overtime! 🎢
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Key Milestone:</strong> Your first prenatal appointment and dating ultrasound typically happen between 8-12 weeks. This is when your provider might adjust your due date based on baby's measurements.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-r from-sky-100 to-blue-100 dark:bg-gray-700 rounded-xl border-l-4 border-sky-600">
                <h3 className="text-2xl font-bold text-sky-900 dark:text-sky-300 mb-3 flex items-center gap-2">
                  <Heart className="w-6 h-6" />
                  Second Trimester (Weeks 14-26)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>What's Happening:</strong> Welcome to the "honeymoon phase" of pregnancy! Your baby is growing rapidly, developing fat stores, practicing breathing movements with amniotic fluid, and growing hair. Around week 18-22, you'll feel those magical first flutters (quickening)! 🦋
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>What You Might Feel:</strong> Energy returns! Many people feel their best during this trimester. Your bump becomes visible, you might glow (thanks to increased blood flow), and those baby movements become more regular and stronger.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Key Milestone:</strong> The 20-week anatomy scan (often called the "big ultrasound") checks baby's development in detail. Many parents find out baby's biological sex during this scan!
                </p>
              </div>

              <div className="p-6 bg-gradient-to-r from-emerald-100 to-green-100 dark:bg-gray-700 rounded-xl border-l-4 border-emerald-600">
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300 mb-3 flex items-center gap-2">
                  <Baby className="w-6 h-6" />
                  Third Trimester (Weeks 27-40+)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>What's Happening:</strong> The home stretch! Your baby is perfecting survival skills: practicing breathing, opening eyes, responding to light and sound, and putting on crucial weight (about 0.5 pounds per week in the final months). Their brain is developing rapidly, creating billions of neural connections!
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>What You Might Feel:</strong> Your baby is running out of room! Expect more pronounced movements (sometimes hiccups!), Braxton Hicks contractions (practice contractions), backaches, swelling, and nesting instincts kicking in. Sleep might be challenging—hello, pregnancy pillow! 💤
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Key Milestone:</strong> Week 37 marks "early term" (baby could arrive safely any time now!), and week 39 is considered "full term." Most babies arrive between 39-41 weeks.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-10 h-10 text-indigo-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent m-0">How Accurate Is Your Due Date?</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Let's get real for a moment: only about 5% of babies arrive on their exact due date! 📊 Think of your due date as an "estimated arrival window" rather than a guaranteed delivery date. Here's what affects accuracy:
            </p>
            <div className="mt-6 space-y-4">
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-2">🔍 Cycle Regularity</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Regular cycles = more accurate predictions. Irregular cycles make ovulation timing trickier to estimate. If your cycles vary by more than 5 days, mention this to your healthcare provider.
                </p>
              </div>
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-2">🏥 Ultrasound Dating</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Early ultrasounds (before 13 weeks) are accurate to within 3-5 days and often become the "official" due date if they differ significantly from LMP dating. Later ultrasounds are less accurate for dating because babies grow at different rates.
                </p>
              </div>
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-2">👶 Individual Variation</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  First-time parents tend to go slightly past their due date (average 40 weeks + 5 days), while experienced parents often deliver a bit earlier. Genetics, age, and overall health also play roles.
                </p>
              </div>
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-2">📅 Normal Range</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Babies born anywhere from 37 to 42 weeks are considered full-term and healthy. That's a 5-week window! Most providers won't intervene unless you reach 41-42 weeks.
                </p>
              </div>
            </div>
          </section>

          <InFeedAd className="my-8" />

          <section className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-teal-200">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-10 h-10 text-teal-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent m-0">When Might Your Due Date Change?</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Don't be surprised if your due date shifts during early pregnancy—this happens to about 1 in 5 pregnancies! Here's when and why your provider might adjust your EDD:
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex gap-4 items-start p-4 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-700 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Early Ultrasound Discrepancy</h4>
                  <p className="text-gray-700 dark:text-gray-300">If your first ultrasound (6-13 weeks) shows your baby measuring more than 5-7 days different from your LMP-based date, your provider will likely use the ultrasound date instead. This is especially common if you have irregular cycles or weren't tracking ovulation.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-700 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Uncertain LMP</h4>
                  <p className="text-gray-700 dark:text-gray-300">Can't remember your last period? Recently stopped birth control? Had irregular bleeding? Your provider will rely entirely on ultrasound measurements to establish your due date.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-700 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Assisted Reproduction</h4>
                  <p className="text-gray-700 dark:text-gray-300">If you conceived through IVF or IUI, your due date is calculated from your embryo transfer or insemination date—super precise! These dates typically don't change.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-6 bg-yellow-100 dark:bg-yellow-900 rounded-xl border-2 border-yellow-400">
              <p className="text-gray-800 dark:text-gray-200 font-semibold">
                ⚠️ Important: Once your due date is established (usually by 13 weeks), it should NOT change. Later ultrasounds showing different sizes reflect your baby's individual growth pattern, not dating errors.
              </p>
            </div>
          </section>

          <section className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-purple-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent m-0">Making the Most of Your Pregnancy Timeline</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Now that you know your due date, let's talk about using this information to plan the best pregnancy experience possible! 🌟
            </p>
            
            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-l-4 border-purple-600">
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-3">📋 Prenatal Care Schedule</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ <strong>Weeks 4-28:</strong> Monthly checkups</li>
                  <li>✓ <strong>Weeks 28-36:</strong> Every 2 weeks</li>
                  <li>✓ <strong>Weeks 36-40:</strong> Weekly visits</li>
                  <li>✓ <strong>After 40 weeks:</strong> Twice weekly monitoring if baby hasn't arrived</li>
                </ul>
              </div>

              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-l-4 border-fuchsia-600">
                <h3 className="text-xl font-bold text-fuchsia-900 dark:text-fuchsia-300 mb-3">🎯 Important Screening Windows</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ <strong>10-13 weeks:</strong> First trimester screening (optional genetic testing)</li>
                  <li>✓ <strong>15-22 weeks:</strong> Second trimester screening options</li>
                  <li>✓ <strong>24-28 weeks:</strong> Glucose tolerance test for gestational diabetes</li>
                  <li>✓ <strong>35-37 weeks:</strong> Group B strep test</li>
                </ul>
              </div>

              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-l-4 border-violet-600">
                <h3 className="text-xl font-bold text-violet-900 dark:text-violet-300 mb-3">🛍️ Planning Milestones</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ <strong>Week 12-14:</strong> Safe to share news after first trimester</li>
                  <li>✓ <strong>Week 18-22:</strong> Plan baby shower (energy is high!)</li>
                  <li>✓ <strong>Week 30-32:</strong> Set up nursery and hospital bag</li>
                  <li>✓ <strong>Week 36:</strong> Finalize birth plan and pediatrician choice</li>
                </ul>
              </div>
            </div>
          </section>



          <section className="bg-gradient-to-r from-rose-50 to-red-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-10 h-10 text-rose-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent m-0">Special Considerations & FAQs</h2>
            </div>
            
            <div className="space-y-6 mt-6">
              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-rose-900 dark:text-rose-300 mb-3">What if I have irregular periods?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Irregular cycles make LMP-based dating less reliable, but not impossible! Track your average cycle length over 3-6 months if possible. Your provider will likely rely more heavily on early ultrasound dating. If you have PCOS or other conditions affecting cycles, early ultrasound becomes even more crucial.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-rose-900 dark:text-rose-300 mb-3">Can I calculate from conception date instead?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Absolutely! If you know your exact conception date (from fertility treatments or if you tracked ovulation), add 266 days (38 weeks) to that date. Just remember that medical professionals will still use gestational age (from LMP) for all documentation and milestones.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-rose-900 dark:text-rose-300 mb-3">What about twins or multiples?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Twin pregnancies typically deliver earlier—around 36-37 weeks for twins, 32-33 weeks for triplets. Your provider will monitor you more closely with more frequent ultrasounds. The due date calculation is the same, but expect early arrival! 👯
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-rose-900 dark:text-rose-300 mb-3">Should I plan for my due date or earlier/later?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Plan to have everything ready by week 36 (nursery, hospital bag, work transition). Statistically, first-time parents average 40 weeks + 5 days, while subsequent pregnancies average 40 weeks + 3 days. Give yourself a 2-week window on either side of your due date for peace of mind!
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-rose-900 dark:text-rose-300 mb-3">Why do some calculators give different dates?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Some calculators use simplified 280-day formulas without cycle adjustment, while others (like ours!) account for your unique cycle length. Medical-grade calculators that adjust for cycle length are more personalized and typically more accurate. Always verify with your healthcare provider!
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent m-0">Beyond the Due Date: What Really Matters</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Here's the beautiful truth: your due date is just a starting point for this incredible journey. What truly matters is the health and wellbeing of both you and your baby. Focus on:
            </p>
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  Prenatal Health
                </h4>
                <p className="text-gray-700 dark:text-gray-300">Regular checkups, prenatal vitamins (especially folic acid!), balanced nutrition, and staying hydrated.</p>
              </div>
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Mental Wellness
                </h4>
                <p className="text-gray-700 dark:text-gray-300">Managing stress, building your support system, and addressing anxiety or depression with your provider.</p>
              </div>
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Gentle Movement
                </h4>
                <p className="text-gray-700 dark:text-gray-300">Safe exercise approved by your provider—walking, prenatal yoga, swimming all help with labor preparation.</p>
              </div>
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                  <Baby className="w-5 h-5 text-green-600" />
                  Education
                </h4>
                <p className="text-gray-700 dark:text-gray-300">Childbirth classes, breastfeeding resources, and learning about newborn care build confidence!</p>
              </div>
            </div>
          </section>
        </div>

        <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <summary className="text-xl font-bold cursor-pointer">🤰 Naegele's Rule Explained</summary>
          <div className="mt-4 space-y-3 text-sm">
            <p><strong>Formula:</strong> EDD = LMP + 280 days + (cycle_length - 28 days)</p>
            <p>Standard pregnancy is 40 weeks (280 days) from LMP. The formula adjusts for non-28-day cycles.</p>
            <p>Gestational age is calculated from LMP, not conception (which typically occurs ~2 weeks later).</p>
          </div>
        </details>

        <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <summary className="text-xl font-bold cursor-pointer">📅 Trimesters & Milestones</summary>
          <div className="mt-4 space-y-2 text-sm">
            <p><strong>1st Trimester (0-13 weeks):</strong> Organ formation, highest miscarriage risk</p>
            <p><strong>2nd Trimester (14-26 weeks):</strong> Growth, movement felt, anatomy scan</p>
            <p><strong>3rd Trimester (27-40 weeks):</strong> Rapid growth, preparation for birth</p>
          </div>
        </details>

        <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <summary className="text-xl font-bold cursor-pointer">❓ Quick FAQ</summary>
          <div className="mt-4 space-y-3">
            <div>
              <h4 className="font-bold">Q: How accurate is this?</h4>
              <p className="text-sm">A: ±1-2 weeks. Early ultrasound (6-12 weeks) is more accurate than LMP dating.</p>
            </div>
            <div>
              <h4 className="font-bold">Q: What if I don't know my LMP?</h4>
              <p className="text-sm">A: Use ultrasound dating. Your provider can estimate from scan measurements.</p>
            </div>
            <div>
              <h4 className="font-bold">Q: Can my due date change?</h4>
              <p className="text-sm">A: Yes, providers may adjust based on ultrasound, typically in the first trimester.</p>
            </div>
          </div>
        </details>
      </div>
    </CalculatorLayoutWithAds>
  );
}
