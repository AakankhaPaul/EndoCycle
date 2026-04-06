/**
 * Formats a Firestore Timestamp locally using the Indian locale (en-IN).
 * Output format: "3 Apr 2025, 10:30 AM"
 * 
 * @param {Object} firestoreTimestamp - The timestamp received from Firestore
 * @returns {string} Human-readable time string
 */
export function formatTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp) return "Unknown Date";

    // Convert Firestore Timestamp into a standard JavaScript Date object
    const date = firestoreTimestamp.toDate();

    return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
