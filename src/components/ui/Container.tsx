import type { ReactNode } from "react";
import ContainerHeader from "./ContainerHeader";

interface ContainerProps {
    children: ReactNode;
    headerTitle: string;
    className?: string;
}

export default function Container({
    headerTitle,
    className,
    children,
}: ContainerProps) {
    return (
        <div className={`bg-white custom-shadow rounded-md p-5 ${className}`}>
            <ContainerHeader title={headerTitle} />
            {children}
        </div>
    );
}
