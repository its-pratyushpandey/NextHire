import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
); 