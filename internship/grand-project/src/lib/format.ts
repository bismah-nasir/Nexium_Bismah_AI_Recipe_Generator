// src/lib/format.ts

/**
 * ✅ Converts any string to Sentence Case
 * Example: "lUnCh" → "Lunch"
 */
export function toSentenceCase(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
