import { EllipsisVertical, Star, ShieldOff, ShieldCheck } from "lucide-react";
import type { AdminUserResponse } from "../../../types/adminUser";
import "../style.css";
import { type ReactNode, useState, useRef, useEffect } from "react";
import { formatPHNumber, getTimeAgo } from "../../../lib/utils/formatter";
import { useAuth } from "../../../context/AuthContext";
import { adminUsersAPI } from "../../../lib/api/adminUser";
import { useToast } from "../../../context/ToastContext";

const AccountStatusBadge = ({ isEnabled }: { isEnabled: boolean }) => {
    return (
        <div className="flex items-center gap-2 text-sm mt-0.5">
            <span className="text-gray-600 dark:text-slate-400">Status:</span>
            <span
                className={`font-semibold ${
                    isEnabled ? "text-green-600 dark:text-emerald-400" : "text-gray-400 dark:text-slate-500"
                }`}
            >
                {isEnabled ? "Enabled" : "Deactivated"}
            </span>
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
        <div className="flex flex-col min-w-0">
            <p className="text-gray-500 dark:text-slate-400 text-xs">{label}</p>
            {customValue ? (
                <div className="truncate">{customValue}</div>
            ) : (
                <p className="font-medium text-sm break-words">{value}</p>
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

export default function UserCard({
    user,
    onStatusChange,
}: {
    user: AdminUserResponse;
    onStatusChange?: () => void;
}) {
    const { user: currentUser } = useAuth();
    const { toastSuccess, toastError } = useToast();
    const isSuperuser = currentUser?.is_superuser ?? false;
    const isSelf = currentUser?.sub === user.id;

    const [menuOpen, setMenuOpen] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [showReactivateModal, setShowReactivateModal] = useState(false);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDeactivate = async () => {
        if (!reason.trim()) return;
        setIsSubmitting(true);
        try {
            await adminUsersAPI.deactivateAdmin(user.id, reason.trim());
            toastSuccess(`${user.first_name} ${user.last_name} has been deactivated.`);
            setShowDeactivateModal(false);
            setReason("");
            onStatusChange?.();
        } catch {
            toastError("Failed to deactivate admin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReactivate = async () => {
        setIsSubmitting(true);
        try {
            await adminUsersAPI.reactivateAdmin(user.id);
            toastSuccess(`${user.first_name} ${user.last_name} has been reactivated.`);
            setShowReactivateModal(false);
            onStatusChange?.();
        } catch {
            toastError("Failed to reactivate admin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div
                className={`w-full h-fit p-6 rounded-2xl border-b-4 bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:dark:border-white/20 ${
                    user.is_enabled ? "border-green-500 dark:border-emerald-500" : "border-gray-300 dark:border-slate-700"
                }`}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold">{`${user.first_name} ${user.last_name}`}</p>
                        <AccountStatusBadge isEnabled={user.is_enabled} />
                    </div>
                    {isSuperuser && !isSelf && (
                        <div className="relative" ref={menuRef}>
                            <div
                                className="rounded-xl p-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <EllipsisVertical size={20} />
                            </div>
                            {menuOpen && (
                                <div className="absolute right-0 top-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-lg z-10 min-w-[160px] animate-dropdown-in overflow-hidden">
                                    {user.is_enabled ? (
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                setShowDeactivateModal(true);
                                            }}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                                        >
                                            <ShieldOff size={16} />
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                setShowReactivateModal(true);
                                            }}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-green-600 dark:text-emerald-400 hover:bg-green-50 dark:hover:bg-emerald-900/10"
                                        >
                                            <ShieldCheck size={16} />
                                            Reactivate
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4 py-5 px-5 border border-white/50 dark:border-white/10 bg-white/40 dark:bg-white/[0.02] backdrop-blur-sm rounded-xl relative text-sm shadow-inner transition-all duration-300">
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

            {/* Deactivate Confirmation Modal */}
            {showDeactivateModal && (
                <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowDeactivateModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl border border-gray-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Deactivate Admin</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                            This will disable <span className="font-medium text-gray-900 dark:text-white">{user.first_name} {user.last_name}</span>'s access and invalidate their sessions.
                        </p>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Reason</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason for deactivation..."
                            className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                            rows={3}
                        />
                        <div className="flex gap-3 mt-4 justify-end">
                            <button
                                onClick={() => { setShowDeactivateModal(false); setReason(""); }}
                                className="px-4 py-2 text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeactivate}
                                disabled={!reason.trim() || isSubmitting}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {isSubmitting ? "Deactivating..." : "Deactivate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reactivate Confirmation Modal */}
            {showReactivateModal && (
                <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowReactivateModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl border border-gray-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Reactivate Admin</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                            This will re-enable <span className="font-medium text-gray-900 dark:text-white">{user.first_name} {user.last_name}</span>'s access to the admin dashboard.
                        </p>
                        <div className="flex gap-3 mt-4 justify-end">
                            <button
                                onClick={() => setShowReactivateModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReactivate}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {isSubmitting ? "Reactivating..." : "Reactivate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
