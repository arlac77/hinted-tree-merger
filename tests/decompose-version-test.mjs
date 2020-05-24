import test from "ava";

import { decomposeVersion } from "../src/versions.mjs";

function dvt(t, a, b) {
  t.deepEqual(decomposeVersion(a), b);
}

dvt.title = (providedTitle = "", a, b) => `equal ${providedTitle} ${a}`.trim();

test(dvt, 1.0, { slots: [1] });
test(dvt, "1.2.3", { slots: [1, 2, 3] });
test(dvt, "=1.2.3", { slots: [1, 2, 3] });
test(dvt, "= 1.2.3", { slots: [1, 2, 3] });
test(dvt, ">= 1.2.3", { slots: [1, 2, 3] });
test(dvt, "<= 1.2.3", { slots: [1, 2, 3] });
test(dvt, "^1.2.3", { slots: [1, 2, 4] });
test(dvt, "~1.2.3", { slots: [1, 3, 3] });
