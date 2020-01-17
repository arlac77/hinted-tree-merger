import test from "ava";

import { compareVersion } from "../src/versions.mjs";

function cv(t, a, b, c) {
  t.is(compareVersion(a, b), c);
}

cv.title = (providedTitle = "", a, b) =>
  `equal ${providedTitle} ${a} ${b}`.trim();

test(cv, "1", "2", -1);
test(cv, "2", "1", 1);
test(cv, 11, 12, -1);
test(cv, 1.0, 3, -1);
test(cv, 1.0, "4", -1);
test(cv, "1.0.1", "1.0.2", -1);

test(cv, "1.0.1", "1.0.1", 0);
test(cv, "1.0.1", "^1.0.1", -1);
test(cv, "1.0.1", "~1.0.1", -1);
test(cv, "~1.0.1", "~1.0.1", 0);
test(cv, "~1.0.1", "^1.0.1", 1);
test(cv, "^1.0.1", "~1.0.1", -1);

test(cv, "^1.0.0", "2.0.0", -1);
test(cv, "~1.0.0", "2.0.0", -1);
test(cv, "2.0.0", "~1.0.0", 1);

test(cv, ">=1.0.0", ">=1.0.0", 0);
test(cv, "=1.0.0", "=1.0.0", 0);
test(cv, "<=1.0.0", "<=1.0.0", 0);

test(cv, ">=1.0.0", ">=1.0.1", -1);
test(cv, ">=1.0.1", ">=1.0.0", 1);

test(cv, ">=1.0.0", ">=1.1.0", -1);
test(cv, ">=1.1.0", ">=1.0.0", 1);

test(cv, ">=1.0.0", ">=2.0.0", -1);
test(cv, ">=2.0.0", ">=1.0.0", 1);



test(cv, "1", "git+https://github.com/arlac77/light-server.git", -1);
test(cv, "1", "arlac77/lightserver", -1);
test(cv, "1.2.3", "arlac77/lightserver.git", -1);
test(cv, "1.2.3", "arlac77/light-server.git", -1);
test(cv, "arlac77/lightserver.git", "arlac77/lightserver.git", 0);

test(cv, "1.0.0-beta.5", "1.0.0-beta.6", -1);
test(cv, "1.0.0-beta.6", "1.0.0-beta.5", 1);
test(cv, "1.0.0-beta", "1.0.0-beta", 0);
test(cv, "1.0.0-alpha", "1.0.0-beta", -1);
test(cv, "1.0.1-beta", "1.0.1-alpha", 1);
test(cv, "1.0.2-beta", "1.0.2-rc", -1);
test(cv, "1.0.0-rc", "1.0.0-beta", 1);
test(cv, "1.0.0-beta.8", "1.0.0-rc.1", -1);
test(cv, "1.0.0-rc.1", "1.0.0-beta.8", 1);

test("sort versions", t => {
  t.deepEqual(
    ["2.0", "1.0", "1.1.0", "1.0-alpha.2", "0.9", "1.0-alpha.1"].sort(
      compareVersion
    ),
    ["0.9", "1.0-alpha.1", "1.0-alpha.2", "1.0", "1.1.0", "2.0"]
  );
});
