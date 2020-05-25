import test from "ava";

import { decomposeVersion } from "../src/versions.mjs";

function dvt(t, a, b) {
  if (!b.upper) b.upper = b.lower;
  t.deepEqual(decomposeVersion(a), b);
}

dvt.title = (providedTitle = "", a, b) => `equal ${providedTitle} ${a}`.trim();

test(dvt, 1.0, { lower: [1] });
test(dvt, 1.2, { lower: [1,2] });
test(dvt, "1.2.3", { lower: [1, 2, 3] });
test(dvt, "1.2.3-1", { lower: [1, 2, 3, 1] });

test(dvt, "1.2.3-beta", { lower: [1, 2, 3 - 0.2] });
test(dvt, "1.2.3-beta.5", { lower: [1, 2, 3 - 0.2, 5] });
test(dvt, "1.2.3-rc", { lower: [1, 2, 3 - 0.1] });

test(dvt, "=1.2.3", { lower: [1, 2, 3] });
test(dvt, "= 1.2.3", { lower: [1, 2, 3] });
test(dvt, ">= 1.2.3", { lower: [1, 2, 3], upper: [Number.MAX_SAFE_INTEGER] });
test(dvt, "<= 1.2.3", { lower: [0], upper:[1, 2, 3] });

test(dvt, "^1.2.3", {
  lower: [1, 2, 3],
  upper: [1, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
});

test(dvt, "~1.2.3", {
  lower: [1, 2, 3],
  upper: [1, 2, Number.MAX_SAFE_INTEGER]
});

test(dvt, "https://github.com/somwhere", {
  lower: [Number.MAX_SAFE_INTEGER]
});
