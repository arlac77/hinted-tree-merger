export {
  compareVersion,
  mergeVersions,
  mergeObjectValueVersions
} from "./versions.mjs";
import { isEqual, isScalar, isToBeRemoved, asArray } from "./util.mjs";

export { isEqual, isScalar, isToBeRemoved };

export function mergeArrays(a, b, path, actions = [], hints = {}) {
  if (a === undefined) {
  } else {
    a = asArray(a);
  }

  if (b === undefined) {
    return a;
  }

  b = asArray(b);

  for (const s of b) {
    if (s[0] === "-") {
      if (a !== undefined) {
        const t = s.substring(1);
        const i = a.indexOf(t);
        if (i >= 0) {
          a.splice(i, 1);
          actions.push({ remove: t, path: [...path, i] });
        }
      }
    } else {
      if (a === undefined) {
        a = [];
      }

      if (!a.find(x => isEqual(x, s))) {
        a.push(s);
        actions.push({ add: s, path: [...path, a.length - 1] });
      }
    }
  }

  return a;
}

/**
 * merge to val
 * @param {any} a
 * @param {any} b
 * @param {any} hints
 * @return {any} merged value
 */
export function merge(a, b, path = [], actions, hints) {
  if (isScalar(a)) {
    if (b !== undefined) {
      return b;
    }
    return a;
    /*
    const x = toBeDeleted(a, b);
    if (x.delete) {
      return undefined;
    }
    return x.keepOriginal ? a : b;
    */
  }

  if (Array.isArray(a)) {
    return mergeArrays(a, b, path, actions, hints);
  }

  return a;
}

const slots = {
  "branches.only": mergeArrays,
  "notifications.email": mergeArrays,
  "jobs.include.stage": mergeArrays
};

export function _merge(a, b, path = [], messages = []) {
  const location = path.join(".");

  //console.log(location, typeof a, typeof b);

  if (path.length > 5) {
    console.log(location, a, b);
    return b;
  }

  if (slots[location] !== undefined) {
    return slots[location](a, b, path, messages);
  }

  if (a === undefined) {
    if (Array.isArray(b)) {
      return mergeArrays(a, b, path, messages);
    }
    if (isScalar(b)) {
      messages.push(`chore(travis): ${location}=${b}`);
      return b;
    }
  }

  if (b === undefined || b === null) {
    return a;
  }

  //console.log(location,a,typeof a, b, typeof b);

  if (Array.isArray(a)) {
    if (Array.isArray(b) && location !== "jobs.include") {
      return mergeArrays(a, b, path, messages);
    }

    return a;
  }

  const r = {};

  if (a === undefined) {
    a = {};
  }
  if (b === undefined) {
    b = {};
  }

  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (b[key] !== "--delete--") {
      const v = (slots[key] ? slots[key] : merge)(
        a[key],
        b[key],
        [...path, key],
        messages
      );

      if (v !== undefined) {
        if (Array.isArray(v) && v.length === 0) {
        } else {
          r[key] = v;
        }
      }
    }
  }

  return Object.keys(r).length === 0 ? undefined : r;
}
