import test from "ava";

import {
  mergeVersions,
  mergeVersionsLargest,
  mergeVersionsSmallest,
  mergeVersionsPreferNumeric
} from "hinted-tree-merger";

function mv(t, f, a, b, c, ea, hints) {
  const actions = [];
  t.deepEqual(
    f(a, b, undefined, x => actions.push(x), hints),
    c
  );
  if (ea !== undefined) {
    t.deepEqual(actions, ea, "actions");
  }
}

mv.title = (providedTitle = "", f, a, b, c) =>
  `${f.name} ${providedTitle} ${c} := ${a} << ${b}`.trim();

test(mv, mergeVersions, undefined, undefined, undefined);
test(mv, mergeVersions, "1", undefined, "1");
test(mv, mergeVersions, undefined, "1", "1", [{ add: "1", path: undefined }]);

test(
  "scalar + scalar",
  mv,
  mergeVersions,
  "1",
  "2",
  ["1", "2"],
  [{ add: "2", path: undefined }]
);
test("scalar + scalar same", mv, mergeVersions, "1", "1", "1", []);
test(
  "scalar + array",
  mv,
  mergeVersions,
  "1",
  ["2"],
  ["1", "2"],
  [{ add: "2", path: undefined }]
);
test(
  "array + scalar",
  mv,
  mergeVersions,
  ["1"],
  "2",
  ["1", "2"],
  [{ add: "2", path: undefined }]
);

test(mv, mergeVersions, [], [], [], []);
test(mv, mergeVersions, [], ["1"], ["1"], [{ add: "1", path: undefined }]);
test(mv, mergeVersions, ["1"], [], ["1"], []);
test(mv, mergeVersions, ["1"], ["1"], ["1"], []);
test(mv, mergeVersions, ["1", "2"], [1], ["1", "2"], []);

test(
  mv,
  mergeVersions,
  ["1", "2"],
  ["--delete-- 1"],
  ["2"],
  [{ remove: "1", path: undefined }]
);

test(
  mv,
  mergeVersions,
  ["1", "2"],
  [-1],
  ["2"],
  [{ remove: "1", path: undefined }]
);

test(
  mv,
  mergeVersions,
  [-1, "2"],
  ["-1"],
  ["2"],
  [{ remove: "-1", path: undefined }]
);

test(
  "keepHints",
  mv,
  mergeVersions,
  ["1", "2"],
  ["--delete-- 1"],
  ["2", "--delete-- 1"],
  [
    { remove: "1", path: undefined },
    { add: "--delete-- 1", path: undefined }
  ],
  { "*": { keepHints: true } }
);

test(
  mv,
  mergeVersions,
  ["1.1", "2"],
  ["-1", "1.2", "1.3"],
  ["1.2", "1.3", "2"],
  [
    { remove: "1.1", path: undefined },
    { add: ["1.2", "1.3"], path: undefined }
  ]
);

test(mv, mergeVersions, ">=1.2.3", undefined, ">=1.2.3");
test(mv, mergeVersions, undefined, ">=1.2.3", ">=1.2.3");
test(mv, mergeVersions, ">=1.2.3", ">=1.2.3", ">=1.2.3");

test(mv, mergeVersions, "1.2.3", "1.2.4", ["1.2.3", "1.2.4"]);


test.skip(mv, mergeVersions, ">=1.2.3", ">=1.2.4", ">=1.2.3");
test.skip(mv, mergeVersions, ">=1.2.3", ">=1.3.0", ">=1.3.0");
test.skip(mv, mergeVersions, ">=1.2.3", ">=2.0.0", ">=2.0.0");

test.skip(mv, mergeVersions, ">=1.2.3", ">=1.2.3", ">=1.2.4");
test.skip(mv, mergeVersions, ">=1.3.0", ">=1.2.3", ">=1.3.0");
test.skip(mv, mergeVersions, ">=2.0.0", ">=1.2.3", ">=2.0.0");

test(mv, mergeVersionsLargest, undefined, undefined, undefined);
test(mv, mergeVersionsLargest, "1", undefined, "1");
test(mv, mergeVersionsLargest, undefined, "1", "1", [
  { add: "1", path: undefined }
]);

test(mv, mergeVersionsLargest, ">=1.2.3", ">=1.2.4", ">=1.2.4");
test(mv, mergeVersionsLargest, "1.2.3", ">=1.2.4", ">=1.2.4");
test(mv, mergeVersionsLargest, ">=1.2.3", "1.2.4", "1.2.4");

test(mv, mergeVersionsSmallest, undefined, undefined, undefined);
test(mv, mergeVersionsSmallest, "1", undefined, "1");
test(mv, mergeVersionsSmallest, undefined, "1", "1", [
  { add: "1", path: undefined }
]);
test(mv, mergeVersionsSmallest, ["2"], ["1", "3"], "1");
test(mv, mergeVersionsSmallest, ["2.1"], [1, "3"], "1");

test(mv, mergeVersionsPreferNumeric, undefined, undefined, undefined);
test(mv, mergeVersionsPreferNumeric, "1", undefined, 1);
test(mv, mergeVersionsPreferNumeric, undefined, "1", 1, [
  { add: 1, path: undefined }
]);
test(mv, mergeVersionsPreferNumeric, ["1", "2"], [1, 3], [1, 2, 3]);
