import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout(): React.JSX.Element {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen flex bg-background">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
            />
            <div className={`flex-1 p-5 transition-all duration-200 ${isSidebarCollapsed ? "ml-20" : "ml-56"}`}>
                <Outlet />
            </div>
        </div>
    );
}
