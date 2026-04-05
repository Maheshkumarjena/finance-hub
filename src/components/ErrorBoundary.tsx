import React, { ReactNode, ErrorInfo } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardContent className="p-6 sm:p-8">
              {/* Error Icon */}
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>

              {/* Error Message */}
              <h2 className="text-lg sm:text-xl font-semibold text-center mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-4">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-4 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-xs font-mono text-destructive mb-1 break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-muted-foreground mt-2">
                      <summary className="cursor-pointer font-medium hover:text-foreground">
                        Stack trace
                      </summary>
                      <pre className="mt-2 overflow-auto max-h-40 bg-background p-2 rounded text-[10px] whitespace-pre-wrap break-words">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={this.handleReset}
                  className="flex-1 gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
