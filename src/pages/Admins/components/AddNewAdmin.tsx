import { useEffect, useRef, useState, type FormEvent } from "react";
import TextInputField from "../../../components/common/auth/TextInputField";
import { useAdmins } from "../context/AdminsPageContext";
import PhoneNumberInput from "../../../components/common/auth/PhoneNumberInput";
import { normalizeNumberInput } from "../../../lib/utils/formatter";
import { Wand2, Copy, AlertCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { adminUsersAPI } from "../../../lib/api/adminUser";
import type {
    AdminUserCreateRequest,
    AdminUserResponse,
} from "../../../types/adminUser";
import { useToast } from "../../../context/ToastContext";
import axios from "axios";

const generateRandomPassword = (): string => {
    const length = 10;
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

export default function AddNewAdmin() {
    const { createNewAdminIsOpen, setCreateNewAdminIsOpen } = useAdmins();
    const containerRef = useRef<HTMLFormElement>(null);

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");

    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [normalizedPhoneNumber, setNormalizedPhoneNumber] =
        useState<string>("");
    const [temporaryPassword, setTemporaryPassword] = useState<string>("");
    const [copied, setCopied] = useState<boolean>(false);

    const { addNewAdmin, triggerLogRefetch } = useAdmins();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { toastSuccess } = useToast();
    const [error, setError] = useState<string>("");

    const handleInputNumber = (input: string) => {
        normalizeNumberInput(input, setPhoneNumber, setNormalizedPhoneNumber);
    };

    const handleGeneratePassword = () => {
        setTemporaryPassword(generateRandomPassword());
        setCopied(false);
    };

    const handleCopyPassword = async () => {
        if (temporaryPassword) {
            await navigator.clipboard.writeText(temporaryPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCancel = () => {
        clearEntireForm();
        setCreateNewAdminIsOpen(false);
    };

    const clearEntireForm = () => {
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setNormalizedPhoneNumber("");
        setTemporaryPassword("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            !firstName ||
            !lastName ||
            normalizedPhoneNumber.length <= 12 ||
            !temporaryPassword
        ) {
            return;
        }

        try {
            setIsSubmitting(true);

            const newAdmin: AdminUserResponse =
                await adminUsersAPI.createAdminUser({
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: normalizedPhoneNumber,
                    password: temporaryPassword,
                    created_by: user?.sub,
                } as AdminUserCreateRequest);

            // Add to context's list of admins
            addNewAdmin(newAdmin);

            // Trigger logs refetch
            triggerLogRefetch();

            // Remove focus from any input fields
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }

            clearEntireForm();
            toastSuccess("New admin created successfully.");
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                setError(
                    error?.response?.data?.detail ||
                        "Failed to create new admin. Please try again.",
                );
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormFieldsChange = () => {
        if (error) {
            setError("");
        }
    };

    // Scroll into view when opened
    useEffect(() => {
        if (createNewAdminIsOpen && containerRef.current) {
            // Small delay to allow the container to start expanding
            setTimeout(() => {
                const el = containerRef.current;
                if (!el) return;

                const offset = 40; // offset from top

                const top =
                    el.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top,
                    behavior: "smooth",
                });
            }, 100);
        }
    }, [createNewAdminIsOpen]);

    return (
        <form
            onSubmit={(e) => handleSubmit(e)}
            onChange={() => handleFormFieldsChange()}
            ref={containerRef}
            id="new-admin-container"
            className={`w-full bg-white rounded-lg overflow-hidden transition-all text-sm duration-200 ${
                createNewAdminIsOpen ? "max-h-[600px] mb-3 p-6" : "max-h-0 p-0"
            }`}
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Add New Admin
            </h2>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Left Column */}
                <div className="flex-1 space-y-4">
                    <TextInputField
                        value={firstName}
                        setValue={setFirstName}
                        label="FIRST NAME"
                        placeholder="Enter first name"
                    />
                    <TextInputField
                        value={lastName}
                        setValue={setLastName}
                        label="LAST NAME"
                        placeholder="Enter last name"
                    />
                    <PhoneNumberInput
                        phoneNumber={phoneNumber}
                        handleInputNumber={handleInputNumber}
                        normalizedPhoneNumber={normalizedPhoneNumber}
                    />
                </div>

                {/* Right Column */}
                <div className="flex-1">
                    {/* Temporary Password */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            TEMPORARY PASSWORD
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 font-mono text-sm min-h-[42px] flex items-center">
                                {temporaryPassword || (
                                    <span className="text-gray-400">
                                        Click generate to create password
                                    </span>
                                )}
                            </div>
                            {temporaryPassword && (
                                <button
                                    type="button"
                                    onClick={() => handleCopyPassword()}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                                        copied
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                    }`}
                                >
                                    <Copy className="w-4 h-4" />
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleGeneratePassword}
                            className="flex items-center gap-2 mt-2 text-purple-500 hover:text-purple-600 cursor-pointer"
                        >
                            <Wand2 className="w-4 h-4" />
                            <span>Generate</span>
                        </button>
                    </div>

                    {/* Security Warning */}
                    {temporaryPassword && (
                        <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-md p-3">
                            <AlertCircle className="text-amber-600 flex-shrink-0" />
                            <p className="text-sm leading-6 text-amber-800">
                                <span className="font-semibold">
                                    Important:
                                </span>{" "}
                                Copy this temporary password now. For security
                                reasons, it won't be shown again after creating
                                the admin account.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div
                className={`flex items-end gap-3 text-sm ${
                    error ? "justify-between" : "justify-end"
                }`}
            >
                {error && (
                    <div className="border border-red-600 bg-red-100 text-red-800 px-5 py-2 rounded-md font-medium">
                        {error}
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={
                            !firstName ||
                            !lastName ||
                            normalizedPhoneNumber.length <= 12 ||
                            !temporaryPassword
                        }
                        className="btn-submit px-4 w-fit rounded-md"
                    >
                        {isSubmitting && (
                            <div className="spinner w-5 h-5"></div>
                        )}
                        <span>
                            {isSubmitting ? "Creating..." : "Create Admin"}
                        </span>
                    </button>
                </div>
            </div>
        </form>
    );
}
