import { db, auth } from './firebase-config.js';
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { customAlert, customConfirm } from "./ui.js";

/**
 * Fetches the array of blocked user UIDs for the current logged in user.
 * @returns {Promise<Array<string>>} Array of blocked UIDs.
 */
export async function getBlockedUsers() {
    if (!auth.currentUser) return [];

    try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data().blockedUsers || [];
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching blocked users:", error);
        return [];
    }
}

/**
 * Blocks a target user by adding their UID to the current user's explicit block array.
 * @param {string} targetUid - The UID of the user to block.
 */
window.blockUser = async function (targetUid) {
    if (!auth.currentUser) {
        customAlert("You must be logged in to block a user.");
        return;
    }

    const confirmBlock = await customConfirm("Are you sure you want to block this user? You will no longer see their posts.");
    if (!confirmBlock) return;

    try {
        const userRef = doc(db, "users", auth.currentUser.uid);

        // setDoc with { merge: true } safely applies arrayUnion even if the parent User document hasn't been instantiated yet
        await setDoc(userRef, {
            blockedUsers: arrayUnion(targetUid)
        }, { merge: true });

        customAlert("User blocked successfully. Applying filtering parameters...");

        // Reload to let fetchFeed pull fresh parameters
        if (typeof window.location.reload === 'function') {
            window.location.reload();
        }
    } catch (error) {
        console.error("Error blocking user:", error);
        customAlert("Could not block the user. Please try again.");
    }
};
