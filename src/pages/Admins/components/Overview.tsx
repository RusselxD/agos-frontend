import type { AdminUserResponse } from "../../../types/adminUser";
import { useAdmins } from "../context/AdminsPageContext";
import "../style.css";
import { Star, ShieldCheck, Users } from "lucide-react";

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

    const activeAdmins = admins.filter((a) => a.is_enabled);
    const regularAdmins = admins.filter((a) => !a.is_superuser && a.is_enabled);
    const superAdminName = getSuperAdminName(admins);

    return (
        <>
            <div className="gradient-bg relative flex min-h-[13rem] flex-col overflow-hidden rounded-xl p-5 text-white sm:hidden">
                <div className="relative z-10 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                            Overview
                        </p>
                        <div className="mt-4 flex items-end gap-3">
                            <p className="text-5xl font-bold leading-none">
                                {getAdminCount(activeAdmins)}
                            </p>
                            <p className="pb-1 text-sm text-white/75">
                                active admins
                            </p>
                        </div>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-3">
                        <Users className="h-6 w-6" />
                    </div>
                </div>

                <div className="relative z-10 mt-5 rounded-xl border border-white/20 bg-white/10 p-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400">
                            <Star fill="#FFFFFF" size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-white/70">Super Admin</p>
                            <p className="truncate text-sm font-semibold">
                                {superAdminName}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-3 flex items-center gap-2 text-sm">
                    <ShieldCheck className="h-4 w-4 text-white/70" />
                    <span className="text-white/75">Regular admins:</span>
                    <span className="font-semibold">
                        {getAdminCount(regularAdmins)}
                    </span>
                </div>

                <Star className="absolute -bottom-8 -right-6 h-36 w-36 rotate-45 text-white/10" />
            </div>

            <div className="gradient-bg relative hidden min-h-[17rem] flex-col justify-center overflow-hidden rounded-xl px-5 py-6 text-white sm:flex sm:px-8 lg:h-full">
                <p className="mb-3 text-sm font-semibold text-gray-200">
                    OVERVIEW
                </p>

                <p className="text-5xl font-bold sm:text-6xl">
                    {getAdminCount(activeAdmins)}
                </p>
                <p className="text-sm font-light text-gray-200">
                    Active System Admins
                </p>

                <div className="shadow-bottom my-4 flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 py-3 pl-4 pr-4 backdrop-blur-md sm:pr-12 lg:pr-16">
                    <div className="flex items-center justify-center rounded-lg bg-amber-400 p-2.5">
                        <Star fill="#FFFFFF" size={20} />
                    </div>
                    <div className="flex min-w-0 flex-col text-sm">
                        <p className="text-xs font-thin text-gray-100">
                            Super Admin
                        </p>
                        <p className="truncate font-semibold">{superAdminName}</p>
                    </div>
                </div>

                <div className="text-sm">
                    <p className="text-gray-100">Regular Admin</p>
                    <p className="font-medium">
                        {getAdminCount(regularAdmins)}
                    </p>
                </div>

                <Star className="absolute bottom-10 right-4 h-36 w-36 rotate-45 text-gray-100/15 sm:right-10 sm:h-48 sm:w-48" />
            </div>
        </>
    );
}
