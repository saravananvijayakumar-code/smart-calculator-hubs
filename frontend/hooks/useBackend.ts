import backend from "~backend/client";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export function useBackend() {
  return backend;
}

export function useAuthenticatedBackend() {
  const { username, password, isAuthenticated } = useAdminAuth();
  
  if (!isAuthenticated || !username || !password) {
    return backend;
  }
  
  const basicAuth = btoa(`${username}:${password}`);
  
  return backend.with({
    auth: {
      authorization: `Basic ${basicAuth}`
    }
  });
}