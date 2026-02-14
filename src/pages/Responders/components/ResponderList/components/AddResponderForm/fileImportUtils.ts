import type { ResponderEntry } from "./types";

// Normalize column names to match expected fields
const normalizeColumnName = (col: string): string => {
    const normalized = col.toLowerCase().replace(/[\s_-]+/g, "");
    if (normalized.includes("first") && normalized.includes("name"))
        return "firstName";
    if (normalized.includes("last") && normalized.includes("name"))
        return "lastName";
    if (normalized.includes("phone") || normalized.includes("number"))
        return "phoneNumber";
    return normalized;
};

// Parse a row from imported file to ResponderEntry
export const parseRowToResponder = (
    row: Record<string, string>,
): ResponderEntry | null => {
    const mapped: Record<string, string> = {};

    for (const [key, value] of Object.entries(row)) {
        const normalizedKey = normalizeColumnName(key);
        mapped[normalizedKey] = String(value || "").trim();
    }

    const firstName = mapped.firstName || "";
    const lastName = mapped.lastName || "";
    const rawPhone = mapped.phoneNumber || "";

    if (!firstName && !lastName && !rawPhone) return null;

    // Normalize phone number - remove non-digits
    let phoneDigits = rawPhone.replace(/\D/g, "");

    // Handle different formats: +639XX, 639XX, 09XX, 9XX
    if (phoneDigits.startsWith("63") && phoneDigits.length >= 12) {
        phoneDigits = phoneDigits.slice(2); // Remove 63 prefix
    } else if (phoneDigits.startsWith("0") && phoneDigits.length >= 11) {
        phoneDigits = phoneDigits.slice(1); // Remove leading 0
    }

    // Ensure it's 10 digits (9XXXXXXXXX)
    if (phoneDigits.length > 10) {
        phoneDigits = phoneDigits.slice(-10);
    }

    return {
        firstName,
        lastName,
        phoneNumber: phoneDigits,
        normalizedPhoneNumber:
            phoneDigits.length === 10 ? `+63${phoneDigits}` : "",
    };
};
