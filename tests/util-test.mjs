import test from "ava";
import { isScalar } from "../src/util.mjs";

test("isScalar", t => {
  t.true(isScalar(1));
  t.true(isScalar("a"));
  t.true(isScalar(false));
  t.true(isScalar(null));
  t.true(isScalar(undefined));
  t.false(isScalar({}));
  t.false(isScalar([]));
  t.false(isScalar(new Date()));
  t.false(isScalar(new Set()));
  t.false(isScalar(new Map()));
 });

