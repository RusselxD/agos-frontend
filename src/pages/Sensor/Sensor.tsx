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
        <div className="flex flex-col gap-2 min-w-0">
            <WaterLevelTrendContainer />
            <div className="flex gap-2 h-[30rem]">
                <SensorReadings />
                <SensorStatus />
            </div>
        </div>
    );
}
