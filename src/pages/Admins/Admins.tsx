import CreateNewAdminButton from "./components/CreateNewAdminButton";
import SearchBar from "./components/SearchBar";

export default function Admins() {
    return (
        <div>
            <div className="flex items-center justify-between">
                <SearchBar />
                <CreateNewAdminButton />
            </div>
        </div>
    );
}
