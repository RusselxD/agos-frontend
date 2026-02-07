import type { ResponderListItem } from "../../../../../types/responder";
import { ChevronRight } from "lucide-react";
import { useResponderList } from "../context/ResponderListContext";
import { formatPHNumber } from "../../../../../lib/utils/formatter";
import Container from "../../../../../components/ui/Container";

export default function Table({
    responders,
}: {
    responders: ResponderListItem[];
}) {
    const { handleChooseResponder, chosenResponder, sideDrawerOpen } =
        useResponderList();

    return (
        <Container
            headerTitle="RESPONDERS"
            className={`p-0 flex-1 h-full overflow-auto min-w-0 ${sideDrawerOpen ? "mr-2" : ""}`}
        >
            <table className="w-full text-left border-collapse text-sm">
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
                        <th className="px-4 py-3 font-medium text-left bg-background rounded-tr-md">
                            Status
                        </th>
                        <th className="px-4 py-3 font-medium text-left bg-background rounded-tr-md"></th>
                    </tr>
                </thead>
                <tbody>
                    {responders.map((responder, index) => {
                        const isSelected =
                            responder === chosenResponder && sideDrawerOpen;
                        const isPending = responder.status === "pending";
                        const isEvenRow = index % 2 === 0;

                        return (
                            <tr
                                key={responder.id}
                                className={`
                                    border-l-4
                                    ${isSelected ? "border-blue-600 !bg-blue-100" : "border-transparent"}
                                    ${isPending ? "bg-amber-100" : isEvenRow ? "bg-white" : "bg-gray-50"}
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
                                    {responder.status}
                                </td>
                                <td className="text-left">
                                    <button
                                        onClick={() =>
                                            handleChooseResponder(responder)
                                        }
                                        className={`flex items-center gap-1 text-blue-600 px-2 py-1 rounded-md ${isSelected ? "font-semibold cursor-default" : "font-medium hover:bg-blue-50"}`}
                                    >
                                        <span>View Details</span>
                                        <ChevronRight />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Container>
    );
}
