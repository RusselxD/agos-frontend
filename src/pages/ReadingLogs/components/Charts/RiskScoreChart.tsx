import { Line } from "react-chartjs-2";
import { useMemo } from "react";
import type { TooltipItem } from "chart.js";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { useReadingLogs } from "../../context/ReadingLogsContext";
import Container from "../../../../components/ui/Container";
import { formatDate } from "../../../../lib/utils/formatter";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

export default function RiskScoreChart() {
    const { summaries } = useReadingLogs();

    const chartData = useMemo(() => {
        // Reverse to show oldest first (chronological order)
        const sorted = [...summaries].reverse();
        return {
            labels: sorted.map((s) => formatDate(s.summary_date)),
            minScores: sorted.map((s) => s.min_risk_score),
            maxScores: sorted.map((s) => s.max_risk_score),
        };
    }, [summaries]);

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top" as const,
                    labels: {
                        usePointStyle: true,
                        padding: 10,
                        boxWidth: 8,
                        font: { size: 11 },
                    },
                },
                tooltip: {
                    mode: "index" as const,
                    intersect: false,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    callbacks: {
                        label: function (context: TooltipItem<"line">) {
                            return `${context.dataset.label}: ${context.parsed.y}`;
                        },
                    },
                },
            },
            scales: {
                y: {
                    min: 0,
                    max: 110,
                    ticks: {
                        font: { size: 11 },
                        callback: (value: string | number) => `${value}`,
                    },
                    title: {
                        display: true,
                        text: "Risk Score",
                        font: { size: 11, weight: "bold" as const },
                    },
                },
                x: {
                    ticks: {
                        font: { size: 10 },
                        maxTicksLimit: 5,
                        maxRotation: 45,
                    },
                },
            },
            interaction: {
                mode: "nearest" as const,
                axis: "x" as const,
                intersect: false,
            },
            elements: {
                line: { tension: 0.3 },
                point: { radius: 2, hoverRadius: 5 },
            },
        }),
        [],
    );

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: "Max Risk",
                data: chartData.maxScores,
                borderColor: "#E74C3C",
                backgroundColor: "rgba(231, 76, 60, 0.1)",
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: "#E74C3C",
                pointBorderColor: "white",
                pointBorderWidth: 1,
            },
            {
                label: "Min Risk",
                data: chartData.minScores,
                borderColor: "#2ECC71",
                backgroundColor: "rgba(46, 204, 113, 0.1)",
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: "#2ECC71",
                pointBorderColor: "white",
                pointBorderWidth: 1,
            },
        ],
    };

    return (
        <Container headerTitle="RISK SCORE TREND" className="h-72 overflow-hidden sm:h-80">
            <div className="h-52 min-w-0 sm:h-60">
                <Line data={data} options={options} />
            </div>
        </Container>
    );
}
