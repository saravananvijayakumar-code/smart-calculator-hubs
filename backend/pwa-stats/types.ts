export interface PWAStat {
  id: number;
  eventType: string;
  sessionId: string;
  userId?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface TrackPWAEventRequest {
  eventType: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

export interface PWAStats {
  totalInstalls: number;
  totalShares: number;
  totalOfflineAccess: number;
  recentEvents: PWAStat[];
}
