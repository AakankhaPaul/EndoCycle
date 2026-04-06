import { storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploads an image file to Firebase storage.
 * @param {File} file - The image file to upload
 * @returns {Promise<string|null>} The download URL of the uploaded image
 */
export async function uploadPostImage(file) {
    if (!file) return null;

    try {
        // Create a unique filename using timestamp
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name}`;

        // Create a reference to 'post-images/filename'
        const storageRef = ref(storage, `post-images/${filename}`);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get and return the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}
