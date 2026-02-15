// Configuration
const API_BASE_URL = "http://localhost:8000"; // UNCOMMENT FOR LOCAL DEV
// const API_BASE_URL = "https://trustguard-backend-5x5q.onrender.com"; // CHANGE THIS TO YOUR DEPLOYED BACKEND URL


chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "verifySelection",
        title: "Verify with TrustGuard AI",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "verifySelection") {
        chrome.tabs.sendMessage(tab.id, { action: "openModalWithText", text: info.selectionText }, (response) => {
            if (chrome.runtime.lastError) {
                console.warn("Could not send message to tab. Content script might not be loaded.");
                // Fallback: Try to inject the content script if it's missing
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["content.js"]
                }).then(() => {
                    chrome.tabs.sendMessage(tab.id, { action: "openModalWithText", text: info.selectionText });
                }).catch(err => console.error("Failed to inject content script:", err));
            }
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "verifyText") {
        console.log("Background: Received verifyText request");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.log("Background: Request timed out");
            controller.abort();
        }, 45000); // 45 second timeout

        fetch(`${API_BASE_URL}/api/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: request.text }),
            signal: controller.signal
        })
            .then(response => {
                clearTimeout(timeoutId);
                console.log("Background: Received response from backend", response.status);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log("Background: Sending data back to content script");
                sendResponse({ success: true, data });
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.error("Background: Fetch Error:", error);
                sendResponse({
                    success: false,
                    error: error.name === 'AbortError' ? 'Request timed out (Backend took too long)' : error.message
                });
            });
        return true; // Keep the message channel open for async response
    }
});
