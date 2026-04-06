import { db, auth } from './firebase-config.js';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { formatTimestamp } from './utils.js';
import { getBlockedUsers } from './users.js';
import './users.js'; // Ensure window.blockUser hook is exposed globally

// Global array caching posts for frontend filtering
window.allPosts = [];

async function fetchFeed() {
    const feedContainer = document.getElementById("feed-container");
    if (!feedContainer) return;

    try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        // Fetch blocked user array payload dynamically relative to active currentUser
        const blockedUids = await getBlockedUsers();

        window.allPosts = []; // Reset the global array on fresh fetch
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Only accept post if authorId bypasses the blocked mapping array
            if (!blockedUids.includes(data.authorId)) {
                window.allPosts.push({
                    id: doc.id,
                    ...data
                });
            }
        });

        // Trigger the initial rendering utilizing the exact renderPosts
        renderPosts(window.allPosts);

    } catch (error) {
        console.error("Error fetching feed: ", error);
        feedContainer.innerHTML = "<p>Couldn't load feed at this moment.</p>";
    }
}

function renderPosts(postsArray) {
    const feedContainer = document.getElementById("feed-container");
    if (!feedContainer) return;

    feedContainer.innerHTML = ""; // Clean existing DOM completely

    if (postsArray.length === 0) {
        feedContainer.innerHTML = "<p>No posts match your filters.</p>";
        return;
    }

    postsArray.forEach((post) => {
        const readableTime = formatTimestamp(post.timestamp);

        const postElement = document.createElement("div");
        postElement.className = "post-card";
        postElement.id = `post-card-${post.id}`;

        const authorDisplay = post.isAnonymous ? "Anonymous" : (post.displayName || "User");
        const currentLikes = post.likes || 0;

        const isAuthor = auth.currentUser && auth.currentUser.uid === post.authorId;
        const deleteButtonHTML = isAuthor ? `<button onclick="deletePost('${post.id}')" style="color: red; margin-left:10px;">Delete</button>` : "";
        const reportButtonHTML = `<button onclick="reportPost('${post.id}')" style="margin-left:10px;">Report</button>`;

        let blockButtonHTML = "";
        // You cannot block yourself, nor can you block explicit Anonymous mappings inherently
        if (!isAuthor && !post.isAnonymous && post.authorId) {
            blockButtonHTML = `<button onclick="blockUser('${post.authorId}')" style="margin-left:10px; color: orange;">Block</button>`;
        }

        const imageHTML = post.imageURL ? `<div class="post-image-container" style="margin: 10px 0;"><img src="${post.imageURL}" alt="Post image" style="max-width: 100%; border-radius: 8px;"></div>` : "";

        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <span class="category-badge">${post.category}</span>
            <p><strong>By: ${authorDisplay}</strong></p>
            ${imageHTML}
            <p>${post.content}</p>
            <small>Posted on: ${readableTime}</small>
            <div class="post-actions" style="margin-top:10px;">
                <button onclick="likePost('${post.id}')">Like</button>
                <span id="likes-count-${post.id}">${currentLikes}</span> Likes
                ${deleteButtonHTML}
                ${reportButtonHTML}
                ${blockButtonHTML}
            </div>
        `;

        feedContainer.appendChild(postElement);
    });
}

function filterPosts() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const categorySelect = document.getElementById("category-filter").value;

    const filtered = window.allPosts.filter(post => {
        // Title or Content keyword matching
        const matchTitle = (post.title || "").toLowerCase().includes(searchInput);
        const matchContent = (post.content || "").toLowerCase().includes(searchInput);
        const matchesKeyword = matchTitle || matchContent;

        // Category dropdown matching
        const matchesCategory = categorySelect === "All" || post.category === categorySelect;

        return matchesKeyword && matchesCategory;
    });

    renderPosts(filtered);
}

// Hook logic listeners and handle startup rendering gracefully
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");

    // "input" evaluates live keystrokes instantly!
    if (searchInput) searchInput.addEventListener("input", filterPosts);
    // "change" triggers reliably on dropdown interactions
    if (categoryFilter) categoryFilter.addEventListener("change", filterPosts);

    onAuthStateChanged(auth, (user) => {
        fetchFeed();
    });
});
