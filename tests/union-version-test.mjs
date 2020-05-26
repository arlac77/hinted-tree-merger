import test from "ava";

import { unionVersion } from "../src/versions.mjs";

function uvt(t, a, b, c) {
  t.is(unionVersion(a, b), c);
}

uvt.title = (providedTitle = "", a, b) =>
  `union version ${providedTitle} ${a} ${b}`.trim();

test(uvt, 1.2, 1.2, "1.2");
test(uvt, "~1.2.3", "~1.2.3", "~1.2.3");
test(uvt, "^1.2.3", "^1.2.3", "^1.2.3");
test.skip(uvt, "^1.2.3", "~1.2.3", "^1.2.3");
test(uvt, ">=1.2.3", ">=1.2.3", ">=1.2.3");
test(uvt, ">=1.2.3", ">=1.2.4", ">=1.2.4");
test(uvt, ">=1.2.3", ">=2.0.0", ">=2.0.0");
