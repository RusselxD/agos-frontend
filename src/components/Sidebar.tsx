import React from "react";
import { Settings, Users, FileCheck, Gauge, MonitorDot } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { NavLink } from "react-router-dom";

interface Tab {
    name: string;
    path: string;
    icon: React.FC<LucideProps>;
}

const tabs = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: MonitorDot,
    },
    {
        name: "Alert Logs",
        path: "/admin/alert-logs",
        icon: FileCheck,
    },
    {
        name: "Calibration",
        path: "/admin/calibration",
        icon: Gauge,
    },
    {
        name: "Settings",
        path: "/admin/settings",
        icon: Settings,
    },
    {
        name: "Responders",
        path: "/admin/responders",
        icon: Users,
    },
];

export default function Sidebar(): React.JSX.Element {
    return (
        <div className="fixed border top-0 bottom-0 left-0 w-56 flex flex-col">

            <div className="w-full p-5 mb-3 h-20">
                <img src="/agos-w-text.png" className="-ml-3"/>
            </div>

            {/* Tabs */}
            <ul className="w-full flex flex-col px-3 gap-2">
                {tabs.map((tab: Tab, index: number) => {
                    return (
                        <li key={index}>
                            <NavLink
                                to={tab.path}
                                end
                                className={({ isActive }) =>
                                    `flex gap-3 rounded-xl py-3.5 px-4 ${
                                        isActive
                                            ? "border-l-[6px] bg-gray-200 border-primary font-semibold cursor-default"
                                            : "text-neutral hover:bg-gray-100 transition-colors"
                                    }`
                                }
                            >
                                <tab.icon />
                                <span>{tab.name}</span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
