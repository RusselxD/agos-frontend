import Card from "../../ui/Card";
import { CardHeaderText } from "../../ui/Card";

export default function WeatherConditionCardSkeleton() {
    return (
        <Card>
            <CardHeaderText label="WEATHER CONDITION" />
            <div className="flex gap-2 ">
                <div className="skeleton w-10 h-10 rounded-full"></div>
                <div className="flex flex-col flex-1 gap-1 ">
                    <div className="skeleton rounded-md h-8 w-2/3"></div>
                    <div className="skeleton rounded-md h-4 w-1/3"></div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="skeleton rounded-md w-full h-14"></div>
                <div className="skeleton rounded-md w-full h-14"></div>
            </div>
        </Card>
    );
}
