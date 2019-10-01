import test from "ava";
import { merge } from "../src/merger.mjs";
import { mergeVersions } from "../src/versions.mjs";

function mt(t, a, b, r, hints, actions) {
  let myActions = [];
  t.deepEqual(merge(a, b, "", x => myActions.push(x), hints), r);
  if (actions !== undefined) {
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
  { version: { merge: mergeVersions } },
  [{ remove: "1.0.0", path: "version" }, { add: "1.0.1", path: "version" }]
);

test("object remove key", mt, { a: 1 }, { a: "--delete--" }, {}, undefined, [
  { remove: 1, path: "a" }
]);

test(
  "object remove key -> empty",
  mt,
  { a: 1 },
  { a: "--delete--" },
  undefined,
  { "": { removeEmpty: true } },
  [{ remove: 1, path: "a" }]
);

test("nothing to remove", mt, [1], ["-a"], [1], "", []);

test(
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
  [
    {
      add: { node_js: ["7.7.2"], before_script: ["npm prune"] },
      path: ""
    }
  ]
);

test(
  "array join",
  mt,
  {
    a: [
      "npm install -g --production coveralls codecov",
      "npm run cover",
      "codecov",
      "cat ./coverage/lcov.info | coveralls",
      "npm run lint",
      "npm run docs"
    ]
  },
  {
    a: [
      "-npm install -g --production coveralls codecov",
      "-cat ./coverage/lcov.info | coveralls",
      "npm install -g --production codecov",
      "npm run cover",
      "codecov",
      "npm run lint",
      "npm run docs"
    ]
  },
  {
    a: [
      "npm install -g --production codecov",
      "npm run cover",
      "codecov",
      "npm run lint",
      "npm run docs"
    ]
  },
  { a: {} },
  undefined
);
