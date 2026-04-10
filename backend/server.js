// server.js - Multi Model Verification API with Auto-Fallback

// Supports: Claude, Gemini, Groq, OpenRouter

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

import multer from "multer";
import { extractFromUrl, extractFromPdf } from "./extract.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Multer setup for PDF uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Model priority order for fallback
const MODEL_PRIORITY = ["claude", "gemini", "groq", "openrouter"];

// --------------------
// EXTRACTION ENDPOINTS
// --------------------

app.post("/api/extract-url", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    
    const text = await extractFromUrl(url);
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/extract-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded" });
    
    const text = await extractFromPdf(req.file.buffer);
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Plain-path aliases for deployments or clients that don't include /api
app.post("/extract-url", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const text = await extractFromUrl(url);
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/extract-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded" });

    const text = await extractFromPdf(req.file.buffer);
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------
// ROOT & HEALTH CHECK
// --------------------
app.get("/", (req, res) => {
  res.json({
    message: "Multi-AI Verification API is active.",
    health: "/health",
    verify: "/api/verify",
    extract: ["/api/extract-url", "/api/extract-pdf"]
  });
});


app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Multi-AI Verify Server Running",
    availableModels: getAvailableModels()
  });
});

// Check which models have API keys configured
function getAvailableModels() {
  return {
    claude: !!process.env.CLAUDE_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
    openrouter: !!process.env.OPENROUTER_API_KEY
  };
}

// --------------------
// MAIN VERIFY ENDPOINT
// --------------------
app.post("/api/verify", async (req, res) => {
  console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);

  try {
    const { aiText, sources, model = "auto" } = req.body;

    if (!aiText?.trim()) {
      return res.status(400).json({ error: "AI text is required" });
    }

    const prompt = buildPrompt(aiText, sources);

    let result;
    let usedModel;

    // Auto mode: try models in priority order
    if (model === "auto") {
      result = await callWithFallback(prompt, aiText, sources);
      usedModel = result.modelUsed;
    } else {
      // Specific model requested
      try {
        result = await callModel(model, prompt);
        result.modelUsed = model;
        usedModel = model;
      } catch (error) {
        console.error(`Model ${model} failed, falling back...`, error.message);
        result = await callWithFallback(prompt, aiText, sources, [model]);
        usedModel = result.modelUsed;
      }
    }

    res.json({
      ...result,
      modelUsed: usedModel,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "All models failed",
      message: error.message,
      details: error.details || error.cause?.details || []
    });
  }
});

// --------------------
// FALLBACK HANDLER
// --------------------
async function callWithFallback(prompt, aiText, sources, excludeModels = []) {
  const errors = [];

  // Try each model in priority order
  for (const modelName of MODEL_PRIORITY) {
    if (excludeModels.includes(modelName)) continue;

    try {
      console.log(`Attempting model: ${modelName}`);
      const result = await callModel(modelName, prompt);
      console.log(`✅ Success with ${modelName}`);
      return {
        ...result,
        modelUsed: modelName
      };
    } catch (error) {
      console.error(`❌ ${modelName} failed:`, error.message);
      errors.push({
        model: modelName,
        error: error.message
      });
    }
  }

  // All remote models failed, return deterministic local fallback instead of 500.
  return buildLocalFallback(aiText, sources, errors, excludeModels);
}

function buildLocalFallback(aiText, sources, errors = [], excludeModels = []) {
  const sentences = aiText
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 8);

  const highRiskPattern =
    /\b(always|never|guaranteed|impossible|all|none|100%|proven)\b/i;

  const claims = sentences.map((sentence) => {
    const highRisk = highRiskPattern.test(sentence);
    return {
      claim: sentence,
      status: highRisk ? "unsupported" : "unverified",
      confidence: highRisk ? 20 : 35,
      evidence: highRisk
        ? "Local fallback detected an absolute claim that requires external sources."
        : "Local fallback mode: remote AI providers were unavailable, so this claim could not be externally verified.",
      sourceMatch: false,
    };
  });

  const hallucinations = sentences
    .filter((sentence) => highRiskPattern.test(sentence))
    .map((sentence) => ({
      text: sentence,
      reason:
        "Absolute wording increases hallucination risk without strong source backing.",
      severity: "medium",
    }));

  return {
    overallVerdict: claims.length === 0 ? "partial" : "partial",
    confidenceScore: claims.length === 0 ? 0 : 30,
    summary:
      "Remote verification models were unavailable. Returned a local heuristic analysis so the request still succeeds.",
    claims,
    hallucinations,
    recommendations: [
      "Configure at least one valid API key (Claude, Gemini, Groq, or OpenRouter).",
      "Retry verification after checking provider quota and key permissions.",
      sources?.trim()
        ? "Keep citations concise and directly tied to each factual claim."
        : "Provide supporting sources to improve verification quality.",
    ],
    modelUsed: "local-fallback",
    providerErrors: errors,
    excludedModels: excludeModels,
  };
}

// --------------------
// MODEL ROUTER
// --------------------
async function callModel(model, prompt) {
  switch (model) {
    case "claude":
      return await callClaude(prompt);

    case "gemini":
      return await callGemini(prompt);

    case "groq":
      return await callGroq(prompt);

    case "openrouter":
      return await callOpenRouter(prompt);

    default:
      throw new Error(`Invalid model: ${model}. Use: claude | gemini | groq | openrouter | auto`);
  }
}

// --------------------
// PROMPT BUILDER
// --------------------
function buildPrompt(aiText, sources) {
  return `You are an expert fact-checker and citation verification system.
  
  CORE INSTRUCTIONS:
  1. Detect the language of the AI-GENERATED TEXT below, but ALWAYS provide the response in ENGLISH.
  2. Provide the entire JSON response (specifically the 'summary', 'evidence', 'reason', and 'recommendations' fields) in ENGLISH.
  3. Be objective, forensic, and thorough.

${sources?.trim()
      ? `SOURCES PROVIDED:\n${sources}\nVerify the AI-generated text against these sources.`
      : `No sources provided. Use web knowledge to verify factual claims.`}

AI-GENERATED TEXT:
${aiText}

Respond ONLY in valid JSON format:

{
  "overallVerdict": "verified" | "partial" | "hallucination",
  "confidenceScore": 0-100,
  "summary": "brief summary (in detected language)",
  "claims": [
    {
      "claim": "claim text",
      "status": "verified" | "unverified" | "false" | "unsupported",
      "confidence": 0-100,
      "evidence": "evidence text (in detected language)",
      "sourceMatch": true/false
    }
  ],
  "hallucinations": [
    {
      "text": "hallucinated content",
      "reason": "why false (in detected language)",
      "severity": "low" | "medium" | "high"
    }
  ],
  "recommendations": ["recommendation (in detected language)"]
}`;
}


// --------------------
// CLAUDE (Anthropic)
// --------------------
async function callClaude(prompt) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY missing");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "{}";
  return safeJSON(text);
}

// --------------------
// GEMINI (Google AI)
// --------------------
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2
        }
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  return safeJSON(text);
}

// --------------------
// GROQ (FAST + FREE)
// --------------------
async function callGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY missing");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "{}";
  return safeJSON(text);
}

// --------------------
// OPENROUTER
// --------------------
async function callOpenRouter(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY missing");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "{}";
  return safeJSON(text);
}

// --------------------
// SAFE JSON PARSER
// --------------------
function safeJSON(text) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      error: "Failed to parse model response",
      raw: text.substring(0, 1000),
      overallVerdict: "error",
      confidenceScore: 0,
      summary: "Failed to parse response from AI model"
    };
  }
}

// --------------------
// START SERVER
// --------------------
app.listen(PORT, () => {
  console.log(`\n✅ Multi-AI Verify Server running on port ${PORT}\n`);
  console.log("Available Models:");
  console.log(`  Claude:     ${process.env.CLAUDE_API_KEY ? "✔" : "✖"}`);
  console.log(`  Gemini:     ${process.env.GEMINI_API_KEY ? "✔" : "✖"}`);
  console.log(`  Groq:       ${process.env.GROQ_API_KEY ? "✔" : "✖"}`);
  console.log(`  OpenRouter: ${process.env.OPENROUTER_API_KEY ? "✔" : "✖"}`);
  console.log("\nFallback order:", MODEL_PRIORITY.join(" → "));
  console.log("");
});

export default app;
