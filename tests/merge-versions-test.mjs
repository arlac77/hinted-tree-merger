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

test(mv, [], [], [], []);
test(mv, [], ["1"], ["1"], [{ add: "1", path: undefined }]);
test(mv, ["1"], [], ["1"], []);
test(mv, ["1"], ["1"], ["1"], []);
test(mv, ["1", "2"], ["1"], ["1", "2"], []);

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
  [
    { remove: "1.1", path: undefined },
    { add: "1.2", path: undefined },
    { add: "1.3", path: undefined }
  ]
);
