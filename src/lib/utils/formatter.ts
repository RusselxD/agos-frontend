import type { Dispatch, SetStateAction } from "react";

export const getTimeAgo = (timestamp: string): string => {
    const seconds = Math.floor(
        (new Date().getTime() - new Date(timestamp).getTime()) / 1000,
    );
    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
};

export const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const formatTimestamp = (timestampString: string) => {
    const date = new Date(timestampString);

    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export const normalizePhoneNumber = (input: string): string => {
    // Remove all non-digits
    const digitsOnly = input.replace(/\D/g, "");

    // Handle different input formats
    if (digitsOnly.startsWith("63") && digitsOnly.length === 12) {
        // +639207134335 or 639207134335 -> +639207134335
        return `+${digitsOnly}`;
    } else if (digitsOnly.startsWith("0") && digitsOnly.length === 11) {
        // 09207134335 -> +639207134335
        return `+63${digitsOnly.substring(1)}`;
    } else if (digitsOnly.length > 0) {
        // Any other digits -> +63{digits}
        // 9207134335 -> +639207134335
        // 123 -> +63123
        return `+63${digitsOnly}`;
    } else {
        // Empty input
        return "";
    }
};

export const removeNonDigits = (input: string): string => {
    return input.replace(/\D/g, "");
};

export const determinePhoneMaxLength = (digitsOnly: string): number => {
    let maxLength;
    if (digitsOnly.startsWith("63")) {
        maxLength = 12; // 639XXXXXXXXX (12 digits)
    } else if (digitsOnly.startsWith("0")) {
        maxLength = 11; // 09XXXXXXXXX (11 digits)
    } else if (digitsOnly.startsWith("9")) {
        maxLength = 10; // 9XXXXXXXXX (10 digits)
    } else {
        maxLength = 10; // Default to longest possible
    }
    return maxLength;
};

export const normalizeNumberInput = (
    input: string,
    setPhoneNumber: Dispatch<SetStateAction<string>>,
    setNormalizedPhoneNumber: Dispatch<SetStateAction<string>>,
) => {
    // Remove all non-digits
    const digitsOnly = removeNonDigits(input);

    // Determine max length based on what user is typing
    let maxLength = determinePhoneMaxLength(digitsOnly);

    // Only update if within limit
    if (digitsOnly.length <= maxLength) {
        setPhoneNumber(digitsOnly);
        setNormalizedPhoneNumber(normalizePhoneNumber(digitsOnly));
    }
};

export const formatPHNumber = (phoneNumber: string): string => {
    // This regex looks for the +63 prefix, then captures 3 digits, 3 digits, and 4 digits
    return phoneNumber.replace(/(\+63)(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
};
