import test from "ava";
import { isToBeRemoved } from "../src/util.mjs";

function rm(t, a, b, r) {
  t.deepEqual(isToBeRemoved(a, b), r);
}

rm.title = (providedTitle = "", a, b) =>
  `remove ${providedTitle} ${a} ${b}`.trim();

test(rm, "a", "--delete-- a", { removeOriginal: true, keepOriginal: false });
test(rm, "a", "--delete-- b", { removeOriginal: false, keepOriginal: true });
test(rm, "a", "a", { removeOriginal: false, keepOriginal: true });
