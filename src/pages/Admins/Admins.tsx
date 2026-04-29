import LogsContainer from "./components/LogsContainer";
import Overview from "./components/Overview";

import UserCardsContainer from "./components/UserCardsContainer";
import { useAuth } from "../../context/AuthContext";
import AddNewAdminButton from "./components/AddNewAdminButton";
import AddNewAdmin from "./components/AddNewAdmin";
import SearchBar from "../../components/common/SearchBar";
import { useEffect } from "react";

export default function Admins() {
    const { user } = useAuth();

    useEffect(() => {
        document.title = "Admins - AGOS";

        return () => {
            document.title = "AGOS";
        };
    }, []);

    return (
        <div className="flex h-full min-w-0 flex-col gap-3">
            {/* Top Part (Overview and Logs) */}
            <div className="grid w-full grid-cols-1 gap-3 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)]">
                <Overview />
                <LogsContainer />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                {/* Search Bar and New Admin Button */}
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <SearchBar placeholder="Search Admins..." />
                    {user?.is_superuser && <AddNewAdminButton />}
                </div>

                {user?.is_superuser && <AddNewAdmin />}
                <UserCardsContainer />
            </div>
        </div>
    );
}
