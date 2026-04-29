import type { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    headerTitle?: string;
    className?: string;
}

const ContainerHeader = ({ title }: { title: string }) => {
    return (
        <h2 className="mb-2 w-full border-l-4 border-primary pl-2 text-sm font-semibold text-gray-600 md:mb-3 md:text-base">
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
        <section className={`custom-shadow min-w-0 rounded-xl bg-white p-3 md:p-5 ${className ?? ""}`}>
            {headerTitle && <ContainerHeader title={headerTitle} />}
            {children}
        </section>
    );
}
