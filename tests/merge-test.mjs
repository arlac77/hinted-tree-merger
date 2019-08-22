import test from "ava";
import { merge } from "../src/merger.mjs";


function mt(t, a, b, r) {
  t.deepEqual(merge(a,b),r);
}

mt.title = (providedTitle = "merge", a, b) => `${providedTitle} ${a} ${b}`.trim();

test(mt, 1, 2, 2);
test(mt, 1, undefined, 1);
test(mt, undefined, 2, 2);

test(mt, 11n, 22n, 22n);
test(mt, 11n, undefined, 11n);
test(mt, undefined, 22n, 22n);

test(mt, "a", "b", "b");
test(mt, "a", undefined, "a");
test(mt, undefined, "b", "b");

test(mt, true, false, false);
test(mt, false, true, true);
test(mt, true, undefined, true);
test(mt, false, undefined, false);
test(mt, undefined, false, false);
test(mt, undefined, true, true);

test(mt, undefined, undefined, undefined);
test(mt, null, null, null);
test(mt, undefined, null, null);
test(mt, null, undefined, null);
