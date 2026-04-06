# Project: TrustGuard AI

## What This Is
TrustGuard AI is a web dashboard, browser extension, and API for verifying AI-generated claims against web evidence and returning structured verdicts with source-backed confidence scoring.

## Why This Matters
AI-generated content can look convincing even when it is wrong. This project gives users a fast verification layer so hallucinations, fake citations, and unsupported claims are easier to spot before they spread.

## Core Value
"Confidence in AI through automated, claim-level verification."

## Current Shape
- React/Vite frontend with a premium glass/neon visual style
- Node/Express backend that exposes verification endpoints
- Chrome extension for quick on-page verification
- Shared claim, citation, and trust-score reporting across the UI

## Requirements

### Validated
- [x] Multi-model verification with provider fallback.
- [x] Structured JSON parsing from model output.
- [x] Claim-level breakdown in the frontend dashboard.
- [x] Refined premium UI shell and logo presentation.

### Active
- [ ] Advanced source extraction for PDFs and URLs.
- [ ] Real-time trust score refinements.
- [ ] Multi-language verification output.

## Success Criteria
- [ ] Verification latency stays low for short texts.
- [ ] Output remains stable and machine-readable across providers.
- [ ] The UI feels polished and intentional on desktop and mobile.

---
*Last updated: 2026-04-07 after cleanup*
