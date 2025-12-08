import { walk } from "./walker.mjs";
import {
  mergeVersions,
  mergeVersionsSmallest,
  mergeVersionsLargest,
  mergeVersionsPreferNumeric
} from "./versions.mjs";
import { mergeExpressions } from "./string-expressions.mjs";
import { mergeSkip } from "./merger.mjs";

const mergeFunctions = [
  mergeVersions,
  mergeVersionsSmallest,
  mergeVersionsLargest,
  mergeVersionsPreferNumeric,
  mergeSkip,
  mergeExpressions
];

export function reanimateHints(hints) {
  for (const { value, path, parents } of walk(hints)) {
    switch (path[path.length - 1]) {
      case "merge":
        for (const f of mergeFunctions) {
          if (f.name === value) {
            parents[parents.length - 1].merge = f;
            break;
          }
        }
        break;
      case "orderBy":
        parents[parents.length - 1].orderBy = value.map(v => {
          if (typeof v === "string" && v[0] === "/" && v.match(/\/[img]?$/)) {
            const m = v.match(/\/([a-z]*)$/)
            const inner = v.substring(1,v.length - m[0].length)
            return new RegExp(inner,m[1]);
          }
          return v;
        });
        break;
    }
  }

  return hints;
}
