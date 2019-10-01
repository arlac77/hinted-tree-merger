/**
 *
 * @param {Object} hints
 * @param {string} path
 */
export function hintFor(hints, path) {
  if (hints === undefined) {
    return {};
  }

  return { ...hints["*"], ...hints[path] };
}
