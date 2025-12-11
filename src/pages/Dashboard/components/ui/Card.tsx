import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export default function Card({
    children,
    className,
}: CardProps): React.JSX.Element {
    return (
        <div
            className={`custom-shadow border border-gray-300 rounded-md p-4 flex flex-col justify-between ${
                className || "bg-white"
            }`}
        >
            {children}
        </div>
    );
}
