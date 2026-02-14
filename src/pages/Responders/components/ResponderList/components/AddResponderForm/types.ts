export interface ResponderEntry {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    normalizedPhoneNumber: string;
}

export const createEmptyResponder = (): ResponderEntry => ({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    normalizedPhoneNumber: "",
});
