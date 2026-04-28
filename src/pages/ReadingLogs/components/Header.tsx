import { Sparkles } from "lucide-react";
import { useReadingLogs } from "../context/ReadingLogsContext";
import DateRangePicker from "./DataTable/DateRangePicker";

export default function Header() {
    const { setAnalyzeDrawerIsOpen } = useReadingLogs();

    return (
        <div className="flex items-center justify-between bg-white py-3 px-5 rounded-md custom-shadow">
            <h2 className="font-semibold text-lg">Daily Summaries</h2>

            <div className="flex items-center gap-3">
                <DateRangePicker />
                <div className="h-6 w-px bg-gray-200" />
                <button
                    className="gemini-btn"
                    onClick={() => setAnalyzeDrawerIsOpen(true)}
                >
                    <Sparkles className="gemini-btn-icon w-4 h-4" />
                    <span className="relative z-10">Analyze</span>
                </button>
            </div>
        </div>
    );
}
