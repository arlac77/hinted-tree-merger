import test from "ava";
import { hintFreeValue } from "../src/util.mjs";

function hfv(t, a, r) {
  t.deepEqual(hintFreeValue(a), r);
}

hfv.title = (providedTitle = "", a, r) => `remove ${providedTitle} ${a}`.trim();

test(hfv, "--delete-- a", "a");
test(hfv, "-a", "a");
test(hfv, "a", "a");
