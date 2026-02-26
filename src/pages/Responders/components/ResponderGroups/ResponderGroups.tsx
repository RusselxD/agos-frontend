import { useEffect, useState } from "react";
import { useResponders } from "../../context/RespondersPageContext";
import ResponderGroupCard from "./components/ResponderGroupCard";
import ResponderGroupsLoadingSkeleton from "./components/ResponderGroupsLoadingSkeleton";
import { responderGroupAPI } from "../../../../lib/api/responderGroup";
import { useToast } from "../../../../context/ToastContext";
import Container from "../../../../components/ui/Container";
import { responderAPI } from "../../../../lib/api/responder";

export default function ResponderGroups() {
    const { cache, setCache } = useResponders();
    const { toastError } = useToast();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (cache.responders !== undefined && cache.groups !== undefined) {
            return;
        }

        setIsFetching(true);

        (async () => {
            try {
                const [respondersRes, groupsRes] = await Promise.all([
                    cache.responders === undefined
                        ? responderAPI.getAllResponders()
                        : Promise.resolve(undefined),
                    cache.groups === undefined
                        ? responderGroupAPI.getAllGroups()
                        : Promise.resolve(undefined),
                ]);

                setCache((prev) => ({
                    ...prev,
                    responders: respondersRes ?? prev.responders,
                    groups: groupsRes ?? prev.groups,
                }));
            } catch {
                toastError("Failed to load responder groups. Please try again.");
            } finally {
                setIsFetching(false);
            }
        })();
    }, [cache.groups, cache.responders, setCache, toastError]);

    if (isFetching) {
        return <ResponderGroupsLoadingSkeleton />;
    }

    return (
        <Container headerTitle="RESPONDER GROUPS" className="flex-1">
            <div className="grid grid-cols-2 gap-5">
                {cache.groups?.map((group) => (
                    <ResponderGroupCard
                        key={group.id}
                        responderGroup={group}
                    />
                ))}
            </div>
        </Container>
    );
}
