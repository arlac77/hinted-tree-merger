import test from "ava";
import { merge } from "../src/merger.mjs";

function mt(t, a, b, r, actions) {
  let myActions = [];
  t.deepEqual(merge(a, b, [], myActions), r);
  if (actions !== undefined) {
    t.deepEqual(actions, myActions);
  }
}

mt.title = (providedTitle = "merge", a, b) =>
  `${providedTitle} ${a} ${b}`.trim();

test(mt, 1, 2, 2, [{ add: 2, path: "" }]);
test(mt, 1, undefined, 1, []);
test(mt, undefined, 2, 2, [{ add: 2, path: "" }]);

test(mt, 11n, 22n, 22n, [{ add: 22n, path: "" }]);
test(mt, 11n, undefined, 11n, []);
test(mt, undefined, 22n, 22n, [{ add: 22n, path: "" }]);

test(mt, "a", "b", "b", [{ add: "b", path: "" }]);
test(mt, "a", undefined, "a");
test(mt, undefined, "b", "b", [{ add: "b", path: "" }]);

test(mt, true, false, false, [{ add: false, path: "" }]);
test(mt, false, true, true, [{ add: true, path: "" }]);
test(mt, true, undefined, true);
test(mt, false, undefined, false);
test(mt, undefined, false, false, [{ add: false, path: "" }]);
test(mt, undefined, true, true, [{ add: true, path: "" }]);

test(mt, undefined, undefined, undefined, []);
test(mt, null, null, null, []);
test(mt, undefined, null, null, [{ add: null, path: "" }]);
test(mt, null, undefined, null, []);

test(mt, [], undefined, [], []);
test(mt, undefined, [], [], [{ add: [], path: "" }]);
test(mt, [], [], [], []);

test(mt, [1], [1], [1], []);
test(mt, [1], [3], [1, 3], [{ add: 3, path: "1" }]);
test(mt, [1], [[4]], [1, [4]], [{ add: [4], path: "1" }]);

test(mt, {}, {}, {}, []);
test(mt, {}, undefined, {}, []);
test(mt, undefined, {}, {}, [{ add: {}, path: "" }]);
test("object both sides", mt, { a: 1 }, { b: 2 }, { a: 1, b: 2 }, [
  { add: 2, path: "b" }
]);

test("object both sides same key", mt, { a: 1 }, { a: 2 }, { a: 2 }, [
  { add: 2, path: "a" }
]);