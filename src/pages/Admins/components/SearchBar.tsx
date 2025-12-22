import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="bg-white p-4 rounded-lg">
            <label className="relative w-96" title="Search Admins">
                <input
                    type="text"
                    placeholder="Search admins"
                    className="w-2/4 pl-10 pr-4 peer bg-gray-100 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
                />
                <Search
                    className="absolute text-gray-500 peer-focus:text-gray-900 left-3 top-0 h-full"
                    size={20}
                />
            </label>
        </div>
    );
}
