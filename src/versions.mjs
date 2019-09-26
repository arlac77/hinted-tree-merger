import { difference, hintFreeValue, nullAction } from "./util.mjs";

const suffixes = { alpha: 0.3, beta: 0.2, rc: 0.1 };

/**
 * compare two versions
 *
 * @param {string|number} a
 * @param {string|number} b
 * @return {number} -1 if a < b, 0 if a == b and 1 if a > b
 */
export function compareVersion(a, b) {
  const toArray = value => {
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
  };

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

/**
 * @param {string|number} a
 * @param {string|number} b
 * @param {Action} actions
 */
export function mergeVersions(a, b, path, actions = nullAction) {
  const aVersions = new Set(a ? [...a.map(s => String(s))] : []);
  const bVersions = new Set(b ? [...b.map(s => String(s))] : []);

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

  const r = difference(aVersions, newVersions);
  if (r.size > 0) {
    [...r].sort(compareVersion).forEach(v => actions({ remove: v }));
  }

  const as = difference(newVersions, aVersions);
  if (as.size > 0) {
    [...as].sort(compareVersion).forEach(v => actions({ add: v }));
  }

  return Array.from(new Set(newVersions)).sort(compareVersion);
}

export function mergeObjectValueVersions(a, b, actions = nullAction) {
  return Object.assign(a, b);
}
