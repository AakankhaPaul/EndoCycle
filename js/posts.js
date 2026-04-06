import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { uploadPostImage } from './storage.js';
import { customAlert, customConfirm, customPrompt } from "./ui.js";

async function createPost(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Read values from the form
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;
    const category = document.getElementById("post-category").value; // Added category extraction
    const isAnonymous = document.getElementById("post-anonymous")?.checked || false;
    const imageFile = document.getElementById("post-image").files[0];

    try {
        const postsRef = collection(db, "posts");

        // Ensure user is logged in (auth.currentUser will be null if not)
        const currentUser = auth.currentUser;
        if (!currentUser) {
            customAlert("You must be logged in to create a post.");
            return;
        }

        const displayName = isAnonymous ? "Anonymous" : (currentUser.displayName || "User");

        let imageURL = null;
        if (imageFile) {
            imageURL = await uploadPostImage(imageFile);
        }

        // Save into Firestore posts collection
        const docRef = await addDoc(postsRef, {
            title: title,
            imageURL: imageURL,
            content: content,
            category: category,    // Save the new category field
            timestamp: serverTimestamp(), // Explicit timestamp field added 
            isAnonymous: isAnonymous,
            likes: 0,
            displayName: displayName,
            authorId: currentUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        console.log("Post successfully created with ID: ", docRef.id);
        customAlert("Post submitted successfully!");

        // Reset the form
        document.getElementById("create-post-form").reset();
    } catch (error) {
        console.error("Error creating post: ", error);
        customAlert("Failed to submit post.");
    }
}

// Attach the listener on form submit
document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.getElementById("create-post-form");
    if (postForm) {
        postForm.addEventListener("submit", createPost);
    }
});

// Expose globally for feed inline onclick
window.likePost = async function (postId) {
    try {
        const postRef = doc(db, "posts", postId);

        await updateDoc(postRef, {
            likes: increment(1)
        });

        // Instant DOM update
        const likesCountSpan = document.getElementById(`likes-count-${postId}`);
        if (likesCountSpan) {
            const currentCount = parseInt(likesCountSpan.innerText) || 0;
            likesCountSpan.innerText = currentCount + 1;
        }
    } catch (error) {
        console.error("Error liking post: ", error);
        customAlert("Couldn't like the post. Please try again.");
    }
};

// Expose globally for feed inline onclick
window.deletePost = async function (postId) {
    const confirmDelete = await customConfirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
        const postRef = doc(db, "posts", postId);

        await deleteDoc(postRef);

        // Remove from DOM immediately
        const postElement = document.getElementById(`post-card-${postId}`);
        if (postElement) {
            postElement.remove();
        }

    } catch (error) {
        console.error("Error deleting post: ", error);
        customAlert("Could not delete the post. Please try again.");
    }
};

// Expose globally for feed inline onclick
window.reportPost = async function (postId) {
    if (!auth.currentUser) {
        customAlert("You must be logged in to report a post.");
        return;
    }

    const reason = await customPrompt("Optional: Please provide a reason for reporting this post:");
    // If the user clicks "Cancel" on the prompt, abort the process
    if (reason === null) return;

    try {
        const reportsRef = collection(db, "reports");

        await addDoc(reportsRef, {
            postId: postId,
            reportedBy: auth.currentUser.uid,
            reason: reason,
            createdAt: serverTimestamp()
        });

        customAlert("Post reported successfully! Our moderation team will review this shortly.");
    } catch (error) {
        console.error("Error reporting post: ", error);
        customAlert("Could not report the post at this time. Please try again later.");
    }
};
