# Conventions & Concerns: AI Hallucination Verifier

## Coding Conventions
- **Language**: TypeScript for Frontend, JavaScript (ESM) for Backend.
- **Component Policy**: Functional components only. Use `lucide-react` for icons and `shadcn/ui` for primitives.
- **Styling**: Tailwind utility classes first. Follow `ThemeProvider` (dark/light mode).
- **API Responses**: Always JSON. Backend includes `safeJSON` helper to handle LLM response parsing (removes markdown backticks).

## Security & Concerns
- **API Key Leakage**: `.env` used for all keys (Claude, Gemini, Groq, OpenRouter).
- **Cost Management**: Gemini 1.5 Flash and Mistral 7B (Mistral-7B-Instruct-v1) are used for cost-effective verification.
- **LLM Reliability**: Hallucination detection depends entirely on the veracity of the "Truth Teller" model. High risk if the verifier itself hallucinates.
- **JSON Parsing**: Fragile parsing of LLM responses via regex cleaning. A more robust parser or structured output feature should be used.
- **CORS**: `cors()` is fully enabled (`*`), which is fine for local dev but should be restricted in production.
- **Node-Fetch**: Uses `node-fetch`, which is fine but native `fetch` (Node 18+) could be used.
