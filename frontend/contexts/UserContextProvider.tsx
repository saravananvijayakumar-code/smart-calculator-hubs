import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

interface UserProfile {
  age?: number;
  income?: number;
  location?: string;
  riskTolerance?: 'low' | 'medium' | 'high';
  financialGoals?: string[];
  calculationHistory?: CalculationHistoryItem[];
}

interface CalculationHistoryItem {
  calculatorType: string;
  timestamp: number;
  results: any;
  userInputs: any;
  expiresAt: number;
}

interface UserContextType {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addCalculationToHistory: (item: Omit<CalculationHistoryItem, 'timestamp' | 'expiresAt'>) => void;
  getRecentCalculations: (calculatorType?: string, limit?: number) => CalculationHistoryItem[];
  clearHistory: () => void;
  getPersonalizedRecommendations: (currentCalculation: any) => string[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'smart-calculator-user-profile';
const HISTORY_KEY = 'smart-calculator-history';

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let timeout: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistoryItem[]>([]);

  const debouncedSaveProfile = useMemo(
    () => debounce((data: UserProfile) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving user profile to localStorage:', error);
      }
    }, 500),
    []
  );

  const debouncedSaveHistory = useMemo(
    () => debounce((data: CalculationHistoryItem[]) => {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving calculation history to localStorage:', error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        const now = Date.now();
        const validHistory = parsedHistory.filter((item: any) => 
          item.expiresAt > now
        );
        setCalculationHistory(validHistory);
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    debouncedSaveProfile(userProfile);
  }, [userProfile, debouncedSaveProfile]);

  useEffect(() => {
    debouncedSaveHistory(calculationHistory);
  }, [calculationHistory, debouncedSaveHistory]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const addCalculationToHistory = (item: Omit<CalculationHistoryItem, 'timestamp' | 'expiresAt'>) => {
    const now = Date.now();
    const newItem: CalculationHistoryItem = {
      ...item,
      timestamp: now,
      expiresAt: now + 30 * 24 * 60 * 60 * 1000
    };
    
    setCalculationHistory(prev => {
      const updated = [newItem, ...prev]
        .filter(i => i.expiresAt > now)
        .slice(0, 50);
      return updated;
    });
  };

  const getRecentCalculations = (calculatorType?: string, limit: number = 10): CalculationHistoryItem[] => {
    const now = Date.now();
    let filtered = calculationHistory.filter(item => item.expiresAt > now);
    
    if (calculatorType) {
      filtered = filtered.filter(item => item.calculatorType === calculatorType);
    }
    
    return filtered
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  };

  const clearHistory = () => {
    setCalculationHistory([]);
  };

  const getPersonalizedRecommendations = (currentCalculation: any): string[] => {
    const recommendations: string[] = [];
    const recentCalculations = getRecentCalculations(undefined, 20);
    
    // Age-based recommendations
    if (userProfile.age) {
      if (userProfile.age < 30) {
        recommendations.push("At your age, focus on building emergency fund and starting retirement savings early");
        recommendations.push("Consider aggressive growth investments with your long time horizon");
      } else if (userProfile.age < 50) {
        recommendations.push("Prime earning years - maximize retirement contributions and diversify investments");
        recommendations.push("Consider tax-advantaged accounts and estate planning");
      } else if (userProfile.age < 65) {
        recommendations.push("Pre-retirement phase - gradually shift to more conservative investments");
        recommendations.push("Consider catch-up contributions and health savings planning");
      } else {
        recommendations.push("Focus on income preservation and healthcare planning in retirement");
        recommendations.push("Consider tax-efficient withdrawal strategies");
      }
    }

    // Income-based recommendations
    if (userProfile.income) {
      if (userProfile.income > 100000) {
        recommendations.push("High income earners should maximize tax-advantaged accounts");
        recommendations.push("Consider tax planning strategies and professional financial advice");
      } else if (userProfile.income < 50000) {
        recommendations.push("Focus on building emergency fund before investing");
        recommendations.push("Look for employer 401(k) matching - it's free money");
      }
    }

    // Calculation pattern analysis
    const calculatorTypes = recentCalculations.map(calc => calc.calculatorType);
    const uniqueTypes = [...new Set(calculatorTypes)];
    
    if (uniqueTypes.length > 5) {
      recommendations.push("You're exploring many financial tools - consider creating a comprehensive financial plan");
    }

    // Debt-related patterns
    const debtCalculations = recentCalculations.filter(calc => 
      calc.calculatorType.includes('loan') || 
      calc.calculatorType.includes('credit-card') ||
      calc.calculatorType.includes('debt')
    );
    
    if (debtCalculations.length > 2) {
      recommendations.push("Consider debt consolidation or prioritizing high-interest debt payoff");
      recommendations.push("Focus on debt reduction before aggressive investing");
    }

    // Investment patterns
    const investmentCalculations = recentCalculations.filter(calc =>
      calc.calculatorType.includes('investment') ||
      calc.calculatorType.includes('retirement') ||
      calc.calculatorType.includes('compound-interest')
    );
    
    if (investmentCalculations.length > 2) {
      recommendations.push("Great focus on investing! Consider diversification across different asset classes");
    }

    // International calculations
    const internationalCalculations = recentCalculations.filter(calc =>
      calc.calculatorType.includes('uk') ||
      calc.calculatorType.includes('india') ||
      calc.calculatorType.includes('australia')
    );
    
    if (internationalCalculations.length > 1) {
      recommendations.push("International financial planning - consider currency risk and tax implications");
    }

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  };

  const value: UserContextType = {
    userProfile,
    updateProfile,
    addCalculationToHistory,
    getRecentCalculations,
    clearHistory,
    getPersonalizedRecommendations
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};