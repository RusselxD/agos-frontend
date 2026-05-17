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
import Popover from "../../components/ui/Popover";

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
    const triggerRef = useRef<HTMLButtonElement>(null);

    const [messageTemplateFormModalIsOpen, setMessageTemplateFormModalIsOpen] =
        useState(false);
    const [groupFormModalIsOpen, setGroupFormModalIsOpen] = useState(false);

    return (
        <RespondersPageProvider>
            <div className="space-y-3 flex flex-col flex-1 h-full">
                <div className="relative z-20 bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl rounded-2xl py-3 px-4 text-sm flex items-center justify-between gap-3 shadow-xl border border-white/50 dark:border-white/10 transition-all duration-300 hover:shadow-2xl">
                    {/* Mobile Dropdown */}
                    <div className="lg:hidden flex-1 min-w-0">
                        <select
                            value={chosenTab}
                            onChange={(e) => setChosenTab(e.target.value)}
                            className="w-full bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/5 text-gray-900 dark:text-slate-200 text-sm font-medium rounded-xl focus:ring-primary focus:border-primary block p-2.5 outline-none cursor-pointer truncate transition-colors"
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
                                    className={`py-2.5 px-5 rounded-xl transition-all duration-200 ${chosenTab === tab.value ? "bg-primary dark:bg-blue-600 font-bold text-white shadow-lg scale-105" : "text-gray-600 dark:text-slate-400 font-medium hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"}`}
                                >
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>
                    <div className="shrink-0">
                        <button
                            ref={triggerRef}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="btn-custom bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New</span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {/* Dropdown Panel (portaled above page content) */}
                        <Popover
                            open={dropdownOpen}
                            onClose={() => setDropdownOpen(false)}
                            anchorRef={triggerRef}
                            align="right"
                            gap={8}
                        >
                            <div className="w-48 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/50 dark:border-white/10 py-1.5 animate-dropdown-in">
                                <button
                                    onClick={() => {
                                        setGroupFormModalIsOpen(true);
                                        setDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <Users className="w-4 h-4" />
                                    <span>Group</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setMessageTemplateFormModalIsOpen(true);
                                        setDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <Bell className="w-4 h-4" />
                                    <span>Notification</span>
                                </button>
                            </div>
                        </Popover>
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
