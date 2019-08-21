import test from "ava";
import { isScalar } from "../src/util.mjs";

test("isScalar", t => {
  t.true(isScalar(1));
  t.true(isScalar(1n));
  t.true(isScalar("a"));
  t.true(isScalar(true));
  t.true(isScalar(false));
  t.true(isScalar(undefined));
  t.true(isScalar(null));
  t.true(isScalar(Symbol()));
  t.false(isScalar({}));
  t.false(isScalar([]));
  t.false(isScalar(new Date()));
  t.false(isScalar(new Set()));
  t.false(isScalar(new Map()));
});