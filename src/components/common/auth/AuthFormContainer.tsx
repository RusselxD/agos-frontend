import type { ReactNode } from "react";
import AuthHeader from "./AuthHeader";

interface AuthFormContainerProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    className?: string;
}

export default function AuthFormContainer({
    title,
    subtitle,
    children,
    className,
}: AuthFormContainerProps) {
    return (
        <div
            className={`flex flex-col text-sm md:text-base gap-10 w-full items-center justify-center ${
                className ?? ""
            }`}
        >
            <AuthHeader title={title} subtitle={subtitle} />
            {children}
        </div>
    );
}
