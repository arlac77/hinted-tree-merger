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
  deepCopy,
  indexFor,
  hasDeleteHint,
  compareWithDefinedOrder,
  compare,
  sortObjectsByKeys
} from "./util.mjs";

import { hintFor } from "./hint.mjs";

export {
  isEqual,
  isScalar,
  isEmpty,
  isToBeRemoved,
  compareWithDefinedOrder,
  compare,
  sortObjectsByKeys
};

function appendPath(path, suffix, separator = "") {
  return path === undefined || path.length === 0
    ? suffix
    : path + separator + suffix;
}

/**
 * Skip merging use left side
 */
export function mergeSkip(a, b, path, actions, hints) {
  return a;
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

    const a2m = (a, c) => {
      const k = keys.map(k => c[k]).join(":");
      a.set(k, merge(a.get(k), c, appendPath(path, `[]`), actions, hints));
      return a;
    };

    const valuesByKeys = b.reduce(a2m, a.reduce(a2m, new Map()));

    return [...valuesByKeys.keys()]
      .sort(
        h.orderBy
          ? (a, b) => compareWithDefinedOrder(a, b, h.orderBy)
          : h.compare
      )
      .map(key => valuesByKeys.get(key));
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

  if (h.removeEmpty) {
    return a.filter((a, i) => {
      if (isEmpty(a)) {
        actions({ remove: a, path: appendPath(path, `[${i}]`) }, h);
        return false;
      }
      return true;
    });
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
      const hint = hintFor(hints, path);

      b = hint.keepHints ? deepCopy(b) : removeHintedValues(b);
      actions({ add: b, path }, hint);
      return b;
    }
    return a;
  }

  if (Array.isArray(a)) {
    return mergeArrays(a, b, path, actions, hints);
  }

  if (a instanceof Set) {
    return new Set(mergeArrays([...a], [...b], path, actions, hints));
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

    if (!h.keepHints && hasDeleteHint(bv, av)) {
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

  if (h.orderBy) {
    return sortObjectsByKeys(r, (a, b) =>
      compareWithDefinedOrder(a, b, h.orderBy)
    );
  } else {
    if (h.compare) {
      return sortObjectsByKeys(r, h.compare);
    }
  }

  return r;
}
