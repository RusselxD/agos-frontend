import { useEffect, useRef } from "react";
import { useReadingLogs } from "../../context/ReadingLogsContext";
import { useAnalysisStream } from "../../../../hooks/useAnalysisStream";
import MarkdownText from "./components/MarkDownText";
import { formatDate } from "../../../../lib/utils/formatter";
import { Sparkles, X } from "lucide-react";
import StatusPill from "./components/StatusPill";

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
    // const [input, setInput] = useState(""); // follow-up: uncomment later
    // const { messages, streamingText, isStreaming, sendMessage } = useFollowUpStream(summaries); // follow-up: uncomment later

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
                <div className="shrink-0 px-5 pt-5 pb-4 border-b border-slate-100 relative">
                    <div className="flex flex-col gap-1 w-full">
                        <p className="font-bold text-slate-900">AI Analysis</p>
                        <div className="flex items-center justify-between w-full">
                            <p className="text-xs text-slate-700">
                                {formatDate(startDate)} – {formatDate(endDate)}
                            </p>
                            <StatusPill
                                isLoading={isLoading}
                                isStreaming={isStreaming}
                                isDone={isDone}
                                isError={isError}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 transition-colors absolute top-3 right-3"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Scrollable content */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-5 py-4"
                >
                    {/* Shimmer while loading */}
                    {isLoading && <Shimmer />}

                    {/* AI analysis bubble */}
                    {(isStreaming || isDone) && text && (
                        <div className="flex gap-2.5 items-start">
                            <div className="gemini-btn p-2">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="flex-1 bg-white border border-slate-200 rounded-xl rounded-tl-sm px-4 py-3 shadow-sm">
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

                    {/* follow-up messages: uncomment when ready */}
                    {/* {messages.map((msg, i) => (
                        <div key={i} className="mt-4">
                            {msg.role === "user"
                                ? <UserBubble text={msg.content} />
                                : <AIBubble text={msg.content} />
                            }
                        </div>
                    ))}
                    {isStreaming && <AIBubble text={streamingText} showCursor />} */}
                </div>

                {/* Footer */}
                {isDone && (
                    <div className="shrink-0 px-5 py-4 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                            Generated from {summaries.length}-day summary
                        </p>
                        <button
                            onClick={() =>
                                analyze({
                                    start_date: startDate,
                                    end_date: endDate,
                                    summaries,
                                })
                            }
                            className="text-xs text-slate-500 font-medium border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
                        >
                            ↺ Regenerate
                        </button>
                    </div>
                )}

                {/* follow-up input: uncomment when ready */}
                {/* {isDone && (
                    <div className="shrink-0 px-5 py-4 border-t border-slate-100">
                        <div className="flex gap-2 items-end bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:border-sky-300 transition-colors">
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => {
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
                                onClick={() => { sendMessage(input); setInput(""); }}
                                disabled={!input.trim()}
                                className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center disabled:opacity-40 transition-opacity"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-300 text-center mt-2">Enter to send · Shift+Enter for new line</p>
                    </div>
                )} */}
            </div>
        </>
    );
}
