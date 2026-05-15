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
            className={`border-l-4 rounded-2xl px-5 py-5 h-full flex flex-col gap-2 backdrop-blur-md shadow-lg transition-all duration-300 ${className ? className : "bg-white/40 dark:bg-white/[0.02] dark:border-white/10"}`}
        >
            <div className="flex items-center gap-4">
                {icon}
                <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">{title}</p>
            </div>
            {children}
        </div>
    );
}
