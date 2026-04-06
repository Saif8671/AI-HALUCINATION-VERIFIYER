# Requirements: AI Hallucination Verifier

## Core Requirements

### REQ-01: Multi-Model Verification (MMV)
- **Status**: [x] (Implemented in code)
- **Description**: Support for Claude, Gemini, Groq, and OpenRouter.
- **Verification**: `callModel` function in `server.js`.

### REQ-02: Automatic Provider Fallback (APF)
- **Status**: [x] (Implemented in code)
- **Description**: If a provider fails (e.g., rate limit or missing API key), the system must automatically try the next provider in the fallback stack.
- **Verification**: `callWithFallback` logic in `server.js`.

### REQ-03: Fact-to-Claim Breakdown (FCB)
- **Status**: [x] (Implemented in code)
- **Description**: The system must break down AI text into individual factual claims and verify each independently.
- **Verification**: `claims` array in the JSON output.

### REQ-04: "Liquid Glass & Neon" Premium UI (LG-UI)
- **Status**: [ ] (Planned)
- **Description**: Modernize the interface with high-fidelity blurs, neon accents, and Space Grotesk typography.
- **Success Criteria**: 100% compliant with the Stitch design system.

### REQ-05: Source Extraction (SE)
- **Status**: [ ] (Planned)
- **Description**: Ability to extract truth context from raw PDFs and long-form URLs.
- **Success Criteria**: Verified extraction of factual claims from at least 3 distinct file formats.

## Constraints
- **Latency**: End-to-end verification must complete in under 10 seconds for standard queries.
- **Cost**: Favor free or low-cost providers (Groq, Gemini Flash) for standard verifications.
- **Consistency**: All models must output the same structured JSON format defined in `buildPrompt`.

---
*Last updated: 2026-03-29 after mapping*
