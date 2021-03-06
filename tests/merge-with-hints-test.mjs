import test from "ava";
import {
  merge,
  mergeVersions,
  mergeVersionsPreferNumeric
} from "hinted-tree-merger";

function mt(t, a, b, r, hints, actions) {
  let myActions = [];
  t.deepEqual(
    merge(a, b, "", x => myActions.push(x), hints),
    r
  );
  if (actions !== undefined) {
    t.deepEqual(actions, myActions);
  }
}

mt.title = (providedTitle = "merge", a, b) =>
  `${providedTitle} ${JSON.stringify(a)} ${b}`.trim();

test(mt, {}, { a: "--delete--", b: { c: "--delete--" } }, { b: {} }, {}, [
  { add: {}, path: "b" }
]);

test(
  "do not overwrite",
  mt,
  { a: 1 },
  { a: 2 },
  { a: 1 },
  {
    "*": { overwrite: false }
  },
  []
);

test(
  "do not overwrite deep",
  mt,
  { a: { b1: 1 } },
  { a: { b2: 2 } },
  { a: { b1: 1, b2: 2 } },
  {
    "*": { overwrite: false }
  },
  [{ add: 2, path: "a.b2" }]
);

test(
  "remove",
  mt,
  { a: 1 },
  {},
  {},
  {
    a: { remove: true }
  },
  []
);

test(
  "into empty without hints",
  mt,
  undefined,
  { version: ["-1.0", "2.0"] },
  { version: ["2.0"] },
  { version: { merge: mergeVersions } },
  [
    {
      add: {
        version: ["2.0"]
      },
      path: ""
    }
  ]
);

test.skip(
  "into empty without hints 2",
  mt,
  undefined,
  { matrix: { "node-version": [-15, "15.1.0"] } },
  { matrix: { "node-version": "15.1.0" } },
  {
    "*.node-version": {
      merge: mergeVersionsPreferNumeric
    }
  },
  [
    {
      add: "15.1.0",
      path: "matrix.node-version"
    }
  ]
);

test(
  mt,
  { version: ["1.0.0", "2.0"] },
  { version: ["1.0.1", "-1.0.0"] },
  { version: ["1.0.1", "2.0"] },
  { version: { merge: mergeVersions } },
  [
    { remove: "1.0.0", path: "version" },
    { add: "1.0.1", path: "version" }
  ]
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

test(
  "object remove key several -> remove empty",
  mt,
  { a: "value a", b: "value b" },
  { a: "--delete-- value a", b: "--delete--" },
  undefined,
  { "": { removeEmpty: true } },
  [
    { remove: "value a", path: "a" },
    { remove: "value b", path: "b" }
  ]
);

test(
  "object remove missing key",
  mt,
  {},
  { a: "--delete--" },
  {},
  undefined,
  []
);

test(
  "object remove missing key with value",
  mt,
  {},
  { a: "--delete-- npm" },
  {},
  undefined,
  []
);

test(
  "object remove missing key2",
  mt,
  { a: {} },
  { a: ["--delete--"] },
  { a: {} },
  undefined,
  []
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

test(
  "remove key",
  mt,
  {
    "{{nginx.config_dir}}/${name}.conf": "pacman/nginx.conf",
    "/etc/nginx/config.d/${name}.conf": "pacman/nginx.conf"
  },
  {
    "{{nginx.config_dir}}/${name}.conf": "pacman/nginx.conf",
    "/etc/nginx/config.d/${name}.conf": "--delete--"
  },
  {
    "{{nginx.config_dir}}/${name}.conf": "pacman/nginx.conf"
  },
  "",
  [
    {
      path: "/etc/nginx/config.d/${name}.conf",
      remove: "pacman/nginx.conf"
    }
  ]
);

test.skip(
  "remove from value hint",
  mt,
  {
    steps: [
      { name: 'Cache node modules' },
      { name: 'Coveralls Parallel' }
    ]
  },
  {
    steps: [
      { name: '--delete-- Cache node modules', a: 1 }
    ]
  },
  {
    steps: [
      { name: 'Coveralls Parallel' }
    ]
  },
  {
    "*.steps": {
      "key": "id|name|uses|run"
    }
  }
  ,
  []
);