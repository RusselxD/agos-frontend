import { Search } from "lucide-react";

interface SearchBarProps {
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
    return (
        <div className="bg-white p-3 rounded-lg w-full sm:flex-1 sm:max-w-md">
            <label className="relative w-full block" title="Search">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 peer bg-gray-100 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
                />
                <Search
                    className="absolute text-gray-500 peer-focus:text-gray-900 left-3 top-0 h-full"
                    size={20}
                />
            </label>
        </div>
    );
}
