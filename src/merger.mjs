export * from "./versions.mjs";
export * from "./string-expressions.mjs";
import {
  isEqual,
  isScalar,
  isEmpty,
  isToBeRemoved,
  asArray,
  nullAction,
  removeHintedValues,
  indexFor,
  hasDeleteHint,
  sortObjectsByKeys,
  compareWithDefinedOrder
} from "./util.mjs";

import { hintFor } from "./hint.mjs";

export {
  isEqual,
  isScalar,
  isEmpty,
  isToBeRemoved,
  compareWithDefinedOrder,
  sortObjectsByKeys
};

function appendPath(path, suffix, separator = "") {
  return path === undefined || path.length === 0
    ? suffix
    : path + separator + suffix;
}

/**
 *
 * @param {Array} a
 * @param {Array} b
 * @param {string} path
 * @param {Function} actions
 * @param {Object} hints
 */
export function mergeArrays(a, b, path, actions = nullAction, hints) {
  a = asArray(a);
  b = asArray(b);

  const h = hintFor(hints, path);

  if (h.key) {
    const keys = asArray(h.key);
    const key = keys[0];

    const mf = (a, c) => {
      const k = keys.map(k => c[k]).join(":");
      a.set(k, merge(a.get(k), c, appendPath(path, `[]`), actions, hints));
      return a;
    };

    const aa = [...b.reduce(mf, a.reduce(mf, new Map())).values()];

    return aa.sort(
      h.compare
        ? h.compare
        : // reorder after b order
          (x, y) =>
            b.findIndex(e => isEqual(e[key], x[key])) -
            b.findIndex(e => isEqual(e[key], y[key]))
    );
  }

  let i = 0;
  for (const s of b) {
    if (
      !hasDeleteHint(s, value => {
        const i = a.indexOf(value);
        if (i >= 0) {
          a.splice(i, 1);
          actions({ remove: value, path: appendPath(path, `[${i}]`) }, h);
          return true;
        }
        return true;
      })
    ) {
      if (a === undefined) {
        a = [];
      }

      if (!a.find(x => isEqual(x, s))) {
        const ii = indexFor(b, i, a);
        a.splice(ii, 0, s);
        actions({ add: s, path: appendPath(path, `[${ii}]`) }, h);
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
      actions({ add: b, path }, hintFor(hints, path));
      return b;
    }
    return a;
  }

  if (Array.isArray(a)) {
    return mergeArrays(a, b, path, actions, hints);
  }

  if (b === undefined) {
    b = {};
  }

  const r = {};

  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const p = appendPath(path, key, ".");
    const h = hintFor(hints, p);
    const av = a[key];

    if (h.overwrite === false && !isEmpty(av)) {
      r[key] = av;
      continue;
    }

    const bv = b[key];

    if (hasDeleteHint(bv, av)) {
      if (av !== undefined) {
        actions({ remove: av, path: p }, h);
      }
    } else {
      const mf = h.merge ? h.merge : merge;
      const m = mf(av, bv, p, actions, hints);

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

  if (h.compare) {
    return sortObjectsByKeys(r, h.compare);
  }

  return r;
}
