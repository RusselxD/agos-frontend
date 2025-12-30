import React from "react";
import DesktopLoginFrame from "../components/DesktopLoginFrame";
import { Outlet } from "react-router-dom";
import SmallScreenLoginFrame from "../components/SmallScreenLoginFrame";

export default function AuthLayout(): React.JSX.Element {
    return (
        <div className="flex min-h-screen min-w-screen bg-white relative">
            <DesktopLoginFrame />
            <SmallScreenLoginFrame />
            <div className="w-full z-20 lg:w-fit flex-1 flex flex-col items-center justify-center px-5 lg:px-5 xl:px-16 -mt-8">
                <img
                    src="/agos.svg"
                    alt="AGOS Logo"
                    className="w-16 h-16 object-cover mb-5"
                />
                <Outlet />
            </div>
        </div>
    );
}
