import { hintFreeValue, nullAction, isScalar } from "./util.mjs";

const suffixes = { alpha: 0.3, beta: 0.2, rc: 0.1 };

function toArray(value) {
  value = String(value);

  let incrementIndex = -1;

  /** url means highest version */
  if (value.match(/^[\w\-\+]+:/)) {
    return [99999];
  }

  switch (value[0]) {
    case "~":
      value = value.substring(1);
      incrementIndex = 1;
      break;
    case "^":
      value = value.substring(1);
      incrementIndex = 2;
      break;
  }

  const slots = value.split(/\./).map(p => {
    const w = parseInt(p, 10);
    if (isNaN(w)) {
      return 99999;
    }
    return w;
  });

  const m = value.match(/\-(\w+)\.?(.*)/);

  if (m) {
    let e = m ? slots.pop() : 0;
    const last = slots.pop();
    return [...slots, last - suffixes[m[1]], e];
  }

  if (incrementIndex >= 0) {
    slots[incrementIndex] = slots[incrementIndex] + 1;
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
  const uaa = toArray(a);
  const ubb = toArray(b);

  for (const i in uaa) {
    if (i >= ubb.length) {
      break;
    }

    if (uaa[i] < ubb[i]) {
      return -1;
    }
    if (uaa[i] > ubb[i]) {
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
 * @param {string|number} a
 * @param {string|number} b
 * @param {string} path
 * @param {Action} actions
 * @param {Function} filter
 */
export function mergeVersionsWithFilter(a, b, path, actions = nullAction, filter) {
  if (b === undefined) {
    return a;
  }
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
          newVersions.delete(v);
        }
      });
    }
  });

  const res = filter(Array.from(new Set(newVersions)).sort(compareVersion));
  const nv = toSet(res);

  const added = new Set();
  const removed = new Set();

  nv.forEach(x => {
    if (!aVersions.has(toNumber(x)) && !aVersions.has(toStr(x))) {
      added.add(x);
    }
  });

  aVersions.forEach(x => {
    if (!nv.has(toNumber(x)) && !nv.has(toStr(x))) {
      removed.add(x);
    }
  });

  function pa(slot, value) {
    value = [...value];

    if (value.length > 0) {
      if (value.length === 1) {
        actions({ [slot]: value[0], path });
      } else {
        actions({ [slot]: value.sort(compareVersion), path });
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
 * 
 * @param {any} a 
 * @param {any} b 
 * @param {string} path location in the tree
 * @param actions 
 */
export function mergeVersions(a, b, path, actions) {
  return mergeVersionsWithFilter(a, b, path, actions, result =>
    keepScalar(a, result)
  );
}

export function mergeVersionsLargest(a, b, path, actions) {
  return mergeVersionsWithFilter(
    a,
    b,
    path,
    actions,
    result => result[result.length - 1]
  );
}

export function mergeVersionsSmallest(a, b, path, actions) {
  return mergeVersionsWithFilter(a, b, path, actions, result => result[0]);
}

function toNumber(s) {
  const f = parseFloat(s);
  return String(f) == s ? f : s;
}

function toStr(s) {
  return s instanceof String ? s : String(s);
}

/**
 * Same as mergeVersions but merge result are numbers if possible
 * @param a
 * @param b
 * @param path
 * @param actions
 */
export function mergeVersionsPreferNumeric(a, b, path, actions) {
  return mergeVersionsWithFilter(a, b, path, actions, result =>
    keepScalar(a, result.map(x => toNumber(x)))
  );
}
