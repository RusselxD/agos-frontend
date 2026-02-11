import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useEffect, useState } from "react";
import ModalContainer from "../../../components/common/ModalContainer";
import { X } from "lucide-react";
import TextInputField from "../../../components/common/auth/TextInputField";
import { useResponders } from "../context/RespondersPageContext";
import { responderAPI } from "../../../lib/api/responder";
import { formatPHNumber } from "../../../lib/utils/formatter";

const MembersSkeleton = () => {
    return (
        <>
            <div className="skeleton h-5 w-full rounded-md"></div>
            <div className="skeleton h-5 w-full rounded-md"></div>
            <div className="skeleton h-5 w-full rounded-md"></div>
            <div className="skeleton h-5 w-full rounded-md"></div>
        </>
    );
};

export default function NewGroupForm({
    setModalOpen,
}: {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [groupName, setGroupName] = useState("");
    const [memberIDs, setMemberIDs] = useState<string[]>([]);

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { cache, setCache } = useResponders();

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

    const handleAddMember = (id: string) => {
        if (memberIDs.includes(id)) {
            setMemberIDs((prevIDs) =>
                prevIDs.filter((prevID) => prevID !== id),
            );
        } else {
            setMemberIDs((prevIDs) => [...prevIDs, id]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        setIsSaving(true);
        try {
            const res = await responderAPI.createGroup({
                group_name: groupName.trim(),
                member_ids: memberIDs,
            });
            setCache((prevCache) => ({
                ...prevCache,
                groups: prevCache.groups ? [...prevCache.groups, res] : [res],
            }));
            setModalOpen(false);
        } catch (error) {
        } finally {
            setIsSaving(false);
        }
    };

    const approvedResponders =
        cache.responders?.filter(
            (responder) => responder.status.toLowerCase() === "approved",
        ) ?? [];

    return (
        <ModalContainer setModalOpen={setModalOpen}>
            <div
                className="bg-white rounded-lg shadow-xl p-5 max-w-[95vw] w-[32rem] flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg">
                        Create Responder Group
                    </h2>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="p-1 text-gray-700 hover:text-black"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <TextInputField
                        value={groupName}
                        setValue={setGroupName}
                        label="GROUP NAME"
                        placeholder="Enter group name"
                        className="text-sm"
                    />

                    <div className="space-y-1">
                        <span className="text-sm text-gray-700 font-semibold">
                            SELECT MEMBERS
                        </span>
                        <div className="border border-gray-400 rounded-lg p-3 flex flex-col gap-2 overflow-auto max-h-40">
                            {isFetching && <MembersSkeleton />}

                            {approvedResponders.map((responder) => {
                                return (
                                    <label
                                        key={responder.id}
                                        className="w-full"
                                    >
                                        <input
                                            type="checkbox"
                                            value={responder.id}
                                            checked={memberIDs.includes(
                                                responder.id,
                                            )}
                                            onChange={() =>
                                                handleAddMember(responder.id)
                                            }
                                        />
                                        <span className="ml-2 text-[0.900rem] text-gray-800">{`${responder.first_name} ${responder.last_name} (${formatPHNumber(responder.phone_number)})`}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-100 border rounded-md border-red-500 py-2 px-3">
                            {error}
                        </p>
                    )}

                    <div className="text-sm flex items-center justify-end gap-2">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            disabled={
                                !groupName.trim() ||
                                memberIDs.length === 0 ||
                                isSaving
                            }
                            type="submit"
                            className="btn-custom bg-primary text-white hover:bg-primary/90 disabled:hover:bg-primary"
                        >
                            {isSaving && (
                                <div className="spinner w-4 h-4"></div>
                            )}
                            <span>Create Group</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
}
