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
                className={`bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-xl rounded-2xl p-6 flex-1 h-full overflow-auto min-w-0 flex flex-col transition-all duration-300 ${sideDrawerOpen ? "mr-2" : ""}`}
            >
                <div className="flex items-center justify-between mb-3">
                    <h2 className="pl-2 border-l-4 font-semibold text-gray-600 dark:text-slate-300 border-primary">
                        RESPONDERS
                    </h2>
                    <button
                        onClick={handleToggleAddResponderForm}
                        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                            addResponderFormOpen
                                ? "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
                    className={`overflow-auto flex-1 transition-all duration-300 ${
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
