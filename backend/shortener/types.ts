export interface CreateShortURLRequest {
  url: string;
  customAlias?: string;
}

export interface CreateShortURLResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

export interface URLAnalytics {
  shortCode: string;
  originalUrl: string;
  totalClicks: number;
  recentClicks: ClickEvent[];
  createdAt: string;
}

export interface ClickEvent {
  clickedAt: string;
  country?: string;
  city?: string;
  referrer?: string;
}

export interface RedirectRequest {
  shortCode: string;
}

export interface RedirectResponse {
  url: string;
}
