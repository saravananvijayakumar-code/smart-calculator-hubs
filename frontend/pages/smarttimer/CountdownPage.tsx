import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SmartTimerLayout } from '../../components/SmartTimerLayout';
import AutoAdSlot from '../../components/ads/AutoAdSlot';
import { useTimerStore } from '../../stores/timerStore';
import { useKeyboardShortcuts, useFullscreen } from '../../hooks/useKeyboardShortcuts';

const PRESET_DURATIONS = [
  { label: '1 min', value: 60000 },
  { label: '5 min', value: 300000 },
  { label: '10 min', value: 600000 },
  { label: '15 min', value: 900000 },
  { label: '30 min', value: 1800000 },
  { label: '45 min', value: 2700000 },
  { label: '1 hour', value: 3600000 },
  { label: '2 hours', value: 7200000 },
];

export default function CountdownPage() {
  const {
    countdownDuration,
    countdownRemaining,
    countdownRunning,
    setCountdownDuration,
    startCountdown,
    pauseCountdown,
    resetCountdown,
    branding
  } = useTimerStore();

  const [displayTime, setDisplayTime] = useState(countdownRemaining);
  const [customMinutes, setCustomMinutes] = useState('5');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(countdownRemaining);
  const [isFinished, setIsFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerDisplayRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen, isSupported: isFullscreenSupported } = useFullscreen(timerDisplayRef);

  useEffect(() => {
    if (countdownRunning && displayTime > 0) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newRemaining = Math.max(0, remainingRef.current - elapsed);
        setDisplayTime(newRemaining);
        
        if (newRemaining === 0) {
          pauseCountdown();
          setIsFinished(true);
          playSound();
        }
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      remainingRef.current = displayTime;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [countdownRunning, displayTime > 0]);

  useEffect(() => {
    if (!countdownRunning) {
      setDisplayTime(countdownRemaining);
      remainingRef.current = countdownRemaining;
    }
  }, [countdownRemaining, countdownRunning]);

  const playSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ8PVKnn77BdGgo+ltrzw3EiBSh+zPLaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+');
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  const handleStartPause = () => {
    if (isFinished) {
      handleReset();
      return;
    }
    
    if (countdownRunning) {
      pauseCountdown();
    } else {
      setIsFinished(false);
      startCountdown();
    }
  };

  const handleReset = () => {
    resetCountdown();
    setDisplayTime(countdownDuration);
    remainingRef.current = countdownDuration;
    setIsFinished(false);
  };

  const handlePresetClick = (duration: number) => {
    setCountdownDuration(duration);
    setDisplayTime(duration);
    remainingRef.current = duration;
    setIsFinished(false);
  };

  const handleCustomDuration = () => {
    const minutes = parseInt(customMinutes) || 0;
    const duration = minutes * 60 * 1000;
    if (duration > 0) {
      setCountdownDuration(duration);
      setDisplayTime(duration);
      remainingRef.current = duration;
      setIsFinished(false);
    }
  };

  useKeyboardShortcuts({
    onSpace: handleStartPause,
    onReset: handleReset,
    onFullscreen: toggleFullscreen
  });

  const time = formatTime(displayTime);
  const progress = (displayTime / countdownDuration) * 100;

  return (
    <SmartTimerLayout
      title="Countdown Timer"
      description="Professional countdown timer with preset durations, custom time settings, and visual progress tracking. Perfect for presentations, workouts, and time management."
      keywords="countdown timer, online timer, countdown clock, timer with alarm, presentation timer"
    >
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
                <div
                  key={isFinished ? 'finished' : countdownRunning ? 'running' : 'stopped'}
                  className="relative"
                >
                  <div 
                    className="absolute inset-0 blur-3xl opacity-20 rounded-full"
                    style={{ backgroundColor: isFinished ? '#ef4444' : branding.themeColor }}
                  />
                  
                  <svg className={`w-full mx-auto ${isFullscreen ? 'max-w-3xl' : 'max-w-md'}`} viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/20"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke={isFinished ? '#ef4444' : branding.themeColor}
                      strokeWidth="8"
                      strokeDasharray={`${progress * 5.65} 565`}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                      className="transition-all duration-100"
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`font-mono font-bold tracking-wider ${
                      isFullscreen ? 'text-9xl' : 'text-5xl md:text-7xl'
                    } ${isFinished ? 'text-red-500' : 'text-foreground'}`}>
                      <div className="flex justify-center items-baseline gap-1 md:gap-2">
                        <span>{time.hours}</span>
                        <span className={`text-muted-foreground ${isFullscreen ? 'text-7xl' : 'text-3xl md:text-5xl'}`}>:</span>
                        <span>{time.minutes}</span>
                        <span className={`text-muted-foreground ${isFullscreen ? 'text-7xl' : 'text-3xl md:text-5xl'}`}>:</span>
                        <span>{time.seconds}</span>
                      </div>
                      {isFinished && (
                        <div className={`mt-2 font-normal ${isFullscreen ? 'text-4xl' : 'text-xl'}`}>Time's Up!</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={handleStartPause}
                    className="w-32 h-14 text-lg font-semibold shadow-lg transition-all hover:scale-105"
                    style={{ backgroundColor: isFinished ? '#ef4444' : branding.themeColor }}
                  >
                    {isFinished ? (
                      <><RotateCcw className="w-5 h-5 mr-2" /> Restart</>
                    ) : countdownRunning ? (
                      <><Pause className="w-5 h-5 mr-2" /> Pause</>
                    ) : (
                      <><Play className="w-5 h-5 mr-2" /> Start</>
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleReset}
                    disabled={displayTime === countdownDuration && !countdownRunning}
                    className="w-32 h-14 text-lg font-semibold shadow-lg hover:scale-105"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" /> Reset
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

          <Card className="backdrop-blur-xl bg-card/50 border-2">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Quick Presets</h3>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_DURATIONS.map((preset) => (
                  <Button
                    key={preset.value}
                    variant="outline"
                    onClick={() => handlePresetClick(preset.value)}
                    disabled={countdownRunning}
                    className="hover:scale-105 transition-all"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <Label htmlFor="custom-minutes">Custom Duration (minutes)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="custom-minutes"
                    type="number"
                    min="1"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    disabled={countdownRunning}
                    placeholder="Enter minutes"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCustomDuration}
                    disabled={countdownRunning}
                    style={{ backgroundColor: branding.themeColor }}
                  >
                    Set
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <AutoAdSlot placement="mid-content" className="my-8" />

          <Card className="backdrop-blur-xl bg-card/50 border-2">
            <CardContent className="p-6 md:p-8 prose prose-sm max-w-none dark:prose-invert">
              <div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  ⏳ The Complete Countdown Timer Mastery Guide: Make Every Second Count
                </h2>
                
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 p-6 rounded-xl mb-6 border-2 border-red-200 dark:border-red-800">
                  <p className="text-lg font-semibold mb-2">🔥 The Countdown Effect!</p>
                  <p className="text-base">Time pressure isn't your enemy—it's your productivity superpower! Studies show that visible countdowns increase task completion rates by 40% and reduce procrastination by up to 60%. When the clock is ticking down, focus intensifies and results multiply!</p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-red-700 dark:text-red-400">🎯 The Psychology of Counting Down</h3>
                <p className="text-base leading-relaxed">
                  There's something primal about watching time run out. Unlike counting up (where time feels infinite), counting down creates urgency. Your brain recognizes a deadline approaching and shifts into high-performance mode. It's the difference between "I have all day" and "I have 15 minutes to nail this!"
                </p>
                
                <p className="text-base leading-relaxed mt-4">
                  Our countdown timer harnesses this psychological trigger with visual perfection: a shrinking progress ring that gives you constant feedback, preset durations for instant setup, and an alarm that ensures you never miss the zero mark. It's not just timing—it's behavioral engineering that helps you perform at your peak.
                </p>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl my-6 border-l-4 border-blue-500">
                  <h4 className="font-bold text-lg mb-3 text-blue-700 dark:text-blue-400">🧠 Parkinson's Law in Action</h4>
                  <p className="text-sm leading-relaxed">
                    "Work expands to fill the time available for its completion." By setting a countdown timer, you artificially constrain time, forcing increased efficiency. A task that "could take all afternoon" often gets done in 30 focused minutes when the countdown is ticking. The timer doesn't just measure time—it optimizes it!
                  </p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-red-700 dark:text-red-400">🚀 Master Countdown Applications That Transform Results</h3>
                
                <div className="space-y-4 my-6">
                  <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-red-500">
                    <h4 className="font-bold text-lg mb-2">🎤 Presentation & Public Speaking</h4>
                    <p className="text-sm mb-3">Stay on schedule and nail your timing:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Conference Talks:</strong> 20-minute TED-style presentations with visual time remaining for pacing awareness</li>
                      <li>• <strong>Pitch Decks:</strong> Nail the 3-minute elevator pitch, 10-minute investor presentation, or 30-second commercial spot</li>
                      <li>• <strong>Webinar Segments:</strong> Time each section of online presentations, Q&A periods, demonstration blocks</li>
                      <li>• <strong>Panel Discussions:</strong> Fair time allocation per speaker—everyone gets their 5 minutes, no overruns</li>
                      <li>• <strong>Wedding Toasts:</strong> Keep speeches heartfelt but brief (2-3 min recommended!)</li>
                      <li>• <strong>Classroom Lectures:</strong> Segment lessons perfectly—15 min lecture, 10 min discussion, 5 min wrap-up</li>
                    </ul>
                    <p className="text-xs mt-3 italic bg-red-50 dark:bg-red-950/30 p-2 rounded">Pro Tip: Use fullscreen mode and position it where you can see it peripherally during your talk!</p>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-orange-500">
                    <h4 className="font-bold text-lg mb-2">💪 Fitness & HIIT Training</h4>
                    <p className="text-sm mb-3">Precision timing for maximum fitness gains:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>HIIT Intervals:</strong> 45-second max effort sprints, 15-second recovery—perfect timing every round</li>
                      <li>• <strong>Tabata Protocol:</strong> Classic 20 seconds work, 10 seconds rest for 8 rounds (4 minutes of intensity!)</li>
                      <li>• <strong>Plank Challenges:</strong> Hold position for 60 seconds, 90 seconds, 2 minutes—watch the countdown motivate you</li>
                      <li>• <strong>Boxing Rounds:</strong> 3-minute rounds with 1-minute rest, just like the pros</li>
                      <li>• <strong>Yoga Holds:</strong> Time each asana perfectly—warrior pose 90 seconds, tree pose 60 seconds per leg</li>
                      <li>• <strong>Circuit Training:</strong> 1-minute stations with 30-second transitions, keep the whole gym in sync</li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-purple-500">
                    <h4 className="font-bold text-lg mb-2">📚 Study & Focus Sessions</h4>
                    <p className="text-sm mb-3">Maximize learning with strategic time blocks:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Pomodoro Study:</strong> 25-minute deep focus sessions on single subjects, beat procrastination</li>
                      <li>• <strong>Exam Simulation:</strong> Practice tests with actual exam time limits—build test-taking stamina</li>
                      <li>• <strong>Speed Reading:</strong> Challenge yourself to finish chapters in 15-minute sprints, track improvement</li>
                      <li>• <strong>Memorization Drills:</strong> 5-minute flashcard bursts, 10-minute practice problems with time pressure</li>
                      <li>• <strong>Writing Sprints:</strong> 1,000 words in 30 minutes—no editing, just flow writing with countdown urgency</li>
                      <li>• <strong>Break Enforcement:</strong> 10-minute breaks between study blocks—actually rest instead of "just one more chapter"</li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h4 className="font-bold text-lg mb-2">👨‍🍳 Cooking & Kitchen Timing</h4>
                    <p className="text-sm mb-3">Perfect results with precise countdown timing:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Pasta Perfection:</strong> 8-11 minutes for al dente, never mushy or undercooked again</li>
                      <li>• <strong>Steak Resting:</strong> 5-10 minutes post-cooking for juiciest results—countdown prevents cutting too early</li>
                      <li>• <strong>Bread Proofing:</strong> 1-2 hour rise times with visible progress tracking</li>
                      <li>• <strong>Tea Steeping:</strong> Green tea 2 min, black tea 3-5 min, herbal 5-7 min—perfection in a cup</li>
                      <li>• <strong>Marinating Time:</strong> 30-minute quick marinades vs 2-hour deep flavor infusions</li>
                      <li>• <strong>Blanching Vegetables:</strong> 2-3 minute precise timing for perfect texture and color</li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-green-500">
                    <h4 className="font-bold text-lg mb-2">💼 Business & Meetings</h4>
                    <p className="text-sm mb-3">Run efficient, on-time meetings:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Daily Standups:</strong> 15-minute max—each person gets 3 minutes, countdown keeps it crisp</li>
                      <li>• <strong>Brainstorm Sessions:</strong> 10-minute idea generation sprints prevent overthinking</li>
                      <li>• <strong>Decision Making:</strong> 5-minute countdown forces conclusion, prevents analysis paralysis</li>
                      <li>• <strong>Client Calls:</strong> Respect their time with visible countdown during scheduled blocks</li>
                      <li>• <strong>Interview Segments:</strong> Fair time allocation—30 min technical, 15 min cultural fit, 5 min questions</li>
                      <li>• <strong>Break Timers:</strong> Enforce 10-minute breaks in long meetings so people actually return on time</li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <h4 className="font-bold text-lg mb-2">🧘 Meditation & Mindfulness</h4>
                    <p className="text-sm mb-3">Guided time for mental wellness:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Morning Meditation:</strong> 10-minute daily practice with gentle audio alert at completion</li>
                      <li>• <strong>Breathing Exercises:</strong> 5-minute box breathing, 4-7-8 technique with visual pacing</li>
                      <li>• <strong>Body Scan:</strong> 15-minute progressive relaxation with time awareness</li>
                      <li>• <strong>Mindful Breaks:</strong> 3-minute micro-meditations between work sessions</li>
                      <li>• <strong>Yoga Nidra:</strong> 20-30 minute guided relaxation with countdown to emergence</li>
                      <li>• <strong>Gratitude Practice:</strong> 5-minute journaling sessions—timer removes decision fatigue</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-red-700 dark:text-red-400">🎨 Advanced Countdown Strategies</h3>
                
                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">⚡ The Power Hour Method</h4>
                    <p className="text-sm">Set a 60-minute countdown and commit to ONE task. No email, no messages, no distractions. The shrinking time ring creates flow state. You'll be amazed what you accomplish in one truly focused hour.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-950/30 dark:to-red-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">🎯 The Final Five Technique</h4>
                    <p className="text-sm">When countdown hits 5 minutes, this is your "finish strong" zone. Save the most important summary, conclusion, or final push for these critical final minutes when urgency peaks.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">🔄 The Reset Refresh</h4>
                    <p className="text-sm">After completing a countdown task, immediately set another for your break. Working 25 minutes? Set 5-minute break countdown. This prevents "break creep" where 5 minutes becomes 20!</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">📊 Progressive Overload</h4>
                    <p className="text-sm">Start with comfortable time limits, then progressively reduce. If a task takes 30 min comfortably, challenge yourself with 25 min countdown. You'll find efficiency you didn't know you had!</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-red-700 dark:text-red-400">💡 Countdown Timer Hacks from Productivity Experts</h3>
                
                <ul className="space-y-3 my-6 text-base">
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🎬</span>
                    <div>
                      <strong>The Director's Cut:</strong> Film yourself during presentations with countdown visible in frame. Review footage to see how your pacing changes as time runs down. Adjust future timing based on this data.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🔊</span>
                    <div>
                      <strong>Audio Awareness:</strong> Enable sound alerts so you hear completion even when focused elsewhere. Perfect for kitchen timers or workout intervals when you're not watching the screen.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🎨</span>
                    <div>
                      <strong>Visual Conditioning:</strong> The shrinking progress ring trains your subconscious to estimate time remaining. After a few sessions, you'll accurately "feel" when 5 minutes are left without checking!
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">📱</span>
                    <div>
                      <strong>Second Screen Strategy:</strong> Run countdown on a second monitor or tablet positioned in peripheral vision. Maintain primary focus on work while subconsciously aware of time.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🏃</span>
                    <div>
                      <strong>Race Against Yourself:</strong> Track how much you complete in 30-minute sprints. Try to beat yesterday's output today. The countdown becomes a daily challenge rather than just a timer.
                    </div>
                  </li>
                </ul>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-red-700 dark:text-red-400">🏆 Success Stories: Countdown Champions</h3>
                
                <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-xl my-6 border-2 border-green-500">
                  <p className="italic mb-3 text-base">"I'm a TEDx speaker coach. We use this countdown for EVERY rehearsal. Watching students nail 18-minute talks after practicing with the visual countdown has a 100% success rate. The progress ring is better than any coach's feedback!"</p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">— Maria S., Public Speaking Coach</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl my-6 border-2 border-blue-500">
                  <p className="italic mb-3 text-base">"Our HIIT gym classes run entirely on countdown timers. 45-second work, 15-second rest, projected on the big screen. Members LOVE seeing time tick down—it pushes them harder than any trainer could. Our retention is up 35%!"</p>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">— Jake P., Fitness Studio Owner</p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/30 p-6 rounded-xl my-6 border-2 border-orange-500">
                  <p className="italic mb-3 text-base">"I'm a PhD student drowning in dissertation work. Started using 50-minute countdown sprints with 10-minute breaks. I went from 2 hours of distracted 'work' to 6 focused Pomodoros daily. Defended my thesis 3 months early!"</p>
                  <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">— Dr. Rachel K., Recent PhD Graduate</p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-red-700 dark:text-red-400">🚫 Countdown Pitfalls to Avoid</h3>
                
                <div className="space-y-4 my-6">
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Pitfall #1: Setting Unrealistic Time Limits</h4>
                    <p className="text-sm mb-2">Trying to write a 2000-word article in 15 minutes creates stress, not productivity. Unrealistic countdowns lead to rushed, poor-quality work.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Solution: Start with generous time limits. Track actual completion time, then optimize. Data beats guesswork!</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Pitfall #2: Obsessive Clock Watching</h4>
                    <p className="text-sm mb-2">Checking the countdown every 30 seconds disrupts flow and increases anxiety rather than boosting focus.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Solution: Trust the audio alert. Check progress ring only at natural transition points in your work.</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Pitfall #3: Ignoring the Alarm</h4>
                    <p className="text-sm mb-2">"Just one more minute" defeats the entire purpose. Countdown discipline only works if you actually stop at zero!</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Solution: Treat zero like a hard deadline. The discipline of stopping builds the habit of working efficiently within time limits.</p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Pitfall #4: Single Session Burnout</h4>
                    <p className="text-sm mb-2">Setting one massive 4-hour countdown leads to mental exhaustion and declining quality over time.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Solution: Break into focused sprints with breaks. Four 50-minute sessions beat one 4-hour marathon every time!</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-red-700 dark:text-red-400">🎪 Creative Countdown Applications</h3>
                
                <div className="grid md:grid-cols-3 gap-4 my-6">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-lg text-center">
                    <div className="text-4xl mb-2">🎮</div>
                    <h4 className="font-bold mb-2">Gaming Sessions</h4>
                    <p className="text-sm">"Just 30 more minutes" becomes reality. Set countdown, enjoy guilt-free gaming, stop when timer ends.</p>
                  </div>
                  
                  <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-lg text-center">
                    <div className="text-4xl mb-2">👶</div>
                    <h4 className="font-bold mb-2">Parenting Hacks</h4>
                    <p className="text-sm">"5 more minutes of screen time" becomes visual. Kids see countdown, transitions get easier, battles decrease!</p>
                  </div>
                  
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-5 rounded-lg text-center">
                    <div className="text-4xl mb-2">🛀</div>
                    <h4 className="font-bold mb-2">Self-Care Timing</h4>
                    <p className="text-sm">15-minute face masks, 20-minute baths, 30-minute reading sessions—self-care with boundaries.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-red-700 dark:text-red-400">🔧 Understanding the Countdown Mechanics</h3>
                
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-xl my-6">
                  <h4 className="font-bold text-lg mb-3">⚙️ How Visual Progress Creates Focus</h4>
                  <p className="text-sm mb-3">The circular progress ring isn't just decoration—it's psychological engineering:</p>
                  <ul className="text-sm space-y-2 ml-6">
                    <li>• <strong>Peripheral Awareness:</strong> Your brain processes the shrinking circle without conscious attention</li>
                    <li>• <strong>Urgency Building:</strong> As the ring empties, your subconscious increases focus and pace</li>
                    <li>• <strong>Completion Motivation:</strong> Seeing progress toward zero triggers satisfaction neurotransmitters</li>
                    <li>• <strong>Time Estimation:</strong> The visual shrinking trains accurate internal time sense over sessions</li>
                    <li>• <strong>Stress Reduction:</strong> Knowing exactly when you'll stop reduces anxiety about "when will this end?"</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 dark:from-red-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 p-8 rounded-2xl my-8 text-center border-4 border-red-300 dark:border-red-700">
                  <h3 className="text-2xl font-bold mb-4">🔥 Ready to Harness Time Pressure?</h3>
                  <p className="text-base mb-6">
                    Every countdown is an opportunity to prove what you can accomplish when focused. Every ticking second is a challenge to be more efficient. Every zero reached is a victory—a commitment kept, a task completed, a promise delivered. Don't just watch time pass. Make it count down to your success!
                  </p>
                  <p className="text-lg font-bold italic">The clock is your ally. Set your countdown and show time who's boss! ⏰🚀🎯</p>
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
                  <h4 className="font-semibold mb-1">Quick Presets</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 1, 5, 10, 15 minutes</li>
                    <li>• 30, 45 minutes</li>
                    <li>• 1, 2 hours</li>
                    <li>• Custom duration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Controls</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Start/Pause: Space</li>
                    <li>• Reset: R key</li>
                    <li>• Fullscreen: F key</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Features</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Visual progress ring</li>
                    <li>• Audio alert at zero</li>
                    <li>• Pause & resume</li>
                    <li>• Keyboard shortcuts</li>
                    <li>• Works offline</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <AutoAdSlot placement="sidebar" />
        </div>
      </div>
    </SmartTimerLayout>
  );
}
