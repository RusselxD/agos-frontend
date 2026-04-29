import { useEffect, useRef, useState } from "react";
import { RespondersPageProvider } from "./context/RespondersPageContext";
import ResponderList from "./components/ResponderList/ResponderList";
import ResponderGroups from "./components/ResponderGroups";
import Announce from "./components/Announce";
import { Bell, ChevronDown, Plus, Users } from "lucide-react";
// import MessageTemplateForm from "./components/modals/MessageTemplateForm";
import GroupForm from "./components/modals/GroupForm";
import NotificationTemplates from "./components/NotificationTemplates/NotificationTemplates";
import NotificationTemplateForm from "./components/modals/NotificationTemplateForm";

const TABS = [
    { name: "Notification Templates", value: "notif_templates" },
    { name: "Announce", value: "announce" },
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

    const [chosenTab, setChosenTab] = useState("notif_templates");
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
            <div className="flex h-full min-w-0 flex-1 flex-col space-y-2">
                <div className="custom-shadow flex flex-col gap-2 rounded-lg bg-white px-2 py-2 text-sm sm:flex-row sm:justify-between sm:px-3">
                    <div className="flex gap-2 overflow-x-auto">
                        {TABS.map((tab) => {
                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => setChosenTab(tab.value)}
                                    className={`btn-custom shrink-0 rounded-lg px-3 py-2.5 sm:px-4 ${chosenTab === tab.value ? "bg-primary font-medium text-white" : "text-gray-700 border-transparent hover:text-black"}`}
                                >
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>
                    <div className="relative sm:shrink-0" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="btn-custom w-full bg-blue-600 font-medium text-white hover:bg-blue-700 sm:w-auto"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New</span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <button
                                    onClick={() => {
                                        setGroupFormModalIsOpen(true);
                                        setDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Users className="w-4 h-4" />
                                    <span>Group</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setMessageTemplateFormModalIsOpen(true);
                                        setDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Bell className="w-4 h-4" />
                                    <span>Notification</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {chosenTab === "notif_templates" && <NotificationTemplates />}
                {chosenTab === "announce" && <Announce />}
                {chosenTab === "groups" && <ResponderGroups />}
                {chosenTab === "responders" && <ResponderList />}
            </div>

            {messageTemplateFormModalIsOpen && (
                <NotificationTemplateForm
                    setModalOpen={setMessageTemplateFormModalIsOpen}
                />
            )}

            {groupFormModalIsOpen && (
                <GroupForm setModalOpen={setGroupFormModalIsOpen} />
            )}
        </RespondersPageProvider>
    );
}
