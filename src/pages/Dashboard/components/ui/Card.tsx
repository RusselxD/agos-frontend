import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

const CardHeaderText = ({ label }: { label: string }) => {
    return <p className="text-sm text-gray-500 font-semibold">{label}</p>;
};

export default function Card({ children, className }: CardProps) {
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

export { CardHeaderText };
