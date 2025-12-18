import { Activity, Clock, Power, Wifi } from "lucide-react";
import type { ReactNode } from "react";

interface StatusCardPropd {
    icon: ReactNode;
    title: string;
    children: ReactNode;
    className?: string;
}

const StatusCard = ({ icon, title, children, className }: StatusCardPropd) => {
    return (
        <div className={`bg-white px-4 py-5 ${className}`}>
            <div className="flex items-center gap-4">
                {icon}
                <p className="text-gray-500 text-sm font-semibold">{title}</p>
            </div>
            {children}
        </div>
    );
};

const StatusText = ({ text }: { text: string }) => {
    return <p className="font-semibold  ml-12">{text}</p>;
};

const ConnectionContainer = () => {
    return (
        <StatusCard
            icon={
                <Power className="p-2 rounded-md bg-green-100 text-green-600 w-8 h-8" />
            }
            title="CONNECTION"
        >
            <StatusText text="Online" />
        </StatusCard>
    );
};

const LastUpdatedContainer = () => {
    return (
        <StatusCard
            icon={
                <Clock className="p-2 rounded-md bg-blue-100 text-blue-600 w-8 h-8" />
            }
            title="LAST UPDATED"
        >
            <StatusText text="5 minutes ago" />
        </StatusCard>
    );
};

const SignalContainer = () => {
    return (
        <StatusCard
            icon={
                <Wifi className="p-2 rounded-md bg-purple-100 text-purple-600 w-8 h-8" />
            }
            title="SIGNAL"
            className="relative"
        >
            <StatusText text="Good" />
            <div className="absolute bottom-3 right-3 w-16 h-12 flex items-end justify-end gap-1">
                <span className="w-2 h-1/4 rounded-full bg-emerald-500"></span>
                <span className="w-2 h-2/4 rounded-full bg-emerald-500"></span>
                <span className="w-2 h-3/4 rounded-full bg-emerald-500"></span>
                <span className="w-2 h-full rounded-full bg-emerald-500"></span>
            </div>
        </StatusCard>
    );
};

const HealthContainer = () => {
    return (
        <StatusCard
            icon={
                <Activity className="p-2 rounded-md bg-cyan-100 text-cyan-600 w-8 h-8" />
            }
            title="HEALTH"
        >
            <StatusText text="Excellent" />
        </StatusCard>
    );
};

export default function StatusContainer() {
    return (
        <div className="border bg-gray-50 borde border-gray-300 rounded-md p-3">
            <h1 className="flex items-center font-medium text-gray-700 gap-2 mb-2">
                <Activity size={20} />
                <span>Sensor Status</span>
            </h1>
            <div className="space-y-2">
                <ConnectionContainer />
                <LastUpdatedContainer />
                <SignalContainer />
                <HealthContainer />
            </div>
        </div>
    );
}
