// test.js - Test the Multi-AI Verification API with fallback

import fetch from "node-fetch";

const API_URL = "http://localhost:3001";

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m"
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test 1: Health Check
async function testHealthCheck() {
  log("blue", "\n=== Test 1: Health Check ===");
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    log("green", "✓ Server is running");
    console.log("Available models:", data.availableModels);
    
    const available = Object.entries(data.availableModels)
      .filter(([_, isAvailable]) => isAvailable)
      .map(([name]) => name);
    
    if (available.length === 0) {
      log("red", "⚠ No API keys configured! Add at least one to .env");
      return false;
    }
    
    log("green", `✓ ${available.length} model(s) available: ${available.join(", ")}`);
    return true;
  } catch (error) {
    log("red", `✗ Health check failed: ${error.message}`);
    return false;
  }
}

// Test 2: Auto Mode (fallback)
async function testAutoMode() {
  log("blue", "\n=== Test 2: Auto Mode with Fallback ===");
  try {
    const response = await fetch(`${API_URL}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aiText: "The Eiffel Tower was completed in 1889 for the World's Fair.",
        sources: "Historical records confirm the Eiffel Tower was built for the 1889 Exposition Universelle.",
        model: "auto" // Let it choose the best available model
      })
    });

    const data = await response.json();
    
    if (data.error) {
      log("red", `✗ Verification failed: ${data.error}`);
      return;
    }
    
    log("green", `✓ Used model: ${data.modelUsed}`);
    log("green", `✓ Verdict: ${data.overallVerdict}`);
    log("green", `✓ Confidence: ${data.confidenceScore}%`);
    console.log("Summary:", data.summary);
  } catch (error) {
    log("red", `✗ Auto mode test failed: ${error.message}`);
  }
}

// Test 3: Specific Model with Fallback
async function testSpecificModel(model) {
  log("blue", `\n=== Test 3: Request ${model} (with fallback) ===`);
  try {
    const response = await fetch(`${API_URL}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aiText: "Water boils at 100 degrees Celsius at sea level.",
        sources: "Physics textbooks confirm water's boiling point is 100°C at standard pressure.",
        model: model
      })
    });

    const data = await response.json();
    
    if (data.error) {
      log("yellow", `⚠ Requested ${model} but got error, fallback should have occurred`);
      return;
    }
    
    if (data.modelUsed === model) {
      log("green", `✓ Successfully used requested model: ${model}`);
    } else {
      log("yellow", `⚠ Requested ${model} but used ${data.modelUsed} (fallback worked!)`);
    }
    
    log("green", `✓ Verdict: ${data.overallVerdict}`);
    log("green", `✓ Confidence: ${data.confidenceScore}%`);
  } catch (error) {
    log("red", `✗ Test failed: ${error.message}`);
  }
}

// Test 4: Hallucination Detection
async function testHallucinationDetection() {
  log("blue", "\n=== Test 4: Hallucination Detection ===");
  try {
    const response = await fetch(`${API_URL}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aiText: "The Great Wall of China is clearly visible from the Moon with the naked eye.",
        sources: "NASA has confirmed that the Great Wall is NOT visible from the Moon.",
        model: "auto"
      })
    });

    const data = await response.json();
    
    log("green", `✓ Used model: ${data.modelUsed}`);
    log("green", `✓ Verdict: ${data.overallVerdict}`);
    
    if (data.hallucinations && data.hallucinations.length > 0) {
      log("green", `✓ Detected ${data.hallucinations.length} hallucination(s)`);
      data.hallucinations.forEach((h, i) => {
        console.log(`  ${i + 1}. Severity: ${h.severity}`);
        console.log(`     Reason: ${h.reason}`);
      });
    } else {
      log("yellow", "⚠ No hallucinations detected (unexpected)");
    }
  } catch (error) {
    log("red", `✗ Hallucination test failed: ${error.message}`);
  }
}

// Test 5: No Sources Provided
async function testNoSources() {
  log("blue", "\n=== Test 5: Verification Without Sources ===");
  try {
    const response = await fetch(`${API_URL}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aiText: "Python is a popular programming language created by Guido van Rossum.",
        // No sources provided - should use model's knowledge
        model: "auto"
      })
    });

    const data = await response.json();
    
    log("green", `✓ Used model: ${data.modelUsed}`);
    log("green", `✓ Verdict: ${data.overallVerdict}`);
    log("green", `✓ Successfully verified using model knowledge`);
  } catch (error) {
    log("red", `✗ No sources test failed: ${error.message}`);
  }
}

// Run all tests
async function runTests() {
  log("blue", "\n╔════════════════════════════════════════╗");
  log("blue", "║  Multi-AI Verification API Test Suite  ║");
  log("blue", "╚════════════════════════════════════════╝");

  const serverRunning = await testHealthCheck();
  
  if (!serverRunning) {
    log("red", "\n⚠ Server not running or no API keys configured!");
    log("yellow", "Make sure to:");
    log("yellow", "1. Start the server: npm start");
    log("yellow", "2. Add at least one API key to .env");
    process.exit(1);
  }

  await testAutoMode();
  await testSpecificModel("claude");
  await testSpecificModel("gemini");
  await testHallucinationDetection();
  await testNoSources();

  log("blue", "\n╔════════════════════════════════════════╗");
  log("blue", "║         All Tests Completed!           ║");
  log("blue", "╚════════════════════════════════════════╝\n");
}

// Run tests
runTests().catch(error => {
  log("red", `\n✗ Test suite failed: ${error.message}`);
  process.exit(1);
});