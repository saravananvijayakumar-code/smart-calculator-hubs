import { useEffect, useRef } from 'react';
import { Plus, Play, Pause, RotateCcw, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SmartTimerLayout } from '../../components/SmartTimerLayout';
import AutoAdSlot from '../../components/ads/AutoAdSlot';
import AmazonAffiliate from '../../components/ads/AmazonAffiliate';
import { useTimerStore } from '../../stores/timerStore';
import { useState } from 'react';

export default function MultiTimerPage() {
  const { multiTimers, addMultiTimer, removeMultiTimer, startMultiTimer, pauseMultiTimer, resetMultiTimer, branding } = useTimerStore();
  const [newTimerName, setNewTimerName] = useState('');
  const [newTimerMinutes, setNewTimerMinutes] = useState('5');
  const intervalRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    multiTimers.forEach(timer => {
      const hasInterval = intervalRefs.current.has(timer.id);
      
      if (timer.isRunning && timer.elapsed < timer.duration) {
        if (!hasInterval) {
          const interval = setInterval(() => {
            useTimerStore.setState((state) => ({
              multiTimers: state.multiTimers.map(t => 
                t.id === timer.id && t.isRunning && t.elapsed < t.duration
                  ? { ...t, elapsed: Math.min(t.elapsed + 100, t.duration) }
                  : t
              )
            }));
          }, 100);
          intervalRefs.current.set(timer.id, interval);
        }
      } else if (hasInterval) {
        const interval = intervalRefs.current.get(timer.id);
        if (interval) {
          clearInterval(interval);
          intervalRefs.current.delete(timer.id);
        }
      }
    });

    intervalRefs.current.forEach((interval, id) => {
      if (!multiTimers.find(t => t.id === id)) {
        clearInterval(interval);
        intervalRefs.current.delete(id);
      }
    });
  }, [multiTimers]);

  const handleAddTimer = () => {
    if (newTimerName && newTimerMinutes) {
      const duration = parseInt(newTimerMinutes) * 60 * 1000;
      addMultiTimer(newTimerName, duration);
      setNewTimerName('');
      setNewTimerMinutes('5');
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SmartTimerLayout
      title="Multi-Timer Manager"
      description="Manage multiple countdown timers simultaneously. Perfect for complex workflows, cooking multiple dishes, or managing multiple tasks."
      keywords="multi timer, multiple timers, parallel timers, task timer, cooking timer"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="backdrop-blur-xl bg-card/50 border-2">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Add New Timer</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="timer-name">Timer Name</Label>
                  <Input
                    id="timer-name" value={newTimerName}
                    onChange={(e) => setNewTimerName(e.target.value)}
                    placeholder="e.g., Pasta, Meeting, Task 1"
                  />
                </div>
                <div>
                  <Label htmlFor="timer-duration">Minutes</Label>
                  <div className="flex gap-2">
                    <Input
                      id="timer-duration" type="number" min="1"
                      value={newTimerMinutes}
                      onChange={(e) => setNewTimerMinutes(e.target.value)}
                    />
                    <Button onClick={handleAddTimer} style={{ backgroundColor: branding.themeColor }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {multiTimers.map((timer) => {
                const remaining = timer.duration - timer.elapsed;
                const progress = (remaining / timer.duration) * 100;
                
                return (
                  <div key={timer.id}>
                    <Card className="backdrop-blur-xl bg-card/50 border-2">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-bold text-lg">{timer.name}</h4>
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => removeMultiTimer(timer.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-4xl font-mono font-bold text-center my-4">
                          {formatTime(remaining)}
                        </div>

                        <div className="w-full bg-muted rounded-full h-2 mb-4">
                          <div
                            className="h-2 rounded-full transition-all duration-100"
                            style={{ width: `${progress}%`, backgroundColor: branding.themeColor }}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            onClick={() => timer.isRunning ? pauseMultiTimer(timer.id) : startMultiTimer(timer.id)}
                            style={{ backgroundColor: branding.themeColor }}
                          >
                            {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button variant="outline" onClick={() => resetMultiTimer(timer.id)}>
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {multiTimers.length === 0 && (
            <Card className="backdrop-blur-xl bg-card/50 border-2">
              <CardContent className="p-12 text-center text-muted-foreground">
                <p>No timers yet. Add your first timer above!</p>
              </CardContent>
            </Card>
          )}

          <AutoAdSlot placement="mid-content" className="my-8" />

          <Card className="backdrop-blur-xl bg-card/50 border-2">
            <CardContent className="p-6 md:p-8 prose prose-sm max-w-none dark:prose-invert">
              <div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ⏱️ Master Multi-Timer Management: The Ultimate Guide to Parallel Productivity
                </h2>
                
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-6 rounded-xl mb-6 border-2 border-orange-200 dark:border-orange-800">
                  <p className="text-lg font-semibold mb-2">🎯 The Multi-Tasking Paradox, Solved!</p>
                  <p className="text-base">While humans can't truly multitask mentally, we CAN manage multiple time-sensitive processes simultaneously. Multi-timers are the secret weapon of chefs, project managers, parents, and productivity masters who need to track several parallel activities without dropping a single ball!</p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-orange-700 dark:text-orange-400">🚀 What Are Multi-Timers and Why They're Game-Changing</h3>
                <p className="text-base leading-relaxed">
                  Imagine you're cooking a complex meal: pasta needs 12 minutes, vegetables need 8 minutes, and your sauce requires 15 minutes of simmering. Trying to track all three in your head is a recipe for disaster (and overcooked pasta). This is where multi-timer systems transform chaos into orchestrated precision.
                </p>
                
                <p className="text-base leading-relaxed mt-4">
                  A multi-timer manager allows you to run multiple countdown timers simultaneously, each with its own name, duration, and purpose. Unlike single timers that force you to choose one task to track, multi-timers embrace the reality of modern life: we often have several time-sensitive activities happening at once, and we need to monitor all of them without cognitive overload.
                </p>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl my-6 border-l-4 border-blue-500">
                  <h4 className="font-bold text-lg mb-3 text-blue-700 dark:text-blue-400">🧠 The Cognitive Load Solution</h4>
                  <p className="text-sm leading-relaxed">
                    Neuroscience research shows that our working memory can only hold about 4-7 items at once. When you try to mentally track multiple timers, you're consuming precious cognitive resources that should be focused on the tasks themselves. External multi-timers free up your brain to work on quality, not time-tracking!
                  </p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-orange-700 dark:text-orange-400">👨‍🍳 The Art of Multi-Timer Mastery: Scenarios and Strategies</h3>
                
                <div className="space-y-4 my-6">
                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-red-500"
                  >
                    <h4 className="font-bold text-lg mb-2">🍳 Culinary Excellence: Multi-Timer Cooking</h4>
                    <p className="text-sm mb-3">Professional chefs juggle dozens of timings simultaneously. Multi-timers bring this expertise to your kitchen:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Holiday Dinners:</strong> Turkey (3.5 hours), stuffing (45 min), green beans (12 min), rolls (15 min), gravy (20 min)</li>
                      <li>• <strong>Meal Prep Sundays:</strong> Track chicken roasting, rice cooking, vegetables steaming, and eggs boiling—all at once!</li>
                      <li>• <strong>Baking Bonanzas:</strong> Cookies (12 min), cake (45 min), bread rising (90 min), frosting setting (30 min)</li>
                      <li>• <strong>Grill Masters:</strong> Steaks (6 min per side), vegetables (10 min), corn (8 min), warming buns (3 min)</li>
                      <li>• <strong>Perfect Pasta Timing:</strong> Pasta (11 min), sauce reduction (8 min), garlic bread (5 min), salad dressing (2 min)</li>
                    </ul>
                    <p className="text-sm mt-3 italic">Pro Tip: Start longest timers first, then add shorter ones as you go. Everything finishes together perfectly!</p>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-blue-500"
                  >
                    <h4 className="font-bold text-lg mb-2">💼 Project Management Power Moves</h4>
                    <p className="text-sm mb-3">Track multiple project phases, deadlines, and stakeholder deliverables:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Client Deliverables:</strong> Design mockups (2 hours), content draft (3 hours), code review (1 hour), QA testing (90 min)</li>
                      <li>• <strong>Meeting Prep Marathon:</strong> Presentation deck (45 min), data analysis (30 min), talking points (15 min), rehearsal (20 min)</li>
                      <li>• <strong>Sprint Planning:</strong> Individual task estimates running simultaneously so you can see total team capacity in real-time</li>
                      <li>• <strong>Launch Coordination:</strong> Marketing email (30 min), social posts (20 min), blog publish (15 min), PR outreach (25 min)</li>
                      <li>• <strong>Event Management:</strong> Registration setup (40 min), speaker coordination (25 min), AV testing (15 min), catering confirmation (10 min)</li>
                    </ul>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-purple-500"
                  >
                    <h4 className="font-bold text-lg mb-2">🏃 Fitness & Exercise Circuits</h4>
                    <p className="text-sm mb-3">Transform your workout with precision timing for complex routines:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>HIIT Circuits:</strong> Burpees (45 sec), mountain climbers (45 sec), jumping jacks (45 sec), rest periods (30 sec each)</li>
                      <li>• <strong>Yoga Flow:</strong> Different poses each with specific hold times—warrior (90 sec), plank (60 sec), tree pose (45 sec per side)</li>
                      <li>• <strong>Strength Training:</strong> Track rest periods between sets across multiple exercises happening on different schedules</li>
                      <li>• <strong>Boxing Rounds:</strong> Round 1 (3 min), rest (1 min), Round 2 (3 min), rest (1 min)—repeat with different combinations</li>
                      <li>• <strong>Stretching Routine:</strong> Each major muscle group gets its own timer for optimal flexibility gains</li>
                    </ul>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-green-500"
                  >
                    <h4 className="font-bold text-lg mb-2">👨‍👩‍👧 Parenting Productivity Hacks</h4>
                    <p className="text-sm mb-3">Manage the controlled chaos of family life with surgical precision:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Morning Routine:</strong> Kid 1 breakfast (15 min), Kid 2 getting dressed (10 min), backpack check (5 min), leaving buffer (3 min)</li>
                      <li>• <strong>Homework Sessions:</strong> Math homework (20 min), reading (15 min), spelling practice (10 min), review (5 min)</li>
                      <li>• <strong>Screen Time Management:</strong> Video games (30 min), tablet time (20 min), TV show (22 min)—fair tracking for multiple kids</li>
                      <li>• <strong>Bedtime Orchestration:</strong> Bath (15 min), pajamas (5 min), teeth brushing (3 min), story time (10 min), lights out buffer (2 min)</li>
                      <li>• <strong>Sibling Activity Rotation:</strong> Each child gets dedicated parent time tracked separately but simultaneously</li>
                    </ul>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-yellow-500"
                  >
                    <h4 className="font-bold text-lg mb-2">📚 Study Session Optimization</h4>
                    <p className="text-sm mb-3">Maximize learning efficiency across multiple subjects:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Subject Rotation:</strong> Math (45 min), History (30 min), Language (40 min), Science (35 min)—all tracked independently</li>
                      <li>• <strong>Exam Prep Marathon:</strong> Practice test (90 min), review session (30 min), flashcards (20 min), break reminder (10 min)</li>
                      <li>• <strong>Reading Assignments:</strong> Chapter 1 (25 min), Chapter 2 (25 min), notes compilation (15 min), summary writing (20 min)</li>
                      <li>• <strong>Language Learning:</strong> Vocabulary (15 min), grammar exercises (20 min), listening practice (15 min), speaking practice (10 min)</li>
                      <li>• <strong>Group Study Coordination:</strong> Individual research (30 min), group discussion (25 min), presentation prep (20 min)</li>
                    </ul>
                  </div>

                  <div 
                    className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-pink-500"
                  >
                    <h4 className="font-bold text-lg mb-2">🎨 Creative Production Workflows</h4>
                    <p className="text-sm mb-3">Balance multiple creative processes without losing flow:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Content Creation:</strong> Writing (90 min), image editing (45 min), video rendering (background), SEO optimization (30 min)</li>
                      <li>• <strong>Podcast Production:</strong> Recording (60 min), editing audio (90 min), show notes (30 min), social media graphics (40 min)</li>
                      <li>• <strong>Graphic Design:</strong> Sketching concepts (30 min), digital rendering (60 min), color adjustments (20 min), export prep (10 min)</li>
                      <li>• <strong>Music Production:</strong> Drum programming (45 min), bass line (30 min), melody composition (40 min), mixing (90 min)</li>
                      <li>• <strong>Video Editing:</strong> Rough cut (2 hours), color grading (45 min), audio mixing (30 min), export rendering (background)</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-orange-700 dark:text-orange-400">🎯 Advanced Multi-Timer Strategies</h3>
                
                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">🔄 The Cascade Start Method</h4>
                    <p className="text-sm">Start timers in reverse order of completion time. If Task A takes 60 min and Task B takes 20 min, start Task A, then start Task B 40 minutes later. Both finish simultaneously for perfect coordination!</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-950/30 dark:to-red-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">⚡ The Priority Flag System</h4>
                    <p className="text-sm">Use naming conventions to indicate priority: ⭐URGENT⭐, 🔥HOT🔥, or ✅ROUTINE✅. At a glance, you know which finishing timer needs immediate attention vs which can wait a minute.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">📊 The Buffer Time Technique</h4>
                    <p className="text-sm">Add 10-20% buffer time to each timer to account for transitions between tasks. Instead of exactly 20 minutes, set 22 minutes. This prevents the domino effect when one task runs slightly over.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">🎭 The Context Switching Minimizer</h4>
                    <p className="text-sm">Group similar tasks together on your multi-timer display. All cooking timers in one section, all work timers together. This reduces cognitive load when checking statuses and switching between task types.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-orange-700 dark:text-orange-400">💡 Multi-Timer Naming Strategies</h3>
                
                <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-xl my-6 border-2 border-purple-500">
                  <h4 className="font-bold text-lg mb-3">🏷️ The Perfect Timer Name Formula</h4>
                  <p className="text-sm mb-3">Great timer names are:</p>
                  <ul className="text-sm space-y-2 ml-6">
                    <li>• <strong>Specific:</strong> "Pasta boiling" beats "Food" every time</li>
                    <li>• <strong>Action-oriented:</strong> "Finish slide deck" is better than "Presentation"</li>
                    <li>• <strong>Contextual:</strong> "Client Call - Sarah" vs just "Call"</li>
                    <li>• <strong>Priority-indicated:</strong> "🔥URGENT - Submit proposal" makes importance crystal clear</li>
                    <li>• <strong>Scannable:</strong> Keep names under 25 characters so you can read them at a glance</li>
                  </ul>
                  <p className="text-sm mt-3 font-semibold">Example: Instead of "Task 1, Task 2, Task 3," use "🥩Steak medium-rare, 🥔Potatoes roasting, 🥗Salad dressing"</p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-orange-700 dark:text-orange-400">🎪 Real-World Multi-Timer Success Stories</h3>
                
                <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-xl my-6 border-2 border-green-500">
                  <p className="italic mb-3 text-base">"As a restaurant line cook, I was drowning trying to remember 8 different dish timings during dinner rush. Multi-timers saved my career. Now I can handle 12 orders simultaneously with zero mistakes. Tickets go out hot and perfect every time!"</p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">— Carlos M., Professional Chef</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl my-6 border-2 border-blue-500">
                  <p className="italic mb-3 text-base">"Managing three kids' homework, dinner prep, and my own work deadlines was impossible until I discovered multi-timers. Now I set timers for each child's subjects, my cooking steps, and my work tasks. Evening chaos became evening choreography!"</p>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">— Patricia L., Work-from-Home Mom</p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/30 p-6 rounded-xl my-6 border-2 border-orange-500">
                  <p className="italic mb-3 text-base">"My CrossFit gym uses multi-timers for every WOD. We run different circuits for different skill levels simultaneously—all tracked on one screen. Members love seeing their specific timer, and coaches can manage the whole class effortlessly."</p>
                  <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">— Jake T., CrossFit Trainer</p>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-orange-700 dark:text-orange-400">🚫 Common Multi-Timer Mistakes (And How to Avoid Them)</h3>
                
                <div className="space-y-4 my-6">
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Mistake #1: Timer Overload</h4>
                    <p className="text-sm mb-2">Running 10+ timers simultaneously creates the same mental chaos you're trying to avoid.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Fix: Limit yourself to 5-6 active timers max. If you need more, you probably need to simplify your workflow.</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Mistake #2: Vague Timer Names</h4>
                    <p className="text-sm mb-2">"Timer 1," "Timer 2," "Thing" tell you nothing when three timers go off within 30 seconds of each other.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Fix: Always use descriptive, specific names that tell you exactly what needs attention when time expires.</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Mistake #3: Ignoring Finished Timers</h4>
                    <p className="text-sm mb-2">Letting completed timers sit there clutters your view and makes it hard to see what's still active.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Fix: Immediately remove or reset completed timers. Keep your dashboard clean and focused on active tasks only.</p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold mb-2">❌ Mistake #4: No Audio Differentiation</h4>
                    <p className="text-sm mb-2">When multiple timers finish close together, you can't tell which one just went off without looking.</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">✅ Fix: Check your timers visually every 2-3 minutes, or position yourself where you can always see the screen. Anticipate endings rather than reacting to alarms.</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-orange-700 dark:text-orange-400">🔥 Pro Tips for Multi-Timer Mastery</h3>
                
                <ul className="space-y-3 my-6 text-base">
                  <li className="flex items-start">
                    <span className="text-xl mr-3">⚡</span>
                    <div><strong>Start with Time Clustering:</strong> Group tasks by completion time windows (5-10 min, 15-20 min, 30-45 min) so endings don't all happen at once.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3">🎯</span>
                    <div><strong>Use Color Psychology:</strong> If you can customize colors, use red for urgent/hot items, yellow for important, green for routine. Your brain processes color faster than text.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3">📱</span>
                    <div><strong>Position Strategically:</strong> Keep your multi-timer display in peripheral vision while you work. You'll notice changes without constantly checking.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3">🔄</span>
                    <div><strong>Create Templates:</strong> If you repeat the same multi-timer setups (weekly meal prep, daily workout, monthly reports), save the timer names and durations for quick setup.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3">⏰</span>
                    <div><strong>The 5-Minute Check-In:</strong> Set a meta-timer that reminds you to glance at your multi-timer dashboard every 5 minutes. This prevents surprises and keeps you on top of everything.</div>
                  </li>
                </ul>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-orange-700 dark:text-orange-400">🎨 Visual Organization Strategies</h3>
                
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-xl my-6">
                  <h4 className="font-bold text-lg mb-3">👁️ The Dashboard Optimization Method</h4>
                  <p className="text-sm mb-3">Organize your multi-timer display for maximum efficiency:</p>
                  <ul className="text-sm space-y-2 ml-6">
                    <li>• <strong>Top Row:</strong> Most urgent/soon-to-finish timers</li>
                    <li>• <strong>Middle Section:</strong> Active work timers you're currently engaged with</li>
                    <li>• <strong>Bottom Area:</strong> Longer-duration timers that won't need attention for a while</li>
                    <li>• <strong>Quick Glance Test:</strong> Can you see all timer names and remaining times without scrolling? If not, you have too many active.</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-orange-700 dark:text-orange-400">🌟 Industry-Specific Multi-Timer Workflows</h3>
                
                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">💻 Software Development</h4>
                    <p className="text-sm mb-2">Track build times, test runs, code review sessions, and feature implementation sprints—all simultaneously.</p>
                    <p className="text-xs italic">Example: "Build deploy (8 min), Unit tests (5 min), Code review (30 min), Coffee break (10 min)"</p>
                  </div>
                  
                  <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">🏥 Healthcare & Therapy</h4>
                    <p className="text-sm mb-2">Patient appointment durations, medication administration times, treatment protocols, waiting room management.</p>
                    <p className="text-xs italic">Example: "Patient A session (45 min), Lab results review (15 min), Chart updates (20 min)"</p>
                  </div>
                  
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">📺 Content Production</h4>
                    <p className="text-sm mb-2">Recording segments, editing passes, rendering previews, upload processes—all happening in parallel.</p>
                    <p className="text-xs italic">Example: "Record intro (10 min), Edit section 1 (60 min), Render preview (background), Upload (15 min)"</p>
                  </div>
                  
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-5 rounded-lg">
                    <h4 className="font-bold mb-2">🏃 Personal Training</h4>
                    <p className="text-sm mb-2">Client session durations, circuit intervals, rest periods, class transitions—precise timing is everything.</p>
                    <p className="text-xs italic">Example: "Client workout (50 min), Equipment setup (5 min), Cool-down (10 min), Session notes (5 min)"</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-orange-700 dark:text-orange-400">🎓 Learning to Think in Parallel Time</h3>
                
                <p className="text-base leading-relaxed mb-4">
                  The real power of multi-timers isn't just tracking—it's developing "parallel time consciousness." This is the ability to mentally model multiple time streams simultaneously, understanding how different processes interact and overlap. It's the difference between reacting to timers and orchestrating them.
                </p>

                <div className="bg-yellow-50 dark:bg-yellow-950/30 p-6 rounded-xl my-6">
                  <h4 className="font-bold text-lg mb-3">🧩 The 30-Day Multi-Timer Challenge</h4>
                  <p className="text-sm mb-3"><strong>Week 1:</strong> Start with just 2-3 timers. Master the basics of naming, starting, and completing.</p>
                  <p className="text-sm mb-3"><strong>Week 2:</strong> Increase to 4-5 timers. Practice the cascade start method and time clustering.</p>
                  <p className="text-sm mb-3"><strong>Week 3:</strong> Experiment with 6-7 timers. Focus on quick visual scanning and anticipating completions.</p>
                  <p className="text-sm"><strong>Week 4:</strong> Master complex workflows. You should feel comfortable managing multiple parallel processes without stress.</p>
                </div>

                <div className="bg-gradient-to-r from-orange-100 via-red-100 to-pink-100 dark:from-orange-900/30 dark:via-red-900/30 dark:to-pink-900/30 p-8 rounded-2xl my-8 text-center border-4 border-orange-300 dark:border-orange-700">
                  <h3 className="text-2xl font-bold mb-4">🎯 Ready to Master Parallel Productivity?</h3>
                  <p className="text-base mb-6">
                    Multi-timers transform overwhelming complexity into elegant coordination. Whether you're cooking a feast, managing a project, or juggling family life, the ability to track multiple time streams simultaneously is a genuine superpower. Start simple, name clearly, and watch as parallel processes that once caused chaos become a beautifully orchestrated symphony of productivity.
                  </p>
                  <p className="text-lg font-bold italic">The chaos is waiting to become coordination. Add your first timer now! ⏱️🎯✨</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="backdrop-blur-xl bg-card/50 border-2 sticky top-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Use Cases</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Cook multiple dishes</li>
                <li>• Track parallel tasks</li>
                <li>• Manage team activities</li>
                <li>• Time multiple workouts</li>
              </ul>
            </CardContent>
          </Card>
          <AutoAdSlot placement="sidebar" />
        </div>
      </div>
    </SmartTimerLayout>
  );
}
