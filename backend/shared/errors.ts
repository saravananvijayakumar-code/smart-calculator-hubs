import { APIError } from "encore.dev/api";

export enum ErrorCode {
  // Client errors (4xx)
  VALIDATION_FAILED = "VALIDATION_FAILED",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  RATE_LIMITED = "RATE_LIMITED",
  
  // Server errors (5xx)
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
  TIMEOUT = "TIMEOUT",
}

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  field?: string;
  details?: Record<string, any>;
  timestamp?: string;
  requestId?: string;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;
  public readonly field?: string;
  public readonly timestamp: string;
  public readonly requestId?: string;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    field?: string,
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.field = field;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
    
    Error.captureStackTrace(this, AppError);
  }

  toErrorDetails(): ErrorDetails {
    return {
      code: this.code,
      message: this.message,
      field: this.field,
      details: this.details,
      timestamp: this.timestamp,
      requestId: this.requestId,
    };
  }

  toAPIError(): APIError {
    switch (this.statusCode) {
      case 400:
        return APIError.invalidArgument(this.message);
      case 401:
        return APIError.unauthenticated(this.message);
      case 403:
        return APIError.permissionDenied(this.message);
      case 404:
        return APIError.notFound(this.message);
      case 409:
        return APIError.alreadyExists(this.message);
      case 429:
        return APIError.resourceExhausted(this.message);
      case 500:
      default:
        return APIError.internal(this.message);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string, details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.VALIDATION_FAILED, message, 400, field, details, requestId);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required", details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.UNAUTHORIZED, message, 401, undefined, details, requestId);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden", details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.FORBIDDEN, message, 403, undefined, details, requestId);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.NOT_FOUND, message, 404, undefined, details, requestId);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.CONFLICT, message, 409, undefined, details, requestId);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded", details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.RATE_LIMITED, message, 429, undefined, details, requestId);
  }
}

export class InternalError extends AppError {
  constructor(message: string = "Internal server error", details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.INTERNAL_ERROR, message, 500, undefined, details, requestId);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed", details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.DATABASE_ERROR, message, 500, undefined, details, requestId);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string = "External service error", details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.EXTERNAL_SERVICE_ERROR, message, 500, undefined, details, requestId);
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = "Operation timeout", details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.TIMEOUT, message, 500, undefined, details, requestId);
  }
}

export function handleDatabaseError(error: any, requestId?: string): AppError {
  const details = {
    originalError: error.message,
    code: error.code,
    constraint: error.constraint,
  };

  switch (error.code) {
    case "23505": // unique_violation
      return new ConflictError("Resource already exists", details, requestId);
    case "23503": // foreign_key_violation
      return new ValidationError("Referenced resource does not exist", undefined, details, requestId);
    case "23502": // not_null_violation
      return new ValidationError("Required field is missing", error.column, details, requestId);
    case "23514": // check_violation
      return new ValidationError("Value constraint violation", undefined, details, requestId);
    case "42P01": // undefined_table
    case "42703": // undefined_column
      return new InternalError("Database schema error", details, requestId);
    default:
      return new DatabaseError("Database operation failed", details, requestId);
  }
}

export function handleExternalServiceError(error: any, serviceName: string, requestId?: string): AppError {
  const details = {
    service: serviceName,
    originalError: error.message,
    status: error.status || error.statusCode,
  };

  if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
    return new ExternalServiceError(`${serviceName} service unavailable`, details, requestId);
  }
  
  if (error.code === "ETIMEDOUT" || error.message?.includes("timeout")) {
    return new TimeoutError(`${serviceName} service timeout`, details, requestId);
  }
  
  const status = error.status || error.statusCode;
  if (status >= 400 && status < 500) {
    return new ValidationError(`${serviceName} request error`, undefined, details, requestId);
  }
  
  return new ExternalServiceError(`${serviceName} service error`, details, requestId);
}

export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

export function isAPIError(error: any): boolean {
  return error && typeof error.code === "number" && typeof error.message === "string";
}

export function formatErrorForLogging(error: any, context?: Record<string, any>): Record<string, any> {
  const baseLog = {
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (isAppError(error)) {
    return {
      ...baseLog,
      error: {
        type: "AppError",
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        field: error.field,
        details: error.details,
        requestId: error.requestId,
        stack: error.stack,
      },
    };
  }

  if (isAPIError(error)) {
    return {
      ...baseLog,
      error: {
        type: "APIError",
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
  }

  return {
    ...baseLog,
    error: {
      type: "UnknownError",
      message: error?.message || "Unknown error occurred",
      stack: error?.stack,
    },
  };
}