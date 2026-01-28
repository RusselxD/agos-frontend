import type { FC } from "react";
import {
    Settings,
    Users,
    FileCheck,
    MonitorDot,
    Waves,
    UserStar,
    PanelLeftClose,
    PanelLeftOpen,
    CloudSunRain,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import { NavLink } from "react-router-dom";

interface Tab {
    name: string;
    path: string;
    icon: FC<LucideProps>;
}

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const tabs = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: MonitorDot,
    },
    {
        name: "Weather",
        path: "/admin/weather",
        icon: CloudSunRain,
    },
    {
        name: "Sensor",
        path: "/admin/sensor",
        icon: Waves,
    },
    {
        name: "Responders",
        path: "/admin/responders",
        icon: Users,
    },
    {
        name: "Alert Logs",
        path: "/admin/alert-logs",
        icon: FileCheck,
    },
    {
        name: "Admins",
        path: "/admin/admins",
        icon: UserStar,
    },
    {
        name: "Settings",
        path: "/admin/settings",
        icon: Settings,
    },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    return (
        <div
            className={`fixed border px-5 top-0 bottom-0 left-0 flex flex-col items-center bg-white transition-all duration-200 overflow-hidden ${
                isCollapsed ? "w-20" : "w-56"
            }`}
        >
            {/* Header - toggle button fixed at top-right */}
            <div className="w-full flex items-center justify-between py-2 mt-1">
                {!isCollapsed && (
                    <img
                        src="/agos.svg"
                        alt="AGOS"
                        className="w-7"
                        aria-label="AGOS Logo"
                        title="AGOS Logo"
                    />
                )}

                <button
                    aria-label="Toggle sidebar"
                    title="Toggle sidebar"
                    onClick={onToggle}
                    className="flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition-colors text-gray-500"
                >
                    {isCollapsed ? (
                        <PanelLeftOpen className="w-5 h-5" />
                    ) : (
                        <PanelLeftClose className="w-5 h-5" />
                    )}
                </button>
            </div>

            {isCollapsed ? (
                <ul className="flex flex-col items-center gap-2">
                    {tabs.map((tab: Tab, index: number) => (
                        <li key={index}>
                            <NavLink
                                to={tab.path}
                                end
                                className={({ isActive }) =>
                                    `flex items-center justify-center rounded-xl p-3 ${
                                        isActive
                                            ? "bg-gray-200 text-primary"
                                            : "text-neutral hover:bg-gray-100 transition-colors"
                                    }`
                                }
                            >
                                <tab.icon className="w-5 h-5" />
                            </NavLink>
                        </li>
                    ))}
                </ul>
            ) : (
                <ul className="flex flex-col gap-2 w-full">
                    {tabs.map((tab: Tab, index: number) => (
                        <li key={index}>
                            <NavLink
                                to={tab.path}
                                end
                                className={({ isActive }) =>
                                    `flex gap-2 rounded-xl py-3.5 px-3 ${
                                        isActive
                                            ? "border-l-[4px] bg-gray-100 border-primary font-semibold cursor-default"
                                            : "text-neutral hover:bg-gray-100 transition-colors"
                                    }`
                                }
                            >
                                <tab.icon className="w-5 h-5" />
                                <span className="text-[0.9rem]">
                                    {tab.name}
                                </span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
