import test from "ava";

import { decomposeVersion, composeVersion } from "../src/versions.mjs";

function dvt(t, a, b, c) {
  if (!b.upper) b.upper = b.lower;
  const decomposed = decomposeVersion(a);
  t.deepEqual(decomposed, b, `descomposed ${a}`);

  if (c !== undefined) {
    t.is(composeVersion(decomposed), c, `compose {a}`);
  }
}

dvt.title = (providedTitle = "", a, b) =>
  `decompose ${providedTitle} ${a}`.trim();

test(dvt, 1.0, { lower: [1] }, "1");
test(dvt, 1.2, { lower: [1, 2] }, "1.2");
test(dvt, "1.2.3", { lower: [1, 2, 3] }, "1.2.3");
test(dvt, "1.2.3-1", { lower: [1, 2, 3, 1] }, "1.2.3-1");

test(dvt, "1.2.3-beta", { lower: [1, 2, 3 - 0.2] }, "1.2.3-beta");
test(dvt, "1.2.3-beta.5", { lower: [1, 2, 3 - 0.2, 5] } /*, "1.2.3-beta.5"*/);
test(dvt, "1.2.3-rc", { lower: [1, 2, 3 - 0.1] }, "1.2.3-rc");
test(dvt, "3.0.0-beta.6-exportfix", { lower: [3, 0, 0 - 0.2, 6] });
test(dvt, "^3.0.0-beta.6", {
  lower: [3, 0, 0 - 0.2, 6],
  upper: [3, 0, 0, 0]
});

test(dvt, "~3.0.0-beta.6", {
  lower: [3, 0, 0 - 0.2, 6],
  upper: [3, 0, 0, 0]
});

test(dvt, "=1.2.3", { lower: [1, 2, 3] });
test(dvt, "= 1.2.3", { lower: [1, 2, 3] });
test(dvt, ">= 1.2.3", { lower: [1, 2, 3], upper: [Number.MAX_SAFE_INTEGER] }, ">=1.2.3");
test(dvt, "<= 1.2.3", { lower: [0], upper: [1, 2, 3] }, "<=1.2.3");

test(dvt, "^1.2.3", {
  lower: [1, 2, 3],
  upper: [1, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
},"^1.2.3");

test(dvt, "~1.2.3", {
  lower: [1, 2, 3],
  upper: [1, 2, Number.MAX_SAFE_INTEGER]
},"~1.2.3");

test(dvt, "https://github.com/somwhere", {
  lower: [Number.MAX_SAFE_INTEGER]
});
