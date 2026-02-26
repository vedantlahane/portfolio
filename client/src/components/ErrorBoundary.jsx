import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[40vh] w-full bg-gray-50/50 rounded-lg border border-gray-100 p-8 text-center">
                    <p className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
                        Something went wrong
                    </p>
                    <p className="text-sm text-gray-600 mb-6">
                        This section failed to load.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 border border-gray-900 text-gray-900 text-xs font-medium uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-colors duration-300"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
