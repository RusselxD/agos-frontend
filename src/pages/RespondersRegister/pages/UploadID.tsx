import AuthFormContainer from "../../../components/common/auth/AuthFormContainer";
import { useEffect, useState } from "react";
import { useRespondersRegister } from "../context/RespondersRegisterContext";
import type { UploadResponse } from "../../../types/upload";
import { uploadAPI } from "../../../lib/api/upload";
import ImagePlaceholder from "../components/ImagePlaceholder";
import ImageInput from "../components/ImageInput";
import type { ResponderCreateRequest } from "../../../types/responder";
import { responderAPI } from "../../../lib/api/responder";
import { useToast } from "../../../context/ToastContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AcceptedIDs = () => {
    return (
        <div className="py-3 w-full bg-blue-50 border-l-4 border-blue-500 px-4 text-sm">
            <p className="font-semibold mb-1">Accepted IDs: </p>
            <span>
                PhilID, ePhilID, Passport, UMID, SSS, GSIS, Driver’s License,
                PRC, IBP, Voter’s ID, Senior Citizen ID, PWD ID, Postal ID,
                PhilHealth, TIN, NBI, ACR, OWWA
            </span>
        </div>
    );
};

export default function UploadID() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        firstName,
        lastName,
        normalizedPhoneNumber,
        IDPhoto,
        registrationCompleted,
        setRegistrationCompleted,
    } = useRespondersRegister();

    const { toastError } = useToast();
    const navigate = useNavigate();

    // Navigate to registration complete if already done
    useEffect(() => {
        if (registrationCompleted) {
            navigate("/responder/registration-complete");
        }
    }, [registrationCompleted, navigate]);

    const uploadIDPhoto = async (): Promise<string> => {
        if (!IDPhoto) return "";

        try {
            const res: UploadResponse = await uploadAPI.uploadResponderID(
                IDPhoto
            );
            return res.file_path;
        } catch (error) {
            throw error;
        }
    };

    const handleCompleteRegistration = async () => {
        if (!IDPhoto) return;

        try {
            setIsLoading(true);
            const filePath = await uploadIDPhoto();

            const responderCreatePayload = {
                first_name: firstName,
                last_name: lastName,
                phone_number: normalizedPhoneNumber,
                id_photo_path: filePath,
            } as ResponderCreateRequest;

            await responderAPI.createResponder(responderCreatePayload);

            // On successful complete registration, modify the flag variable and it will automatically navigate (via useEffect above)
            setRegistrationCompleted(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toastError(
                    error.message ||
                        "Failed to complete registration. Please try again."
                );
            } else {
                toastError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthFormContainer
            title="UPLOAD YOUR ID"
            subtitle="UPLOAD YOUR VALID ID FOR VERIFICATION"
            className="!gap-3 -mb-4"
        >
            {IDPhoto ? <ImagePlaceholder /> : <ImageInput />}
            <AcceptedIDs />
            <button
                disabled={isLoading || !IDPhoto}
                onClick={() => handleCompleteRegistration()}
                className="btn-submit"
            >
                {isLoading && <div className="spinner w-5 h-5"></div>}
                <span>COMPLETE REGISTRATION</span>
            </button>
        </AuthFormContainer>
    );
}
