import { Link } from 'react-router-dom';
import { Timer, Clock, GitBranch, Calendar, Settings, Zap, Smartphone, Globe } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SmartTimerLayout } from '../../components/SmartTimerLayout';
import AutoAdSlot from '../../components/ads/AutoAdSlot';
import AmazonAffiliate from '../../components/ads/AmazonAffiliate';
import { useTimerStore } from '../../stores/timerStore';
import { useState } from 'react';

const timerTools = [
  {
    icon: Clock,
    title: 'Stopwatch',
    description: 'Precision timing with lap tracking and millisecond accuracy',
    path: '/smarttimer/stopwatch',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Clock,
    title: 'Countdown Timer',
    description: 'Visual countdown with preset durations and custom times',
    path: '/smarttimer/countdown',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Timer,
    title: 'Pomodoro',
    description: 'Boost productivity with work/break cycle management',
    path: '/smarttimer/pomodoro',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: GitBranch,
    title: 'Multi-Timer',
    description: 'Manage multiple countdown timers simultaneously',
    path: '/smarttimer/multi-timer',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Calendar,
    title: 'Event Countdown',
    description: 'Count down to important dates and milestones',
    path: '/smarttimer/event',
    color: 'from-indigo-500 to-violet-500'
  }
];

export default function SmartTimerHub() {
  const { branding, setBranding, resetBranding } = useTimerStore();
  const [logoUrl, setLogoUrl] = useState(branding.logo || '');
  const [companyName, setCompanyName] = useState(branding.companyName || '');
  const [themeColor, setThemeColor] = useState(branding.themeColor);
  const [showSettings, setShowSettings] = useState(false);

  const handleSaveBranding = () => {
    setBranding({
      logo: logoUrl,
      companyName,
      themeColor
    });
    setShowSettings(false);
  };

  const handleResetBranding = () => {
    resetBranding();
    setLogoUrl('');
    setCompanyName('');
    setThemeColor('#3b82f6');
  };

  return (
    <SmartTimerLayout
      title="Professional Timer Suite"
      description="Enterprise-grade timing tools for professionals. Stopwatch, countdown, Pomodoro, multi-timer, and event countdown - all in one powerful suite."
      keywords="timer suite, professional timers, stopwatch, countdown timer, pomodoro timer, productivity tools"
    >
      <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Enterprise Timer Suite
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Professional timing tools with custom branding, keyboard shortcuts, and offline support. 
            Perfect for presentations, workouts, productivity, and time management.
          </p>
          <Button
            size="lg"
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            className="mb-8"
          >
            <Settings className="w-5 h-5 mr-2" />
            {showSettings ? 'Hide' : 'Show'} Branding Settings
          </Button>
        </div>

        {showSettings && (
          <div>
            <Card className="backdrop-blur-xl bg-card/50 border-2 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Custom Branding</CardTitle>
                <CardDescription>Personalize SmartTimer with your company branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input
                    id="logo-url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="theme-color">Theme Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="theme-color"
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveBranding} className="flex-1" style={{ backgroundColor: themeColor }}>
                    Save Branding
                  </Button>
                  <Button onClick={handleResetBranding} variant="outline">
                    Reset to Default
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timerTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div key={tool.path}>
                <Link to={tool.path}>
                  <Card className="backdrop-blur-xl bg-card/50 border-2 hover:border-primary/50 transition-all hover:scale-105 h-full">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                      <p className="text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>

        <AutoAdSlot placement="mid-content" className="my-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Keyboard Shortcuts', desc: 'Control timers hands-free with Space, R, and F keys' },
            { icon: Smartphone, title: 'Works Offline', desc: 'Install as PWA for full offline functionality' },
            { icon: Globe, title: 'Universal Access', desc: 'Works on all devices - desktop, tablet, and mobile' }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
              >
                <Card className="backdrop-blur-xl bg-card/50 border-2 text-center">
                  <CardContent className="p-6">
                    <Icon className="w-12 h-12 mx-auto mb-3" style={{ color: branding.themeColor }} />
                    <h4 className="font-bold mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <Card className="backdrop-blur-xl bg-card/50 border-2">
          <CardContent className="p-8 prose prose-sm max-w-none">
            <h2 className="text-3xl font-bold mb-4">Professional Timer Suite for Every Need</h2>
            <p className="text-lg">
              SmartTimer brings together five essential timing tools in one beautiful, integrated suite. Whether you're 
              timing athletic performances, managing productivity cycles, or counting down to important events, SmartTimer 
              delivers the precision and features you need.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">Why Choose SmartTimer?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2">🎯 Professional Grade</h4>
                <p>Built for professionals who demand accuracy, reliability, and beautiful design. Enterprise features with consumer simplicity.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">⚡ Lightning Fast</h4>
                <p>Optimized performance with smooth animations and instant responsiveness. No lag, no delays, just precision timing.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">🎨 Custom Branding</h4>
                <p>Add your company logo and brand colors for presentations, client meetings, and professional demonstrations.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">📱 Works Everywhere</h4>
                <p>Responsive design works perfectly on phones, tablets, desktops, and 4K displays. Install as PWA for offline use.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">Our Timer Tools</h3>
            
            <h4 className="text-xl font-bold mt-6 mb-2">Stopwatch</h4>
            <p>
              High-precision stopwatch with millisecond accuracy and unlimited lap tracking. Perfect for sports timing, 
              project tracking, and any situation requiring precise time measurement.
            </p>

            <h4 className="text-xl font-bold mt-6 mb-2">Countdown Timer</h4>
            <p>
              Visual countdown with circular progress indicator. Quick presets (1-120 minutes) or custom durations. 
              Audio alerts and beautiful animations keep you informed.
            </p>

            <h4 className="text-xl font-bold mt-6 mb-2">Pomodoro Timer</h4>
            <p>
              Implement the proven Pomodoro Technique with customizable work/break cycles. Track completed cycles and 
              boost productivity with focused time blocks.
            </p>

            <h4 className="text-xl font-bold mt-6 mb-2">Multi-Timer</h4>
            <p>
              Run multiple countdown timers simultaneously. Perfect for cooking multiple dishes, managing parallel tasks, 
              or coordinating team activities.
            </p>

            <h4 className="text-xl font-bold mt-6 mb-2">Event Countdown</h4>
            <p>
              Count down to important dates with day-hour-minute-second precision. Perfect for product launches, weddings, 
              deadlines, and special occasions.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">Keyboard Shortcuts</h3>
            <p>All SmartTimer tools support these universal keyboard shortcuts:</p>
            <ul>
              <li><strong>Space:</strong> Start/Pause timer</li>
              <li><strong>R:</strong> Reset timer</li>
              <li><strong>F:</strong> Toggle fullscreen mode</li>
              <li><strong>Escape:</strong> Exit fullscreen</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8 mb-4">Perfect For</h3>
            <ul>
              <li><strong>Business Professionals:</strong> Meetings, presentations, time-blocking, project sprints</li>
              <li><strong>Athletes & Coaches:</strong> Training intervals, race timing, workout sessions</li>
              <li><strong>Educators:</strong> Classroom activities, exam timing, student exercises</li>
              <li><strong>Developers:</strong> Pomodoro sessions, sprint planning, stand-up meetings</li>
              <li><strong>Creators:</strong> Content creation sessions, editing blocks, project deadlines</li>
              <li><strong>Home Users:</strong> Cooking, workouts, study sessions, meditation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </SmartTimerLayout>
  );
}
