export {
  compareVersion,
  mergeVersions,
  mergeVersionsPreferNumeric,
  mergeObjectValueVersions
} from "./versions.mjs";
import {
  isEqual,
  isScalar,
  isEmpty,
  isToBeRemoved,
  asArray,
  nullAction,
  removeHintedValues
} from "./util.mjs";

import {
  hintFor,
} from "./hint.mjs";

export { isEqual, isScalar, isEmpty, isToBeRemoved };

function appendPath(path, suffix) {
  return path === undefined ? suffix : path + suffix;
}

/**
 *
 * @param {Array} a
 * @param {Array} b
 * @param path
 * @param actions
 * @param hints
 */
export function mergeArrays(a, b, path, actions = nullAction, hints) {
  if (a === undefined) {
  } else {
    a = asArray(a);
  }

  if (b === undefined) {
    return a;
  }

  b = asArray(b);

  const h = hintFor(hints, path);

  if (h !== undefined && h.key) {
    const key = h.key;
    const aa = [...a, ...b].reduce((a, c) => {
      const k = c[key];
      const p = a.get(k);
      if (p !== undefined) {
        c = merge(c, p, appendPath(path, `[]`), actions, hints);
      }

      a.set(k, c);

      return a;
    }, new Map());

    if (h.sort) {
      return [...aa.values()].sort(h.sort);
    }

    return [...aa.values()];
  }

  for (const s of b) {
    if (s[0] === "-") {
      if (a !== undefined) {
        const t = s.substring(1);
        const i = a.indexOf(t);
        if (i >= 0) {
          a.splice(i, 1);
          actions({ remove: t, path: appendPath(path, `[${i}]`) });
        }
      }
    } else {
      if (a === undefined) {
        a = [];
      }

      if (!a.find(x => isEqual(x, s))) {
        a.push(s);
        actions({ add: s, path: appendPath(path, `[${a.length - 1}]`) });
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
export function merge(a, b, path, actions = nullAction, hints) {
  if (isScalar(a)) {
    if (b !== undefined && !isEqual(a, b)) {
      b = removeHintedValues(b);
      actions({ add: b, path });
      return b;
    }
    return a;
  }

  if (b === undefined) {
    return a;
  }

  if (Array.isArray(a)) {
    return mergeArrays(a, b, path, actions, hints);
  }

  const r = {};

  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const p = path === undefined ? key : path + "." + key;
    const h = hintFor(hints, p);

    if (b[key] === "--delete--" && h === undefined) {
      const v = a[key];
      if (v !== undefined) {
        actions({ remove: v, path: p });
      }
    } else {
      const merger =
        h !== undefined
          ? h instanceof Function
            ? h
            : h.merger
            ? h.merger
            : merge
          : merge;

      r[key] = merger(a[key], b[key], p, actions, hints);
    }
  }

  const h = hintFor(hints, path);
  if(h && h.removeEmpty && Object.keys(r).length === 0) { 
    return undefined; }
  return r;
}
