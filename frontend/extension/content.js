<<<<<<< HEAD
/**
 * TrustGuard AI - Content Script
 * Handles text selection, UI injection, and communication with background script.
 * 
 * We use a Shadow DOM to isolate our styles from the host website, ensuring
 * that TrustGuard's UI looks consistent regardless of the site's CSS.
 */

(function() {
    // 1. Create Shadow DOM Container
    const container = document.createElement('div');
    container.id = 'tg-root';
    document.body.appendChild(container);
    const shadow = container.attachShadow({ mode: 'open' });

    // 2. Inject Styles into Shadow DOM
    const style = document.createElement('style');
    style.textContent = `
        :host {
            all: initial; /* Reset all inherited styles */
        }
        .tg-verify-btn {
            position: fixed;
            display: none;
            z-index: 2147483647;
            background: #0f172a;
            color: white;
            border: 1px solid #38bdf8;
            border-radius: 10px;
            padding: 10px 18px;
            cursor: pointer;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
            transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
            line-height: 1;
            white-space: nowrap;
            align-items: center;
        }
        .tg-verify-btn:hover {
            background: #1e293b;
            transform: translateY(-2px);
            box-shadow: 0 15px 30px -5px rgba(0,0,0,0.6);
        }
        .tg-modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(4px);
            z-index: 2147483646;
            display: none;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .tg-modal {
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 12px;
            width: 90%;
            max-width: 450px;
            max-height: 80vh;
            overflow-y: auto;
            color: #f8fafc;
            font-family: system-ui, sans-serif;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
        }
        .tg-modal-header {
            padding: 16px;
            border-bottom: 1px solid #1e293b;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #1e293b;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .tg-close-btn {
            background: none; border: none; color: #94a3b8;
            cursor: pointer; font-size: 20px;
        }
        .tg-modal-body { padding: 20px; }
        .tg-claim-card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
        }
        .tg-status {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        .tg-status-verified { background: #064e3b; color: #34d399; }
        .tg-status-uncertain { background: #451a03; color: #fbbf24; }
        .tg-status-hallucinated { background: #450a0a; color: #f87171; }
        .tg-spinner {
            width: 30px; height: 30px;
            border: 3px solid rgba(56, 189, 248, 0.2);
            border-top-color: #38bdf8;
            border-radius: 50%;
            animation: tg-spin 0.8s linear infinite;
            margin: 20px auto;
        }
        @keyframes tg-spin { to { transform: rotate(360deg); } }
    `;
    shadow.appendChild(style);

    // 3. Create UI Elements inside Shadow DOM
    const verifyBtn = document.createElement("button");
    verifyBtn.className = "tg-verify-btn";
    verifyBtn.style.display = "flex";
    verifyBtn.style.alignItems = "center";
    verifyBtn.style.gap = "8px";
    
    const btnIcon = document.createElement("img");
    btnIcon.src = chrome.runtime.getURL("logo.png");
    btnIcon.style.width = "22px";
    btnIcon.style.height = "22px";
    btnIcon.style.borderRadius = "2px";
    
    const btnText = document.createElement("span");
    btnText.textContent = "Verify with TrustGuard";
    
    verifyBtn.appendChild(btnIcon);
    verifyBtn.appendChild(btnText);
    verifyBtn.style.display = "none"; // Hide initially
    shadow.appendChild(verifyBtn);

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "tg-modal-overlay";
    
    const modal = document.createElement("div");
    modal.className = "tg-modal";
    
    const header = document.createElement("div");
    header.className = "tg-modal-header";
    
    const title = document.createElement("div");
    title.style.cssText = "font-weight:bold; display:flex; align-items:center; gap:8px;";
    
    const titleIcon = document.createElement("img");
    titleIcon.src = chrome.runtime.getURL("logo.png");
    titleIcon.style.width = "32px";
    titleIcon.style.height = "32px";
    titleIcon.style.borderRadius = "4px";
    
    const titleText = document.createElement("span");
    titleText.textContent = "TrustGuard Analysis";
    
    title.appendChild(titleIcon);
    title.appendChild(titleText);
    
    const closeBtn = document.createElement("button");
    closeBtn.className = "tg-close-btn";
    closeBtn.textContent = "✕";
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    const resultsContainer = document.createElement("div");
    resultsContainer.className = "tg-modal-body";
    resultsContainer.id = "tg-results";
    
    modal.appendChild(header);
    modal.appendChild(resultsContainer);
    modalOverlay.appendChild(modal);
    shadow.appendChild(modalOverlay);

    // 4. Logic
    let selectedText = "";

    const hideModal = function() {
        modalOverlay.style.opacity = "0";
        setTimeout(function() { modalOverlay.style.display = "none"; }, 300);
    };

    closeBtn.onclick = hideModal;
    modalOverlay.onclick = function(e) { if (e.target === modalOverlay) hideModal(); };

    // Handle messages from background script (e.g., from context menu)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "openModalWithText") {
            selectedText = request.text;
            startVerification();
        }
    });

    document.addEventListener("mouseup", function(e) {
        // Small delay to allow selection to stabilize
        setTimeout(() => {
            const selection = window.getSelection();
            const text = selection.toString().trim();
            
            if (text.length > 10) {
                console.log("TrustGuard: Text selected, showing button");
                selectedText = text;
                try {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    
                    verifyBtn.style.display = "flex";
                    
                    // Position logic: Center horizontally under selection
                    const btnWidth = verifyBtn.offsetWidth || 200;
                    let left = rect.left + (rect.width / 2) - (btnWidth / 2);
                    
                    // Keep within viewport bounds
                    left = Math.max(10, Math.min(left, window.innerWidth - btnWidth - 10));
                    
                    verifyBtn.style.top = (rect.bottom + 15) + "px";
                    verifyBtn.style.left = left + "px";
                } catch(err) {
                    console.error("TrustGuard: Could not position button", err);
                }
            } else {
                // Check if click was outside the shadow root
                if (!container.contains(e.target)) {
                    verifyBtn.style.display = "none";
                }
            }
        }, 10);
    });

    document.addEventListener("mousedown", function(e) {
        if (!container.contains(e.target)) {
            verifyBtn.style.display = "none";
        }
    });

    function startVerification() {
        verifyBtn.style.display = "none";
        modalOverlay.style.display = "flex";
        modalOverlay.offsetHeight;
        modalOverlay.style.opacity = "1";
        
        resultsContainer.innerHTML = `
            <div style="text-align:center;">
                <div class="tg-spinner"></div>
                <p style="color:#94a3b8; font-size:13px;">Analyzing claims...</p>
                <p style="color:#475569; font-size:11px; margin-top:10px;">This may take up to 30 seconds</p>
            </div>
        `;

        chrome.runtime.sendMessage({ action: "verifyText", text: selectedText }, function(response) {
            if (chrome.runtime.lastError || !response || !response.success) {
                var errMsg = "Backend unreachable. Please check your internet connection or try again later.";
                if (chrome.runtime.lastError) errMsg = chrome.runtime.lastError.message;
                else if (response && response.error) errMsg = response.error;
                
                resultsContainer.innerHTML = `
                    <div style="text-align:center; color:#f87171; padding:20px;">
                        <div style="font-size:24px; margin-bottom:10px;">⚠️</div>
                        <p><strong>Verification Failed</strong></p>
                        <p style="font-size:12px; color:#94a3b8; margin-top:8px;">${errMsg}</p>
                        <button id="tg-retry-btn" style="margin-top:15px; background:#1e293b; border:1px solid #334155; color:white; padding:6px 12px; border-radius:4px; cursor:pointer; font-size:12px;">Retry</button>
                    </div>
                `;
                
                const retryBtn = shadow.getElementById('tg-retry-btn');
                if (retryBtn) retryBtn.onclick = startVerification;
                return;
            }

            var data = response.data;
            if (!data) {
                resultsContainer.innerHTML = '<div style="text-align:center; padding:20px; color:#f87171;">Invalid response from server.</div>';
                return;
            }
            
            // Dynamic color coding based on the trust score
            var score = data.overallScore || 0;
            var scoreColor = "#38bdf8"; // Default blue
            if (score >= 80) scoreColor = "#22c55e"; // Verified (Green)
            else if (score >= 50) scoreColor = "#fbbf24"; // Uncertain (Yellow)
            else scoreColor = "#f87171"; // Hallucinated (Red)
            
            var html = '<div style="text-align:center; margin-bottom:20px;"><div style="font-size:32px; font-weight:bold; color:' + scoreColor + ';">' + score + '%</div><div style="font-size:12px; color:#94a3b8; text-transform:uppercase; letter-spacing:1px;">Trust Score</div></div>';

            if (data.claims && data.claims.length > 0) {
                data.claims.forEach(function(c) {
                    var statusClass = (c.status || "uncertain").toLowerCase();
                    html += '<div class="tg-claim-card">';
                    html += '<div class="tg-status tg-status-' + statusClass + '">' + c.status + '</div>';
                    html += '<div style="font-size:14px; margin-bottom:8px;">"' + c.text + '"</div>';
                    if (c.explanation) {
                        html += '<div style="font-size:12px; color:#94a3b8; margin-bottom:8px;">' + c.explanation + '</div>';
                    }
                    if (c.sourceUrl) {
                        html += '<a href="' + c.sourceUrl + '" target="_blank" style="color:#38bdf8; font-size:12px; text-decoration:none;">🔗 Source: ' + (c.source || 'View Evidence') + '</a>';
                    }
                    html += '</div>';
                });
            } else {
                html += '<div style="text-align:center; padding:20px; color:#94a3b8; font-size:14px;">No specific factual claims were detected in this text.</div>';
            }

            if (data.citations && data.citations.length > 0) {
                html += '<div style="margin:15px 0 10px; font-weight:bold; font-size:13px; color:#94a3b8;">CITATIONS</div>';
                data.citations.forEach(function(cit) {
                    var color = cit.exists ? '#34d399' : '#f87171';
                    var label = cit.exists ? '✓ Found' : '✗ Not Found';
                    html += '<div style="font-size:12px; padding:8px; border-left:2px solid ' + color + '; background:rgba(255,255,255,0.03); margin-bottom:5px;">';
                    html += '<div style="font-weight:bold; color:' + color + ';">' + label + '</div>';
                    html += '<div>' + cit.text + '</div>';
                    html += '</div>';
                });
            }

            resultsContainer.innerHTML = html;
        });
    }

    verifyBtn.addEventListener("click", startVerification);
})();

=======
```javascript
console.log("TrustGuard AI Content Script Loaded");

// Inject Custom Styles for the Modal and Button
const style = document.createElement('style');
style.textContent = `
    .tg - verify - btn {
    position: absolute;
    display: none;
    z - index: 2147483647;
    background: #0f172a;
    color: white;
    border: 1px solid #38bdf8;
    border - radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
    font - family: 'Inter', system - ui, sans - serif;
    font - size: 13px;
    font - weight: 500;
    box - shadow: 0 4px 6px - 1px rgba(0, 0, 0, 0.1), 0 2px 4px - 1px rgba(0, 0, 0, 0.06);
    transition: all 0.2s;
    backdrop - filter: blur(8px);
}
    .tg - verify - btn:hover {
    background: #1e293b;
    transform: translateY(-1px);
    box - shadow: 0 10px 15px - 3px rgba(0, 0, 0, 0.1);
}
    
    .tg - modal - overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100 %;
    height: 100 %;
    background: rgba(15, 23, 42, 0.6);
    backdrop - filter: blur(4px);
    z - index: 2147483646;
    display: flex;
    justify - content: center;
    align - items: center;
    opacity: 0;
    transition: opacity 0.3s;
}
    
    .tg - modal {
    background: #0f172a;
    border: 1px solid #334155;
    border - radius: 12px;
    width: 90 %;
    max - width: 500px;
    max - height: 80vh;
    overflow - y: auto;
    color: #f8fafc;
    font - family: 'Inter', system - ui, sans - serif;
    box - shadow: 0 20px 25px - 5px rgba(0, 0, 0, 0.1), 0 10px 10px - 5px rgba(0, 0, 0, 0.04);
    transform: scale(0.95);
    transition: transform 0.3s;
}
    
    .tg - modal - header {
    padding: 16px;
    border - bottom: 1px solid #1e293b;
    display: flex;
    justify - content: space - between;
    align - items: center;
    background: #1e293b;
    border - radius: 12px 12px 0 0;
}
    
    .tg - modal - title {
    font - weight: 600;
    font - size: 16px;
    color: #f8fafc;
    display: flex;
    align - items: center;
    gap: 8px;
}
    
    .tg - close - btn {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 4px;
    border - radius: 4px;
    transition: color 0.2s;
}
    .tg - close - btn:hover { color: #f8fafc; background: #334155; }
    
    .tg - modal - body {
    padding: 16px;
}

    .tg - claim - card {
    background: #1e293b;
    border: 1px solid #334155;
    border - radius: 8px;
    padding: 12px;
    margin - bottom: 12px;
}
    
    .tg - status {
    display: inline - block;
    padding: 2px 8px;
    border - radius: 12px;
    font - size: 11px;
    font - weight: 600;
    text - transform: uppercase;
    margin - bottom: 8px;
}
    
    .tg - status - verified { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
    .tg - status - misleading { background: rgba(234, 179, 8, 0.1); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.2); }
    .tg - status - hallucination { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
    .tg - status - unverifiable { background: rgba(148, 163, 184, 0.1); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.2); }

    .tg - claim - text {
    font - size: 14px;
    line - height: 1.5;
    margin - bottom: 8px;
    color: #e2e8f0;
}

    .tg - source - link {
    font - size: 12px;
    color: #38bdf8;
    text - decoration: none;
    display: block;
    margin - top: 5px;
    overflow: hidden;
    text - overflow: ellipsis;
    white - space: nowrap;
}
    
    .tg - source - link:hover { text - decoration: underline; }
`;
document.head.appendChild(style);

// Create Floating Button
const verifyBtn = document.createElement("button");
verifyBtn.className = "tg-verify-btn";
verifyBtn.innerHTML = `
    < span style = "font-size: 14px; vertical-align: middle;" >🛡️</span >
        <span style="vertical-align: middle;">Verify with AI</span>
`;
document.body.appendChild(verifyBtn);

// Setup Modal Container (Hidden by default)
const modalOverlay = document.createElement("div");
modalOverlay.className = "tg-modal-overlay";
modalOverlay.innerHTML = `
    < div class="tg-modal" >
        <div class="tg-modal-header">
            <div class="tg-modal-title">
                <span>🛡️</span> TrustGuard Analysis
            </div>
            <button class="tg-close-btn">✕</button>
        </div>
        <div class="tg-modal-body" id="tg-results-container">
            <!-- Results will be injected here -->
            <div style="text-align: center; color: #94a3b8; padding: 20px;">
                Analyzing content...
            </div>
        </div>
    </div >
    `;
document.body.appendChild(modalOverlay);

// Close Modal Logic
modalOverlay.querySelector('.tg-close-btn').addEventListener('click', () => {
    modalOverlay.style.opacity = '0';
    setTimeout(() => { modalOverlay.style.display = 'none'; }, 300);
});

let selectedText = "";

document.addEventListener("mouseup", (e) => {
    const selection = window.getSelection();
    selectedText = selection.toString().trim();

    if (selectedText.length > 5) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        verifyBtn.style.top = `${ window.scrollY + rect.bottom + 8 } px`;
        verifyBtn.style.left = `${ window.scrollX + rect.left } px`;
        verifyBtn.style.display = "block";
    } else {
        // Only hide if we aren't clicking the button itself
        // (Handled by mousedown check usually, but kept simple here)
    }
});

document.addEventListener("mousedown", (e) => {
    if (e.target !== verifyBtn && !verifyBtn.contains(e.target)) {
        verifyBtn.style.display = "none";
    }
    if (e.target === modalOverlay) {
        modalOverlay.style.opacity = '0';
        setTimeout(() => { modalOverlay.style.display = 'none'; }, 300);
    }
});

verifyBtn.addEventListener("click", async () => {
    // Show Modal immediately in Loading State
    modalOverlay.style.display = 'flex';
    // Force reflow
    modalOverlay.offsetHeight;
    modalOverlay.style.opacity = '1';
    
    const resultsContainer = document.getElementById('tg-results-container');
    resultsContainer.innerHTML = `
    < div style = "text-align: center; padding: 30px;" >
            <div style="display: inline-block; width: 24px; height: 24px; border: 3px solid rgba(56, 189, 248, 0.3); border-radius: 50%; border-top-color: #38bdf8; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 10px; color: #94a3b8; font-size: 13px;">Agents extracting claims & verifying sources...</p>
        </div >
    <style>@keyframes spin {to {transform: rotate(360deg); } }</style>
`;

    try {
        const response = await fetch("http://localhost:8000/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: selectedText })
        });
        
        const data = await response.json();
        
        if (data.length === 0) {
            resultsContainer.innerHTML = `< p style = "text-align:center; color:#94a3b8;" > No verifiable claims found in selected text.</p > `;
            return;
        }

        let html = '';
        data.forEach(item => {
            const statusClass = `tg - status - ${ item.status.toLowerCase() } `;
            html += `
    < div class="tg-claim-card" >
                    <div class="tg-status ${statusClass}">${item.status.replace('_', ' ')}</div>
                    <div class="tg-claim-text">"${item.claim}"</div>
                    ${ item.reasoning ? `<div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Why: ${item.reasoning}</div>` : '' }
                    ${ item.source ? `<a href="${item.source.match(/URL: (.*)\)$/) ? item.source.match(/URL: (.*)\)$/)[1] : '#'}" target="_blank" class="tg-source-link">🔗 Source: ${item.source}</a>` : '' }
                </div >
    `;
        });
        resultsContainer.innerHTML = html;

    } catch (error) {
        resultsContainer.innerHTML = `
    < div style = "text-align: center; color: #f87171; padding: 20px;" >
                <p><strong>Connection Failed</strong></p>
                <p style="font-size: 12px; margin-top: 5px;">Is the local backend running on port 8000?</p>
            </div >
    `;
    }
    
    verifyBtn.style.display = "none";
});
```
>>>>>>> 9233c0b2173e78e87f4038743812522fb3b03b15
