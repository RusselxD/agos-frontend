import { useState } from "react";
import Container from "../../../../components/ui/Container";
import EmptyList from "../../../../components/common/EmptyList";
import TableSkeleton from "../../../../components/common/TableSkeleton";
import { useReadingLogs } from "../../context/ReadingLogsContext";
import TableRow from "./TableRow";
// import ExportButton from "./ExportButton";
import DayDetailPanel from "./DayDetailPanel/DayDetailPanel";
import { FileText } from "lucide-react";
import type { DailySummary } from "../../../../types/readingLogs";

const TableHeader = () => (
    <thead className="sticky top-0 z-10">
        <tr>
            <th className="px-5 py-4 font-medium text-left bg-background dark:bg-slate-800 rounded-tl-md text-xs uppercase tracking-wide text-gray-600 dark:text-slate-400">
                Date
            </th>
            <th className="px-5 py-4 font-medium text-left bg-background dark:bg-slate-800 text-xs uppercase tracking-wide text-gray-600 dark:text-slate-400">
                Risk Score
            </th>
            <th className="px-5 py-4 font-medium text-left bg-background dark:bg-slate-800 text-xs uppercase tracking-wide text-gray-600 dark:text-slate-400">
                Water Level
            </th>
            <th className="px-5 py-4 font-medium text-left bg-background dark:bg-slate-800 text-xs uppercase tracking-wide text-gray-600 dark:text-slate-400">
                Precipitation
            </th>
            <th className="px-5 py-4 font-medium text-left bg-background dark:bg-slate-800 rounded-tr-md text-xs uppercase tracking-wide text-gray-600 dark:text-slate-400">
                Blockage
            </th>
        </tr>
    </thead>
);

export default function DataTableContainer() {
    const { summaries, isLoading } = useReadingLogs();

    const [selectedSummary, setSelectedSummary] = useState<DailySummary | null>(
        null,
    );

    if (isLoading) {
        return <TableSkeleton title="DAILY SUMMARIES" rows={8} />;
    }

    return (
        <Container
            headerTitle="DAILY SUMMARIES"
            className="flex-1 flex flex-col min-h-[400px] relative"
        >
            <div className="flex-1 overflow-auto custom-scrollbar rounded-md border border-gray-200 dark:border-slate-700 max-h-[500px]">
                {summaries.length > 0 ? (
                    <>
                        <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                            <TableHeader />
                            <tbody>
                                {summaries.map((summary, index) => (
                                    <TableRow
                                        key={summary.summary_date}
                                        summary={summary}
                                        index={index}
                                        onSelect={setSelectedSummary}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <EmptyList
                        icon={FileText}
                        title="No daily summaries available"
                    />
                )}
            </div>

            {/* Day Detail Panel */}
            {selectedSummary && (
                <DayDetailPanel
                    summary={selectedSummary}
                    onClose={() => setSelectedSummary(null)}
                />
            )}
        </Container>
    );
}
