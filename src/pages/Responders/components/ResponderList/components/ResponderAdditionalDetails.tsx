import type { ReactNode } from "react";
import type { ResponderAllDetails } from "../../../../../types/responder";
import { formatDate, formatPHNumber } from "../../../../../lib/utils/formatter";

interface ContainerProps {
    title: string;
    children: ReactNode;
}

const Container = ({ title, children }: ContainerProps) => {
    return (
        <div className="bg-gray-100 border border-gray-300 rounded-lg py-3 px-3 w-full">
            <h4 className="text-gray-800 mb-1 text-[0.8rem]">{title}</h4>
            {children}
        </div>
    );
};

export default function ResponderAdditionalDetails({
    responder,
}: {
    responder: ResponderAllDetails;
}) {
    return (
        <div className="text-sm space-y-2">
            <div className="grid grid-cols-[1fr_0.60fr] gap-2">
                <Container title="Phone Number">
                    <p className="font-medium">
                        {formatPHNumber(responder.phone_number)}
                    </p>
                </Container>
                <Container title="Status">
                    <p className="font-medium text-emerald-500">
                        {responder.status.toUpperCase()}
                    </p>
                </Container>
            </div>
            <Container title="Approved By">
                <p className="font-medium">{responder.approved_by || "N/A"}</p>
            </Container>

            <Container title="Approved On">
                <p className="font-medium">
                    {formatDate(responder.approved_at!) || "N/A"}
                </p>
            </Container>
        </div>
    );
}
