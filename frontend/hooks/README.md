# Frontend Error Handling Hooks

This directory contains React hooks and utilities for handling errors in the frontend application.

## Hooks

### `useErrorHandler`

A comprehensive hook for handling API errors with toast notifications and logging.

#### Features
- Automatic error parsing and formatting
- Toast notifications for user feedback
- Error logging for debugging
- Validation error handling
- Customizable error messages

#### Usage

```typescript
import { useErrorHandler } from './useErrorHandler';

function MyComponent() {
  const { handleError, handleAsyncError } = useErrorHandler({
    showToast: true,
    logError: true,
    onError: (error) => {
      // Custom error handling logic
      analytics.track('error_occurred', { error: error.code });
    }
  });

  const handleSubmit = async (data) => {
    try {
      await backend.users.create(data);
    } catch (error) {
      handleError(error);
    }
  };

  // Or use handleAsyncError for automatic error handling
  const handleSubmitAlt = async (data) => {
    const result = await handleAsyncError(
      backend.users.create(data),
      null // fallback value
    );
    
    if (result) {
      // Success
    }
  };
}
```

#### Options

```typescript
interface ErrorHandlerOptions {
  showToast?: boolean;        // Show toast notification (default: true)
  logError?: boolean;         // Log error to console (default: true)
  onError?: (error: ApiError) => void;  // Custom error handler
  defaultMessage?: string;    // Default error message
}
```

### `useApi`

A hook for managing API call state with automatic error handling.

#### Features
- Loading state management
- Error state management
- Data state management
- Automatic error handling
- Success callbacks

#### Usage

```typescript
import { useApi } from './useApi';

function UserProfile({ userId }) {
  const { data, loading, error, execute, reset } = useApi({
    showErrorToast: true,
    onSuccess: (user) => {
      console.log('User loaded:', user);
    },
    onError: (error) => {
      analytics.track('user_load_failed', { error: error.code });
    }
  });

  useEffect(() => {
    execute(() => backend.users.get(userId));
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return <div>User: {data.name}</div>;
}
```

### `useApiCall`

A specialized hook for wrapping specific API functions.

#### Usage

```typescript
import { useApiCall } from './useApi';

function CreateUserForm() {
  const { call: createUser, loading, error } = useApiCall(
    backend.users.create,
    {
      showErrorToast: true,
      onSuccess: (user) => {
        navigate(`/users/${user.id}`);
      }
    }
  );

  const handleSubmit = (formData) => {
    createUser(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

## Error Boundary Component

### `ErrorBoundary`

A React error boundary component that catches JavaScript errors in the component tree.

#### Features
- Catches and displays React errors
- Retry functionality
- Navigation to home page
- Detailed error information (in development)
- Customizable fallback UI

#### Usage

```typescript
import { ErrorBoundary, withErrorBoundary } from '../components/ErrorBoundary';

// Wrap individual components
function App() {
  return (
    <ErrorBoundary>
      <UserProfile />
    </ErrorBoundary>
  );
}

// Or use the HOC
const SafeUserProfile = withErrorBoundary(UserProfile, {
  showDetails: true,
  onError: (error, errorInfo) => {
    analytics.track('react_error', { error: error.message });
  }
});
```

#### Props

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;           // Custom fallback UI
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;          // Show detailed error info
}
```

## API Client

### `ApiClient`

A singleton class for making API calls with consistent error handling.

#### Usage

```typescript
import { apiClient } from './useApi';

// Configure default options
apiClient.setDefaultOptions({
  showErrorToast: true,
  onError: (error) => {
    // Global error handling
  }
});

// Make API calls
const user = await apiClient.get('/api/users/123');
const newUser = await apiClient.post('/api/users', userData);
const updatedUser = await apiClient.put('/api/users/123', updates);
await apiClient.delete('/api/users/123');
```

## Error Types

### `ApiError`

The standard error interface used throughout the frontend:

```typescript
interface ApiError {
  code?: string | number;
  message: string;
  details?: {
    code?: string;
    field?: string;
    validationErrors?: Array<{
      field: string;
      message: string;
    }>;
    [key: string]: any;
  };
}
```

## Best Practices

### 1. Error Handling Patterns

```typescript
// ✅ Good - Use hooks for consistent error handling
const { handleError } = useErrorHandler();

try {
  await apiCall();
} catch (error) {
  handleError(error);
}

// ❌ Bad - Manual error handling everywhere
try {
  await apiCall();
} catch (error) {
  console.error(error);
  toast({ title: "Error", description: error.message });
}
```

### 2. Loading States

```typescript
// ✅ Good - Use useApi for automatic state management
const { data, loading, error } = useApi();

// ❌ Bad - Manual state management
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
```

### 3. Error Boundaries

```typescript
// ✅ Good - Wrap components that might throw
<ErrorBoundary>
  <ComplexCalculatorComponent />
</ErrorBoundary>

// ✅ Good - Use error boundaries at route level
<Route 
  path="/calculator" 
  element={
    <ErrorBoundary>
      <CalculatorPage />
    </ErrorBoundary>
  } 
/>
```

### 4. Validation Error Display

```typescript
// ✅ Good - Handle validation errors specifically
const { handleError } = useErrorHandler({
  onError: (error) => {
    if (error.details?.validationErrors) {
      // Handle validation errors specially
      setFieldErrors(error.details.validationErrors);
    }
  }
});

// ❌ Bad - Generic error display for validation errors
const handleSubmit = async (data) => {
  try {
    await submit(data);
  } catch (error) {
    setError(error.message); // Loses field-specific information
  }
};
```

## Integration with Backend

The frontend error handling system is designed to work seamlessly with the backend error handling:

```typescript
// Backend sends structured errors
{
  "code": "VALIDATION_FAILED",
  "message": "Validation failed: Invalid email format",
  "details": {
    "code": "VALIDATION_FAILED",
    "field": "email",
    "validationErrors": [
      { "field": "email", "message": "Must be a valid email address" }
    ],
    "requestId": "req-123"
  }
}

// Frontend automatically handles these
const { handleError } = useErrorHandler({
  onError: (error) => {
    // error.code === "VALIDATION_FAILED"
    // error.details.validationErrors contains field-specific errors
    // Toast shows: "Validation Error: email: Must be a valid email address"
  }
});
```

## Testing

Error handling hooks can be easily tested:

```typescript
import { renderHook } from '@testing-library/react';
import { useErrorHandler } from './useErrorHandler';

test('handles API errors correctly', () => {
  const onError = jest.fn();
  const { result } = renderHook(() => useErrorHandler({ onError }));
  
  const apiError = {
    code: 'VALIDATION_FAILED',
    message: 'Invalid email',
    details: { field: 'email' }
  };
  
  result.current.handleError(apiError);
  
  expect(onError).toHaveBeenCalledWith(apiError);
});
```