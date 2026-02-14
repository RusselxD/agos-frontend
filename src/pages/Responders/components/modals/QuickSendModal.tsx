import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Send } from "lucide-react";
import ModalContainer from "../../../../components/common/ModalContainer";
import { useToast } from "../../../../context/ToastContext";
import { responderAPI, responderGroupAPI } from "../../../../lib/api/responder";
import type { MessageTemplate } from "../../../../types/responder";
import { useResponders } from "../../context/RespondersPageContext";
import ResponderPageModalContainer from "./ResponderPageModalContainer";
import SendRecipientsInfo from "./SendRecipientsInfo";

interface QuickSendModalProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    messageTemplate: MessageTemplate;
}

interface RecipientOption {
    value: string;
    label: string;
    responderIds: string[];
}

export default function QuickSendModal({
    setModalOpen,
    messageTemplate,
}: QuickSendModalProps) {
    const { cache, setCache } = useResponders();
    const { toastSuccess, toastError } = useToast();
    const [confirmSend, setConfirmSend] = useState(false);
    const [isFetchingRecipients, setIsFetchingRecipients] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");
    const [selectedRecipientsValue, setSelectedRecipientsValue] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchRecipients = async () => {
            const shouldFetchResponders = cache.responders === undefined;
            const shouldFetchGroups = cache.groups === undefined;

            if (!shouldFetchResponders && !shouldFetchGroups) {
                return;
            }

            setIsFetchingRecipients(true);
            try {
                const [respondersRes, groupsRes] = await Promise.all([
                    shouldFetchResponders
                        ? responderAPI.getAllResponders()
                        : Promise.resolve(undefined),
                    shouldFetchGroups
                        ? responderGroupAPI.getAllGroups()
                        : Promise.resolve(undefined),
                ]);

                if (!isMounted) {
                    return;
                }

                setCache((prevCache) => ({
                    ...prevCache,
                    responders: respondersRes ?? prevCache.responders,
                    groups: groupsRes ?? prevCache.groups,
                }));
            } catch {
                if (isMounted) {
                    toastError("Failed to load recipients.");
                }
            } finally {
                if (isMounted) {
                    setIsFetchingRecipients(false);
                }
            }
        };

        fetchRecipients();
        return () => {
            isMounted = false;
        };
    }, []);

    const activeResponderIdsSet = useMemo(
        () =>
            new Set(
                (cache.responders ?? [])
                    .filter(
                        (responder) =>
                            responder.status.toLowerCase() === "active",
                    )
                    .map((responder) => responder.id),
            ),
        [cache.responders],
    );

    const recipientOptions = useMemo<RecipientOption[]>(
        () =>
            (cache.groups ?? []).map((group) => {
                const groupActiveResponderIds = [
                    ...new Set(
                        group.member_ids.filter((memberId) =>
                            activeResponderIdsSet.has(memberId),
                        ),
                    ),
                ];

                return {
                    value: `group-${group.id}`,
                    label: `${group.group_name} (${groupActiveResponderIds.length} member${
                        groupActiveResponderIds.length > 1 ? "s" : ""
                    })`,
                    responderIds: groupActiveResponderIds,
                };
            }),
        [cache.groups, activeResponderIdsSet],
    );

    const selectedRecipientOption =
        recipientOptions.find(
            (option) => option.value === selectedRecipientsValue,
        ) ?? recipientOptions[0];

    useEffect(() => {
        if (recipientOptions.length === 0) {
            if (selectedRecipientsValue !== "") {
                setSelectedRecipientsValue("");
            }
            return;
        }

        const hasSelectedOption = recipientOptions.some(
            (option) => option.value === selectedRecipientsValue,
        );

        if (!hasSelectedOption) {
            setSelectedRecipientsValue(recipientOptions[0].value);
        }
    }, [recipientOptions, selectedRecipientsValue]);

    const selectedRecipientIds = selectedRecipientOption?.responderIds ?? [];
    const selectedCount = selectedRecipientIds.length;
    const isSendDisabled =
        isFetchingRecipients ||
        isSending ||
        !selectedRecipientOption ||
        !confirmSend ||
        !messageTemplate.template_content.trim() ||
        selectedCount === 0;

    const handleSendNow = async () => {
        if (isSendDisabled) {
            return;
        }

        setError("");
        setIsSending(true);
        try {
            await responderAPI.sendSMS({
                responder_ids: selectedRecipientIds,
                message: messageTemplate.template_content.trim(),
            });

            toastSuccess("Quick send completed successfully.");
            setModalOpen(false);
        } catch {
            setError("Failed to send SMS. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <ModalContainer setModalOpen={setModalOpen}>
            <ResponderPageModalContainer
                headerText="Quick Send Confirmation"
                setModalOpen={setModalOpen}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">
                            MESSAGE PREVIEW
                        </label>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800">
                            <p className="text-sm leading-7 whitespace-pre-wrap">
                                {messageTemplate.template_content}
                            </p>
                        </div>
                        <p className="self-end text-xs text-gray-500">
                            {messageTemplate.template_content.length} characters
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">
                            RECIPIENTS
                        </label>
                        <select
                            value={selectedRecipientsValue}
                            onChange={(e) => {
                                setSelectedRecipientsValue(e.target.value);
                                setConfirmSend(false);
                            }}
                            disabled={
                                isFetchingRecipients ||
                                recipientOptions.length === 0
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 disabled:bg-gray-100"
                        >
                            {recipientOptions.length === 0 ? (
                                <option value="">
                                    No recipient groups available
                                </option>
                            ) : (
                                recipientOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <SendRecipientsInfo selectedCount={selectedCount} />

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={confirmSend}
                            onChange={(e) => setConfirmSend(e.target.checked)}
                        />
                        I confirm this message should be sent to the selected
                        recipients.
                    </label>

                    {error && (
                        <p className="rounded-md border border-red-500 bg-red-100 px-3 py-2 text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-4 text-sm">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSendNow}
                            disabled={isSendDisabled}
                            className="btn-custom rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:hover:bg-emerald-600"
                        >
                            {isSending ? (
                                <div className="spinner h-4 w-4"></div>
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            <span>{isSending ? "Sending..." : "Send Now"}</span>
                        </button>
                    </div>
                </div>
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}
