# Logging System Documentation

## Overview

A comprehensive error logging system has been implemented for the Smart Calculator Hub application. This system captures, stores, and displays errors from both backend and frontend components.

## Components

### Backend Service (`/backend/logs/`)

#### Database Schema
- **Table**: `error_logs`
- **Migration**: `013_create_error_logs.up.sql`
- **Fields**:
  - `id`: Unique identifier
  - `timestamp`: When the error occurred
  - `level`: Log level (debug, info, warn, error, critical)
  - `message`: Error message
  - `error_type`: Type/name of the error
  - `stack_trace`: Full stack trace
  - `service_name`: Service that generated the log
  - `endpoint`: API endpoint where error occurred
  - `user_id`: User ID (if available)
  - `request_id`: Request ID for tracking
  - `metadata`: Additional JSON metadata
  - `environment`: Environment (dev/prod)
  - `ip_address`: Client IP address
  - `user_agent`: Browser/client user agent

#### API Endpoints

1. **POST /logs/error** - Create a new error log
   - Request: `CreateLogRequest`
   - Response: `{ success: boolean; logId: number }`

2. **POST /logs/get** - Retrieve logs with filters
   - Request: `GetLogsRequest` (level, serviceName, startDate, endDate, limit, offset)
   - Response: `GetLogsResponse` (logs array, total count, hasMore flag)

3. **GET /logs/stats** - Get logging statistics
   - Response: `LogStats` (total, by level, by service, recent errors, critical errors)

4. **DELETE /logs/clear** - Clear old logs
   - Request: `{ olderThanDays?: number }`
   - Response: `{ success: boolean; deleted: number }`

#### Internal Functions

- `logErrorInternal()`: For logging errors directly from backend code without HTTP request

### Frontend Components

#### Admin Logs Viewer (`/frontend/pages/admin/LogsViewer.tsx`)
- Real-time log viewing with filters
- Statistics dashboard showing:
  - Total logs
  - Critical errors
  - Recent errors (24h)
  - Errors and warnings by level
- Filtering by:
  - Log level
  - Service name
- Expandable log details showing:
  - Stack traces
  - Metadata
  - Request/user information
- Actions:
  - Test error creation
  - Refresh logs
  - Clear all logs

#### Error Integration

1. **ErrorBoundary** (`/frontend/components/ErrorBoundary.tsx`)
   - Automatically logs React component errors
   - Captures component stack traces
   - Sends logs to backend

2. **useErrorHandler** (`/frontend/hooks/useErrorHandler.ts`)
   - Logs API errors and exceptions
   - Integrates with toast notifications
   - Sends error details to logging service

#### Test Page (`/frontend/pages/TestLogsPage.tsx`)
- Manual testing interface
- Create logs of all levels (debug, info, warn, error, critical)
- Test ErrorBoundary integration
- Test API error handling

## Usage

### Backend Logging

```typescript
import { logErrorInternal } from '~backend/logs/log';

// Log an error internally
await logErrorInternal('error', 'Something went wrong', {
  serviceName: 'my-service',
  endpoint: '/my/endpoint',
  metadata: { additionalInfo: 'value' }
});
```

### Frontend Logging

```typescript
import backend from '~backend/client';

// Log from frontend
await backend.logs.logError({
  level: 'error',
  message: 'User action failed',
  errorType: 'ValidationError',
  serviceName: 'frontend',
  endpoint: window.location.pathname,
  metadata: { userId: user.id }
});
```

### Automatic Error Logging

Errors are automatically logged when:
- React components throw errors (via ErrorBoundary)
- API calls fail (via useErrorHandler hook)
- Backend services encounter exceptions

## Access

### Admin Panel
1. Navigate to `/admin/logs`
2. Login with admin credentials
3. View, filter, and analyze logs
4. Clear old logs when needed

### Test Page
1. Navigate to `/test-logs`
2. Create test logs of different levels
3. Test error boundary and error handlers
4. Verify logs appear in admin panel

## Testing

### Backend Tests
Run backend tests:
```bash
npm test backend/logs/logs_test.ts
```

Tests cover:
- Creating logs via API
- Internal logging
- Filtering and pagination
- Statistics calculation
- Metadata storage
- Different log levels
- Log clearing

### Manual Testing
1. Visit `/test-logs`
2. Create logs of each level
3. Test component errors
4. Test API errors
5. View logs in `/admin/logs`
6. Verify all data is captured correctly

## Log Levels

- **debug**: Detailed information for debugging
- **info**: General informational messages
- **warn**: Warning messages for potential issues
- **error**: Error messages for failures
- **critical**: Critical errors requiring immediate attention

## Best Practices

1. **Use appropriate log levels**:
   - `debug`: Development debugging only
   - `info`: Normal operations
   - `warn`: Potential issues
   - `error`: Failures that don't crash the app
   - `critical`: Severe failures

2. **Include context**:
   - Always set `serviceName`
   - Set `endpoint` for API-related errors
   - Use `metadata` for additional context

3. **Stack traces**:
   - Include stack traces for errors
   - Helps with debugging

4. **Cleanup**:
   - Regularly clear old logs
   - Use `olderThanDays` parameter to keep recent logs

## Performance Considerations

- Logs are indexed by timestamp, level, and service for fast queries
- Pagination is used to handle large log volumes
- Frontend logs are sent asynchronously to avoid blocking UI

## Security

- Admin authentication required for viewing logs
- Sensitive data should not be logged in metadata
- IP addresses and user agents are captured for security tracking
