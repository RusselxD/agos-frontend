import { useAdmins } from "../context/AdminsPageContext";
import UserCard from "./UserCard";

export default function UserCardsContainer() {
    const { admins, refetchAdmins } = useAdmins();

    return (
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {admins.map((user) => {
                return <UserCard user={user} key={user.id} onStatusChange={refetchAdmins} />;
            })}
        </div>
    );
}
