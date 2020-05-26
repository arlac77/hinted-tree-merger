import { hintFreeValue, nullAction, isScalar } from "./util.mjs";
import { hintFor } from "./hint.mjs";

const suffixes = { alpha: 0.3, beta: 0.2, rc: 0.1 };

function upperLimit(values, index, hasSuffix) {
  return values.map((w, i) =>
    i > index ? (hasSuffix ? 0 : Number.MAX_SAFE_INTEGER) : w
  );
}

export function decomposeVersion(value) {
  value = String(value);

  /** url means highest version */
  if (value.match(/^[\w\-\+]+:/)) {
    return {
      lower: [Number.MAX_SAFE_INTEGER],
      upper: [Number.MAX_SAFE_INTEGER]
    };
  }

  const p = value.match(/^([<=>~^]+)?([^-]*)(\-(\w+)\.?(.*))?$/);

  let lower, upper;

  if (p) {
    value = p[2];

    lower = value.split(/\./).map(p => {
      const w = parseInt(p, 10);
      return isNaN(w) ? Number.MAX_SAFE_INTEGER : w;
    });

    const suffixWeight = suffixes[p[4]];
    if (suffixWeight) {
      lower.push(lower.pop() - suffixWeight);
      const extra = parseInt(p[5], 10);
      if (extra) {
        lower.push(extra);
      }
    } else {
      const extra = parseInt(p[4], 10);
      if (extra) {
        lower.push(extra);
      }
    }

    switch (p[1]) {
      case "~":
        upper = upperLimit(lower, 1, suffixWeight);
        break;
      case "^":
        upper = upperLimit(lower, 0, suffixWeight);
        break;

      case ">=":
        upper = [Number.MAX_SAFE_INTEGER];
        break;

      case "<=":
        upper = lower;
        lower = [0];
        break;

      default:
        upper = lower;
    }
  }

  return { lower, upper };
}

export function composeVersion(decomposed) {
  let slots = decomposed.lower;

  slots = slots.map(s => {
    if (Number.isInteger(s)) {
      return s;
    }

    for (const v in suffixes) {
      const x = s.toFixed(0) - s;

      //console.log(v, suffixes[v], x, suffixes[v] > x - 0.001, suffixes[v] < x + 0.001);

      if (suffixes[v] > x - 0.001 && suffixes[v] < x + 0.001) {
        return `${s.toFixed(0)}-${v}`;
      }
    }

    return s;
  });

  const r = slots.slice(0, 3).join(".");
  return slots.length > 3 ? `${r}-${slots[3]}` : r;
}

function cmp(a, b) {
  for (const i in a) {
    if (i >= a.length) {
      break;
    }

    if (a[i] < b[i]) {
      return -1;
    }
    if (a[i] > b[i]) {
      return 1;
    }
  }

  return 0;
}

/**
 * Compare two versions
 *
 * @param {string|number} a
 * @param {string|number} b
 * @return {number} -1 if a < b, 0 if a == b and 1 if a > b
 */
export function compareVersion(a, b) {
  const da = decomposeVersion(a);
  const db = decomposeVersion(b);

  //console.log(a, da);
  //console.log(b, db);

  const r = cmp(da.lower, db.lower);
  return r === 0 ? cmp(da.upper, db.upper) : r;
}

/**
 * Forms union of two versions
 * @param {string|number} a
 * @param {string|number} b
 * @return {string|number}
 */
export function unionVersion(a, b) {
  const da = decomposeVersion(a);
  const db = decomposeVersion(b);

  return composeVersion({
    lower: cmp(da.lower, db.lower) < 0 ? da.lower : db.lower,
    upper: cmp(da.upper, db.upper) > 0 ? da.upper : db.upper
  });
}

export function toBeRemoved(value) {
  if (typeof value === "string") {
    const m = value.match(/^-(-delete--)?\s*(.*)/);
    if (m) {
      return true;
    }
  }

  return false;
}

function toSet(a) {
  if (isScalar(a)) {
    return a === undefined ? new Set() : new Set([a]);
  }
  return new Set([...a.map(s => String(s))]);
}

/**
 * maps version values (to number)
 * @typedef {Function} VersionMapper
 */

/**
 * merge and filter two sets of version (expressions)
 * @param {string|string[]|number|number[]} a
 * @param {string|string[]|number|number[]} b
 * @param {string} path location in the tree
 * @param {Function} actions cb to notify about the actual selection
 * @param {Object} hints
 * @param {VersionMapper} filter
 * @return {string|string[]|number|number[]} merged set of version expressions
 */
export function mergeVersionsWithFilter(
  a,
  b,
  path,
  actions = nullAction,
  hints,
  filter
) {
  if (b === undefined) {
    return a;
  }
  const hint = hintFor(hints, path);

  const aVersions = toSet(a);
  const bVersions = toSet(b);

  const versions = new Set([...aVersions, ...bVersions]);
  const newVersions = new Set(versions);

  versions.forEach(v => {
    if (toBeRemoved(v)) {
      const d = hintFreeValue(v);
      versions.forEach(v => {
        const x = hintFreeValue(v);
        if (compareVersion(d, x) === 0 || x != v) {
          if (bVersions.has(x)) {
            return;
          }

          newVersions.delete(x);
          if (!hint.keepHints) {
            newVersions.delete(v);
          }
        }
      });
    }
  });

  const res = filter([...new Set(newVersions)].sort(compareVersion));
  const nv = toSet(res);

  const added = new Set();
  const removed = new Set();

  nv.forEach(x => {
    if (!aVersions.has(toNumber(x)) && !aVersions.has(String(x))) {
      added.add(x);
    }
  });

  aVersions.forEach(x => {
    if (!nv.has(toNumber(x)) && !nv.has(String(x))) {
      removed.add(x);
    }
  });

  function pa(slot, value) {
    value = [...value];

    if (value.length > 0) {
      if (value.length === 1) {
        actions({ [slot]: value[0], path }, hint);
      } else {
        actions({ [slot]: value.sort(compareVersion), path }, hint);
      }
    }
  }

  pa("remove", removed);
  pa("add", added);

  return res;
}

function keepScalar(a, r) {
  return r.length === 1 && isScalar(a) ? r[0] : r;
}

/**
 * merge two sets of version (expressions)
 * @param {string|string[]|number|number[]} a
 * @param {string|string[]|number|number[]} b
 * @param {string} path location in the tree
 * @param {Function} actions cb to notify about the actual selection
 * @param {Object} hints
 * @return {string|string[]|number|number[]} merged set of version expressions
 */
export function mergeVersions(a, b, path, actions, hints) {
  return mergeVersionsWithFilter(a, b, path, actions, hints, result =>
    keepScalar(a, result)
  );
}

export function mergeVersionsLargest(a, b, path, actions, hints) {
  return mergeVersionsWithFilter(
    a,
    b,
    path,
    actions,
    hints,
    result => result[result.length - 1]
  );
}

export function mergeVersionsSmallest(a, b, path, actions, hints) {
  return mergeVersionsWithFilter(
    a,
    b,
    path,
    actions,
    hints,
    result => result[0]
  );
}

function toNumber(s) {
  const f = parseFloat(s);
  return String(f) == s ? f : s;
}

/**
 * Same as mergeVersions but merge result are converted into
 * numbers if possible
 * @param {string|string[]|number|number[]} a
 * @param {string|string[]|number|number[]} b
 * @param {string} path location in the tree
 * @param {Function} actions cb to notify about the actual selection
 * @param {Object} hints
 * @return {string|string[]|number|number[]} merged set of version expressions
 */
export function mergeVersionsPreferNumeric(a, b, path, actions, hints) {
  return mergeVersionsWithFilter(a, b, path, actions, hints, result =>
    keepScalar(
      a,
      result.map(x => toNumber(x))
    )
  );
}
