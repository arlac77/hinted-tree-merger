import {
  isEqual,
  isScalar,
  isEmpty,
  asArray,
  nullAction,
  removeHintedValues,
  deepCopy,
  indexFor,
  keyFor,
  hasDeleteHint,
  compareWithDefinedOrder,
  sortObjectsByKeys
} from "./util.mjs";
import { hintFor } from "./hint.mjs";


/**
 * @callback Actions
 * @param {Object} options
 * @param {Object} hints
 */


function appendPath(path, suffix, separator = "") {
  return path === undefined || path.length === 0
    ? suffix
    : path + separator + suffix;
}

/**
 * Skip merging use left side always.
 */
export function mergeSkip(a, b, path, actions, hints) {
  return a;
}

/**
 *
 * @param {Array} a
 * @param {Array} b
 * @param {string} path
 * @param {Actions} actions
 * @param {Object} hints
 */
export function mergeArrays(a, b, path, actions = nullAction, hints) {
  a = asArray(a);
  b = asArray(b);

  const h = hintFor(hints, path);

  for (let i = 0; i < b.length; i++) {
    const s = b[i];
    if (
      !hasDeleteHint(s, value => {
        if (h.keepHints) {
          return false;
        }

        const i = a.indexOf(value);
        if (i >= 0) {
          a.splice(i, 1);
          actions({ remove: value, path: appendPath(path, `[${i}]`) }, h);
        }
        return true;
      })
    ) {
      if (a === undefined) {
        a = [];
      }

      const key = keyFor(s, h);
      if (key) {
        const index = a.findIndex(o => keyFor(o, h) === key);

        if (index >= 0) {
          a[index] = merge(
            a[index],
            s,
            appendPath(path, `[${index}]`),
            actions,
            hints
          );

          continue;
        }
      }

      if (a.find(x => isEqual(x, s)) === undefined) {
        const ii = indexFor(b, i, a);

        a.splice(
          ii,
          0,
          merge(undefined, s, appendPath(path, `[${ii}]`), actions, hints)
        );
      }
    }
  }

  if (h.orderBy) {
    a = a.sort((a, b) =>
      compareWithDefinedOrder(keyFor(a, h), keyFor(b, h), h.orderBy)
    );
  } else if (h.compare) {
    a = a.sort(h.compare);
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
 * Merge to values.
 * @param {any} a
 * @param {any} b
 * @param {Actions} actions
 * @param {any} hints
 * @return {any} merged value
 */
export function merge(a, b, path, actions = nullAction, hints) {
  if (isScalar(a)) {
    if (b !== undefined && b !== null && !isEqual(a, b)) {
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

  if (b === undefined || b === null) {
    b = {};
  }

  const r = {};

  for (const key of new Set(Object.keys(a).concat(Object.keys(b)))) {
    const p = appendPath(path, key, ".");
    const h = hintFor(hints, p);
    const av = a[key];

    if (
      h.merge === undefined &&
      h.overwrite === false &&
      !isEmpty(av) &&
      isScalar(av)
    ) {
      r[key] = av;
      continue;
    }

    const bv = b[key];

    if (hasDeleteHint(bv, av)) {
      if (h.keepHints) {
        r[key] = bv;
        if (av !== undefined) {
          actions({ remove: av, path: p }, h);
        }
        actions({ add: bv, path: p }, h);
      } else {
        if (av !== undefined) {
          actions({ remove: av, path: p }, h);
        }
      }
    } else {
      const mf = h.merge || merge;
      const m = mf(av, bv, p, actions, hints);

      if (h.remove || (h.removeEmpty && isEmpty(m))) {
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
