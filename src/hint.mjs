export function hintFor(hints, path) {
  if (hints === undefined) {
    return {};
  }

  const h = hints[path];
  if (h !== undefined) {
    return h;
  }

/*
  for (const p of Object.keys(hints)) {
      
    if (path.match(new RegExp(p))) {
      return hints[p];
    }
  }
*/
  return {};
}
