<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,100:7c3aed&height=200&section=header&text=TrustGuard%20AI&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=The%20Truth%20Layer%20for%20AI-Generated%20Content&descSize=17&descAlignY=60" width="100%"/>

<div align="center">

[![Live Demo](https://img.shields.io/badge/🔗%20Live%20Demo-ai--halucination--verifiyer.vercel.app-7c3aed?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-halucination-verifiyer.vercel.app/)

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini%20Flash-4285F4?style=flat-square&logo=google&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=flat-square&logo=groq&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-7c3aed?style=flat-square)

</div>

---

## Overview

**TrustGuard AI** sits between AI-generated content and the user — automatically extracting every factual claim, searching the live web for evidence, and returning a per-claim verdict with a visual trust score in seconds.

AI hallucinates. TrustGuard catches it. Available as a web dashboard, FastAPI backend, and Chrome extension.

---

## The Problem

| Issue | Real-World Impact |
|---|---|
| AI hallucinations | Fabricated facts presented with complete confidence |
| Fake citations | Non-existent papers and sources cited as real |
| No verification layer | Users have no fast way to cross-check AI output |
| Research & journalism risk | Misinformation propagates before it's caught |

---

## Features

### Verification Engine
- **Real-time fact checking** — live web search via Tavily AI (primary) with DuckDuckGo fallback
- **Visual trust score** — dynamic gauge: Verified (100%) / Uncertain (50%) / Hallucinated (0%)
- **Claim-by-claim breakdown** — every extracted claim gets its own verdict and evidence links
- **Citation verification** — checks whether cited sources actually exist and are accessible

### Reliability & Performance
- **API key rotation** — auto-switches between multiple Gemini keys with 60s cooldown to handle free-tier rate limits
- **Multi-LLM fallback** — drops to Groq (Llama 3.3-70B) if all Gemini keys are exhausted
- **Parallel claim processing** — all claims verified simultaneously for near-instant results

### Accessibility
- **Multilingual support** — detects input language and returns explanations in the same language
- **Dark / Light mode** — high-contrast cyber dark mode and clean professional light mode

### Three Interfaces

| Interface | How It Works |
|---|---|
| **Web Dashboard** | Paste any text → click Verify → get full trust report |
| **Chrome Extension** | Highlight text on any webpage → right-click → "Verify with TrustGuard AI" |
| **FastAPI Backend** | REST API for programmatic access and integrations |

---

## Supported Models

| Model | Provider | Speed | Free Tier |
|---|---|---|---|
| Gemini 1.5 Flash | Google | ⚡ Very fast | ✅ Yes |
| Llama 3.3 70B | Groq | ⚡ Ultra fast | ✅ Yes |
| Claude Sonnet 4 | Anthropic | ⚡ Fast | ❌ Paid |
| Mistral 7B | OpenRouter | ⚡ Fast | ✅ Yes |

---

## Architecture

```mermaid
graph TD
    User([User])
    FE[Web Dashboard / Chrome Extension]
    API[FastAPI Backend]
    Router{LLM Router}
    Gemini[Gemini Flash]
    Groq[Groq · Llama 3.3-70B]
    Claude[Claude Sonnet]
    OpenRouter[OpenRouter · Mistral]
    Search[(Live Web Search: Tavily · DuckDuckGo)]

    User --> FE
    FE --> API
    API --> Router
    Router --> Gemini
    Router --> Groq
    Router --> Claude
    Router --> OpenRouter
    Gemini --> Search
    Groq --> Search
    Claude --> Search
    OpenRouter --> Search
    Search --> API
    API --> FE
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, Python 3.9+, Uvicorn, Pydantic |
| AI Models | Gemini 1.5 Flash, Groq Llama 3.3-70B, Claude Sonnet, Mistral via OpenRouter |
| Search | Tavily AI (primary), DuckDuckGo (fallback) |
| Extension | Chrome Manifest V3 |

---

## Project Structure

```
trustguard-ai/
├── backend/
│   ├── main.py                   # FastAPI entry point
│   ├── routers/
│   │   └── verify.py             # /verify endpoint
│   ├── services/
│   │   ├── llm_router.py         # Multi-LLM routing + key rotation
│   │   ├── claim_extractor.py    # Gemini claim extraction
│   │   ├── fact_checker.py       # Search + verification logic
│   │   └── search.py             # Tavily + DuckDuckGo fallback
│   ├── models/
│   │   └── schemas.py            # Pydantic request/response models
│   ├── requirements.txt
│   └── .env                      # API keys — never commit
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TrustGauge.tsx    # Visual trust score gauge
│   │   │   ├── ClaimCard.tsx     # Per-claim verdict display
│   │   │   ├── ResultPanel.tsx   # Full verification results
│   │   │   └── ThemeToggle.tsx   # Dark/light mode switch
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── extension/                # Chrome extension source
│   │   ├── manifest.json
│   │   ├── background.js
│   │   └── content.js
│   └── package.json
└── README.md
```

---

## Getting Started

**Prerequisites:** Node.js 18+, Python 3.9+, at least one LLM API key

### 1. Clone the repository

```bash
git clone https://github.com/Saif8671/trustguard-ai.git
cd trustguard-ai
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY_2=your_second_key       # optional — enables key rotation
GROQ_API_KEY=your_groq_api_key
CLAUDE_API_KEY=your_claude_api_key
TAVILY_API_KEY=your_tavily_api_key
```

```bash
uvicorn main:app --reload --port 8000
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

Open `http://localhost:5173`.

### 4. Chrome extension setup

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `frontend/extension/` folder

> Never commit your `.env` files. Ensure both are listed in `.gitignore`.

---

## Usage

**Web Dashboard** — paste any AI-generated or questionable text, click **Verify Content**, and review the trust score, per-claim verdicts, and evidence links.

**Chrome Extension** — highlight any text on any webpage, right-click, select **"Verify with TrustGuard AI"**, and a floating panel displays results inline.

**Direct API**

```bash
curl -X POST http://localhost:8000/verify \
  -H "Content-Type: application/json" \
  -d '{"text": "The Eiffel Tower was built in 1887 and stands 450 meters tall."}'
```

---

## Roadmap

| Status | Feature |
|---|---|
| 📋 Planned | User accounts and verification history |
| 📋 Planned | Specialized claim scoring for medical, legal, and financial content |
| 📋 Planned | Deepfake and synthetic media detection (image + audio) |
| 📋 Planned | Firefox and Edge extension support |
| 📋 Planned | Exportable verification reports (PDF) |
| 💡 Idea | Community annotations and collaborative fact-checking |
| 💡 Idea | Slack / Teams webhook integration |

---

## Contributing

Contributions are welcome — new LLM integrations, improved search fallback logic, UI refinements, or language support.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional messages: `git commit -m "feat: describe your change"`
4. Push and open a pull request

---

## License

MIT © [Saif ur Rahman](https://github.com/Saif8671)
Free to use, modify, and distribute with attribution.

---

<div align="center">

**Built by [Saif ur Rahman](https://github.com/Saif8671)**

[![GitHub](https://img.shields.io/badge/GitHub-Saif8671-100000?style=flat-square&logo=github)](https://github.com/Saif8671)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/saif-ur-rahman-0211002b9)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-00C7B7?style=flat-square&logo=netlify)](https://saif-portfolio8671.netlify.app)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=flat-square&logo=gmail)](mailto:saifurrahman887@gmail.com)

<br/>

*Because the truth still matters.*

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:7c3aed,100:0d1117&height=120&section=footer" width="100%"/>

</div>
