import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Copy, Calendar, Heart, Sparkles, TrendingUp, CheckCircle2, AlertCircle, Activity, Clock } from 'lucide-react';
import HealthSocialShare from '@/components/health/HealthSocialShare';
import CalculatorLayoutWithAds from '@/components/CalculatorLayoutWithAds';
import { calculateOvulation } from '@/lib/health/ovulation';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InFeedAd from '@/components/ads/InFeedAd';
import MidContentAd from '@/components/ads/MidContentAd';

export default function OvulationCalculator() {
  const [lmpDate, setLmpDate] = useState<string>('2025-01-01');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [lutealLength, setLutealLength] = useState<number>(14);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const calculate = () => {
    setError('');
    try {
      const lmp = new Date(lmpDate);
      const res = calculateOvulation({ lmpDate: lmp, cycleLength, lutealLength });
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
    const text = `Ovulation: ${formatDate(result.ovulationDate)}\nFertile Window: ${formatDate(result.fertileWindowStart)} - ${formatDate(result.fertileWindowEnd)}`;
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <CalculatorLayoutWithAds
      title="Ovulation & Fertile Window Calculator"
      description="Predict your ovulation date and fertile window based on menstrual cycle length and luteal phase."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert className="animate-in slide-in-from-top duration-500">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Assumptions & Accuracy:</strong> Uses cycle length - luteal phase heuristic. Individual cycles vary. Use ovulation tests or tracking for confirmation.
          </AlertDescription>
        </Alert>

        <Card className="p-6 bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 shadow-lg border-2 border-purple-200 dark:border-purple-800 animate-in fade-in duration-700">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-purple-600 animate-pulse" />
              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300">Track Your Cycle</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lmp" className="text-base font-semibold">First Day of Last Period (LMP)</Label>
              <Input 
                id="lmp" 
                type="date" 
                value={lmpDate} 
                onChange={(e) => setLmpDate(e.target.value)}
                className="border-2 border-purple-300 focus:border-purple-500 transition-all duration-300"
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
                className="border-2 border-fuchsia-300 focus:border-fuchsia-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="luteal" className="text-base font-semibold">Luteal Phase Length (days)</Label>
              <Input
                id="luteal"
                type="number"
                value={lutealLength}
                onChange={(e) => setLutealLength(parseInt(e.target.value) || 14)}
                min={12}
                max={16}
                className="border-2 border-pink-300 focus:border-pink-500 transition-all duration-300"
              />
              <p className="text-xs text-gray-500">Default 14 days. Adjust if known.</p>
            </div>
            <Button onClick={calculate} className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Sparkles className="w-5 h-5 mr-2" />
              Calculate My Fertile Window
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
              <Calendar className="text-purple-600 w-8 h-8 animate-bounce" />
              <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Your Fertility Results</span>
            </h3>
            <div className="text-center p-8 bg-white dark:bg-gray-700 rounded-xl mb-4 shadow-lg border-2 border-purple-200 transform hover:scale-105 transition-all duration-300">
              <p className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Predicted Ovulation Date</p>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mt-2">
                {formatDate(result.ovulationDate)}
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-red-500 animate-pulse" />
                <span className="text-sm text-gray-500">Your peak fertility day!</span>
                <Heart className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
            </div>
            <div className="p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:bg-gray-700 rounded-xl shadow-lg border-2 border-green-300">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6 text-green-600 animate-pulse" />
                <p className="font-bold text-lg text-green-900 dark:text-green-300">Fertile Window (Best Time to Conceive)</p>
              </div>
              <p className="text-2xl text-center my-4">
                <span className="font-bold text-green-700 dark:text-green-400">{formatDate(result.fertileWindowStart)}</span>
                <span className="text-gray-400 mx-3">→</span>
                <span className="font-bold text-green-700 dark:text-green-400">{formatDate(result.fertileWindowEnd)}</span>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center bg-white dark:bg-gray-800 p-3 rounded-lg">
                💡 Sperm can survive ~5 days; egg survives ~24 hours. This 6-day window gives you the best conception chances!
              </p>
            </div>
            <div className="flex gap-2 mt-4 mb-4">
              <Button onClick={copyResults} variant="outline" size="sm" className="hover:bg-purple-100 transition-colors duration-300">
                <Copy className="w-4 h-4 mr-2" /> Copy Results
              </Button>
            </div>
            <Card className="p-6 bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-700 shadow-lg">
              <HealthSocialShare
                title="Ovulation & Fertility Calculator"
                resultText={`Tracking my fertility window! 📅 Knowledge is power for family planning. #fertility #ovulation #familyplanning #health`}
                hashtags={['fertility', 'ovulation', 'familyplanning', 'health', 'ttc']}
                category="health"
              />
            </Card>
          </Card>
        )}

        <InFeedAd className="my-8" />

        <div className="prose prose-lg max-w-none space-y-8 mt-12">
          <section className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-10 h-10 text-purple-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent m-0">Understanding Your Ovulation Cycle</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to the fascinating world of fertility tracking! 🌸 Whether you're trying to conceive (TTC), avoiding pregnancy naturally, or simply getting to know your body better, understanding ovulation is your superpower. Our ovulation calculator uses science-backed methods to predict your most fertile days, giving you the knowledge to make informed decisions about your reproductive health.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              Ovulation is the main event of your menstrual cycle—the moment when a mature egg is released from your ovary, ready for fertilization. This tiny window (just 12-24 hours!) is when conception is possible. But here's the exciting part: sperm can survive in your reproductive tract for up to 5 days, creating a <strong>6-day fertile window</strong> where intercourse can lead to pregnancy. Let's dive deep into how this all works! ✨
            </p>
          </section>

          <MidContentAd />

          <section className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-teal-200">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-10 h-10 text-teal-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent m-0">The Science Behind Ovulation</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Your menstrual cycle is an intricate dance of hormones, each playing a crucial role in preparing your body for potential pregnancy. Let's break down what happens during a typical cycle:
            </p>

            <div className="mt-6 space-y-6">
              <div className="p-6 bg-gradient-to-r from-pink-100 to-rose-100 dark:bg-gray-700 rounded-xl border-l-4 border-pink-600">
                <h3 className="text-2xl font-bold text-pink-900 dark:text-pink-300 mb-3 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Menstrual Phase (Days 1-5)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>What's Happening:</strong> Day 1 is the first day of your period. The uterine lining (endometrium) that built up during the previous cycle sheds because no pregnancy occurred. Hormone levels (estrogen and progesterone) are at their lowest.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Fertility Status:</strong> Very low chance of conception during menstruation, though sperm can survive until ovulation in longer cycles.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-r from-violet-100 to-purple-100 dark:bg-gray-700 rounded-xl border-l-4 border-violet-600">
                <h3 className="text-2xl font-bold text-violet-900 dark:text-violet-300 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Follicular Phase (Days 1-13)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>What's Happening:</strong> This phase overlaps with menstruation and continues after bleeding stops. Your pituitary gland releases FSH (follicle-stimulating hormone), which stimulates your ovaries to grow 5-20 tiny follicles. Each follicle contains an immature egg. Eventually, one dominant follicle emerges!
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>Hormones at Work:</strong> Estrogen rises as follicles mature, thickening the uterine lining and making cervical mucus more sperm-friendly (thin, clear, stretchy—like egg whites).
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Fertility Status:</strong> Fertility increases toward the end of this phase. The fertile window typically begins 5 days before ovulation.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-r from-fuchsia-100 to-pink-100 dark:bg-gray-700 rounded-xl border-l-4 border-fuchsia-600">
                <h3 className="text-2xl font-bold text-fuchsia-900 dark:text-fuchsia-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Ovulation (Day 14 in a 28-day cycle)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>What's Happening:</strong> The star of the show! When estrogen peaks, it triggers a surge of LH (luteinizing hormone) from your pituitary gland. This LH surge causes the dominant follicle to rupture and release its egg into the fallopian tube. The egg begins its journey toward the uterus, and the 12-24 hour fertilization window opens! 🥚✨
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>Physical Signs:</strong> Many people experience mittelschmerz (ovulation pain—a sharp twinge on one side), increased sex drive, clearer skin, and that telltale egg-white cervical mucus.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Fertility Status:</strong> PEAK FERTILITY! This is THE day, along with the 2-3 days before ovulation, when conception is most likely.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-r from-amber-100 to-yellow-100 dark:bg-gray-700 rounded-xl border-l-4 border-amber-600">
                <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Luteal Phase (Days 15-28)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>What's Happening:</strong> After releasing the egg, the ruptured follicle transforms into the corpus luteum ("yellow body"), which produces progesterone. This hormone prepares the uterine lining for embryo implantation and keeps it thick and nourishing.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>Two Possible Outcomes:</strong>
                  <br />• If fertilization occurs, the developing embryo produces hCG (pregnancy hormone), which tells the corpus luteum to keep making progesterone. You're pregnant! 🎉
                  <br />• If no fertilization occurs, the corpus luteum breaks down after ~14 days, progesterone drops, and the uterine lining sheds—hello, next period!
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Fertility Status:</strong> Essentially zero after the egg dies (24 hours post-ovulation). The luteal phase length is remarkably consistent (12-16 days, usually 14) for most people.
                </p>
              </div>
            </div>

            <div className="mt-6 p-6 bg-gradient-to-r from-blue-100 to-indigo-100 dark:bg-gray-700 rounded-xl border-2 border-blue-400">
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">🧮 How Our Calculator Works</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>The Formula:</strong> Ovulation Day = Cycle Length - Luteal Phase Length
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                For example: 28-day cycle - 14-day luteal phase = Day 14 ovulation
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Fertile Window:</strong> We calculate 5 days before ovulation (when sperm can already be waiting) through ovulation day itself (when the egg is available), giving you a 6-day window of opportunity!
              </p>
            </div>
          </section>

          <section className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent m-0">Understanding Your Luteal Phase</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              The luteal phase is the secret ingredient to accurate ovulation prediction! Unlike the follicular phase (which can vary wildly from cycle to cycle and person to person), the luteal phase is remarkably stable. Here's everything you need to know:
            </p>

            <div className="mt-6 space-y-4">
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">📏 Typical Length</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Most people have a luteal phase between 12-16 days, with 14 days being the most common. This consistency is why we can work backward from your expected period to predict ovulation! If you have a 30-day cycle with a 14-day luteal phase, you ovulate on day 16 (30 - 14 = 16).
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">🔍 How to Find Your Luteal Phase Length</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>Option 1 - Basal Body Temperature (BBT) Tracking:</strong> Your temperature rises 0.5-1°F after ovulation and stays elevated until your period. Count the days from the temperature shift until your period starts—that's your luteal phase!
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>Option 2 - Ovulation Predictor Kits (OPKs):</strong> These detect the LH surge that happens 24-36 hours before ovulation. Once you get a positive, count the days until your period arrives.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Option 3 - Default to 14 Days:</strong> If you don't know your luteal phase, using the standard 14 days is a great starting point! Most fertility awareness methods and apps use this as default.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">⚠️ Short Luteal Phase (Luteal Phase Defect)</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  A luteal phase shorter than 10 days may make conception difficult because the uterine lining doesn't have enough time to properly develop for implantation. If you suspect this, talk to your healthcare provider—it's often treatable with progesterone supplementation!
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">✨ Why It Matters for Calculation Accuracy</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Since your luteal phase length is consistent cycle to cycle (unlike your follicular phase, which can vary), it's the KEY to predicting ovulation! Someone with 35-day cycles and a 14-day luteal phase ovulates on day 21, while someone with 26-day cycles ovulates on day 12—both with the same luteal phase!
                </p>
              </div>
            </div>
          </section>

          <MidContentAd />

          <section className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-violet-200">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-10 h-10 text-violet-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent m-0">Maximizing Your Chances of Conception</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Now that you know WHEN ovulation happens, let's talk about HOW to optimize your fertility! Here are expert-backed strategies for making the most of your fertile window:
            </p>

            <div className="mt-6 space-y-6">
              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-l-4 border-violet-600">
                <h3 className="text-2xl font-bold text-violet-900 dark:text-violet-300 mb-3">🎯 Timing is Everything</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>Best Days for Intercourse:</strong> The 2-3 days BEFORE ovulation have the highest conception rates (about 30% per cycle for healthy couples under 35). Why? Sperm are already waiting when the egg arrives!
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>Frequency Recommendation:</strong> Every other day during your fertile window is ideal. This gives sperm count time to replenish while ensuring sperm are always available. Daily is fine too if preferred!
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Don't Stress Timing TOO Much:</strong> Frequent intercourse throughout your cycle (2-3 times per week) ensures you hit the fertile window even if calculations are slightly off!
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-l-4 border-fuchsia-600">
                <h3 className="text-2xl font-bold text-fuchsia-900 dark:text-fuchsia-300 mb-3">🔬 Cervical Mucus: Your Body's Fertility Signal</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Your cervical mucus changes throughout your cycle in response to estrogen. Learning to "read" it gives you real-time fertility information! Here's what to look for:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-6">
                  <li>✓ <strong>Post-period (dry days):</strong> Little to no mucus—low fertility</li>
                  <li>✓ <strong>Sticky/tacky:</strong> White or yellowish, breaks easily—fertility increasing</li>
                  <li>✓ <strong>Creamy:</strong> Like lotion, smooth—fertility rising</li>
                  <li>✓ <strong>Egg white (EWCM):</strong> Clear, stretchy, slippery—PEAK FERTILITY! 🥚 This is prime time!</li>
                  <li>✓ <strong>Watery:</strong> Clear and wet—very fertile</li>
                  <li>✓ <strong>Post-ovulation:</strong> Dries up quickly as progesterone rises—fertility window closed</li>
                </ul>
              </div>

              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-l-4 border-pink-600">
                <h3 className="text-2xl font-bold text-pink-900 dark:text-pink-300 mb-3">🌡️ Basal Body Temperature (BBT) Tracking</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Your resting body temperature rises 0.5-1°F (0.3-0.6°C) after ovulation due to progesterone and stays elevated until your next period. While BBT confirms ovulation AFTER it happens (so it's not useful for predicting in real-time), tracking for 2-3 cycles reveals your patterns!
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>How to Track:</strong> Take your temperature first thing every morning before getting out of bed, at the same time each day. Use a basal thermometer (more precise than regular thermometers). Chart it for a few cycles to identify your luteal phase length!
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-l-4 border-purple-600">
                <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-3">🧪 Ovulation Predictor Kits (OPKs)</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  These work like pregnancy tests but detect the LH surge that triggers ovulation. A positive OPK means ovulation will likely occur in 24-36 hours—time to get busy! 😉
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>When to Start Testing:</strong> Begin testing a few days before your expected ovulation (use our calculator to estimate!). Test once or twice daily. When you get your positive, you're in the prime fertile window!
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-10 h-10 text-amber-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent m-0">Lifestyle Factors That Impact Fertility</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Beyond timing, optimizing your overall health significantly impacts fertility for both partners! Here's what the science says:
            </p>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  Maintain Healthy Weight
                </h4>
                <p className="text-gray-700 dark:text-gray-300">Both underweight (BMI &lt; 18.5) and overweight (BMI &gt; 30) can disrupt ovulation. Even losing or gaining 5-10% of body weight can restore regular cycles!</p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  Reduce Stress
                </h4>
                <p className="text-gray-700 dark:text-gray-300">Chronic stress can delay ovulation or suppress it entirely. Practice meditation, yoga, or whatever helps you unwind. TTC is stressful enough—be kind to yourself! 💕</p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  Quit Smoking
                </h4>
                <p className="text-gray-700 dark:text-gray-300">Smoking accelerates egg loss and damages egg quality. It also reduces sperm quality in male partners. Quitting improves fertility within months!</p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  Limit Alcohol & Caffeine
                </h4>
                <p className="text-gray-700 dark:text-gray-300">Heavy drinking reduces fertility. Moderate caffeine (200mg/day, ~2 cups coffee) is generally safe. Stay hydrated with water!</p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  Take Prenatal Vitamins
                </h4>
                <p className="text-gray-700 dark:text-gray-300">Start taking 400-800mcg folic acid daily BEFORE conception to prevent neural tube defects. Many prenatals include CoQ10, vitamin D, and omega-3s for fertility support!</p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  Exercise Moderately
                </h4>
                <p className="text-gray-700 dark:text-gray-300">Regular moderate exercise (30 min most days) boosts fertility. Excessive high-intensity exercise (&gt;7 hours/week) can suppress ovulation—balance is key!</p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  Avoid Endocrine Disruptors
                </h4>
                <p className="text-gray-700 dark:text-gray-300">BPA, phthalates, and pesticides can interfere with hormones. Choose glass/stainless steel containers, organic produce when possible, and natural personal care products.</p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  Optimize Sleep
                </h4>
                <p className="text-gray-700 dark:text-gray-300">7-9 hours of quality sleep regulates reproductive hormones. Irregular sleep schedules and shift work can disrupt ovulation—aim for consistency!</p>
              </div>
            </div>
          </section>

          <InFeedAd className="my-8" />

          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-10 h-10 text-blue-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent m-0">When to Seek Help: Fertility Red Flags</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Most healthy couples conceive within 6-12 months of trying. But sometimes, medical help can make all the difference. Here's when to consult a fertility specialist:
            </p>

            <div className="space-y-4">
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md border-l-4 border-blue-600">
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-2">⏰ Time-Based Guidelines</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-6">
                  <li>✓ <strong>Under 35:</strong> Seek help after 12 months of trying without success</li>
                  <li>✓ <strong>35-40:</strong> Seek help after 6 months (egg quality declines with age)</li>
                  <li>✓ <strong>Over 40:</strong> Seek help immediately when you start trying</li>
                </ul>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md border-l-4 border-indigo-600">
                <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-2">🚩 Concerning Symptoms (Seek Help Sooner)</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-6">
                  <li>✓ Irregular or absent periods (oligomenorrhea or amenorrhea)</li>
                  <li>✓ Very painful periods (possible endometriosis)</li>
                  <li>✓ History of pelvic infections or STIs</li>
                  <li>✓ Diagnosed PCOS, endometriosis, or thyroid disorders</li>
                  <li>✓ Multiple miscarriages (2 or more)</li>
                  <li>✓ Known male factor issues (low sperm count, erectile dysfunction)</li>
                  <li>✓ Prior cancer treatment (chemotherapy/radiation)</li>
                </ul>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md border-l-4 border-purple-600">
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2">💊 What to Expect from Fertility Testing</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>For the ovulating partner:</strong> Blood tests (hormone levels: FSH, LH, AMH, progesterone, thyroid), ultrasound (to check ovarian reserve and uterine health), HSG (hysterosalpingogram—checks if fallopian tubes are open).
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>For the sperm-producing partner:</strong> Semen analysis (checks count, motility, morphology). This is non-invasive and should always be done early in fertility workups!
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-rose-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent m-0">Using Ovulation Tracking for Birth Control</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              While our calculator is popular for conception planning, ovulation tracking is also used by many for natural family planning (NFP) or the Fertility Awareness Method (FAM). Here's what you need to know if avoiding pregnancy:
            </p>

            <div className="mt-6 p-6 bg-yellow-100 dark:bg-yellow-900 rounded-xl border-2 border-yellow-400">
              <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-200 mb-3">⚠️ Important Disclaimer</h3>
              <p className="text-gray-800 dark:text-gray-200">
                Using ovulation tracking alone for birth control has a typical-use failure rate of 12-24% per year. To use FAM effectively, you must track MULTIPLE fertility signs (BBT, cervical mucus, LH testing) and abstain or use barrier methods during your entire fertile window plus a safety buffer. This requires training, discipline, and regular cycles. If pregnancy would be problematic, consider using FAM alongside barrier methods or choose a more reliable contraceptive method.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-rose-900 dark:text-rose-300 mb-2">📚 Best Practices for FAM</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-6">
                  <li>✓ Track at least 3 fertility signs (BBT, cervical mucus, cycle length)</li>
                  <li>✓ Use confirmed ovulation (BBT rise for 3 days) before resuming unprotected sex</li>
                  <li>✓ Add buffer days before and after your fertile window estimate</li>
                  <li>✓ Take a class or work with a FAM instructor—this isn't DIY territory!</li>
                  <li>✓ Have backup contraception available</li>
                  <li>✓ Be aware this method doesn't protect against STIs</li>
                </ul>
              </div>

              <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h4 className="font-bold text-rose-900 dark:text-rose-300 mb-2">❌ When FAM Isn't Appropriate</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-6">
                  <li>✗ Irregular cycles (makes prediction unreliable)</li>
                  <li>✗ Postpartum (before cycles resume)</li>
                  <li>✗ Perimenopause (erratic ovulation)</li>
                  <li>✗ After stopping hormonal birth control (cycles may be irregular for months)</li>
                  <li>✗ During breastfeeding (can suppress/delay ovulation unpredictably)</li>
                  <li>✗ Chronic illness or medications affecting cycles</li>
                </ul>
              </div>
            </div>
          </section>

          <MidContentAd />

          <section className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-cyan-200">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-10 h-10 text-cyan-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent m-0">Irregular Cycles & Special Situations</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Not everyone has textbook 28-day cycles, and that's completely normal! Here's how to handle common variations:
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-l-4 border-cyan-600">
                <h3 className="text-2xl font-bold text-cyan-900 dark:text-cyan-300 mb-3">🔄 PCOS (Polycystic Ovary Syndrome)</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  PCOS affects 1 in 10 women and causes irregular ovulation or anovulation (no ovulation). Cycles may be very long (35+ days), unpredictable, or absent. High androgens can cause acne and excess hair growth.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Tracking with PCOS:</strong> Calendar prediction is unreliable—use OPKs and cervical mucus monitoring. Your provider may prescribe medications like Clomid or Letrozole to induce ovulation, making tracking easier!
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-l-4 border-teal-600">
                <h3 className="text-2xl font-bold text-teal-900 dark:text-teal-300 mb-3">🤱 Breastfeeding & Postpartum</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Breastfeeding can suppress ovulation for months (lactational amenorrhea), but this is highly variable! Some people ovulate before their first postpartum period returns, meaning you CAN get pregnant while breastfeeding.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Tracking Postpartum:</strong> Watch for cervical mucus changes signaling fertility's return. If TTC, night weaning and reducing feeding frequency may help ovulation resume. If avoiding pregnancy, use contraception—don't rely on breastfeeding alone!
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-l-4 border-indigo-600">
                <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300 mb-3">💊 Coming Off Hormonal Birth Control</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  After stopping the pill, patch, or ring, it can take 1-3 months for ovulation to resume regularly. Some people ovulate immediately! After Depo-Provera injections, it may take 6-18 months for fertility to return.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Tracking Post-Birth Control:</strong> Your first few cycles may be irregular. Use OPKs and cervical mucus to confirm ovulation rather than relying solely on calendar predictions.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-l-4 border-purple-600">
                <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-3">🌡️ Thyroid Disorders</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Both hypothyroidism (underactive) and hyperthyroidism (overactive) can disrupt ovulation and cause irregular periods. Thyroid hormones directly influence reproductive hormones!
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Solution:</strong> If you have irregular cycles, ask your provider to check TSH, free T4, and thyroid antibodies. Once thyroid levels are optimized with medication, cycles typically regulate and ovulation tracking becomes effective!
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border-2 border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-10 h-10 text-emerald-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent m-0">Your Fertility Journey: Final Thoughts</h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Understanding your ovulation cycle is empowering, whether you're trying to conceive, avoid pregnancy, or simply learn more about your body's rhythms. Remember that conception is a probability game—even with perfect timing, healthy couples in their 20s only have about a 20-25% chance of conceiving per cycle. It's a marathon, not a sprint! 🏃‍♀️
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              Be patient with yourself and your body. Track your patterns for 2-3 cycles to truly understand YOUR unique fertility signs. Use our calculator as a helpful guide, but listen to your body's signals too. And most importantly, enjoy the journey—whether that's the excitement of trying for a baby, the relief of understanding your natural family planning options, or the simple satisfaction of being in tune with your reproductive health. You've got this! 💪✨
            </p>

            <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:bg-gray-700 rounded-xl border-2 border-green-400">
              <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-3">🌟 Quick Recap: Key Takeaways</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-6">
                <li>✓ Ovulation typically occurs 12-16 days BEFORE your next period (luteal phase = constant)</li>
                <li>✓ Your fertile window is 6 days: 5 days before ovulation + ovulation day</li>
                <li>✓ Best conception chances: 2-3 days BEFORE ovulation</li>
                <li>✓ Track multiple signs (cervical mucus, OPKs, BBT) for best accuracy</li>
                <li>✓ Healthy lifestyle choices improve fertility for both partners</li>
                <li>✓ Seek help after 12 months if under 35, 6 months if 35-40, or immediately if over 40</li>
                <li>✓ Irregular cycles require extra tools (OPKs, BBT) beyond calendar tracking</li>
                <li>✓ Only 5% of babies arrive on "due dates"—be flexible and patient!</li>
              </ul>
            </div>
          </section>
        </div>

        <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <summary className="text-xl font-bold cursor-pointer">🥚 How Ovulation Works</summary>
          <div className="mt-4 space-y-3 text-sm">
            <p><strong>Ovulation:</strong> Release of an egg from the ovary, typically 12-16 days before next period.</p>
            <p><strong>Formula:</strong> Ovulation Day = Cycle Length - Luteal Phase Length</p>
            <p><strong>Fertile Window:</strong> 5 days before ovulation + day of ovulation (sperm survival + egg lifespan)</p>
          </div>
        </details>

        <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <summary className="text-xl font-bold cursor-pointer">🔬 Improving Accuracy</summary>
          <div className="mt-4 space-y-2 text-sm">
            <p>✓ Track basal body temperature (BBT) - rises 0.5-1°F after ovulation</p>
            <p>✓ Use ovulation predictor kits (OPKs) - detect LH surge 24-36h before</p>
            <p>✓ Monitor cervical mucus - becomes clear, stretchy ("egg white") at ovulation</p>
            <p>✓ Track cycle length for 3+ months to find your average</p>
          </div>
        </details>

        <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <summary className="text-xl font-bold cursor-pointer">❓ Quick FAQ</summary>
          <div className="mt-4 space-y-3">
            <div>
              <h4 className="font-bold">Q: My cycles are irregular. Will this work?</h4>
              <p className="text-sm">A: Predictions are less accurate with irregular cycles. Use OPKs or consult a provider.</p>
            </div>
            <div>
              <h4 className="font-bold">Q: What is the luteal phase?</h4>
              <p className="text-sm">A: Time from ovulation to next period. Usually 12-16 days, most commonly 14 days.</p>
            </div>
            <div>
              <h4 className="font-bold">Q: Can I get pregnant outside the fertile window?</h4>
              <p className="text-sm">A: Highly unlikely. Sperm survive max ~5 days; egg survives ~24 hours.</p>
            </div>
          </div>
        </details>
      </div>
    </CalculatorLayoutWithAds>
  );
}
