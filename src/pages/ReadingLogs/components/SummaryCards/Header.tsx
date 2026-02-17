import { Sparkle } from "lucide-react";
import { formatDate } from "../../../../lib/utils/formatter";
import { useReadingLogs } from "../../context/ReadingLogsContext";

export default function Header() {
    const { startDate, endDate } = useReadingLogs();

    return (
        <div className="flex items-center justify-between bg-white py-3 px-5 rounded-md custom-shadow">
            <div>
                <h2 className="font-semibold text-lg">Daily Summaries</h2>
                <p className="text-gray-500 font-medium text-xs">
                    {formatDate(startDate)} - {formatDate(endDate)}
                </p>
            </div>

            <button className="gemini-btn">
                <Sparkle className="gemini-btn-icon w-4 h-4" />
                <span className="relative z-10">Analyze</span>
            </button>
        </div>
    );
}
