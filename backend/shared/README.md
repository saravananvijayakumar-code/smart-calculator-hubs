# Enterprise Error Handling System

This directory contains a comprehensive error handling system designed for enterprise-grade applications. The system provides structured error handling, validation, logging, and monitoring capabilities.

## Components

### 1. Error Classes (`errors.ts`)

The system provides a hierarchy of error classes that map to appropriate HTTP status codes:

#### Base Error Classes
- `AppError` - Base class for all application errors
- `ValidationError` - For input validation failures (400)
- `UnauthorizedError` - For authentication failures (401)
- `ForbiddenError` - For authorization failures (403)
- `NotFoundError` - For resource not found (404)
- `ConflictError` - For resource conflicts (409)
- `RateLimitError` - For rate limiting (429)
- `InternalError` - For server errors (500)
- `DatabaseError` - For database operation failures (500)
- `ExternalServiceError` - For external service failures (500)
- `TimeoutError` - For operation timeouts (500)

#### Usage Example

```typescript
import { ValidationError, NotFoundError, handleDatabaseError } from '../shared/errors';

// Validation error
throw new ValidationError("Invalid email format", "email", { providedValue: "invalid-email" });

// Not found error
throw new NotFoundError("User not found", { userId: "123" });

// Database error handling
try {
  await db.query("SELECT * FROM users WHERE id = $1", [userId]);
} catch (dbError) {
  throw handleDatabaseError(dbError, requestId);
}
```

### 2. Validation System (`validation.ts`)

Provides robust input validation with sanitization:

#### Built-in Validators
- `required()` - Ensures field is not empty
- `string(options)` - String validation with min/max length and pattern
- `email()` - Email format validation
- `number(options)` - Number validation with min/max and integer check
- `positive()` - Positive number validation
- `array(options)` - Array validation with length constraints
- `oneOf(values)` - Enum validation
- `date()` - Date validation
- `slug()` - URL slug validation
- `url()` - URL validation
- `custom(fn, message)` - Custom validation function

#### Usage Example

```typescript
import { validateData, Validator, sanitizeObject } from '../shared/validation';

const userSchema = {
  email: [Validator.required(), Validator.email()],
  age: [Validator.required(), Validator.number({ min: 0, max: 150 })],
  name: [Validator.required(), Validator.string({ min: 1, max: 100 })],
  website: [Validator.url()],
};

export const createUser = api(
  { method: "POST", path: "/users" },
  async (req) => {
    const sanitizedReq = sanitizeObject(req);
    await validateData(sanitizedReq, userSchema, requestId);
    // ... rest of the handler
  }
);
```

### 3. Logging System (`logger.ts`)

Enterprise-grade structured logging with different log levels:

#### Log Levels
- `DEBUG` - Detailed debugging information
- `INFO` - General information
- `WARN` - Warning conditions
- `ERROR` - Error conditions

#### Convenience Methods
- `request(method, path, context)` - Log incoming requests
- `response(method, path, statusCode, duration, context)` - Log responses
- `database(operation, table, context)` - Log database operations
- `externalService(service, operation, context)` - Log external service calls
- `performance(operation, duration, context)` - Log performance metrics
- `security(event, context)` - Log security events

#### Usage Example

```typescript
import logger from '../shared/logger';

logger.info("User created successfully", {
  requestId: "req-123",
  userId: "user-456",
  metadata: { email: "user@example.com" }
});

logger.performance("database-query", 150, {
  requestId: "req-123",
  metadata: { table: "users", operation: "SELECT" }
});
```

### 4. Middleware System (`middleware.ts`)

Provides request/response middleware with error handling, logging, and rate limiting:

#### Key Features
- Request context creation with unique request IDs
- Automatic request/response logging
- Error handling and conversion
- Rate limiting
- Performance monitoring

#### Usage Example

```typescript
import { withRequestLogging, withErrorHandling, withRateLimit } from '../shared/middleware';

export const sensitiveOperation = api(
  { method: "POST", path: "/sensitive" },
  withRateLimit(
    {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 10,
    },
    withRequestLogging("POST", "/sensitive", async (req) => {
      const context = createRequestContext();
      
      return withErrorHandling("sensitive-operation", context, async () => {
        // Your business logic here
      });
    })
  )
);
```

## Best Practices

### 1. Error Handling

```typescript
// ✅ Good - Use specific error types
throw new ValidationError("Invalid email format", "email");

// ❌ Bad - Generic errors
throw new Error("Something went wrong");

// ✅ Good - Include context
throw new NotFoundError("User not found", { userId, requestId });

// ❌ Bad - No context
throw new NotFoundError("Not found");
```

### 2. Validation

```typescript
// ✅ Good - Validate and sanitize input
const sanitizedReq = sanitizeObject(req);
await validateData(sanitizedReq, schema, requestId);

// ❌ Bad - Use raw input
const result = await processUser(req);

// ✅ Good - Comprehensive validation schema
const schema = {
  email: [Validator.required(), Validator.email()],
  age: [Validator.required(), Validator.number({ min: 0, max: 150 })],
};

// ❌ Bad - Minimal validation
const schema = {
  email: [Validator.required()],
};
```

### 3. Logging

```typescript
// ✅ Good - Structured logging with context
logger.info("Operation completed", {
  requestId: context.requestId,
  userId: context.userId,
  metadata: { duration: 150, result: "success" }
});

// ❌ Bad - Unstructured logging
console.log("Operation completed in 150ms");

// ✅ Good - Use appropriate log levels
logger.error("Database connection failed", context, error);
logger.warn("Slow query detected", context);
logger.info("User logged in", context);
logger.debug("Cache hit", context);

// ❌ Bad - Everything as console.log
console.log("Database connection failed", error);
console.log("User logged in");
```

### 4. Rate Limiting

```typescript
// ✅ Good - Apply rate limiting to sensitive endpoints
export const sendEmail = api(
  { method: "POST", path: "/send-email" },
  withRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    keyGenerator: (userId, ip) => `email:${userId || ip}`,
  }, handler)
);

// ✅ Good - Different limits for different operations
export const login = api(
  { method: "POST", path: "/login" },
  withRateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10,
    keyGenerator: (userId, ip) => `login:${ip}`,
  }, handler)
);
```

## Integration with Encore.ts

The error handling system is designed to work seamlessly with Encore.ts APIs:

```typescript
import { api } from "encore.dev/api";
import { 
  withRequestLogging, 
  withErrorHandling, 
  createRequestContext,
  ValidationError,
  NotFoundError 
} from "../shared";

export const getUser = api(
  { method: "GET", path: "/users/:id" },
  withRequestLogging("GET", "/users/:id", async ({ id }) => {
    const context = createRequestContext();
    
    return withErrorHandling("get-user", context, async () => {
      if (!id || id.length === 0) {
        throw new ValidationError("User ID is required", "id");
      }
      
      const user = await db.queryRow("SELECT * FROM users WHERE id = $1", [id]);
      
      if (!user) {
        throw new NotFoundError("User not found", { userId: id });
      }
      
      return user;
    });
  })
);
```

## Environment Configuration

The system automatically adjusts based on the environment:

- **Development**: DEBUG level logging, detailed error messages
- **Test**: WARN level logging, minimal output
- **Production**: INFO level logging, sanitized error messages

## Monitoring and Observability

The system provides structured logs that can be easily integrated with monitoring solutions:

- Request/response correlation via request IDs
- Performance metrics for slow operations
- Security event logging
- Database operation tracking
- External service call monitoring

## Error Response Format

All errors are returned in a consistent format:

```json
{
  "code": "VALIDATION_FAILED",
  "message": "Invalid email format",
  "details": {
    "field": "email",
    "timestamp": "2023-12-01T10:30:00Z",
    "requestId": "req-uuid-123",
    "validationErrors": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

This standardized format makes it easy for frontend applications to handle errors consistently.