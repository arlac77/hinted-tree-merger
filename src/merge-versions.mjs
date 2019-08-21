import { difference } from './util.mjs';

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
