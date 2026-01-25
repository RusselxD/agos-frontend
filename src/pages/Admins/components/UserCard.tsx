import { EllipsisVertical, Star } from "lucide-react";
import type { AdminUserResponse } from "../../../types/adminUser";
import "../style.css";
import type { ReactNode } from "react";
import { formatPHNumber, getTimeAgo } from "../../../lib/utils/formatter";

const AccountStatusBadge = ({ isEnabled }: { isEnabled: boolean }) => {
    return (
        <div className="flex items-center gap-2 text-sm mt-0.5">
            <span className="text-gray-600">Status:</span>
            <span
                className={`font-semibold ${
                    isEnabled ? "text-green-600" : "text-gray-400"
                }`}
            >
                {isEnabled ? "Enabled" : "Deactivated"}
            </span>
        </div>
    );
};

const Header = ({ user }: { user: AdminUserResponse }) => {
    return (
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold">{`${user.first_name} ${user.last_name}`}</p>
                <AccountStatusBadge isEnabled={user.is_enabled} />
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
            <p className="text-gray-500 text-xs">{label}</p>
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
            <Star fill="currentColor" size={15} />
            <span>Super Admin</span>
        </p>
    );
};

const AdminText = () => {
    return <p className="text-blue-400 font-semibold">Administrator</p>;
};

export default function UserCard({ user }: { user: AdminUserResponse }) {
    return (
        <div
            className={`bg-white w-full h-fit p-5 rounded-lg border-b-4 ${
                user.is_enabled ? "border-green-500" : "border-gray-300"
            }`}
        >
            <Header user={user} />
            <div className="grid grid-cols-2 gap-5 mt-3 py-4 px-4 border border-gray-300 rounded-lg relative text-sm">
                <Details
                    label="Phone Number"
                    value={formatPHNumber(user.phone_number)}
                />

                <Details
                    label="Registered By"
                    value={user.created_by ?? "System"}
                />
                <Details
                    label="Last Login"
                    value={
                        user.last_login ? getTimeAgo(user.last_login) : "N/A"
                    }
                />

                <Details
                    label="Role"
                    customValue={
                        user.is_superuser ? <SuperAdminText /> : <AdminText />
                    }
                />
            </div>
        </div>
    );
}
