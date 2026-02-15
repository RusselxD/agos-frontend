import { formatDate } from "../../../../lib/utils/formatter";
import type { DailySummary } from "../../../../types/readingLogs";

interface TableRowProps {
    summary: DailySummary;
    index: number;
}

const BlockageBadge = ({ status }: { status: string }) => {
    const normalized = status.toLowerCase();
    let bgColor = "bg-gray-100 text-gray-600";

    if (normalized === "clear") {
        bgColor = "bg-clear/15 text-clear";
    } else if (normalized === "partial") {
        bgColor = "bg-partial/15 text-partial";
    } else if (normalized === "blocked") {
        bgColor = "bg-blocked/15 text-blocked";
    }

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const RiskBadge = ({ score }: { score: number }) => {
    let bgColor = "bg-clear/15 text-clear";

    if (score >= 70) {
        bgColor = "bg-blocked/15 text-blocked";
    } else if (score >= 40) {
        bgColor = "bg-partial/15 text-partial";
    }

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}
        >
            {score}
        </span>
    );
};

export default function TableRow({ summary, index }: TableRowProps) {
    return (
        <tr className={index % 2 !== 0 ? "bg-gray-50" : "bg-white"}>
            <td className="px-5 py-4 text-left font-medium text-neutral whitespace-nowrap">
                {formatDate(summary.summary_date)}
            </td>
            <td className="px-5 py-4 text-left">
                <div className="flex items-center gap-2">
                    <RiskBadge score={summary.min_risk_score} />
                    <span className="text-gray-400">→</span>
                    <RiskBadge score={summary.max_risk_score} />
                </div>
            </td>
            <td className="px-5 py-4 text-left whitespace-nowrap">
                <span className="text-sm">
                    {summary.min_water_level_cm} - {summary.max_water_level_cm}{" "}
                    cm
                </span>
            </td>
            <td className="px-5 py-4 text-left whitespace-nowrap">
                <span className="text-sm">
                    {summary.min_precipitation_mm} -{" "}
                    {summary.max_precipitation_mm} mm
                </span>
            </td>
            <td className="px-5 py-4 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                    <BlockageBadge status={summary.least_severe_blockage} />
                    {summary.least_severe_blockage !==
                        summary.most_severe_blockage && (
                        <>
                            <span className="text-gray-400">→</span>
                            <BlockageBadge
                                status={summary.most_severe_blockage}
                            />
                        </>
                    )}
                </div>
            </td>
            <td className="px-5 py-4 text-left whitespace-nowrap">
                <span className="text-sm text-gray-600">
                    {summary.min_debris_count} - {summary.max_debris_count}
                </span>
            </td>
        </tr>
    );
}
