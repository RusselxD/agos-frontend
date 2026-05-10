import { useAdmins } from "../context/AdminsPageContext";
import UserCard from "./UserCard";
import EmptyList from "../../../components/common/EmptyList";
import { SearchX } from "lucide-react";

export default function UserCardsContainer() {
    const { filteredAdmins, refetchAdmins, searchQuery } = useAdmins();

    if (filteredAdmins.length === 0) {
        const emptyTitle = searchQuery ? `No admins found matching "${searchQuery}"` : "No admins available.";
        return (
            <div className="flex-1 bg-white custom-shadow rounded-lg flex items-center justify-center h-full">
                <EmptyList icon={SearchX} title={emptyTitle} />
            </div>
        );
    }

    return (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredAdmins.map((user) => {
                return <UserCard user={user} key={user.id} onStatusChange={refetchAdmins} />;
            })}
        </div>
    );
}
