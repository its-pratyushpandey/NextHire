import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from './ui/button';
import { Home, RefreshCcw } from 'lucide-react';

const ErrorBoundary = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Oops! Something went wrong
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {error?.message || "The page you're looking for couldn't be found."}
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="gap-2"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </Button>
                    <Button 
                        onClick={() => navigate('/')}
                        className="gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                        <Home className="h-4 w-4" />
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundary;