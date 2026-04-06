# Requirements: TrustGuard AI

## Core Requirements

### REQ-01: Multi-Model Verification (MMV)
- **Status**: [x] Implemented.
- **Description**: Support multiple verification providers with a shared output contract.
- **Verification**: Provider routing in `backend/server.js`.

### REQ-02: Automatic Provider Fallback (APF)
- **Status**: [x] Implemented.
- **Description**: If one provider fails, the system automatically tries the next provider in the fallback stack.
- **Verification**: Sequential fallback logic in `backend/server.js`.

### REQ-03: Fact-to-Claim Breakdown (FCB)
- **Status**: [x] Implemented.
- **Description**: Break AI text into individual claims and verify each independently.
- **Verification**: `claims` data rendered in the frontend results view.

### REQ-04: Premium UI Shell (LG-UI)
- **Status**: [x] Implemented.
- **Description**: Present the app with a polished glass/neon visual language and clearer hierarchy.
- **Verification**: `frontend/src/pages/Index.tsx` and shared components.

### REQ-05: Source Extraction (SE)
- **Status**: [ ] Planned.
- **Description**: Support PDFs and long-form URLs as verification inputs.
- **Success Criteria**: Verified extraction from multiple file and URL formats.

### REQ-06: Multilingual Verification Output (ML)
- **Status**: [ ] Planned.
- **Description**: Return explanations in the user's input language where possible.
- **Success Criteria**: At least three supported languages in production flow.

## Constraints
- **Latency**: End-to-end verification should remain fast for short inputs.
- **Cost**: Prefer low-cost providers for standard verification requests.
- **Consistency**: All providers must emit the same structured JSON format.

---
*Last updated: 2026-04-07 after cleanup*
