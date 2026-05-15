import Card from "../../ui/Card";
import { CardHeaderText } from "../../ui/Card";

export default function WaterLevelStatusCardSkeleton({ className }: { className?: string }) {
    return (
        <Card className={`bg-white dark:bg-slate-800 ${className || ""}`}>
            <CardHeaderText label="WATER LEVEL STATUS" />
            <div className="flex flex-1">
                {/* Main Display */}
                <div className="flex-1 flex items-center gap-2">
                    <div className="skeleton h-36 w-12 rounded-full"></div>
                    <div className="flex flex-col gap-1">
                        <div className="skeleton w-24 rounded-md h-10"></div>
                        <div className="skeleton w-20 rounded-md h-7"></div>
                        <div className="skeleton w-16 rounded-md h-5"></div>
                    </div>
                </div>

                {/* Metric Cards */}
                <div className="flex-1 flex flex-col gap-2">
                    <div className="h-full w-full skeleton rounded-md"></div>
                    <div className="h-full w-full skeleton rounded-md"></div>
                </div>
            </div>
        </Card>
    );
}
