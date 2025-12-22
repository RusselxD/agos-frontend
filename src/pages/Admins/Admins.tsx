import LogsContainer from "./components/LogsContainer";
import Overview from "./components/Overview";
import SearchBar from "./components/SearchBar";
import UserCardsContainer from "./components/UserCardsContainer";
import { AdminsPageProvider } from "./context/AdminsPageContext";

export default function Admins() {
    return (
        <AdminsPageProvider>
            <div className="flex h-full relative">
                <div className="w-full mr-[26.5rem] flex flex-col gap-2">
                    <SearchBar />
                    <UserCardsContainer />
                    <LogsContainer />
                </div>
                <div className="w-[26rem] fixed right-5 top-5 bottom-5 bg-white p-5 rounded-lg">
                    <Overview />
                </div>
            </div>
        </AdminsPageProvider>
    );
}
