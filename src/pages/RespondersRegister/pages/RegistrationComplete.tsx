import { Check, Clock } from "lucide-react";
import AuthFormContainer from "../../../components/common/auth/AuthFormContainer";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useRespondersRegister } from "../context/RespondersRegisterContext";

interface CheckListItemProps {
    children: ReactNode;
    title: string;
    desc: string;
    className?: string;
}

const CheckListItem = ({
    children,
    title,
    desc,
    className,
}: CheckListItemProps) => {
    return (
        <div className={`flex items-center gap-4 ${className}`}>
            {children}

            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-gray-700 text-sm">{desc}</p>
            </div>
        </div>
    );
};

const DetailsContainer = () => {
    return (
        <div className="border border-gray-300 rounded-lg bg-white w-full p-5 space-y-6">
            <CheckListItem
                title="Registration Submitted"
                desc="Your details have been received"
            >
                <div className="rounded-full bg-accent p-2 text-white">
                    <Check className="w-5 h-5" />
                </div>
            </CheckListItem>
            <CheckListItem
                title="Under Admin Review"
                desc="ID and credentials verification in progress"
            >
                <div className="rounded-full bg-amber-100 p-2 text-amber-700">
                    <Clock className="w-5 h-5" />
                </div>
            </CheckListItem>
            <CheckListItem
                title="Account Activated"
                desc="You'll receive SMS alerts"
                className="opacity-50"
            >
                <div className="rounded-full bg-gray-500 p-2 text-white">
                    <Check className="w-5 h-5" />
                </div>
            </CheckListItem>
        </div>
    );
};

export default function RegistrationComplete() {
    const { clearData } = useRespondersRegister();
    const navigate = useNavigate();

    const registerAgain = () => {
        clearData();
        navigate("/responder/register");
    };

    return (
        <AuthFormContainer
            title="REGISTRATION SUBMITTED"
            subtitle="YOUR APPLICATION IS UNDER REVIEW"
            className="!gap-7 -mb-8"
        >
            <DetailsContainer />
            <div className="text-center">
                <p>
                    <span>Estimated review time: </span>
                    <span className="font-semibold">24-48 hours</span>
                </p>
                <p className="text-sm mt-1 text-gray-600">
                    SMS notification will be sent upon decision
                </p>
            </div>
            <button className="btn-submit" onClick={() => registerAgain()}>
                REGISTER ANOTHER RESPONDER
            </button>
        </AuthFormContainer>
    );
}
