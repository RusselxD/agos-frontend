import SensorStatus from "./components/SensorStatus/SensorStatus";
import SensorConfiguration from "./components/SensorConfiguration";
import { SensorConfigurationProvider } from "./context/CalibrationCardContext";
import SensorReadings from "./components/SensorReadings";
import { useEffect } from "react";

export default function Sensor() {
    useEffect(() => {
        document.title = "Sensor - AGOS";

        return () => {
            document.title = "AGOS";
        };
    }, []);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 h-[30rem]">
                <SensorReadings />
                <SensorStatus />
            </div>
            <SensorConfigurationProvider>
                <SensorConfiguration />
            </SensorConfigurationProvider>
        </div>
    );
}
