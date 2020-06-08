import test from "ava";
import { mergeArrays } from "hinted-tree-merger";

function mat(t, a, b, r, hints, expectedActions) {
  const myActions = [];
  t.deepEqual(
    mergeArrays(a, b, "", x => myActions.push(x), hints),
    r
  );

  if(expectedActions) {
    t.deepEqual(myActions, expectedActions, "actions");
  }
}

mat.title = (providedTitle = "merge", a, b) =>
  `${providedTitle} ${JSON.stringify(a)} ${JSON.stringify(b)}`.trim();

test(
  mat,
  [
    { k: 1, v: 1 },
    { k: 2, v: 2, something: 5 }
  ],
  [
    { k: 2, v: 2, other: 4 },
    { k: 3, v: 3 }
  ],
  [
    { k: 1, v: 1 },
    { k: 2, v: 2, something: 5, other: 4 },
    { k: 3, v: 3 }
  ],
  {
    "*": {
      key: "k",
      compare: (a, b) => (a.k > b.k ? 1 : a.k < b.k ? -1 : 0)
    }
  }
);

test(
  mat,
  [{ o: 1 }, { k: "a", o: 2 }, { o: 3 }],
  [{ k: "a", o: 2.1 }],
  [{ o: 1 }, { k: "a", o: 2.1 }, { o: 3 }],
  {
    "*": {
      key: ["k"]
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

test(
  mat,
  [{ k: "a" }, { k: "c", v1: 1 }],
  [{ k: "b" }, { k: "c", v2: 2 }],
  [{ k: "a" }, { k: "c", v1: 1, v2: 2 }, { k: "b" }],
  { "*": { key: "k" } }
);

test(
  "orderBy",
  mat,
  [{ k: "a" }, { k: "c" }],
  [{ k: "b" }],
  [{ k: "c" }, { k: "b" }, { k: "a" }],
  { "*": { key: "k", orderBy: ["c", "b", "a"] } }
);

test(mat, undefined, ["a"], ["a"]);
test(mat, undefined, ["-a"], []);
test(mat, undefined, [undefined], [undefined]);
//test(mat, undefined, undefined, undefined);

test(mat, ["a", "b"], ["-b"], ["a"]);

test(mat, ["a", "b"], "-b", ["a"]);
test(mat, ["a", "b"], "--delete-- b", ["a"]);
test(mat, ["a", "b"], "--delete--b", ["a"]);
test(mat, ["a", "b"], "--delete--c", ["a", "b"]);

test(mat, ["a", "", null, {}, [], [1]], ["b"], ["a", [1], "b"], {
  "*": { removeEmpty: true }
});
