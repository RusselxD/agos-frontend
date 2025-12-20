import { useEffect, useState } from "react";
import Container from "../../../components/ui/Container";
import type { SensorReading } from "../../../types/sensor";
import { sensorAPI } from "../../../lib/api/sensor";
import { useToast } from "../../../context/ToastContext";

const formatTimestamp = (timestampString: string) => {
    const date = new Date(timestampString);

    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

const TableSkeleton = () => {
    return (
        <Container
            headerTitle="SENSOR READINGS"
            className="flex-1 flex flex-col"
        >
            <div className="space-y-3">
                <div className="skeleton rounded-md w-full h-12"></div>
                <div className="skeleton rounded-md w-full h-12"></div>
                <div className="skeleton rounded-md w-full h-12"></div>
                <div className="skeleton rounded-md w-full h-12"></div>
            </div>
        </Container>
    );
};

const getTextColor = (status: string) => {
    switch (status) {
        case "rising":
            return "text-red-600";
        case "falling":
            return "text-blue-600";
        case "stable":
            return "text-green-600";
        default:
            return "text-gray-600";
    }
};

const Table = ({ sensorReadings }: { sensorReadings: SensorReading[] }) => {
    return (
        <table className="w-full text-left border-collapse text-sm">
            <thead>
                <tr className="border-b border-base-300">
                    {/* <th className="px-4 py-3 font-medium text-left">
                        Device Name
                    </th> */}
                    <th className="px-4 py-3 font-medium text-left">
                        Water Level (cm)
                    </th>
                    <th className="px-4 py-3 font-medium text-left">
                        Change Rate (cm)
                    </th>
                    <th className="px-4 py-3 font-medium text-left">Status</th>
                    <th className="px-4 py-3 font-medium text-left">
                        Timestamp
                    </th>
                </tr>
            </thead>
            <tbody>
                {sensorReadings.map((reading, index) => (
                    <tr
                        key={reading.id}
                        className={index % 2 !== 0 ? "bg-gray-100" : "bg-white"}
                    >
                        {/* <td className="px-4 py-3">{reading.device_name}</td> */}
                        <td className="px-4 py-3">{reading.water_level_cm}</td>
                        <td className="px-4 py-3">{`${
                            reading.change_rate > 0 ? "+" : ""
                        }${reading.change_rate}`}</td>
                        <td
                            className={`px-4 py-3 font-medium ${getTextColor(
                                reading.status
                            )}`}
                        >
                            {reading.status}
                        </td>
                        <td className="px-4 py-3">
                            {formatTimestamp(reading.timestamp)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default function SensorReadings() {
    const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const { toastError } = useToast();

    useEffect(() => {
        const fetchSensorReadings = async () => {
            try {
                setIsFetching(true);
                const res = await sensorAPI.getLatestSensorReadings(
                    1,
                    10
                );
                console.log("looob");
                console.log(res);
                setSensorReadings(res.items);
            } catch (error) {
                console.log("Error fetching sensor readings:", error);
                toastError("Failed to fetch sensor readings.");
            } finally {
                setIsFetching(false);
            }
        };

        fetchSensorReadings();
    }, []);

    if (isFetching) {
        return <TableSkeleton />;
    }

    return (
        <Container
            headerTitle="SENSOR READINGS"
            className="flex-1 flex flex-col"
        >
            <div className="flex-1 overflow-y-auto">
                <Table sensorReadings={sensorReadings} />
            </div>
        </Container>
    );
}
