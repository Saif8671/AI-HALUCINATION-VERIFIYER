# Problem Statement
Generative AI models often produce "hallucinations"—factual errors presented with high confidence—and fake citations. This undermines trust in AI-generated content for research, journalism, and decision-making. **TrustGuard AI** serves as a "Truth Layer" that automatically extracts factual claims from any text, cross-references them with real-time web search data, and provides a visual trust score to help users distinguish between fact and fiction.

## 🚀 Project Overview
TrustGuard AI is a comprehensive AI safety tool consisting of a **FastAPI Backend**, a **React Web Dashboard**, and a **Chrome Extension**. It allows users to highlight any text on the web and instantly verify its accuracy. The system uses Google Gemini 3 Flash (Preview) for claim extraction and verification, combined with DuckDuckGo for real-time fact-checking.
### ppt :[TrustGuard-AI.pptx](https://github.com/user-attachments/files/25353265/TrustGuard-AI.pptx)


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

## 🔑 Supported Models

| Model | Provider | Speed | Quality | Free Tier |
|-------|----------|-------|---------|-----------|
| **Claude Sonnet 4** | Anthropic | Fast | Excellent | No (Paid) |
| **Gemini 1.5 Flash** | Google | Very Fast | Good | Yes |
| **Llama 3.3 70B** | Groq | Ultra Fast | Good | Yes |
| **Mistral 7B** | OpenRouter | Fast | Decent | Yes |

---
## 📦 Setup and Installation

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create a .env file in the backend folder:
# GROQ_API_KEY=your_groq_key
# TAVILY_API_KEY=your_tavily_key
# Run the server:
```
npm run dev

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

## 📈 Performance Tips

1. **Use faster models for simple tasks**: Gemini or Groq
2. **Use Claude for complex verification**: Best accuracy
3. **Enable multiple API keys**: Ensures availability
4. **Monitor API usage**: Stay within rate limits

## 🤝 Contributing

Feel free to add more models or improve the fallback logic!

## 📄 License

MIT License 
