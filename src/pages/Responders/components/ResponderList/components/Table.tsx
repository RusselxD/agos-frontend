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
            return "bg-amber-100 text-amber-800";
        case "active":
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-800";
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
        <table className="w-full text-left border-collapse text-sm table-fixed flex-1">
            <colgroup>
                <col className="w-[17%]" />
                <col className="w-[17%]" />
                <col className="w-[24%]" />
                <col className="w-[20%]" />
                <col className="w-[22%]" />
            </colgroup>
            <thead className="sticky top-0 z-10">
                <tr className="rounded-t-md">
                    <th className="px-4 py-3 font-medium text-left bg-background rounded-tl-md">
                        First Name
                    </th>
                    <th className="px-4 py-3 font-medium text-left bg-background">
                        Last Name
                    </th>
                    <th className="px-4 py-3 font-medium text-left bg-background">
                        Phone Number
                    </th>
                    <th className="px-4 py-3 font-medium text-left bg-background">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() =>
                                    setStatusDropdownOpen((prev) => !prev)
                                }
                                className="flex items-center gap-1 hover:text-primary transition-colors"
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
                                className={`absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[120px] overflow-hidden transition-all duration-200 ${
                                    statusDropdownOpen
                                        ? "opacity-100 visible"
                                        : "opacity-0 invisible h-0"
                                }`}
                            >
                                {statusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setStatusFilter(option.value);
                                            setStatusDropdownOpen(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${
                                            statusFilter === option.value
                                                ? "text-primary font-medium"
                                                : "text-gray-700"
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
                    <th className="px-4 py-3 font-medium text-left bg-background rounded-tr-md">
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
                                    border-l-4
                                    ${isSelected ? "border-blue-600 !bg-blue-100" : "border-transparent"}
                                    ${isEvenRow ? "bg-white" : "bg-gray-50"}
                                `}
                        >
                            <td className="px-4 py-3 text-left">
                                {responder.first_name}
                            </td>
                            <td className="px-4 py-3 text-left">
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
                                    className={`flex items-center gap-1 text-blue-600 px-2 py-1 rounded-md whitespace-nowrap ${isSelected ? "font-semibold cursor-default" : "font-medium hover:bg-blue-50"}`}
                                >
                                    <span>View Details</span>
                                    <ChevronRight />
                                </button>
                            </td>
                        </tr>
                    );
                })}

                {filteredResponders.length === 0 && (
                    <tr>
                        <td
                            colSpan={5}
                            className="px-4 py-6 text-center text-gray-500"
                        >
                            No responders found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
