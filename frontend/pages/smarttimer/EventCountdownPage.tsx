import { useEffect, useState, useRef } from 'react';
import { Calendar, Clock, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SmartTimerLayout } from '../../components/SmartTimerLayout';
import AutoAdSlot from '../../components/ads/AutoAdSlot';
import AmazonAffiliate from '../../components/ads/AmazonAffiliate';
import { useTimerStore } from '../../stores/timerStore';
import { useFullscreen } from '../../hooks/useKeyboardShortcuts';

export default function EventCountdownPage() {
  const { eventDate, eventName, setEventDate, setEventName, clearEvent, branding } = useTimerStore();
  const [localEventName, setLocalEventName] = useState(eventName || '');
  const [localDate, setLocalDate] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const timerDisplayRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen, isSupported: isFullscreenSupported } = useFullscreen(timerDisplayRef);

  useEffect(() => {
    if (!eventDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(eventDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate]);

  const handleSetEvent = () => {
    if (localEventName && localDate) {
      const dateTimeString = localTime ? `${localDate}T${localTime}` : `${localDate}T00:00`;
      const date = new Date(dateTimeString);
      setEventDate(date);
      setEventName(localEventName);
    }
  };

  const isPast = eventDate && new Date(eventDate).getTime() <= new Date().getTime();

  return (
    <SmartTimerLayout
      title="Event Countdown"
      description="Count down to important events, deadlines, launches, and special occasions. Never miss a milestone with our event countdown timer."
      keywords="event countdown, countdown to date, days until, event timer, deadline countdown"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!eventDate ? (
            <Card className="backdrop-blur-xl bg-card/50 border-2">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Set Your Event</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event-name">Event Name</Label>
                    <Input
                      id="event-name" value={localEventName}
                      onChange={(e) => setLocalEventName(e.target.value)}
                      placeholder="e.g., Product Launch, Birthday, Wedding"
                      className="text-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-date">Date</Label>
                      <Input id="event-date" type="date" value={localDate} onChange={(e) => setLocalDate(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="event-time">Time (optional)</Label>
                      <Input id="event-time" type="time" value={localTime} onChange={(e) => setLocalTime(e.target.value)} />
                    </div>
                  </div>
                  <Button
                    size="lg" className="w-full text-lg" onClick={handleSetEvent}
                    disabled={!localEventName || !localDate}
                    style={{ backgroundColor: branding.themeColor }}
                  >
                    Start Countdown
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card 
              ref={timerDisplayRef}
              className={`backdrop-blur-xl bg-card/50 border-2 shadow-2xl transition-all ${
                isFullscreen ? 'bg-background border-0' : ''
              }`}
            >
              <CardContent className={`${isFullscreen ? 'p-0 h-screen flex items-center justify-center' : 'p-8 md:p-12'}`}>
                <div className={`text-center space-y-8 ${isFullscreen ? 'w-full max-w-6xl' : ''}`}>
                  <div>
                    <h2 className={`font-bold mb-2 ${isFullscreen ? 'text-6xl' : 'text-3xl md:text-4xl'}`}>{eventName}</h2>
                    {!isFullscreen && (
                      <p className="text-muted-foreground">
                        <Calendar className="inline w-4 h-4 mr-2" />
                        {new Date(eventDate).toLocaleDateString(undefined, { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                        {new Date(eventDate).toLocaleTimeString() !== '12:00:00 AM' && (
                          <><Clock className="inline w-4 h-4 ml-4 mr-2" />{new Date(eventDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</>
                        )}
                      </p>
                    )}
                  </div>

                  <div key={isPast ? 'past' : 'future'}>
                    {isPast ? (
                      <div className={`font-bold text-red-500 ${isFullscreen ? 'text-6xl' : 'text-4xl'}`}>Event Has Passed!</div>
                    ) : (
                      <div className={`grid grid-cols-4 ${isFullscreen ? 'gap-8' : 'gap-4'}`}>
                        {[
                          { label: 'Days', value: timeRemaining.days },
                          { label: 'Hours', value: timeRemaining.hours },
                          { label: 'Minutes', value: timeRemaining.minutes },
                          { label: 'Seconds', value: timeRemaining.seconds }
                        ].map((unit) => (
                          <div key={unit.label} className={`backdrop-blur-sm bg-card/30 rounded-2xl border-2 ${
                            isFullscreen ? 'p-12' : 'p-6'
                          }`}>
                            <div className={`font-bold font-mono ${
                              isFullscreen ? 'text-9xl' : 'text-5xl md:text-6xl'
                            }`} style={{ color: branding.themeColor }}>
                              {unit.value.toString().padStart(2, '0')}
                            </div>
                            <div className={`text-muted-foreground mt-2 uppercase tracking-wider ${
                              isFullscreen ? 'text-2xl' : 'text-sm'
                            }`}>{unit.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button variant="outline" size="lg" onClick={clearEvent}>
                      Change Event
                    </Button>
                    {isFullscreenSupported && (
                      <Button 
                        variant="ghost" 
                        size="lg" 
                        onClick={toggleFullscreen}
                        className={isFullscreen ? 'w-20 h-20' : ''}
                      >
                        <Maximize className={isFullscreen ? 'w-8 h-8' : 'w-5 h-5'} />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <AutoAdSlot placement="mid-content" className="my-8" />

          <Card className="backdrop-blur-xl bg-card/50 border-2">
            <CardContent className="p-6 md:p-8 prose prose-sm max-w-none dark:prose-invert">
              <div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ⏰ The Complete Guide to Event Countdown Timers: Make Every Moment Count
                </h2>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-xl mb-6 border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-lg font-semibold mb-2">✨ The Psychology of Anticipation</p>
                  <p className="text-base">Research shows that anticipating positive events can boost happiness levels by up to 25%! A countdown timer transforms waiting from passive anxiety into active excitement, creating emotional momentum toward your special moment.</p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-blue-700 dark:text-blue-400">🎯 Why Event Countdowns Are More Than Just Numbers</h3>
                <p className="text-base leading-relaxed">
                  In our fast-paced digital world, time can feel abstract and slippery. Event countdown timers provide something powerful: tangible visualization of time's passage. Whether you're counting down to a product launch that could change your business, a wedding that represents years of love, or a vacation you've been dreaming about for months, seeing the days, hours, minutes, and seconds tick away creates an emotional connection to the future.
                </p>
                
                <p className="text-base leading-relaxed mt-4">
                  The magic happens in your brain's reward centers. Every glance at a decreasing countdown triggers a tiny dopamine release—your brain's way of saying "something good is coming!" This neurological response builds genuine excitement and helps you stay motivated through preparation periods that might otherwise feel overwhelming.
                </p>

                <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-xl my-6 border-l-4 border-green-500">
                  <h4 className="font-bold text-lg mb-3 text-green-700 dark:text-green-400">🧠 The Neuroscience of Countdown Excitement</h4>
                  <p className="text-sm leading-relaxed">
                    Neuroscientists have discovered that anticipation of positive events activates the same brain regions as actually experiencing them. This "pre-enjoyment" can sometimes be even more pleasurable than the event itself! By visualizing your countdown daily, you're essentially extending the joy of your special moment across weeks or months, rather than limiting it to a single day.
                  </p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-blue-700 dark:text-blue-400">🌟 Creative Ways to Use Event Countdown Timers</h3>
                
                <div className="space-y-4 my-6">
                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-pink-500"
                  >
                    <h4 className="font-bold text-lg mb-2">💕 Personal Milestones & Celebrations</h4>
                    <p className="text-sm mb-3">Transform ordinary waiting into extraordinary anticipation:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Weddings:</strong> Build excitement for your big day while keeping track of vendor deadlines and final preparations</li>
                      <li>• <strong>Anniversaries:</strong> Celebrate relationship milestones by counting down to each year together</li>
                      <li>• <strong>Birthdays:</strong> Make "birthday month" official by watching the countdown from 30 days out</li>
                      <li>• <strong>Baby Due Dates:</strong> Track pregnancy milestones and prepare for your new arrival with visual time tracking</li>
                      <li>• <strong>Graduations:</strong> Build momentum toward your achievement and keep study motivation high</li>
                    </ul>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-blue-500"
                  >
                    <h4 className="font-bold text-lg mb-2">🚀 Business & Professional Events</h4>
                    <p className="text-sm mb-3">Create urgency and maintain team focus:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Product Launches:</strong> Rally your team around launch day with a visible countdown in your workspace</li>
                      <li>• <strong>Campaign Deadlines:</strong> Keep marketing campaigns on track with time-sensitive countdowns</li>
                      <li>• <strong>Conference Presentations:</strong> Build preparation urgency without last-minute panic</li>
                      <li>• <strong>Funding Rounds:</strong> Maintain investor pitch readiness by tracking closing dates</li>
                      <li>• <strong>Project Deliverables:</strong> Transform abstract deadlines into concrete, visible time pressure</li>
                      <li>• <strong>Quarterly Reviews:</strong> Prepare thoroughly by watching the countdown from weeks out</li>
                    </ul>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-purple-500"
                  >
                    <h4 className="font-bold text-lg mb-2">✈️ Travel & Adventure Countdowns</h4>
                    <p className="text-sm mb-3">Maximize pre-trip excitement and preparation:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Vacations:</strong> Extend the joy of your trip by savoring the countdown for weeks beforehand</li>
                      <li>• <strong>Study Abroad Programs:</strong> Build anticipation while staying on top of visa and preparation deadlines</li>
                      <li>• <strong>Sabbaticals:</strong> Plan your break thoroughly while watching the countdown to freedom</li>
                      <li>• <strong>Adventure Races:</strong> Track training time and maintain peak motivation through visual countdown</li>
                      <li>• <strong>Music Festivals:</strong> Count down to your favorite artists while coordinating group travel plans</li>
                    </ul>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-orange-500"
                  >
                    <h4 className="font-bold text-lg mb-2">🏆 Goal Achievement & Personal Development</h4>
                    <p className="text-sm mb-3">Create powerful deadline pressure for self-improvement:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Fitness Competitions:</strong> Track training days remaining until your marathon, triathlon, or fitness challenge</li>
                      <li>• <strong>Certification Exams:</strong> Maintain study discipline by visualizing time until test day</li>
                      <li>• <strong>Book Deadlines:</strong> Keep writing momentum high with chapter or manuscript countdown timers</li>
                      <li>• <strong>Career Transitions:</strong> Plan job changes or entrepreneurial launches with milestone countdowns</li>
                      <li>• <strong>Sobriety Milestones:</strong> Celebrate recovery progress by counting up to anniversary dates</li>
                    </ul>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-green-500"
                  >
                    <h4 className="font-bold text-lg mb-2">🎄 Seasonal & Holiday Countdowns</h4>
                    <p className="text-sm mb-3">Amplify the magic of special times of year:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Christmas/Hanukkah/Diwali:</strong> Build family excitement starting from Thanksgiving or earlier</li>
                      <li>• <strong>New Year's Eve:</strong> Count down to fresh starts and new resolutions with visual momentum</li>
                      <li>• <strong>Summer Break:</strong> Help kids track the final weeks of school with growing anticipation</li>
                      <li>• <strong>Sports Season Openers:</strong> Rally fan excitement for your favorite team's first game</li>
                      <li>• <strong>Concert Tours:</strong> Track the countdown to seeing your favorite artist live</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-blue-700 dark:text-blue-400">🎨 Maximizing Your Countdown Experience</h3>
                
                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">📱 Digital Display Strategies</h4>
                    <p className="text-sm">Set your countdown as your phone wallpaper or computer desktop background. Every time you unlock your device, you'll get a motivational reminder of what's coming. The constant visual reinforcement keeps excitement levels high and helps with any preparation tasks you need to complete.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">👨‍👩‍👧‍👦 Shared Countdown Rituals</h4>
                    <p className="text-sm">Create family or team traditions around checking the countdown together. Daily breakfast countdown checks, weekly team meetings that start with the countdown, or evening family discussions about countdown milestones all build collective excitement and strengthen bonds.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">🎯 Milestone Markers</h4>
                    <p className="text-sm">Celebrate countdown milestones—100 days out, 30 days, 1 week, 24 hours. Each milestone becomes a mini-celebration and preparation checkpoint. Plan special activities or complete specific tasks at each marker to maintain momentum and ensure you're ready when the big day arrives.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">📸 Document the Journey</h4>
                    <p className="text-sm">Screenshot your countdown at significant moments or take photos of yourself with the countdown display. After the event, these images become powerful memory triggers that let you relive not just the event itself, but the entire anticipatory journey that made it special.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-blue-700 dark:text-blue-400">💡 Advanced Countdown Strategies</h3>
                
                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl my-6 border-2 border-blue-500">
                  <h4 className="font-bold text-lg mb-3">⚡ The Reverse Countdown Method</h4>
                  <p className="text-sm leading-relaxed mb-3">
                    Instead of passively watching time decrease, assign specific tasks to countdown milestones. Create a "countdown checklist" where major tasks must be completed at 90 days, 60 days, 30 days, etc. This transforms your countdown from a passive timer into an active project management tool.
                  </p>
                  <p className="text-sm font-semibold">Example for Wedding Planning:</p>
                  <ul className="text-sm space-y-1 ml-4 mt-2">
                    <li>• 180 days: Venue booked, photographer selected</li>
                    <li>• 120 days: Invitations designed and ordered</li>
                    <li>• 90 days: Catering menu finalized</li>
                    <li>• 60 days: Invitations mailed</li>
                    <li>• 30 days: Final dress fitting</li>
                    <li>• 7 days: Final vendor confirmations</li>
                    <li>• 1 day: Rehearsal and relaxation!</li>
                  </ul>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-xl my-6 border-2 border-purple-500">
                  <h4 className="font-bold text-lg mb-3">🎭 The Dual Countdown Technique</h4>
                  <p className="text-sm leading-relaxed">
                    Run two countdowns simultaneously: one to your main event and one to a preparation deadline that's earlier. For example, if you're launching a product in 60 days, set a second countdown to "marketing materials complete" at 40 days. This creates interim urgency and prevents last-minute panic while maintaining excitement about the ultimate goal.
                  </p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-blue-700 dark:text-blue-400">🎪 Making Countdown Moments More Engaging</h3>
                
                <ul className="space-y-3 my-6 text-base">
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🎉</span>
                    <div>
                      <strong>Daily Countdown Rituals:</strong> Check your countdown at the same time each day—morning coffee, lunch break, or evening wind-down. Consistency amplifies the anticipatory pleasure and creates a positive daily habit.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">📝</span>
                    <div>
                      <strong>Countdown Journaling:</strong> Write a few sentences each week about your feelings as the countdown decreases. Future you will treasure these reflections on the journey toward your special moment.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🎵</span>
                    <div>
                      <strong>Soundtrack Your Countdown:</strong> Create a playlist that you listen to while checking your countdown. Music creates powerful emotional anchors that will make the event even more memorable.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🎁</span>
                    <div>
                      <strong>Mini Milestone Rewards:</strong> Treat yourself at significant countdown markers. At 50 days out, buy yourself something small. At 25 days, enjoy a favorite meal. These rewards sustain motivation and mark the passage of time meaningfully.
                    </div>
                  </li>
                </ul>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-blue-700 dark:text-blue-400">🚫 Avoiding Countdown Pitfalls</h3>
                
                <div className="space-y-4 my-6">
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Pitfall #1: Obsessive Checking</h4>
                    <p className="text-sm mb-2">Checking the countdown every hour can turn healthy anticipation into anxiety and make time feel like it's crawling.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Solution: Limit yourself to 1-2 scheduled countdown checks per day. Savoring is better than obsessing.</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Pitfall #2: Neglecting the Present</h4>
                    <p className="text-sm mb-2">Getting so focused on the future event that you forget to enjoy the present moment can rob you of weeks of potential happiness.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Solution: View the countdown as enhancement to present joy, not replacement. Use it to appreciate "the journey" as much as "the destination."</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Pitfall #3: Building Unrealistic Expectations</h4>
                    <p className="text-sm mb-2">Months of countdown can create such high expectations that the actual event feels anticlimactic, no matter how wonderful it is.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Solution: Focus on gratitude and presence rather than perfection. The countdown builds excitement, not demands for flawlessness.</p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Pitfall #4: Post-Event Letdown</h4>
                    <p className="text-sm mb-2">After the event passes, you might feel empty or depressed without the daily countdown ritual to look forward to.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Solution: Have another countdown ready to start! Always have something positive on the horizon to maintain forward-looking optimism.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-blue-700 dark:text-blue-400">🌈 The Psychology of Different Time Scales</h3>
                
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-xl my-6">
                  <h4 className="font-bold text-lg mb-3">⏱️ Understanding Time Perception</h4>
                  <p className="text-sm mb-3">Different countdown lengths create different psychological experiences:</p>
                  <ul className="text-sm space-y-2 ml-6">
                    <li>• <strong>1-7 days:</strong> Intense, immediate excitement. Perfect for maintaining energy through final preparations.</li>
                    <li>• <strong>1-4 weeks:</strong> Sweet spot for sustained anticipation without overwhelming anxiety. Ideal for most personal events.</li>
                    <li>• <strong>1-3 months:</strong> Builds deeper emotional investment. Excellent for major life events requiring significant planning.</li>
                    <li>• <strong>3-6 months:</strong> Creates long-term project momentum. Best for business launches, weddings, or major career transitions.</li>
                    <li>• <strong>6-12 months:</strong> Epic anticipation building. Reserve for truly transformative life events like studying abroad or major relocations.</li>
                    <li>• <strong>1+ years:</strong> Aspirational and motivational but requires milestone celebrations to maintain engagement throughout.</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-blue-700 dark:text-blue-400">🎊 Countdown Success Stories</h3>
                
                <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-xl my-6 border-2 border-green-500">
                  <p className="italic mb-3 text-base">"Setting up a countdown to our product launch changed everything. Our team checked it every morning during standup, and it created this incredible sense of urgency mixed with excitement. We shipped on time for the first time in company history!"</p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">— Marcus L., Startup Founder</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl my-6 border-2 border-blue-500">
                  <p className="italic mb-3 text-base">"I set a countdown for my marathon six months out. Every single day, that ticking clock motivated me to lace up my running shoes. When race day finally arrived, I wasn't nervous—I was ready. And I finished with a personal best time!"</p>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">— Jennifer K., Marathon Runner</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-xl my-6 border-2 border-purple-500">
                  <p className="italic mb-3 text-base">"Our family countdown to Disney World started 90 days out. My kids checked it every morning, and we made checking the countdown part of our routine. It turned three months of waiting into three months of building magical anticipation together."</p>
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">— The Rodriguez Family</p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-blue-700 dark:text-blue-400">🔥 Pro Tips for Countdown Masters</h3>
                
                <ul className="space-y-3 my-6 text-base">
                  <li className="flex items-start">
                    <span className="text-xl mr-3">⚡</span>
                    <div><strong>Start Early, But Not Too Early:</strong> Begin your countdown when you have tasks to complete. Too early creates burnout; too late misses the anticipatory pleasure.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3">🎯</span>
                    <div><strong>Include Time of Day:</strong> Adding hours and minutes to countdowns for events with specific start times creates more precise excitement and helps with logistics planning.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3">🌟</span>
                    <div><strong>Share Strategically:</strong> Share your countdown with people who will amplify your excitement, not dampen it with negativity or skepticism.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3">📊</span>
                    <div><strong>Track Multiple Events:</strong> Keep several countdowns running for different goals. Life is richer when you always have something to look forward to!</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3">💪</span>
                    <div><strong>Use Countdowns for Motivation:</strong> Stuck in a rut? Set a countdown to a personal challenge or adventure. Having a date forces action and decision-making.</div>
                  </li>
                </ul>

                <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 p-8 rounded-2xl my-8 text-center border-4 border-blue-300 dark:border-blue-700">
                  <h3 className="text-2xl font-bold mb-4">🎪 Your Journey Starts Now</h3>
                  <p className="text-base mb-6">
                    Every great moment deserves a great countdown. Whether you're tracking days until a life-changing event or hours until a simple pleasure, countdown timers transform passive waiting into active anticipation. They remind us that time isn't just something that passes—it's something we can savor, celebrate, and make meaningful.
                  </p>
                  <p className="text-lg font-bold italic">What will you count down to first? Set your event and watch the magic begin! 🎯⏰✨</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="backdrop-blur-xl bg-card/50 border-2 sticky top-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Popular Events</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Product launches</li>
                <li>• Weddings & anniversaries</li>
                <li>• Birthdays</li>
                <li>• Project deadlines</li>
                <li>• Holidays & vacations</li>
                <li>• Retirement dates</li>
              </ul>
            </CardContent>
          </Card>
          <AutoAdSlot placement="sidebar" />
        </div>
      </div>
    </SmartTimerLayout>
  );
}
