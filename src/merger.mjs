export {
  compareVersion,
  mergeVersions,
  mergeObjectValueVersions
} from "./versions.mjs";
import { isEqual, isScalar, isToBeRemoved, asArray, hintFor, nullAction } from "./util.mjs";

export { isEqual, isScalar, isToBeRemoved };


/**
 * 
 * @param {Array} a 
 * @param {Array} b 
 * @param path 
 * @param actions 
 * @param hints 
 */
export function mergeArrays(a, b, path, actions = nullAction, hints = {}) {
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
          actions({ remove: t, path: [...path, i].join(".") });
        }
      }
    } else {
      if (a === undefined) {
        a = [];
      }

      if (!a.find(x => isEqual(x, s))) {
        a.push(s);
        actions({ add: s, path: [...path, a.length - 1].join(".") });
      }
    }
  }

  return a;
}

/**
 * merge to values
 * @param {any} a
 * @param {any} b
 * @param {Object[]} actions
 * @param {any} hints
 * @return {any} merged value
 */
export function merge(a, b, path = [], actions = nullAction, hints) {
  if (isScalar(a)) {
    if (b !== undefined && !isEqual(a, b)) {
      actions({ add: b, path: path.join(".") });
      return b;
    }
    return a;
  }

  if(b === undefined) {
    return a;
  }

  if (Array.isArray(a)) {
    return mergeArrays(a, b, path, actions, hints);
  }
  
  const r = {};

  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const p = [...path, key];
    const h = hintFor(hints,p);
    const merger = h !== undefined ? h : merge;

    r[key] = merger(a[key], b[key], p, actions, hints);
  }

  return r;
}
