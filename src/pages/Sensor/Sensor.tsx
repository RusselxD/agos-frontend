import SensorStatus from "./components/SensorStatus";
import SensorReadings from "./components/SensorReadings";
import { useEffect } from "react";
import WaterLevelTrendContainer from "./components/WaterLevelTrend";

export default function Sensor() {
    useEffect(() => {
        document.title = "Sensor - AGOS";

        return () => {
            document.title = "AGOS";
        };
    }, []);

    return (
        <div className="flex min-w-0 flex-col gap-2">
            <WaterLevelTrendContainer />
            <div className="flex min-w-0 flex-col gap-2 xl:h-[30rem] xl:flex-row">
                <SensorReadings />
                <SensorStatus />
            </div>
        </div>
    );
}
