// utils/translate.js
const axios = require("axios");
const { URLSearchParams } = require("url");

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST =
  process.env.RAPIDAPI_HOST || "text-translator2.p.rapidapi.com";

if (!RAPIDAPI_KEY) {
  console.warn(
    "RAPIDAPI_KEY is not set. Translation requests will fail until you set it in environment."
  );
}

/**
 * Translate a single piece of text to targetLang using text-translator2.p.rapidapi.com
 * targetLang should be a language code like "en", "ru", "de", "fr"
 * Returns the translated string or empty string on failure.
 */
async function translateText(text, targetLang) {
  if (!text) return "";

  try {
    const params = new URLSearchParams();
    params.append("source_language", "auto");
    params.append("target_language", targetLang);
    params.append("text", text);

    const options = {
      method: "POST",
      url: `https://${RAPIDAPI_HOST}/translate`,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
      data: params,
      timeout: 10000,
    };

    const response = await axios.request(options);

    // The API response shape can vary. Try to gracefully extract the translated text.
    const body = response.data;
    // Common possible shapes:
    // { data: { translatedText: "..." } }
    // { translatedText: "..." }
    // { data: [ { translatedText: "..." } ] }
    if (body == null) return "";

    if (body.data && typeof body.data === "object") {
      if (typeof body.data.translatedText === "string")
        return body.data.translatedText;
      if (
        Array.isArray(body.data) &&
        body.data[0] &&
        typeof body.data[0].translatedText === "string"
      ) {
        return body.data[0].translatedText;
      }
    }
    if (typeof body.translatedText === "string") return body.translatedText;

    // fallback: if body is string or contains recognizable string, return it
    if (typeof body === "string") return body;

    // Last resort: stringify the whole body (not ideal)
    return JSON.stringify(body);
  } catch (err) {
    console.error("translateText error:", err.message || err);
    return "";
  }
}

module.exports = { translateText };
