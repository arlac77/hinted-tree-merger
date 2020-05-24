import { hintFreeValue, nullAction, isScalar } from "./util.mjs";
import { hintFor } from "./hint.mjs";

const suffixes = { alpha: 0.3, beta: 0.2, rc: 0.1 };

function decomposeVersion(value) {
  value = String(value);

  let incrementIndex = -1;

  /** url means highest version */
  if (value.match(/^[\w\-\+]+:/)) {
    return [Number.MAX_SAFE_INTEGER];
  }

  const p = value.match(/^([<=>~^]+)?([^-]*)(\-(\w+)\.?(.*))?$/);

  let suffixWeight;
  let extraSlot;

  if (p) {
    switch (p[1]) {
      case "~":
        incrementIndex = 1;
        break;
      case "^":
        incrementIndex = 2;
        break;
      /*
      case "=":
        break;
      case ">=":
        break;
      case "<=":
        break;*/
    }
    value = p[2];

    suffixWeight = suffixes[p[4]];
    if (!suffixWeight) {
      extraSlot = parseInt(p[4], 10);
    }
  }

  const slots = value.split(/\./).map((p, i) => {
    const w = parseInt(p, 10);
    return isNaN(w)
      ? Number.MAX_SAFE_INTEGER
      : i === incrementIndex
      ? w + 1
      : w;
  });

  if (suffixWeight) {
    slots.push(slots.pop() - suffixWeight, parseInt(p[5], 10));
  }

  if (extraSlot) {
    slots.push(extraSlot);
  }

  return slots;
}

/**
 * compare two versions
 *
 * @param {string|number} a
 * @param {string|number} b
 * @return {number} -1 if a < b, 0 if a == b and 1 if a > b
 */
export function compareVersion(a, b) {
  const da = decomposeVersion(a);
  const db = decomposeVersion(b);

  for (const i in da) {
    if (i >= db.length) {
      break;
    }

    if (da[i] < db[i]) {
      return -1;
    }
    if (da[i] > db[i]) {
      return 1;
    }
  }

  return 0;
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
