import test from "ava";
import { merge, compareWithDefinedOrder, mergeVersionsLargest } from "../src/merger.mjs";

const packageKeyOrder = [
  "name",
  "version",
  "type",
  "private",
  "publishConfig",
  "main",
  "browser",
  "module",
  "svelte",
  "unpkg",
  "description",
  "keywords",
  "author",
  "maintainers",
  "contributors",
  "license",
  "sustainability",
  "bin",
  "scripts",
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
  "bundledDependencies",
  "engines",
  "os",
  "cpu",
  "arch",
  "repository",
  "directories",
  "files",
  "man",
  "bugs",
  "homepage",
  "config",
  "systemd",
  "pacman",
  "release",
  "ava",
  "nyc",
  "xo",
  "template"
];

const dependecyHints = {
  merge: mergeVersionsLargest,
  compare: (a, b) => a.localeCompare(b)
};

const packageHints = {
  "devDependencies.*": dependecyHints,
  "dependencies.*": dependecyHints,
  "peerDependencies.*": dependecyHints,
  "optionalDependencies.*": dependecyHints,
  "bundeledDependencies.*": dependecyHints,
  "engines.*": dependecyHints,
  "scripts.*": {},
  "*": {
    compare: (a,b) => compareWithDefinedOrder(a,b, packageKeyOrder)
  }
};

function mt(t, a, b, r, actions) {
  let myActions = [];
  t.deepEqual(merge(a, b, "", x => myActions.push(x), packageHints), r);

  if (actions) {
    t.deepEqual(actions, myActions);
  }
}

mt.title = (providedTitle = "merge", a, b) =>
  `${providedTitle} ${JSON.stringify(a)} ${JSON.stringify(b)}`.trim();

test(
  mt,
  {
    devDependencies: {
      ava: "^2.3.0",
      c8: "^5.0.4",
      documentation: "^12.1.2",
      esm: "^3.2.25",
      "semantic-release": "^15.13.25"
    },
    engines: {
      node: ">=8.0.0"
    }
  },
  {
    type: "module",
    devDependencies: {
      ava: "^2.4.0",
      c8: "^5.0.3",
      documentation: "^12.1.2",
      esm: "^3.2.25",
      "semantic-release": "--delete--"
    },
    engines: {
      node: ">=12.11.1"
    }
  },
  {
    type: "module",
    devDependencies: {
      ava: "^2.4.0",
      c8: "^5.0.4",
      documentation: "^12.1.2",
      esm: "^3.2.25"
    },
    engines: {
      node: ">=12.11.1"
    }
  },
  [
    { remove: "^2.3.0", path: "devDependencies.ava" },
    { add: "^2.4.0", path: "devDependencies.ava" },
    { remove: "^15.13.25", path: "devDependencies.semantic-release" },
    { remove: ">=8.0.0", path: "engines.node" },
    { add: ">=12.11.1", path: "engines.node" },
    { add: "module", path: "type" }
  ]
);
