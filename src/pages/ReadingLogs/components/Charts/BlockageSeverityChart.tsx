import { Doughnut } from "react-chartjs-2";
import { useMemo } from "react";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import type { TooltipItem } from "chart.js";
import { useReadingLogs } from "../../context/ReadingLogsContext";
import Container from "../../../../components/ui/Container";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export default function BlockageSeverityChart() {
    const { summaries } = useReadingLogs();

    const chartData = useMemo(() => {
        const distribution = {
            clear: 0,
            partial: 0,
            blocked: 0,
        };

        summaries.forEach((s) => {
            const severity = s.most_severe_blockage?.toLowerCase();
            if (severity === "clear") distribution.clear++;
            else if (severity === "partial") distribution.partial++;
            else if (severity === "blocked") distribution.blocked++;
        });

        return distribution;
    }, [summaries]);

    const totalDays = summaries.length;

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    callbacks: {
                        label: function (context: TooltipItem<"doughnut">) {
                            const value = context.raw as number;
                            const percentage = (
                                (value / totalDays) *
                                100
                            ).toFixed(1);
                            return `${context.label}: ${value} days (${percentage}%)`;
                        },
                    },
                },
            },
            cutout: "65%",
        }),
        [totalDays],
    );

    const data = {
        labels: ["Clear", "Partial", "Blocked"],
        datasets: [
            {
                data: [chartData.clear, chartData.partial, chartData.blocked],
                backgroundColor: [
                    "rgba(46, 204, 113, 0.8)",
                    "rgba(243, 156, 18, 0.8)",
                    "rgba(231, 76, 60, 0.8)",
                ],
                borderColor: ["#2ECC71", "#F39C12", "#E74C3C"],
                borderWidth: 2,
                hoverOffset: 8,
            },
        ],
    };

    const total = chartData.clear + chartData.partial + chartData.blocked;

    return (
        <Container headerTitle="BLOCKAGE DISTRIBUTION" className="h-auto overflow-hidden sm:h-80">
            <div className="flex min-w-0 flex-col items-center justify-center gap-5 sm:flex-row sm:gap-10">
                <div className="mt-2 flex h-40 items-center justify-center sm:mt-5 sm:h-44">
                    <div className="relative h-40 w-40 sm:h-44 sm:w-44">
                        <Doughnut data={data} options={options} />
                        {/* Center text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-2xl font-bold text-neutral">
                                {total}
                            </p>
                            <p className="text-xs text-gray-500">Total Days</p>
                        </div>
                    </div>
                </div>
                {/* Custom legend */}
                <div className="grid w-full grid-cols-3 gap-2 text-xs font-semibold sm:flex sm:w-auto sm:flex-col sm:justify-center sm:gap-6 sm:text-sm">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 shrink-0 rounded-full bg-clear"></span>
                        <span className="min-w-0 truncate text-gray-600">
                            Clear ({chartData.clear})
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 shrink-0 rounded-full bg-partial"></span>
                        <span className="min-w-0 truncate text-gray-600">
                            Partial ({chartData.partial})
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 shrink-0 rounded-full bg-blocked"></span>
                        <span className="min-w-0 truncate text-gray-600">
                            Blocked ({chartData.blocked})
                        </span>
                    </div>
                </div>
            </div>
        </Container>
    );
}
