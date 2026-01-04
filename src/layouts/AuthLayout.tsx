import React from "react";
import DesktopLoginFrame from "../components/DesktopLoginFrame";
import { Outlet } from "react-router-dom";
import SmallScreenLoginFrame from "../components/SmallScreenLoginFrame";

export default function AuthLayout(): React.JSX.Element {
    return (
        <div className="flex min-h-[100dvh] min-w-screen bg-gray-50 relative">
            <DesktopLoginFrame />
            <SmallScreenLoginFrame />
            <div className="w-full z-20 lg:w-fit flex-1 flex flex-col items-center justify-center px-5 lg:px-3 xl:px-10 -mt-8">
                <a href="/">
                    <img
                        src="/agos.svg"
                        alt="AGOS Logo"
                        className="w-16 h-16 object-cover mb-5"
                    />
                </a>
                <Outlet />
            </div>
        </div>
    );
}
