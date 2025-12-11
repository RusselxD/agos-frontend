import { Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

const MapPinFilled = ({ className }: { className?: string }): React.JSX.Element => (
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

const Location = (): React.JSX.Element => {
    return (
        <div className="bg-white custom-shadow rounded-lg w-fit flex items-start justify-center py-3 pl-4 pr-32 gap-1 font-medium">
            <MapPinFilled className="text-red-500" />
            <span className="font-semibold">
                Valenzuela Site 1: Maysan Creek
            </span>
        </div>
    );
};

const SystemStatus = (): React.JSX.Element => {
    return (
        <div className="flex items-center gap-2">
            <span className="rounded-full w-5 h-5 bg-emerald-500"></span>
            <span className="text-emerald-600">SYSTEM ONLINE</span>
        </div>
    );
};

const ClockDisplay = (): React.JSX.Element => {
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
        <div className="flex items-center gap-2">
            <Clock />
            <span>{formattedTime}</span>
        </div>
    );
};

export default function Header(): React.JSX.Element {
    return (
        <div>
            <div className="font-bold flex items-center justify-between mb-2">
                <h1 className="text-3xl">Dashboard</h1>
                <p>ADMIN_LGU</p>
            </div>

            <div className="flex justify-between items-center">
                <Location />
                <div className="flex flex-col items-end font-medium text-sm gap-1">
                    <SystemStatus />
                    <ClockDisplay />
                </div>
            </div>
        </div>
    );
}
