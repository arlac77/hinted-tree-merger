import test from "ava";
import { merge } from "../src/merger.mjs";


function macro(t, a, b, r) {
  t.deepEqual(merge(a,b),r);
}

macro.title = (providedTitle = "merge", a, b) => `${providedTitle} ${a} ${b}`.trim();

test(macro, 1, 2, 2);
test(macro, 1, undefined, 1);
//test(macro, undefined, 2, 2);

test(macro, "a", "b", "b");
//test(macro, "a", undefined, "a");

//test(macro, undefined, undefined, undefined);
