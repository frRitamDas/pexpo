export function decodeHtmlEntities(value) {
  if (value == null) return "";
  const named = { amp: "&", apos: "'", gt: ">", lt: "<", quot: '"', nbsp: " " };
  return String(value).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    const key = entity.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(named, key)) return named[key];
    const code = key.startsWith("#x") ? parseInt(key.slice(2), 16) : key.startsWith("#") ? parseInt(key.slice(1), 10) : NaN;
    return Number.isInteger(code) && code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
  });
}

export function cleanMusicText(value) {
  return decodeHtmlEntities(value).replace(/\s+/g, " ").trim();
}
