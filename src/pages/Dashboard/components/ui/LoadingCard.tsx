import Card from "./Card";
import {CardHeaderText} from "./Card";

type LoadingCardProps = {
    label: string;
    desc: string;
    className?: string;
};

export default function LoadingCard({
    label,
    desc,
    className,
}: LoadingCardProps) {
    return (
        <Card className="animate-pulse bg-white dark:bg-slate-800 [animation-duration:1500ms]">
            <CardHeaderText label={`WEATHER ${label}`} />
            <div
                className={`flex flex-col items-center justify-center gap-2 mb-8 ${className}`}
            >
                <div className="spinner"></div>
                <p className="text-gray-400 dark:text-slate-500 text-sm">{desc}</p>
            </div>
        </Card>
    );
}
