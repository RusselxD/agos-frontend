import { useEffect, useRef } from "react";
import { useReadingLogs } from "../../context/ReadingLogsContext";
import { useAnalysisStream } from "../../../../hooks/useAnalysisStream";
import MarkdownText from "./components/MarkDownText";
import Header from "./components/Header";

function Shimmer() {
    return (
        <div className="flex flex-col gap-2.5 p-4">
            {[95, 75, 88, 60, 72, 83, 55].map((w, i) => (
                <div
                    key={i}
                    className="h-3 rounded-md bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse"
                    style={{ width: `${w}%` }}
                />
            ))}
        </div>
    );
}

export default function AnalyzePanel() {
    const { setAnalyzeDrawerIsOpen, summaries, startDate, endDate } =
        useReadingLogs();
    const { text, status, analyze, reset } = useAnalysisStream();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll as text streams in
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [text]);

    // Kick off analysis as soon as the drawer mounts
    useEffect(() => {
        analyze({
            start_date: startDate,
            end_date: endDate,
            summaries,
        });

        // Cancel the stream if the drawer is closed mid-generation
        return () => reset();
    }, []);

    const handleClose = () => {
        reset();
        setAnalyzeDrawerIsOpen(false);
    };

    const isLoading = status === "loading";
    const isStreaming = status === "streaming";
    const isDone = status === "done";
    const isError = status === "error";

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
                onClick={handleClose}
            />

            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-gray-50 to-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
                <Header
                    startDate={startDate}
                    endDate={endDate}
                    isLoading={isLoading}
                    isStreaming={isStreaming}
                    isDone={isDone}
                    isError={isError}
                    handleClose={handleClose}
                />

                {/* Scrollable content */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto">
                    {/* Shimmer while loading */}
                    {isLoading && <Shimmer />}

                    {/* AI analysis bubble */}
                    {(isStreaming || isDone) && text && (
                        <div className="flex gap-2.5 items-start">
                            <div className="flex-1 bg-white border border-slate-200 px-4 py-2 shadow-sm">
                                <MarkdownText
                                    text={text}
                                    showCursor={isStreaming}
                                />
                            </div>
                        </div>
                    )}

                    {/* Error state */}
                    {isError && (
                        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                            <p className="text-sm text-slate-500">
                                Failed to generate analysis.
                            </p>
                            <button
                                onClick={() =>
                                    analyze({
                                        start_date: startDate,
                                        end_date: endDate,
                                        summaries,
                                    })
                                }
                                className="text-xs text-sky-600 font-medium hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
