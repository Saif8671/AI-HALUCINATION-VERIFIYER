/**
 * TrustGuard AI - Content Script
 * Right-click selection -> "Verify with TrustGuard AI" -> floating Truth Layer panel.
 */
(function () {
  // Shadow DOM container to isolate styles from host page
  const container = document.createElement("div");
  container.id = "tg-root";
  document.documentElement.appendChild(container);
  const shadow = container.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    .tg-panel {
      position: fixed;
      z-index: 2147483647;
      width: 360px;
      max-width: calc(100vw - 24px);
      max-height: 70vh;
      overflow: hidden;
      background: #0b1220;
      color: #e2e8f0;
      border: 1px solid #243046;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.45);
      display: none;
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    }
    .tg-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      background: #121a2b;
      border-bottom: 1px solid #1f2a40;
    }
    .tg-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #93c5fd;
    }
    .tg-title img {
      width: 18px;
      height: 18px;
      border-radius: 3px;
    }
    .tg-close {
      background: transparent;
      border: 0;
      color: #94a3b8;
      cursor: pointer;
      font-size: 14px;
      padding: 4px 6px;
      border-radius: 6px;
    }
    .tg-close:hover { background: #1b2438; color: #e2e8f0; }
    .tg-body {
      padding: 14px;
      overflow: auto;
      max-height: calc(70vh - 44px);
    }
    .tg-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #94a3b8;
      font-size: 12px;
    }
    .tg-spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(59,130,246,0.25);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: tg-spin 0.9s linear infinite;
    }
    @keyframes tg-spin { to { transform: rotate(360deg); } }
    .tg-score {
      text-align: center;
      margin: 6px 0 12px;
    }
    .tg-score-value {
      font-size: 28px;
      font-weight: 700;
    }
    .tg-score-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
    }
    .tg-claim {
      background: #121a2b;
      border: 1px solid #1f2a40;
      border-radius: 10px;
      padding: 10px;
      margin-bottom: 10px;
    }
    .tg-status {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .tg-status-verified { background: rgba(34,197,94,0.12); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
    .tg-status-uncertain { background: rgba(234,179,8,0.12); color: #facc15; border: 1px solid rgba(234,179,8,0.25); }
    .tg-status-hallucinated { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
    .tg-claim-text { font-size: 12px; color: #e2e8f0; margin-bottom: 6px; }
    .tg-claim-expl { font-size: 11px; color: #94a3b8; }
    .tg-source {
      display: inline-block;
      margin-top: 6px;
      font-size: 11px;
      color: #60a5fa;
      text-decoration: none;
    }
    .tg-source:hover { text-decoration: underline; }
    .tg-section-title {
      margin: 10px 0 6px;
      font-size: 10px;
      letter-spacing: 1px;
      color: #94a3b8;
      text-transform: uppercase;
    }
    .tg-citation {
      border-left: 2px solid #1f2a40;
      padding: 6px 8px;
      background: rgba(255,255,255,0.03);
      margin-bottom: 6px;
      font-size: 11px;
      color: #cbd5e1;
    }
    .tg-citation strong { display: block; margin-bottom: 2px; }
  `;
  shadow.appendChild(style);

  const panel = document.createElement("div");
  panel.className = "tg-panel";

  const header = document.createElement("div");
  header.className = "tg-panel-header";

  const title = document.createElement("div");
  title.className = "tg-title";
  const titleIcon = document.createElement("img");
  titleIcon.src = chrome.runtime.getURL("logo.png");
  titleIcon.alt = "TrustGuard";
  const titleText = document.createElement("span");
  titleText.textContent = "Truth Layer";
  title.appendChild(titleIcon);
  title.appendChild(titleText);

  const closeBtn = document.createElement("button");
  closeBtn.className = "tg-close";
  closeBtn.type = "button";
  closeBtn.textContent = "X";

  header.appendChild(title);
  header.appendChild(closeBtn);

  const body = document.createElement("div");
  body.className = "tg-body";

  panel.appendChild(header);
  panel.appendChild(body);
  shadow.appendChild(panel);

  let lastSelectionText = "";
  let lastSelectionRect = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getSelectionRect() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) return null;
    return rect;
  }

  function positionPanel(rect) {
    const panelWidth = 360;
    const margin = 12;
    let left = margin;
    let top = margin;

    if (rect) {
      left = rect.left + rect.width / 2 - panelWidth / 2;
      left = clamp(left, margin, window.innerWidth - panelWidth - margin);
      top = rect.bottom + 12;
      top = clamp(top, margin, window.innerHeight - 180);
    } else {
      left = window.innerWidth - panelWidth - margin;
      top = window.innerHeight - 220;
    }

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }

  function showPanel() {
    panel.style.display = "block";
  }

  function hidePanel() {
    panel.style.display = "none";
  }

  function setLoading() {
    body.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "tg-loading";
    const spinner = document.createElement("div");
    spinner.className = "tg-spinner";
    const text = document.createElement("div");
    text.textContent = "Analyzing selected text...";
    wrapper.appendChild(spinner);
    wrapper.appendChild(text);
    body.appendChild(wrapper);
  }

  function setError(message) {
    body.innerHTML = "";
    const err = document.createElement("div");
    err.style.cssText = "color:#f87171; font-size:12px; text-align:center;";
    err.textContent = message;
    body.appendChild(err);
  }

  function scoreColor(score) {
    if (score >= 80) return "#22c55e";
    if (score >= 50) return "#fbbf24";
    return "#f87171";
  }

  function renderResults(data) {
    body.innerHTML = "";

    const scoreWrap = document.createElement("div");
    scoreWrap.className = "tg-score";
    const scoreVal = document.createElement("div");
    scoreVal.className = "tg-score-value";
    const score = data.overallScore || 0;
    scoreVal.style.color = scoreColor(score);
    scoreVal.textContent = `${score}%`;
    const scoreLabel = document.createElement("div");
    scoreLabel.className = "tg-score-label";
    scoreLabel.textContent = "Trust Score";
    scoreWrap.appendChild(scoreVal);
    scoreWrap.appendChild(scoreLabel);
    body.appendChild(scoreWrap);

    if (data.claims && data.claims.length > 0) {
      data.claims.forEach((claim) => {
        const card = document.createElement("div");
        card.className = "tg-claim";

        const status = document.createElement("div");
        const statusValue = (claim.status || "uncertain").toLowerCase();
        status.className = `tg-status tg-status-${statusValue}`;
        status.textContent = claim.status || "Uncertain";

        const text = document.createElement("div");
        text.className = "tg-claim-text";
        text.textContent = `"${claim.text || ""}"`;

        card.appendChild(status);
        card.appendChild(text);

        if (claim.explanation) {
          const expl = document.createElement("div");
          expl.className = "tg-claim-expl";
          expl.textContent = claim.explanation;
          card.appendChild(expl);
        }

        if (claim.sourceUrl) {
          const link = document.createElement("a");
          link.className = "tg-source";
          link.href = claim.sourceUrl;
          link.target = "_blank";
          link.rel = "noreferrer";
          link.textContent = `Source: ${claim.source || "View Evidence"}`;
          card.appendChild(link);
        }

        body.appendChild(card);
      });
    } else {
      const empty = document.createElement("div");
      empty.style.cssText = "text-align:center; color:#94a3b8; font-size:12px;";
      empty.textContent = "No specific factual claims detected.";
      body.appendChild(empty);
    }

    if (data.citations && data.citations.length > 0) {
      const ct = document.createElement("div");
      ct.className = "tg-section-title";
      ct.textContent = "Citations";
      body.appendChild(ct);

      data.citations.forEach((cit) => {
        const item = document.createElement("div");
        item.className = "tg-citation";
        const label = document.createElement("strong");
        label.style.color = cit.exists ? "#34d399" : "#f87171";
        label.textContent = cit.exists ? "Found" : "Not Found";
        const text = document.createElement("div");
        text.textContent = cit.text || "";
        item.appendChild(label);
        item.appendChild(text);
        body.appendChild(item);
      });
    }
  }

  function verifyText(text) {
    if (!text || text.trim().length === 0) {
      setError("No text selected.");
      return;
    }

    setLoading();
    chrome.runtime.sendMessage({ action: "verifyText", text }, (response) => {
      if (chrome.runtime.lastError || !response || !response.success) {
        const msg =
          (response && response.error) ||
          (chrome.runtime.lastError && chrome.runtime.lastError.message) ||
          "Verification failed. Please try again.";
        setError(msg);
        return;
      }
      renderResults(response.data || {});
    });
  }

  closeBtn.addEventListener("click", hidePanel);

  document.addEventListener("mouseup", () => {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";
    if (text.length > 0) {
      lastSelectionText = text;
      lastSelectionRect = getSelectionRect();
    }
  });

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "openModalWithText") {
      lastSelectionText = request.text || lastSelectionText;
      lastSelectionRect = getSelectionRect();
      positionPanel(lastSelectionRect);
      showPanel();
      verifyText(lastSelectionText);
    }
  });
})();
