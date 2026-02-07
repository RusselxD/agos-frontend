import { useEffect, useState } from "react";
import type { ResponderAllDetails } from "../../../../../types/responder";
import { useResponderList } from "../context/ResponderListContext";
import { responderAPI } from "../../../../../lib/api/responder";
import { X } from "lucide-react";
import UploadedID from "./UploadedID";
import ApplicationDetails from "./ApplicationDetails";
import PendingDetails from "./PendingDetails";
import ResponderAdditionalDetails from "./ResponderAdditionalDetails";
import ResponderDetailsSkeleton from "./ResponderDetailsSkeleton";

const ResponderName = ({ fullName }: { fullName: string }) => {
    return (
        <div className="bg-primary text-sm rounded-lg p-3">
            <h2 className="text-white font-semibold">{fullName}</h2>
            <p className="text-blue-300">Responder</p>
        </div>
    );
};

const ActiveResponderDetails = ({
    responder,
}: {
    responder: ResponderAllDetails;
}) => {
    return (
        <>
            <ResponderName
                fullName={`${responder.first_name} ${responder.last_name}`}
            />
            <UploadedID imgSrc={responder.id_photo_path} />
            <ResponderAdditionalDetails responder={responder} />
        </>
    );
};

const PendingResponderDetails = ({
    responder,
}: {
    responder: ResponderAllDetails;
}) => {
    return (
        <>
            <PendingDetails submittedAt={responder.created_at} />

            <UploadedID imgSrc={responder.id_photo_path} />

            <ApplicationDetails />
        </>
    );
};

const MainDetails = ({ responder }: { responder: ResponderAllDetails }) => {
    const { setSideDrawerOpen } = useResponderList();
    const isPending = responder.status === "pending";

    return (
        <>
            <div className="flex items-center justify-between border-b-2 pb-3">
                <h2 className="font-semibold text-gray-800">
                    {isPending ? "APPLICATION REVIEW" : "RESPONDER DETAILS"}
                </h2>

                <button
                    className="border border-gray-400 rounded-md p-1 hover:bg-gray-100"
                    onClick={() => setSideDrawerOpen(false)}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {isPending && <PendingResponderDetails responder={responder} />}
            {!isPending && <ActiveResponderDetails responder={responder} />}
        </>
    );
};

export default function ResponderDetails() {
    const {
        sideDrawerOpen,
        chosenResponder,
        cachedResponders,
        responderExistsInCache,
        addResponderToCache,
    } = useResponderList();

    const [responder, setResponder] = useState<ResponderAllDetails | null>(
        null,
    );
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (!chosenResponder) {
            return;
        }

        const fetchResponderDetails = async () => {
            if (responderExistsInCache(chosenResponder.id)) {
                setResponder(cachedResponders[chosenResponder.id]);
                return;
            }

            try {
                setIsFetching(true);
                const res = await responderAPI.getResponderDetails(
                    chosenResponder.id,
                );

                setResponder({
                    ...chosenResponder,
                    ...res,
                });
                addResponderToCache({
                    ...chosenResponder,
                    ...res,
                });
            } catch (error) {
                console.log(error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchResponderDetails();
    }, [chosenResponder, cachedResponders]);

    return (
        <div
            className={`bg-white h-full rounded-lg border-l transition-[width] duration-300 ease-in-out overflow-hidden ${sideDrawerOpen ? "w-[22rem]" : "w-0 "}`}
        >
            <div className="p-5 flex flex-col gap-3 h-full">
                {isFetching && <ResponderDetailsSkeleton />}

                {!isFetching && responder === null && <div>error</div>}

                {!isFetching && responder && (
                    <MainDetails responder={responder} />
                )}
            </div>
        </div>
    );
}
