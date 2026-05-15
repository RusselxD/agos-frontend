import type { ReactNode } from "react";

interface StatusCardProps {
    icon: ReactNode;
    title: string;
    children: ReactNode;
    className?: string;
}

export const StatusText = ({ text }: { text: string }) => {
    return <p className="font-semibold ml-12 text-neutral dark:text-slate-200">{text}</p>;
};

export default function StatusCard({
    icon,
    title,
    children,
    className,
}: StatusCardProps) {
    return (
        <div
            className={`border-l-4 rounded-lg px-4 py-4 h-full flex flex-col gap-1 transition-colors ${className ? className : "bg-gray-50 dark:bg-slate-700/30 dark:border-slate-600"}`}
        >
            <div className="flex items-center gap-4">
                {icon}
                <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">{title}</p>
            </div>
            {children}
        </div>
    );
}
