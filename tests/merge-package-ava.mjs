import test from "ava";
import {
  merge,
  mergeVersionsLargest,
  mergeExpressions,
  mergeSkip,
  compare
} from "hinted-tree-merger";

const sortedKeys = [
  "name",
  "version",
  "private",
  "publishConfig",
  "files",
  "sideEffects",
  "type",
  "main",
  "exports",
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
  "native",
  "template"
];

const REMOVE_HINT = { compare, removeEmpty: true };
const DEPENDENCY_HINT = { compare, merge: mergeVersionsLargest };

const packageHints = {
  "*": { scope: "package", type: "chore" },
  "": { orderBy: sortedKeys },
  type: { type: "fix" },
  keywords: { removeEmpty: true, compare, type: "docs" },
  repository: { compare },
  files: { compare, scope: "files", removeEmpty: true },
  export: REMOVE_HINT,
  bin: REMOVE_HINT,
  "bin.*": { removeEmpty: true, scope: "bin" },
  scripts: {
    orderBy: [
      "preinstall",
      "install",
      "postinstall",
      "prepack",
      "pack",
      "postpack",
      "prepare",
      "prepublishOnly",
      "prepublish",
      "publish",
      "postpublish",
      "prerestart",
      "restart",
      "postrestart",
      "preshrinkwrap",
      "shrinkwrap",
      "postshrinkwrap",
      "prestart",
      "start",
      "poststart",
      "prestop",
      "stop",
      "poststop",
      "pretest",
      "test",
      "posttest",
      "cover",
      "preuninstall",
      "uninstall",
      "postuninstall",
      "preversion",
      "version",
      "postversion",
      "docs",
      "lint",
      "package"
    ]
  },
  "scripts.*": {
    merge: mergeExpressions,
    removeEmpty: true,
    scope: "scripts"
  },
  dependencies: REMOVE_HINT,
  "dependencies.*": { ...DEPENDENCY_HINT, type: "fix" },
  devDependencies: REMOVE_HINT,
  "devDependencies.*": DEPENDENCY_HINT,
  peerDependencies: REMOVE_HINT,
  "peerDependencies.*": DEPENDENCY_HINT,
  optionalDependencies: REMOVE_HINT,
  "optionalDependencies.*": DEPENDENCY_HINT,
  bundeledDependencies: REMOVE_HINT,
  "bundeledDependencies.*": DEPENDENCY_HINT,
  "engines.*": {
    compare,
    merge: mergeVersionsLargest,
    removeEmpty: true,
    type: "fix",
    scope: "engines"
  },
  release: REMOVE_HINT,
  config: REMOVE_HINT,
  "config.*": {
    compare,
    overwrite: false
  },
  "pacman.*": {
    overwrite: false
  },
  "pacman.depends.*": {
    merge: mergeVersionsLargest,
    compare,
    type: "fix",
    scope: "pacman"
  },
  "template.usedBy": { merge: mergeSkip },
  "template.repository": { remove: true }
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
    },
    template: {
      a: 1
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
    },
    template: {
      b: 2
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
    },
    template: {
      a: 1,
      b: 2
    }
  },
  [
    {
      add: "rollup x y && chmod +x bin/xx",
      path: "scripts.prepare",
      type: "chore"
    },
    { remove: "^2.3.0", path: "devDependencies.ava", type: "chore" },
    { add: "^2.4.0", path: "devDependencies.ava", type: "chore" },
    {
      remove: "^15.13.25",
      path: "devDependencies.semantic-release",
      type: "chore"
    },
    { remove: ">=8.0.0", path: "engines.node", type: "fix" },
    { add: ">=12.11.1", path: "engines.node", type: "fix" },
    { add: 2, path: "template.b", type: "chore" },
    { add: "module", path: "type", type: "fix" },
    {
      add: {
        type: "git",
        url: "http://mock-provider.com/tragetUser/targetRepo"
      },
      path: "repository",
      type: "chore"
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
