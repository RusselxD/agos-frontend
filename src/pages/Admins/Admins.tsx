import LogsContainer from "./components/LogsContainer";
import Overview from "./components/Overview";
import SearchBar from "./components/SearchBar";
import UserCardsContainer from "./components/UserCardsContainer";
import { useAuth } from "../../context/AuthContext";
import AddNewAdminButton from "./components/AddNewAdminButton";
import AddNewAdmin from "./components/AddNewAdmin";

export default function Admins() {
    const { user } = useAuth();

    return (
        <div className="flex h-full flex-col gap-3">
            {/* Top Part (Overview and Logs) */}
            <div className="flex h-[19rem] gap-3 w-full">
                <Overview />
                <LogsContainer />
            </div>

            <div className="flex flex-col flex-1">
                {/* Search Bar and New Admin Button */}
                <div className="flex items-center justify-between mb-3">
                    <SearchBar />
                    {user?.is_superuser && <AddNewAdminButton />}
                </div>

                {user?.is_superuser && <AddNewAdmin />}
                <UserCardsContainer />
            </div>
        </div>
    );
}
