import test from "ava";

import { mergeVersionsPreferNumeric } from "hinted-tree-merger";

function mvpn(t, a, b, result, ea) {
  const actions = [];
  t.deepEqual(
    mergeVersionsPreferNumeric(a, b, undefined, x => actions.push(x)),
    result
  );
  if (ea !== undefined) {
    t.log(actions);
    t.deepEqual(actions, ea, "actions");
  }
}

mvpn.title = (providedTitle = "", a, b, result) =>
  `merge version numeric ${providedTitle} ${result} := ${a} << ${b}`.trim();

test(mvpn, ["1", "2"], [1], [1, 2], []);

test(mvpn, 1, 1, 1, []);
test(mvpn, 1, 2, [1, 2], [{ add: "2", path: undefined }]);
test(mvpn, 1, [3], [1, 3], [{ add: "3", path: undefined }]);
test(mvpn, [1], 4, [1, 4], [{ add: "4", path: undefined }]);

test(
  mvpn,
  ["1.1", "2"],
  ["-1", "1.2", "1.3"],
  [1.2, 1.3, 2],
  [
    { remove: "1.1", path: undefined },
    { add: ["1.2","1.3" ], path: undefined }
  ]
);
