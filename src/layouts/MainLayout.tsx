import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useWebSocket } from "../context/WebSocketContext";

export default function MainLayout(): React.JSX.Element {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { isConnected, disconnectedSince } = useWebSocket();

    return (
        <div className="min-h-screen bg-background">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
            />
            <div
                className={`flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden pb-24 transition-all duration-200 sm:pb-28 lg:pb-0 ${
                    isSidebarCollapsed ? "lg:ml-20" : "lg:ml-56"
                }`}
            >
                {!isConnected && disconnectedSince && (
                    <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 sm:items-center sm:px-4 sm:text-sm">
                        <span className="mt-1 inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500 sm:mt-0" />
                        <span className="min-w-0">
                            Connection lost. Reconnecting; data may be outdated.
                        </span>
                    </div>
                )}
                <main className="flex-1 p-2.5 sm:p-3 md:p-4 lg:p-5">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
