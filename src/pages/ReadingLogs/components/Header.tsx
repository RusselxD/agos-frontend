import { Sparkles } from "lucide-react";
import { useReadingLogs } from "../context/ReadingLogsContext";
import DateRangePicker from "./DataTable/DateRangePicker";

export default function Header() {
    const { setAnalyzeDrawerIsOpen } = useReadingLogs();

    return (
        <div className="custom-shadow flex min-w-0 flex-col gap-3 rounded-md bg-white px-3 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-lg font-semibold leading-tight">
                Daily Summaries
            </h2>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <DateRangePicker />
                <div className="hidden h-6 w-px bg-gray-200 sm:block" />
                <button
                    className="gemini-btn w-full justify-center sm:w-auto"
                    onClick={() => setAnalyzeDrawerIsOpen(true)}
                >
                    <Sparkles className="gemini-btn-icon w-4 h-4" />
                    <span className="relative z-10">Analyze</span>
                </button>
            </div>
        </div>
    );
}
