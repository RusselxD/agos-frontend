import { RefreshCcw } from "lucide-react";
import { useRespondersRegister } from "../context/RespondersRegisterContext";

export default function ImagePlaceholder() {
    const { IDPhoto, setIDPhoto } = useRespondersRegister();

    // assurance for TS
    if (!IDPhoto) return null;

    return (
        <div className="w-full">
            <img
                src={URL.createObjectURL(IDPhoto)}
                alt="ID Preview"
                className="w-full max-h-56 rounded-md object-cover"
            />

            <button
                onClick={() => setIDPhoto(null)}
                className="text-gray-600 active:text-gray-900 lg:hover:text-gray-900 transition-colors flex items-center justify-center gap-1 text-sm py-2 px-2 -ml-2 mt-1"
            >
                <RefreshCcw className="h-5" />
                <span>Change Photo</span>
            </button>
        </div>
    );
}
