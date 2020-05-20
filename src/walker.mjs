
/**
 * Iterates over all members
 * @param {any} value
 * @param {any[]} path
 */
export function* walk(value, path = []) {
  yield {
    value,
    path
  };

  if (Array.isArray(value)) {
    let i = 0;
    for (const o of value) {
      yield* walk(o, [...path, i++]);
    }

    return;
  }

  if (typeof value === "object") {
    for (const key of Object.keys(value)) {
      yield* walk(value[key], [...path, key]);
    }
  }
}
