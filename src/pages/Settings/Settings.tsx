import { useEffect } from "react";
import DataRetention from "./components/DataRetention";

export default function Settings() {
    useEffect(() => {
        document.title = "Settings - AGOS";

        return () => {
            document.title = "AGOS";
        };
    }, []);

    return (
        <div>
            <DataRetention />
        </div>
    );
}
