// import { useEffect, useState } from "react";
// import type { Dispatch, SetStateAction } from "react";
// import ModalContainer from "../../../../components/common/ModalContainer";
// import { useToast } from "../../../../context/ToastContext";
// import {
//     messageTemplateAPI,
//     responderAPI,
// } from "../../../../lib/api/responder";
// import { useResponders } from "../../context/RespondersPageContext";
// import ResponderPageModalContainer from "./ResponderPageModalContainer";
// import SendRecipientsInfo from "./components/SendRecipientsInfo";

// export default function SendSMSModal({
//     setModalOpen,
//     selectedResponderIds,
//     onSendSuccess,
// }: {
//     setModalOpen: Dispatch<SetStateAction<boolean>>;
//     selectedResponderIds: string[];
//     onSendSuccess?: () => void;
// }) {
//     const { cache, setCache } = useResponders();
//     const { toastSuccess, toastError } = useToast();
//     const [selectedTemplateId, setSelectedTemplateId] = useState("");
//     const [message, setMessage] = useState("");
//     const [isFetchingTemplates, setIsFetchingTemplates] = useState(false);
//     const [isSending, setIsSending] = useState(false);
//     const [error, setError] = useState("");

//     const templates = cache.templates ?? [];
//     const selectedTemplate = templates.find(
//         (template) => String(template.id) === selectedTemplateId,
//     );
//     const selectedCount = selectedResponderIds.length;

//     useEffect(() => {
//         const fetchTemplates = async () => {
//             if (cache.templates !== undefined) {
//                 return;
//             }

//             setIsFetchingTemplates(true);
//             try {
//                 const res = await messageTemplateAPI.getMessageTemplates();
//                 setCache((prevCache) => ({
//                     ...prevCache,
//                     templates: res,
//                 }));
//             } catch {
//                 toastError("Failed to load message templates.");
//             } finally {
//                 setIsFetchingTemplates(false);
//             }
//         };

//         fetchTemplates();
//     }, [cache.templates, setCache, toastError]);

//     const handleTemplateChange = (templateId: string) => {
//         setError("");
//         setSelectedTemplateId(templateId);

//         if (!templateId) {
//             setMessage("");
//             return;
//         }

//         const nextTemplate = templates.find(
//             (template) => String(template.id) === templateId,
//         );
//         setMessage(nextTemplate?.template_content ?? "");
//     };

//     const isSendDisabled =
//         !message.trim() || selectedResponderIds.length === 0 || isSending;

//     const handleSendSMS = async () => {
//         if (isSendDisabled) {
//             return;
//         }

//         setError("");
//         setIsSending(true);
//         try {
//             await responderAPI.sendSMS({
//                 responder_ids: selectedResponderIds,
//                 message: message.trim(),
//             });

//             toastSuccess("SMS sent successfully.");
//             onSendSuccess?.();
//             setModalOpen(false);
//         } catch {
//             setError("Failed to send SMS. Please try again.");
//         } finally {
//             setIsSending(false);
//         }
//     };

//     return (
//         <ModalContainer setModalOpen={setModalOpen}>
//             <ResponderPageModalContainer
//                 headerText="Send SMS Message"
//                 setModalOpen={setModalOpen}
//             >
//                 <div className="flex flex-col gap-1">
//                     <label className="text-sm font-semibold text-gray-700">
//                         USE TEMPLATE (OPTIONAL)
//                     </label>
//                     <div className="relative">
//                         <select
//                             value={selectedTemplateId}
//                             onChange={(e) =>
//                                 handleTemplateChange(e.target.value)
//                             }
//                             disabled={isFetchingTemplates}
//                             className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-blue-400"
//                         >
//                             <option value="">None</option>
//                             {templates.map((template) => (
//                                 <option key={template.id} value={template.id}>
//                                     {template.template_name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex flex-col gap-1">
//                     <label className="text-sm font-semibold text-gray-700">
//                         MESSAGE
//                     </label>
//                     <textarea
//                         value={message}
//                         onChange={(e) =>
//                             setMessage(e.target.value.slice(0, 150))
//                         }
//                         placeholder={
//                             selectedTemplate
//                                 ? ""
//                                 : "Select a template or write a custom message"
//                         }
//                         maxLength={150}
//                         rows={5}
//                         className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 outline-none focus:border-blue-400"
//                     />
//                     <p className="self-end text-xs text-gray-500">
//                         {message.length}/150 characters
//                     </p>
//                 </div>

//                 {error && (
//                     <p className="rounded-md border border-red-500 bg-red-100 px-3 py-2 text-sm text-red-500">
//                         {error}
//                     </p>
//                 )}

//                 <SendRecipientsInfo selectedCount={selectedCount} />

//                 <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-4 text-sm">
//                     <button
//                         type="button"
//                         className="btn-cancel"
//                         onClick={() => setModalOpen(false)}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="button"
//                         onClick={handleSendSMS}
//                         disabled={isSendDisabled}
//                         className="btn-custom rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:hover:bg-emerald-600"
//                     >
//                         {isSending && <div className="spinner h-4 w-4"></div>}
//                         <span>{isSending ? "Sending..." : "Send SMS"}</span>
//                     </button>
//                 </div>
//             </ResponderPageModalContainer>
//         </ModalContainer>
//     );
// }
