import { describe, expect, test, vi } from "vitest";
import { 
  AppError, 
  ValidationError, 
  UnauthorizedError, 
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalError,
  DatabaseError,
  ExternalServiceError,
  TimeoutError,
  ErrorCode,
  handleDatabaseError,
  handleExternalServiceError,
  isAppError,
  isAPIError,
  formatErrorForLogging
} from "./errors";

import {
  Validator,
  validateData,
  sanitizeInput,
  sanitizeRichContent,
  sanitizeObject
} from "./validation";

// Mock logger
vi.mock("./logger", () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    security: vi.fn(),
    database: vi.fn()
  }
}));

describe("Shared Utilities", () => {
  describe("Error Handling", () => {
    describe("AppError Base Class", () => {
      test("should create AppError with all properties", () => {
        const error = new AppError(
          ErrorCode.VALIDATION_FAILED,
          "Test error",
          400,
          "testField",
          { extra: "data" },
          "req_123"
        );

        expect(error.code).toBe(ErrorCode.VALIDATION_FAILED);
        expect(error.message).toBe("Test error");
        expect(error.statusCode).toBe(400);
        expect(error.field).toBe("testField");
        expect(error.details).toEqual({ extra: "data" });
        expect(error.requestId).toBe("req_123");
        expect(error.timestamp).toBeTruthy();
        expect(error.name).toBe("AppError");
      });

      test("should convert to error details correctly", () => {
        const error = new AppError(ErrorCode.NOT_FOUND, "Not found", 404);
        const details = error.toErrorDetails();

        expect(details.code).toBe(ErrorCode.NOT_FOUND);
        expect(details.message).toBe("Not found");
        expect(details.timestamp).toBeTruthy();
      });

      test("should convert to appropriate API errors", () => {
        const errors = [
          { error: new AppError(ErrorCode.VALIDATION_FAILED, "Invalid", 400), expectsInvalidArgument: true },
          { error: new AppError(ErrorCode.UNAUTHORIZED, "Unauth", 401), expectsUnauthenticated: true },
          { error: new AppError(ErrorCode.FORBIDDEN, "Forbidden", 403), expectsPermissionDenied: true },
          { error: new AppError(ErrorCode.NOT_FOUND, "Not found", 404), expectsNotFound: true },
          { error: new AppError(ErrorCode.CONFLICT, "Conflict", 409), expectsAlreadyExists: true },
          { error: new AppError(ErrorCode.RATE_LIMITED, "Rate limit", 429), expectsResourceExhausted: true },
          { error: new AppError(ErrorCode.INTERNAL_ERROR, "Internal", 500), expectsInternal: true }
        ];

        errors.forEach(({ error }) => {
          const apiError = error.toAPIError();
          expect(apiError).toBeDefined();
          expect(apiError.message).toBe(error.message);
        });
      });
    });

    describe("Specific Error Classes", () => {
      test("should create ValidationError correctly", () => {
        const error = new ValidationError("Invalid field", "email", { pattern: "email" }, "req_123");
        
        expect(error.code).toBe(ErrorCode.VALIDATION_FAILED);
        expect(error.statusCode).toBe(400);
        expect(error.field).toBe("email");
        expect(error.details).toEqual({ pattern: "email" });
        expect(error.requestId).toBe("req_123");
      });

      test("should create UnauthorizedError with defaults", () => {
        const error = new UnauthorizedError();
        
        expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Authentication required");
      });

      test("should create all error types correctly", () => {
        const errors = [
          new ForbiddenError(),
          new NotFoundError(), 
          new ConflictError("Duplicate"),
          new RateLimitError(),
          new InternalError(),
          new DatabaseError(),
          new ExternalServiceError(),
          new TimeoutError()
        ];

        errors.forEach(error => {
          expect(error).toBeInstanceOf(AppError);
          expect(error.code).toBeTruthy();
          expect(error.statusCode).toBeGreaterThanOrEqual(400);
        });
      });
    });

    describe("Database Error Handling", () => {
      test("should handle unique violation", () => {
        const dbError = { code: "23505", message: "duplicate key value" };
        const appError = handleDatabaseError(dbError, "req_123");
        
        expect(appError).toBeInstanceOf(ConflictError);
        expect(appError.requestId).toBe("req_123");
      });

      test("should handle foreign key violation", () => {
        const dbError = { code: "23503", message: "foreign key constraint" };
        const appError = handleDatabaseError(dbError);
        
        expect(appError).toBeInstanceOf(ValidationError);
      });

      test("should handle not null violation", () => {
        const dbError = { code: "23502", column: "email", message: "null value" };
        const appError = handleDatabaseError(dbError);
        
        expect(appError).toBeInstanceOf(ValidationError);
        expect(appError.field).toBe("email");
      });

      test("should handle unknown database errors", () => {
        const dbError = { code: "UNKNOWN", message: "unknown error" };
        const appError = handleDatabaseError(dbError);
        
        expect(appError).toBeInstanceOf(DatabaseError);
      });
    });

    describe("External Service Error Handling", () => {
      test("should handle connection refused", () => {
        const serviceError = { code: "ECONNREFUSED", message: "Connection refused" };
        const appError = handleExternalServiceError(serviceError, "PaymentAPI");
        
        expect(appError).toBeInstanceOf(ExternalServiceError);
        expect(appError.message).toContain("PaymentAPI");
      });

      test("should handle timeout errors", () => {
        const serviceError = { code: "ETIMEDOUT", message: "timeout" };
        const appError = handleExternalServiceError(serviceError, "EmailAPI");
        
        expect(appError).toBeInstanceOf(TimeoutError);
      });

      test("should handle 4xx client errors", () => {
        const serviceError = { statusCode: 400, message: "Bad request" };
        const appError = handleExternalServiceError(serviceError, "ThirdPartyAPI");
        
        expect(appError).toBeInstanceOf(ValidationError);
      });

      test("should handle general service errors", () => {
        const serviceError = { statusCode: 502, message: "Bad gateway" };
        const appError = handleExternalServiceError(serviceError, "ExternalAPI");
        
        expect(appError).toBeInstanceOf(ExternalServiceError);
      });
    });

    describe("Error Utilities", () => {
      test("should identify AppError correctly", () => {
        const appError = new ValidationError("Invalid");
        const regularError = new Error("Regular error");
        
        expect(isAppError(appError)).toBe(true);
        expect(isAppError(regularError)).toBe(false);
        expect(isAppError(null)).toBe(false);
      });

      test("should identify API errors", () => {
        const apiError = { code: 400, message: "Bad request" };
        const notApiError = { message: "Just a message" };
        
        expect(isAPIError(apiError)).toBe(true);
        expect(isAPIError(notApiError)).toBe(false);
      });

      test("should format AppError for logging", () => {
        const error = new ValidationError("Invalid email", "email", { pattern: "email" }, "req_123");
        const formatted = formatErrorForLogging(error, { userId: "user_456" });
        
        expect(formatted.userId).toBe("user_456");
        expect(formatted.error.type).toBe("AppError");
        expect(formatted.error.code).toBe(ErrorCode.VALIDATION_FAILED);
        expect(formatted.error.field).toBe("email");
        expect(formatted.timestamp).toBeTruthy();
      });

      test("should format unknown errors for logging", () => {
        const error = new Error("Unknown error");
        const formatted = formatErrorForLogging(error);
        
        expect(formatted.error.type).toBe("UnknownError");
        expect(formatted.error.message).toBe("Unknown error");
        expect(formatted.timestamp).toBeTruthy();
      });
    });
  });

  describe("Validation", () => {
    describe("Validator Rules", () => {
      test("should validate required fields", async () => {
        const rule = Validator.required();
        
        expect(await rule.validate("value")).toBe(true);
        expect(await rule.validate(0)).toBe(true);
        expect(await rule.validate(false)).toBe(true);
        expect(await rule.validate("")).toBe(false);
        expect(await rule.validate(null)).toBe(false);
        expect(await rule.validate(undefined)).toBe(false);
      });

      test("should validate strings", async () => {
        const rule = Validator.string({ min: 2, max: 10, pattern: /^[a-z]+$/ });
        
        expect(await rule.validate("hello")).toBe(true);
        expect(await rule.validate("hi")).toBe(true);
        expect(await rule.validate("h")).toBe(false); // Too short
        expect(await rule.validate("verylongstring")).toBe(false); // Too long
        expect(await rule.validate("Hello")).toBe(false); // Pattern mismatch
        expect(await rule.validate(123 as any)).toBe(false); // Not string
      });

      test("should validate email addresses", async () => {
        const rule = Validator.email();
        
        expect(await rule.validate("user@example.com")).toBe(true);
        expect(await rule.validate("test.email@domain.co.uk")).toBe(true);
        expect(await rule.validate("invalid-email")).toBe(false);
        expect(await rule.validate("@example.com")).toBe(false);
        expect(await rule.validate("user@")).toBe(false);
      });

      test("should validate numbers", async () => {
        const rule = Validator.number({ min: 0, max: 100, integer: true });
        
        expect(await rule.validate(50)).toBe(true);
        expect(await rule.validate(0)).toBe(true);
        expect(await rule.validate(100)).toBe(true);
        expect(await rule.validate(-1)).toBe(false); // Below min
        expect(await rule.validate(101)).toBe(false); // Above max
        expect(await rule.validate(50.5)).toBe(false); // Not integer
        expect(await rule.validate("50" as any)).toBe(false); // Not number
      });

      test("should validate positive numbers", async () => {
        const rule = Validator.positive();
        
        expect(await rule.validate(1)).toBe(true);
        expect(await rule.validate(0.1)).toBe(true);
        expect(await rule.validate(0)).toBe(false);
        expect(await rule.validate(-1)).toBe(false);
      });

      test("should validate arrays", async () => {
        const rule = Validator.array({ min: 1, max: 3 });
        
        expect(await rule.validate([1])).toBe(true);
        expect(await rule.validate([1, 2, 3])).toBe(true);
        expect(await rule.validate([])).toBe(false); // Too short
        expect(await rule.validate([1, 2, 3, 4])).toBe(false); // Too long
        expect(await rule.validate("not array" as any)).toBe(false);
      });

      test("should validate oneOf values", async () => {
        const rule = Validator.oneOf(["red", "green", "blue"]);
        
        expect(await rule.validate("red")).toBe(true);
        expect(await rule.validate("green")).toBe(true);
        expect(await rule.validate("yellow")).toBe(false);
        expect(await rule.validate(123 as any)).toBe(false);
      });

      test("should validate dates", async () => {
        const rule = Validator.date();
        
        expect(await rule.validate(new Date())).toBe(true);
        expect(await rule.validate("2023-01-01")).toBe(true);
        expect(await rule.validate("invalid-date")).toBe(false);
      });

      test("should validate slugs", async () => {
        const rule = Validator.slug();
        
        expect(await rule.validate("valid-slug")).toBe(true);
        expect(await rule.validate("another-valid-slug-123")).toBe(true);
        expect(await rule.validate("Invalid Slug")).toBe(false);
        expect(await rule.validate("slug_with_underscores")).toBe(false);
      });

      test("should validate URLs", async () => {
        const rule = Validator.url();
        
        expect(await rule.validate("https://example.com")).toBe(true);
        expect(await rule.validate("http://localhost:3000")).toBe(true);
        expect(await rule.validate("not-a-url")).toBe(false);
        expect(await rule.validate("ftp://example.com")).toBe(true); // Valid URL protocol
      });

      test("should validate booleans", async () => {
        const rule = Validator.boolean();
        
        expect(await rule.validate(true)).toBe(true);
        expect(await rule.validate(false)).toBe(true);
        expect(await rule.validate("true" as any)).toBe(false);
        expect(await rule.validate(1 as any)).toBe(false);
      });

      test("should validate with custom rules", async () => {
        const rule = Validator.custom(
          (value: string) => value.startsWith("custom_"),
          "Must start with 'custom_'"
        );
        
        expect(await rule.validate("custom_value")).toBe(true);
        expect(await rule.validate("invalid_value")).toBe(false);
      });
    });

    describe("Data Validation", () => {
      test("should validate data against schema", async () => {
        const schema = {
          name: [Validator.required(), Validator.string({ min: 2 })],
          email: [Validator.required(), Validator.email()],
          age: [Validator.number({ min: 18 })]
        };

        const validData = {
          name: "John Doe",
          email: "john@example.com",
          age: 25
        };

        await expect(validateData(validData, schema)).resolves.not.toThrow();
      });

      test("should throw ValidationError for invalid data", async () => {
        const schema = {
          email: [Validator.required(), Validator.email()]
        };

        const invalidData = {
          email: "invalid-email"
        };

        await expect(validateData(invalidData, schema, "req_123"))
          .rejects.toThrow(ValidationError);
      });

      test("should handle validation rule exceptions", async () => {
        const schema = {
          field: [Validator.custom(() => { throw new Error("Validation error"); }, "Custom error")]
        };

        const data = { field: "value" };

        await expect(validateData(data, schema))
          .rejects.toThrow(ValidationError);
      });

      test("should collect multiple validation errors", async () => {
        const schema = {
          name: [Validator.required()],
          email: [Validator.email()],
          age: [Validator.positive()]
        };

        const invalidData = {
          name: "",
          email: "invalid",
          age: -1
        };

        try {
          await validateData(invalidData, schema);
          expect.fail("Should have thrown ValidationError");
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError);
          const details = (error as ValidationError).details;
          expect(details?.validationErrors).toHaveLength(3);
        }
      });
    });

    describe("Input Sanitization", () => {
      test("should sanitize basic input", () => {
        const input = '  <script>alert("xss")</script>Hello World  ';
        const sanitized = sanitizeInput(input);
        
        expect(sanitized).toBe("Hello World");
        expect(sanitized).not.toContain("<script>");
      });

      test("should remove dangerous content", () => {
        const inputs = [
          '<script>alert("xss")</script>',
          'javascript:alert("xss")',
          'onclick="alert()"',
          'onload="malicious()"'
        ];

        inputs.forEach(input => {
          const sanitized = sanitizeInput(input);
          expect(sanitized).not.toContain("script");
          expect(sanitized).not.toContain("javascript:");
          expect(sanitized).not.toContain("onclick");
          expect(sanitized).not.toContain("onload");
        });
      });

      test("should handle non-string input", () => {
        expect(sanitizeInput(null as any)).toBe("");
        expect(sanitizeInput(undefined as any)).toBe("");
        expect(sanitizeInput(123 as any)).toBe("");
      });

      test("should sanitize rich content while preserving safe HTML", () => {
        const input = '<p>Hello</p><script>alert("xss")</script><b>World</b>';
        const sanitized = sanitizeRichContent(input);
        
        expect(sanitized).toContain("<p>Hello</p>");
        expect(sanitized).toContain("<b>World</b>");
        expect(sanitized).not.toContain("<script>");
      });

      test("should remove dangerous rich content elements", () => {
        const dangerousContent = [
          '<iframe src="evil.com"></iframe>',
          '<object data="malicious.swf"></object>',
          '<embed src="harmful.swf">',
          'data:text/html;base64,PHNjcmlwdD4=',
          'vbscript:msgbox("xss")'
        ];

        dangerousContent.forEach(content => {
          const sanitized = sanitizeRichContent(content);
          expect(sanitized).not.toContain("iframe");
          expect(sanitized).not.toContain("object");
          expect(sanitized).not.toContain("embed");
          expect(sanitized).not.toContain("data:");
          expect(sanitized).not.toContain("vbscript:");
        });
      });

      test("should sanitize objects recursively", () => {
        const obj = {
          name: '<script>alert("xss")</script>John',
          description: 'Safe content',
          tags: ['<script>evil</script>tag1', 'tag2'],
          metadata: {
            title: 'javascript:alert("xss")',
            safe: 'This is safe'
          }
        };

        const sanitized = sanitizeObject(obj);
        
        expect(sanitized.name).toBe("John");
        expect(sanitized.description).toBe("Safe content");
        expect(sanitized.tags[0]).toBe("tag1");
        expect(sanitized.tags[1]).toBe("tag2");
        expect(sanitized.metadata.title).toBe("");
        expect(sanitized.metadata.safe).toBe("This is safe");
      });

      test("should handle edge cases in object sanitization", () => {
        expect(sanitizeObject(null as any)).toBe(null);
        expect(sanitizeObject(undefined as any)).toBe(undefined);
        expect(sanitizeObject("string" as any)).toBe("string");
        expect(sanitizeObject(123 as any)).toBe(123);
        
        const obj = { empty: "", null: null, undefined: undefined };
        const sanitized = sanitizeObject(obj);
        expect(sanitized.empty).toBe("");
        expect(sanitized.null).toBe(null);
        expect(sanitized.undefined).toBe(undefined);
      });
    });
  });
});