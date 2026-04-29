import { Search } from "lucide-react";

export default function SearchBar({placeholder}: {placeholder: string}) {
    return (
        <div className="w-full rounded-lg bg-white p-2 sm:w-3/5 sm:p-3">
            <label className="relative block w-full" title="Search Admins">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="peer w-full rounded-lg border border-gray-200 bg-gray-100 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-200 sm:py-3"
                />
                <Search
                    className="absolute left-3 top-0 h-full text-gray-500 peer-focus:text-gray-900"
                    size={20}
                />
            </label>
        </div>
    );
}
