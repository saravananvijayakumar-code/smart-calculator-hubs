import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Chunk load error:", error, errorInfo);
    
    if (error.message.includes("Failed to fetch dynamically imported module")) {
      console.warn("Lazy route failed - reloading in 2s");
      setTimeout(() => window.location.reload(), 2000);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ padding: "16px", textAlign: "center" }}>
          <p>Loading failed. Reloading...</p>
        </div>
      );
    }
    return this.props.children;
  }
}
