import type { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    headerTitle: string;
    className?: string;
}

const ContainerHeader = ({ title }: { title: string }) => {
    return (
        <h2 className="pl-2 border-l-4 font-semibold text-gray-600 border-primary w-full mb-3">
            {title}
        </h2>
    );
};

export default function Container({
    headerTitle,
    className,
    children,
}: ContainerProps) {
    return (
        <div className={`bg-white custom-shadow rounded-lg p-5 ${className}`}>
            <ContainerHeader title={headerTitle} />
            {children}
        </div>
    );
}
