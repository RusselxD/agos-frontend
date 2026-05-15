import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

interface CardProps {
    warning?: string | null;
    children: ReactNode;
    className?: string;
}

export const CardHeaderText = ({ label }: { label: string }) => {
    return <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-semibold">{label}</p>;
};

export const ErrorCard = ({ message }: { message: string }) => {
    return (
        <div className="shadow-md shadow-red-200 dark:shadow-none border rounded-xl p-3 md:p-4 flex gap-2 bg-red-50 dark:bg-red-900/10 border-red-400 dark:border-red-800/50">
            <CircleAlert className="w-6 h-6 text-red-500 dark:text-red-400 mt-0.5" />
            <div className="space-y-1">
                <p className="font-medium text-red-800 dark:text-red-400">Error Loading Data</p>
                <p className="text-red-500 dark:text-red-400">{message}</p>
            </div>
        </div>
    );
};

export default function Card({ children, className, warning }: CardProps) {
    return (
        <div
            className={`custom-shadow border border-gray-300 dark:border-slate-700 rounded-xl p-3 md:p-4 flex flex-col justify-between text-slate-900 dark:text-slate-200 ${warning ? "!border-amber-400 dark:!border-amber-700/50 !bg-amber-50 dark:!bg-amber-900/20 group relative" : ""} ${
                className || "bg-white dark:bg-slate-800"
            }`}
        >
            {warning && (
                <div className="absolute transition-all duration-300 hidden group-hover:block bottom-full mb-1 left-0 bg-amber-100 dark:bg-amber-900/50 border border-amber-400 dark:border-amber-700 text-sm text-amber-800 dark:text-amber-300 px-3 py-2 rounded-t-lg">
                    {warning}
                </div>
            )}

            {children}
        </div>
    );
}
