export interface TrackInstallRequest {
  userId?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  platform?: string;
}

export interface TrackInstallResponse {
  success: boolean;
  message: string;
}

export interface PWAInstallRecord {
  id: number;
  user_id: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  platform: string | null;
  installed_at: Date;
}

export interface PWAInstallStats {
  date: string;
  installs: number;
}

export interface GetStatsResponse {
  totalInstalls: number;
  last7Days: PWAInstallStats[];
  last30Days: PWAInstallStats[];
  byPlatform: { platform: string; count: number }[];
  byCountry: { country: string; count: number }[];
  recentInstalls: PWAInstallRecord[];
}
