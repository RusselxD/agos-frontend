import { useEffect } from "react";
import DataRetention from "./components/DataRetention";
import AutoSendCriticalSMSToggle from "./components/AutoSendCriticalSMSToggle";

export default function Settings() {
    useEffect(() => {
        document.title = "Settings - AGOS";

        return () => {
            document.title = "AGOS";
        };
    }, []);

    return (
        <div className="space-y-4">
            <DataRetention />
            <AutoSendCriticalSMSToggle />
        </div>
    );
}
