
import { getAuthData } from "~encore/auth";
import { AppError, isAppError, formatErrorForLogging, RateLimitError } from "./errors";
import logger from "./logger";
import crypto from "crypto";

export interface RequestContext {
  requestId: string;
  startTime: number;
  userId?: string;
  isAdmin?: boolean;
  userAgent?: string;
  ip?: string;
}

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export function createRequestContext(): RequestContext {
  const requestId = generateRequestId();
  const startTime = Date.now();
  
  try {
    const auth = getAuthData();
    return {
      requestId,
      startTime,
      userId: auth?.userID,
      isAdmin: auth?.isAdmin,
    };
  } catch {
    return {
      requestId,
      startTime,
    };
  }
}

export function logRequest(method: string, path: string, context: RequestContext): void {
  logger.request(method, path, {
    requestId: context.requestId,
    userId: context.userId,
    metadata: {
      isAdmin: context.isAdmin,
      userAgent: context.userAgent,
      ip: context.ip,
    },
  });
}

export function logResponse(
  method: string, 
  path: string, 
  statusCode: number, 
  context: RequestContext
): void {
  const duration = Date.now() - context.startTime;
  
  logger.response(method, path, statusCode, duration, {
    requestId: context.requestId,
    userId: context.userId,
  });

  if (duration > 2000) {
    logger.performance(`Slow API response`, duration, {
      requestId: context.requestId,
      metadata: { method, path },
    });
  }
}

export function logError(error: any, context: RequestContext, operation?: string): void {
  const logContext = {
    requestId: context.requestId,
    userId: context.userId,
    operation,
  };

  if (isAppError(error)) {
    if (error.statusCode >= 500) {
      logger.error(`Server error: ${error.message}`, logContext, error);
    } else {
      logger.warn(`Client error: ${error.message}`, logContext, error);
    }
  } else {
    logger.error(`Unhandled error: ${error?.message || "Unknown error"}`, logContext, error);
  }
}

export async function withErrorHandling<T>(
  operation: string,
  context: RequestContext,
  fn: () => Promise<T>
): Promise<T> {
  try {
    logger.debug(`Starting operation: ${operation}`, {
      requestId: context.requestId,
      userId: context.userId,
      operation,
    });

    const result = await fn();

    logger.debug(`Completed operation: ${operation}`, {
      requestId: context.requestId,
      userId: context.userId,
      operation,
    });

    return result;
  } catch (error) {
    logError(error, context, operation);
    
    if (isAppError(error)) {
      throw error.toAPIError();
    }
    
    throw error;
  }
}

export function withRequestLogging<T extends any[], R>(
  method: string,
  path: string,
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const context = createRequestContext();
    logRequest(method, path, context);
    
    try {
      const result = await handler(...args);
      logResponse(method, path, 200, context);
      return result;
    } catch (error) {
      logError(error, context);
      
      let statusCode = 500;
      if (isAppError(error)) {
        statusCode = error.statusCode;
      } else if (error && typeof error === "object" && "code" in error && typeof error.code === "number") {
        statusCode = error.code;
      }
      
      logResponse(method, path, statusCode, context);
      throw error;
    }
  };
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (userId?: string, ip?: string) => string;
}

class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();

  isAllowed(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const existing = this.requests.get(key);

    if (!existing || now > existing.resetTime) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return true;
    }

    if (existing.count >= config.maxRequests) {
      return false;
    }

    existing.count++;
    return true;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

setInterval(() => rateLimiter.cleanup(), 60000);

export function withRateLimit<T extends any[], R>(
  config: RateLimitConfig,
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const context = createRequestContext();
    const key = config.keyGenerator 
      ? config.keyGenerator(context.userId, context.ip)
      : context.userId || context.ip || "anonymous";

    if (!rateLimiter.isAllowed(key, config)) {
      logger.security("Rate limit exceeded", {
        requestId: context.requestId,
        userId: context.userId,
        metadata: { key, config },
      });
      
      const error = new RateLimitError(
        "Rate limit exceeded. Please try again later.",
        { retryAfter: Math.ceil(config.windowMs / 1000) },
        context.requestId
      );
      
      throw error.toAPIError();
    }

    return handler(...args);
  };
}