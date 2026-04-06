# Architecture: AI Hallucination Verifier

## System Flow
The application follows a standard client-server architecture with external LLM dependencies.

### 1. Request Handling
- **Frontend**: `Index.tsx` (page) → `useVerify` (hook/mutation) → `api.verify` (service).
- **Backend**: `server.js` (Express) → `/api/verify` (POST).

### 2. Verification Process
- **Prompt Engineering**: The backend constructs a structured prompt instructing an LLM to act as a fact-checker/verifier.
- **Model Routing**: 
  - If `model="auto"` (default), the backend uses `callWithFallback`.
  - Priority: `claude` → `gemini` → `groq` → `openrouter`.
- **Local Fallback**: If all remote providers fail (e.g., missing API keys), `buildLocalFallback` provides a basic heuristic analysis (less accurate).

### 3. Data Flow
- **Input**: AI-generated text + (optional) sources.
- **Processing**: Structured JSON generation via LLM.
- **Output**: JSON payload including overall verdict, confidence score, detailed claims, and hallucination breakdown.

## Implementation Details
- **ES Modules**: Backend uses `import` (requires `package.json` `type: "module"`).
- **Graceful Failures**: Automatic sequential fallback through providers.
- **Deterministic Response**: Forced JSON format via system prompt.
