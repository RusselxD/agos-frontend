import type { ReactNode } from "react";
import AuthHeader from "./AuthHeader";

interface AuthFormContainerProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export default function AuthFormContainer({
    title,
    subtitle,
    children,
}: AuthFormContainerProps) {
    return (
        <div className="flex flex-col gap-14 w-full items-center justify-center">
            <AuthHeader title={title} subtitle={subtitle} />
            {children}
        </div>
    );
}
