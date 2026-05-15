import { useAdmins } from "../context/AdminsPageContext";
import { UserPlus, X } from "lucide-react";

export default function AddNewAdminButton() {
    const { createNewAdminIsOpen, setCreateNewAdminIsOpen } = useAdmins();

    return (
        <button
            onClick={() => setCreateNewAdminIsOpen((prev) => !prev)}
            className={`btn-custom text-sm text-white transition-colors ${
                createNewAdminIsOpen
                    ? "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    : "bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700"
            }`}
        >
            {createNewAdminIsOpen ? (
                <>
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                </>
            ) : (
                <>
                    <UserPlus className="w-5 h-5" />
                    <span>New Admin</span>
                </>
            )}
        </button>
    );
}
