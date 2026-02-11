import { useEffect, useState } from "react";
import { useResponders } from "../context/RespondersPageContext";
import Container from "../../../components/ui/Container";
import { responderAPI } from "../../../lib/api/responder";
import type { ResponderGroup } from "../../../types/responder";
import { Pencil, Send, Trash, Users } from "lucide-react";

const ResponderGroupCard = ({
    responderGroup,
}: {
    responderGroup: ResponderGroup;
}) => {
    return (
        <div className="p-3 rounded-md border border-gray-300 bg-gray-100 flex flex-col gap-2">
            <h3 className="font-medium">{responderGroup.group_name}</h3>

            <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Users className="w-4 h-4" />
                <p>{responderGroup.member_ids.length} members</p>
            </div>

            <div className="flex items-center gap-2  mt-2">
                <button className="h-10 flex-1 mr-3 btn-custom bg-emerald-500 hover:bg-emerald-600 text-white px-3">
                    <Send className="w-5 h-5" />
                    <span>Send SMS</span>
                </button>
                <button className="flex h-10 w-10 p-3 items-center justify-center btn-custom bg-blue-500 text-white">
                    <Pencil className="w-5 h-5" />
                </button>
                <button className="flex h-10 w-10 p-3 items-center justify-center btn-custom bg-red-500 text-white">
                    <Trash className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default function ResponderGroups() {
    const { cache, setCache } = useResponders();

    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            if (cache.groups !== undefined) {
                return;
            }

            setIsFetching(true);
            try {
                const res = await responderAPI.getAllGroups();
                setCache((prevCache) => ({
                    ...prevCache,
                    groups: res,
                }));

                // Responders are needed to map the IDs to the names in the list
                if (cache.responders === undefined) {
                    const respondersRes = await responderAPI.getAllResponders();
                    setCache((prevCache) => ({
                        ...prevCache,
                        responders: respondersRes,
                    }));
                }
            } catch (error) {
            } finally {
                setIsFetching(false);
            }
        };

        fetchGroups();
    }, [cache.groups, setCache]);

    if (isFetching) {
        return (
            <div className="pt-4">
                <div className="skeleton rounded-md w-full h-10"></div>
                <div className="grid grid-cols-2 gap-5 mt-5">
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                </div>
            </div>
        );
    }

    return (
        <Container headerTitle="RESPONDER GROUPS">
            <div className="grid grid-cols-2 gap-5">
                {cache.groups?.map((group) => {
                    return (
                        <ResponderGroupCard
                            responderGroup={group}
                            key={group.id}
                        />
                    );
                })}
            </div>
        </Container>
    );
}
