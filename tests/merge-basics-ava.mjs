import test from "ava";
import { merge } from "hinted-tree-merger";

function mt(t, a, b, r, actions) {
  let myActions = [];
  t.deepEqual(
    merge(a, b, undefined, x => myActions.push(x)),
    r
  );
  if (actions !== undefined) {
    t.deepEqual(actions, myActions, "actions");
  }
}

mt.title = (providedTitle = "merge", a, b) =>
  `${providedTitle} ${a instanceof Function ? a.name : a} ${
    typeof b === "bigint" ? b : JSON.stringify(b)
  }`.trim();

test("empty string", mt, "a", "", "", [{ add: "", path: undefined }]);

test(mt, 1, 2, 2, [{ add: 2, path: undefined }]);
test(mt, 1, undefined, 1, []);
test(mt, undefined, 2, 2, [{ add: 2, path: undefined }]);

test(mt, console.log, console.log, console.log, []);

function x1() {}
function x2() {}
test(mt, x1, x2, x2, [{ add: x2, path: undefined }]);

test(mt, 11n, 22n, 22n, [{ add: 22n, path: undefined }]);
test(mt, 11n, undefined, 11n, []);
test(mt, undefined, 22n, 22n, [{ add: 22n, path: undefined }]);

test(mt, "a", "b", "b", [{ add: "b", path: undefined }]);
test(mt, "a", undefined, "a");
test(mt, undefined, "b", "b", [{ add: "b", path: undefined }]);

test(mt, true, false, false, [{ add: false, path: undefined }]);
test(mt, false, true, true, [{ add: true, path: undefined }]);
test(mt, true, undefined, true);
test(mt, false, undefined, false);
test(mt, undefined, false, false, [{ add: false, path: undefined }]);
test(mt, undefined, true, true, [{ add: true, path: undefined }]);
test(mt, [true], [true], [true], []);
test(mt, [false], [false], [false], []);
test(
  mt,
  { a: true, b: false },
  { a: true, b: false },
  { a: true, b: false },
  []
);

test(mt, undefined, undefined, undefined, []);
test(mt, null, null, null, []);
test(mt, undefined, null, null, [{ add: null, path: undefined }]);
test(mt, null, undefined, null, []);

test(mt, [], undefined, [], []);
test(mt, undefined, [], [], [{ add: [], path: undefined }]);

test(mt, [], [], [], []);
test(mt, [1], [1], [1], []);
test(mt, [1], [3], [1, 3], [{ add: 3, path: "[1]" }]);
test(mt, [1], [[4]], [1, [4]], [{ add: [4], path: "[1]" }]);
test(
  "deep copy",
  mt,
  undefined,
  [{ k: 1, e: 2 }, { k: 3 }],
  [{ k: 1, e: 2 }, { k: 3 }]
);

test(mt, {}, {}, {}, []);
test(mt, {}, undefined, {}, []);
test(mt, undefined, { a: 1 }, { a: 1 }, [{ add: { a: 1 }, path: undefined }]);
test("object both sides", mt, { a: 1 }, { b: 2 }, { a: 1, b: 2 }, [
  { add: 2, path: "b" }
]);

test("object both sides same key", mt, { a: 1 }, { a: 2 }, { a: 2 }, [
  { add: 2, path: "a" }
]);

test(
  "object both sides same key function value",
  mt,
  { a: console.log },
  { a: console.warn },
  { a: console.warn },
  [{ add: console.warn, path: "a" }]
);

test("object both sides empty string", mt, {}, { a: "" }, { a: "" }, [
  { add: "", path: "a" }
]);

test("object both sides empty string", mt, undefined, { a: "" }, { a: "" }, [
  { add: { a: "" }, path: undefined }
]);

test("Set empty", mt, new Set(), new Set(), new Set(), []);
test(mt, new Set([1]), new Set([2]), new Set([1, 2]), [
  { add: 2, path: "[1]" }
]);

test(
  "Set with delete",
  mt,
  new Set(["a", "c"]),
  new Set(["-a", "b"]),
  new Set(["c", "b"]),
  [
    { remove: "a", path: "[0]" },
    { add: "b", path: "[1]" }
  ]
);

test(mt, new Set(), [], new Set(), []);
