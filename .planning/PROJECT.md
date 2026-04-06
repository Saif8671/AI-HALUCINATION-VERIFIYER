# Project: AI Hallucination Verifier

## What This Is
A tool for automated verification of AI-generated content to eliminate hallucinations. It uses multiple external LLM providers (Claude, Gemini, Groq, OpenRouter) to fact-check statements against provided sources or existing web knowledge.

## Why This Matters
As AI outputs become more ubiquitous, the risk of hallucinations in critical domains (legal, medical, technical) presents a significant challenge. This project provides a "Confidence Layer" that helps users trust AI outputs or identify inaccuracies before they cause harm.

## Core Value
"Confidence in AI through automated, cross-model verification."

## Requirements

### Validated
- ✓ [Existing] Multi-model support (Claude, Gemini, Groq).
- ✓ [Existing] Automatic model fallback if primary fails.
- ✓ [Existing] Structured JSON parsing from LLM outputs.
- ✓ [Existing] Frontend dashboard with claim-level breakdown.

### Active
- [ ] [NEW] "Liquid Glass & Neon" UI overhaul.
- [ ] [NEW] Advanced source extraction (PDF/URL support).
- [ ] [NEW] Real-time "Truth Trust Score" for each verification.
- [ ] [NEW] Multi-language support for verification.

## Success Criteria
- [ ] UI achieves 10/10 "Wow" factor with premium design.
- [ ] Verification latency under 5s for short texts.
- [ ] Accuracy >90% on standard fact-checking benchmarks.

---
*Last updated: 2026-03-29 after mapping*
