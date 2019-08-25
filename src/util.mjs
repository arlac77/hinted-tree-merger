export function difference(a, b) {
  return new Set([...a].filter(x => !b.has(x)));
}

/**
 * should value be removed
 * @param {string} value
 * @param {string} fromTemplate
 * @return {number} true if fromTemplate tells is to delete value
 */
export function isToBeRemoved(value, fromTemplate) {
  if (fromTemplate === undefined) {
    return { removeOriginal: false, keepOriginal: true };
  }

  if (typeof fromTemplate === "string") {
    const m = fromTemplate.match(/--delete--\s*(.*)/);
    if (m) {
      const flag = m[1] === value;
      return { removeOriginal: flag, keepOriginal: !flag };
    }
  }

  return { removeOriginal: false, keepOriginal: true };
}

export function isEqual(a, b, hints) {
  if (a !== undefined && b === undefined) {
    return false;
  }

  if (isScalar(a)) {
    const { removeOriginal } = isToBeRemoved(a, b);

    if (removeOriginal) {
      return undefined === b;
    }

    return a === b;
  }

  if (Array.isArray(a)) {
    if (a.length === b.length) {
      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i], hints)) {
          return false;
        }
      }
      return true;
    }

    return false;
  }

  if (typeof a === "object") {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      /*
      if (b[key] === "--delete--" && a[key] !== undefined) {
        return false;
      }
*/

      if (!isEqual(a[key], b[key], hints)) {
        return false;
      }
    }

    return true;
  }

  return true;
}

const scalarTypes = new Set([
  "symbol",
  "undefined",
  "string",
  "number",
  "bigint",
  "boolean"
]);

export function isScalar(a) {
  return (
    scalarTypes.has(typeof a) ||
    a instanceof String ||
    a instanceof Number ||
    a === null
  );
}
