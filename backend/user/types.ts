export interface User {
  id: number;
  clerkUserId: string;
  email?: string;
  imageUrl?: string;
  isAdmin: boolean;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  locale?: string;
  defaultCurrency?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
}

export interface UpdatePreferencesRequest {
  preferences: UserPreferences;
}
