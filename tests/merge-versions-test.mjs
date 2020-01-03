import test from "ava";

import { mergeVersions } from "../src/versions.mjs";

function mv(t, a, b, c, ea) {
  const actions = [];
  t.deepEqual(mergeVersions(a, b, undefined, x => actions.push(x)), c);
  if (ea !== undefined) {
    t.deepEqual(actions, ea, "actions");
  }
}

mv.title = (providedTitle = "", a, b, c) =>
  `merge version ${providedTitle} ${c} := ${a} << ${b}`.trim();

test(mv, undefined, undefined, undefined);
test(mv, "1", undefined, "1");
test(mv, undefined, "1", "1", [{ add: "1", path: undefined }]);

test(
  "scalar + scalar",
  mv,
  "1",
  "2",
  ["1", "2"],
  [{ add: "2", path: undefined }]
);
test("scalar + scalar same", mv, "1", "1", "1", []);
test(
  "scalar + array",
  mv,
  "1",
  ["2"],
  ["1", "2"],
  [{ add: "2", path: undefined }]
);
test(
  "array + scalar",
  mv,
  ["1"],
  "2",
  ["1", "2"],
  [{ add: "2", path: undefined }]
);

test(mv, [], [], [], []);
test(mv, [], ["1"], ["1"], [{ add: "1", path: undefined }]);
test(mv, ["1"], [], ["1"], []);
test(mv, ["1"], ["1"], ["1"], []);
test(mv, ["1", "2"], [1], ["1", "2"], []);

test(
  mv,
  ["1", "2"],
  ["--delete-- 1"],
  ["2"],
  [{ remove: "1", path: undefined }]
);

test(
  mv,
  ["1.1", "2"],
  ["-1", "1.2", "1.3"],
  ["1.2", "1.3", "2"],
  [{ remove: "1.1", path: undefined }, { add: ["1.2", "1.3"], path: undefined }]
);

test(mv, ">=1.2.3", undefined, ">=1.2.3");
test(mv, undefined, ">=1.2.3", ">=1.2.3");
test(mv, ">=1.2.3", ">=1.2.3", ">=1.2.3");

test(mv, "1.2.3", "1.2.4", ["1.2.3","1.2.4" ]);
test.skip(mv, ">=1.2.3", ">=1.2.4", ">=1.2.3");

test.skip(mv, ">=1.2.3", ">=1.3.0", ">=1.3.0");
test.skip(mv, ">=1.2.3", ">=2.0.0", ">=2.0.0");

test.skip(mv, ">=1.2.3", ">=1.2.3", ">=1.2.4");
test.skip(mv, ">=1.3.0", ">=1.2.3", ">=1.3.0");
test.skip(mv, ">=2.0.0", ">=1.2.3", ">=2.0.0");
