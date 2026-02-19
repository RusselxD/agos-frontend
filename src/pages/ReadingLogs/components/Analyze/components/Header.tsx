import { Sparkles, X } from "lucide-react";
import { formatDate } from "../../../../../lib/utils/formatter";
import StatusPill from "./StatusPill";

interface HeaderProps {
    startDate: string;
    endDate: string;
    isLoading: boolean;
    isStreaming: boolean;
    isDone: boolean;
    isError: boolean;
    handleClose: () => void;
}

export default function Header({
    startDate,
    endDate,
    isLoading,
    isStreaming,
    isDone,
    isError,
    handleClose,
}: HeaderProps) {
    return (
        <div className="shrink-0 px-5 pt-4 pb-3 border-b border-slate-200 relative">
            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                    <div className="gemini-btn cursor-default p-2">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <p className="font-semibold text-slate-900">AI Analysis</p>
                </div>
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
    );
}
