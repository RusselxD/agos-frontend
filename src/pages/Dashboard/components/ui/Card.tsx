import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

interface CardProps {
    warning?: string | null;
    children: ReactNode;
    className?: string;
}

export const CardHeaderText = ({ label }: { label: string }) => {
    return <p className="text-[0.65rem] md:text-xs tracking-widest uppercase text-slate-500 dark:text-slate-400 font-bold mb-2 md:mb-3 block">{label}</p>;
};

export const ErrorCard = ({ message }: { message: string }) => {
    return (
        <div className="shadow-lg shadow-red-200 dark:shadow-none border rounded-xl p-4 flex gap-3 bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-800/50 backdrop-blur-md">
            <CircleAlert className="w-6 h-6 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
                <p className="font-bold text-red-800 dark:text-red-400">Error Loading Data</p>
                <p className="text-sm text-red-600 dark:text-red-300">{message}</p>
            </div>
        </div>
    );
};

export default function Card({ children, className, warning }: CardProps) {
    return (
        <div
            className={`relative overflow-hidden bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-4 md:p-5 flex flex-col justify-between text-slate-900 dark:text-slate-200 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:dark:border-white/20 ${warning ? "!border-amber-400/50 dark:!border-amber-500/50 !bg-amber-50/80 dark:!bg-amber-900/30 group" : ""} ${
                className || ""
            }`}
        >
            {warning && (
                <div className="absolute transition-all duration-300 hidden group-hover:block bottom-full mb-1 left-0 bg-amber-100 dark:bg-amber-900/80 border border-amber-400 dark:border-amber-600 shadow-xl backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-amber-800 dark:text-amber-200 px-3 py-2 rounded-t-lg z-20">
                    {warning}
                </div>
            )}
            {children}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent pointer-events-none !mt-0"></div>
        </div>
    );
}
