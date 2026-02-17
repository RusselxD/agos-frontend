import { useEffect } from "react";
import {
    ReadingLogsProvider,
    useReadingLogs,
} from "./context/ReadingLogsContext";
import {
    SummaryCardsContainer,
    ChartsContainer,
    DataTableContainer,
} from "./components";
import Header from "./components/Header";
import AnalyzePanel from "./components/Analyze/AnalyzePanel";

function ReadingLogsContent() {
    const { analyzeDrawerIsOpen } = useReadingLogs();

    return (
        <div className="">
            <div className="flex flex-col gap-2 ">
                <Header />
                <SummaryCardsContainer />
                <ChartsContainer />
                <DataTableContainer />
            </div>

            {analyzeDrawerIsOpen && <AnalyzePanel />}
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
