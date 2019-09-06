import { difference } from './util.mjs';

/**
 * compare two versions
 * @param {string|number} a
 * @param {string|number} b
 * @return {number} -1 if a < b, 0 if a == b and 1 if a > b
 */
export function compareVersion(a, b) {
  const toArray = value => {
    value = String(value);

    /** url means highest version */
    if(value.match(/^[\w\-\+]+:/)) {
      return [99999];
    }

    value = value.replace(/^[\^\~]/,'');

    const slots = value.split(/\./).map(x => parseInt(x, 10));
    const m = value.match(/\-(\w+)\.?(.*)/);

    if (m) {
      let e = m ? slots.pop() : 0;
      const last = slots.pop();
      const suffixes = { alpha: 0.3, beta: 0.2, rc: 0.1 };
      return [...slots, last - suffixes[m[1]], e];
    }

    return slots;
  };

  const aa = toArray(a);
  const bb = toArray(b);

  //console.log(`${aa} <> ${bb}`);

  for (const i in aa) {
    if (i >= bb.length) {
      break;
    }

    if (aa[i] < bb[i]) {
      return -1;
    }
    if (aa[i] > bb[i]) {
      return 1;
    }
  }

  return 0;
}


export function mergeVersions(a, b, path = [], messages = []) {
  const aVersions = new Set(a ? [...a.map(s => String(s))] : []);
  const bVersions = new Set(b ? [...b.map(s => String(s))] : []);

  const versions = new Set([...aVersions, ...bVersions]);
  const newVersions = new Set(versions);

  versions.forEach(v => {
    if (v.startsWith("-")) {
      const d = v.replace(/^\-\s*/, "");

      versions.forEach(v => {
        const x = v.replace(/^\-\s*/, "");
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

  const r = difference(aVersions, bVersions);
  if (r.size > 0) {
    messages.push(
      `chore(travis): remove node versions ${Array.from(new Set(r)).sort()}`
    );
  }

  const as = difference(bVersions, aVersions);
  if (as.size > 0) {
    messages.push(
      `chore(travis): add node versions ${Array.from(new Set(as)).sort()}`
    );
  }

  if (newVersions.size > 0) {
    return Array.from(new Set(newVersions))
      .sort()
      .map(s => (String(parseFloat(s)) == s ? parseFloat(s) : s));
  }

  return [];
}
