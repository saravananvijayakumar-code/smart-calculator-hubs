export interface PageView {
  id: number;
  pagePath: string;
  userAgent?: string;
  referrer?: string;
  sessionId: string;
  userId?: number;
  country?: string;
  city?: string;
  ipAddress?: string;
  createdAt: Date;
}

export interface TrackPageViewRequest {
  pagePath: string;
  userAgent?: string;
  referrer?: string;
  sessionId: string;
}

export interface PageViewStats {
  totalViews: number;
  todayViews: number;
  thisWeekViews: number;
  thisMonthViews: number;
  uniqueVisitors: number;
  viewsByPage: Record<string, number>;
  viewsByCountry: Record<string, number>;
}
