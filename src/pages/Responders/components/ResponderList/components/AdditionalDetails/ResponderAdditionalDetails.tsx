import type { ReactNode } from "react";
import { CalendarDays, Phone, ShieldCheck, UserRound } from "lucide-react";
import type { ResponderAllDetails } from "../../../../../../types/responder";
import {
    formatDate,
    formatPHNumber,
} from "../../../../../../lib/utils/formatter";

interface DetailCardProps {
    title: string;
    icon: ReactNode;
    value: ReactNode;
    tone?: "default" | "active" | "pending";
}

const DetailCard = ({ title, icon, value, tone = "default" }: DetailCardProps) => {
    const valueColor =
        tone === "active"
            ? "text-emerald-700"
            : tone === "pending"
              ? "text-amber-700"
              : "text-gray-800";

    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-gray-500">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-600">
                    {icon}
                </div>
                <span>{title}</span>
            </div>
            <p className={`text-sm font-semibold ${valueColor}`}>{value}</p>
        </div>
    );
};

export default function ResponderAdditionalDetails({
    responder,
}: {
    responder: ResponderAllDetails;
}) {
    const isActive = responder.status.toLowerCase() === "active";
    const createdBy = responder.created_by?.trim() || "N/A";
    const createdOn = responder.created_at
        ? formatDate(responder.created_at)
        : "N/A";
    const activatedOn = responder.activated_at
        ? formatDate(responder.activated_at)
        : "N/A";

    return (
        <div className="space-y-2.5 text-sm">
            <div className="grid grid-cols-2 gap-2">
                <DetailCard
                    title="Phone Number"
                    icon={<Phone className="h-3.5 w-3.5" />}
                    value={formatPHNumber(responder.phone_number)}
                />
                <DetailCard
                    title="Status"
                    icon={<ShieldCheck className="h-3.5 w-3.5" />}
                    value={responder.status.toUpperCase()}
                    tone={isActive ? "active" : "pending"}
                />
            </div>
            <DetailCard
                title="Created By"
                icon={<UserRound className="h-3.5 w-3.5" />}
                value={createdBy}
            />
            <div className="grid grid-cols-2 gap-2">
                <DetailCard
                    title="Created On"
                    icon={<CalendarDays className="h-3.5 w-3.5" />}
                    value={createdOn}
                />
                <DetailCard
                    title="Activated On"
                    icon={<CalendarDays className="h-3.5 w-3.5" />}
                    value={activatedOn}
                />
            </div>
        </div>
    );
}
