import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface TimerBranding {
  logo?: string;
  themeColor: string;
  companyName?: string;
}

export interface LapTime {
  id: string;
  time: number;
  timestamp: number;
}

export interface MultiTimer {
  id: string;
  name: string;
  duration: number;
  elapsed: number;
  isRunning: boolean;
}

interface TimerStoreState {
  branding: TimerBranding;
  setBranding: (branding: Partial<TimerBranding>) => void;
  resetBranding: () => void;
  
  stopwatchTime: number;
  stopwatchRunning: boolean;
  stopwatchLaps: LapTime[];
  startStopwatch: () => void;
  pauseStopwatch: () => void;
  resetStopwatch: () => void;
  addLap: () => void;
  
  countdownDuration: number;
  countdownRemaining: number;
  countdownRunning: boolean;
  setCountdownDuration: (duration: number) => void;
  startCountdown: () => void;
  pauseCountdown: () => void;
  resetCountdown: () => void;
  
  pomodoroWorkDuration: number;
  pomodoroBreakDuration: number;
  pomodoroRemaining: number;
  pomodoroRunning: boolean;
  pomodoroMode: 'work' | 'break';
  pomodoroCycles: number;
  setPomodoroWorkDuration: (duration: number) => void;
  setPomodoroBreakDuration: (duration: number) => void;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  switchPomodoroMode: () => void;
  
  multiTimers: MultiTimer[];
  addMultiTimer: (name: string, duration: number) => void;
  removeMultiTimer: (id: string) => void;
  startMultiTimer: (id: string) => void;
  pauseMultiTimer: (id: string) => void;
  resetMultiTimer: (id: string) => void;
  
  eventDate: Date | null;
  eventName: string;
  setEventDate: (date: Date) => void;
  setEventName: (name: string) => void;
  clearEvent: () => void;
}

const DEFAULT_BRANDING: TimerBranding = {
  themeColor: '#3b82f6',
};

export const useTimerStore = create<TimerStoreState>()(
  persist(
    (set, get) => ({
      branding: DEFAULT_BRANDING,
      setBranding: (branding) => set((state) => ({
        branding: { ...state.branding, ...branding }
      })),
      resetBranding: () => set({ branding: DEFAULT_BRANDING }),
      
      stopwatchTime: 0,
      stopwatchRunning: false,
      stopwatchLaps: [],
      startStopwatch: () => set({ stopwatchRunning: true }),
      pauseStopwatch: () => set({ stopwatchRunning: false }),
      resetStopwatch: () => set({
        stopwatchTime: 0,
        stopwatchRunning: false,
        stopwatchLaps: []
      }),
      addLap: () => {
        const { stopwatchTime, stopwatchLaps } = get();
        const lap: LapTime = {
          id: `lap_${Date.now()}`,
          time: stopwatchTime,
          timestamp: Date.now()
        };
        set({ stopwatchLaps: [...stopwatchLaps, lap] });
      },
      
      countdownDuration: 300000,
      countdownRemaining: 300000,
      countdownRunning: false,
      setCountdownDuration: (duration) => set({
        countdownDuration: duration,
        countdownRemaining: duration
      }),
      startCountdown: () => set({ countdownRunning: true }),
      pauseCountdown: () => set({ countdownRunning: false }),
      resetCountdown: () => set((state) => ({
        countdownRemaining: state.countdownDuration,
        countdownRunning: false
      })),
      
      pomodoroWorkDuration: 25 * 60 * 1000,
      pomodoroBreakDuration: 5 * 60 * 1000,
      pomodoroRemaining: 25 * 60 * 1000,
      pomodoroRunning: false,
      pomodoroMode: 'work',
      pomodoroCycles: 0,
      setPomodoroWorkDuration: (duration) => set({
        pomodoroWorkDuration: duration,
        pomodoroRemaining: duration
      }),
      setPomodoroBreakDuration: (duration) => set({
        pomodoroBreakDuration: duration
      }),
      startPomodoro: () => set({ pomodoroRunning: true }),
      pausePomodoro: () => set({ pomodoroRunning: false }),
      resetPomodoro: () => set((state) => ({
        pomodoroRemaining: state.pomodoroWorkDuration,
        pomodoroRunning: false,
        pomodoroMode: 'work',
        pomodoroCycles: 0
      })),
      switchPomodoroMode: () => set((state) => {
        const newMode = state.pomodoroMode === 'work' ? 'break' : 'work';
        const newRemaining = newMode === 'work' 
          ? state.pomodoroWorkDuration 
          : state.pomodoroBreakDuration;
        const newCycles = newMode === 'work' ? state.pomodoroCycles + 1 : state.pomodoroCycles;
        
        return {
          pomodoroMode: newMode,
          pomodoroRemaining: newRemaining,
          pomodoroCycles: newCycles
        };
      }),
      
      multiTimers: [],
      addMultiTimer: (name, duration) => {
        const timer: MultiTimer = {
          id: `timer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name,
          duration,
          elapsed: 0,
          isRunning: false
        };
        set((state) => ({
          multiTimers: [...state.multiTimers, timer]
        }));
      },
      removeMultiTimer: (id) => set((state) => ({
        multiTimers: state.multiTimers.filter(t => t.id !== id)
      })),
      startMultiTimer: (id) => set((state) => ({
        multiTimers: state.multiTimers.map(t =>
          t.id === id ? { ...t, isRunning: true } : t
        )
      })),
      pauseMultiTimer: (id) => set((state) => ({
        multiTimers: state.multiTimers.map(t =>
          t.id === id ? { ...t, isRunning: false } : t
        )
      })),
      resetMultiTimer: (id) => set((state) => ({
        multiTimers: state.multiTimers.map(t =>
          t.id === id ? { ...t, elapsed: 0, isRunning: false } : t
        )
      })),
      
      eventDate: null,
      eventName: '',
      setEventDate: (date) => set({ eventDate: date }),
      setEventName: (name) => set({ eventName: name }),
      clearEvent: () => set({ eventDate: null, eventName: '' })
    }),
    {
      name: 'smarttimer-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        branding: state.branding,
        countdownDuration: state.countdownDuration,
        pomodoroWorkDuration: state.pomodoroWorkDuration,
        pomodoroBreakDuration: state.pomodoroBreakDuration,
        eventDate: state.eventDate,
        eventName: state.eventName
      })
    }
  )
);
