import { EllipsisVertical, Star } from "lucide-react";
import type { AdminUserResponse } from "../../../types/user";
import "../style.css";
import type { ReactNode } from "react";
import { getTimeAgo } from "../../../lib/utils/formatter";

const AccountStatusBade = ({ isActive }: { isActive: boolean }) => {
    if (isActive) {
        return (
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <p className="text-green-600 text-sm">Active</p>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-400"></div>
            <p className="text-gray-400">Inactive</p>
        </div>
    );
};

const Header = ({ user }: { user: AdminUserResponse }) => {
    return (
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold">{`${user.first_name} ${user.last_name}`}</p>
                <AccountStatusBade isActive={user.is_active} />
            </div>
            <div className="rounded-xl p-1 cursor-pointer hover:bg-gray-100 flex items-center justify-center">
                <EllipsisVertical size={20} />
            </div>
        </div>
    );
};

interface DetailsProps {
    label: string;
    value?: string;
    customValue?: ReactNode;
}

const Details = ({ label, value, customValue }: DetailsProps) => {
    return (
        <div className="flex flex-col">
            <p className="text-gray-500 text-sm">{label}</p>
            {customValue ? (
                customValue
            ) : (
                <p className="font-medium text-sm">{value}</p>
            )}
        </div>
    );
};

const SuperAdminText = () => {
    return (
        <p className="text-amber-500 flex m-0 items-center gap-1 font-semibold">
            <Star fill="currentColor" size={15}/>
            <span>Super Admin</span>
        </p>
    );
};

const AdminText = () => {
    return (
        <p className="text-blue-400 flex items-center gap-2 font-semibold">
            Administrator
        </p>
    );
};

export default function UserCard({ user }: { user: AdminUserResponse }) {
    return (
        <div
            className={`bg-white w-full h-fit p-6 rounded-lg border-b-4 border-emerald-500`}
        >
            <Header user={user} />
            <div className="grid grid-cols-2 gap-5 mt-3 py-5 px-4 border border-gray-300 rounded-lg">
                <Details label="Phone Number" value={user.phone_number} />
                <Details
                    label="Role"
                    customValue={
                        user.is_superuser ? <SuperAdminText /> : <AdminText />
                    }
                />
                <Details
                    label="Last Login"
                    value={
                        user.last_login ? getTimeAgo(user.last_login) : "N/A"
                    }
                />
                <Details
                    label="Registered By"
                    value={user.created_by ?? "System"}
                />
            </div>
        </div>
    );
}
