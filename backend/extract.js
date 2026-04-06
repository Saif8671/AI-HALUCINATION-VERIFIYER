import axios from "axios";
import * as cheerio from "cheerio";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");



/**
 * Extract text from a URL
 * @param {string} url 
 * @returns {Promise<string>}
 */
export async function extractFromUrl(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      timeout: 10000
    });

    const $ = cheerio.load(data);
    
    // Remove script/style tags
    $("script, style").remove();

    // Extract meaningful text
    const textBlocks = [];
    $("h1, h2, h3, p, li").each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 20) {
        textBlocks.push(text);
      }
    });

    return textBlocks.join("\n\n").substring(0, 15000); // Limit to 15k chars for prompt safety
  } catch (error) {
    console.error("URL Extraction Error:", error.message);
    throw new Error(`Failed to extract content from URL: ${error.message}`);
  }
}

/**
 * Extract text from a PDF Buffer
 * @param {Buffer} buffer 
 * @returns {Promise<string>}
 */
export async function extractFromPdf(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text.trim().substring(0, 20000); // Limit to 20k chars
  } catch (error) {
    console.error("PDF Extraction Error:", error.message);
    throw new Error(`Failed to extract content from PDF: ${error.message}`);
  }
}
