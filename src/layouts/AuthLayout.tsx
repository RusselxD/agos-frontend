import DesktopLoginFrame from "../components/DesktopLoginFrame";
import { Outlet } from "react-router-dom";
import SmallScreenLoginFrame from "../components/SmallScreenLoginFrame";
import type { JSX } from "react";

export default function AuthLayout(): JSX.Element {
    return (
        <div className="flex flex-col min-h-[100dvh] min-w-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 transition-colors duration-300">
            {/* For small screens */}
            <SmallScreenLoginFrame />
            <div className="flex-1 flex px-2 sm:px-7 md:px-24 lg:hidden">
                <Outlet />
            </div>

            {/* For large screens */}
            <DesktopLoginFrame />
            <div className="hidden lg:flex fixed h-full right-0 bg-white dark:bg-slate-900 rounded-l-3xl z-20 lg:w-2/4 xl:w-2/5 flex-1 flex-col items-center justify-center px-5 lg:px-3 xl:px-10">
                <Outlet />
            </div>
        </div>
    );
}
