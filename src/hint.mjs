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
      .filter(h => {
        return (
          (h[0] === "*" && path.endsWith(h.slice(1))) ||
          (h.endsWith("*") && path.startsWith(h.slice(0, h.length - 1)))
        );
      })
      .reduce(
        (a, c) => {
          return { ...a, ...hints[c] };
        },
        { ...hints["*"] }
      ),
    ...hints[path]
  };
}
