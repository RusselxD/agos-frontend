import { useEffect } from "react";
import { ReadingLogsProvider } from "./context/ReadingLogsContext";
import {
    SummaryCardsContainer,
    ChartsContainer,
    DataTableContainer,
} from "./components";

function ReadingLogsContent() {
    return (
        <div className="flex flex-col gap-2 min-w-0">
            <SummaryCardsContainer />
            <ChartsContainer />
            <DataTableContainer />
        </div>
    );
}

export default function ReadingLogs() {
    useEffect(() => {
        document.title = "Daily Analysis - AGOS";
        return () => {
            document.title = "AGOS";
        };
    }, []);

    return (
        <ReadingLogsProvider>
            <ReadingLogsContent />
        </ReadingLogsProvider>
    );
}
