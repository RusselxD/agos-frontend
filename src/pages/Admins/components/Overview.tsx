import type { AdminUserResponse } from "../../../types/adminUser";
import { useAdmins } from "../context/AdminsPageContext";
import "../style.css";
import { Star } from "lucide-react";

const getSuperAdminName = (admins: AdminUserResponse[]): string => {
    const super_admin = admins.find((a) => a.is_superuser);
    if (!super_admin) return "No Super Admin";
    return `${super_admin.first_name} ${super_admin.last_name}`;
};

const getAdminCount = (admins: AdminUserResponse[]): string => {
    if (admins.length === 0) return "None";
    return admins.length.toString().padStart(2, "0");
};

export default function Overview() {
    const { admins, isFetchingAdmins } = useAdmins();

    if (isFetchingAdmins) {
        return <div className="skeleton min-h-[17rem] rounded-xl lg:h-full"></div>;
    }
    
    if (admins.length === 0) {
        return <div className="min-h-[17rem] rounded-xl border border-red-400 bg-red-50 lg:h-full"></div>;
    }

    return (
        <div className="gradient-bg relative flex min-h-[17rem] flex-col justify-center overflow-hidden rounded-xl px-5 py-6 text-white sm:px-8 lg:h-full">
            <p className="text-gray-200 font-semibold mb-3 text-sm">OVERVIEW</p>

            <p className="text-5xl font-bold sm:text-6xl">
                {getAdminCount(admins.filter((a) => a.is_enabled))}
            </p>
            <p className="text-sm text-gray-200 font-light">
                Active System Admins
            </p>

            <div className="shadow-bottom my-4 flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 py-3 pl-4 pr-4 backdrop-blur-md sm:pr-12 lg:pr-16">
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
                        admins.filter((a) => !a.is_superuser && a.is_enabled)
                    )}
                </p>
            </div>

            <Star className="absolute bottom-10 right-4 h-36 w-36 rotate-45 text-gray-100/15 sm:right-10 sm:h-48 sm:w-48" />
        </div>
    );
}
