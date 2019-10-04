import test from "ava";
import { merge } from "../src/merger.mjs";
import { mergeVersionsLargest } from "../src/versions.mjs";

const dependecyHints = { merge: mergeVersionsLargest };
const packageHints = {
  "devDependencies.*": dependecyHints,
  "dependencies.*": dependecyHints,
  "peerDependencies.*": dependecyHints,
  "optionalDependencies.*": dependecyHints,
  "engines.*": dependecyHints
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
      node: ">=12.11.1"
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
    { add: "module", path: "type" }
  ]
);
