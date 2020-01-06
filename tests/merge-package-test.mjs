import test from "ava";
import {
  merge,
  mergeVersionsLargest,
  mergeExpressions,
  compare
} from "../src/merger.mjs";

const packageKeyOrder = [
  "name",
  "version",
  "private",
  "publishConfig",
  "files",
  "sideEffects",
  "type",
  "main",
  "umd:main",
  "jsdelivr",
  "unpkg",
  "module",
  "source",
  "jsnext:main",
  "browser",
  "svelte",
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

const dependecyEntryHints = {
  merge: mergeVersionsLargest,
  compare
};

const dependecyHints = {
  removeEmpty: true
};

const packageHints = {
  devDependencies: dependecyHints,
  "devDependencies.*": dependecyEntryHints,
  dependencies: dependecyHints,
  "dependencies.*": { ...dependecyEntryHints, type: "fix" },
  peerDependencies: dependecyHints,
  "peerDependencies.*": dependecyEntryHints,
  optionalDependencies: dependecyHints,
  "optionalDependencies.*": dependecyEntryHints,
  bundeledDependencies: dependecyHints,
  "bundeledDependencies.*": dependecyEntryHints,
  "engines.*": dependecyEntryHints,
  "scripts.*": { compare, merge: mergeExpressions },
  "*": {
    orderBy: packageKeyOrder
  }
};

function mt(t, a, b, r, actions) {
  const myActions = [];
  t.deepEqual(
    merge(
      a,
      b,
      "",
      (action, hint) => {
        if (hint) {
          for (const key of ["type", "skope"]) {
            if (hint[key]) {
              action[key] = hint[key];
            }
          }
        }
        myActions.push(action);
      },
      packageHints
    ),
    r
  );

  if (actions) {
    t.deepEqual(actions, myActions);
  }
}

mt.title = (providedTitle = "merge", a, b) =>
  `${providedTitle} ${JSON.stringify(a)} ${JSON.stringify(b)}`.trim();

test(
  mt,
  {
    files: ["a"],
    scripts: {
      preprocess: "rollup a && chmod +x bin/yy",

      cover:
        "c8 -x 'tests/**/*' --temp-directory build/tmp ava && c8 report -r lcov -o build/coverage --temp-directory build/tmp"
    },
    devDependencies: {
      ava: "^2.3.0",
      c8: "^5.0.4",
      documentation: "^12.1.2",
      esm: "^3.2.25",
      "semantic-release": "^15.13.25"
    },
    engines: {
      node: ">=8.0.0",
      npm: ">=10"
    }
  },
  {
    type: "module",
    scripts: {
      preprocess: "rollup a",
      prepare: "rollup x y && chmod +x bin/xx"
    },
    devDependencies: {
      ava: "^2.4.0",
      c8: "^5.0.3",
      documentation: "^12.1.2",
      esm: "^3.2.25",
      "semantic-release": "--delete--"
    },
    engines: {
      node: ">=12.11.1",
      npm: ">=8"
    },
    repository: {
      type: "git",
      url: "http://mock-provider.com/tragetUser/targetRepo"
    }
  },
  {
    type: "module",
    files: ["a"],
    scripts: {
      prepare: "rollup x y && chmod +x bin/xx",
      preprocess: "rollup a && chmod +x bin/yy",
      cover:
        "c8 -x 'tests/**/*' --temp-directory build/tmp ava && c8 report -r lcov -o build/coverage --temp-directory build/tmp"
    },
    devDependencies: {
      ava: "^2.4.0",
      c8: "^5.0.4",
      documentation: "^12.1.2",
      esm: "^3.2.25"
    },
    engines: {
      node: ">=12.11.1",
      npm: ">=10"
    },
    repository: {
      type: "git",
      url: "http://mock-provider.com/tragetUser/targetRepo"
    }
  },
  [
    { add: "rollup x y && chmod +x bin/xx", path: "scripts.prepare" },
    { remove: "^2.3.0", path: "devDependencies.ava" },
    { add: "^2.4.0", path: "devDependencies.ava" },
    { remove: "^15.13.25", path: "devDependencies.semantic-release" },
    { remove: ">=8.0.0", path: "engines.node" },
    { add: ">=12.11.1", path: "engines.node" },
    { add: "module", path: "type" },
    {
      add: {
        type: "git",
        url: "http://mock-provider.com/tragetUser/targetRepo"
      },
      path: "repository"
    }
  ]
);

test("remove empty dependencies", mt, { dependencies: {} }, {}, {}, []);
test(
  "remove dependencies",
  mt,
  { dependencies: { a: 1 } },
  { dependencies: { a: "--delete--" } },
  {},
  [{ path: "dependencies.a", remove: 1, type: "fix" }]
);

test(
  "remove dependencies none existing",
  mt,
  { dependencies: {} },
  { dependencies: { a: "--delete--" } },
  {},
  []
);
