import { useWaterLevel } from "../../../../../context/WaterLevelContext";

type StatCardProps = {
    title: string;
    data: string | number;
    desc: string;
};

const StatCard = ({ title, data, desc }: StatCardProps) => {
    const { warning } = useWaterLevel();

    return (
        <div
            className={`border w-full h-full flex flex-col justify-center gap-1 md:gap-2 rounded-xl px-3 py-3 md:px-4 md:py-4 transition-all duration-300 ${warning ? "bg-amber-100/50 dark:bg-amber-900/20 border-amber-300/50 dark:border-amber-700/30 backdrop-blur-sm" : "bg-white/40 dark:bg-white/[0.02] border-gray-200/50 dark:border-white/10 backdrop-blur-sm shadow-sm hover:dark:border-white/20"}`}
        >
            <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
            <p className="flex items-baseline gap-1">
                <span className="text-xl md:text-2xl font-bold">{data}</span>
                <span className="text-[0.7rem] md:text-xs text-gray-500 dark:text-slate-400 font-medium">{desc}</span>
            </p>
        </div>
    );
};

export default function MetricCards() {
    const { sensorData } = useWaterLevel();

    const getTitleAndDesc = (): StatCardProps => {
        switch (sensorData?.alert.level) {
            case "normal":
                return {
                    title: "To Warning",
                    data: (
                        sensorData?.alert.distance_to_warning_cm || 0
                    ).toFixed(1),
                    desc: "cm remaining",
                };
            case "warning":
                return {
                    title: "To Critical",
                    data: (
                        sensorData?.alert.distance_to_critical_cm || 0
                    ).toFixed(1),
                    desc: "cm remaining",
                };
            case "critical":
                return {
                    title: "Above Critical",
                    data: (
                        sensorData?.alert.distance_from_critical_cm || 0
                    ).toFixed(1),
                    desc: "cm over",
                };
            default:
                return {
                    title: "To Warning",
                    data: (
                        sensorData?.alert.distance_to_warning_cm || 0
                    ).toFixed(1),
                    desc: "cm remaining",
                };
        }
    };

    const titleAndDesc = getTitleAndDesc();

    const changeRateData = sensorData?.water_level.change_rate || 0;
    const changeRateDisplay =
        changeRateData > 0 ? `+${changeRateData}` : `${changeRateData}`;

    return (
        <div className="flex flex-col justify-between ml-4 lg:ml-10 gap-3 flex-1">
            <StatCard
                title="Change Rate"
                data={changeRateDisplay}
                desc="cm/min"
            />
            <StatCard
                title={titleAndDesc.title}
                data={titleAndDesc.data}
                desc={titleAndDesc.desc}
            />
        </div>
    );
}
