export interface METActivity {
  name: string;
  met: number;
  emoji: string;
  intensity: 'Low' | 'Medium' | 'High';
}

export const MET_ACTIVITIES: METActivity[] = [
  { name: 'Running (8 mph)', met: 9.8, emoji: '🏃', intensity: 'High' },
  { name: 'Walking (Brisk)', met: 3.8, emoji: '🚶‍♂️', intensity: 'Low' },
  { name: 'Cycling (Moderate)', met: 7.5, emoji: '🚴', intensity: 'Medium' },
  { name: 'Swimming', met: 6.0, emoji: '🏊', intensity: 'Medium' },
  { name: 'Yoga', met: 3.0, emoji: '🧘', intensity: 'Low' },
  { name: 'Jump Rope', met: 11.0, emoji: '🪢', intensity: 'High' },
  { name: 'Dancing', met: 6.0, emoji: '💃', intensity: 'Medium' },
  { name: 'Weight Lifting', met: 5.0, emoji: '🏋️', intensity: 'Medium' },
  { name: 'Basketball', met: 8.0, emoji: '🏀', intensity: 'High' },
  { name: 'Soccer', met: 9.0, emoji: '⚽', intensity: 'High' },
  { name: 'Tennis', met: 7.0, emoji: '🎾', intensity: 'Medium' },
  { name: 'Walking (Slow)', met: 2.5, emoji: '🚶', intensity: 'Low' },
];

export interface BurnTimeResult {
  activity: METActivity;
  minutes: number;
  hours: number;
}

export function calculateBurnTime(
  calories: number,
  weightLbs: number,
  activity?: METActivity
): BurnTimeResult | BurnTimeResult[] {
  const weightKg = weightLbs / 2.2;

  const calculateForActivity = (act: METActivity): BurnTimeResult => {
    const minutes = Math.ceil(calories / (act.met * 3.5 * weightKg / 200));
    const hours = parseFloat((minutes / 60).toFixed(1));
    
    return {
      activity: act,
      minutes,
      hours,
    };
  };

  if (activity) {
    return calculateForActivity(activity);
  }

  return MET_ACTIVITIES.map(calculateForActivity);
}

export function getBurnTimeForAllActivities(
  calories: number,
  weightLbs: number
): BurnTimeResult[] {
  return MET_ACTIVITIES.map((activity) => {
    const weightKg = weightLbs / 2.2;
    const minutes = Math.ceil(calories / (activity.met * 3.5 * weightKg / 200));
    const hours = parseFloat((minutes / 60).toFixed(1));
    
    return {
      activity,
      minutes,
      hours,
    };
  });
}
