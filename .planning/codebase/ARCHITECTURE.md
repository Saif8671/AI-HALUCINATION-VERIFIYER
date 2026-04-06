# Architecture: TrustGuard AI

## System Flow
The app uses a client-server layout with a shared verification contract and a browser extension entry point.

### 1. Request Handling
- **Frontend**: `frontend/src/pages/Index.tsx` -> `useVerification` -> results components.
- **Backend**: `backend/server.js` handles verification requests and provider routing.
- **Extension**: `frontend/extension` reuses the same branding and logo assets for on-page analysis.

### 2. Verification Process
- The backend builds a structured prompt for claim verification.
- Provider routing falls back sequentially when a provider fails.
- The response is normalized into a JSON payload that drives the claim cards, citations, and trust score gauge.

### 3. Data Flow
- **Input**: User text plus optional context.
- **Processing**: Provider call, JSON normalization, claim extraction, trust scoring.
- **Output**: Verdict, confidence, per-claim status, citation list, and supporting notes.

## Implementation Details
- **Frontend**: React + TypeScript + Tailwind CSS.
- **Backend**: Node.js with ES modules.
- **UI Strategy**: Small composable components keep the dashboard readable and easy to refactor.
- **Cleanup Rule**: Remove backup files and dead helpers instead of leaving them in the source tree.
