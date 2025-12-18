import { useWaterLevel } from "../../../../../context/WaterLevelContext";

type StatCardProps = {
    title: string;
    data: string | number;
    desc: string;
};

const StatCard = ({ title, data, desc }: StatCardProps) => {
    return (
        <div className="border w-full rounded-md bg-gray-100/60 border-gray-300 px-4 py-3">
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <p className="text-xl font-semibold">{data}</p>
            <p className="text-xs text-gray-700">{desc}</p>
        </div>
    );
};

export default function MetricCards() {
    const { sensorData } = useWaterLevel();

    const getTitleAndDesc = (): {
        title: string;
        data: number;
        desc: string;
    } => {
        switch (sensorData?.alert.level) {
            case "normal":
                return {
                    title: "To Warning",
                    data: sensorData?.alert.distance_to_warning_cm || 0,
                    desc: "cm remaining",
                };
            case "warning":
                return {
                    title: "To Critical",
                    data: sensorData?.alert.distance_to_critical_cm || 0,
                    desc: "cm remaining",
                };
            case "critical":
                return {
                    title: "Above Critical",
                    data: sensorData?.alert.distance_from_critical_cm || 0,
                    desc: "cm over",
                };
            default:
                return {
                    title: "To Warning",
                    data: sensorData?.alert.distance_to_warning_cm || 0,
                    desc: "cm remaining",
                };
        }
    };

    const titleAndDesc = getTitleAndDesc();

    const changeRateData = sensorData?.waterLevel.change_rate_cm_per_min || 0;
    const changeRateDisplay =
        changeRateData > 0 ? `+${changeRateData}` : `${changeRateData}`;

    return (
        <div className="flex flex-col justify-between ml-10 gap-1 flex-1">
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
