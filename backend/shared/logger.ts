export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  service?: string;
  operation?: string;
  metadata?: Record<string, any>;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string | number;
  };
}

class Logger {
  private minLevel: LogLevel = LogLevel.INFO;

  setLogLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error | any
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    if (error) {
      entry.error = {
        name: error.name || "Error",
        message: error.message || "Unknown error",
        stack: error.stack,
        code: error.code || error.statusCode,
      };
    }

    return entry;
  }

  private formatLogEntry(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp;
    const context = entry.context ? ` [${JSON.stringify(entry.context)}]` : "";
    const error = entry.error ? ` ERROR: ${JSON.stringify(entry.error)}` : "";
    
    return `${timestamp} [${levelName}]${context} ${entry.message}${error}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error | any): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, error);
    const formatted = this.formatLogEntry(entry);

    if (level >= LogLevel.ERROR) {
      console.error(formatted);
    } else if (level >= LogLevel.WARN) {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext, error?: Error | any): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string, context?: LogContext, error?: Error | any): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  // Convenience methods for common scenarios
  request(method: string, path: string, context?: Omit<LogContext, "operation">): void {
    this.info(`${method} ${path}`, {
      ...context,
      operation: "request",
    });
  }

  response(method: string, path: string, statusCode: number, duration: number, context?: Omit<LogContext, "operation">): void {
    this.info(`${method} ${path} ${statusCode} ${duration}ms`, {
      ...context,
      operation: "response",
      metadata: {
        statusCode,
        duration,
        ...context?.metadata,
      },
    });
  }

  database(operation: string, table: string, context?: Omit<LogContext, "operation">): void {
    this.debug(`DB ${operation} on ${table}`, {
      ...context,
      operation: "database",
      metadata: {
        table,
        ...context?.metadata,
      },
    });
  }

  externalService(service: string, operation: string, context?: Omit<LogContext, "operation">): void {
    this.info(`External service call: ${service}.${operation}`, {
      ...context,
      service,
      operation: "external_service",
    });
  }

  performance(operation: string, duration: number, context?: Omit<LogContext, "operation">): void {
    const level = duration > 1000 ? LogLevel.WARN : LogLevel.DEBUG;
    this.log(level, `Performance: ${operation} took ${duration}ms`, {
      ...context,
      operation: "performance",
      metadata: {
        duration,
        ...context?.metadata,
      },
    });
  }

  security(event: string, context?: Omit<LogContext, "operation">): void {
    this.warn(`Security event: ${event}`, {
      ...context,
      operation: "security",
    });
  }
}

export const logger = new Logger();

// Set log level based on environment
if (process.env.NODE_ENV === "development") {
  logger.setLogLevel(LogLevel.DEBUG);
} else if (process.env.NODE_ENV === "test") {
  logger.setLogLevel(LogLevel.WARN);
} else {
  logger.setLogLevel(LogLevel.INFO);
}

export default logger;