import { useEffect, useState } from "react";
import type { ResponderAllDetails } from "../../../../../../types/responder";
import { useResponderList } from "../../context/ResponderListContext";
import { responderAPI } from "../../../../../../lib/api/responder";
import { X } from "lucide-react";

import ResponderAdditionalDetails from "./ResponderAdditionalDetails";

import PendingDetails from "./PendingDetails";
import ResponderDetailsSkeleton from "./ResponderDetailsSkeleton";

const ResponderName = ({
    fullName,
    status,
}: {
    fullName: string;
    status: string;
}) => {
    const initials =
        fullName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("") || "R";
    const isPending = status.toLowerCase() === "pending";

    return (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 p-4 text-sm text-white shadow-sm">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-white/10" />
            <div className="relative flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 font-semibold">
                    {initials}
                </div>
                <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold">
                        {fullName}
                    </h2>
                    <p className="text-blue-100">Responder Profile</p>
                </div>
                <span
                    className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide ${
                        isPending
                            ? "bg-amber-200/90 text-amber-900"
                            : "bg-emerald-200/90 text-emerald-900"
                    }`}
                >
                    {status.toUpperCase()}
                </span>
            </div>
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
                status={responder.status}
            />
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
            <ResponderName
                fullName={`${responder.first_name} ${responder.last_name}`}
                status={responder.status}
            />
            <PendingDetails submittedAt={responder.created_at} />
            <ResponderAdditionalDetails responder={responder} />
        </>
    );
};

const MainDetails = ({ responder }: { responder: ResponderAllDetails }) => {
    const { setSideDrawerOpen } = useResponderList();
    const isPending = responder.status.toLowerCase() === "pending";

    return (
        <>
            <div className="flex items-start justify-between border-b border-gray-200 pb-3">
                <div>
                    <h2 className="font-semibold text-gray-800">
                        {isPending ? "APPLICATION REVIEW" : "RESPONDER DETAILS"}
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                        {isPending
                            ? "Check responder data before approval."
                            : "Responder profile and activity metadata."}
                    </p>
                </div>

                <button
                    className="rounded-md border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-100"
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
            className={`overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 ease-in-out xl:h-full xl:transition-[width] ${
                sideDrawerOpen ? "max-h-[42rem] w-full xl:w-[22rem]" : "max-h-0 w-full border-0 xl:max-h-none xl:w-0"
            }`}
        >
            <div className="flex max-h-[42rem] flex-col gap-3 overflow-y-auto p-4 xl:h-full">
                {isFetching && <ResponderDetailsSkeleton />}

                {!isFetching && responder === null && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        Failed to load responder details.
                    </div>
                )}

                {!isFetching && responder && (
                    <MainDetails responder={responder} />
                )}
            </div>
        </div>
    );
}
