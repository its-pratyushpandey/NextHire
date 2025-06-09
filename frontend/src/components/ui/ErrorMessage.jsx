export const ErrorMessage = ({ message }) => (
    <div className="p-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <p>{message}</p>
    </div>
);