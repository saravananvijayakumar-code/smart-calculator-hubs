import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  }
  
  var vi: import('vitest').VitestUtils

  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

declare module '@testing-library/jest-dom/matchers' {
  interface TestingLibraryMatchers<T = any, R = void> {
    toBeInTheDocument(): R
    toHaveValue(value: string | number | null): R
    toHaveAttribute(attr: string, value?: string): R
    toHaveClass(...classes: string[]): R
    toBeDisabled(): R
  }
}