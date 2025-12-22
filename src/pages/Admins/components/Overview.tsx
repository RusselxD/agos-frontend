import type { AdminUserResponse } from "../../../types/user";
import { useAdmins } from "../context/AdminsPageContext";
import "../style.css";
import { Star } from "lucide-react";

const getSuperAdminName = (admins: AdminUserResponse[]): string => {
    const super_admin = admins.find((a) => a.is_superuser);
    return `${super_admin?.first_name} ${super_admin?.last_name}`;
};

const getAdminCount = (admins: AdminUserResponse[]): string => {
    if (admins.length === 0) return "None";
    return admins.length.toString().padStart(2, "0");
};

export default function Overview() {
    const { admins } = useAdmins();

    return (
        <div className="gradient-bg rounded-xl py-7 px-8 text-white relative">
            <p className="text-gray-200 font-semibold mb-3 text-sm">OVERVIEW</p>

            <p className="font-bold text-6xl">
                {getAdminCount(admins.filter((a) => a.is_active))}
            </p>
            <p className="text-sm text-gray-200 font-light">
                Active System Admins
            </p>

            <div className="shadow-bottom flex py-3 pl-4 pr-24 items-center gap-3 my-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                <div className="bg-amber-400 flex items-center justify-center p-2.5 rounded-lg">
                    <Star fill="#FFFFFF" size={20} />
                </div>
                <div className="flex flex-col text-sm">
                    <p className="font-thin text-gray-100 text-xs">
                        Super Admin
                    </p>
                    <p className="font-semibold">{getSuperAdminName(admins)}</p>
                </div>
            </div>

            <div className="text-sm">
                <p className="text-gray-100">Regular Admin</p>
                <p className="font-medium">
                    {getAdminCount(
                        admins.filter((a) => !a.is_superuser && a.is_active)
                    )}
                </p>
            </div>

            <Star className="absolute bottom-16 text-gray-100/15 rotate-45 right-10 w-48 h-48"/>
        </div>
    );
}
