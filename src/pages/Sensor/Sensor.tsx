import SensorStatus from "./components/SensorStatus";
import SensorConfiguration from "./components/SensorConfiguration";
import { SensorConfigurationProvider } from "./context/CalibrationCardContext";
import SensorReadings from "./components/SensorReadings";

export default function Sensor() {
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
