import { walk } from "./walker.mjs";
import {
  mergeVersions,
  mergeVersionsSmallest,
  mergeVersionsLargest,
  mergeVersionsPreferNumeric
} from "./versions.mjs";
import { mergeExpressions } from "./string-expressions.mjs";
import { mergeSkip } from "./merger.mjs";
import { toRegexp } from "./util.mjs";

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
        parents[parents.length - 1].orderBy = value.map(v => toRegexp(v));
        break;
    }
  }

  return hints;
}

