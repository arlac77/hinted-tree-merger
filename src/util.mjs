export function difference(a, b) {
  return new Set([...a].filter(x => !b.has(x)));
}

export function isEqual(a, b) {
  if (a !== undefined && b === undefined) {
    return false;
  }

  if (Array.isArray(a)) {
    if (a.length !== b.length) {
      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
  }

  if (typeof a === "object") {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (b[key] === "--delete--" && a[key] !== undefined) {
        return false;
      }

      if (!isEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  return a === b;
}



const scalarTypes = new Set(["symbol","undefined","string", "number", "bigint", "boolean"]);

export function isScalar(a) {
  
  return scalarTypes.has(typeof a) || a instanceof String || a instanceof Number || a === null;
}
