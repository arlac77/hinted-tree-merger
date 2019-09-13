export { compareVersion, mergeVersions, mergeObjectValueVersions } from "./versions.mjs";
import { isEqual, isScalar, isToBeRemoved } from "./util.mjs";

export { isEqual, isScalar, isToBeRemoved };

function pathMessage(path, direction = "to") {
  return path.length > 0 ? ` ${direction} ` + path.join(".") : "";
}

export function mergeScripts(a, b, path, messages) {
  return mergeArrays(a, b, path, messages);
}

export function mergeArrays(a, b, path = [], messages = []) {
  if (a === undefined) {
  } else {
    a = asArray(a);
  }

  if (b === undefined) {
    return a;
  }

  b = asArray(b);

  for (const s of b) {
    if (s[0] === "-") {
      if (a !== undefined) {
        const t = s.substring(1);
        const i = a.indexOf(t);
        if (i >= 0) {
          a.splice(i, 1);
          messages.push(
            `chore(travis): remove ${t}${pathMessage(path, "from")}`
          );
        }
      }
    } else {
      if (a === undefined) {
        a = [];
      }

      if (!a.find(x => isEqual(x, s))) {
        a.push(s);
        messages.push(`chore(travis): add ${s}${pathMessage(path)}`);
      }
    }
  }

  return a;
}

const slots = {
  before_install: mergeScripts,
  install: mergeScripts,
  before_script: mergeScripts,
  script: mergeScripts,
  before_cache: mergeScripts,
  after_success: mergeScripts,
  after_failure: mergeScripts,
  before_deploy: mergeScripts,
  deploy: mergeScripts,
  after_deploy: mergeScripts,
  after_script: mergeScripts,
  "branches.only": mergeArrays,
  "notifications.email": mergeArrays,
  "jobs.include.stage": mergeArrays
};

/**
 * merge to val
 * @param {any} a
 * @param {any} b
 * @param {any} hints
 * @return {any} merged value
 */
export function merge(a, b, hints, cb = () => {}) {
  if (isScalar(a)) {
    if (b !== undefined) {
      return b;
    }
    return a;
    /*
    const x = toBeDeleted(a, b);
    if (x.delete) {
      return undefined;
    }
    return x.keepOriginal ? a : b;
    */
  }

  return a;
}

export function _merge(a, b, path = [], messages = []) {
  const location = path.join(".");

  //console.log(location, typeof a, typeof b);

  if (path.length > 5) {
    console.log(location, a, b);
    return b;
  }

  if (slots[location] !== undefined) {
    return slots[location](a, b, path, messages);
  }

  if (a === undefined) {
    if (Array.isArray(b)) {
      return mergeArrays(a, b, path, messages);
    }
    if (isScalar(b)) {
      messages.push(`chore(travis): ${location}=${b}`);
      return b;
    }
  }

  if (b === undefined || b === null) {
    return a;
  }

  //console.log(location,a,typeof a, b, typeof b);

  if (Array.isArray(a)) {
    if (Array.isArray(b) && location !== "jobs.include") {
      return mergeArrays(a, b, path, messages);
    }

    return a;
  }

  const r = {};

  if (a === undefined) {
    a = {};
  }
  if (b === undefined) {
    b = {};
  }

  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (b[key] !== "--delete--") {
      const v = (slots[key] ? slots[key] : merge)(
        a[key],
        b[key],
        [...path, key],
        messages
      );

      if (v !== undefined) {
        if (Array.isArray(v) && v.length === 0) {
        } else {
          r[key] = v;
        }
      }
    }
  }

  return Object.keys(r).length === 0 ? undefined : r;
}
