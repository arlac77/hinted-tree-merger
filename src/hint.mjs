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

  /*
  return {
    ...hints["*"],
    ...Object.fromEntries(
      Object.entries(hints).filter(
        ([key, hint]) =>
          (key[0] === "*" && path.endsWith(key.substring(1))) ||
          (key.endsWith("*") &&
            path.startsWith(key.substring(0, key.length - 1)))
      )
    )
  };
*/
  return {
    ...Object.keys(hints)
      .filter(h => {
        return (
          (h[0] === "*" && path.endsWith(h.substring(1))) ||
          (h.endsWith("*") && path.startsWith(h.substring(0, h.length - 1)))
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
