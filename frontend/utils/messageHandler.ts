// Message handler utility for filtering and validating window messages
// Prevents console spam from unexpected external messages

interface MessageData {
  action?: string;
  type?: string;
  [key: string]: any;
}

interface MessageHandlerConfig {
  allowedOrigins: string[];
  allowedTypes?: string[];
  debug?: boolean;
}

// Configuration for allowed origins
const allowedOrigins = [
  'https://smart-calculator-hub-d3409cs82vjl9890lfm0.lp.dev', // Production
  'http://localhost:3000', // Development
  'http://localhost:5173', // Vite dev server
  'http://127.0.0.1:3000', // Local development alternative
  'http://127.0.0.1:5173', // Local Vite alternative
  window.location.origin, // Current origin (dynamic)
];

// Known message types that should be processed
const allowedMessageTypes = [
  'skipWaiting',
  'sw-update',
  'pwa-install',
  'app-message',
  'reload',
  'update-available',
  'push-notification',
  'webauthn',
  'beforeinstallprompt',
];

/**
 * Validates if a message origin is allowed
 */
function isOriginAllowed(origin: string): boolean {
  return allowedOrigins.includes(origin);
}

/**
 * Validates if event data is a proper object with expected structure
 */
function isValidMessageData(data: any): data is MessageData {
  return data && typeof data === 'object' && !Array.isArray(data);
}

/**
 * Validates if the message type is allowed
 */
function isMessageTypeAllowed(data: MessageData): boolean {
  if (!data.action && !data.type) {
    // Allow messages without explicit action/type if they have other valid properties
    const hasValidProperties = Object.keys(data).some(key => 
      ['source', 'target', 'id', 'payload', 'event'].includes(key)
    );
    return hasValidProperties;
  }
  
  const messageType = data.action || data.type;
  if (typeof messageType !== 'string') {
    return false;
  }
  
  return allowedMessageTypes.includes(messageType);
}

/**
 * Global message handler that filters and validates messages
 */
export function setupGlobalMessageHandler(config?: Partial<MessageHandlerConfig>) {
  const finalConfig: MessageHandlerConfig = {
    allowedOrigins,
    allowedTypes: allowedMessageTypes,
    debug: false,
    ...config,
  };

  const messageHandler = (event: MessageEvent) => {
    // Skip if no data
    if (!event.data) {
      return;
    }

    // Validate origin
    if (!isOriginAllowed(event.origin)) {
      if (finalConfig.debug) {
        console.debug('Message from disallowed origin ignored:', event.origin);
      }
      return;
    }

    // Validate data structure
    if (!isValidMessageData(event.data)) {
      if (finalConfig.debug) {
        console.debug('Invalid message data structure ignored:', event.data);
      }
      return;
    }

    // Validate message type
    if (!isMessageTypeAllowed(event.data)) {
      if (finalConfig.debug) {
        console.debug('Unrecognized message type ignored:', event.data);
      }
      return;
    }

    // Process valid messages
    try {
      handleValidMessage(event.data, event.origin || window.location.origin);
    } catch (error) {
      console.warn('Error processing valid message:', error);
    }
  };

  // Enhanced error handler to catch and suppress common external errors
  const originalConsoleError = console.error;
  const filteredConsoleError = (...args: any[]) => {
    const message = args.join(' ');
    
    // Filter out known external/browser errors that we can't control
    const suppressedErrors = [
      'Failed to execute \'postMessage\' on \'DOMWindow\'',
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'Script error.',
      'Network request failed'
    ];
    
    // Check if this is an error we want to suppress
    if (suppressedErrors.some(pattern => message.includes(pattern))) {
      // Only log in debug mode
      if (finalConfig.debug) {
        originalConsoleError('[Filtered Error]:', ...args);
      }
      return;
    }
    
    // Let other errors through normally
    originalConsoleError(...args);
  };

  // Override console.error temporarily
  console.error = filteredConsoleError;

  // Add the event listener
  window.addEventListener('message', messageHandler);

  // Return cleanup function
  return () => {
    window.removeEventListener('message', messageHandler);
    // Restore original console.error
    console.error = originalConsoleError;
  };
}

/**
 * Handles messages that have passed all validation checks
 */
function handleValidMessage(data: MessageData, origin: string) {
  const messageType = data.action || data.type;
  
  switch (messageType) {
    case 'skipWaiting':
      // Handle service worker skip waiting
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
      }
      break;
    
    case 'sw-update':
    case 'update-available':
      // Handle service worker update notifications
      window.dispatchEvent(new CustomEvent('sw-update-ready'));
      break;
    
    case 'reload':
      // Handle reload requests from service worker
      if (origin === window.location.origin) {
        window.location.reload();
      }
      break;
    
    case 'pwa-install':
    case 'beforeinstallprompt':
      // Handle PWA installation prompts
      window.dispatchEvent(new CustomEvent('pwa-install-prompt'));
      break;
    
    case 'push-notification':
      // Handle push notifications
      console.log('Push notification received:', data);
      break;
    
    case 'webauthn':
      // Handle WebAuthn messages
      console.log('WebAuthn message received:', data);
      break;
    
    case 'app-message':
      // Handle custom app messages
      console.log('App message received:', data);
      break;
    
    default:
      // Silently handle other valid messages without logging
      // This prevents console spam from legitimate browser messages
      break;
  }
}

/**
 * Utility to send a message with proper validation
 */
export function sendMessage(targetWindow: Window, message: MessageData, targetOrigin: string = '*') {
  if (!isValidMessageData(message)) {
    throw new Error('Invalid message data structure');
  }
  
  targetWindow.postMessage(message, targetOrigin);
}