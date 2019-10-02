/**
 * construct hint for a given path
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

  return {
    ...Object.keys(hints)
      .filter(h => h[0] === "*" && path.endsWith(h.substring(1)))
      .reduce(
        (a, c) => {
          return { ...a, ...hints[c] };
        },
        { ...hints["*"] }
      ),
    ...hints[path]
  };
}
