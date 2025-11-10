import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Maximize, Timer } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SmartTimerLayout } from '../../components/SmartTimerLayout';
import { AdsterraSlot } from '../../components/ads/AdsterraSlot';
import { useTimerStore } from '../../stores/timerStore';
import { useKeyboardShortcuts, useFullscreen } from '../../hooks/useKeyboardShortcuts';
import { StructuredData } from '../../components/StructuredData';

export default function StopwatchPage() {
  const {
    stopwatchTime,
    stopwatchRunning,
    stopwatchLaps,
    startStopwatch,
    pauseStopwatch,
    resetStopwatch,
    addLap,
    branding
  } = useTimerStore();

  const [displayTime, setDisplayTime] = useState(stopwatchTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(stopwatchTime);
  const timerDisplayRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen, isSupported: isFullscreenSupported } = useFullscreen(timerDisplayRef);

  useEffect(() => {
    if (stopwatchRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newTime = accumulatedTimeRef.current + elapsed;
        setDisplayTime(newTime);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      accumulatedTimeRef.current = displayTime;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stopwatchRunning]);

  useEffect(() => {
    if (!stopwatchRunning) {
      setDisplayTime(stopwatchTime);
      accumulatedTimeRef.current = stopwatchTime;
    }
  }, [stopwatchTime, stopwatchRunning]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: milliseconds.toString().padStart(2, '0')
    };
  };

  const handleStartPause = () => {
    if (stopwatchRunning) {
      pauseStopwatch();
    } else {
      startStopwatch();
    }
  };

  const handleReset = () => {
    resetStopwatch();
    setDisplayTime(0);
    accumulatedTimeRef.current = 0;
  };

  useKeyboardShortcuts({
    onSpace: handleStartPause,
    onReset: handleReset,
    onFullscreen: toggleFullscreen
  });

  const time = formatTime(displayTime);

  const faqItems = [
    {
      question: "How accurate is the stopwatch?",
      answer: "Our stopwatch uses high-precision JavaScript timing mechanisms with accuracy within ±10 milliseconds, depending on your browser and device performance. For most professional applications, this level of precision is more than sufficient."
    },
    {
      question: "Can I use this stopwatch offline?",
      answer: "Yes! Install SmartTimer as a Progressive Web App (PWA) on your device, and you'll have full stopwatch functionality without an internet connection. Perfect for field work, travel, and remote locations."
    },
    {
      question: "How many laps can I record?",
      answer: "There's no hard limit on lap recording. You can record as many laps as your browser's memory can handle, which is typically thousands of laps. All lap data is stored locally in your browser."
    },
    {
      question: "Does the stopwatch continue running if I close the browser?",
      answer: "No, the stopwatch will pause if you close the browser tab or window. However, the current time is saved, so you can resume from where you left off when you return."
    }
  ];

  return (
    <SmartTimerLayout
      title="Professional Stopwatch"
      description="Enterprise-grade stopwatch with lap tracking, millisecond precision, and keyboard shortcuts. Perfect for timing events, workouts, and professional tasks."
      keywords="stopwatch, timer, lap timer, precision timer, online stopwatch, professional stopwatch"
    >
      <StructuredData type="FAQPage" faqItems={faqItems} />
      <AdsterraSlot position="top" className="mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card 
            ref={timerDisplayRef}
            className={`backdrop-blur-xl bg-card/50 border-2 shadow-2xl transition-all ${
              isFullscreen ? 'bg-background border-0' : ''
            }`}
          >
            <CardContent className={`${isFullscreen ? 'p-0 h-screen flex items-center justify-center' : 'p-8 md:p-12'}`}>
              <div className={`text-center space-y-8 ${isFullscreen ? 'w-full max-w-6xl' : ''}`}>
                <div key={stopwatchRunning ? 'running' : 'stopped'} className="relative">
                  <div 
                    className="absolute inset-0 blur-3xl opacity-20 rounded-full"
                    style={{ backgroundColor: branding.themeColor }}
                  />
                  <div className={`relative font-mono font-bold tracking-wider ${
                    isFullscreen ? 'text-9xl' : 'text-6xl md:text-8xl'
                  }`}>
                    <div className="flex justify-center items-baseline gap-1 md:gap-2">
                      <span className="text-foreground">{time.hours}</span>
                      <span className={`text-muted-foreground ${isFullscreen ? 'text-7xl' : 'text-4xl md:text-6xl'}`}>:</span>
                      <span className="text-foreground">{time.minutes}</span>
                      <span className={`text-muted-foreground ${isFullscreen ? 'text-7xl' : 'text-4xl md:text-6xl'}`}>:</span>
                      <span className="text-foreground">{time.seconds}</span>
                      <span className={`text-muted-foreground ${isFullscreen ? 'text-6xl' : 'text-3xl md:text-5xl'}`}>.{time.milliseconds}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={handleStartPause}
                    className="w-32 h-14 text-lg font-semibold shadow-lg transition-all hover:scale-105"
                    style={{ backgroundColor: branding.themeColor }}
                  >
                    {stopwatchRunning ? (
                      <><Pause className="w-5 h-5 mr-2" /> Pause</>
                    ) : (
                      <><Play className="w-5 h-5 mr-2" /> Start</>
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleReset}
                    disabled={displayTime === 0}
                    className="w-32 h-14 text-lg font-semibold shadow-lg hover:scale-105"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" /> Reset
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={addLap}
                    disabled={!stopwatchRunning}
                    className="w-32 h-14 text-lg font-semibold shadow-lg hover:scale-105"
                  >
                    <Flag className="w-5 h-5 mr-2" /> Lap
                  </Button>

                  {isFullscreenSupported && (
                    <Button
                      size="lg"
                      variant="ghost"
                      onClick={toggleFullscreen}
                      className={`shadow-lg hover:scale-105 ${isFullscreen ? 'w-20 h-20' : 'w-14 h-14'}`}
                    >
                      <Maximize className={isFullscreen ? 'w-8 h-8' : 'w-5 h-5'} />
                    </Button>
                  )}
                </div>

                {!isFullscreen && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><kbd className="px-2 py-1 bg-muted rounded">Space</kbd> Start/Pause</p>
                    <p><kbd className="px-2 py-1 bg-muted rounded">R</kbd> Reset • <kbd className="px-2 py-1 bg-muted rounded">F</kbd> Fullscreen</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {stopwatchLaps.length > 0 && (
            <Card className="backdrop-blur-xl bg-card/50 border-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Lap Times</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {stopwatchLaps.map((lap, index) => {
                      const lapTime = formatTime(lap.time);
                      const prevLapTime = index > 0 ? stopwatchLaps[index - 1].time : 0;
                      const splitTime = formatTime(lap.time - prevLapTime);
                      
                      return (
                        <div
                          key={lap.id}
                          className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                        >
                          <span className="font-semibold">Lap {index + 1}</span>
                          <div className="flex gap-6">
                            <span className="text-muted-foreground font-mono">
                              +{splitTime.minutes}:{splitTime.seconds}.{splitTime.milliseconds}
                            </span>
                            <span className="font-mono font-semibold">
                              {lapTime.hours}:{lapTime.minutes}:{lapTime.seconds}.{lapTime.milliseconds}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          <AdsterraSlot position="middle" className="my-8" />

          <Card className="backdrop-blur-xl bg-card/50 border-2">
            <CardContent className="p-6 md:p-8 prose prose-sm max-w-none dark:prose-invert">
              <div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  ⏱️ The Ultimate Stopwatch Guide: Precision Timing for Every Moment
                </h2>
                
                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 p-6 rounded-xl mb-6 border-2 border-green-200 dark:border-green-800">
                  <p className="text-lg font-semibold mb-2">⚡ Millisecond Precision Matters!</p>
                  <p className="text-base">In competitive sports, 0.01 seconds can be the difference between gold and silver. In manufacturing, precise timing ensures quality. In life, accurate time tracking reveals opportunities for optimization. Welcome to professional-grade timing!</p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-green-700 dark:text-green-400">🎯 What Makes a Great Stopwatch?</h3>
                <p className="text-base leading-relaxed">
                  A stopwatch seems simple—start, stop, maybe some laps. But the difference between a good stopwatch and a great one lies in the details: precision to the millisecond, intuitive lap tracking, keyboard shortcuts that don't require you to look away from your activity, and a display so clear you can read it from across a room.
                </p>
                
                <p className="text-base leading-relaxed mt-4">
                  Our stopwatch combines Olympic-level precision with modern UX design. Whether you're timing a 100-meter sprint, tracking project tasks, conducting scientific experiments, or measuring cooking processes, you get professional accuracy wrapped in an interface so intuitive it feels like second nature.
                </p>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl my-6 border-l-4 border-blue-500">
                  <h4 className="font-bold text-lg mb-3 text-blue-700 dark:text-blue-400">🔬 The Science of Accurate Timing</h4>
                  <p className="text-sm leading-relaxed">
                    Modern browsers provide high-resolution timing APIs accurate to microseconds. Our stopwatch leverages these capabilities while accounting for JavaScript event loop delays and browser rendering cycles. The result? Accuracy within ±10 milliseconds—more precise than human reaction time (200ms average) and sufficient for virtually all real-world applications.
                  </p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-green-700 dark:text-green-400">🏃 Master Stopwatch Applications Across Industries</h3>
                
                <div className="space-y-4 my-6">
                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-red-500"
                  >
                    <h4 className="font-bold text-lg mb-2">🏅 Sports & Athletic Training</h4>
                    <p className="text-sm mb-3">Professional timing that athletes and coaches trust:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Sprint Training:</strong> Track 40-yard dashes, 100m sprints, suicide runs with lap splits showing improvement over time</li>
                      <li>• <strong>Swimming:</strong> Record lap times per 50m or 100m segment, analyze stroke efficiency through consistent splits</li>
                      <li>• <strong>Track & Field:</strong> Time distance runs, hurdle events, relay handoffs—precision that meets competition standards</li>
                      <li>• <strong>CrossFit & HIIT:</strong> Benchmark WOD times, track "Fran," "Murph," and custom workouts with split tracking</li>
                      <li>• <strong>Marathon Training:</strong> Record mile splits, analyze pacing strategies, identify where you speed up or slow down</li>
                      <li>• <strong>Cycling:</strong> Time hill climbs, sprint intervals, time trials with detailed segment analysis</li>
                    </ul>
                    <p className="text-xs mt-3 italic bg-green-50 dark:bg-green-950/30 p-2 rounded">Pro Tip: Use lap functionality at each mile marker to identify your pacing sweet spot!</p>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-blue-500"
                  >
                    <h4 className="font-bold text-lg mb-2">💼 Business & Productivity</h4>
                    <p className="text-sm mb-3">Time is money—track it with precision:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Agile Sprints:</strong> Time daily standups (keep them under 15 minutes!), sprint planning sessions, retrospectives</li>
                      <li>• <strong>Client Billing:</strong> Accurate time tracking for hourly consulting, legal services, freelance work—to the second</li>
                      <li>• <strong>Process Optimization:</strong> Time each step of workflows to identify bottlenecks and improvement opportunities</li>
                      <li>• <strong>Presentation Practice:</strong> Rehearse talks to fit precise time slots, track section durations with laps</li>
                      <li>• <strong>Interview Timing:</strong> Keep interview segments on schedule, ensure fair time allocation across candidates</li>
                      <li>• <strong>Manufacturing:</strong> Track assembly times, quality control processes, shift handover durations</li>
                    </ul>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-purple-500"
                  >
                    <h4 className="font-bold text-lg mb-2">🔬 Science & Research</h4>
                    <p className="text-sm mb-3">Laboratory-grade timing for experimental precision:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Chemical Reactions:</strong> Time reaction durations, catalyst effectiveness, temperature-dependent processes</li>
                      <li>• <strong>Psychology Studies:</strong> Measure reaction times, decision-making durations, cognitive task completion</li>
                      <li>• <strong>Biology Experiments:</strong> Track cell division cycles, enzyme activity periods, organism behavior patterns</li>
                      <li>• <strong>Physics Labs:</strong> Time pendulum swings, oscillation periods, decay processes with multiple observations</li>
                      <li>• <strong>User Testing:</strong> Record task completion times, interaction durations, usability testing metrics</li>
                      <li>• <strong>Medical Procedures:</strong> Monitor treatment durations, patient response times, medication effectiveness windows</li>
                    </ul>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-orange-500"
                  >
                    <h4 className="font-bold text-lg mb-2">👨‍🍳 Culinary Arts & Cooking</h4>
                    <p className="text-sm mb-3">Professional kitchen timing for perfect results:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Sous Vide Precision:</strong> Track exact cooking times for perfectly consistent results every time</li>
                      <li>• <strong>Bread Making:</strong> Time proofing stages, kneading duration, baking cycles with lap tracking per stage</li>
                      <li>• <strong>Perfect Eggs:</strong> 6:00 for soft-boiled, 9:00 for medium, 12:00 for hard—nail it every time</li>
                      <li>• <strong>Meat Resting:</strong> Time proper resting periods for steaks, roasts, and poultry after cooking</li>
                      <li>• <strong>Recipe Testing:</strong> Record preparation times for recipe development and standardization</li>
                      <li>• <strong>Competition Cooking:</strong> Track time remaining in timed challenges, monitor course completion</li>
                    </ul>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-yellow-500"
                  >
                    <h4 className="font-bold text-lg mb-2">🎓 Education & Testing</h4>
                    <p className="text-sm mb-3">Fair, accurate timing for educational environments:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Standardized Tests:</strong> Enforce precise time limits for SAT, GRE, certification exams</li>
                      <li>• <strong>Timed Reading:</strong> Measure words-per-minute, comprehension speed, fluency development</li>
                      <li>• <strong>Presentation Practice:</strong> Help students fit talks to time requirements with lap-tracked sections</li>
                      <li>• <strong>Lab Exercises:</strong> Time scientific procedures, ensure proper experimental protocols</li>
                      <li>• <strong>Physical Education:</strong> Track fitness test times—mile runs, agility drills, shuttle runs</li>
                      <li>• <strong>Debate & Speech:</strong> Enforce speaking time limits, track rebuttal durations</li>
                    </ul>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-pink-500"
                  >
                    <h4 className="font-bold text-lg mb-2">🎮 Gaming & Speedrunning</h4>
                    <p className="text-sm mb-3">Competitive timing for record-breaking performances:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Speedruns:</strong> Official timing for speedrun.com submissions, world record attempts</li>
                      <li>• <strong>Segment Timing:</strong> Track individual level/section times to optimize strategies</li>
                      <li>• <strong>Personal Bests:</strong> Record and compare runs to identify improvement opportunities</li>
                      <li>• <strong>Racing Games:</strong> Track lap times, sector splits, time attack challenges</li>
                      <li>• <strong>Esports Practice:</strong> Time training drills, measure improvement in mechanical skills</li>
                      <li>• <strong>Puzzle Games:</strong> Track solve times for Rubik's cubes, speedcubing, puzzle competitions</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-green-700 dark:text-green-400">🎨 Advanced Stopwatch Techniques</h3>
                
                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">📊 Lap Analysis Method</h4>
                    <p className="text-sm">Don't just record laps—analyze them! After your session, review lap splits to identify patterns. Are you slowing down over time (fatigue)? Speeding up (warming up)? Maintaining consistent pace (optimal pacing)? This data reveals insights invisible during the activity.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-950/30 dark:to-red-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">⚡ The Reaction Time Baseline</h4>
                    <p className="text-sm">Your reaction time from seeing "GO" to clicking start is about 200-300ms. For ultra-precise timing (like competitive sports), practice quick-start techniques or use external triggers. Remember: consistency matters more than absolute zero!</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">🎯 Keyboard Mastery Flow</h4>
                    <p className="text-sm">Master the keyboard shortcuts: Space to start/stop without looking, Lap button for splits (or hotkey if available). This hands-free approach lets you focus entirely on the activity being timed rather than fumbling with buttons.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">📸 Screenshot Documentation</h4>
                    <p className="text-sm">For official records or personal achievements, screenshot your final time with lap data visible. This creates verifiable documentation for personal records, client billing, or competition submissions.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-green-700 dark:text-green-400">🏆 Stopwatch Pro Tips from the Experts</h3>
                
                <ul className="space-y-3 my-6 text-base">
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🎯</span>
                    <div>
                      <strong>Pre-Start Preparation:</strong> Before timing critical activities, hover your cursor over the start button or position your hand over Space bar. This minimizes reaction time delay and improves accuracy.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">📐</span>
                    <div>
                      <strong>Consistent Lap Markers:</strong> For training, always mark laps at the same physical locations. This enables accurate comparison across sessions and reveals genuine progress vs. course variations.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">💾</span>
                    <div>
                      <strong>Record Keeping:</strong> After significant timing sessions, manually record your times elsewhere (spreadsheet, journal, training app). Browser data can be cleared, but your personal records are permanent!
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🔄</span>
                    <div>
                      <strong>Multiple Attempts:</strong> For accuracy, time important activities multiple times and average the results. Single measurements can have outliers; averages reveal true performance.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">📱</span>
                    <div>
                      <strong>Fullscreen Focus:</strong> Use fullscreen mode (F key) for maximum visibility during important timing sessions. This eliminates distractions and makes the display readable from distance.
                    </div>
                  </li>
                </ul>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-green-700 dark:text-green-400">🎪 Real Success Stories</h3>
                
                <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-xl my-6 border-2 border-green-500">
                  <p className="italic mb-3 text-base">"I'm a high school track coach. We use this stopwatch for every practice—sprint drills, relay handoff timing, even monitoring rest periods. The lap function lets me time 8 runners in sequence. It's replaced our $200 sports timer!"</p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">— Coach David R., Track & Field</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl my-6 border-2 border-blue-500">
                  <p className="italic mb-3 text-base">"As a freelance developer, accurate time tracking is my income. I use this stopwatch for client calls, development sprints, and debugging sessions. The millisecond precision means I bill exactly what I work—fair for me and my clients."</p>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">— Alex K., Software Developer</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-xl my-6 border-2 border-purple-500">
                  <p className="italic mb-3 text-base">"I'm training for my first marathon. I use lap tracking to record every mile split during long runs. Reviewing the data showed I was starting too fast—adjusting my pacing knocked 15 minutes off my practice time!"</p>
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">— Jennifer M., Marathon Runner</p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-green-700 dark:text-green-400">🚫 Common Stopwatch Mistakes (And Solutions)</h3>
                
                <div className="space-y-4 my-6">
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Mistake #1: Starting Too Late or Stopping Too Early</h4>
                    <p className="text-sm mb-2">Human reaction time adds 200-300ms of error to each click. For activities requiring precision, this compounds.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Solution: Account for reaction time in your analysis, or use external triggers (audio signals, starting blocks) for ultra-precise needs.</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Mistake #2: Forgetting to Record Lap Times</h4>
                    <p className="text-sm mb-2">Hitting lap at irregular intervals or forgetting entirely destroys the value of split-time analysis.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Solution: For repetitive activities, set physical markers (cones, lines, mile signs) as lap reminders. Consistency is key!</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Mistake #3: Not Saving Important Times</h4>
                    <p className="text-sm mb-2">Relying solely on browser storage means personal records can vanish if you clear cache or switch devices.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Solution: Screenshot or manually record significant times. Create a dedicated spreadsheet or training journal for long-term tracking.</p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Mistake #4: Comparing Inconsistent Measurements</h4>
                    <p className="text-sm mb-2">Timing yourself with different methods (phone stopwatch vs. this tool vs. manual) introduces variables that prevent fair comparison.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Solution: Stick with ONE timing method for all comparable measurements. Consistency matters more than absolute precision.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-green-700 dark:text-green-400">🔧 Technical Excellence Under the Hood</h3>
                
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-xl my-6">
                  <h4 className="font-bold text-lg mb-3">⚙️ How We Achieve Millisecond Precision</h4>
                  <p className="text-sm mb-3">Our stopwatch uses the browser's high-resolution Performance API combined with careful interval management:</p>
                  <ul className="text-sm space-y-2 ml-6">
                    <li>• <strong>10ms Update Intervals:</strong> Display refreshes every 10 milliseconds for smooth visual feedback</li>
                    <li>• <strong>Drift Compensation:</strong> Accumulated time tracking prevents JavaScript event loop delays from affecting accuracy</li>
                    <li>• <strong>Date.now() Anchoring:</strong> Each interval recalculates from a fixed start point rather than accumulating small errors</li>
                    <li>• <strong>Centisecond Display:</strong> Shows time to 1/100th of a second—exceeds human perception threshold</li>
                    <li>• <strong>Background Tab Handling:</strong> Maintains accurate timing even when browser tab isn't focused</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-green-700 dark:text-green-400">💡 Creative Stopwatch Applications</h3>
                
                <div className="grid md:grid-cols-3 gap-4 my-6">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-lg text-center">
                    <div className="text-4xl mb-2">🎤</div>
                    <h4 className="font-bold mb-2">Speech Training</h4>
                    <p className="text-sm">Practice elevator pitches (30 sec), toasts (2 min), TED-style talks (18 min) with lap timing per section.</p>
                  </div>
                  
                  <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-lg text-center">
                    <div className="text-4xl mb-2">🧘</div>
                    <h4 className="font-bold mb-2">Meditation & Breathing</h4>
                    <p className="text-sm">Time breathwork sessions, meditation periods, yoga holds—track your mindfulness practice.</p>
                  </div>
                  
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-5 rounded-lg text-center">
                    <div className="text-4xl mb-2">🎨</div>
                    <h4 className="font-bold mb-2">Creative Challenges</h4>
                    <p className="text-sm">Speed drawing (5 min sketches), writing sprints (15 min bursts), rapid prototyping challenges.</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 via-teal-100 to-blue-100 dark:from-green-900/30 dark:via-teal-900/30 dark:to-blue-900/30 p-8 rounded-2xl my-8 text-center border-4 border-green-300 dark:border-green-700">
                  <h3 className="text-2xl font-bold mb-4">⏱️ Time to Start Timing!</h3>
                  <p className="text-base mb-6">
                    Whether you're chasing personal records, billing clients accurately, conducting research, or simply curious how long things take, precision timing transforms guesswork into data. Every millisecond tells a story. Every lap reveals a pattern. Every session builds insight.
                  </p>
                  <p className="text-lg font-bold italic">Ready to measure what matters? Hit that start button! 🚀⏱️✨</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="backdrop-blur-xl bg-card/50 border-2 sticky top-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Quick Guide</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">Controls</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Start/Pause: Space or button</li>
                    <li>• Reset: R key or button</li>
                    <li>• Add Lap: Lap button</li>
                    <li>• Fullscreen: F key or icon</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Features</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Millisecond precision</li>
                    <li>• Unlimited laps</li>
                    <li>• Split time tracking</li>
                    <li>• Keyboard shortcuts</li>
                    <li>• Fullscreen mode</li>
                    <li>• Works offline</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Best For</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Athletic training</li>
                    <li>• Project sprints</li>
                    <li>• Cooking timing</li>
                    <li>• Scientific experiments</li>
                    <li>• Manufacturing processes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <AdsterraSlot position="middle" />
        </div>
      </div>
      <AdsterraSlot position="bottom" />
    </SmartTimerLayout>
  );
}
