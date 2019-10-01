import test from "ava";
import { mergeArrays } from "../src/merger.mjs";

function mat(t, a, b, r, hints) {
  let myActions = [];
  t.deepEqual(mergeArrays(a, b, "", x => myActions.push(x), hints), r);
}

mat.title = (providedTitle = "merge", a, b) =>
  `${providedTitle} ${JSON.stringify(a)} ${JSON.stringify(b)}`.trim();

test(mat,
  [{ key: 1, value: 1 }, { key: 2, value: 2, something: 5 }],
  [{ key: 2, value: 2, other: 4 }, { key: 3, value: 3 }],
  [
    { key: 1, value: 1 },
    { key: 2, value: 2, something: 5, other: 4 },
    { key: 3, value: 3 }
  ],  {
    "*": {
      key: "key",
      sort: (a, b) => (a.key > b.key ? 1 : a.key < b.key ? -1 : 0)
    }
  }
);

test(mat,
  ["a","b"],
  ["-b"],
  ["a"]
);

test(mat,
  ["a","b"],
  "-b",
  ["a"]
);
