import { useEffect, useState } from "react";
import { useResponders } from "../../context/RespondersPageContext";
import { responderAPI } from "../../../../lib/api/responder";
import Table from "./components/Table";
import { ResponderListProvider } from "./context/ResponderListContext";
import ResponderDetails from "./components/ResponderDetails";

export default function ResponderList() {
    const { cache, setCache } = useResponders();

    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchResponders = async () => {
            if (cache.responders !== undefined) {
                return;
            }

            setIsFetching(true);
            try {
                const res = await responderAPI.getAllResponders();
                setCache((prevCache) => ({
                    ...prevCache,
                    responders: res,
                }));
            } catch (error) {
            } finally {
                setIsFetching(false);
            }
        };

        fetchResponders();
    }, [cache.responders, setCache]);

    if (isFetching) {
        return (
            <div className="space-y-3 pt-4">
                <div className="skeleton w-full h-14 rounded-md"></div>
                <div className="skeleton w-full h-14 rounded-md"></div>
                <div className="skeleton w-full h-14 rounded-md"></div>
                <div className="skeleton w-full h-14 rounded-md"></div>
                <div className="skeleton w-full h-14 rounded-md"></div>
                <div className="skeleton w-full h-14 rounded-md"></div>
            </div>
        );
    }

    return (
        <ResponderListProvider>
            <div className="flex flex-1 overflow-hidden">
                <Table responders={cache.responders ?? []} />
                <ResponderDetails />
            </div>
        </ResponderListProvider>
    );
}
