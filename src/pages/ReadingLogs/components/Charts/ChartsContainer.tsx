import { useReadingLogs } from "../../context/ReadingLogsContext";
import ChartSkeleton from "./ChartSkeleton";
import RiskScoreChart from "./RiskScoreChart";
import WaterLevelChart from "./WaterLevelChart";
import PrecipitationChart from "./PrecipitationChart";
import BlockageSeverityChart from "./BlockageSeverityChart";

export default function ChartsContainer() {
    const { summaries, isLoading } = useReadingLogs();

    // Use single column layout when data gets large for better readability
    const useFullWidth = summaries.length > 30;
    const gridCols = useFullWidth
        ? "grid-cols-1"
        : "grid-cols-1 xl:grid-cols-2";

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
                <ChartSkeleton />
                <ChartSkeleton />
            </div>
        );
    }

    if (summaries.length === 0) {
        return null;
    }

    return (
        <div
            className={`grid ${gridCols} gap-2 transition-all duration-500 ease-in-out`}
        >
            <div className="transition-all duration-500 ease-in-out">
                <RiskScoreChart />
            </div>
            <div className="transition-all duration-500 ease-in-out">
                <WaterLevelChart />
            </div>
            <div className="transition-all duration-500 ease-in-out">
                <PrecipitationChart />
            </div>
            <div className="transition-all duration-500 ease-in-out">
                <BlockageSeverityChart />
            </div>
        </div>
    );
}
