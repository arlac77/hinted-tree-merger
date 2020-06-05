import test from "ava";

import { compareVersion } from "hinted-tree-merger";

function cvt(t, a, b, c) {
  t.is(compareVersion(a, b), c);
}

cvt.title = (providedTitle = "", a, b) =>
  `equal ${providedTitle} ${a} ${b}`.trim();

test(cvt, 1.0, 1, 0);
test(cvt, "1.0", 1, 0);

test(cvt, "1", "2", -1);
test(cvt, "2", "1", 1);
test(cvt, 11, 12, -1);

test(cvt, 1.0, 3, -1);
test(cvt, 1.0, "4", -1);
test(cvt, "1.0.1", "1.0.2", -1);

test(cvt, "1.0.1", "1.0.1", 0);
test(cvt, "1.0.1", "^1.0.1", -1);
test(cvt, "1.0.1", "~1.0.1", -1);
test(cvt, "~1.0.1", "~1.0.1", 0);
test(cvt, "~1.0.1", "^1.0.1", -1);
test(cvt, "^1.0.1", "~1.0.1", 1);

test(cvt, "^1.0.0", "2.0.0", -1);
test(cvt, "~1.0.0", "2.0.0", -1);
test(cvt, "2.0.0", "~1.0.0", 1);

test(cvt, "=1.0.0", "=1.0.0", 0);
test(cvt, "=2.0.0", "=1.0.0", 1);
test(cvt, "=1.0.0", "=2.0.0", -1);

test(cvt, ">=1.0.0", ">=1.0.0", 0);
test(cvt, "<=1.0.0", "<=1.0.0", 0);

test(cvt, ">=1.0.0", ">=1.0.1", -1);
test(cvt, ">=1.0.1", ">=1.0.0", 1);

test(cvt, ">=1.0.0", ">=1.1.0", -1);
test(cvt, ">=1.1.0", ">=1.0.0", 1);

test(cvt, ">=1.0.0", ">=2.0.0", -1);
test(cvt, ">=2.0.0", ">=1.0.0", 1);


test(cvt, "1", "git+https://github.com/arlac77/light-server.git", -1);
test(cvt, "1", "arlac77/lightserver", -1);
test(cvt, "1.2.3", "arlac77/lightserver.git", -1);
test(cvt, "1.2.3", "arlac77/light-server.git", -1);
test(cvt, "arlac77/lightserver.git", "arlac77/lightserver.git", 0);

test(cvt, "1.0.0-1", "1.0.0-1", 0);
test(cvt, "1.0.0-2", "1.0.0-1", 1);
test(cvt, "1.0.0-1", "1.0.0-2", -1);

test(cvt, "1.0.0-beta.5", "1.0.0-beta.6", -1);
test(cvt, "1.0.0-beta.6", "1.0.0-beta.5", 1);
test(cvt, "1.0.0-beta", "1.0.0-beta", 0);
test(cvt, "1.0.0-alpha", "1.0.0-beta", -1);
test(cvt, "1.0.1-beta", "1.0.1-alpha", 1);
test(cvt, "1.0.2-beta", "1.0.2-rc", -1);
test(cvt, "1.0.0-rc", "1.0.0-beta", 1);
test(cvt, "1.0.0-beta.8", "1.0.0-rc.1", -1);
test(cvt, "1.0.0-rc.1", "1.0.0-beta.8", 1);

test("sort versions", t => {
  t.deepEqual(
    ["2.0", "1.0", "1.1.0", "1.0-alpha.2", "0.9", "1.0-alpha.1"].sort(
      compareVersion
    ),
    ["0.9", "1.0-alpha.1", "1.0-alpha.2", "1.0", "1.1.0", "2.0"]
  );
});
