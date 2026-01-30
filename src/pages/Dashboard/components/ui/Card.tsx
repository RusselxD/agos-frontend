import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

interface CardProps {
    warning?: string | null;
    children: ReactNode;
    className?: string;
}

export const CardHeaderText = ({ label }: { label: string }) => {
    return <p className="text-sm text-gray-500 font-semibold">{label}</p>;
};

export const ErrorCard = ({ message }: { message: string }) => {
    return (
        <div className="shadow-md shadow-red-200 border rounded-xl p-4 flex gap-2 bg-red-50 border-red-400">
            <CircleAlert className="w-6 h-6 text-red-500 mt-0.5" />
            <div className="space-y-1">
                <p className="font-medium text-red-800">Error Loading Data</p>
                <p className="text-red-500">{message}</p>
            </div>
        </div>
    );
};

export default function Card({ children, className, warning }: CardProps) {
    return (
        <div
            className={`custom-shadow border border-gray-300 rounded-xl p-4 flex flex-col justify-between ${warning ? "!border-amber-400 !bg-amber-50 group relative" : ""} ${
                className || "bg-white"
            }`}
        >
            {warning && (
                <div className="absolute transition-all duration-300 hidden group-hover:block bottom-full mb-1 left-0 bg-amber-100 border border-amber-400 text-sm text-amber-800 px-3 py-2 rounded-t-lg">
                    {warning}
                </div>
            )}

            {children}
        </div>
    );
}
