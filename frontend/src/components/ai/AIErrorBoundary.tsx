import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class AIErrorBoundary extends React.Component<Props, State> {
    state: State = {
        hasError: false
    };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error): void {
        console.error('AI Error:', error);
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        <p>AI features are currently unavailable.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="ml-2 text-sm underline hover:text-red-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AIErrorBoundary;