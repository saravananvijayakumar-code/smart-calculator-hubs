import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import backend from '~backend/client';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  authHeader: string | null;
  username: string | null;
  password: string | null;
  callAdminAPI: <T>(url: string, options?: RequestInit) => Promise<T>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

const getAPIBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname.includes('.lp.dev')) {
      const proto = window.location.protocol;
      const host = hostname.replace('.lp.dev', '.api.lp.dev');
      return `${proto}//${host}`;
    }
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:4000';
    }
  }
  
  return 'https://smart-calculator-hub-d3409cs82vjl9890lfm0.api.lp.dev';
};

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authHeader, setAuthHeader] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    console.log('[AdminAuth] Loading auth from localStorage');
    const storedAuth = localStorage.getItem('admin_auth');
    const storedUser = localStorage.getItem('admin_user');
    const storedPass = localStorage.getItem('admin_pass');
    
    console.log('[AdminAuth] Found stored credentials:', { user: storedUser, hasPass: !!storedPass });
    
    if (storedAuth && storedUser && storedPass) {
      setAuthHeader(storedAuth);
      setUsername(storedUser);
      setPassword(storedPass);
      setIsAuthenticated(true);
      console.log('[AdminAuth] Auth loaded from storage');
    } else {
      console.log('[AdminAuth] No stored credentials found');
    }
    setIsLoading(false);
    console.log('[AdminAuth] Auth initialization complete');
  }, []);

  const callAdminAPI = async <T,>(url: string, options: RequestInit = {}): Promise<T> => {
    console.log('[AdminAPI] callAdminAPI called with:', { url, username, password: password ? '***' : null, isAuthenticated });
    
    if (!username || !password) {
      console.error('[AdminAPI] Missing credentials');
      throw new Error('Missing admin credentials. Please log in.');
    }

    const API_BASE = getAPIBase();
    const method = options.method || 'POST';
    const apiUrl = `${API_BASE}${url}`;
    
    console.log('[AdminAPI] Fetching:', apiUrl, 'method:', method);
    
    const basicAuth = btoa(`${username}:${password}`);
    
    const finalOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`,
      },
      credentials: 'include',
      mode: 'cors',
    };

    if (method === 'POST' && options.body) {
      const body = JSON.parse(options.body as string);
      finalOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(apiUrl, finalOptions);
      console.log('[AdminAPI] Response status:', response.status);
      console.log('[AdminAPI] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let error: string;
        try {
          const errorData = await response.json();
          console.error('[AdminAPI] Error response JSON:', errorData);
          error = errorData.message || errorData.error || errorData.code || JSON.stringify(errorData);
        } catch {
          error = await response.text();
          console.error('[AdminAPI] Error response text:', error);
        }
        console.error('[AdminAPI] API error:', error, 'status:', response.status);
        throw new Error(error || `HTTP error ${response.status}`);
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      const text = await response.text();
      console.log('[AdminAPI] Response text:', text?.substring(0, 200));
      if (!text) return {} as T;
      
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error('[AdminAPI] Failed to parse response:', text);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('[AdminAPI] Fetch error:', error);
      console.error('[AdminAPI] Error details:', {
        url: apiUrl,
        method,
        hasAuth: !!basicAuth,
        errorType: error instanceof TypeError ? 'Network/CORS' : 'Other'
      });
      throw error;
    }
  };

  const login = async (user: string, pass: string): Promise<boolean> => {
    try {
      const result = await backend.auth.login({ username: user, password: pass });
      
      if (!result.success) {
        return false;
      }
      
      const basicAuth = btoa(`${user}:${pass}`);
      const authHeaderValue = `Basic ${basicAuth}`;
      
      setAuthHeader(authHeaderValue);
      setUsername(user);
      setPassword(pass);
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', authHeaderValue);
      localStorage.setItem('admin_user', user);
      localStorage.setItem('admin_pass', pass);
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = () => {
    setAuthHeader(null);
    setUsername(null);
    setPassword(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_pass');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, authHeader, username, password, callAdminAPI }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
