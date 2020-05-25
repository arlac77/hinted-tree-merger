import test from "ava";

import { unionVersion } from "../src/versions.mjs";

function uvt(t, a, b, c) {
  t.is(unionVersion(a, b), c);
}

uvt.title = (providedTitle = "", a, b) => `union version ${providedTitle} ${a} ${b}`.trim();

test(uvt, 1.2, 1.2, '1.2');
