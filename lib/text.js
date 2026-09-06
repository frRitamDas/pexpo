export function decodeHtmlEntities(value) {
  if (value == null) return "";
  const text = String(value);
  const named = {
    amp: "&", apos: "'", gt: ">", lt: "<", quot: '"', nbsp: " ",
  };
  return text
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
      const key = entity.toLowerCase();
      if (named[key]) return named[key];
      if (key.startsWith("#x")) {
        const code = parseInt(key.slice(2), 16);
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
      }
      if (key.startsWith("#")) {
        const code = parseInt(key.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
      }
      return match;
    });
}

export function cleanMusicText(value) {
  return decodeHtmlEntities(value).replace(/\s+/g, " ").trim();
}
