import React from "react";
import DesktopLoginFrame from "../components/DesktopLoginFrame";
import { Outlet } from "react-router-dom";

export default function AuthLayout(): React.JSX.Element {
    return (
        <div className="flex min-h-screen min-w-screen bg-white">
            <DesktopLoginFrame />
            <Outlet />
        </div>
    );
}
