import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout(): React.JSX.Element {
    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1 ml-56 p-5 bg-background">
                <Outlet />
            </div>
        </div>
    );
}
