import test from "ava";
import { merge } from "../src/merger.mjs";
import { mergeVersionsLargest } from "../src/versions.mjs";

function mt(t, a, b, r, actions) {
  let myActions = [];
  t.deepEqual(
    merge(a, b, "", x => myActions.push(x), {
      "devDependencies.*": {
        merge: mergeVersionsLargest
      }
    }),
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
    devDependencies: {
      ava: "^2.3.0",
      c8: "^5.0.4",
      documentation: "^12.1.2",
      esm: "^3.2.25",
      "semantic-release": "^15.13.25"
    }
  },
  {
    devDependencies: {
      ava: "^2.4.0",
      c8: "^5.0.3",
      documentation: "^12.1.2",
      esm: "^3.2.25",
      "semantic-release": "--delete--"
    }
  },
  {
    devDependencies: {
      ava: "^2.4.0",
      c8: "^5.0.4",
      documentation: "^12.1.2",
      esm: "^3.2.25"
    }
  },
  /*
  [
    { add: "^2.4.0", path: "devDependencies.ava" },
    { remove: "^15.13.25", path: "devDependencies.semantic-release" }
  ]*/
);
