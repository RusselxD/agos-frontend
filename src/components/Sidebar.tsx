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
    BellRing,
    ScanEye,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

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
        name: "Reading Logs",
        path: "/admin/reading-logs",
        icon: FileCheck,
    },
    {
        name: "Notif Logs",
        path: "/admin/notification-logs",
        icon: BellRing,
    },
    {
        name: "Detection Logs",
        path: "/admin/detection-logs",
        icon: ScanEye,
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
        <>
            {/* Desktop sidebar (lg and up) */}
            <div
                className={`hidden lg:flex fixed border-r px-5 top-0 bottom-0 left-0 flex-col items-center bg-white dark:bg-slate-800/30 dark:backdrop-blur-xl dark:border-slate-700/50 transition-all duration-200 overflow-hidden ${
                    isCollapsed ? "w-20" : "w-56"
                }`}
            >
                {/* Header - toggle button fixed at top-right */}
                <div className="w-full flex items-center justify-between py-2 mt-1">
                    {!isCollapsed && (
                        <Link
                            to="/"
                            aria-label="Go to landing page"
                            title="Go to landing page"
                            className="rounded-md hover:opacity-80 transition-opacity"
                        >
                            <img
                                src="/agos.svg"
                                alt="AGOS"
                                className="w-7"
                            />
                        </Link>
                    )}

                    <button
                        aria-label="Toggle sidebar"
                        title="Toggle sidebar"
                        onClick={onToggle}
                        className="flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-500 dark:text-slate-400"
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
                                                ? "bg-primary/10 dark:bg-blue-500/10 text-primary dark:text-blue-400"
                                                : "text-neutral dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
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
                                                ? "border-l-[4px] bg-primary/5 dark:bg-blue-500/10 border-primary dark:border-blue-500 text-primary dark:text-blue-400 font-semibold cursor-default"
                                                : "text-neutral dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
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

            {/* Mobile/Tablet bottom navigation (below lg) */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800/60 dark:backdrop-blur-xl border-t border-gray-200 dark:border-slate-700/50 safe-bottom">
                <ul className="flex items-center justify-around px-1 py-1.5 overflow-x-auto">
                    {tabs.map((tab: Tab, index: number) => (
                        <li key={index} className="flex-shrink-0">
                            <NavLink
                                to={tab.path}
                                end
                                className={({ isActive }) =>
                                    `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[0.6rem] ${
                                        isActive
                                            ? "text-primary dark:text-blue-400 font-semibold"
                                            : "text-gray-500 dark:text-slate-400"
                                    }`
                                }
                            >
                                <tab.icon className="w-5 h-5" />
                                <span className="hidden sm:block whitespace-nowrap">{tab.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
