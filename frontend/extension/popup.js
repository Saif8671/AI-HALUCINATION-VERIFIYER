// Configuration
const API_BASE_URL = "https://trustguard-backend-5x5q.onrender.com"; // CHANGE THIS TO YOUR DEPLOYED BACKEND URL

// Simple health check for the backend
fetch(`${API_BASE_URL}/`)
    .then(() => {
        const statusEl = document.getElementById('backend-status');
        if (statusEl) {
            statusEl.innerText = "Connected ⚡";
            statusEl.style.color = "#38bdf8";
        }
    })
    .catch(() => {
        const statusEl = document.getElementById('backend-status');
        if (statusEl) {
            statusEl.innerText = "Disconnected ❌";
            statusEl.style.color = "#ef4444";
        }
    });
