import { ChevronDown, ListFilter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    RESPONDER_STATUS,
    useResponders,
} from "../context/RespondersPageContext";

export default function FilterDropdown() {
    const [optionsVisible, setOptionsVisible] = useState(false);

    const { pendingRespondersCount, selectedOption, setSelectedOption } =
        useResponders();

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOptionsVisible(false);
            }
        };

        if (optionsVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [optionsVisible]);

    const handleChange = (option: string) => {
        if (option === selectedOption) return;
        setSelectedOption(option);
        setOptionsVisible(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="btn-custom bg-primary hover:bg-primary/95 text-white px-4 gap-3"
                onClick={() => setOptionsVisible((prev) => !prev)}
            >
                <ListFilter size={18} />
                <span>{selectedOption}</span>
                {pendingRespondersCount > 0 && (
                    <span className="bg-white text-primary font-medium text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {pendingRespondersCount}
                    </span>
                )}
                <ChevronDown
                    size={18}
                    className={`transition-transform ${optionsVisible ? "rotate-180" : ""}`}
                />
            </button>
            <div
                className={`absolute top-full shadow-md z-40 overflow-hidden bg-white rounded-lg w-36 right-0 mt-2 transition-[max-height] duration-150 ease-in-out ${optionsVisible ? "max-h-96" : "max-h-0"}`}
            >
                <div className="p-1">
                    {RESPONDER_STATUS.map((option, i) => {
                        return (
                            <div
                                key={i}
                                onClick={() => handleChange(option)}
                                className={`px-4 py-3 flex items-center gap-2 text-sm rounded-lg ${selectedOption === option ? "bg-blue-100 text-blue-600 font-medium" : "hover:text-black cursor-pointer text-gray-700"}`}
                            >
                                <span>{option}</span>
                                {option === "Pending" &&
                                    pendingRespondersCount > 0 && (
                                        <span className="bg-blue-600 text-white font-medium text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                            {pendingRespondersCount}
                                        </span>
                                    )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
