/**
 * Iterates over all members
 * @param {any} value
 * @param {any[]} path
 */
export function* walk(value, path = [], parents = []) {
  yield {
    value,
    path,
    parents
  };

  if (value === null) {
    return;
  }

  parents = [...parents, value];

  if (Array.isArray(value)) {
    let i = 0;
    for (const o of value) {
      yield* walk(o, [...path, i++], parents);
    }

    return;
  }

  if (typeof value === "object") {
    for (const key of Object.keys(value)) {
      yield* walk(value[key], [...path, key], parents);
    }
  }
}
