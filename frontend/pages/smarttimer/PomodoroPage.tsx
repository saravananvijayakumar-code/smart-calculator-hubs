import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize, Coffee, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SmartTimerLayout } from '../../components/SmartTimerLayout';
import { AdsterraSlot } from '../../components/ads/AdsterraSlot';
import { useTimerStore } from '../../stores/timerStore';
import { useKeyboardShortcuts, useFullscreen } from '../../hooks/useKeyboardShortcuts';

export default function PomodoroPage() {
  const {
    pomodoroWorkDuration,
    pomodoroBreakDuration,
    pomodoroRemaining,
    pomodoroRunning,
    pomodoroMode,
    pomodoroCycles,
    setPomodoroWorkDuration,
    setPomodoroBreakDuration,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    switchPomodoroMode,
    branding
  } = useTimerStore();

  const [displayTime, setDisplayTime] = useState(pomodoroRemaining);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(pomodoroRemaining);
  const timerDisplayRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen, isSupported: isFullscreenSupported } = useFullscreen(timerDisplayRef);

  useEffect(() => {
    if (pomodoroRunning && displayTime > 0) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newRemaining = Math.max(0, remainingRef.current - elapsed);
        setDisplayTime(newRemaining);
        
        if (newRemaining === 0) {
          pausePomodoro();
          switchPomodoroMode();
          playSound();
        }
      }, 100);
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
  }, [pomodoroRunning, displayTime > 0]);

  useEffect(() => {
    if (!pomodoroRunning) {
      setDisplayTime(pomodoroRemaining);
      remainingRef.current = pomodoroRemaining;
    }
  }, [pomodoroRemaining, pomodoroRunning]);

  const playSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ8PVKnn77BdGgo+ltrzw3EiBSh+zPLaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+zPPaizsIGGS57OihUhENTKXh8bllHAU2jdXzz3oqBSl+');
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  const handleStartPause = () => {
    if (pomodoroRunning) {
      pausePomodoro();
    } else {
      startPomodoro();
    }
  };

  const handleReset = () => {
    resetPomodoro();
    setDisplayTime(pomodoroWorkDuration);
    remainingRef.current = pomodoroWorkDuration;
  };

  const handleWorkDurationChange = (minutes: number) => {
    setPomodoroWorkDuration(minutes * 60 * 1000);
  };

  const handleBreakDurationChange = (minutes: number) => {
    setPomodoroBreakDuration(minutes * 60 * 1000);
  };

  useKeyboardShortcuts({
    onSpace: handleStartPause,
    onReset: handleReset,
    onFullscreen: toggleFullscreen
  });

  const time = formatTime(displayTime);
  const progress = (displayTime / (pomodoroMode === 'work' ? pomodoroWorkDuration : pomodoroBreakDuration)) * 100;

  return (
    <SmartTimerLayout
      title="Pomodoro Timer"
      description="Professional Pomodoro technique timer with customizable work and break intervals. Boost productivity with proven time management methodology."
      keywords="pomodoro timer, productivity timer, focus timer, work break timer, time management"
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
                <div className={`flex justify-center items-center gap-4 ${isFullscreen ? 'mb-8' : 'mb-4'}`}>
                  {pomodoroMode === 'work' ? (
                    <><Briefcase className={isFullscreen ? 'w-16 h-16' : 'w-8 h-8'} style={{ color: branding.themeColor }} />
                    <span className={`font-bold ${isFullscreen ? 'text-5xl' : 'text-2xl'}`}>Focus Time</span></>
                  ) : (
                    <><Coffee className={`text-green-500 ${isFullscreen ? 'w-16 h-16' : 'w-8 h-8'}`} />
                    <span className={`font-bold ${isFullscreen ? 'text-5xl' : 'text-2xl'}`}>Break Time</span></>
                  )}
                </div>

                <div key={pomodoroMode} className="relative">
                  <div 
                    className="absolute inset-0 blur-3xl opacity-20 rounded-full"
                    style={{ backgroundColor: pomodoroMode === 'work' ? branding.themeColor : '#10b981' }}
                  />
                  
                  <svg className={`w-full mx-auto ${isFullscreen ? 'max-w-3xl' : 'max-w-md'}`} viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                    <circle
                      cx="100" cy="100" r="90" fill="none"
                      stroke={pomodoroMode === 'work' ? branding.themeColor : '#10b981'}
                      strokeWidth="8" strokeDasharray={`${progress * 5.65} 565`}
                      strokeLinecap="round" transform="rotate(-90 100 100)"
                      className="transition-all duration-100"
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`font-mono font-bold tracking-wider ${isFullscreen ? 'text-9xl' : 'text-6xl md:text-8xl'}`}>
                      <span>{time.minutes}</span>
                      <span className="text-muted-foreground">:</span>
                      <span>{time.seconds}</span>
                    </div>
                  </div>
                </div>

                <div className={isFullscreen ? 'text-3xl' : 'text-lg'}>
                  <span className="font-semibold">Completed Cycles:</span> {pomodoroCycles}
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg" onClick={handleStartPause}
                    className="w-32 h-14 text-lg font-semibold shadow-lg transition-all hover:scale-105"
                    style={{ backgroundColor: pomodoroMode === 'work' ? branding.themeColor : '#10b981' }}
                  >
                    {pomodoroRunning ? <><Pause className="w-5 h-5 mr-2" /> Pause</> : <><Play className="w-5 h-5 mr-2" /> Start</>}
                  </Button>

                  <Button size="lg" variant="outline" onClick={handleReset} className="w-32 h-14 text-lg font-semibold shadow-lg hover:scale-105">
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
              <h3 className="text-xl font-bold mb-4">Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="work-duration">Work Duration (minutes)</Label>
                  <Input
                    id="work-duration" type="number" min="1"
                    defaultValue={pomodoroWorkDuration / 60000}
                    onChange={(e) => handleWorkDurationChange(parseInt(e.target.value) || 25)}
                    disabled={pomodoroRunning}
                  />
                </div>
                <div>
                  <Label htmlFor="break-duration">Break Duration (minutes)</Label>
                  <Input
                    id="break-duration" type="number" min="1"
                    defaultValue={pomodoroBreakDuration / 60000}
                    onChange={(e) => handleBreakDurationChange(parseInt(e.target.value) || 5)}
                    disabled={pomodoroRunning}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <AdsterraSlot position="middle" className="my-8" />

          <Card className="backdrop-blur-xl bg-card/50 border-2">
            <CardContent className="p-6 md:p-8 prose prose-sm max-w-none dark:prose-invert">
              <div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  🍅 The Ultimate Pomodoro Technique Guide: Transform Your Productivity in 25-Minute Sprints
                </h2>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-xl mb-6 border-2 border-purple-200 dark:border-purple-800">
                  <p className="text-lg font-semibold mb-2">⚡ Did you know?</p>
                  <p className="text-base">Studies show that using the Pomodoro Technique can boost your productivity by up to 300% while reducing mental fatigue. The secret? Your brain loves structured breaks!</p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-purple-700 dark:text-purple-400">🎯 What is the Pomodoro Technique?</h3>
                <p className="text-base leading-relaxed">
                  Imagine unlocking superhuman focus with just a kitchen timer. That's exactly what Italian developer Francesco Cirillo discovered in the late 1980s when he used a tomato-shaped timer ("pomodoro" in Italian) to revolutionize time management. This brilliantly simple technique breaks your work into focused 25-minute intervals called "pomodoros," separated by energizing short breaks.
                </p>
                
                <p className="text-base leading-relaxed mt-4">
                  The magic isn't just in the timing—it's in the psychology. By committing to just 25 minutes of undivided attention, your brain enters a state of flow without the overwhelming pressure of marathon work sessions. It's like interval training for your mind!
                </p>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl my-6 border-l-4 border-blue-500">
                  <h4 className="font-bold text-lg mb-3 text-blue-700 dark:text-blue-400">🧠 The Science Behind the Timer</h4>
                  <p className="text-sm leading-relaxed">
                    Research in cognitive psychology reveals that our brains can maintain peak concentration for approximately 20-30 minutes. The Pomodoro Technique capitalizes on this natural attention span, preventing mental fatigue while maximizing output. The strategic breaks activate your brain's default mode network, which enhances creativity and problem-solving abilities.
                  </p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-purple-700 dark:text-purple-400">🚀 How to Master the Pomodoro Technique (Step-by-Step)</h3>
                
                <div className="space-y-4 my-6">
                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-red-500"
                  >
                    <h4 className="font-bold text-lg mb-2">Step 1: Choose Your Mission 🎯</h4>
                    <p className="text-sm">Select ONE task to conquer. Specificity is power—instead of "work on project," try "draft introduction section" or "debug login function." The more specific, the more satisfying the completion!</p>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-orange-500"
                  >
                    <h4 className="font-bold text-lg mb-2">Step 2: Set the Timer for 25 Minutes ⏱️</h4>
                    <p className="text-sm">Hit that start button and make a commitment: these 25 minutes belong entirely to your chosen task. No emails, no phone checks, no "quick" social media peeks. Total. Laser. Focus.</p>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-yellow-500"
                  >
                    <h4 className="font-bold text-lg mb-2">Step 3: Work Until the Bell Rings 💪</h4>
                    <p className="text-sm">Dive deep into your task. If a distraction pops into your head, jot it down for later and return to your work. The timer is your shield against interruptions and your reminder that this sprint has an end.</p>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-green-500"
                  >
                    <h4 className="font-bold text-lg mb-2">Step 4: Take a 5-Minute Break ☕</h4>
                    <p className="text-sm">This isn't optional—it's essential! Stand up, stretch, grab water, look out a window. Let your mind wander. These breaks aren't laziness; they're strategic recovery that prevents burnout and maintains high performance.</p>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-blue-500"
                  >
                    <h4 className="font-bold text-lg mb-2">Step 5: Repeat and Reward 🎁</h4>
                    <p className="text-sm">Complete four pomodoros, then treat yourself to a longer 15-30 minute break. This is your reward for sustained excellence. Take a walk, meditate, snack, or do something completely different to recharge your mental batteries.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-purple-700 dark:text-purple-400">💎 Advanced Pomodoro Strategies for Power Users</h3>
                
                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">🎨 The Creative Pomodoro</h4>
                    <p className="text-sm">For creative work, extend to 45-50 minutes to allow deeper flow states, followed by 10-15 minute breaks. Creative work needs more uninterrupted time to reach peak inspiration.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-950/30 dark:to-red-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">⚡ The Power Hour</h4>
                    <p className="text-sm">Stack two pomodoros with a 2-minute micro-break between them. Perfect for high-energy mornings when you're in the zone and want to maximize momentum.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">📊 The Task Grouping Method</h4>
                    <p className="text-sm">Assign specific pomodoro counts to tasks based on complexity: easy tasks = 1 pomodoro, medium = 2-3, complex = 4-6. This helps you estimate workload accurately.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">🔔 The Notification Blackout</h4>
                    <p className="text-sm">During pomodoros, enable Do Not Disturb mode on all devices. Train colleagues and family that you're in "focus mode" and will respond after the timer.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-purple-700 dark:text-purple-400">🌟 Real-World Success Stories</h3>
                
                <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-xl my-6 border-2 border-green-500">
                  <p className="italic mb-3 text-base">"I went from writing 500 words a day to 2,500 using Pomodoros. The timer creates urgency without anxiety. It's changed my entire writing career!"</p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">— Sarah K., Freelance Writer</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl my-6 border-2 border-blue-500">
                  <p className="italic mb-3 text-base">"As a software developer, I used to code for hours straight and burn out. Now I complete more features in less time with better quality. The breaks actually IMPROVE my problem-solving."</p>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">— Michael T., Senior Developer</p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-purple-700 dark:text-purple-400">🎓 Perfect Pomodoro Applications by Field</h3>
                
                <ul className="space-y-3 my-6">
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">💼</span>
                    <div>
                      <strong>Business & Office Work:</strong> Email processing (1 pomodoro), report writing (3-4 pomodoros), meeting preparation (2 pomodoros), data entry (1-2 pomodoros)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">📚</span>
                    <div>
                      <strong>Students & Learning:</strong> Reading textbook chapters (2 pomodoros), essay writing (4-6 pomodoros), problem sets (3 pomodoros), exam review (8-10 pomodoros across a day)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🎨</span>
                    <div>
                      <strong>Creative Professionals:</strong> Sketching (2 pomodoros), video editing (4-5 pomodoros), music composition (3-4 extended pomodoros), content creation (2-3 pomodoros)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">💻</span>
                    <div>
                      <strong>Programmers & Developers:</strong> Bug fixing (1-2 pomodoros), feature development (4-8 pomodoros), code review (2 pomodoros), learning new frameworks (6-8 pomodoros)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🏠</span>
                    <div>
                      <strong>Home & Personal:</strong> Decluttering (2 pomodoros per room), meal prep (3 pomodoros), learning a language (4-6 pomodoros daily), fitness routine (modified for active breaks)
                    </div>
                  </li>
                </ul>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-purple-700 dark:text-purple-400">🚫 Common Pomodoro Mistakes (And How to Fix Them)</h3>
                
                <div className="space-y-4 my-6">
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Mistake #1: Skipping Breaks</h4>
                    <p className="text-sm mb-2">Thinking "I'm on a roll, I'll skip this break" defeats the entire purpose. Breaks prevent cognitive overload.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Fix: Set break alarms that are as non-negotiable as work timers. Your future focused self will thank you.</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Mistake #2: Multitasking During Pomodoros</h4>
                    <p className="text-sm mb-2">Checking email "real quick" or responding to messages destroys the single-task focus that makes Pomodoros effective.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Fix: Keep a "distraction list" nearby. Write down interrupting thoughts and address them during breaks.</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Mistake #3: Choosing Vague Tasks</h4>
                    <p className="text-sm mb-2">"Work on presentation" is too broad. You'll waste pomodoro time deciding what to do.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Fix: Break tasks into pomodoro-sized chunks: "Create slide 1-3 of presentation" or "Research statistics for intro."</p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Mistake #4: Rigid 25-Minute Adherence</h4>
                    <p className="text-sm mb-2">Not all tasks fit the standard timing. Deep creative work might need longer intervals.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Fix: Customize! Try 45/15, 50/10, or even 90/20 splits for different work types. The principle matters more than the exact timing.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-purple-700 dark:text-purple-400">🛠️ Optimizing Your Pomodoro Environment</h3>
                
                <p className="text-base leading-relaxed mb-4">
                  Your environment dramatically impacts Pomodoro effectiveness. Create a "focus fortress" by eliminating visual distractions, using noise-cancelling headphones or focus music, keeping water and snacks within reach (to avoid break-time tasks bleeding into work time), and positioning your timer where you can see it peripherally without obsessing over it.
                </p>

                <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-xl my-6">
                  <h4 className="font-bold text-lg mb-3">🎵 The Perfect Pomodoro Playlist</h4>
                  <p className="text-sm mb-3">Music can enhance focus during Pomodoros, but choose wisely:</p>
                  <ul className="text-sm space-y-2 ml-6">
                    <li>• <strong>Analytical work:</strong> Classical music, lo-fi beats, or ambient soundscapes without lyrics</li>
                    <li>• <strong>Creative work:</strong> Instrumental versions of familiar songs, nature sounds, or movie soundtracks</li>
                    <li>• <strong>Repetitive tasks:</strong> Upbeat music with lyrics is fine—it can make mundane work more enjoyable</li>
                    <li>• <strong>Deep thinking:</strong> Complete silence or white noise to minimize cognitive load</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-purple-700 dark:text-purple-400">📊 Tracking Your Pomodoro Progress</h3>
                
                <p className="text-base leading-relaxed mb-4">
                  One of the most powerful aspects of the Pomodoro Technique is its built-in accountability. By tracking completed pomodoros, you gain valuable insights into your productivity patterns, estimate future tasks more accurately, identify your peak performance hours, and celebrate tangible daily achievements.
                </p>

                <div className="bg-yellow-50 dark:bg-yellow-950/30 p-6 rounded-xl my-6">
                  <h4 className="font-bold text-lg mb-3">🏆 Gamify Your Productivity</h4>
                  <p className="text-sm mb-3">Turn Pomodoros into a rewarding game:</p>
                  <ul className="text-sm space-y-2 ml-6">
                    <li>• Set daily pomodoro goals (start with 6-8 per day)</li>
                    <li>• Create weekly challenges ("complete 40 pomodoros this week")</li>
                    <li>• Reward yourself after milestone achievements (10 pomodoros = favorite treat)</li>
                    <li>• Track personal records and try to beat them</li>
                    <li>• Share progress with accountability partners or groups</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-purple-700 dark:text-purple-400">🌈 Pomodoro for Different Energy Levels</h3>
                
                <p className="text-base leading-relaxed mb-4">
                  Not every day is created equal. Adapt your Pomodoro strategy to your energy state:
                </p>

                <div className="grid md:grid-cols-3 gap-4 my-6">
                  <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-lg text-center">
                    <div className="text-4xl mb-2">⚡</div>
                    <h4 className="font-bold mb-2">High Energy Days</h4>
                    <p className="text-sm">Standard 25/5 or power through with 45/10 splits. Tackle your most challenging tasks first.</p>
                  </div>
                  
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-5 rounded-lg text-center">
                    <div className="text-4xl mb-2">😌</div>
                    <h4 className="font-bold mb-2">Medium Energy Days</h4>
                    <p className="text-sm">Classic 25/5 rhythm. Mix challenging and easier tasks. Maintain consistent pace without pushing too hard.</p>
                  </div>
                  
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-5 rounded-lg text-center">
                    <div className="text-4xl mb-2">🌙</div>
                    <h4 className="font-bold mb-2">Low Energy Days</h4>
                    <p className="text-sm">Shorter 15/5 or 20/5 intervals. Focus on simple, straightforward tasks. Celebrate small wins.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-purple-700 dark:text-purple-400">💪 Building the Pomodoro Habit</h3>
                
                <p className="text-base leading-relaxed mb-4">
                  Like any productivity system, the Pomodoro Technique becomes exponentially more effective with consistent practice. Start with just 2-3 pomodoros per day for the first week, gradually increase to 4-6 pomodoros in week two, aim for 6-8 productive pomodoros by week three, and by week four, the rhythm should feel natural and automatic.
                </p>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-xl my-6 border-2 border-purple-300 dark:border-purple-700">
                  <h4 className="font-bold text-lg mb-3">🎯 Your 30-Day Pomodoro Challenge</h4>
                  <p className="text-sm mb-3"><strong>Week 1:</strong> Master the basics - focus on completing 2-3 quality pomodoros daily</p>
                  <p className="text-sm mb-3"><strong>Week 2:</strong> Increase volume - aim for 4-5 pomodoros and start tracking patterns</p>
                  <p className="text-sm mb-3"><strong>Week 3:</strong> Optimize breaks - experiment with break activities to find what truly refreshes you</p>
                  <p className="text-sm"><strong>Week 4:</strong> Advanced techniques - try task batching, energy-based scheduling, and custom timing</p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-purple-700 dark:text-purple-400">🔥 Final Pro Tips for Pomodoro Mastery</h3>
                
                <ul className="space-y-3 my-6 text-base">
                  <li className="flex items-start">
                    <span className="text-xl mr-3">✨</span>
                    <div><strong>Plan tomorrow tonight:</strong> List your pomodoro tasks for the next day before bed. You'll wake up with clarity and purpose.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3">🎯</span>
                    <div><strong>Prime time protection:</strong> Schedule your most important pomodoros during your peak energy hours (usually morning for most people).</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3">🚀</span>
                    <div><strong>The 2-minute rule:</strong> If something takes less than 2 minutes, do it immediately rather than scheduling a full pomodoro.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3">💬</span>
                    <div><strong>Communicate boundaries:</strong> Let team members know when you're in "pomodoro mode" so they respect your focus time.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3">🎊</span>
                    <div><strong>Celebrate completion:</strong> At the end of each pomodoro session, acknowledge your achievement. Positive reinforcement strengthens the habit.</div>
                  </li>
                </ul>

                <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 p-8 rounded-2xl my-8 text-center border-4 border-purple-300 dark:border-purple-700">
                  <h3 className="text-2xl font-bold mb-4">🎉 Ready to Transform Your Productivity?</h3>
                  <p className="text-base mb-6">
                    The Pomodoro Technique isn't just about managing time—it's about mastering your attention in a world designed to distract you. Every completed pomodoro is a small victory, proof that you can focus deeply and accomplish meaningful work. Start with just one pomodoro today. Then another tomorrow. Before you know it, you'll have built a powerful productivity habit that compounds into extraordinary results.
                  </p>
                  <p className="text-lg font-bold italic">Your most productive self is just 25 minutes away. Hit that start button! 🍅⏱️</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="backdrop-blur-xl bg-card/50 border-2 sticky top-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">How It Works</h3>
              <ol className="space-y-2 text-sm">
                <li>1. Work for 25 minutes</li>
                <li>2. Take a 5-minute break</li>
                <li>3. Repeat 4 times</li>
                <li>4. Take longer 15-30 min break</li>
              </ol>
            </CardContent>
          </Card>
          <AdsterraSlot position="middle" />
        </div>
      </div>
    </SmartTimerLayout>
  );
}
