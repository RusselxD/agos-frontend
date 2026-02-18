import { useEffect, useRef, useState } from "react";
import { useReadingLogs } from "../../context/ReadingLogsContext";
import { useAnalysisStream } from "../../../../hooks/useAnalysisStream";
import { Send } from "lucide-react";
import { useFollowUpStream } from "../../../../hooks/useFollowUpStream";
import UserBubble from "./components/UserBubble";
import AIBubble from "./components/AIBubble";
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
    const [input, setInput] = useState("");
    const {
        messages,
        streamingText,
        isStreaming: isFollowUpStreaming,
        sendMessage,
        addAssistantMessage,
    } = useFollowUpStream(summaries);
    const isLoading = status === "loading";
    const isAnalysisStreaming = status === "streaming";
    const isDone = status === "done";
    const isError = status === "error";

    // Auto-scroll as text streams in
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [text, messages, streamingText]);

    // Seed the initial analysis into the chat thread once complete.
    useEffect(() => {
        if (isDone && text) {
            addAssistantMessage(text);
        }
    }, [isDone, text, addAssistantMessage]);

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
                    isAnalysisStreaming={isAnalysisStreaming}
                    isFollowUpStreaming={isFollowUpStreaming}
                    isDone={isDone}
                    isError={isError}
                    handleClose={handleClose}
                />

                {/* Scrollable content */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-3 pt-4"
                >
                    {/* Shimmer while loading */}
                    {isLoading && <Shimmer />}

                    {/* Stream initial analysis live while it is being generated */}
                    {isAnalysisStreaming && text && (
                        <div className="mt-4">
                            <AIBubble text={text} showCursor />
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

                    {messages.map((msg, i) => (
                        <div key={i} className="mb-4">
                            {msg.role === "user" ? (
                                <UserBubble text={msg.content} />
                            ) : (
                                <AIBubble text={msg.content} />
                            )}
                        </div>
                    ))}

                    {isFollowUpStreaming && (
                        <AIBubble text={streamingText} showCursor />
                    )}
                </div>

                {/* Follow up input */}
                {isDone && (
                    <div className="shrink-0 px-5 pb-4 ">
                        <div className="flex gap-2 items-center border border-slate-200 bg-slate-50 rounded-xl px-4 py-2 focus-within:border-sky-300 transition-colors">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage(input);
                                        setInput("");
                                    }
                                }}
                                placeholder="Ask a follow-up question..."
                                rows={1}
                                className="flex-1 bg-transparent text-sm text-slate-800 resize-none focus:outline-none placeholder:text-slate-400"
                            />
                            <button
                                onClick={() => {
                                    sendMessage(input);
                                    setInput("");
                                }}
                                disabled={!input.trim()}
                                className="gemini-btn p-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 w-7 h-7 rounded-lg"
                            >
                                <Send className="text-white" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
