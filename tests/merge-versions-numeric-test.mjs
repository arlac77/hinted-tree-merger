import test from "ava";

import { mergeVersionsPreferNumeric } from "../src/versions.mjs";

function mvpn(t, a, b, c, ea) {
  const actions = [];
  t.deepEqual(
    mergeVersionsPreferNumeric(a, b, undefined, x => actions.push(x)),
    c
  );
  if (ea !== undefined) {
    t.deepEqual(actions, ea, "actions");
  }
}

mvpn.title = (providedTitle = "", a, b, c) =>
  `merge version numeric ${providedTitle} ${c} := ${a} << ${b}`.trim();

test(mvpn, ["1", "2"], [1], [1, 2], []);

test(
    mvpn,
    ["1.1", "2"],
    ["-1", "1.2", "1.3"],
    [1.2, 1.3, 2],
    [
      { remove: "1.1", path: undefined },
      { add: "1.2", path: undefined },
      { add: "1.3", path: undefined }
    ]
  );
  