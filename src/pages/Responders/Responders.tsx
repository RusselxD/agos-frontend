import { useEffect, useState } from "react";
import MessageTemplates from "./components/MessageTemplates";
import { RespondersPageProvider } from "./context/RespondersPageContext";
import ResponderList from "./components/ResponderList/ResponderList";
import ResponderGroups from "./components/ResponderGroups";
import SendSMS from "./components/SendSMS";
import { Mail, Plus } from "lucide-react";
import MessageTemplateForm from "./components/MessageTemplateForm";
import NewGroupForm from "./components/NewGroupForm";

const TABS = [
    { name: "Message Templates", value: "templates" },
    { name: "Send SMS", value: "send_sms" },
    { name: "Responder Groups", value: "groups" },
    { name: "Responders", value: "responders" },
];

export default function Responders() {
    useEffect(() => {
        document.title = "Responders - AGOS";

        return () => {
            document.title = "AGOS";
        };
    }, []);

    const [chosenTab, setChosenTab] = useState("templates");

    const [messageTemplateFormModalIsOpen, setMessageTemplateFormModalIsOpen] =
        useState(false);
    const [groupFormModalIsOpen, setGroupFormModalIsOpen] = useState(false);

    return (
        <RespondersPageProvider>
            <div className="space-y-2 flex flex-col flex-1 h-full">
                <div className="bg-white rounded-lg py-2 px-3 text-sm flex justify-between custom-shadow">
                    <div className="flex gap-2">
                        {TABS.map((tab) => {
                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => setChosenTab(tab.value)}
                                    className={`btn-custom py-2.5 px-4 rounded-lg ${chosenTab === tab.value ? "bg-primary font-medium text-white" : "text-gray-700 border-transparent hover:text-black"}`}
                                >
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <button
                            onClick={() => setGroupFormModalIsOpen(true)}
                            className="btn-custom bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New Group</span>
                        </button>

                        <button
                            onClick={() =>
                                setMessageTemplateFormModalIsOpen(true)
                            }
                            className="btn-custom bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                            <Mail className="w-5 h-5" />
                            <span>New Template</span>
                        </button>
                    </div>
                </div>

                {chosenTab === "templates" && <MessageTemplates />}
                {chosenTab === "send_sms" && <SendSMS />}
                {chosenTab === "groups" && <ResponderGroups />}
                {chosenTab === "responders" && <ResponderList />}
            </div>

            {messageTemplateFormModalIsOpen && (
                <MessageTemplateForm
                    setModalOpen={setMessageTemplateFormModalIsOpen}
                />
            )}

            {groupFormModalIsOpen && (
                <NewGroupForm setModalOpen={setGroupFormModalIsOpen} />
            )}
        </RespondersPageProvider>
    );
}
