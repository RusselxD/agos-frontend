import { Sparkles } from "lucide-react";
import { useReadingLogs } from "../context/ReadingLogsContext";
import DateRangePicker from "./DataTable/DateRangePicker";

export default function Header() {
    const { setAnalyzeDrawerIsOpen } = useReadingLogs();

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-800 py-3 px-5 rounded-md custom-shadow border border-gray-100 dark:border-slate-700/50 transition-colors">
            {/* Mobile Top Row: Title + Analyze Button */}
            <div className="flex items-center justify-between w-full md:w-auto">
                <h2 className="font-semibold text-lg whitespace-nowrap dark:text-slate-200">Daily Summaries</h2>
                
                <button
                    className="gemini-btn md:hidden"
                    onClick={() => setAnalyzeDrawerIsOpen(true)}
                >
                    <Sparkles className="gemini-btn-icon w-4 h-4" />
                    <span className="relative z-10">Analyze</span>
                </button>
            </div>

            {/* Bottom Row / Desktop Right Side: Date Picker + Desktop Analyze Button */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-full">
                    <DateRangePicker />
                </div>
                
                <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-slate-700" />
                <button
                    className="gemini-btn hidden md:flex"
                    onClick={() => setAnalyzeDrawerIsOpen(true)}
                >
                    <Sparkles className="gemini-btn-icon w-4 h-4" />
                    <span className="relative z-10">Analyze</span>
                </button>
            </div>
        </div>
    );
}
