import type { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    headerTitle?: string;
    className?: string;
}

const ContainerHeader = ({ title }: { title: string }) => {
    return (
        <h2 className="pl-2 border-l-4 font-semibold text-sm md:text-base text-gray-600 border-primary w-full mb-2 md:mb-3">
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
        <div className={`bg-white custom-shadow rounded-xl p-3 md:p-5 ${className}`}>
            {headerTitle && <ContainerHeader title={headerTitle} />}
            {children}
        </div>
    );
}
