import test from "ava";
import { isEqual } from "../src/merger.mjs";

test("isEqual", t => {
  t.true(isEqual(1, 1));
  t.true(isEqual(123n, 123n));
  t.true(isEqual(true, true));
  t.true(isEqual("a", "a"));
  t.true(isEqual([], []));
  t.false(isEqual([1], [2]));
  t.true(isEqual({ a: 1 }, { a: 1 }));
  t.false(isEqual({ a: 1 }, { a: 2 }));
  t.false(isEqual({ a: 1 }, { a: 1, b: 0 }));
  t.false(isEqual({ a: 1, b: 0 }, { a: 1 }));
  t.true(isEqual({ a: [1] }, { a: [1] }));
});

test("isEqual with hints", t => {
  t.false(isEqual("a", "--delete-- a"));
});
