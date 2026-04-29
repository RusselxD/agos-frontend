import { useReadingLogs } from "../../context/ReadingLogsContext";
import DateDropdown from "./DateDropdown";

export default function DateRangePicker() {
    const { startDate, endDate, setStartDate, setEndDate, availableDays } =
        useReadingLogs();

    if (availableDays.length === 0) return null;

    return (
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:flex sm:items-center">
            <DateDropdown
                value={startDate}
                options={availableDays}
                onChange={setStartDate}
            />

            <span className="text-sm text-gray-400">to</span>

            <DateDropdown
                value={endDate}
                options={availableDays}
                onChange={setEndDate}
            />
        </div>
    );
}
