// Error Fallback Component
import React from 'react';

/**
 * ErrorFallback - Display when an error occurs
 * @param {Error} error - Error object
 * @param {Function} resetErrorBoundary - Function to reset error state
 * @param {string} title - Custom title
 * @param {string} description - Custom description
 */
const ErrorFallback = ({
    error,
    resetErrorBoundary,
    title = 'Something went wrong',
    description = 'An unexpected error occurred. Please try again.',
    showDetails = false,
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] py-12 px-4">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-danger-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-secondary-900 mb-2">{title}</h2>

            {/* Description */}
            <p className="text-secondary-500 text-center max-w-md mb-6">{description}</p>

            {/* Error details (for development) */}
            {showDetails && error && (
                <div className="w-full max-w-md mb-6">
                    <details className="bg-secondary-50 rounded-lg p-4 text-sm">
                        <summary className="font-medium text-secondary-700 cursor-pointer">
                            Error Details
                        </summary>
                        <pre className="mt-2 text-xs text-danger-600 overflow-auto whitespace-pre-wrap">
                            {error.message}
                            {error.stack && `\n\n${error.stack}`}
                        </pre>
                    </details>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                {resetErrorBoundary && (
                    <button
                        onClick={resetErrorBoundary}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                )}
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors font-medium"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

/**
 * Error Boundary Class Component
 */
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (import.meta.env?.DEV) {
            console.error('ErrorBoundary caught:', error, errorInfo);
        }

        // TODO: Send to error tracking service
        // logErrorToService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallback
                    error={this.state.error}
                    resetErrorBoundary={() => this.setState({ hasError: false, error: null })}
                    showDetails={import.meta.env?.DEV}
                />
            );
        }

        return this.props.children;
    }
}

/**
 * 404 Not Found Component
 */
export const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12 px-4">
        <div className="text-8xl font-bold text-secondary-200 mb-4">404</div>
        <h2 className="text-xl font-bold text-secondary-900 mb-2">Page Not Found</h2>
        <p className="text-secondary-500 text-center max-w-md mb-6">
            The page you're looking for doesn't exist or has been moved.
        </p>
        <a
            href="/dashboard"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
            Go to Dashboard
        </a>
    </div>
);

/**
 * Unauthorized Access Component
 */
export const Unauthorized = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12 px-4">
        <div className="w-20 h-20 bg-warning-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>
        <h2 className="text-xl font-bold text-secondary-900 mb-2">Access Denied</h2>
        <p className="text-secondary-500 text-center max-w-md mb-6">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <a
            href="/dashboard"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
            Go to Dashboard
        </a>
    </div>
);

export default ErrorFallback;
