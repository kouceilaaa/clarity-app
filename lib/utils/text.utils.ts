/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  // Find last space before maxLength
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + "...";
  }

  return truncated + "...";
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Count sentences in text
 */
export function countSentences(text: string): number {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
}

/**
 * Count syllables in text (approximate)
 */
export function countSyllables(text: string): number {
  const words = text.toLowerCase().match(/\b[a-zàâäçéèêëïîôùûü]+\b/g) ?? [];

  let syllableCount = 0;

  for (const word of words) {
    // Count vowel groups
    const vowelGroups = word.match(/[aeiouyàâäéèêëïîôùûü]+/g) ?? [];
    syllableCount += vowelGroups.length;

    // Adjust for silent 'e' at end
    if (word.endsWith("e") && word.length > 2) {
      syllableCount -= 1;
    }

    // At least 1 syllable per word
    if (syllableCount === 0) syllableCount = 1;
  }

  return syllableCount;
}

/**
 * Calculate Flesch Reading Ease score
 */
export function calculateFleschScore(text: string): number {
  const sentenceCount = countSentences(text);
  const wordCount = countWords(text);
  const syllableCount = countSyllables(text);

  if (sentenceCount === 0 || wordCount === 0) return 0;

  const ASL = wordCount / sentenceCount; // Average Sentence Length
  const ASW = syllableCount / wordCount; // Average Syllables per Word

  const score = 206.835 - 1.015 * ASL - 84.6 * ASW;

  // Clamp between 0-100
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Get reading level from Flesch score
 */
export function getReadingLevel(score: number): string {
  if (score >= 90) return "Very Easy - Elementary";
  if (score >= 80) return "Easy - Middle School";
  if (score >= 70) return "Fairly Easy - High School";
  if (score >= 60) return "Standard - College";
  if (score >= 50) return "Fairly Difficult - University";
  if (score >= 30) return "Difficult - Graduate";
  return "Very Difficult - Academic";
}

/**
 * Get estimated age from Flesch score
 */
export function getEstimatedAge(score: number): string {
  if (score >= 90) return "7-8 years";
  if (score >= 80) return "9-10 years";
  if (score >= 70) return "11-12 years";
  if (score >= 60) return "13-14 years";
  if (score >= 50) return "15-17 years";
  if (score >= 30) return "18-22 years";
  return "23+ years";
}

/**
 * Get French interpretation of Flesch score
 * Returns emoji + label for UI display
 */
export function getFleschInterpretation(score: number): {
  label: string;
  emoji: string;
  color: string;
} {
  if (score >= 60) {
    return { label: "Facile", emoji: "✅", color: "text-green-600" };
  }
  if (score >= 30) {
    return { label: "Moyen", emoji: "🟡", color: "text-yellow-600" };
  }
  return { label: "Difficile", emoji: "❌", color: "text-red-600" };
}

/**
 * Calculate improvement percentage between original and simplified text
 */
export function calculateImprovement(
  originalScore: number,
  simplifiedScore: number
): number {
  if (originalScore === 0) return 0;
  const improvement =
    ((simplifiedScore - originalScore) / (100 - originalScore)) * 100;
  return Math.round(Math.max(0, Math.min(100, improvement)));
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize text (remove extra whitespace, control characters)
 */
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, " ") // Multiple spaces to single
    .replace(/[\x00-\x1F\x7F]/g, ""); // Remove control characters
}

/**
 * Remove HTML tags from text
 */
export function removeHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ");
}

/**
 * Estimate reading time in minutes
 */
export function estimateReadingTime(text: string, wpm: number = 200): number {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wpm);
}
