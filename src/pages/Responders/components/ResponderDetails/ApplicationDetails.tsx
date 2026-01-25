import { Phone } from "lucide-react";
import { formatPHNumber } from "../../../../lib/utils/formatter";
import { useState } from "react";
import { responderAPI } from "../../../../lib/api/responder";
import { useResponders } from "../../context/RespondersPageContext";

interface ApplicationDetailsProps {
    responderId: string;
    fullName: string;
    phoneNumber: string;
}

export default function ApplicationDetails({
    responderId,
    fullName,
    phoneNumber,
}: ApplicationDetailsProps) {
    const [isApproving, setIsApproving] = useState(false);

    const { modifyResponderInList } = useResponders();

    const handleApprove = async () => {
        try {
            setIsApproving(true);
            await responderAPI.approveResponder(responderId);

            modifyResponderInList(responderId);
        } catch (error) {
        } finally {
            setIsApproving(false);
        }
    };

    const handleDecline = () => {};

    return (
        <div className="flex-1 flex flex-col justify-between">
            <div className="rounded-lg border border-gray-400 py-3 px-4">
                <h3 className="mb-1 font-medium">{fullName}</h3>
                <p className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4" />
                    {formatPHNumber(phoneNumber)}
                </p>
            </div>

            <div className="flex items-center justify-between gap-3 ">
                <button
                    onClick={() => handleDecline()}
                    className="btn-custom w-full font-semibold text-white bg-red-600 hover:bg-red-700"
                >
                    Decline
                </button>
                <button
                    onClick={() => handleApprove()}
                    className="btn-custom w-full font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
                >
                    {isApproving && <div className="spinner w-3 h-3"></div>}
                    <span>{isApproving ? "Approving..." : "Approve"}</span>
                </button>
            </div>
        </div>
    );
}
