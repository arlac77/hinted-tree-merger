import test from "ava";
import { isEqual } from "../src/util.mjs";

function eq(t, a, b) {
  t.true(isEqual(a, b));
}

eq.title = (providedTitle = "", a, b) =>
  `equal ${providedTitle} ${a} ${b}`.trim();

function neq(t, a, b) {
  t.false(isEqual(a, b));
}

neq.title = (providedTitle = "", a, b) =>
  `not equal ${providedTitle} ${a} ${b}`.trim();

test(eq, null, null);
test(eq, undefined, undefined);
test(eq, 1, 1);
test(eq, "a", "a");
test(eq, 123n, 123n);
test(eq, true, true);
test(eq, [], []);
test(eq, [1, 2], [1, 2]);
test("object", eq, { a: 1 }, { a: 1 });
test(eq, { a: [1] }, { a: [1] });
test(eq, new Set(), new Set());
test(eq, new Map(), new Map());

//test(eq, undefined, "--delete-- a");

test(neq, 1, 2);
test(neq, 1, "b");
test(neq, 1, undefined);
test(neq, 123n, 124n);
test(neq, 123n, undefined);
test("array", neq, [1], [2]);
test("array", neq, [1], [1, 2]);
test("array", neq, [1], undefined);
test(neq, { a: 1 }, { a: 2 });
test(neq, { a: 1 }, undefined);
test("object", neq, { a: 1 }, { a: 1, b: 0 });
test("object 2", neq, { a: 1, b: 0 }, { a: 1 });

test.skip("isEqual with hints", t => {
  t.true(isEqual(["a"], ["a", "--delete-- b"]));
});
