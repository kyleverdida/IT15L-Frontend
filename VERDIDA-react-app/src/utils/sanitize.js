const HTML_META_CHAR_PATTERN = /[<>]/g;

function isControlCharacter(code) {
  return (code >= 0 && code <= 31) || code === 127;
}

export function stripControlChars(value = '') {
  return Array.from(String(value))
    .filter((char) => !isControlCharacter(char.charCodeAt(0)))
    .join('');
}

export function hasUnsafeInput(value = '') {
  const text = String(value);
  if (text.includes('<') || text.includes('>')) {
    return true;
  }

  return Array.from(text).some((char) => isControlCharacter(char.charCodeAt(0)));
}

export function sanitizeEmailInput(value = '') {
  return stripControlChars(value).replace(HTML_META_CHAR_PATTERN, '').trim().toLowerCase();
}
