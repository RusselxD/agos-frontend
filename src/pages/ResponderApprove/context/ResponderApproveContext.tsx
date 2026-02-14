import {
    createContext,
    useContext,
    useState,
    type ReactNode,
    type Dispatch,
    type SetStateAction,
} from "react";
import type { ResponderVerifyRequest } from "../../../types/responder";

interface ResponderApproveContextType {
    responder: ResponderVerifyRequest | null;
    setResponder: Dispatch<SetStateAction<ResponderVerifyRequest | null>>;
    uuid: string | null;
    setUuid: Dispatch<SetStateAction<string | null>>;
}

const ResponderApproveContext =
    createContext<ResponderApproveContextType | null>(null);

export function ResponderApproveProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [responder, setResponder] = useState<ResponderVerifyRequest | null>(
        null,
    );
    const [uuid, setUuid] = useState<string | null>(null);

    return (
        <ResponderApproveContext.Provider
            value={{
                responder,
                setResponder,
                uuid,
                setUuid,
            }}
        >
            {children}
        </ResponderApproveContext.Provider>
    );
}

export function useResponderApprove() {
    const context = useContext(ResponderApproveContext);
    if (!context) {
        throw new Error(
            "useResponderApprove must be used within a ResponderApproveProvider",
        );
    }
    return context;
}
