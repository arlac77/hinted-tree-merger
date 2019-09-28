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
  { version: ["1.0.1", "-1.0.0"] },
  { version: ["1.0.1", "2.0"] },
  { version: mergeVersions },
  [{ remove: "1.0.0", path: "version" }, { add: "1.0.1", path: "version" }]
);

test("object remove key", mt, { a: 1 }, { a: "--delete--" }, {}, undefined, [
  { remove: 1, path: "a" }
]);

test("nothing to remove", mt, [1], ["-a"], [1], '', []);

test.skip(
  "nothing to remove 2",
  mt,
  undefined,
  {
    node_js: ["7.7.2"],
    before_script: ["npm prune", "-npm install -g codecov"]
  },
  {
    node_js: ["7.7.2"],
    before_script: ["npm prune"]
  },
  undefined,
  []
);
