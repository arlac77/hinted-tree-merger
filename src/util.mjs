export function nullAction() {}

export function asArray(a) {
  return Array.isArray(a) ? a : a === undefined ? [] : [a];
}

export function compare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * @param {any} value
 * @param {string|Function} expected
 * @return {string|boolean}
 */
export function hasDeleteHint(value, expected) {
  if (typeof value === "string") {
    const m = value.match(/^--delete--\s*(.*)/);
    if (m) {
      if (expected === undefined) {
        return true;
      }
      if (m[1].length === 0) {
        return true;
      }

      if (expected instanceof Function) {
        return expected(m[1]);
      }

      return m[1] == expected;
    }

    if (value[0] === "-" && expected instanceof Function) {
      return expected(value.slice(1));
    }

    if (value === `-${expected}`) {
      return expected;
    }
  }

  return false;
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

export function hintFreeValue(value) {
  if (typeof value === "string") {
    const m = value.match(/^--delete--\s*(.*)/);
    if (m) {
      return m[1];
    }
    const m2 = value.match(/^-([\.\w]+)/);
    if (m2) {
      return m2[1];
    }
  }

  return value;
}

export function removeHintedValues(object) {
  if (typeof object === "string" && object.match(/--delete--\s*(.*)/)) {
    return undefined;
  }

  if (isScalar(object)) {
    return object;
  }

  if (Array.isArray(object)) {
    return object.filter(o =>
      typeof o === "string" &&
      (o.match(/--delete--\s*(.*)/) || o.match(/^-([\.\w]+)/))
        ? false
        : true
    );
  }

  if (object instanceof Map) {
    return object;
  }

  if (object instanceof Set) {
    return object;
  }

  if (object instanceof Date) {
    return object;
  }

  const result = {};

  for (const key of Object.keys(object)) {
    const value = removeHintedValues(object[key]);
    if (!isEmpty(value)) {
      result[key] = value;
    }
  }

  return result;
}

export function deepCopy(object) {
  if (isScalar(object)) {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(o => deepCopy(o));
  }

  if (
    object instanceof Map ||
    object instanceof Set ||
    object instanceof Date
  ) {
    return object;
  }

  const result = {};

  for (const key of Object.keys(object)) {
    const value = deepCopy(object[key]);
    if (!isEmpty(value)) {
      result[key] = value;
    }
  }

  return result;
}

export function isEmpty(a) {
  if (a === undefined || a === null || a === "") {
    return true;
  }

  if (Array.isArray(a) && a.length === 0) {
    return true;
  }

  if (isScalar(a)) {
    return false;
  }

  if (a instanceof Map || a instanceof Set) {
    return a.size === 0;
  }

  if (a instanceof Date) {
    return false;
  }

  if (Object.keys(a).length === 0) {
    return true;
  }

  return false;
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
    b = removeHintedValues(b);
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
    if (a instanceof Set) {
      return (
        b instanceof Set &&
        a.size === b.size &&
        [...a].every(value => b.has(value))
      );
    }
    if (a instanceof Map) {
      if (!(b instanceof Map) || a.size !== b.size) {
        return false;
      }
      for (const [k, v] of a.entries()) {
        if (!isEqual(v, b.get(k))) {
          return false;
        }
      }

      return true;
    }

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
    a instanceof Function ||
    a === null
  );
}

/**
 * find best insertion point for b[i] in a
 * @param {any[]} b
 * @param {number} i
 * @param {any[]} a
 */
export function indexFor(b, i, a) {
  const n = b[i + 1];
  const f = a.findIndex(x => isEqual(x, n));
  return f >= 0 ? f : a.length;
}

/**
 * sort keys in source
 * @param {Object} source
 * @param compare
 * @return {Object}
 */
export function sortObjectsByKeys(source, compare) {
  const sorted = {};

  Object.keys(source)
    .sort(compare)
    .forEach(key => {
      sorted[key] = source[key];
    });

  return sorted;
}

export function compareWithDefinedOrder(a, b, definedOrder) {
  const ai = definedOrder.indexOf(a);
  const bi = definedOrder.indexOf(b);

  if (ai < 0) {
    if (bi < 0) {
      return compare(a, b);
    }
    return 0;
  } else {
    if (bi < 0) {
      return -1;
    }
  }

  return ai - bi;
}
