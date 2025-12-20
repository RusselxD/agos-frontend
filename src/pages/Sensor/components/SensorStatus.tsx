import { Clock, Power, Wifi } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import Container from "../../../components/ui/Container";
import type { SensorDeviceStatus } from "../../../types/sensor";
import { useToast } from "../../../context/ToastContext";
import { sensorAPI } from "../../../lib/api/sensor";
import { getTimeAgo, capitalizeFirstLetter } from "../../../lib/utils/formatter";

interface StatusCardPropd {
    icon: ReactNode;
    title: string;
    children: ReactNode;
    className?: string;
}

interface CardProps {
    value: string;
}

const StatusCard = ({ icon, title, children, className }: StatusCardPropd) => {
    return (
        <div
            className={`bg-white border border-gray-300 rounded-md px-4 py-4 h-full flex flex-col gap-1 ${className}`}
        >
            <div className="flex items-center gap-2">
                {icon}
                <p className="text-gray-500 text-sm font-medium">{title}</p>
            </div>
            {children}
        </div>
    );
};

const StatusText = ({ text }: { text: string }) => {
    return <p className="font-semibold ml-10">{text}</p>;
};

const ConnectionContainer = ({ value }: CardProps) => {
    return (
        <StatusCard
            icon={
                <Power className="p-2 rounded-md bg-green-100 text-green-600 w-8 h-8" />
            }
            title="Connection"
        >
            <StatusText text={value} />
        </StatusCard>
    );
};

const LastUpdatedContainer = ({ value }: CardProps) => {
    return (
        <StatusCard
            icon={
                <Clock className="p-2 rounded-md bg-blue-100 text-blue-600 w-8 h-8" />
            }
            title="Last Updated"
        >
            <StatusText text={value ? getTimeAgo(value) : "N/A"} />
        </StatusCard>
    );
};

const SignalContainer = ({ value }: CardProps) => {
    return (
        <StatusCard
            icon={
                <Wifi className="p-2 rounded-md bg-purple-100 text-purple-600 w-8 h-8" />
            }
            title="Signal"
        >
            <StatusText text={value ? capitalizeFirstLetter(value) : "N/A"} />
        </StatusCard>
    );
};

const Details = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="flex items-center">
            <p className="text-sm min-w-[4.5rem] text-gray-700">{label}</p>
            <p className="text-sm font-medium">{value}</p>
        </div>
    );
};

export default function SensorStatus() {
    const [sensorStatus, setSensorStatus] = useState<SensorDeviceStatus | null>(
        null
    );
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const { toastError } = useToast();

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setIsFetching(true);
                const res = await sensorAPI.getSensorStatus(1);
                setSensorStatus(res);
            } catch (error) {
                console.log(error)
                toastError("Failed to fetch sensor status.");
            } finally {
                setIsFetching(false);
            }
        };

        fetchStatus();
    }, []);

    if (isFetching) {
        return (
            <Container
                headerTitle="SENSOR STATUS"
                className="w-1/4 flex flex-col justify-between"
            >
                <div className="space-y-3">
                    <div className="rounded-md skeleton w-full h-24"></div>
                    <div className="rounded-md skeleton w-full h-24"></div>
                    <div className="rounded-md skeleton w-full h-24"></div>
                </div>
                <div className="space-y-3">
                    <div className="rounded-md skeleton w-2/3 h-7"></div>
                    <div className="rounded-md skeleton w-2/3 h-7"></div>
                </div>
            </Container>
        );
    }

    if (!sensorStatus) {
    }

    return (
        <Container
            headerTitle="SENSOR STATUS"
            className="w-1/4 flex flex-col justify-between"
        >
            <div className="grid grid-rows-3 gap-3 flex-1">
                <ConnectionContainer value={sensorStatus?.connection || ""} />
                <LastUpdatedContainer
                    value={sensorStatus?.last_updated || ""}
                />
                <SignalContainer value={sensorStatus?.signal || ""} />
            </div>
            <div className="border-t mt-5 pt-3 space-y-1">
                <Details
                    label="Device:"
                    value={sensorStatus?.device_name || ""}
                />
                <Details
                    label="Location:"
                    value={sensorStatus?.location || ""}
                />
            </div>
        </Container>
    );
}
