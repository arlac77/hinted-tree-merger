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
  removeHintedValues,
  indexFor
} from "./util.mjs";

import { hintFor } from "./hint.mjs";

export { isEqual, isScalar, isEmpty, isToBeRemoved };

function appendPath(path, suffix, separator="") {
  return path === undefined || path.length === 0 ? suffix : path + separator + suffix;
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
  a = asArray(a);
  b = asArray(b);

  const h = hintFor(hints, path);

  if (h.key) {
    const key = h.key;
    const aa = [...a, ...b].reduce((a, c) => {
      const k = c[key];
      const p = a.get(k);
      if (p !== undefined) {
        c = merge(p, c, appendPath(path, `[]`), actions, hints);
      }

      a.set(k, c);

      return a;
    }, new Map());

    if (h.sort) {
      return [...aa.values()].sort(h.sort);
    }

    return [...aa.values()];
  }

  let i = 0;
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
        const ii = indexFor(b, i, a);
        a.splice(ii, 0, s);
        actions({ add: s, path: appendPath(path, `[${ii}]`) });
      }
    }
    i++;
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

  if (Array.isArray(a)) {
    return mergeArrays(a, b, path, actions, hints);
  }

  if(b === undefined) {
    b = {};
  }

  const r = {};

  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const p = appendPath(path,key,".");
    const h = hintFor(hints, p);
    const merger = h instanceof Function ? h : h.merger ? h.merger : merge;

    if (b[key] === "--delete--") {
      const v = a[key];
      if (v !== undefined) {
        actions({ remove: v, path: p });
      }
    } else {
      const m = merger(a[key], b[key], p, actions, hints);

      if (h && h.removeEmpty && isEmpty(m)) {
      } else {
        r[key] = m;
      }
    }
  }

  const h = hintFor(hints, path);

  if (h.removeEmpty && Object.keys(r).length === 0) {
    return undefined;
  }
  return r;
}
