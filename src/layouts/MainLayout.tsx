import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout(): React.JSX.Element {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <div className="bg-background border flex-1 min-h-screen ml-56 px-5 py-4">
                <Outlet />
            </div>
        </div>
    );
}
