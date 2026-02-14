import { useEffect, useState } from "react";
import { UserPlus, X } from "lucide-react";
import type { ResponderListItem } from "../../../../types/responder";
import { useResponders } from "../../context/RespondersPageContext";
import { responderAPI } from "../../../../lib/api/responder";
import Table from "./components/Table";
import AddResponderForm from "./components/AddResponderForm";
import {
    ResponderListProvider,
    useResponderList,
} from "./context/ResponderListContext";
import ResponderDetails from "./components/AdditionalDetails/ResponderDetails";

function ResponderListContent({
    responders,
}: {
    responders: ResponderListItem[];
}) {
    const {
        sideDrawerOpen,
        addResponderFormOpen,
        setAddResponderFormOpen,
        setSideDrawerOpen,
    } = useResponderList();

    const handleToggleAddResponderForm = () => {
        const next = !addResponderFormOpen;
        setAddResponderFormOpen(next);

        if (next) {
            setSideDrawerOpen(false);
        }
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            <div
                className={`bg-white custom-shadow rounded-xl p-5 flex-1 h-full overflow-auto min-w-0 flex flex-col ${sideDrawerOpen ? "mr-2" : ""}`}
            >
                <div className="flex items-center justify-between mb-3">
                    <h2 className="pl-2 border-l-4 font-semibold text-gray-600 border-primary">
                        RESPONDERS
                    </h2>
                    <button
                        onClick={handleToggleAddResponderForm}
                        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                            addResponderFormOpen
                                ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        }`}
                    >
                        {addResponderFormOpen ? (
                            <>
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                <span>Add Responder</span>
                            </>
                        )}
                    </button>
                </div>

                <div
                    className={`overflow-hidden transition-all duration-300 ${
                        addResponderFormOpen
                            ? "max-h-0 opacity-0 pointer-events-none -translate-y-1"
                            : "max-h-[200rem] opacity-100 translate-y-0"
                    }`}
                >
                    <Table responders={responders} />
                </div>

                <AddResponderForm />
            </div>

            {!addResponderFormOpen && <ResponderDetails />}
        </div>
    );
}

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
    }, []);

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
            <ResponderListContent responders={cache.responders ?? []} />
        </ResponderListProvider>
    );
}
