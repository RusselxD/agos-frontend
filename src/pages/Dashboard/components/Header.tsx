import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDate } from "../../../lib/utils/formatter";
import { useWebSocket } from "../../../context/WebSocketContext";
import { useCoreHook } from "../../../context/CoreContext";

const MapPinFilled = ({ className }: { className?: string }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 10.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            fill="currentColor"
        />
        <circle cx="12" cy="10" r="2" fill="white" />
    </svg>
);

const Location = () => {
    const { locationDetails } = useCoreHook();

    return (
        <div className="flex -ml-1 items-center gap-2 border-r-2 border-gray-400 pr-4 mr-4">
            <div className="bg-red-100 p-1.5 rounded-lg">
                <MapPinFilled className="text-red-500" />
            </div>
            <span className="font-semibold">
                {locationDetails.location_name}
            </span>
        </div>
    );
};

const TimeAndDate = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const updateTime = () => {
            setTime(new Date());
        };

        const timerId = setInterval(updateTime, 500);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const formattedTime = time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    return (
        <div>
            <p className="font-medium">{formattedTime}</p>
            <p>{formatDate(time.toDateString())}</p>
        </div>
    );
};

const TimeDisplay = () => {
    return (
        <div className="flex items-center gap-2 text-sm border border-gray-300 px-3 py-2 rounded-lg bg-gray-50">
            <div className="border-r-2 border-gray-400 pr-3 mr-3">
                <Clock />
            </div>
            <TimeAndDate />
        </div>
    );
};

const ConnectingStatus = () => {
    return (
        <div className="flex items-center gap-2 border-amber-400 border bg-amber-100 py-2 px-3 rounded-md">
            <div className="bg-amber-500 rounded-full w-3 h-3 pulse-circle"></div>
            <p className="text-amber-600 text-sm font-semibold">Connecting</p>
        </div>
    );
};

const Status = () => {
    return (
        <div className="flex items-center gap-2 border-green-400 border bg-green-100 py-2 px-3 rounded-md">
            <div className="bg-emerald-500 rounded-full w-3 h-3"></div>
            <p className="text-emerald-600 text-sm font-semibold">Connected</p>
        </div>
    );
};

export default function Header() {
    const { isConnected } = useWebSocket();

    return (
        <div className="bg-white custom-shadow rounded-xl pl-5 pr-3 py-2 flex items-center justify-between">
            <div className="flex items-center">
                <Location />
                {isConnected ? <Status /> : <ConnectingStatus />}
            </div>
            <TimeDisplay />
        </div>
    );
}
