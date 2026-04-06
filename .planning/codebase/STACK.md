# Stack: AI Hallucination Verifier

## Backend (Server)
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Key Modules**:
  - `dotenv`: Environment variable management.
  - `cors`: Cross-Origin Resource Sharing.
  - `node-fetch`: HTTP client for API calls (Claude, Gemini, etc.).

## Frontend (Client)
- **Build Tool**: Vite
- **Framework**: React 18 (TypeScript)
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI (Radix UI primitives)
- **Icons**: Lucide React
- **Data Fetching**: @tanstack/react-query
- **Routing**: react-router-dom

## AI Providers
- **Claude**: Anthropic API (`claude-sonnet-4-20250514`)
- **Gemini**: Google AI API (`gemini-1.5-flash`)
- **Groq**: Groq Cloud API (`llama-3.3-70b-versatile`)
- **OpenRouter**: Unified API (`mistralai/mistral-7b-instruct:free` as fallback)

## Infrastructure
- **Deployment**: Render (`render.yaml` configured)
