import { api } from "encore.dev/api";
import db from "../db";

export const root = api(
  { method: "GET", path: "/", expose: true },
  async (): Promise<{ status: string; timestamp: string }> => {
    return {
      status: "ok",
      timestamp: new Date().toISOString()
    };
  }
);

export const status = api(
  { method: "GET", path: "/status", expose: true },
  async (): Promise<{ status: string; timestamp: string }> => {
    return {
      status: "ok",
      timestamp: new Date().toISOString()
    };
  }
);

export const dbHealth = api(
  { method: "GET", path: "/health/db", expose: true, auth: false },
  async (): Promise<{ 
    status: string; 
    database: string;
    timestamp: string;
    connectionTest: boolean;
  }> => {
    let connectionTest = false;
    try {
      await db.queryRow`SELECT 1 as health_check`;
      connectionTest = true;
    } catch (error: any) {
      console.error("Database health check failed:", error?.message || error);
    }
    
    return {
      status: connectionTest ? "healthy" : "unhealthy",
      database: "db",
      timestamp: new Date().toISOString(),
      connectionTest
    };
  }
);