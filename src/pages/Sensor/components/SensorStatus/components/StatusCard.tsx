import type { ReactNode } from "react";

interface StatusCardProps {
    icon: ReactNode;
    title: string;
    children: ReactNode;
    className?: string;
}

export const StatusText = ({ text }: { text: string }) => {
    return <p className="break-words text-sm font-semibold sm:text-base">{text}</p>;
};

export default function StatusCard({
    icon,
    title,
    children,
    className,
}: StatusCardProps) {
    return (
        <div
            className={`flex h-full min-w-0 flex-col justify-center gap-2 rounded-lg border-l-4 px-4 py-4 ${className ? className : "bg-gray-50"}`}
        >
            <div className="flex min-w-0 items-center gap-3">
                {icon}
                <p className="min-w-0 text-sm font-medium text-gray-500">
                    {title}
                </p>
            </div>
            <div className="pl-11">{children}</div>
        </div>
    );
}
