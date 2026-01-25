import { useEffect } from "react";

export default function AlertLogs() {
    useEffect(() => {
        document.title = "Alert Logs - AGOS";

        return () => {
            document.title = "AGOS";
        };
    }, []);

    return <div>AlertLogs</div>;
}
