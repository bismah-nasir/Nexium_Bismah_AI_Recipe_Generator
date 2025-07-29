// src/lib/format.ts

/**
 * ✅ Converts any string to Sentence Case
 * Example: "lUnCh" → "Lunch"
 */
export function toSentenceCase(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * ✅ Capitalizes each word in a phrase
 * Example: "grilled chicken sandwich" → "Grilled Chicken Sandwich"
 */
export function toTitleCase(str: string) {
    if (!str) return "";
    return str
        .split(" ")
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
}
