import { type LucideIcon } from "lucide-react";

interface EmptyListProps {
    icon: LucideIcon;
    title: string;
}

export default function EmptyList({ icon: Icon, title }: EmptyListProps) {
    return (
        <div className="w-full flex flex-col items-center justify-center py-12 text-gray-600">
            <Icon className="w-10 h-10" />
            <p className="mt-3">{title}</p>
        </div>
    );
}
