import { useEffect, useRef, useState } from "react";
import MessageTemplates from "./components/MessageTemplates";
import { RespondersPageProvider } from "./context/RespondersPageContext";
import ResponderList from "./components/ResponderList/ResponderList";
import ResponderGroups from "./components/ResponderGroups";
import SendSMS from "./components/SendSMS";
import { ChevronDown, Mail, Plus, Users } from "lucide-react";
import MessageTemplateForm from "./components/modals/MessageTemplateForm";
import GroupForm from "./components/modals/GroupForm";

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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [messageTemplateFormModalIsOpen, setMessageTemplateFormModalIsOpen] =
        useState(false);
    const [groupFormModalIsOpen, setGroupFormModalIsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="btn-custom bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New</span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <button
                                    onClick={() => {
                                        setGroupFormModalIsOpen(true);
                                        setDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Users className="w-4 h-4" />
                                    <span>New Group</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setMessageTemplateFormModalIsOpen(true);
                                        setDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Mail className="w-4 h-4" />
                                    <span>New Template</span>
                                </button>
                            </div>
                        )}
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
                <GroupForm setModalOpen={setGroupFormModalIsOpen} />
            )}
        </RespondersPageProvider>
    );
}
