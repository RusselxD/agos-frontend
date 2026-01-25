import type { Dispatch, SetStateAction } from "react";
import ApplicationDetails from "./ApplicationDetails";
import UploadedID from "./UploadedID";
import type { ResponderDetailsResponse } from "../../../../types/responder";
import { Clock, X } from "lucide-react";
import { formatDate } from "../../../../lib/utils/formatter";
import ResponderAdditionalDetails from "./ResponderAdditionalDetails";

const ResponderName = ({ fullName }: { fullName: string }) => {
    return (
        <div className="bg-primary text-sm rounded-lg p-3">
            <h2 className="text-white font-semibold">{fullName}</h2>
            <p className="text-blue-300">Responder</p>
        </div>
    );
};

const PendingApplicationDetails = ({ dateSubmit }: { dateSubmit: string }) => {
    return (
        <div className="bg-amber-100 text-sm rounded-lg p-3">
            <div className="flex items-center gap-3 border-b border-orange-300 pb-3">
                <div className="text-white bg-orange-500 p-1.5 rounded-full">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-amber-900 font-semibold">
                        PENDING APPLICATION
                    </h3>
                    <p className="font-light text-orange-600">Under Review</p>
                </div>
            </div>
            <div className="flex items-center justify-between pt-2">
                <p className="text-[0.8rem] text-orange-700">Submitted:</p>
                <p className="font-medium text-orange-900">
                    {formatDate(dateSubmit)}
                </p>
            </div>
        </div>
    );
};

interface MainDetailsProps {
    responder: ResponderDetailsResponse;
    setOpenSideDrawer: Dispatch<SetStateAction<boolean>>;
}

export function MainDetails({
    responder,
    setOpenSideDrawer,
}: MainDetailsProps) {
    console.log("here");
    console.log(responder);

    const isPending = responder.status === "pending";

    return (
        <>
            {/* Top Part */}
            <div className="flex items-center justify-between border-b-2 pb-3">
                <h2 className="font-semibold text-gray-800">
                    {isPending ? "APPLICATION REVIEW" : "RESPONDER DETAILS"}
                </h2>

                <button
                    className="border border-gray-400 rounded-md p-1 hover:bg-gray-100"
                    onClick={() => setOpenSideDrawer(false)}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div>
                {isPending ? (
                    <PendingApplicationDetails
                        dateSubmit={responder.created_at}
                    />
                ) : (
                    <ResponderName
                        fullName={`${responder.first_name} ${responder.last_name}`}
                    />
                )}
            </div>

            {!isPending && <ResponderAdditionalDetails responder={responder} />}

            <UploadedID url={responder.id_photo_path} />

            {isPending && (
                <ApplicationDetails
                    responderId={responder.id}
                    fullName={`${responder.first_name} ${responder.last_name}`}
                    phoneNumber={responder.phone_number}
                />
            )}
        </>
    );
}
