import { SQLDatabase } from "encore.dev/storage/sqldb";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export async function withRetry<T>(
  fn: () => Promise<T>,
  operationName: string = "Database operation"
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔌 ${operationName} (attempt ${attempt}/${MAX_RETRIES})...`);
      const result = await fn();
      console.log(`✅ ${operationName} succeeded`);
      return result;
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || String(error);
      console.warn(`⚠️ ${operationName} failed (attempt ${attempt}): ${errorMsg}`);
      
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * attempt;
        console.log(`⏱️ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`❌ ${operationName} failed after ${MAX_RETRIES} attempts`);
  throw lastError || new Error(`${operationName} failed after all retries`);
}

export async function healthCheckQuery(db: SQLDatabase): Promise<boolean> {
  try {
    await withRetry(
      async () => db.query`SELECT 1 as health_check`,
      "Database health check"
    );
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

export interface ConnectionConfig {
  connectionTimeoutMillis?: number;
  idleTimeoutMillis?: number;
  max?: number;
}

export const DEFAULT_CONNECTION_CONFIG: ConnectionConfig = {
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
  max: 5,
};
