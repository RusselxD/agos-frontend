import { useEffect } from "react";
import SearchBar from "../../components/common/SearchBar";
import FilterDropdown from "./components/FilterDropdown";
import { RespondersPageProvider } from "./context/RespondersPageContext";
import RespondersTable from "./components/RespondersTable";
import ResponderDetails from "./components/ResponderDetails";

export default function Responders() {
    useEffect(() => {
        document.title = "Responders - AGOS";

        return () => {
            document.title = "AGOS";
        };
    }, []);

    return (
        <RespondersPageProvider>
            <div className="flex h-full flex-col gap-3">
                {/* Top Part */}
                <div className="flex items-center justify-between">
                    <SearchBar placeholder="Search Responders..." />
                    <FilterDropdown />
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <RespondersTable />
                    <ResponderDetails />
                </div>
            </div>
        </RespondersPageProvider>
    );
}
