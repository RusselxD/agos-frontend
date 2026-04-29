import { useAdmins } from "../context/AdminsPageContext";
import { UserPlus, X } from "lucide-react";

export default function AddNewAdminButton() {
    const { createNewAdminIsOpen, setCreateNewAdminIsOpen } = useAdmins();

    return (
        <button
            onClick={() => setCreateNewAdminIsOpen((prev) => !prev)}
            className={`btn-custom w-full text-sm text-white sm:w-auto ${
                createNewAdminIsOpen
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-primary hover:bg-primary/90"
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
