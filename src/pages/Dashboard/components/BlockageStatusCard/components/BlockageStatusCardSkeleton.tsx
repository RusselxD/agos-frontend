import Card from "../../ui/Card";
import { CardHeaderText } from "../../ui/Card";

export default function BlockageStatusCardSkeleton() {
    return (
        <Card>
            <CardHeaderText label="CURRENT STATUS" />
            <div className="flex gap-2 items-center my-3">
                <div className="skeleton w-5 h-5 rounded-full"></div>
                <div className="skeleton rounded-md h-7 w-1/3"></div>
            </div>
            <div className="flex items-center gap-2 mb-3">
                <div className="skeleton rounded-md h-3 w-full"></div>
                <div className="skeleton rounded-md h-3 w-full"></div>
                <div className="skeleton rounded-md h-3 w-full"></div>
            </div>
            <div className="flex justify-between items-center">
                <div className="skeleton rounded-md h-3 w-10"></div>
                <div className="skeleton rounded-md h-3 w-10"></div>
            </div>
        </Card>
    );
}
