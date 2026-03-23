import { useAdmins } from "../context/AdminsPageContext";
import UserCard from "./UserCard";

export default function UserCardsContainer() {
    const { admins, refetchAdmins } = useAdmins();

    return (
        <div className="flex-1 grid grid-cols-3 gap-3">
            {admins.map((user) => {
                return <UserCard user={user} key={user.id} onStatusChange={refetchAdmins} />;
            })}
        </div>
    );
}
