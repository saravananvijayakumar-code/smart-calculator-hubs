import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Timer, Clock, GitBranch, Calendar } from 'lucide-react';
import { useTimerStore } from '../stores/timerStore';
import { SEOHead } from './SEOHead';
import { StructuredData } from './StructuredData';

interface SmartTimerLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  keywords?: string;
}

const timerNavItems = [
  { path: '/smarttimer', label: 'Home', icon: Timer },
  { path: '/smarttimer/stopwatch', label: 'Stopwatch', icon: Clock },
  { path: '/smarttimer/countdown', label: 'Countdown', icon: Timer },
  { path: '/smarttimer/pomodoro', label: 'Pomodoro', icon: Timer },
  { path: '/smarttimer/multi-timer', label: 'Multi-Timer', icon: GitBranch },
  { path: '/smarttimer/event', label: 'Event', icon: Calendar },
];

export function SmartTimerLayout({ children, title, description, keywords }: SmartTimerLayoutProps) {
  const location = useLocation();
  const { branding } = useTimerStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <SEOHead
        title={`${title} | SmartTimer`}
        description={description}
        keywords={keywords || 'timer, stopwatch, countdown, pomodoro, productivity'}
      />
      <StructuredData
        type="WebApplication"
        name={`SmartTimer - ${title}`}
        description={description}
        url={window.location.href}
        applicationCategory="Productivity"
        operatingSystem="Any"
      />

      <div className="relative">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"
          style={{ backgroundColor: `${branding.themeColor}05` }}
        />
        
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex flex-col items-center mb-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                {branding.logo && (
                  <img 
                    src={branding.logo} 
                    alt={branding.companyName || 'SmartTimer'} 
                    className="h-12 w-auto object-contain"
                  />
                )}
                <h1 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(to right, ${branding.themeColor}, ${branding.themeColor}99)` 
                  }}
                >
                  {branding.companyName || 'SmartTimer'}
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Enterprise-grade timing tools for professionals
              </p>
            </div>

            <nav className="w-full max-w-4xl">
              <div className="flex flex-wrap justify-center gap-2">
                {timerNavItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <div
                      key={item.path}
                      className="animate-in fade-in-50 slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Link
                        to={item.path}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                          transition-all duration-300
                          ${isActive 
                            ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                            : 'bg-card hover:bg-accent text-muted-foreground hover:text-foreground'
                          }
                        `}
                        style={isActive ? { backgroundColor: branding.themeColor } : {}}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </nav>
          </div>

          <div
            className="max-w-6xl mx-auto animate-in fade-in-50 zoom-in-95 duration-500"
            style={{ animationDelay: '200ms' }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
