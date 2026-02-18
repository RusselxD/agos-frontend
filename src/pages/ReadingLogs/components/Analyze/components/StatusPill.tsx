type Props = {
    isLoading: boolean;
    isAnalysisStreaming: boolean;
    isFollowUpStreaming: boolean;
    isDone: boolean;
    isError: boolean;
};

export default function StatusPill({
    isLoading,
    isAnalysisStreaming,
    isFollowUpStreaming,
    isDone,
    isError,
}: Props) {
    if (isError) {
        return <span className="text-red-500 text-xs">Something went wrong</span>;
    }

    if (isLoading) {
        return (
            <span className="text-sky-700 animate-pulse text-xs">
                Analyzing data...
            </span>
        );
    }

    if (isAnalysisStreaming) {
        return (
            <span className="text-sky-700 animate-pulse text-xs">
                Generating initial insights...
            </span>
        );
    }

    if (isFollowUpStreaming) {
        return (
            <span className="text-sky-700 animate-pulse text-xs">
                Generating follow-up reply...
            </span>
        );
    }

    if (isDone) {
        return (
            <span className="text-emerald-700 text-xs">
                Analysis complete
            </span>
        );
    }

    return null;
}
