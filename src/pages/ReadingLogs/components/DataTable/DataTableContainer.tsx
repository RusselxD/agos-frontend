import { useState } from "react";
import Container from "../../../../components/ui/Container";
import EmptyList from "../../../../components/common/EmptyList";
import TableSkeleton from "../../../../components/common/TableSkeleton";
import { useReadingLogs } from "../../context/ReadingLogsContext";
import TableRow, { BlockageBadge, RiskBadge } from "./TableRow";
// import ExportButton from "./ExportButton";
import DayDetailPanel from "./DayDetailPanel/DayDetailPanel";
import { FileText } from "lucide-react";
import type { DailySummary } from "../../../../types/readingLogs";
import { formatDate } from "../../../../lib/utils/formatter";

const TableHeader = () => (
    <thead className="sticky top-0 z-10">
        <tr>
            <th className="px-5 py-4 font-medium text-left bg-background rounded-tl-md text-xs uppercase tracking-wide text-gray-600">
                Date
            </th>
            <th className="px-5 py-4 font-medium text-left bg-background text-xs uppercase tracking-wide text-gray-600">
                Risk Score
            </th>
            <th className="px-5 py-4 font-medium text-left bg-background text-xs uppercase tracking-wide text-gray-600">
                Water Level
            </th>
            <th className="px-5 py-4 font-medium text-left bg-background text-xs uppercase tracking-wide text-gray-600">
                Precipitation
            </th>
            <th className="px-5 py-4 font-medium text-left bg-background rounded-tr-md text-xs uppercase tracking-wide text-gray-600">
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
            <div className="max-h-[500px] flex-1 overflow-auto rounded-md border border-gray-200">
                {summaries.length > 0 ? (
                    <>
                        <div className="space-y-2 p-2 md:hidden">
                            {summaries.map((summary) => (
                                <button
                                    key={summary.summary_date}
                                    type="button"
                                    onClick={() => setSelectedSummary(summary)}
                                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition-colors hover:bg-primary/5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-neutral">
                                                {formatDate(summary.summary_date)}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Water {summary.min_water_level_cm} - {summary.max_water_level_cm} cm
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1">
                                            <RiskBadge score={summary.min_risk_score} />
                                            <span className="text-xs text-gray-400">→</span>
                                            <RiskBadge score={summary.max_risk_score} />
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                                        <div>
                                            <p className="text-gray-400">Precipitation</p>
                                            <p className="font-medium">
                                                {summary.min_precipitation_mm} - {summary.max_precipitation_mm} mm
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Blockage</p>
                                            <div className="mt-1 flex flex-wrap items-center gap-1">
                                                <BlockageBadge status={summary.least_severe_blockage} />
                                                {summary.least_severe_blockage !==
                                                    summary.most_severe_blockage && (
                                                    <>
                                                        <span className="text-gray-400">→</span>
                                                        <BlockageBadge status={summary.most_severe_blockage} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
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
                        </div>
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
