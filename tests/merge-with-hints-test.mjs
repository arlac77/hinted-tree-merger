import test from "ava";
import { merge } from "../src/merger.mjs";
import { mergeVersions } from "../src/versions.mjs";

function mt(t, a, b, r, hints, actions) {
  let myActions = [];
  t.deepEqual(merge(a, b, undefined, x => myActions.push(x), hints), r);
  if (actions !== undefined) {
    t.log(myActions);
    t.deepEqual(actions, myActions);
  }
}

mt.title = (providedTitle = "merge", a, b) =>
  `${providedTitle} ${a} ${b}`.trim();

test(
  mt,
  { version: ["1.0.0", "2.0"] },
  { version: ["1.0.1"] },
  { version: ["1.0.0", "1.0.1", "2.0"] },
  { version: mergeVersions },
  [{ add: "1.0.1", path: "version" }]
);

test("object remove key", mt, { a: 1 }, { a: "--delete--" }, {}, undefined, [
  { remove: 1, path: "a" }
]);
