import { ValidationError } from "./errors";

export interface ValidationRule<T = any> {
  validate: (value: T, context?: Record<string, any>) => boolean | Promise<boolean>;
  message: string;
  field?: string;
}

export interface ValidationSchema<T = any> {
  [key: string]: ValidationRule<any>[];
}

export class Validator {
  static required(message: string = "This field is required"): ValidationRule {
    return {
      validate: (value: any) => value !== null && value !== undefined && value !== "",
      message,
    };
  }

  static string(options: { 
    min?: number; 
    max?: number; 
    pattern?: RegExp; 
    message?: string;
    allowEmpty?: boolean;
  } = {}): ValidationRule<string> {
    return {
      validate: (value: string) => {
        // Allow undefined/null for optional fields
        if (value === null || value === undefined) return options.allowEmpty !== false;
        if (typeof value !== "string") return false;
        if (options.min !== undefined && value.length < options.min) return false;
        if (options.max !== undefined && value.length > options.max) return false;
        if (options.pattern && !options.pattern.test(value)) return false;
        return true;
      },
      message: options.message || `Invalid string value`,
    };
  }

  static email(message: string = "Invalid email address"): ValidationRule<string> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      validate: (value: string) => typeof value === "string" && emailRegex.test(value),
      message,
    };
  }

  static number(options: { 
    min?: number; 
    max?: number; 
    integer?: boolean; 
    message?: string 
  } = {}): ValidationRule<number> {
    return {
      validate: (value: number) => {
        if (typeof value !== "number" || isNaN(value)) return false;
        if (options.integer && !Number.isInteger(value)) return false;
        if (options.min !== undefined && value < options.min) return false;
        if (options.max !== undefined && value > options.max) return false;
        return true;
      },
      message: options.message || "Invalid number value",
    };
  }

  static positive(message: string = "Must be a positive number"): ValidationRule<number> {
    return {
      validate: (value: number) => typeof value === "number" && value > 0,
      message,
    };
  }

  static array(options: { 
    min?: number; 
    max?: number; 
    message?: string 
  } = {}): ValidationRule<any[]> {
    return {
      validate: (value: any[]) => {
        if (!Array.isArray(value)) return false;
        if (options.min !== undefined && value.length < options.min) return false;
        if (options.max !== undefined && value.length > options.max) return false;
        return true;
      },
      message: options.message || "Invalid array value",
    };
  }

  static oneOf<T>(values: T[], message?: string): ValidationRule<T> {
    return {
      validate: (value: T) => values.includes(value),
      message: message || `Value must be one of: ${values.join(", ")}`,
    };
  }

  static date(message: string = "Invalid date"): ValidationRule<Date | string> {
    return {
      validate: (value: Date | string) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      message,
    };
  }

  static slug(message: string = "Invalid slug format"): ValidationRule<string> {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return {
      validate: (value: string) => typeof value === "string" && slugRegex.test(value),
      message,
    };
  }

  static url(message: string = "Invalid URL"): ValidationRule<string> {
    return {
      validate: (value: string) => {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      message,
    };
  }

  static boolean(message: string = "Invalid boolean value"): ValidationRule<boolean> {
    return {
      validate: (value: any) => typeof value === "boolean",
      message,
    };
  }

  static custom<T>(
    validateFn: (value: T, context?: Record<string, any>) => boolean | Promise<boolean>,
    message: string
  ): ValidationRule<T> {
    return {
      validate: validateFn,
      message,
    };
  }
}

export async function validateData<T extends Record<string, any>>(
  data: T,
  schema: ValidationSchema<T>,
  requestId?: string
): Promise<void> {
  const errors: Array<{ field: string; message: string }> = [];

  for (const [fieldName, rules] of Object.entries(schema)) {
    const value = data[fieldName];
    
    // Skip validation for optional fields that are undefined or null
    if ((value === undefined || value === null) && rules.length === 0) {
      continue;
    }
    
    for (const rule of rules) {
      try {
        const isValid = await rule.validate(value, data);
        if (!isValid) {
          errors.push({
            field: rule.field || fieldName,
            message: rule.message,
          });
        }
      } catch (error) {
        errors.push({
          field: rule.field || fieldName,
          message: `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    }
  }

  if (errors.length > 0) {
    const mainError = errors[0];
    throw new ValidationError(
      `Validation failed: ${mainError.message}`,
      mainError.field,
      { validationErrors: errors },
      requestId
    );
  }
}

export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, "") // Remove script tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ""); // Remove event handlers
}

export function sanitizeRichContent(input: string): string {
  if (typeof input !== "string") return "";
  
  // Allow most HTML formatting but remove dangerous elements
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, "") // Remove script tags
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, "") // Remove iframe tags
    .replace(/<object[^>]*>.*?<\/object>/gi, "") // Remove object tags
    .replace(/<embed[^>]*>.*?<\/embed>/gi, "") // Remove embed tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .replace(/data:/gi, "") // Remove data URLs for security
    .replace(/vbscript:/gi, ""); // Remove vbscript protocol
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;
  
  const sanitized = { ...obj } as any;
  
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === "string") {
      // Only sanitize if it's actually a string and not empty
      sanitized[key] = value ? sanitizeInput(value) : value;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === "string" && item ? sanitizeInput(item) : item
      );
    } else if (value && typeof value === "object") {
      sanitized[key] = sanitizeObject(value);
    }
  }
  
  return sanitized;
}