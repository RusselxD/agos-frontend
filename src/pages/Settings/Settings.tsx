import { useEffect } from "react";
import DataRetention from "./components/DataRetention";
import AutoSendCriticalSMSToggle from "./components/AutoSendCriticalSMSToggle";
import SensorConfiguration from "./components/SensorConfiguration/SensorConfiguration";
import { SensorConfigurationProvider } from "./components/SensorConfiguration/CalibrationCardContext";

export default function Settings() {
    useEffect(() => {
        document.title = "Settings - AGOS";

        return () => {
            document.title = "AGOS";
        };
    }, []);

    return (
        <div className="space-y-2">
            <DataRetention />
            <AutoSendCriticalSMSToggle />

            <SensorConfigurationProvider>
                <SensorConfiguration />
            </SensorConfigurationProvider>
        </div>
    );
}
