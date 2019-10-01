import test from "ava";
import { mergeArrays } from "../src/merger.mjs";

function mat(t, a, b, r, hints) {
  let myActions = [];
  t.deepEqual(mergeArrays(a, b, "", x => myActions.push(x), hints), r);
}

mat.title = (providedTitle = "merge", a, b) =>
  `${providedTitle} ${JSON.stringify(a)} ${JSON.stringify(b)}`.trim();

test(
  mat,
  [{ k: 1, v: 1 }, { k: 2, v: 2, something: 5 }],
  [{ k: 2, v: 2, other: 4 }, { k: 3, v: 3 }],
  [{ k: 1, v: 1 }, { k: 2, v: 2, something: 5, other: 4 }, { k: 3, v: 3 }],
  {
    "*": {
      key: "k",
      sort: (a, b) => (a.k > b.k ? 1 : a.k < b.k ? -1 : 0)
    }
  }
);

test(mat, [], [{ k: 2, v: ["-a", "b"] }], [{ k: 2, v: ["b"] }], {
  "*": {
    key: "k"
  }
});

test(mat, [{ k: 1 }], [{ k: 2 }, { k: 1 }], [{ k: 2 }, { k: 1 }], {
  "*": {
    key: "k"
  }
});

test(mat, ["a", "b"], ["-b"], ["a"]);

test(mat, ["a", "b"], "-b", ["a"]);
