import { useResponders } from "../../context/RespondersPageContext";
import { useEffect, useState } from "react";
import type { ResponderDetailsResponse } from "../../../../types/responder";
import { responderAPI } from "../../../../lib/api/responder";
import ResponderDetailsSkeleton from "./ResponderDetailsSkeleton";
import { MainDetails } from "./MainDetails";

export default function ResponderDetails() {
    const {
        openSideDrawer,
        setOpenSideDrawer,
        selectedResponderId,
        responderExistsInCache,
        addToRespondersCache,
        cachedResponders,
    } = useResponders();

    const [responder, setResponder] = useState<ResponderDetailsResponse | null>(
        null,
    );
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (!selectedResponderId) {
            return;
        }

        const fetchResponderDetails = async () => {
            // Check cache first
            if (responderExistsInCache(selectedResponderId)) {
                setResponder(cachedResponders[selectedResponderId]);
                return;
            }

            try {
                setIsFetching(true);
                const res =
                    await responderAPI.getResponderDetails(selectedResponderId);
                setResponder(res);
                addToRespondersCache(res);
            } catch (error) {
                console.log(error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchResponderDetails();
    }, [selectedResponderId, cachedResponders]);

    return (
        <div
            className={`bg-white h-full rounded-lg border-l transition-[width] duration-300 ease-in-out overflow-hidden ${openSideDrawer ? "w-[22rem]" : "w-0 "}`}
        >
            <div className="p-5 flex flex-col gap-3 h-full">
                {isFetching && <ResponderDetailsSkeleton />}

                {!isFetching && responder === null && <div>error</div>}

                {!isFetching && responder && (
                    <MainDetails
                        responder={responder}
                        setOpenSideDrawer={setOpenSideDrawer}
                    />
                )}
            </div>
        </div>
    );
}
