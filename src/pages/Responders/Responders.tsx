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
            <div className="space-y-2 flex flex-col flex-1 h-full">
                <div className="bg-white rounded-lg py-2 px-3 text-sm flex items-center justify-between gap-3 custom-shadow">
                    {/* Mobile Dropdown */}
                    <div className="lg:hidden flex-1 min-w-0">
                        <select
                            value={chosenTab}
                            onChange={(e) => setChosenTab(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none cursor-pointer truncate"
                        >
                            {TABS.map((tab) => (
                                <option key={tab.value} value={tab.value}>
                                    {tab.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Desktop Tabs */}
                    <div className="hidden lg:flex flex-wrap gap-2 flex-1">
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
                    <div className="relative shrink-0" ref={dropdownRef}>
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
