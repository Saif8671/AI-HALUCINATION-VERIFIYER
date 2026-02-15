# 1. Problem Statement
Generative AI models often produce "hallucinations"—factual errors presented with high confidence—and fake citations. This undermines trust in AI-generated content for research, journalism, and decision-making. **TrustGuard AI** serves as a "Truth Layer" that automatically extracts factual claims from any text, cross-references them with real-time web search data, and provides a visual trust score to help users distinguish between fact and fiction.

# 2. Project Name
TrustGuard AI (AI Trust Beacon)

# 3. Team Name
NightShift-Devs

# 4. Deployed Link (optional)
- **Frontend**: https://trustguard-ai-safety.vercel.app/
- **Backend API**: [https://trustguard-backend-5x5q.onrender.com](https://trustguard-backend-5x5q.onrender.com)
- **Repository**: [https://github.com/Shreyashburde05/GFGBQ-Team-NightShift-Devs](https://github.com/Shreyashburde05/GFGBQ-Team-NightShift-Devs)

# 5. PPT Link
[https://docs.google.com/presentation/d/1YJ4fISFQleYsSJWTPzwEKuOM0V34qpYM/edit?usp=sharing&ouid=111070728364722151974&rtpof=true&sd=true]

---

## 🚀 Project Overview
TrustGuard AI is a comprehensive AI safety tool consisting of a **FastAPI Backend**, a **React Web Dashboard**, and a **Chrome Extension**. It allows users to highlight any text on the web and instantly verify its accuracy. The system uses Google Gemini 3 Flash (Preview) for claim extraction and verification, combined with DuckDuckGo for real-time fact-checking.

### ✨ Key Features:
- **Real-time Fact Checking:** Cross-references claims with live search results using AI-generated search queries.
- **Visual Trust Score:** Provides an overall percentage score (Verified=100%, Uncertain=50%, Hallucinated=0%) with a dynamic gauge.
- **API Key Rotation & Cooldown:** Automatically switches between multiple Gemini API keys with a 60s cooldown to bypass free-tier rate limits.
- **Multi-LLM Fallback:** Uses Groq (Llama 3.3-70B) as a zero-downtime fallback if all Gemini keys are exhausted.
- **Parallel Processing:** Verifies multiple claims simultaneously for near-instant results.
- **Dark/Light Mode:** Fully responsive UI with a high-tech "Cyber" dark mode and a clean, professional light mode.
- **Citation Verification:** Checks if mentioned sources actually exist and provides direct evidence links.
- **Multilingual Support:** Automatically detects the input language (e.g., Hindi, Spanish) and provides verification explanations in the native language.

---

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI, Lucide React.
- **Backend**: FastAPI, Python, Uvicorn, Pydantic.
- **AI Models**: Google Gemini 3 Flash (Preview), Groq (Llama 3.3 70B).
- **Search APIs**: Tavily AI (Primary/High-Quality), DuckDuckGo Search (Fallback/Zero-Config).
- **Theme Management**: `next-themes`.

---

## 📦 Setup and Installation

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create a .env file in the backend folder:
# GEMINI_API_KEYS=key1,key2,key3
# GROQ_API_KEY=your_groq_key
# TAVILY_API_KEY=your_tavily_key
# Run the server:
python -m uvicorn main:app --port 8000 --reload
```

### 2. Frontend Setup
```bash
npm install
# Create a .env file in the root:
# VITE_API_URL=http://localhost:8000/api/verify
npm run dev
```

### 3. Chrome Extension Setup
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `extension` folder from this repository.

---

## 📖 Usage Instructions
1. **Web Dashboard**: Paste any AI-generated text into the analyzer and click "Verify Content".
2. **Browser Extension**:
   - Highlight any text on any website.
   - Right-click and select **"Verify with TrustGuard AI"**.
   - Click the floating **Verify** button to see the truth layer.
   - Click the floating **Verify** button to see the truth layer.
3. **Theme Toggle**: Use the Sun/Moon icon in the header to switch between Dark and Light modes.

---

## 🌐 Deployment Guide

### Backend (Render)
- **Runtime**: Python 3
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Env Vars**: `GEMINI_API_KEYS`, `GROQ_API_KEY`.

### Frontend (Vercel)
- **Framework**: Vite
- **Env Var**: `VITE_API_URL` (Point to your Render URL + `/api/verify`).

---

## 👥 Team - NightShift-Devs
- **Abhinav Vaidya** - [GitHub](https://github.com/abhi9vaidya)
- **Shreyash Burde** - [GitHub](https://github.com/Shreyashburde05)
- **Meet Yemde** - [GitHub](https://github.com/meetyemde43)

---
*Built for the GFG ByteQuest Hackathon 2025.*
