import { useEffect, useRef, useState } from "react";
import type { ResponderListItem } from "../../../../../types/responder";
import {
    ChevronRight,
    CircleCheck,
    Clock,
    HelpCircle,
    ChevronDown,
    Check,
} from "lucide-react";
import { useResponderList } from "../context/ResponderListContext";
import {
    capitalizeFirstLetter,
    formatPHNumber,
} from "../../../../../lib/utils/formatter";
import type { JSX } from "react";

const getStatusColor = (status: string): string => {
    status = status.toLowerCase();
    switch (status) {
        case "pending":
            return "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400";
        case "active":
            return "bg-green-100 dark:bg-emerald-900/20 text-green-800 dark:text-emerald-400";
        default:
            return "bg-gray-100 dark:bg-slate-700/50 text-gray-800 dark:text-slate-400";
    }
};

const getStatusIcon = (status: string): JSX.Element => {
    status = status.toLowerCase();
    switch (status) {
        case "pending":
            return <Clock className="w-4 h-4" />;
        case "active":
            return <CircleCheck className="w-4 h-4" />;
        default:
            return <HelpCircle className="w-4 h-4" />;
    }
};

export default function Table({
    responders,
}: {
    responders: ResponderListItem[];
}) {
    const { handleChooseResponder, chosenResponder, sideDrawerOpen } =
        useResponderList();

    const [statusFilter, setStatusFilter] = useState<
        "all" | "active" | "pending"
    >("all");
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredResponders =
        statusFilter === "all"
            ? responders
            : responders.filter((r) => r.status.toLowerCase() === statusFilter);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setStatusDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const statusOptions = [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "pending", label: "Pending" },
    ] as const;

    return (
        <table className="w-full text-left border-collapse text-sm whitespace-nowrap flex-1">
            <colgroup>
                <col className="w-[17%]" />
                <col className="w-[17%]" />
                <col className="w-[24%]" />
                <col className="w-[20%]" />
                <col className="w-[22%]" />
            </colgroup>
            <thead className="sticky top-0 z-10">
                <tr className="rounded-t-md text-gray-700 dark:text-slate-200">
                    <th className="px-4 py-4 font-bold text-left bg-gray-100/80 dark:bg-white/[0.05] rounded-tl-xl transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                        First Name
                    </th>
                    <th className="px-4 py-4 font-bold text-left bg-gray-100/80 dark:bg-white/[0.05] transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                        Last Name
                    </th>
                    <th className="px-4 py-4 font-bold text-left bg-gray-100/80 dark:bg-white/[0.05] transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                        Phone Number
                    </th>
                    <th className="px-4 py-4 font-bold text-left bg-gray-100/80 dark:bg-white/[0.05] transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() =>
                                    setStatusDropdownOpen((prev) => !prev)
                                }
                                className="flex items-center gap-1 hover:text-primary dark:hover:text-blue-400 transition-colors"
                            >
                                <span>
                                    {statusFilter === "all"
                                        ? "Status"
                                        : capitalizeFirstLetter(statusFilter)}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            <div
                                className={`absolute top-full left-0 mt-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/50 dark:border-white/10 min-w-[140px] overflow-hidden transition-all duration-300 z-50 ${
                                    statusDropdownOpen
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 -translate-y-2 pointer-events-none"
                                }`}
                            >
                                {statusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setStatusFilter(option.value);
                                            setStatusDropdownOpen(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                                            statusFilter === option.value
                                                ? "text-primary dark:text-blue-400 font-medium"
                                                : "text-gray-700 dark:text-slate-300"
                                        }`}
                                    >
                                        <span>{option.label}</span>
                                        {statusFilter === option.value && (
                                            <Check className="w-4 h-4" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </th>
                    <th className="px-4 py-4 font-bold text-left bg-gray-100/80 dark:bg-white/[0.05] rounded-tr-xl transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {filteredResponders.map((responder, index) => {
                    const isSelected =
                        responder === chosenResponder && sideDrawerOpen;

                    const isEvenRow = index % 2 === 0;

                    return (
                        <tr
                            key={responder.id}
                            className={`
                                    border-l-4 transition-all duration-200
                                    ${isSelected ? "border-blue-600 bg-blue-50/50 dark:bg-blue-500/10" : "border-transparent"}
                                    ${isEvenRow ? "bg-white/40 dark:bg-transparent" : "bg-gray-50/50 dark:bg-white/[0.01]"}
                                    text-gray-700 dark:text-slate-200 hover:bg-gray-100/50 dark:hover:bg-white/[0.03]
                                `}
                        >
                            <td className="px-4 py-3 text-left font-medium text-neutral dark:text-slate-200">
                                {responder.first_name}
                            </td>
                            <td className="px-4 py-3 text-left font-medium text-neutral dark:text-slate-200">
                                {responder.last_name}
                            </td>
                            <td className="px-4 py-3 text-left">
                                {formatPHNumber(responder.phone_number)}
                            </td>
                            <td className="px-4 py-3 text-left">
                                <p
                                    className={`${getStatusColor(responder.status)} px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1 w-fit`}
                                >
                                    {getStatusIcon(responder.status)}
                                    {capitalizeFirstLetter(responder.status)}
                                </p>
                            </td>
                            <td className="px-4 py-3 text-left">
                                <button
                                    onClick={() =>
                                        handleChooseResponder(responder)
                                    }
                                    className={`flex items-center gap-1 px-2 py-1 rounded-md whitespace-nowrap transition-colors ${isSelected ? "font-semibold cursor-default text-blue-700 dark:text-blue-400" : "font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10"}`}
                                >
                                    <span>View Details</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    );
                })}

                {filteredResponders.length === 0 && (
                    <tr>
                        <td
                            colSpan={5}
                            className="px-4 py-6 text-center text-gray-500 dark:text-slate-400"
                        >
                            No responders found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
