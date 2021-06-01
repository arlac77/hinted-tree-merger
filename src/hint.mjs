
/**
 * Construct hint for a given path.
 * @param {Object} hints
 * @param {string} path
 */
export function hintFor(hints, path) {
  if (hints === undefined) {
    return {};
  }

  if (path === undefined) {
    return { ...hints["*"] };
  }

  const pathsToConsult = [
    ...Object.keys(hints).filter(
      h =>
        (h[0] === "*" && path.endsWith(h.slice(1))) ||
        (h.endsWith("*") && path.startsWith(h.slice(0, h.length - 1)))
    ),
    path
  ];

  const hint = {};

  for (const p of pathsToConsult) {
    const h = hints[p];
    if (h !== undefined) {
      for (const [k, v] of Object.entries(h)) {
        hint[k] = v;
      }
    }
  }

  return hint;
}

export const SHORT_DELETE_HINT_REGEX = /^-([\.\w]+)/;
export const DELETE_HINT_REGEX = /^--delete--\s*(.*)/;
export const OVERWRITE_HINT_REGEX = /^--overwrite--\s*(.*)/;
export const LIKE_HINT_REGEX = /^--like--\s*(.*)/;
