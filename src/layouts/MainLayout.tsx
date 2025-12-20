import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout(): React.JSX.Element {
    return (
        <div className="h-full">
            <Sidebar />
            <div className="flex-1 ml-56 px-5 pt-5 h-full">
                <Outlet />
            </div>
        </div>
    );
}
