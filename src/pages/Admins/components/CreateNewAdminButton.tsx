import { UserPlus } from "lucide-react";

export default function CreateNewAdminButton() {
    return (
        <button className="flex items-center gap-2 rounded-md bg-primary text-sm text-white px-4 py-2">
            <UserPlus/>
            <span>New Admin</span>
        </button>
    );
}
