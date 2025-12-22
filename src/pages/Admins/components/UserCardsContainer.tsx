import { useAdmins } from "../context/AdminsPageContext";
import UserCard from "./UserCard";

export default function UserCardsContainer() {
    const { admins } = useAdmins();

    return (
        <div className="flex-1 grid grid-cols-2 gap-3">
            {admins.map((user) => {
                return <UserCard user={user} key={user.id} />;
            })}
        </div>
    );
}
