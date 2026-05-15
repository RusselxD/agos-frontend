type Props = {
    isLoading: boolean;
    isStreaming: boolean;
    isDone: boolean;
    isError: boolean;
};

export default function StatusPill({
    isLoading,
    isStreaming,
    isDone,
    isError,
}: Props) {
    return (
        <>
            {isLoading && (
                <span className="text-sky-700 dark:text-sky-400 animate-pulse text-xs">
                    Analyzing data...
                </span>
            )}
            {isStreaming && (
                <span className="text-sky-700 dark:text-sky-400 animate-pulse text-xs">
                    Generating insights...
                </span>
            )}
            {isDone && (
                <span className="text-emerald-700 dark:text-emerald-400 text-xs">
                    Analysis complete
                </span>
            )}
            {isError && (
                <span className="text-red-500 text-xs">
                    Something went wrong
                </span>
            )}
        </>
    );
}
