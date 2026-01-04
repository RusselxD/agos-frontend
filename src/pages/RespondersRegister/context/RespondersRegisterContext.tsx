import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface RespondersRegisterContextValue {
    firstName: string;
    lastName: string;
    normalizedPhoneNumber: string;
    IDPhoto: File | null;

    initialDataIsFilled: boolean;
    otpIsVerified: boolean;
    registrationCompleted: boolean;

    setFirstName: Dispatch<SetStateAction<string>>;
    setLastName: Dispatch<SetStateAction<string>>;
    setNormalizedPhoneNumber: Dispatch<SetStateAction<string>>;
    setIDPhoto: Dispatch<SetStateAction<File | null>>;

    setInitialDataIsFilled: Dispatch<SetStateAction<boolean>>;
    setOtpIsVerified: Dispatch<SetStateAction<boolean>>;
    setRegistrationCompleted: Dispatch<SetStateAction<boolean>>;

    clearData: () => void;
}

const RespondersRegisterContext = createContext<
    RespondersRegisterContextValue | undefined
>(undefined);

export function RespondersRegisterProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [normalizedPhoneNumber, setNormalizedPhoneNumber] =
        useState<string>("");
    const [IDPhoto, setIDPhoto] = useState<File | null>(null);

    const [initialDataIsFilled, setInitialDataIsFilled] =
        useState<boolean>(false);
    const [otpIsVerified, setOtpIsVerified] = useState<boolean>(false);
    const [registrationCompleted, setRegistrationCompleted] =
        useState<boolean>(false);

    const clearData = () => {
        setFirstName("");
        setLastName("");
        setNormalizedPhoneNumber("");
        setIDPhoto(null);
        setInitialDataIsFilled(false);
        setOtpIsVerified(false);
        setRegistrationCompleted(false);
    };

    useEffect(() => {
        if (!initialDataIsFilled) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            return "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [firstName, lastName, normalizedPhoneNumber]);

    const contextValue = useMemo(
        () => ({
            firstName,
            lastName,
            normalizedPhoneNumber,
            IDPhoto,

            initialDataIsFilled,
            otpIsVerified,
            registrationCompleted,

            setFirstName,
            setLastName,
            setNormalizedPhoneNumber,

            setInitialDataIsFilled,
            setOtpIsVerified,
            setRegistrationCompleted,

            setIDPhoto,
            clearData,
        }),
        [
            firstName,
            lastName,
            normalizedPhoneNumber,
            IDPhoto,
            initialDataIsFilled,
            otpIsVerified,
            registrationCompleted,
        ]
    );

    return (
        <RespondersRegisterContext.Provider value={contextValue}>
            {children}
        </RespondersRegisterContext.Provider>
    );
}

export const useRespondersRegister = () => {
    const context = useContext(RespondersRegisterContext);
    if (context === undefined) {
        throw new Error(
            "useRespondersRegister must be used within a RespondersRegisterProvider"
        );
    }
    return context;
};
