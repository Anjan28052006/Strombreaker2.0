/**
 * Input Normalizer
 * Normalizes and length-limits incoming text.
 * Strips zero-width characters, normalizes Unicode (NFKC), and flags obfuscation patterns.
 */

function normalizeInput(rawInput, maxLength = 4000) {
  if (typeof rawInput !== "string") {
    return {
      normalizedText: "",
      rawLength: 0,
      obfuscationDetected: false,
      flags: [],
    };
  }

  const flags = [];
  const rawLength = rawInput.length;
  let text = rawInput.slice(0, maxLength);

  // Check for zero-width characters (\u200B, \u200C, \u200D, \uFEFF, etc.)
  const zeroWidthRegex = /[\u200B-\u200D\uFEFF\u2060\u180E]/g;
  if (zeroWidthRegex.test(text)) {
    flags.push("ZERO_WIDTH_CHARS_DETECTED");
    text = text.replace(zeroWidthRegex, "");
  }

  // Unicode normalization (NFKC) to resolve lookalike characters and homoglyphs
  const preNfkc = text;
  text = text.normalize("NFKC");
  if (preNfkc !== text) {
    flags.push("UNICODE_NORMALIZED");
  }

  // Check for Base64 encoded payload patterns
  const base64Pattern = /(?:[A-Za-z0-9+/]{4}){8,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/g;
  if (base64Pattern.test(text)) {
    flags.push("SUSPICIOUS_ENCODING_BASE64");
  }

  // Check for hex-escaped sequences (e.g. \x41\x42 or %20%20)
  const hexPattern = /(?:\\x[0-9a-fA-F]{2}){3,}|(?:%[0-9a-fA-F]{2}){3,}/;
  if (hexPattern.test(text)) {
    flags.push("SUSPICIOUS_HEX_ENCODING");
  }

  // Collapse excessive whitespace while preserving single spaces
  const cleanedText = text.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();

  return {
    normalizedText: cleanedText,
    rawLength,
    obfuscationDetected: flags.length > 0,
    flags,
  };
}

module.exports = {
  normalizeInput,
};
