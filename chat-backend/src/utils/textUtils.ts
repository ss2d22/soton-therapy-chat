/**
 * Cleans up the text
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
export const cleanText = (text: string): string => {
  let cleanedText = text.replace(/\p{Cc}/gu, "");
  cleanedText = cleanedText.replace(/[ \t]+/g, " ");
  cleanedText = cleanedText.replace(/[\r\n]+/g, "\n");
  cleanedText = cleanedText.trim();
  return cleanedText;
};

/**
 * Splits text into chunks
 * @param {string} text - Text to split
 * @param {number} chunkSize - Maximum chunk size
 * @returns {string[]} Array of chunks
 */
export const splitTextIntoChunks = (
  text: string,
  chunkSize: number
): string[] => {
  const chunks = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    let endIndex = currentIndex + chunkSize;
    if (endIndex > text.length) {
      endIndex = text.length;
    }
    chunks.push(text.slice(currentIndex, endIndex));
    currentIndex = endIndex;
  }

  return chunks;
};

/**
 * Function to escape special characters for regex
 * @param {string} word
 * @returns {string}
 */
export const escapeSpecialChars = (word: string): string => {
  return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
