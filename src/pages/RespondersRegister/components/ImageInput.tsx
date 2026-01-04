import { CloudUpload } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import { useRespondersRegister } from "../context/RespondersRegisterContext";
import type { ChangeEvent, DragEvent } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return "Only PNG and JPG files are allowed.";
    }
    if (file.size > MAX_FILE_SIZE) {
        return "File size must not exceed 10MB.";
    }
    return null;
};

export default function ImageInput() {
    const { setIDPhoto } = useRespondersRegister();
    const { toastError } = useToast();

    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            const file = droppedFiles[0];
            const validationError = validateFile(file);
            if (validationError) {
                toastError(validationError);
                return;
            }
            setIDPhoto(file);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const file = selectedFiles[0];
            const validationError = validateFile(file);
            if (validationError) {
                toastError(validationError);
                return;
            }
            setIDPhoto(file);
        }
    };

    return (
        <form className="w-full flex flex-col gap-2">
            <label
                className="border-2 border-dashed bg-slate-50 flex flex-col gap-4 items-center justify-center cursor-pointer rounded-lg py-8 active:bg-slate-100 lg:hover:bg-slate-100 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <CloudUpload className="w-16 h-16 text-gray-400" />
                <p>
                    <span className="text-accent font-semibold">
                        Click to upload
                    </span>
                    <span> or drag and drop</span>
                </p>
                <p className="text-gray-500 font-medium">
                    PNG, JPG, up to 10MB
                </p>
                <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={handleChange}
                />
            </label>
        </form>
    );
}
