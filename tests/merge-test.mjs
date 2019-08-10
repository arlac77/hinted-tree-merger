import test from "ava";
import { merge } from "../src/merger.mjs";


function macro(t, a, b, r) {
  t.deepEqual(merge(a,b),r);
}

macro.title = (providedTitle = "merge", a, b) => `${providedTitle} ${a} ${b}`.trim();

macro( 1, 2, 2);
macro( 1, undefined, 1);
macro( undefined, 2, 2);

macro( "a", "b", "b");
macro( "a", undefined, "a");

macro( undefined, undefined, undefined);
